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
│   ├── App.jsx         # 라우터 셸: BrowserRouter + Routes(/, /p/:slug) + ScrollToTop + BackToTop
│   ├── Home.jsx        # 홈: Hero·지표·About·Now·STACK·PROJECTS 그리드·풋터 + ProjectCard
│   ├── ProjectDetail.jsx # 상세 페이지 — detail 데이터로 자동 렌더(/p/:slug)
│   ├── BackToTop.jsx   # 우측 하단 "맨 위로" 버튼
│   ├── Logo.jsx        # 로고 마크
│   ├── projects.js     # ME + PROJECTS + STATUS + findProject (데이터, 여기만 고치면 됨)
│   ├── index.css       # 다크 테마 토큰 + 리셋 + scroll-behavior
│   └── App.css         # 레이아웃·카드·상태 pill·상세·내비·버튼 스타일
├── public/             # (현재 비어 있음)
└── vite.config.js
```

라우팅은 **react-router-dom v7**. 카드 클릭 동작·상태 pill은 `STATUS`(projects.js export)를 홈/상세가 공용으로 쓴다.

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
