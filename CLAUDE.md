# CLAUDE.md — junominu.com (나만의 바이브 코딩 작업실)

## 이 프로젝트는 무엇인가

**junominu.com** — 혼자 바이브 코딩으로 만들어 가는 개인 프로젝트들을 한곳에 모아 보여주는 **개인 대시보드/런치패드**.

- **모델**: 정적 단일 페이지. 프로젝트를 카드로 나열하고 각 프로젝트(자체 도메인)로 링크.
- **상태값**: `live`(운영 중) / `building`(작업 중·베타) / `idea`(구상, url 없어도 됨)
- **백엔드 없음** — 순수 정적 사이트.
- **레포**: `https://github.com/haemiru/junominu`
- **로컬 폴더**: `C:\Users\bsuha\Claude-prj\junominu\`
- **호스팅**: Vercel 프로젝트 `junominu` → `junominu.com`(apex는 `www.junominu.com`으로 307 리다이렉트, NS=Vercel via 호스팅케이알)

> **이력**: 2026-06-01 이전엔 "키즈피지오짱샘 도구 모음 허브"였음(킁킁메이트·i-talk 카드). 도구들이 jjangsaem.com 서브도메인으로 이전하면서 junominu.com을 개인 작업실로 전환. 옛 허브 코드는 git 태그 **`archive-tools-hub`**에 보존됨 (`git checkout archive-tools-hub`로 확인 가능).

## 프로젝트 추가 방법 (핵심)

`src/projects.js`의 `PROJECTS` 배열에 객체 하나만 추가하면 카드가 자동 생성됨. 그게 전부.

```js
{
  name: "프로젝트 이름",
  emoji: "✨",
  description: "한 줄 설명.",
  url: "https://...",        // 없으면 클릭 안 되는 구상 카드
  status: "live",            // live | building | idea
  tags: ["태그1", "태그2"],
}
```

`ME` 객체(이름·태그라인·소개·about·now·links·stack·since)도 같은 파일에서 수정.

### 프로젝트 상세 페이지(메이킹 스토리) — Phase 2

프로젝트 객체에 `slug`와 `detail`을 넣으면, 그 카드는 외부 링크 대신 **내부 상세 페이지 `/p/:slug`**로 이동한다(상세에서 "사이트 열기" 버튼으로 외부 이동). `detail`이 없으면 기존처럼 카드 클릭 시 바로 외부 링크. 상세는 전부 **데이터 자동 렌더**(파일럿: 중개프로).

```js
{
  name: "중개프로", slug: "jungaepro", emoji: "🏢",
  description: "...", url: "https://...", status: "building", tags: [...],
  detail: {
    started: "2026-02-10",          // "0 → 베타/배포 N일" 자동 계산(launched 없으면 오늘까지)
    launched: "2026-06-01",         // (선택) 배포일
    summary:   ["왜 만들었나 문단", ...],
    features:  ["핵심 기능", ...],
    stack:     ["React", "Supabase", ...],
    timeline:  [{ date: "2026-02-10", label: "첫 커밋" }, ...],
    challenges:["막혔던 점", ...],
    prompts:   [{ title: "...", text: "핵심 프롬프트" }, ...],
    retro:     ["회고 문단", ...],
  },
}
```

상세 페이지는 `detail`에 있는 필드만 골라 렌더하므로, 채우고 싶은 것만 넣으면 된다.

## 구조

```
junominu/
├── index.html          # 메타 + Pretendard CDN + 이모지 파비콘(⚡)
├── vercel.json         # SPA fallback rewrites (/(.*) → /index.html, 상세 페이지 새로고침 404 방지)
├── src/
│   ├── main.jsx        # 진입점 (렌더 전 captureAttribution() 1회 호출)
│   ├── attribution.js  # 유입 경로(utm/referrer)를 첫 진입 때 sessionStorage에 first-touch 저장 → /contact가 Tally 숨김필드 src로 전달
│   ├── App.jsx         # 라우터 셸: BrowserRouter + Routes(/, /p/:slug, /blog, /blog/:slug, /prompts, /contact) + ScrollToTop + BackToTop
│   ├── Home.jsx        # 홈: Hero(코칭·외주 CTA 버튼)·지표·About·Now·STACK·JOURNEY(시간순)·PROJECTS·ContactCTA 밴드·풋터 + ProjectCard (내비 BLOG·함께하기, 풋터 프롬프트노트·블로그·코칭외주 링크)
│   ├── ProjectDetail.jsx # 상세 페이지 — detail 데이터로 자동 렌더(/p/:slug). cover/shots 이미지 지원
│   ├── Contact.jsx     # 함께하기 (/contact) — ME.contact 로 1:1 코칭·외주 오퍼 카드 자동 렌더. 버튼은 외부 폼(formUrl)→없으면 Gmail 폴백
│   ├── Blog.jsx        # 블로그 목록 (/blog)
│   ├── Post.jsx        # 블로그 글 (/blog/:slug) — marked로 .md 렌더
│   ├── Prompts.jsx     # 프롬프트 노트 (/prompts) — 전 프로젝트 detail.prompts 자동 집계
│   ├── blogData.js     # src/posts/*.md 로딩 + frontmatter 파싱 → POSTS + findPost
│   │                   #   ⚠️ 파일명 주의: 컴포넌트 Blog.jsx와 대소문자 충돌(Windows) 피하려 blogData.js
│   ├── BackToTop.jsx   # 우측 하단 "맨 위로" 버튼
│   ├── Logo.jsx        # 로고 마크
│   ├── projects.js     # ME(+ME.contact) + PROJECTS + STATUS + findProject (데이터, 여기만 고치면 됨)
│   ├── posts/          # 블로그 글 .md (frontmatter + 본문). 파일 추가하면 글이 자동 생김
│   ├── index.css       # 다크 테마 토큰 + 리셋 + scroll-behavior
│   └── App.css         # 레이아웃·카드·상태 pill·상세·블로그·JOURNEY·프롬프트·내비·버튼 스타일
├── public/
│   ├── shots/          # 프로젝트 스크린샷(README.md에 사용법). 경로는 /shots/...
│   ├── og.png          # OG/SNS 미리보기 이미지 1200×630 (index.html og:image). 재생성법은 아래
│   ├── sitemap.xml     # 정적 사이트맵 (프로젝트/글 추가 시 같이 갱신)
│   └── robots.txt
├── scripts/
│   └── prerender-meta.js  # 빌드 후 라우트별 정적 HTML 생성(제목·OG 치환). npm run build에 물려 있음
└── vite.config.js
```

라우팅은 **react-router-dom v7**. 카드 클릭 동작·상태 pill은 `STATUS`(projects.js export)를 홈/상세가 공용으로 쓴다.

### 스크린샷 추가 (프로젝트 상세)

`public/shots/`에 캡처를 넣고, `projects.js`의 해당 `detail`에 경로를 적으면 상세 페이지에 표시된다. 경로는 **`/shots/...`로 시작**(앞에 `public` 뺌). 파일이 없으면 자동 숨김(에러 안 남).

```js
detail: {
  cover: "/shots/jungaepro-cover.png",   // 히어로 아래 큰 배너(선택)
  coverCaption: "대시보드",               // (선택)
  shots: [                                // "화면" 섹션(선택) — 문자열 또는 {src, caption}
    "/shots/jungaepro-1.png",
    { src: "/shots/jungaepro-2.png", caption: "계약서 PDF" },
  ],
}
```

### 코칭·외주 문의 (/contact) — 외부 폼 연결

스레드 프로필이 "1:1 코칭·외주 문의 ↓ junominu.com"으로 유도하므로, 그 접점을 `/contact`에 둔다. 백엔드가 없어 **접수는 외부 폼**(구글폼/Tally)으로 받는다.

- 데이터는 `projects.js`의 `ME.contact` 하나에 모여 있고, `Contact.jsx`가 자동 렌더한다(오퍼 카드 = `ME.contact.offers[]`).
- **폼 연결**: 구글폼/Tally로 폼을 만든 뒤 `ME.contact.formUrl`에 링크만 붙이면 모든 "신청/문의" 버튼이 그 폼으로 연결된다. 코칭·외주를 다른 폼으로 받으려면 각 `offers[].formUrl`로 개별 지정.
- **Tally 팝업 임베드**: `ME.contact.formId`(예: `b5EKOL`)가 있으면 /contact 오퍼 버튼이 새 탭 대신 **Tally 팝업**으로 사이트 안에서 폼을 연다(`embed.js` 로드 → `Tally.openPopup`). 코칭/외주 구분은 `offers[].typeValue`를 Tally **숨김필드 `type`**로 전달(팝업=hiddenFields, 새 탭 폴백=`?type=`). Tally 스크립트 미로딩 시 새 탭으로 폴백.
- **유입 경로 추적(숨김필드 `src`)**: `src/attribution.js`가 **첫 진입 때** utm/referrer를 붙잡아 `sessionStorage`에 저장하고(`main.jsx`에서 렌더 전 1회 호출), /contact가 그 값을 Tally 숨김필드 **`src`**로 함께 보낸다 → "어느 스레드 글이 문의를 만들었나"가 응답에 기록된다.
  - 값 형식: `threads/bokjimoa-anchor`(utm_source/utm_campaign) → 없으면 `l.threads.com`(referrer 호스트) → 없으면 `direct`.
  - **first-touch**(최초 유입 유지, 덮어쓰지 않음). SPA 라우팅으로 쿼리가 사라지기 전에 잡아야 해서 `main.jsx`에서 호출한다.
  - ✅ **폼 `b5EKOL`에 숨김필드 `src`·`type` 둘 다 생성 완료**(2026-07-23, 폼 정의에서 확인). 폼을 새로 만들거나 바꾸면 이 두 필드를 다시 만들어야 한다 — 없으면 값이 조용히 버려진다.
  - ⚠️ 폼이 없어 Gmail 폴백으로 갈 때는 `src`가 전달되지 않는다(제목만 채움).
- **폴백**: `formUrl`·`formId`가 비어 있으면 버튼이 `subject`가 채워진 Gmail 작성창(`ME.contact.email`)으로 열린다 → 폼이 없어도 죽은 링크가 안 생김.
- 홈 진입점: 히어로 CTA 버튼 + 내비 "함께하기" + 하단 `ContactCTA` 밴드(`#contact`) + 풋터 "코칭·외주". 문안(오퍼·소개)은 전부 `ME.contact`에서 수정.

