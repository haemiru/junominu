# junominu.com 작업 로그 (WORKLOG)

> 세션별 **작업 내역 · 현재 상태 · 다음 할 일 · 핵심 참조**를 기록한다.
> 돌아와서 이어 작업할 때 **이 파일부터** 읽으면 어디까지 했는지 바로 잡힌다.
> (사이트 사용법·구조는 `CLAUDE.md`, 스레드 글 이력은 `.claude/skills/threads-post/threads-log.md`)

---

## ▶ 지금 할 차례 (2026-07-23 기준)

> **"이제 뭐 해야 해?" → 사이트 개선 4순위 「블로그 콘텐츠」부터.**

1순위(라우트별 메타·OG 프리렌더)·2순위(홈 첫인상)·3순위(번들 다이어트) 모두 **완료**. 사이트 코드 쪽 대기열은 비었고, 남은 건 **콘텐츠**다.

### 🟢 4순위 — 블로그 콘텐츠 ← **여기부터**
- 글 **3개, 마지막이 2026-06-04**. 스레드의 🔧빌드로그·💡인사이트를 **받아주는 심화 글 경로가 비어 있다**. 스레드(짧게) → 블로그(깊게) → `/contact` 흐름을 만들어야 한다.

### ✅ 모바일 가로 넘침 — **실재하지 않음** (2026-07-22 확인, 수정 불필요)
- CDP `Emulation.setDeviceMetricsOverride`로 뷰포트를 강제해 실측: **320·360·390·430px 전부 `scrollWidth == viewport`, 넘치는 요소 0개.**
- 🚨 **재발 방지 — Windows Chrome은 `--window-size` 폭에 하한(약 500px)이 있다.** `--window-size=430`을 줘도 **512px 뷰포트로 렌더한 뒤 PNG만 430으로 크롭**한다 → 오른쪽이 잘린 것처럼 보여 "넘침"으로 오진하기 쉽다.
  → **모바일 확인은 `--window-size`로 하지 말 것.** CDP Emulation을 쓰거나(스크립트 예: 이 세션의 `overflow-probe.mjs`), 최소 500px 이상 폭에서만 판단할 것.

### ✅ Tally 숨김필드 — **생성 완료** (2026-07-23, 폼 정의에서 실측 확인)
- 폼 `b5EKOL` 정의에 `hiddenFields: [{name:"type"}]` + `[{name:"src"}]` **둘 다 존재**. `Contact.jsx`가 보내는 키와 이름 일치 → 이제 문의 응답에 **문의유형 + 유입경로**가 함께 기록된다.
- `src` 값: `threads/<캠페인>`(UTM) → 없으면 `l.threads.com`(referrer) → 없으면 `direct`. **first-touch**라 사이트 안을 돌아다녀도 최초 유입이 유지된다.
- ⚠️ 다만 **UTM을 붙여 올린 글이 있어야** `threads/<캠페인>` 단위 귀속이 생긴다(아래 참조).

### ⏸️ 사이트 밖(사용자 직접 해야 하는 일)
- **동료 링 20~30계정 리스트업** — 스레드 전략 §5, 1~2주 과제 중 유일하게 남음.
- 스레드 글 링크에 **UTM** 붙이기: `?utm_source=threads&utm_campaign=<글슬러그>`
  - 예: `https://www.junominu.com/p/petphoto?utm_source=threads&utm_campaign=petphoto-anchor`
  - 이걸 해야 Tally `src`와 Vercel Analytics **UTM Parameters** 탭이 글 단위로 쪼개진다. 안 붙이면 전부 `l.threads.com` 한 덩어리.

---

## 2026-07-23 — 번들 다이어트 (3순위 완료)

### 무엇을 했나

`App.jsx`가 홈·상세·블로그·프롬프트·함께하기를 **전부 즉시 import** 하고 있었다. 그래서 마크다운 파서 `marked`(+ 글 원문 3편)가 **블로그를 안 보는 방문자에게도** 전부 내려갔고, 사이트가 열릴 때 **글 3편을 HTML로 변환하는 계산까지** 돌았다.

