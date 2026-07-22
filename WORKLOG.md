# junominu.com 작업 로그 (WORKLOG)

> 세션별 **작업 내역 · 현재 상태 · 다음 할 일 · 핵심 참조**를 기록한다.
> 돌아와서 이어 작업할 때 **이 파일부터** 읽으면 어디까지 했는지 바로 잡힌다.
> (사이트 사용법·구조는 `CLAUDE.md`, 스레드 글 이력은 `.claude/skills/threads-post/threads-log.md`)

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

### 현재 상태 ✅
- 문서 3종 정합성 확인(낡은 수치 잔존 없음). **Analytics 가동·검증 완료** — 스레드→사이트 구간 측정됨.

**F. 유입 경로 → 문의 연결 (숨김필드 `src`)**
- 문제: `/p/bokjimoa?utm_source=threads&...`로 들어와도 **SPA 라우팅으로 /contact 가는 순간 쿼리가 사라진다.**
- 해결: `src/attribution.js` 신설 — `main.jsx`에서 **렌더 전 1회** `captureAttribution()` 호출해 utm/referrer를 `sessionStorage`에 **first-touch**로 저장. `/contact`가 그 값을 Tally 숨김필드 **`src`**로 전달(팝업=hiddenFields, 새 탭 폴백=`?src=`).
- 값: `threads/bokjimoa-anchor` → 없으면 `l.threads.com`(referrer) → 없으면 `direct`.
- 검증: 분기 로직 **8/8 통과**(UTM 전체/일부·referrer·내부이동 무시·깨진 referrer·직접진입·first-touch 유지·sessionStorage 차단 시 무예외). 빌드·린트 통과.
- ⚠️ **Tally 폼에 숨김필드 `src`를 만들어야 실제로 기록된다**(없으면 조용히 무시됨).

### 다음에 할 일 (TODO)
- [x] **Vercel Analytics 설치 + Enable + 수신 검증** (2026-07-22 완료).
- [x] **문의까지 연결** — `src` 숨김필드 전달 구현 완료(2026-07-22). → **Tally 쪽에 `src` 필드 생성 필요**.
- [ ] **스레드 글 링크에 UTM 붙이기** — `?utm_source=threads&utm_campaign=<글슬러그>`. 이번 앵커 글은 UTM 없이 나가 referrer로만 잡힘.

### 전략 §9 「1~2주 기반」 진척
- [x] Vercel Analytics + UTM (2026-07-22) — `src` 문의 귀속까지 초과 달성
- [x] **프로필 한 줄 소개 확정·적용** (2026-07-22) — 반전형. 확정 문구는 `threads-strategy.md` §3
- [x] **고정글(핀)** (2026-07-22) — **계정 소개 앵커 4편**이 이미 고정돼 있었음. bio와 같은 반전형 서사라 프로필→고정글이 한 메시지로 이어짐. 로그에 소급 기록 + 전략 §3의 고정글 우선순위를 "1순위=계정 소개 앵커"로 정정.
- [ ] 동료 링 20~30계정 리스트업 (전략 §5, 답글 비중 60%짜리 1순위) ← **1~2주 과제 중 유일하게 남음**
- [ ] 고정글 반응 수치(조회·답글·팔로우)를 스레드 인사이트에서 확인해 `threads-log.md`에 채우기
- [ ] 프로필 3층 정비(전략 §3) — 현 bio "1:1 코칭·외주 문의 ↓"는 초기 단계 전환이 약함. 먼저 궁금증을 만드는 문구로.
- [ ] 동료 링 20~30계정 리스트업(전략 §5)
- [ ] 앵커 2개 추가(중개프로·짱샘의 책방)
- [ ] 전략 §1 **분기 1회 재확인**(플랫폼 변화 빠름)

### 핵심 참조
- **채널 운영 전부**: `.claude/skills/threads-post/threads-strategy.md` (플랫폼 사실은 §1이 우선·출처 포함)
- 90일 계획: 전략 §9 / 답글 전략: 전략 §5

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
