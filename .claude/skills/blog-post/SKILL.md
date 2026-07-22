---
name: blog-post
description: >-
  junominu.com 블로그(/blog)에 올릴 글 한 편을 만든다. 프로젝트 1개(src/projects.js의 slug)를
  받아 그 detail 실데이터(타임라인·막힌 점·프롬프트·회고)로 2,000~3,000자 SEO 글을 쓰고,
  이미지는 public/shots/ 의 실제 앱 캡처를 재사용(부족하면 라이브 URL을 헤드리스로 새로 캡처)한다.
  src/posts/<날짜>-<slug>.md 파일 생성 + sitemap.xml 갱신 + 빌드 검증까지 한 번에.
  구조화 데이터(BlogPosting·FAQPage)는 빌드 때 scripts/prerender-meta.js 가 자동으로 심는다.
  "블로그 글 써줘", "블로그 글 추가", "펫포토로 글 하나", "블로그 SEO 글", "포스트 초안",
  "이 프로젝트로 블로그", "블로그 채우자" 같은 요청에 트리거.
---

# 블로그 글쓰기 스킬 — junominu.com

프로젝트 **1개 → 글 1편**. 9개 프로젝트가 곧 9편의 글감이다.

목표는 "잘 쓴 글"이 아니라 **검색·AI 검색에서 발견되고, 읽은 사람이 `/p/<slug>` 또는 `/contact`로 넘어가는 글**이다.
스레드(짧게) → **블로그(깊게)** → 문의로 이어지는 가운데 고리를 채운다.

---

## 0. 이 스킬의 입·출력

- **입력**: ① 대상 프로젝트 slug(없으면 물어본다), ② (선택) 강조할 각도·사연.
- **출력**:
  1. `src/posts/YYYY-MM-DD-<post-slug>.md` 파일 1개
  2. 필요 시 `public/shots/`에 새 캡처
  3. `public/sitemap.xml`에 URL 한 줄 추가
  4. 검증 결과 보고(자수·이미지·FAQ·JSON-LD·빌드)
- **원재료는 반드시 `src/projects.js`의 `detail`에서 읽는다.** 날짜·커밋 수·기능·막힌 점을 **지어내지 말 것**. 없으면 사용자에게 묻는다.
- **쓰기 전 `src/posts/`의 기존 글을 먼저 훑는다.** 각도·제목·소재가 겹치면 다른 각도로 튼다.

---

## 1. 이 사이트의 제약 (원본 스킬과 다른 점)

짱샘의 책방 `/add-blog-and-reviews-to-ebook`을 옮겨 왔지만, 토대가 달라 아래는 **바꿔서** 쓴다.

| 항목 | 원본(책방) | 여기(junominu) |
|---|---|---|
| 저장 | Supabase `blog_posts` (HTML) | **`src/posts/*.md` 파일 하나** |
| 등록 | 스크립트로 upsert | **파일 추가 = 끝** (`blogData.js`가 자동 수집) |
| 분량 | 8,000~9,500자 | **2,000~3,000자** |
| 이미지 | Gemini 인포그래픽 9~10장 | **실제 앱 캡처 3~5장** |
| TOC | 필수 | **안 쓴다** — `marked@18`은 제목에 `id`를 안 붙여 점프 링크가 죽는다. 3,000자엔 어차피 과함 |
| JSON-LD | 본문에 인라인 | **본문에 넣지 말 것** — 빌드 때 `prerender-meta.js`가 심는다(§5) |
| 후기(testimonials) | 5~7개 생성 | **없음** — 개인 작업실이라 해당 없음 |

> ⚠️ **본문에 `<script type="application/ld+json">`을 절대 넣지 않는다.** 이 사이트는 SPA라 크롤러가 보는 건 프리렌더된 정적 HTML이고, 본문 스크립트는 `dangerouslySetInnerHTML`로 들어가 실행도 노출도 되지 않는다. 구조화 데이터는 §5의 규약만 지키면 자동으로 붙는다.

---

## 2. 실행 순서

### 단계 1 — 대상 프로젝트 확정 + 실데이터 수집

1. `src/projects.js`에서 대상 프로젝트 객체를 읽는다. slug가 모호하면 후보를 보여주고 사용자에게 고르게 한다.
2. `detail`에서 다음을 뽑아 메모한다 — **이게 글의 뼈대다**:
   - `started` / `launched` → "0 → 배포 N일" (숫자는 근거가 된다)
   - `commits` → 누적 커밋 수
   - `features`, `stack` → 무엇을 어떻게 만들었나
   - `timeline` → 시간 순서
   - `challenges` → **막힌 점 = 가장 좋은 글감**
   - `prompts` → 실제로 쓴 프롬프트(그대로 인용 가능한 자산)
   - `retro` → 회고