- `React.lazy` + `Suspense`로 라우트 분할 — `ProjectDetail`·`Blog`·`Post`·`Prompts`·`Contact`.
- **`Home`은 일부러 즉시 로드 유지** — 가장 흔한 진입점이라 lazy로 만들면 첫 화면에 네트워크 왕복이 하나 더 생긴다.
- `RouteFallback`(`.route-loading`, `min-height:60vh`) — 조각 받는 동안 화면이 튀지 않게 높이만 잡는다. 조각이 작아 스피너는 과함.

### 효과 (실측)

| | 변경 전 | 변경 후 |
|---|---|---|
| 첫 로딩 JS | 354.37 kB (gzip **116.36**) | 289.95 kB (gzip **96.44**) |
| **감소** | — | **−64.4 kB / gzip −19.9 kB (−17.1%)** |

분리된 조각(해당 페이지 갈 때만 받음): `blogData` 53.52 kB(gzip 18.29 — marked + 글 3편) · `ProjectDetail` 4.66 · `Contact` 3.58 · `Prompts` 1.53 · `Blog` 1.26 · `Post` 0.91.

### 검증 ✅

CDP 라우트 스모크 테스트 — **7개 경로 전부 렌더 확인**(`/`·`/p/petphoto`·`/blog`·`/blog/data-first`·`/prompts`·`/contact`·없는 경로→홈 폴백). h1·본문 글자수 정상, 로딩 자리(`.route-loading`) 잔류 없음.

- **`/blog/data-first`가 1,562자로 렌더** = 분리된 `blogData` 조각이 제대로 받아져 `marked`가 동작한다는 증거.
- 콘솔 에러는 `/_vercel/insights/script.js` 404 하나뿐 — **Vercel Analytics는 Vercel 엣지에만 있어 로컬 preview에선 없는 게 정상**(라이브는 200 확인). 코드 문제 아님.
- 빌드·프리렌더(15개)·lint 통과.

---

## 2026-07-22 (5) — 홈 첫인상 (2순위 완료)

### 무엇을 했나

**문제 ①: 첫 버튼이 판매 요청이었다.** 히어로 CTA가 `1:1 코칭 · 외주 문의` 하나뿐이라, 스레드에서 처음 넘어온 사람이 작업물을 보기도 전에 돈 이야기를 마주쳤다.

- `Home.jsx` `hero__actions` → 버튼 2개. **`프로젝트 둘러보기 ↓`(primary, `#work`)** + `1:1 코칭 · 외주 문의`(ghost, `/contact`).
- 문의 접점은 그대로 3곳 유지 — 내비 「함께하기」·하단 `ContactCTA` 밴드(`#contact`)·풋터.

**문제 ②: 최고 자산이 풋터에만 있었다.** `/prompts`에 **6개 프로젝트 · 프롬프트 7개**가 모여 있는데 홈 입구가 풋터 링크 하나뿐이었다. 💡인사이트 축 = 코칭·강의 직결 자산.

- `hero__nav`에 **「프롬프트」** 추가.
- **`PromptsBand` 신설** — PROJECTS 그리드 바로 아래 프로모 밴드. `PROMPT NOTE` 키커 + "이 프로젝트들을 만든 실제 프롬프트" + ghost 버튼.
  **개수는 `detail.prompts`에서 자동 계산**(`위 6개 프로젝트 … 핵심 프롬프트 7개`) → 프롬프트를 추가하면 문구가 알아서 갱신된다. 0개면 밴드 자체가 안 뜬다.
- `App.css`에 `.band` 계열 추가. 하단 `.cta`보다 **한 톤 약하게**(시안 계열 은은한 그라데이션 + `--border`) — 최종 전환은 하단 밴드가 받게.
- 720px 이하에서 밴드는 세로 스택.

### 검증 ✅

| 항목 | 결과 |
|---|---|
| 빌드 · 프리렌더 · lint | ✅ (CSS 17.52 → 18.18 kB) |
| 데스크톱 히어로 육안 | ✅ 채운 버튼(둘러보기) + 테두리 버튼(문의), 내비에 「프롬프트」 |
| 프롬프트 밴드 육안 | ✅ PROJECTS 아래 렌더, 자동 개수 `6개 프로젝트 / 7개` 정확 |
| 모바일 히어로 | ✅ 버튼 2개 한 줄, 내비 정상 랩 |
| 모바일 가로 넘침 | ✅ **320·360·390·430px 전부 넘침 0px / 넘치는 요소 0개**(CDP 실측) |