### 블로그 글 추가 (Phase 3)

`src/posts/`에 `.md` 파일 하나 추가하면 `/blog` 목록과 `/blog/:slug` 글이 자동 생성된다. 파일 맨 위 frontmatter:

```markdown
---
title: 글 제목
date: 2026-06-01
summary: 목록에 보일 한 줄 요약
tags: [바이브코딩, 회고]
slug: my-post          # (선택) 없으면 파일명에서 자동(날짜 접두사 제거)
cover: /shots/xxx.png  # (선택) 공유 카드 이미지. 없으면 본문 첫 이미지가 자동 사용
updated: 2026-08-01    # (선택) 나중에 고쳤을 때만 — JSON-LD dateModified
---
여기부터 본문 마크다운...
```

`blogData.js`가 `import.meta.glob`로 전부 읽어 frontmatter를 파싱하고 `marked`로 HTML 변환, 날짜 내림차순 정렬. 새 글·프로젝트를 추가하면 **`public/sitemap.xml`에도 URL 한 줄 추가**할 것.

**글 쓰는 건 `/blog-post` 스킬이 한다** (`.claude/skills/blog-post/`) — 프로젝트 slug 하나를 주면 `src/projects.js`의 `detail` 실데이터로 2,000~3,000자 SEO 글을 쓰고, 이미지는 `public/shots/`의 실제 앱 캡처를 재사용(모자라면 라이브 URL을 헤드리스로 캡처)한다. 사이트맵 갱신·자수·빌드 검증까지 포함.

