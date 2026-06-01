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
│   ├── main.jsx        # 진입점
│   ├── App.jsx         # 라우터 셸: BrowserRouter + Routes(/, /p/:slug, /blog, /blog/:slug, /prompts) + ScrollToTop + BackToTop
│   ├── Home.jsx        # 홈: Hero·지표·About·Now·STACK·JOURNEY(시간순)·PROJECTS·풋터 + ProjectCard (내비 BLOG, 풋터 프롬프트노트·블로그 링크)
│   ├── ProjectDetail.jsx # 상세 페이지 — detail 데이터로 자동 렌더(/p/:slug). cover/shots 이미지 지원
│   ├── Blog.jsx        # 블로그 목록 (/blog)
│   ├── Post.jsx        # 블로그 글 (/blog/:slug) — marked로 .md 렌더
│   ├── Prompts.jsx     # 프롬프트 노트 (/prompts) — 전 프로젝트 detail.prompts 자동 집계
│   ├── blogData.js     # src/posts/*.md 로딩 + frontmatter 파싱 → POSTS + findPost
│   │                   #   ⚠️ 파일명 주의: 컴포넌트 Blog.jsx와 대소문자 충돌(Windows) 피하려 blogData.js
│   ├── BackToTop.jsx   # 우측 하단 "맨 위로" 버튼
│   ├── Logo.jsx        # 로고 마크
│   ├── projects.js     # ME + PROJECTS + STATUS + findProject (데이터, 여기만 고치면 됨)
│   ├── posts/          # 블로그 글 .md (frontmatter + 본문). 파일 추가하면 글이 자동 생김
│   ├── index.css       # 다크 테마 토큰 + 리셋 + scroll-behavior
│   └── App.css         # 레이아웃·카드·상태 pill·상세·블로그·JOURNEY·프롬프트·내비·버튼 스타일
├── public/
│   ├── shots/          # 프로젝트 스크린샷(README.md에 사용법). 경로는 /shots/...
│   ├── og.png          # OG/SNS 미리보기 이미지 1200×630 (index.html og:image). 재생성법은 아래
│   ├── sitemap.xml     # 정적 사이트맵 (프로젝트/글 추가 시 같이 갱신)
│   └── robots.txt
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

### 블로그 글 추가 (Phase 3)

`src/posts/`에 `.md` 파일 하나 추가하면 `/blog` 목록과 `/blog/:slug` 글이 자동 생성된다. 파일 맨 위 frontmatter:

```markdown
---
title: 글 제목
date: 2026-06-01
summary: 목록에 보일 한 줄 요약
tags: [바이브코딩, 회고]
slug: my-post          # (선택) 없으면 파일명에서 자동(날짜 접두사 제거)
---
여기부터 본문 마크다운...
```

`blogData.js`가 `import.meta.glob`로 전부 읽어 frontmatter를 파싱하고 `marked`로 HTML 변환, 날짜 내림차순 정렬. 새 글·프로젝트를 추가하면 **`public/sitemap.xml`에도 URL 한 줄 추가**할 것.

### OG 이미지 재생성

`public/og.png`(1200×630)는 빌드 산출물이 아니라 별도로 만든 정적 이미지다. 디자인을 바꾸려면 사이트 톤에 맞춘 카드 HTML(1200×630, Pretendard CDN)을 임시로 만들고 **Chrome 헤드리스로 스크린샷**을 떠서 `public/og.png`를 덮어쓰면 된다:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --disable-gpu `
  --force-device-scale-factor=1 --window-size=1200,630 `
  --screenshot="public/og.png" "file:///<카드 html 절대경로>"
```

(폰트가 CDN이라 렌더 후 잠깐 대기. 작업용 임시 HTML 폴더는 커밋하지 말 것.)

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

- 사업자 정보(강남상회) 풋터는 옛 허브에 있었으나 개인 작업실로 전환하며 제거함. 직접 판매(통신판매) 페이지가 아니면 표시 의무 없음. 필요 시 풋터에 다시 추가 가능.
- 관련 전략 문서(도구 쪽): 책방 repo `docs/tools-strategy.md`. 단, **이 사이트 자체는 그 전략과 무관한 개인 프로젝트**임.