### 🚨 오진 1건 — 「모바일 넘침」은 측정 아티팩트였음

작업 중 "430px에서 오른쪽이 잘린다"고 보고했으나 **틀렸다.** Chrome 헤드리스를 `--window-size=430,900`으로 띄운 게 원인 — **Windows Chrome은 창 폭에 하한(약 500px)이 있어 512px로 렌더한 뒤 스크린샷만 430으로 크롭**한다. 잘린 그림이 나온 것이지 레이아웃이 넘친 게 아니었다.

CDP `Emulation.setDeviceMetricsOverride`로 뷰포트를 강제해 다시 재니 **네 폭 전부 넘침 0**. 수정할 것이 없어 코드는 그대로 뒀다. 재발 방지 메모는 머리말에.

---

## 2026-07-22 (4) — 펫포토 AI 카드 추가 (9번째 프로젝트)

### 무엇을 했나

`D:\Claude-prj\PetPhotoAI` 완료 → `src/projects.js` `PROJECTS`에 **9번째 카드** 추가. 데이터는 그 레포의 `WORK-LOG.md`·`README.md`·git 이력(37커밋)에서 추출한 실데이터.

- **카드**: 펫포토 AI(`slug: petphoto`) · 🐾 · `status: live` · `url: https://pet-photo-ai.vercel.app` · tags `[반려동물, AI 이미지, Vite]` · tint `#fb7185`(브랜드 코랄)
- **detail**: started `2026-06-30`(1단계 최초 산출물, 독립 repo 분리는 7-02) / launched `2026-07-22`(실결제 E2E 완주) → 상세에 **"0 → 배포 22일"** 표시. summary·features 7 · stack 10 · timeline 8 · challenges 4 · retro 1.
- **이미지**: `public/shots/petphoto-cover.png`(라이브 랜딩 Chrome 헤드리스 캡처) + 실제 생성 샘플 4장(`petphoto-{original,studio,hanbok,fantasy}.jpg`, PetPhotoAI `public/samples/terrier/`에서 복사) → 상세 "화면" 섹션이 **원본 → 3스타일** before/after로 뜸.
- `public/sitemap.xml`에 `/p/petphoto` 추가. `ME.about`의 분야 나열에 "반려동물 AI 프로필 사진" 추가(검색 키워드 동기화).

### 검증 ✅

| 항목 | 결과 |
|---|---|
| 빌드 + 프리렌더 | ✅ `dist/p/petphoto/index.html` 생성, 프로젝트 9개로 증가 |
| 라우트 메타 | ✅ title `펫포토 AI — 메이킹 스토리 · JunoMinu` / og:image `/shots/petphoto-cover.png` |
| lint | ✅ |
| 홈 카드 육안 | ✅ 3행 1열에 카드 렌더, 지표 자동 갱신 — 프로젝트 **9** · 누적 커밋 **1,249** · 운영 중 **6** |
| 상세 페이지 육안 | ✅ 커버·지표(22일/첫 커밋)·기능·화면 4장·스택·타임라인 정상 |

### 사용자 확인 완료 ✅

1. **`prompts` 채움** — 사용자가 실제 프롬프트 확정: *"샘플 보기 생성 후 결제 연동하는 것을 선결제 후 실제 결과물 생성으로 수정하자. API 비용 대비 수익이 나기 위해서는 샘플 보기로 인한 비용 지출을 막아야 할 필요가 있어."*(제목 「선결제 전환 — 원가 방어」) → `/prompts` 프롬프트 노트에 자동 집계됨.
2. **`status: "live"` 확정** — 사용자 확인. 배포·live 키·실결제 E2E 통과 상태.
3. (참고) `ME.now`는 안 건드렸다 — 현재 아이복지모아·중개프로·소리야 3개. 펫포토 오픈 준비를 넣고 싶으면 말해 줄 것.

---

## 2026-07-22 (3) — 라우트별 메타·OG 프리렌더 (공유 카드 정상화)

### 무엇을 했나

