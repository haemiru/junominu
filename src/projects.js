// ────────────────────────────────────────────────────────────────
//  나만의 바이브 코딩 작업실 — 프로젝트 목록
//
//  새 프로젝트가 생기면 아래 PROJECTS 배열에 객체 하나만 추가하면
//  카드가 자동으로 생깁니다. (그게 전부예요. 하나씩 추가하세요.)
//
//    status: 'live'     — 운영 중
//            'building' — 작업 중 / 베타
//            'idea'     — 구상 단계 (url 없어도 됨)
//
//    url 이 없으면 클릭 안 되는 "구상 카드"로 표시됩니다.
//
//  [카드 미디어 — 선택]
//    detail.thumb : 홈 카드 상단에 깔리는 썸네일 이미지 경로("/shots/xxx.png").
//                   없으면 detail.cover 를 대신 쓰고, 그것도 없으면
//                   detail.tint 색조 그라데이션 + 큰 이모지로 자동 대체.
//    detail.tint  : 카드 미디어 밴드/JOURNEY 점 색조(없으면 보라 기본).
//    detail.commits : git 누적 커밋 수(실데이터). 홈 "누적 커밋" 지표와
//                     JOURNEY 막대 폭에 쓰임. 없으면 자동 제외.
// ────────────────────────────────────────────────────────────────

export const ME = {
  name: "JunoMinu",
  tagline: "바이브 코딩으로 하나씩 만들어 갑니다",
  intro: "AI 코딩으로 혼자 기획·개발·운영하는 1인 메이커의 작업실.",

  // 작업실 시작 연-월 (지표 계산용)
  since: "2026-01",

  // About — "왜 바이브 코딩을 하는가" (검색 키워드를 자연스럽게 녹임)
  about: [
    "원래 개발자가 아닙니다. System Architect로 회사를 다니던 직장인이,\nAI 코딩 — 흔히 '바이브 코딩(vibe coding)'이라 부르는 방식 — 으로 직접 제품을 만들기 시작했습니다.",
    "Claude Code와 Antigravity 같은 AI 코딩 도구에게 아이디어를 말로 설명하면, 비개발자도 React·Next.js·Supabase로 진짜 동작하는 웹앱을 배포까지 할 수 있는 시대가 됐습니다.\n이 작업실은 그 과정을 기록하는 곳입니다.",
    "문법을 외우는 대신 '무엇을 왜 만들지'에 집중합니다. 전자책 커머스부터 헬스케어 SaaS, AI 분석 리포트, 공인중개사 플랫폼, 언어치료 앱까지 — 혼자 기획하고, 만들고, 운영하는 1인 개발 실험을 이어갑니다.",
    "비개발자가 AI 코딩으로 1인 메이커가 되는 이 여정은, 전자책 『바이브 코딩으로 1인 사업가 되기』로도 정리하고 있습니다.",
    // 전자책이 공개되면 위 문장에 링크를 걸거나 ME.links에 항목 추가
  ],

  // Now — 지금 집중하는 일
  now: [
    "중개프로 — 공인중개사 올인원 SaaS의 멀티테넌트 구조를 다듬는 중",
    "소리야 놀자! — 발달장애 아동 언어치료 게임(얼굴 인식 기반)을 만드는 중",
  ],

  // 나를 찾는 법 (연락/채널) — 제품/가게는 PROJECTS 카드가 담당
  links: [
    { label: "GitHub", url: "https://github.com/haemiru", icon: "github", hint: "코드" },
    // PC에서 mailto는 기본 메일 앱이 없으면 먹통 → Gmail 웹 작성창으로 바로 열기(모바일도 정상)
    { label: "Email", url: "https://mail.google.com/mail/?view=cm&fs=1&to=junominu@gmail.com", icon: "email", hint: "연락" },
  ],

  // 스택/도구함 — 실제로 쓰는 것들 (그룹별)
  stack: [
    { group: "AI 코딩 도구", items: ["Claude Code", "Antigravity", "Codex"] },
    { group: "프런트엔드", items: ["React", "Next.js", "Vite"] },
    { group: "스타일", items: ["Tailwind CSS"] },
    { group: "백엔드·데이터", items: ["Supabase", "Firebase"] },
    { group: "배포", items: ["Vercel"] },
  ],
};

