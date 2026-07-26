# 카드 UI 렌더링 + 발행 기법

애플 글래스모피즘 승인 카드를 **브라우저에 띄우고**, 사용자가 편집·완료 토글한 것을 **되읽어 실제 스레드에 발행**하는 방법.

---

## 왜 이 방식인가 (막다른 길 2개를 피한 결과, 2026-07-25)

- ❌ **`file://` 로컬 HTML** → Claude-in-Chrome이 못 연다("Can't interact with browser-internal or unparseable URLs").
- ❌ **Artifact(claude.ai)** → 콘텐츠가 **크로스오리진 iframe**이라, 사용자가 카드에서 고친 값을 `javascript_tool`로 되읽지 못한다(발행 불가).
- ✅ **가벼운 실제 페이지에 주입**: `https://example.com`을 새 탭에 띄우고, `javascript_tool`로 `document.body/head`를 UI로 교체. 같은 오리진이라 편집 상태(`textarea.value`, `checkbox.checked`)와 `localStorage`를 자유롭게 읽는다.

> `javascript_tool`의 `text`는 **날 JS로 평가**되므로, 템플릿 리터럴(백틱)·`${}`를 자유롭게 쓸 수 있다. HTML 전체를 JSON 문자열로 이스케이프할 필요 없이, **CARDS 배열 + DOM 빌드 코드**를 그대로 주입하면 된다.

---

## 렌더 절차

1. `tabs_create_mcp` → 새 탭.
2. `navigate(newTab, "https://example.com")`.
3. `javascript_tool(newTab, <아래 스켈레톤>)` — CARDS만 그 회차 데이터로 갈아끼운다.
4. `screenshot`으로 렌더 확인.

### 주입 JS 스켈레톤 (핵심 골격)

```js
document.title='스레드 답글 발행 · @solopreneur.jm';
const CSS = `/* 글래스: .topbar(sticky, backdrop-filter blur22) / .card(rgba .06, blur16, radius22, border rgba .14)
  / .card.done(초록 글로우) / .orig(pre-wrap, 좌측 보라 바) / textarea.comment(편집) / .toggle(스위치)
  / .publish-btn(보라→시안 그라디언트) / .toast. 배경 #0b0d12 + 보라/시안 blur blob. 폰트 -apple-system,"Malgun Gothic" */`;
const CARDS = [
  {user:"...", url:"/@user/post/CODE", time:"7시간", niche:"🏢 공인중개사", app:false, /*verify:true(같은유저 최근글 다수)*/,
   original:"원글 전문(\\n 유지)", comment:"AI티 자가검증 통과한 답글"},
  // ...10개
];
document.head.innerHTML='<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
document.body.innerHTML=`<div class="topbar">…<button class="publish-btn" id="publishBtn" disabled>🚀 발행 <span id="btnCount"></span></button></div>
  <div class="wrap"><p class="lead">…</p><div id="cards"></div></div><div class="toast" id="toast"></div>`;
// 각 카드: el.dataset.user/url, el.dataset.original=comment; .orig는 textContent로(이스케이프 불필요), textarea.value=comment.
//  - textarea input → autosize + '수정됨' 표시
//  - .done-toggle change → el.classList.toggle('done') + refresh()
// completedCards() = 토글 켜진 카드. refresh() = 카운트/버튼 활성.
// publishBtn click → completedCards()의 {user,url,comment(현재 textarea 값)}을 localStorage['threads_reply_queue']에 저장 + toast(다음 단계 안내).
window.getPublishQueue=()=>JSON.parse(localStorage.getItem('threads_reply_queue')||'[]');
```

> 🚨 **버튼 문구는 "발행"이 아니라 "✅ 승인 확정"**(2026-07-26 혼선). 페이지는 Claude를 호출할 수 없어 버튼은 **대기열에 담기만** 한다. "발행"이라 써 두면 사용자가 이미 게시된 줄 알고 "왜 또 발행하래?"가 된다.
> 안내 문구도 두 단계를 분리해서 쓴다: 카드에서 **① 승인 확정** → 채팅에서 **② "발행"**.

> 이 세션의 완성본 참고: 스크래치패드 `threads-reply-cards.html`(같은 UI의 단독 HTML). 그대로 열 수는 없지만 CSS/JS 원본으로 재사용.