**문제(실측으로 확인)**: SPA라 크롤러가 JS를 못 돌려서 **15개 페이지 전부가 같은 제목·설명·이미지**를 내보내고 있었다.
```
/ · /p/bokjimoa · /blog/built-this-site  →  전부 "JunoMinu · Vibe Coding" / og.png
```
스레드 전략의 링크가 정확히 이 경로로 나가는데 미리보기 카드가 다 깨져 있었고, 구글에도 15개가 동일 title로 색인되고 있었다.

**해결**: `scripts/prerender-meta.js` 신설 → `npm run build`에서 `vite build` 다음 자동 실행.
- 라우트마다 `dist/<경로>/index.html`을 만들고 title·description·og:*·twitter:*·canonical을 갈아끼움.
- 데이터는 `src/projects.js` + `src/posts/*.md` → **프로젝트·글 추가 시 자동 반영**(스크립트 수정 불필요).
- 프로젝트 상세는 `detail.cover`(폴백 `thumb`)를 **og:image로** 사용 → 공유 카드에 실제 제품 화면. 스크린샷은 1200×630이 아니라 `og:image:width/height` 태그는 자동 제거.
- 블로그 글은 `og:type=article`.
- `vercel.json`은 손대지 않음 — Vercel이 rewrites보다 실제 파일을 먼저 서빙.

- `eslint.config.js`에 `scripts/**` = Node 전역 블록 추가(빌드 스크립트의 `process` 미정의 오류 해소).

### 검증 ✅ (라이브 실측 완료)

| 항목 | 결과 |
|---|---|
| 라우트별 제목·설명·OG | ✅ 라이브 5개 경로 확인 — `/`, `/p/bokjimoa`, `/p/jungaepro`, `/blog/data-first`, `/contact` 전부 고유 |
| 프로젝트 OG 이미지 실제 접근 | ✅ `shots/bokjimoa-cover.png` → 200, image/png |
| 없는 경로 SPA fallback | ✅ `/p/nonexistent` → 정상 (Vercel 파일 우선 서빙 확인됨) |
| 생성 수 / shot 실존 / 에셋 경로 | ✅ 15개(프로젝트 8·글 3·고정 3+루트) · shot 8개 전부 실존 · 중첩 폴더 절대경로 정상 |
| width/height 분기 | ✅ 스크린샷=제거, og.png=유지 |
| lint | ✅ |

**사용자 확인법**: ① 브라우저 탭 제목 ② **스레드 글 작성창에 링크 붙여넣기**(발행 안 해도 카드 미리보기) ③ <https://www.opengraph.xyz>
⚠️ **캐시 주의** — 예전에 공유한 URL은 옛 카드가 뜰 수 있다. Meta 셰어링 디버거 "Scrape Again" / 카카오 디버거 캐시 초기화로 갱신. **UTM 붙은 링크는 다른 URL이라 캐시 없음.**

### 다음에 할 일 → **머리말 「▶ 지금 할 차례」 참조** (2순위 홈 첫인상부터)

---

## 2026-07-22 (2) — 스레드 채널 운영 전략 신설 + 스킬 최신 기준 반영

### 무엇을 했나

**목표**: 세계 1인 기업가들이 X를 쓰듯 **스레드를 메인 홍보 채널로** 운영. 기존 `threads-post` 스킬은 "글 한 편 잘 쓰기"만 커버했고 **채널 운영**(리듬·답글·프로필·계측)이 통째로 비어 있었음.

**A. `threads-strategy.md` 신설** (`.claude/skills/threads-post/`)
- 스킬 폴더가 **3단 구조**가 됨: `SKILL.md`(글 한 편) / `threads-strategy.md`(채널 운영) / `threads-log.md`(이력).
- §1 플랫폼 팩트(기준일·출처 명시) · §2 X 플레이북 이식표 · §3 프로필=랜딩 · §4 축4개+주간리듬 · §5 **답글 전략**(최대 구멍이었음) · §6 장문첨부 · §7 KPI·계측 · §8 아웃라이어 재활용 · §9 90일 계획 · §10 갱신 규칙.