**본문에서 쓸 수 있는 것** (`.prose` 스타일이 `App.css`에 있음):
- `<div class="byline">` 글쓴이(E-E-A-T) · `<div class="answer">` 한 줄 답(AI 검색 인용용) · `<div class="post-cta">` 끝 CTA 버튼
- 마크다운 표(좁은 화면에선 표가 가로 스크롤) · 이미지(카드 테두리 자동) · `<figure>`+`<figcaption>` 캡션
- ⚠️ **JSON-LD `<script>`를 본문에 넣지 말 것** — SPA라 크롤러가 못 본다. 아래 프리렌더가 대신 심는다.
- ⚠️ **H1(`#`) 금지** — 제목은 `title` 필드가 `<h1>`으로 그려진다. TOC도 쓰지 않는다(`marked@18`은 제목에 `id`를 안 붙여 점프 링크가 죽음).

### 라우트별 메타·OG 프리렌더 (중요)

SPA라 모든 경로가 같은 `index.html`을 받는데, **스레드·카카오톡·구글 크롤러는 JS를 실행하지 않는다.** 그래서 `/p/bokjimoa`를 공유해도 미리보기 카드가 "사이트 공통 OG"로 떴다. 이를 막기 위해 **빌드 후 라우트마다 정적 HTML을 만들어 메타만 갈아끼운다.**

- 스크립트: `scripts/prerender-meta.js` — `npm run build`에서 `vite build` **다음에 자동 실행**.
- 산출물: `dist/p/<slug>/index.html`, `dist/blog/<slug>/index.html`, `dist/{blog,prompts,contact}/index.html` (+ 원본 `dist/index.html` = `/`).
- 데이터 원천은 `src/projects.js`와 `src/posts/*.md` → **프로젝트·글을 추가하면 자동으로 늘어난다.** 스크립트를 고칠 필요 없음.
- 프로젝트 상세는 `detail.cover`(없으면 `detail.thumb`)를 **og:image로** 쓴다 → 공유 카드에 실제 제품 화면이 뜬다. 스크린샷은 1200×630이 아니라서 `og:image:width/height` 태그는 자동 제거된다.
- **블로그 글도 같다** — frontmatter `cover`, 없으면 **본문 첫 이미지**를 og:image로 쓴다.
- **구조화 데이터(JSON-LD)도 여기서 심는다** — 글마다 `</head>` 직전에:
  - `BlogPosting` — frontmatter(`title`·`summary`·`date`·`updated`·`tags`) + og:image에서 자동 생성.
  - `FAQPage` — 본문의 **`### Q. 질문` + 바로 아래 문단** 형식을 파싱해서 만든다(`### Q1.`도 인식). **2개 이상일 때만** 생성(부실한 스키마를 내보내지 않기 위해).
  - 확인: `dist/blog/<slug>/index.html`에서 `application/ld+json` 블록이 1~2개.