3. `detail`이 아예 없는 프로젝트면 글을 쓸 재료가 없다 → 사용자에게 알리고 중단하거나, 재료를 받아온다.
4. `src/posts/`의 기존 글 제목·slug를 확인해 **중복 각도 회피**.

### 단계 2 — 각도 · 제목 · 요약

**각도는 3개 중 하나를 고른다.** (재료가 결정한다)

| 각도 | 언제 | 주 재료 | 제목 예 |
|---|---|---|---|
| **삽질형** | `challenges`가 구체적일 때 | 막힌 점 → 원인 → 해결 | "결제 연동에서 3일 막혔다 — 원인은 코드가 아니었다" |
| **방법형** | `prompts`·`features`가 풍부할 때 | 재현 가능한 N단계 | "AI에게 시켜서 반려동물 사진 앱 만든 순서" |
| **결정형** | `retro`·`stack` 선택이 흥미로울 때 | 왜 A 대신 B | "Next.js 대신 Vite를 고른 이유" |

**제목 규칙**
- **25~35자.** 한글은 글자 폭이 넓어 영문 기준(60자)을 쓰면 검색 결과에서 잘린다.
- 핵심 키워드를 **앞 15자 안에** 넣는다.
- 질문형 / 숫자형 / 반전형 중 하나. 밋밋한 명사 나열 금지.
- 사람이 실제로 검색할 말을 쓴다. ("바이브 코딩", "Supabase 결제", "Claude Code" 같은 실검색어)

**요약(`summary` = 메타 description) 규칙**
- **70~90자.** 검색 결과 아래 줄에 그대로 뜬다. 한글은 이 근처에서 잘린다.
- 검색 의도 + 핵심 키워드 + 숫자 + "어떻게 됐는지" 한 줄.
- 예: `결제 연동이 3일 막혔다. 원인은 코드가 아니라 환경변수였다. 비개발자가 Supabase·Toss 붙이며 겪은 삽질과 해결 순서.`

**타깃 키워드 1개 + 변형 2개**를 먼저 정하고, 제목·요약·첫 문단·H2 하나에 자연스럽게 넣는다. 억지로 반복하지 않는다(3,000자에 5~7회면 충분).

### 단계 3 — 이미지 확보 (실제 앱 캡처 우선)

**글당 3~5장.** 순서대로 시도한다.

1. **`public/shots/` 재사용** — 이미 18장 있다. `ls public/shots`로 확인하고 주제에 맞는 걸 먼저 쓴다.
   `bokjimoa-cover` `brain-home` `italk-report` `italk-upload` `jjangsaem-cover` `jungaepro-cover`
   `kungkung-{home,breath,record,scent,timer}` `petphoto-{cover,original,studio,hanbok,fantasy}`
   `soriya-cover` `transcripto-cover`
2. **모자라면 라이브 URL을 새로 캡처** — 프로젝트의 `url`을 헤드리스 크롬으로:
   ```powershell
   & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --disable-gpu `
     --window-size=1280,800 --hide-scrollbars `
     --screenshot="public/shots/<slug>-<이름>.png" "<프로젝트 URL>"
   ```
   - 파일명 규칙: `<프로젝트slug>-<화면이름>.png` (기존 규칙과 동일)
   - **기존 파일 덮어쓰기 금지.** 이미 있으면 다른 이름을 쓰거나 그대로 재사용.
   - 🚨 **모바일 폭 캡처에 `--window-size`를 쓰지 말 것.** 윈도우 크롬은 창 폭 하한(약 500px)이 있어 512px로 렌더한 뒤 PNG만 잘라낸다 → 잘린 그림이 나온다. 모바일 화면이 꼭 필요하면 CDP `Emulation.setDeviceMetricsOverride`를 쓴다. (1280 같은 데스크톱 폭은 영향 없음)
   - 로그인·결제 뒤 화면은 캡처가 안 된다 → 그 슬롯은 **빼거나** 사용자에게 캡처를 요청한다. 없는 화면을 만들어내지 말 것.