### 카드 필드
| 필드 | 뜻 |
|---|---|
| `user`/`url` | @아이디 / 퍼머링크(`/@user/post/CODE`) — 발행에 사용 |
| `time` | 원글 시각(신선도 참고) |
| `niche` | 🏢 공인중개사 / 🤲 발달장애 육아 / 🔧 메이커 (칩) |
| `app` | true면 "중개프로 언급" 칩(그날 1개만) |
| `verify` | true면 "발행 전 원글 확인" 칩(같은 유저 최근글 다수 → 오발행 주의) |
| `original`/`comment` | 원글 전문 / 답글 초안(편집 가능) |

---

## 발행 (사용자가 "발행"이라고 하면)

1. `javascript_tool(cardsTab, "JSON.stringify(window.getPublishQueue())")` 로 대기열 획득. (비었으면 사용자가 아직 🚀 발행을 안 누른 것 — 안내.)
2. 각 항목마다 **순차로**:
   a. `navigate(threadsTab, "https://www.threads.com"+url)`.
   b. `get_page_text` 또는 `screenshot`으로 **원글이 카드의 original과 일치하는지 확인**(특히 `verify` 항목). 다르면 스킵하고 사용자에게 알림.
   c. 답글 작성창 열기: 게시글 하단 **답글 아이콘** 클릭 또는 하단 "답글 달기" 입력창 포커스. `find`로 "답글 입력창/reply composer"를 찾는다.
   d. 댓글 입력: 작성창에 `computer` type 또는 `form_input`으로 comment 입력.
   e. **게시** 버튼 클릭(모달이면 우하단 "게시"). ⚠️ 게시는 되돌릴 수 없는 공개 동작 — **대기열에 담긴(=사용자 승인) 것만**.
   f. `screenshot`으로 발행 확인. 실패 시 다음으로.
3. 끝나면 사용자에게 **몇 개 발행/스킵** 요약. (골든타임: 이후 상대 답글이 달리면 즉답 권유 — §5.)
4. **문체 학습**(SKILL.md §2-8): 발행한 카드의 최종본을 초안(`el.dataset.original`)과 diff → `threads-post/voice-profile.md` 갱신 → `voice-profile.md`만 커밋·푸시.

> ⚠️ **모달 다이얼로그 주의**: 게시 흐름에서 예기치 않은 confirm/alert가 뜨면 후속 자동화가 멈춘다. 스레드 답글은 보통 인페이지 컴포저라 괜찮지만, 막히면 스크린샷으로 상태를 보고 진행한다.
> ⚠️ **속도**: 짧은 시간에 여러 답글을 연속 발행하면 스팸으로 보일 수 있다. 한 번에 3~8개, 사이를 두고. 하루 총량도 과하지 않게(§5 3개 링 배분).

---

## ✅ 발행 표준 기법 — 타이핑 말고 **합성 붙여넣기** (2026-07-26 확립, 이걸 먼저 쓴다)

`computer.type`은 **크롬을 재시작해도** 스레드 답글창에서 공백·따옴표·마침표·영문을 통째로 삼킨다("취소할까 어쩔까" → "취소할까어쩔까"). 아래 두 함수를 주입해 쓰면 5건 연속 무결하게 나갔다.

```js
// ① 본문 채우기 — 전체 선택 후 paste 이벤트로 덮어쓴다(delete는 불안정하니 쓰지 말 것)
window.fill = async (txt) => {
  const ce = document.querySelector('[contenteditable="true"]');
  if (!ce) return { err: 'no composer' };
  ce.focus();
  const s = window.getSelection(), r = document.createRange();
  r.selectNodeContents(ce); s.removeAllRanges(); s.addRange(r);
  await new Promise(x => setTimeout(x, 150));
  const dt = new DataTransfer(); dt.setData('text/plain', txt);
  ce.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  await new Promise(x => setTimeout(x, 900));
  return { match: ce.innerText.trim() === txt.trim(), got: ce.innerText };   // ← match:true 아니면 게시 금지
};

// ② 게시 — 좌표 클릭은 안 먹는다. 엘리먼트를 찾아 .click()
window.send = async () => {
  const ce = document.querySelector('[contenteditable="true"]');
  const cr = ce.getBoundingClientRect();
  const c = [...document.querySelectorAll('div[role="button"]')].map(b => {
    const r = b.getBoundingClientRect();
    return { b, cx: r.x + r.width/2, cy: r.y + r.height/2, w: r.width, h: r.height };
  }).filter(o => o.w >= 32 && o.w <= 44 && o.h >= 32 && o.h <= 44
             && o.cx > cr.right && o.cy > cr.top - 40 && o.cy < cr.bottom + 60);
  if (!c.length) return { err: 'no send button' };
  c[0].b.click();
  await new Promise(x => setTimeout(x, 2500));
  const cc = document.querySelector('[contenteditable="true"]');
  return { sent: !cc || cc.innerText.trim() === '' };
};
```