**B. 웹 검색으로 2026-07 기준 최신화 → 낡은 전제 3개 정정**
- **골든타임 30~60분 → 60~90분**.
- **발행량 "하루 1~2개" → 하루 1개 상한·주 3~5개** (새 글이 이전 글의 답글 누적을 끊음).
- **링크 억제는 사라짐** — 2024년엔 눌렸으나 리밸런싱됨(Mosseri: URL 포함 글에 오히려 더 높은 값). 규칙이 "링크 금지"→**"맥락 없는 링크 금지"**로 바뀜.
- 신규 반영: **장문 텍스트 첨부 10,000자**(본문은 여전히 500자) · **답글 예약 발행** · 인사이트 "View sources" · **프로필 클릭이 공식 랭킹 신호** · 초기 노출 팔로워의 2~5% · 광고는 미국·일본만(한국 오가닉 온리).

**C. ⚠️ 전략 방향 전환 — 토픽 기본값 `#발달장애` → `#바이브코딩`**
- 근거: 국내 스레드 MAU 692만(X 757만 추격)이지만 **이용자 57%가 1020, 20대가 40%**.
- 즉 제품 **사용자**(발달장애 부모·중개사·시니어 = 30~40대+)는 스레드 코어가 **아니고**, **관문 구매자**(코칭·외주·강의 = 20~30대)는 두껍게 있음.
- → **스레드의 1차 임무는 "제품 사용자 확보"가 아니라 "메이커 인지도 → 코칭·외주·강의"**. 부모 도달은 맘카페·복지관 경로가 효율적.

**D. `SKILL.md` 업그레이드**
- §0에 3단 구조표 · §1 전제 10개로 확장(프로필 클릭·팔로워 무관·engagement bait 추가) · §4 축 4개 재배분(🔧빌드로그 35%가 새 핵심 엔진) · §8 채점표 11항목(프로필 클릭 유발·engagement bait 0점) · §9 운영팁 전면 개정 · **§12 신설**(운영 질문은 전략 문서로 라우팅).
- `threads-log.md`: 항목에 **`축`·`훅 공식명`** 필수화(아웃라이어 판정용) + **월간 KPI 표**·**아웃라이어 표** 신설.

**E. Vercel Analytics 설치 — 계측 구멍 해소**
- `@vercel/analytics@2.0.1` 추가 → `src/App.jsx`의 `BrowserRouter` 안에 `<Analytics />`. SPA 라우트 변경도 자동 추적.
- 빌드·린트 통과, 번들에 `/_vercel/insights/script.js` 로더 포함 확인.
- Vercel 대시보드에서 Analytics **Enable 완료** → **첫 데이터 수신 확인**(2026-07-22): Visitors 3 / PV 10, Pages `/`·`/blog`, **Referrers에 `l.threads.com` 1** = 스레드 앵커 글에서 실제 유입 발생.
- 스레드 링크엔 UTM을 붙여 쓴다: `junominu.com/p/bokjimoa?utm_source=threads&utm_campaign=<글슬러그>` → 대시보드 **UTM Parameters** 탭에서 글 단위 귀속.
- ⚠️ 주의 2가지: **본인 방문이 섞인다**(자기 트래픽 자동 제외 없음) · **광고 차단기 방문자는 누락**된다 → 총 Visitors를 성과로 읽지 말고 referrer/UTM 붙은 건만 셀 것.

**F. 유입 경로 → 문의 연결 (숨김필드 `src`)**
- 문제: `/p/bokjimoa?utm_source=threads&...`로 들어와도 **SPA 라우팅으로 /contact 가는 순간 쿼리가 사라진다.**
- 해결: `src/attribution.js` 신설 — `main.jsx`에서 **렌더 전 1회** `captureAttribution()` 호출해 utm/referrer를 `sessionStorage`에 **first-touch**로 저장. `/contact`가 그 값을 Tally 숨김필드 **`src`**로 전달(팝업=hiddenFields, 새 탭 폴백=`?src=`).
- 값: `threads/bokjimoa-anchor` → 없으면 `l.threads.com`(referrer) → 없으면 `direct`.
- 검증: 분기 로직 **8/8 통과**(UTM 전체/일부·referrer·내부이동 무시·깨진 referrer·직접진입·first-touch 유지·sessionStorage 차단 시 무예외). 빌드·린트 통과.
- ⚠️ **Tally 폼에 숨김필드 `src`를 만들어야 실제로 기록된다**(없으면 조용히 무시됨).