3. **다이어그램은 만들지 않는다.** 이 스킬은 캡처만 쓴다. 흐름 설명이 꼭 필요하면 **표**나 번호 목록으로 대신한다.

**이미지 규칙**
- 모든 이미지에 **한국어 alt 25~50자** — 키워드 + 무엇이 보이는 화면인지. (`"펫포토 AI 스튜디오 스타일 결과물 화면"`)
- 히어로(첫 이미지)를 뺀 나머지는 `loading="lazy"`.
- 첫 이미지는 **공유 카드 이미지(og:image)로 자동 사용된다**(§5). 그러니 첫 장은 제품이 잘 드러나는 화면으로.
- 캡션이 필요하면 `<figure>`를 쓴다(마크다운 이미지 문법은 캡션을 못 단다).

### 단계 4 — 본문 작성

**분량: 한글 2,000~3,000자**(HTML 태그·공백·영문 제외). 미달이면 얇은 글로 취급되고, 초과하면 이 사이트 톤에 비해 무겁다.

#### 파일 규약

- 경로: `src/posts/YYYY-MM-DD-<post-slug>.md` (오늘 날짜)
- `post-slug`: 영어 kebab-case. 프로젝트 slug를 접두사로 두면 정리가 쉽다 (`petphoto-payment-debug`)

#### frontmatter

```markdown
---
title: 제목 25~35자
date: 2026-07-23
summary: 요약 70~90자 — 검색 결과에 그대로 뜬다
tags: [바이브코딩, 삽질기, Supabase]
slug: petphoto-payment-debug
cover: /shots/petphoto-cover.png   # (선택) 공유 카드 이미지. 없으면 본문 첫 이미지가 자동 사용
updated: 2026-08-01                # (선택) 나중에 고쳤을 때만
---
```

- `tags`는 3~5개. 기존 글의 태그를 재사용해 묶이게 한다.
- `date`는 파일명 날짜와 **반드시 일치**.

#### 본문 구조 (H2 5~6개)

```markdown
<div class="byline">
  <strong>JunoMinu</strong> · 비개발자 출신 1인 메이커 · 22년 IT 경력(시스템 아키텍트)
  <br />AI 바이브 코딩으로 혼자 기획·개발·운영합니다. · 2026년 7월 23일
</div>

![펫포토 AI 랜딩 화면 — 반려동물 사진 업로드 영역](/shots/petphoto-cover.png)

도입 hook 2~3문장. **핵심 키워드를 첫 100자 안에** 넣는다. 상황을 한 장면으로 던진다.
"결제 연동만 남았다고 생각했다. 그 상태로 3일이 갔다." 처럼.

<div class="answer">
  <strong>한 줄 답</strong>
  <p>결론을 40~80자로 먼저 말한다. AI 검색(AI Overviews·Perplexity)이 통째로 인용하는 자리다. 숫자·구체어를 넣는다.</p>
</div>

## [H2 #1 — 무엇을 만들려 했나 / 어디서 막혔나]

300~450자. 프로젝트 한 줄 소개 + 이 글이 다루는 문제. `detail.started`·`commits` 같은
실제 숫자를 여기서 한 번 쓴다.

## [H2 #2 — 원인 / 원리]

300~450자. 왜 그런 일이 생겼는지. 비개발자가 이해할 수 있는 비유로.

![원인이 드러나는 화면](/shots/xxx.png)

## [H2 #3 — 해결한 순서]

번호 목록 4~6개. 각 항목 60~120자. 재현 가능하게 구체적으로.

1. **1단계: ~한다** — 무엇을, 어디서, 어떻게
2. ...

## [H2 #4 — 표로 정리]

표 **1개 필수**. 비교(오해 vs 사실 / 전 vs 후 / A안 vs B안) 또는 단계표.
컬럼 3~4개, 행 3~6개. AI 검색이 가장 잘 인용하는 포맷이다.

| 구분 | 처음 생각 | 실제 |
|---|---|---|
| ... | ... | ... |

![결과 화면](/shots/xxx.png)

## 자주 묻는 질문

### Q. 실제로 검색될 법한 질문?

답변 100~180자. 한 문단으로. **이 형식(`### Q.` + 바로 아래 문단)을 지켜야
FAQ 구조화 데이터가 자동 생성된다**(§5).

### Q. 두 번째 질문?

답변 100~180자.

### Q. 세 번째 질문?

답변 100~180자.

## 마치며 — 3줄 요약

- 핵심 1 (문제)
- 핵심 2 (해결)
- 핵심 3 (배운 것)