export const PROJECTS = [
  {
    name: "짱샘의 책방",
    slug: "jjangsaem",
    emoji: "📚",
    description: "발달·재활 전자책과 부모를 위한 도구를 파는 온라인 책방.",
    url: "https://jjangsaem.com",
    status: "live",
    tags: ["전자책", "커머스", "Next.js"],
    detail: {
      started: "2026-03-02",      // 첫 커밋(실데이터)
      launched: "2026-03-16",     // ⚠️ 추정 — 관리자+전자책 DB로 첫 판매 가능 버전. 실제 공개일 확정 필요
      commits: 616,               // git 이력(실데이터)
      tint: "#f59e0b",            // 카드 미디어 밴드 색조
      cover: "/shots/jjangsaem-cover.png",
      coverCaption: "짱샘의 책방 — 랜딩",
      thumb: "/shots/jjangsaem-cover.png",
      summary: [
        "발달·재활이 필요한 아이를 키우는 부모에게, 흩어진 정보 대신 '바로 쓰는 자료'를 건네고 싶었습니다.\n25년차 소아 재활치료사로 일하면서 느낀 점과 경험을 바탕으로 기록한 내용을, 최신 논문자료에 기반해 전자책으로 정리하였습니다.",
        "단순 판매 페이지가 아니라, 전자책 뷰어·통합 장바구니·환불·매출 분석 대시보드·다국어까지 갖춘 풀스택 커머스를 혼자 만들고 운영하고 있습니다.",
      ],
      features: [
        "전자책 카탈로그 + 뷰어(플립북) — 결제 후 바로 열람·다운로드",
        "통합 장바구니 — 전자책 + 실물 상품 묶음 결제(토스·PayPal)",
        "주문·배송 관리 — 운송장 입력, 엑셀 내보내기, 사은품 배송",
        "관리자 대시보드 — 매출·유입경로·전환율·재구매율 분석",
        "독자 후기·뉴스레터·환불 시스템",
        "다국어(ko/en) — next-intl + 국가 자동 감지",
      ],
      stack: ["Next.js", "React", "Supabase(SSR)", "Toss Payments", "PayPal", "Claude API", "next-intl", "Recharts", "react-pageflip", "Resend", "Tailwind CSS", "Vercel"],
      timeline: [
        { date: "2026-03-02", label: "첫 커밋 — 랜딩 + 결제 시스템 프로토타입" },
        { date: "2026-03-16", label: "관리자 페이지 + 전자책 DB 마이그레이션" },
        { date: "2026-03-26", label: "실물 상품 판매 시스템 + 별도 결제 페이지" },
        { date: "2026-04-09", label: "전자책 + 실물 통합 장바구니 결제" },
        { date: "2026-04-13", label: "환불 시스템 — 다운로드 추적 + Toss 결제 취소" },
        { date: "2026-04-16", label: "다국어(i18n) — next-intl, /ko·/en, 국가 자동감지" },
      ],
      challenges: [
        "정확한 근거에 의한 전자책 집필이 되도록 논문을 리서치해 자료로 사용하고, 짱샘이 직접 기록하고 정리했던 자료들을 전자책에 녹여 넣기 위해 목차 구성과 실제 내용에 대한 검증 및 검토.",
        "구매 취소를 요구하는 경우, 전자책 PDF 다운로드 여부를 파악한 후 토스페이먼츠 환불 기능을 구현.",
        "명확하지 않은 유입경로 분석을 대시보드와 방문자 분석에 표현하는 데 느낀 어려움.",
      ],
      prompts: [
        { title: "통합 장바구니 + 배송지 입력", text: "장바구니 기능을 추가해주고, 전자책과 상품을 동시에 결제하는 경우에 개인정보 수집 이용 동의 후 배송지 정보를 입력하는 폼을 추가해줘. 장바구니는 하나씩 또는 일괄 삭제가 가능해야 해." },
      ],
      retro: [
        "양질의 전자책과 상품들을 등록하고, 실제로 필요한 사람들에게 알리고 홍보하기 위해 SNS와 유튜브, 블로그 등을 활용하고 있지만, 실제 마케팅에 대한 한계를 느끼게 됩니다. 하지만 천천히 그리고 꾸준히 '짱샘의 책방'이 조금씩 알려지고 있는 느낌이 들어서 오늘도 힘을 냅니다.",
      ],
    },
  },
  {
    name: "킁킁메이트",
    slug: "kungkung",
    emoji: "🌿",
    description: "호흡·후각 자가훈련을 매일 기록하면 변화를 자동 리포트로 보여주는 앱.",
    url: "https://kungkung.jjangsaem.com",
    status: "live",
    tags: ["SaaS", "헬스케어", "Vite"],
    detail: {
      started: "2026-04-19",      // 첫 커밋(실데이터)
      launched: "2026-04-21",     // ⚠️ 추정 — 실제 공개일 확정 필요
      commits: 53,                // git 이력(실데이터)
      tint: "#34d399",            // 카드 미디어 밴드 색조
      thumb: "/shots/kungkung-home.png",   // 실제 제품 화면(홈) — 카드 밴드용
      shots: [
        { src: "/shots/kungkung-home.png",   caption: "홈 — 오늘의 호흡·후각 훈련" },
        { src: "/shots/kungkung-breath.png", caption: "호흡 훈련 — 6가지 호흡법" },
        { src: "/shots/kungkung-timer.png",  caption: "호흡 타이머 — 하버드 호흡 진행" },
        { src: "/shots/kungkung-scent.png",  caption: "후각 훈련 — 6가지 향 세트" },
        { src: "/shots/kungkung-record.png", caption: "훈련 기록 — 주간 리포트·PDF 저장" },
      ],
      summary: [
        "후각·호흡 훈련은 '매일 조금씩'이 핵심인데, 종이 기록은 금세 흐지부지됩니다. 그래서 훈련을 앱에서 바로 기록하고, 쌓인 데이터로 변화를 자동 비교해 보여주자는 생각에서 시작했습니다.",
        "주관적인 '오늘 어땠나' 슬라이더를 걷어내고, 누적된 실제 기록만으로 시작/종결을 자동 비교하도록 설계한 게 핵심입니다.",
      ],
      features: [
        "호흡 훈련 타이머 — 시간·사이클 사용자 설정, 중간 종료 시에도 진행분 자동 기록",
        "향별 가이드 — 사용 상황·효과·호흡법·주의사항",
        "누적 데이터 자동 비교 리포트(PDF 내보내기)",
        "PWA — 홈 화면 설치, 카카오톡 인앱 브라우저 우회",
        "프로필·아이 정보·특이사항 관리",
      ],
      stack: ["React", "Vite", "Supabase", "Toss Payments", "PWA(vite-plugin-pwa)", "html2pdf.js", "Vercel"],
      timeline: [
        { date: "2026-04-19", label: "첫 커밋 + Vercel 배포 — 호흡 훈련 앱 골격" },
        { date: "2026-04-19", label: "PWA 적용 + 카카오톡 인앱 → 외부 Chrome 우회" },
        { date: "2026-05-05", label: "토스 빌링키 정기결제 + 법적 페이지(약관/개인정보/환불)" },
        { date: "2026-05-17", label: "향별 가이드 상세 화면 + 향 아이콘 커스텀 SVG" },
        { date: "2026-05-26", label: "무료 전환 — 결제 UI 숨김, 전체 '무료 이용 중'" },
      ],
      challenges: [
        "구글 로그인이 인앱 브라우저(카톡·인스타·쓰레드 등)에서 거부되는 문제를 해결하기 위해, PWA를 적용해 폰에 설치할 수 있도록 함.",
        "호흡 훈련 방법들을 확인하기 위해 각종 논문과 관련 자료들을 수집해, 발달장애 아이들에게 꼭 필요한 호흡법을 적용하려 함.",
        "후각 훈련에 도움이 되는 후각원을 선별하고 후각 훈련 방법을 찾는 데 어려움이 있었는데, 인헤일러를 이용할 수 있도록 가이드.",
      ],
      prompts: [
        { title: "AI 보고서 생성", text: "보고서 보기 기능을 만들어줘. Opus 4.7 기반으로 보고서를 생성하고, 내용은 우리 전자책 내용을 기반으로 해서, 실제 논문을 찾아서 내용을 보완해줘. 보고서는 차트와 그래프 등을 활용해서 시각적으로 깔끔하고 보기 쉽게 작성해줘." },
      ],
      retro: [
        "구독 서비스로 개발을 시작했지만, 짱샘의 책방과 연계해 부가 서비스로 제공하기로 결정한 후 결제 관련 코드를 제거했고, 사용자 편의성을 위해 짱샘의 책방에서 전자책을 구매한 사용자는 같은 계정으로 킁킁메이트를 이용할 수 있도록 적용한 게 좋았던 것 같다.",
      ],
    },
  },
  {
    name: "i-talk",
    slug: "italk",
    emoji: "💌",
    description: "아이 일상 영상을 25년차 치료사가 직접 보고, 논문 근거로 분석 리포트를 써주는 서비스.",
    url: "https://italk.jjangsaem.com",
    status: "live",
    tags: ["AI", "리포트", "Vite"],
    detail: {
      started: "2026-04-21",      // 첫 커밋(실데이터)
      launched: "2026-04-22",     // ⚠️ 추정 — 초기 동작 버전. 실제 공개일 확정 필요
      commits: 81,                // git 이력(실데이터)
      tint: "#f472b6",            // 카드 미디어 밴드 색조
      thumb: "/shots/italk-report.png",   // 실제 제품 화면(짱샘 리포트) — 카드 밴드용
      shots: [
        { src: "/shots/italk-upload.png", caption: "영상 업로드 — 1분 미만 5~6개" },
        { src: "/shots/italk-report.png", caption: "짱샘의 편지 — 관찰 리포트·근거 자료" },
      ],
      summary: [
        "발달이 걱정되는 부모는 '우리 아이 지금 어떤 상태인가'를 가장 알고 싶어 합니다. i-talk은 아이의 일상 영상을 올리면 25년차 치료사가 직접 보고, 논문 근거를 곁들인 분석 편지를 써 보내는 서비스입니다.",
        "사람(치료사)의 판단을 중심에 두고, Claude API는 근거 정리와 초안 작성을 돕는 보조로 썼습니다. '자동 진단'이 아니라 '전문가의 편지'가 결과물입니다.",
      ],
      features: [
        "보호자 앱 — 영상 업로드 → 사례 제출",
        "치료사 워크스페이스 — 사례 검토·편지 초안 편집·확정",
        "Claude API 리서치(Edge Function)로 근거 정리",
        "결제 — 1회 분석 + 패키지(3/5/10회) 크레딧",
        "알림 — 이메일(Resend) + 카카오 알림톡(Solapi)",
      ],
      stack: ["React", "Vite", "Supabase", "Claude API(@anthropic-ai/sdk)", "Edge Functions", "Toss Payments", "Solapi(알림톡)", "Resend(email)", "html2pdf.js"],
      timeline: [
        { date: "2026-04-21", label: "첫 커밋 — 프로토타입(보호자 앱 기본 골격)" },
        { date: "2026-04-22", label: "Vite+React+Supabase 전환, 인증, 영상 업로드, Claude 리서치, 토스 결제까지 하루에 1~6단계" },
        { date: "2026-05-07", label: "치료사 편지 초안 편집 + 패키지 결제 플랜" },
        { date: "2026-05-18", label: "보호자 화면 + 통계 대시보드" },
        { date: "2026-05-28", label: "카카오 알림톡(Solapi) + 리포트 전송 이메일 알림(Resend)" },
      ],
      challenges: [
        "보호자님께 신뢰를 줄 수 있게 하려고, 짱샘이 최대한 많은 피드백을 직접 줄 수 있으면서도 로딩이 걸리지 않게 하는 방법에 대한 고민이 많았어요.",
        "좀 더 신뢰할 수 있는 검증된 자료를 바탕으로 피드백을 주기 위해 NotebookLM과 Claude Opus 4.7 등 최신 기술을 이용.",
        "업로드한 동영상이 자동으로 썸네일을 보여주도록 하는 부분에서 자꾸 에러가 나서 클로드 코드와 씨름했네요.",
      ],
      prompts: [
        { title: "NotebookLM 논문 리서치 + 편지 작성", text: "NotebookLM MCP를 연결해서 새로운 노트북을 생성한 다음에 짱샘이 입력한 키워드와 초안을 바탕으로 관련된 논문들을 리서치해서 import해. import된 자료들을 바탕으로 짱샘의 편지를 Opus 4.7을 이용해서 완성해줘. 근거자료도 표시하고, 보호자가 실제로 보는 화면을 미리보기로 제공해줘. 또 짱샘의 편지 결과에 대해 수정도 할 수 있도록 해줘." },
      ],
      retro: [
        "짱샘에게 대면 코칭을 받고 싶은 보호자가 많지만, 거리가 멀고 시간을 내기 어려운 보호자님들께 어떻게 하면 더 좋은 서비스를 제공할 수 있을까 하는 고민 끝에 i-talk가 탄생했습니다. 좀 더 많은 분들께 도움이 되는 서비스가 되면 좋겠어요.",
      ],
    },
  },
  {
    name: "중개프로",
    slug: "jungaepro",
    emoji: "🏢",
    description: "매물·계약·CRM·문의·AI 도구까지, 공인중개사 업무를 하나로 모은 올인원 플랫폼.",
    url: "https://smart-sjhome.vercel.app/",
    status: "building",
    tags: ["SaaS", "멀티테넌트", "React"],

    // 상세(메이킹 스토리) — 이 필드가 있으면 카드 클릭 시 내부 상세 페이지로 이동
    // 요약·기능·스택·타임라인 = 로컬 레포(jungaepro) git 이력에서 추출한 실데이터
    detail: {
      // 스크린샷: 실제 랜딩 화면 캡처(public/shots/). 파일 없으면 자동 숨김.
      cover: "/shots/jungaepro-cover.png",
      coverCaption: "중개프로 — 랜딩(지역 지도 검색)",
      thumb: "/shots/jungaepro-cover.png",
      // shots: ["/shots/jungaepro-1.png", { src: "/shots/jungaepro-2.png", caption: "계약서 PDF" }],

      // 시작일 → "0 → 작업 N일" 자동 계산용 (베타 운영 중 → launched 생략)
      started: "2026-02-18",      // 첫 커밋(실데이터)
      commits: 181,               // git 이력(실데이터)
      tint: "#7c5cff",            // 카드 미디어 밴드 색조
      summary: [
        "공인중개사 한 명이 매물 등록부터 손님 응대, 계약, 광고까지 전부 손으로 처리하는 걸 옆에서 봤습니다. 엑셀과 메신저, 부동산 포털을 오가며 같은 정보를 몇 번씩 옮겨 적고 있었어요.",
        "그 반복을 한 화면에서 끝내자는 게 중개프로의 시작입니다. 매물·계약서·CRM·실거래가 시세 조회를 하나로 묶고, 중개사무소마다 자기 서브도메인으로 독립된 공간을 갖는 멀티테넌트 SaaS로 만들고 있습니다. 첫 커밋부터 약 3개월 동안 180커밋이 넘게 쌓인 베타입니다.",
      ],
      // 핵심 기능 (실제 구현 기준)
      features: [
        "매물 관리 — 유형별 동적 폼·상태(거래중/완료) 자동 전환·상세 검색(금액/면적/등록일)·사진",
        "국토부 실거래가 — 주변 시세 조회 + 캐싱·데이터 출처 표시",
        "계약 — 계약서·확인설명서·등기부등본 PDF, 계약금/잔금 영수증 출력, 임시저장·유효성 검사",
        "CRM — 파이프라인 단계별 고객 추적 + 상담일지 + 매칭매물 태그",
        "멀티테넌트 — 사무소별 서브도메인·독립 데이터·초대코드 소속원 가입",
        "구독 SaaS — Free/유료 플랜별 기능 제어 + 잠금 메뉴 업그레이드 유도",
        "지역 지도 검색 — 한국 행정구역 GeoJSON 기반 지역별 인기매물(Leaflet)",
        "보안 — 비밀번호 변경·2FA(TOTP)·로그인 기록",
      ],
      // 상세 스택 (실데이터: package.json)
      stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Zustand", "react-router-dom", "Leaflet(지도)", "Recharts(차트)", "jsPDF·pdf-lib(PDF)", "Vercel"],
      // 타임라인 (실데이터: git 커밋)
      timeline: [
        { date: "2026-02-18", label: "첫 커밋 — 공인중개사 올인원 플랫폼 초기 구현(관리자·공동중개)" },
        { date: "2026-02-19", label: "구독 플랜 기반 SaaS 전환 + Mock→Supabase 실 DB 연동 + 초대코드 가입" },
        { date: "2026-02-23", label: "멀티테넌트 서브도메인 아키텍처 + Vercel 배포" },
        { date: "2026-03-04", label: "보안설정 — 2FA(TOTP)·로그인 기록" },
        { date: "2026-03-11", label: "CRM 파이프라인 + 상담일지 + 매칭매물 + Free 플랜 매물 제한" },
        { date: "2026-03-12", label: "계약서 + 확인설명서 + 등기부등본 PDF" },
        { date: "2026-03-18", label: "국토부 실거래가 주변 시세 조회" },
        { date: "2026-03-19", label: "브랜드 리네이밍 + 랜딩 페이지" },
        { date: "2026-05-13", label: "smart-home→jungaepro 리네이밍 + 슈퍼 관리자(사무소 인증)" },
      ],
      challenges: [
        "부동산 타입(아파트, 빌라, 공장, 토지 등)에 따라 매물 등록 내용이 달라야 하고, 고객에게 리포트하는 내용도 각각이어서 이런 부분에 대한 사전 조사에 어려움이 있었음.",
        "계약서와 확인설명서 폼이 제대로 나오지 않아서, 폼을 맞추기 위해 꽤 여러 번 커밋을 하면서 애를 먹었어요.",
        "정부 기관에서 데이터를 가져오기 위해 API를 연결하고 승인받는 과정들을 클로드 코드와 함께 하면서도, 물리적으로 시간이 많이 소요되는 점을 고려해야 할 것 같아요.",
      ],
      // 핵심 프롬프트 — 실제 사용 프롬프트(사용자 확정)
      prompts: [
        {
          title: "개공별 테넌트 분리",
          text: "가입한 개공별로 테넌트를 설정할 수 있도록 하고, 각각의 개공들의 데이터가 서로 겹치지 않도록 해줘.",
        },
        {
          title: "국토부 실거래가 API",
          text: "국토부 실거래가 정보를 API로 가져와서 보여줄 수 있도록 해줘.",
        },
      ],
      retro: [
        "공인중개사들이 비싼 돈을 주고 홈페이지를 제작하고 있는데, 전혀 그렇게 비싼 돈을 주고 만들 필요가 없습니다. 누구나 저렴한 비용으로 나만의 홈페이지를 만들 수 있게 할 수 있어서 뿌듯^^",
      ],
    },
  },
  {
    name: "소리야 놀자!",
    slug: "soriya",
    emoji: "🗣️",
    description: "얼굴 인식으로 입 모양을 따라 하며 노는, 발달장애 아동을 위한 언어치료 앱.",
    url: "https://speech-therapy-nine.vercel.app/home",  // ⚠️ 임시 URL(추후 변경 예정)
    status: "building",
    tags: ["언어치료", "얼굴인식", "Next.js"],
    detail: {
      started: "2026-03-04",      // 첫 커밋(실데이터 — github.com/haemiru/SpeechTherapy)
      commits: 36,                // git 이력(실데이터)
      tint: "#22d3ee",            // 카드 미디어 밴드 색조
      thumb: "/shots/soriya-cover.png",   // 실제 홈 화면(놀이 메뉴) — 카드 밴드용
      cover: "/shots/soriya-cover.png",
      coverCaption: "소리야 놀자! — 홈(6가지 놀이 메뉴)",
      summary: [
        "발달장애 아동(3~10세)에게 '입을 크게 벌려 소리 내기'는 중요한 언어치료 과제지만, 반복 훈련은 쉽게 지루해집니다. 그래서 카메라로 입 모양을 인식해, 아이가 따라 하면 게임처럼 반응하도록 만들고 있습니다.",
        "MediaPipe Face Landmarker의 jawOpen(입 벌림) 값을 읽어, 아이가 입을 벌리면 강아지 캐릭터가 반응하고 별과 보상이 쌓이는 놀이형 훈련입니다.",
      ],
      features: [
        "카메라 입 모양 인식 게임 — 입을 벌리면 게이지가 차오름",
        "강아지 캐릭터 성장 + 별 보상으로 동기 부여",
        "결과·보상 화면, 진행 기록(로컬 저장)",
      ],
      stack: ["Next.js 15", "React", "@mediapipe/tasks-vision(Face Landmarker)", "Zustand", "Tailwind CSS", "Vercel"],
      // 타임라인 (실데이터: github.com/haemiru/SpeechTherapy 커밋)
      timeline: [
        { date: "2026-03-04", label: "첫 커밋 — 프로젝트 초기화(기획·설계·디자인 문서)" },
        { date: "2026-03-05", label: "4개 게임 전체 구현 + AI 보고서 생성(Gemini) + Vercel 배포" },
        { date: "2026-05-30", label: "게임 개편 — 혀 운동·소리 열기구·따라 말하기 + 빌드 인프라 정비" },
        { date: "2026-06-01", label: "따라 말하기 개선 — TTS 음성 품질·인식 정확도 + AI 보고서 영속화" },
        { date: "2026-06-04", label: "라운드 타이머·보고서 API 검증·강아지 보상 안정화" },
      ],
      challenges: [
        "MediaPipe 기술을 처음 적용하면서 카메라와 마이크가 제대로 인식하지 못해, 여러 번 수정을 반복하면서 결국 해내게 됐어요.",
        "따라 말하기를 하는데 영어식 발음과 한국어 발음의 차이, 마이크가 활성화되는 데 걸리는 시간 차이 등에서 잘 맞지 않아 어려움이 있었네요.",
      ],
      prompts: [
        { title: "입 모양 인식 (MediaPipe)", text: "실제 언어치료에서 이용하는 방법을 검색하고 검증한 다음에 입 벌리기에 대한 기능을 추가하고, mediapipe 기술을 이용해서 입 모양을 정확하게 파악할 수 있도록 구현해줘." },
      ],
      retro: [
        "에이전트 팀을 구성해서 개발한 프로젝트라 뭔가 다른 느낌이 있습니다. 우리 김언어 언어치료사님이 꼼꼼히 검수를 해주시고…",
      ],
    },
  },
  // 예시) 구상 단계 카드 — url 없이 추가:
  // {
  //   name: "다음 프로젝트",
  //   emoji: "✨",
  //   description: "여기에 한 줄 설명.",
  //   status: "idea",
  //   tags: ["아이디어"],
  // },
];

// 상태 표기 (홈 카드 · 상세 페이지 공용)
export const STATUS = {
  live:     { label: 'LIVE',   cls: 'status status--live' },
  building: { label: '작업 중', cls: 'status status--building' },
  idea:     { label: '구상',   cls: 'status status--idea' },
};

// slug로 프로젝트 찾기 (상세 페이지에서 사용)
export function findProject(slug) {
  return PROJECTS.find((p) => p.slug === slug);
}

// 전 프로젝트 누적 커밋 합계 (detail.commits 있는 것만 — 지표·막대 공용)
export function totalCommits() {
  return PROJECTS.reduce((sum, p) => sum + (p.detail?.commits || 0), 0);
}

// 가장 커밋 많은 프로젝트의 커밋 수 (JOURNEY 막대 상대 폭 기준)
export function maxCommits() {
  return Math.max(1, ...PROJECTS.map((p) => p.detail?.commits || 0));
}