- `vercel.json`은 그대로 둔다 — **Vercel은 rewrites보다 실제 파일을 먼저 서빙**하므로, 파일이 있는 경로는 프리렌더본이 나가고 없는 경로만 SPA fallback으로 넘어간다.
- ⚠️ `npm run dev`/`vite preview`에는 적용되지 않는다(빌드 산출물이라). **메타 확인은 배포본에서** 할 것.

### OG 이미지 재생성

`public/og.png`(1200×630)는 빌드 산출물이 아니라 별도로 만든 정적 이미지다. 디자인을 바꾸려면 사이트 톤에 맞춘 카드 HTML(1200×630, Pretendard CDN)을 임시로 만들고 **Chrome 헤드리스로 스크린샷**을 떠서 `public/og.png`를 덮어쓰면 된다:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --disable-gpu `
  --force-device-scale-factor=1 --window-size=1200,630 `
  --screenshot="public/og.png" "file:///<카드 html 절대경로>"
```

(폰트가 CDN이라 렌더 후 잠깐 대기. 작업용 임시 HTML 폴더는 커밋하지 말 것.)

> 🚨 **모바일 폭 확인에 `--window-size`를 쓰지 말 것.** Windows Chrome은 창 폭에 **하한(약 500px)** 이 있어, `--window-size=430`을 줘도 **512px로 렌더한 뒤 PNG만 430으로 크롭**한다 → 오른쪽이 잘린 그림이 나와 "레이아웃이 넘친다"고 오진하게 된다(2026-07-22 실제 발생). 모바일은 **CDP `Emulation.setDeviceMetricsOverride`** 로 뷰포트를 강제해서 볼 것. OG 이미지(1200×630)처럼 500px 넘는 폭은 영향 없음.

## 디자인

- 다크 테마. 배경 `#0b0d12`, accent 보라 `#7c5cff` / 시안 `#22d3ee`
- 상태 색: live=초록, building=노랑, idea=회색
- 폰트: Pretendard (index.html에서 CDN 로드)
- 분위기: 메이커의 작업실/콕핏 (미니멀, 카드 hover lift)

## 명령어

```bash
npm install      # 의존성 설치
npm run dev      # Vite dev 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 로컬 확인
```

배포: `main` 브랜치 push → Vercel 자동 배포 → `junominu.com`.

## 참고

- **작업 이력·다음 할 일**: 루트 `WORKLOG.md` — 세션별 작업 내역/현재 상태/TODO/핵심 참조.
  - 🔴 **"이제 뭐 해야 해?" 라는 질문을 받으면 `WORKLOG.md` 맨 위의 「▶ 지금 할 차례」 블록을 읽고 거기서부터 안내한다.** 우선순위(2순위 → 3순위 → 4순위)와 손댈 파일까지 적혀 있다.
  - 이어 작업할 땐 **여기부터** 읽고, 마치면 「▶ 지금 할 차례」를 갱신한 뒤 새 날짜 섹션을 추가할 것.
- **블로그 글쓰기**: `.claude/skills/blog-post/SKILL.md` — 프로젝트 1개 → 글 1편. 분량·이미지·FAQ·검증 규약이 전부 여기 있다. 짱샘의 책방 `/add-blog-and-reviews-to-ebook`을 이 사이트(정적 md·앱 캡처·짧은 분량)에 맞게 옮긴 것.
- **스레드 채널 운영**: `.claude/skills/threads-post/` 3단 구조 — `SKILL.md`(글 한 편) / `threads-strategy.md`(채널 운영·플랫폼 팩트·KPI) / `threads-log.md`(발행 이력·월간 KPI). 플랫폼 사실이 어긋나면 **전략 §1이 우선**(기준일·출처 있음).
- 사업자 정보(강남상회) 풋터는 옛 허브에 있었으나 개인 작업실로 전환하며 제거함. 직접 판매(통신판매) 페이지가 아니면 표시 의무 없음. 필요 시 풋터에 다시 추가 가능.
- 관련 전략 문서(도구 쪽): 책방 repo `docs/tools-strategy.md`. 단, **이 사이트 자체는 그 전략과 무관한 개인 프로젝트**임.
