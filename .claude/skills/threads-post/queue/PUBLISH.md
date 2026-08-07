# 스레드 새 글 발행 절차 (검증됨 2026-08-07)

크론이 깨울 때마다 이 순서를 그대로 따른다. **답글 발행(`card-ui.md`)과는 다른 화면이다.**

## 0. 먼저 확인

1. `queue/PUBLISHED.md` 를 읽어 **이미 발행한 편인지 확인한다.** 있으면 그냥 끝낸다(중복 발행 금지).
2. `queue/<오늘날짜>.txt` 에서 해당 `[N]` 블록을 읽는다.
3. 본문에 **🔴 가 남아 있으면 발행하지 않는다.** `PUBLISHED.md` 에 `건너뜀(🔴 미확인)` 으로 남기고 끝낸다.
4. 본문이 `SKIP` 한 줄이면 건너뛴다.
5. 브라우저 확인 — `list_connected_browsers` → `select_browser` → 탭에서 `solopreneur.jm` 로그인 상태.

## 1. 작성창 열기

```js
// threads.com 홈에서
window.openComposer = async () => {
  if (document.querySelector('[role="dialog"] [contenteditable="true"]')) return 'already';
  const lbl = [...document.querySelectorAll('div,span')]
    .find(e => (e.textContent||'').trim() === '새로운 스레드' && e.children.length === 0);
  if (!lbl) return 'no trigger';
  let n = lbl;
  while (n && !(n.getAttribute && (n.getAttribute('role') === 'button' || n.tagName === 'A'))) n = n.parentElement;
  (n || lbl).click();
  await new Promise(r => setTimeout(r, 2500));
  return document.querySelectorAll('[role="dialog"]').length + ' dialog(s)';
};
await window.openComposer()
```

🔴 **`1 dialog(s)` 가 나와야 한다.** 2 이상이면 작성창이 겹쳐 열린 것 — 전부 닫고 다시 한다.
(원인: 라벨의 조상들을 연달아 click 하면 두 번 열린다. **가장 가까운 `role="button"` 하나만** 클릭할 것.)

## 2. 토픽 설정 (`#공인중개사` 등)

⚠️ **JS click 으로는 안 된다.** 드롭다운 항목을 JS 로 누르면 오른쪽 검색 패널이 열려버린다.
**반드시 `find` → `computer.left_click(ref)` 로 진짜 클릭**한다.

1. `find`: `커뮤니티 또는 주제 selector in the new thread composer` → ref 를 얻어 `left_click`
2. `computer.type` 으로 토픽명 입력 (예: `공인중개사`)
3. 2초 대기 → `find`: `first dropdown suggestion option exactly <토픽명> in the topic picker list` → ref 를 얻어 `left_click`
4. 작성창 머리가 `solopreneur.jm > 공인중개사` 로 바뀌면 성공

토픽 설정이 실패해도 **본문 발행은 계속한다**(토픽 없이 나가도 된다).

## 3. 본문 입력

```js
window.fillPost = async (txt) => {
  const ce = document.querySelector('[role="dialog"] [contenteditable="true"]');
  if (!ce) return { err: 'no composer' };
  ce.focus();
  const s = window.getSelection(), r = document.createRange();
  r.selectNodeContents(ce); s.removeAllRanges(); s.addRange(r);
  await new Promise(x => setTimeout(x, 150));
  const dt = new DataTransfer(); dt.setData('text/plain', txt);
  ce.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  await new Promise(x => setTimeout(x, 1000));
  return { match: ce.innerText.trim() === txt.trim(), len: ce.innerText.length };
};
```

🔴 **`match: true` 가 아니면 발행하지 않는다.** 그대로 두고 사용자에게 보고한다.

## 4. 이미지 첨부 (있을 때만)

머리줄에 `· 이미지: <경로>` 가 있으면:

- `/shots/...` 로 시작하면 → `D:\Claude-prj\junominu\public\shots\...`
- 절대경로면 그대로 (`C:\Users\bsuha\Claude-prj\...` 는 `D:\Claude-prj\...` 와 같은 폴더다)

```
find:        hidden file input for attaching photos in the composer dialog
file_upload: paths=[절대경로], ref=<위 ref>
```

- ✅ **repo 안 경로도 업로드된다**(실측 2026-08-07, `public/shots/jungaepro-cover.png` 432KB 성공).
- 한 번에 10MB 미만.
- 업로드 후 **스크린샷으로 미리보기가 붙었는지 눈으로 확인**한다.

## 5. 게시

```js
window.postBtn = () => {
  const dlg = document.querySelector('[role="dialog"]');
  if (!dlg) return null;
  return [...dlg.querySelectorAll('div[role="button"],button')]
    .find(b => (b.textContent || '').trim() === '게시') || null;
};
window.postBtn()?.click();
```

⚠️ **게시 직후 `dialogs` 를 세면 아직 1로 나온다** — 닫히는 중이라 그렇다.
**그 값으로 실패 판정하지 말 것**(2026-08-07 실측: 5초 뒤에도 1이었는데 실제로는 발행됨).

확인은 **프로필에서** 한다. `https://www.threads.com/@solopreneur.jm` 로 가서:

```js
const t = document.body.innerText;
const imgs = [...document.querySelectorAll('img')].filter(i => i.naturalWidth > 250)
  .map(i => ({ w: i.naturalWidth, alt: (i.alt||'').slice(0,40) }));
JSON.stringify({ ok: t.includes('<본문 마지막 문장 일부>'), imgs })
```

- 맨 위 글이 방금 그 본문이고 `solopreneur.jm › <토픽>` 이 붙어 있으면 성공.
- 이미지를 넣었으면 `alt` 가 `Photo by ...` 인 img 가 있어야 한다.
- ⚠️ 프로필 첫 화면은 글이 잘려 있다 — 본문 **앞부분**으로 검사하거나 스크롤한 뒤 검사한다.

## 6. 기록

`queue/PUBLISHED.md` 에 한 줄 추가한다:

```
- 2026-08-07 15:00 · [1] 중개프로 확인설명서 · 토픽 공인중개사 · 이미지 O · ✅발행
```

## 실패했을 때

- 작성창을 비우려면: `취소` → **`임시 저장하시겠어요?`** 가 뜬다 →
  `find` 로 **`저장 안 함`** ref 를 얻어 `computer.left_click`. (JS click 은 이 모달에서 안 먹는다.)
- 작성창이 열린 채로 `navigate` 하면 **"Leave site?" 로 막힌다.** 먼저 위 절차로 닫을 것.
- 렌더러가 얼면 새 탭을 만들어 다시 연다.
- **2~3회 실패하면 멈추고 사용자에게 보고한다.** 같은 글을 계속 재시도하지 않는다.