마무리 2~3문장. 다음에 뭘 할지, 또는 이 경험이 남긴 것.

**함께 보기**
- [펫포토 AI 메이킹 스토리](/p/petphoto) — 이 프로젝트를 만든 전 과정
- [프롬프트 노트](/prompts) — 실제로 쓴 프롬프트 모음
- [관련 글 제목](/blog/<다른-글-slug>)

<div class="post-cta">
  <a href="/p/petphoto">🐾 펫포토 AI 메이킹 스토리 보기 →</a>
</div>
```

#### 본문 체크

- **H1(`#`)을 쓰지 않는다.** 제목은 `title` 필드가 담당하고 `Post.jsx`가 `<h1>`으로 그린다.
- 내부 링크 **2~4개** — `/p/<slug>` 1개(필수) + `/prompts` 또는 다른 글 1~2개 + 문의가 자연스러우면 `/contact` 1개.
- 외부 링크는 **공식 문서만**(Supabase·React·Vercel 등). 개인 블로그·홍보 글 인용 금지. `rel="nofollow"`는 필요 없다(공식 문서라).
- 해시태그 줄은 넣지 않는다 — 스레드용이지 블로그용이 아니다. 분류는 `tags` 필드가 한다.
- 코드 블록은 언어 태그 필수(` ```js `).

### 단계 5 — 구조화 데이터 (자동, 규약만 지키면 됨)

`npm run build` 때 `scripts/prerender-meta.js`가 `dist/blog/<slug>/index.html`에 아래를 자동으로 심는다.

| 무엇 | 어디서 오나 | 내가 지켜야 할 것 |
|---|---|---|
| `BlogPosting` | frontmatter 전부 | `title`·`date`·`summary`·`tags`를 빠짐없이 |
| `datePublished` / `dateModified` | `date` / `updated` | 고칠 땐 `updated`를 갱신 |
| `og:image` (공유 카드) | `cover` → 없으면 **본문 첫 이미지** | 첫 이미지를 제품이 잘 보이는 걸로 |
| `FAQPage` | 본문의 `### Q.` 블록 | **`### Q. 질문` + 바로 아래 문단** 형식, **최소 2개**(3개 권장) |

FAQ가 2개 미만이면 `FAQPage`는 아예 생성되지 않는다(잘못된 스키마를 내보내는 것보다 낫다).

### 단계 6 — 저장 · 사이트맵 · 검증

1. **파일 저장** — `src/posts/YYYY-MM-DD-<slug>.md`
2. **`public/sitemap.xml`에 한 줄 추가**:
   ```xml
   <url><loc>https://www.junominu.com/blog/<slug></loc><lastmod>YYYY-MM-DD</lastmod></url>
   ```
   (기존 항목 형식을 그대로 따를 것 — 파일을 먼저 읽는다)
3. **자수 검증** — 2,000~3,000자인지 실제로 센다:
   ```bash
   node -e "const fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8').replace(/^---[\s\S]*?---/,'').replace(/<[^>]+>/g,'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]*)\]\([^)]*\)/g,'\$1').replace(/[!-~]/g,'').replace(/\s+/g,'');console.log(s.length+'자')" src/posts/<파일>.md
   ```
   - 미달이면 H2 #2(원인)·#3(순서)·FAQ를 우선 보강. 표·이미지·byline·CTA는 건드리지 않는다.
   - 초과면 H2 #1(배경)을 줄인다.
4. **빌드 + 프리렌더**: `npm run build` → `dist/blog/<slug>/index.html`이 생겼는지 확인
5. **JSON-LD 확인**: 그 파일에서 `application/ld+json` 블록이 1~2개 나오는지, JSON이 파싱되는지
   ```bash
   node -e "const h=require('fs').readFileSync(process.argv[1],'utf8');const b=h.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)||[];console.log(b.length+'개');b.forEach(x=>JSON.parse(x.replace(/<\/?script[^>]*>/g,'')))" dist/blog/<slug>/index.html
   ```
6. **lint**: `npm run lint`
7. **이미지 존재 확인**: 본문에 쓴 `/shots/...` 파일이 `public/shots/`에 실제로 있는지

### 단계 7 — 보고

한 번에 출력:
- 파일 경로 · slug · 제목(글자수) · 요약(글자수)
- **본문 자수** (2,000~3,000 통과 여부)
- 이미지 목록 — 재사용 / 새로 캡처 구분
- FAQ 문항 수, 표 개수, 내부 링크 목록
- JSON-LD 블록 수(1 또는 2) + og:image 경로
- 빌드·lint 결과
- 확인 URL: `/blog/<slug>` · 리치 결과 테스트 `https://search.google.com/test/rich-results?url=https://www.junominu.com/blog/<slug>`
- sitemap.xml 갱신 여부

---

## 3. 작성 보이스

- **1인칭 회고체.** "나는 ~했다 / ~였다" 기본, 설명 구간은 "~합니다"도 섞는다. 기존 3편의 톤을 먼저 읽고 맞춘다.
- **비개발자 독자 기준.** 전문 용어는 처음 나올 때 괄호로 풀어준다. (`환경변수(프로그램이 쓰는 설정값)`)
- **솔직하게.** 막힌 시간, 틀린 판단, 오진을 그대로 쓴다. 이 사이트의 신뢰는 거기서 나온다.
- 문장은 짧게. 한 문장 40자 안쪽을 기본으로.
- 과장 금지. "혁명적인", "완벽한" 같은 말 대신 숫자를 쓴다.
- 홍보 톤 금지. 제품 자랑이 아니라 **만든 과정의 기록**이다. 판매는 마지막 CTA 한 줄이면 충분하다.

---

## 4. 안전 규칙

- **없는 사실을 만들지 않는다.** 날짜·커밋 수·기능·막힌 점은 전부 `src/projects.js` 또는 사용자가 준 것만. 모르면 묻는다.
- **이미지 덮어쓰기 금지.** 같은 이름이 있으면 재사용하거나 다른 이름을 쓴다.
- **같은 slug의 글이 이미 있으면 사용자에게 확인**한 뒤 덮어쓴다.
- **본문에 JSON-LD `<script>` 넣지 않는다**(§1 경고).
- `git add` / `git commit` **자동 실행 금지** — 사용자가 결정한다.
- 검증에서 실패한 단계가 있으면 다음으로 강행하지 않고 정확한 에러를 보고한다.
- 캡처가 불가능한 화면(로그인·결제 뒤)은 **빼고** 진행한다. 없는 화면을 지어내지 말 것.

---

## 5. 참고 파일

| 파일 | 왜 |
|---|---|
| `src/projects.js` | **글 재료의 유일한 출처** (`detail`) |
| `src/posts/*.md` | 기존 글 — 톤·태그·중복 확인 |
| `scripts/prerender-meta.js` | 메타·OG·JSON-LD 프리렌더 (규약의 근거) |
| `src/blogData.js` | frontmatter 파서 — 지원 필드 확인 |
| `src/App.css` | `.prose` 계열 — `byline`·`answer`·`post-cta`·표·이미지 스타일 |
| `public/shots/` + `README.md` | 캡처 자산과 파일명 규칙 |
| `public/sitemap.xml` | 글 추가 시 함께 갱신 |
| `.claude/skills/threads-post/` | 같은 글감을 스레드로 짧게 낼 때 (블로그 ← → 스레드 재활용) |
| `CLAUDE.md` | 사이트 구조·배포 |

---

## 6. 글감 로드맵 (프로젝트 9개)

각 프로젝트에서 **한 편씩**. 각도는 `detail`이 정한다 — `challenges`가 두꺼우면 삽질형, `prompts`가 두꺼우면 방법형.

| slug | 프로젝트 | 유력 각도 |
|---|---|---|
| `jjangsaem` | 짱샘의 책방 | 전자책 커머스 — 결제·배송 없는 상품 팔기 |
| `kungkung` | 킁킁메이트 | 감각 훈련 앱 — 타이머·기록 UX |
| `italk` | i-talk | AI 분석 리포트 — 결과를 어떻게 보여줄까 |
| `soriya` | 소리야 놀자! | 얼굴 인식 게임 — 브라우저에서 되나 |
| `jungaepro` | 중개프로 | SaaS 정기결제 붙이기 |
| `bokjimoa` | 아이복지모아 | 공공데이터 수집·정제 |
| `transcripto` | 트랜스크립토 | 데스크톱 앱 배포 |
| `brain` | 매일 두뇌 활동 | 시니어 UI — 큰 글씨·단순 동선 |
| `petphoto` | 펫포토 AI | AI 이미지 생성 + 실결제 E2E |

한 편 낼 때마다 이 표에 ✅를 남길 필요는 없다 — `src/posts/`가 곧 기록이다.