**G. 프로필 확정 + 경력 사실 정정**
- **bio 확정·적용**(반전형): *"IT 회사 22년, 정작 제 손으로 만든 제품은 하나도 없었어요 / 지금은 바이브코딩으로 혼자 기획·개발·배포합니다 / 7개월 · 서비스 8개 · 5개 운영 중 / 막힌 지점까지 다 공유합니다 ↓"* → 전략 §3에 확정안 기록. **판매 문구는 뺐다**(초기 전환 약함 → 고정글·`/contact`가 받음).
- 🚨 **경력 사실 2회 정정**: ① 직함(System Architect)을 근거로 "설계를 오래 했다"고 쓴 것은 **사실 아님** → 그 표현 금지 가드 추가. ② **20년 → 22년**(시스템 아키텍트 · 정보보안 기획). SKILL.md §2·§5, 전략 §2·§3, `projects.js`의 `ME.contact.lead`까지 전부 반영.
- **고정글**: 이미 **계정 소개 앵커 4편**이 고정돼 있었음(로그에 없던 글 → 소급 기록). 전략 §3의 고정글 우선순위를 **"1순위=계정 소개 앵커"**로 정정 — 프로필(bio)과 같은 서사여야 한 메시지로 이어짐.

**H. ⚠️ 스레드 인사이트는 팔로워 100명부터**
- 계정 인사이트 탭이 *"팔로워가 100명이 되면 다시 방문하세요"*로 잠김.
- **단, 글 단위 조회·좋아요·답글은 지금도 각 글에서 볼 수 있다** → 아웃라이어 판정(전략 §8)은 지금도 가능. 사이트 유입·문의는 Vercel Analytics라 무관.
- **팔로워 100 = 유일하게 정당한 팔로워 목표**로 재정의(허영 지표가 아니라 계측을 여는 열쇠). 넘긴 뒤엔 다시 안 본다.
- 우회로(검증 필요): 비즈니스 계정 전환 시 100명 관문 미적용이라는 서드파티 보고.

### 현재 상태 ✅
- 문서 3종 정합성 확인(낡은 수치·사실 오류 잔존 없음). **Analytics 가동·검증 완료** — 스레드→사이트 구간 측정됨.

### 남은 일 (스레드 쪽)
- [ ] **Tally 폼에 숨김필드 `src` 생성** ← 코드는 이미 보내는 중. 필드 없으면 조용히 버려짐.
- [ ] **동료 링 20~30계정 리스트업** (전략 §5) ← **§9 「1~2주 기반」 과제 중 유일하게 남음**
- [ ] 스레드 글 링크에 **UTM** 붙이기 — 이번 앵커 글들은 UTM 없이 나가 referrer로만 잡힘.
- [ ] 고정글·앵커 반응 수치를 **각 글에서 눈으로 읽어** `threads-log.md`에 채우기
- [ ] 앵커 2개 추가(중개프로 · 짱샘의 책방)
- [ ] 전략 §1 **분기 1회 재확인**(플랫폼 변화 빠름) · bio의 `7개월·8개·5개`도 월 회고 때 갱신

### 핵심 참조
- **채널 운영 전부**: `.claude/skills/threads-post/threads-strategy.md` (플랫폼 사실은 §1이 우선·출처·기준일 포함)
- 90일 계획: 전략 §9 / 답글 전략: 전략 §5 / KPI·계측: 전략 §7

---

## 2026-07-22 — 코칭·외주 문의(/contact) 신설 + 아이복지모아 스레드 초안

### 무엇을 했나

**A. 아이복지모아 제작기 스레드 초안**
- `threads-post` 스킬로 앵커 제작기 **6편 초안** 작성(MVP 공유→반응 폭발→피드백 개발기).
- **발행 로그 시스템 신설**: `.claude/skills/threads-post/threads-log.md` — 이미 쓴 글의 각도·훅을 기록해 중복/방향 이탈 방지. 스킬이 글쓰기 **전 읽고, 초안 후 항목 추가**하도록 SKILL.md에 연결(§7·§11).
- 상태: **발행 완료**(2026-07-22). 반응 수치는 `threads-log.md`에 추후 기록.