**주의점**
- 줄바꿈은 `\n`을 그대로 넣으면 된다. `shift+Return` 키 조작 불필요.
- **`send()`가 `no send button`이면** 둥근 ↑ 버튼이 아직 안 그려진 것 → **작성창을 실제로 한 번 클릭**(`computer.left_click`)하면 나타난다. 그 뒤 `send()` 재실행.
- `execCommand('delete')`는 내용을 못 지우고 **순서가 뒤엉킨다**(2026-07-26 실측). 반드시 위처럼 **선택 → paste 덮어쓰기**로.
- ⚠️ **좌표 환산**: 스크린샷 폭과 `window.innerWidth`가 다르다(예: 1540 vs 1784). 스크린샷에서 읽은 좌표로 `computer.left_click`할 땐 `DOM좌표 × (1540/innerWidth)`로 변환한다. 그래서 애초에 좌표보다 **DOM 탐색 + `.click()`** 이 안전하다.
- 발행 전 **원글이 맞는지 placeholder로 확인**: `"<user>님에게 답글 남기기..."` 텍스트에 대상 계정명이 들어 있다. 추천 글이 위에 섞여 첫 `data-pressable-container`가 엉뚱한 글일 수 있으니 이쪽이 확실하다.
- **무거운 글(답글 10개+ 이미지 다수)은 렌더러를 얼린다.** `Runtime.evaluate` 45초 타임아웃이 2회 연속 나면 그 글은 포기하고 사용자에게 텍스트를 넘긴다(루프 금지).

## ⚠️ 참고 — 렌더러 글리치 원인 규명 이전 기록 (2026-07-25)

스레드 답글 작성창(Lexical/contenteditable)에 `computer.type`으로 길게 칠 때, **탭 렌더러가 느려지면 띄어쓰기·따옴표·줄바꿈이 통째로 유실**된다("애 셋에…"→"애셋에…"). 눈으로만 보면 놓치기 쉽다. 그래서:

1. **발행(게시) 직전 반드시 JS로 실제 입력값을 검증한다** — 절대 스크린샷만 믿지 말 것:
   ```js
   const e=document.querySelector('[contenteditable="true"]'); e.innerText   // 띄어쓰기·\n 확인
   ```
   유실됐으면 **게시하지 말고** 지우고 재입력. (검증 덕에 이날 깨진 답글은 0건 발행.)
2. **입력창 포커스가 안 잡히면** 좌표 클릭 대신 JS로: `document.querySelector('[contenteditable="true"]').focus()` 후 `document.activeElement`로 확인. 인라인 창은 **한 번 클릭해야 contenteditable이 생성**되므로, 클릭→JS focus 순.
3. **입력창이 화면 밖이면** placeholder 요소를 `scrollIntoView({block:'center'})`로 올린 뒤 그 `getBoundingClientRect()` 중심을 클릭.
4. **탭이 계속 버벅이면**(스크린샷 타임아웃 반복) **새 탭을 만들어**(`tabs_create_mcp`) 같은 permalink로 다시 여는 게 제일 빠른 복구다. 오래 열어둔 탭일수록 잘 샌다.
5. **줄바꿈은 `shift+Return`**(엔터 단독은 인라인 창에서 전송될 수 있음). 편별로 `type`→`shift+Return`→`type`.
6. `navigator.clipboard.writeText`는 **권한 거부**(paste 우회 불가). `execCommand('insertText')`는 띄어쓰기는 보존하나 기존 텍스트 클리어가 불안정 → 신뢰도 낮음.
7. 그래도 2~3회 실패하면 **사용자에게 최종 텍스트를 넘겨 직접 붙여넣게** 한다(사람 타이핑엔 글리치 없음). 루프 돌지 말 것.

## 계정 확인 (매 세션)
발행 전 threads.com 좌측 프로필이 **solopreneur.jm** 인지 스크린샷으로 확인. 여러 크롬 프로필 함정은 SKILL.md §6.
