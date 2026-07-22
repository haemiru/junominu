# junominu.com 작업 로그 (WORKLOG)

> 세션별 **작업 내역 · 현재 상태 · 다음 할 일 · 핵심 참조**를 기록한다.
> 돌아와서 이어 작업할 때 **이 파일부터** 읽으면 어디까지 했는지 바로 잡힌다.
> (사이트 사용법·구조는 `CLAUDE.md`, 스레드 글 이력은 `.claude/skills/threads-post/threads-log.md`)

---

## 2026-07-22 — 코칭·외주 문의(/contact) 신설 + 아이복지모아 스레드 초안

### 무엇을 했나

**A. 아이복지모아 제작기 스레드 초안**
- `threads-post` 스킬로 앵커 제작기 **6편 초안** 작성(MVP 공유→반응 폭발→피드백 개발기).
- **발행 로그 시스템 신설**: `.claude/skills/threads-post/threads-log.md` — 이미 쓴 글의 각도·훅을 기록해 중복/방향 이탈 방지. 스킬이 글쓰기 **전 읽고, 초안 후 항목 추가**하도록 SKILL.md에 연결(§7·§11).
- 상태: **초안**(아직 스레드에 실제 발행 안 함).

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
- [ ] **아이복지모아 스레드 실제 발행** → `threads-log.md` 상태 `초안`→`발행`으로 바꾸고 반응(좋아요/댓글) 메모.
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