**B. /contact — 1:1 코칭·외주 문의 페이지 (신규)**
- 왜: 스레드 프로필이 "1:1 코칭·외주 문의 ↓ junominu.com"으로 유도하는데 사이트에 **접점이 없었음**.
- 새 페이지 `src/Contact.jsx` (`/contact`). 데이터는 `src/projects.js`의 **`ME.contact` 한 곳**에서 자동 렌더.
- 오퍼 2개: **🧭 1:1 코칭 / 🛠️ 외주 문의** (오퍼 카드).
- 홈 진입점: 히어로 CTA 버튼 + 내비 "함께하기" + 하단 **ContactCTA 밴드**(`#contact`) + 풋터 "코칭·외주".
- 라우트(`App.jsx`), `public/sitemap.xml`, `App.css`(`.btn`/`.cta`/`.offer`) 추가.
- 오퍼 카드 **버튼 높이 정렬**(`.offer__body{flex:1}`)로 두 카드 CTA 줄맞춤.

**C. 접수 = Tally 폼(외부 폼)**
- Tally 폼 생성: 제목 "1:1 코칭·외주 문의", **폼 ID `b5EKOL`** (https://tally.so/r/b5EKOL).
- 질문: `type`(숨김) · 성함 · 이메일 · 카톡ID·휴대폰(선택) · 만들고싶은것/상황 · 예산·일정(선택) · 참고링크(선택).
- **문의 유형은 화면 질문 대신 숨김필드 `type`** 로 처리 → 코칭 버튼=`type:1:1 코칭`, 외주 버튼=`type:외주 문의` 자동 기록.
- 알림: Tally **Self email notifications ON** → `junominu@gmail.com` 응답 메일 수신(**확인 완료**).
- 폼 디자인: Tally **Customize로 다크+보라** 적용.

**D. 팝업 임베드**
- `/contact` 버튼이 새 탭 대신 **Tally 팝업(모달)**으로 사이트 안에서 폼을 띄움(`Tally.openPopup`, `embed.js`는 /contact 진입 시 1회 로드).
- `type`은 팝업 **hiddenFields**로 전달. 스크립트 미로딩 시 **`?type=` 새 탭 폴백**(항상 작동).

### 커밋 (모두 `main` → Vercel 배포됨)
- `feat(contact)`: /contact 페이지 + 홈 진입점
- `docs(threads-post)`: 발행 로그(threads-log.md)
- `fix(contact)`: 오퍼 카드 버튼 높이 정렬 + 버튼별 `?type=` 전달
- `feat(contact)`: Tally 팝업 임베드

### 현재 상태 ✅
- 전부 배포 완료. 코칭/외주 버튼 → 팝업 폼 → 메일에 `type` 기록까지 **동작 확인**.

### 다음에 할 일 (TODO)
- [x] **아이복지모아 스레드 실제 발행** (2026-07-22 발행 완료, `threads-log.md` 상태 `발행`). → 반응(좋아요/댓글/사이트 유입) 수치는 나중에 `threads-log.md` "반응 메모"에 채우기.
- [ ] (선택) 코칭 회당 금액·외주 견적 기준이 정해지면 오퍼 카드 `note`에 표기(`ME.contact.offers[].note`).
- [ ] (선택) 팝업 크기/색/위치 미세 조정(`Contact.jsx`의 `Tally.openPopup` 옵션).
- [ ] (선택) 오퍼 문구(`ME.contact`) 다듬기.
- [ ] (선택) 다른 프로젝트 앵커 스레드 작성(짱샘의 책방·중개프로 등 — threads-log 앵커 현황표 참고).

### 핵심 참조
- **데이터 한 곳**: `src/projects.js` → `ME.contact` (`formUrl`, `formId`, `email`, `offers[].typeValue` 등). 문구·오퍼 수정은 여기.
- **Tally 폼**: ID `b5EKOL` · 숨김필드 이름 **`type`**(코드의 `?type=`/hiddenFields와 짝) · 계정/알림 메일 `junominu@gmail.com`.
- **관련 문서**: `CLAUDE.md` → "코칭·외주 문의 (/contact)" 섹션.
- **배포**: `main` push → Vercel 자동 배포 → junominu.com.

<!-- 다음 세션 기록은 이 줄 위에, 최신이 위로 오도록 새 날짜 섹션으로 추가 -->
