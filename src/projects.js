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
// ────────────────────────────────────────────────────────────────

export const ME = {
  name: "JunoMinu",
  tagline: "바이브 코딩으로 하나씩 만들어 갑니다",
  intro: "AI 코딩으로 혼자 기획·개발·운영하는 1인 메이커의 작업실.",

  // 작업실 시작 연-월 (지표 계산용)
  since: "2026-01",

  // About — "왜 바이브 코딩을 하는가" (검색 키워드를 자연스럽게 녹임)
  about: [
    "저는 원래 개발자가 아닙니다. System Architect로 회사를 다니던 직장인이,\nAI 코딩 — 흔히 '바이브 코딩(vibe coding)'이라 부르는 방식 — 으로 직접 제품을 만들기 시작했습니다.",
    "Claude Code와 Cursor 같은 AI 코딩 에이전트에게 아이디어를 말로 설명하면, 비개발자도 React·Next.js·Supabase로 진짜 동작하는 웹앱을 배포까지 할 수 있는 시대가 됐습니다.\n이 작업실은 그 과정을 기록하는 곳입니다.",
    "문법을 외우는 대신 '무엇을 왜 만들지'에 집중합니다. 전자책 커머스부터 헬스케어 SaaS, AI 분석 리포트, 공인중개사 플랫폼, 언어치료 앱까지 — 혼자 기획하고, 만들고, 운영하는 1인 개발 실험을 이어갑니다.",
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
  },
  {
    name: "킁킁메이트",
    slug: "kungkung",
    emoji: "🌿",
    description: "호흡·후각 자가훈련을 매일 기록하면 변화를 자동 리포트로 보여주는 앱.",
    url: "https://kungkung.jjangsaem.com",
    status: "live",
    tags: ["SaaS", "헬스케어", "Vite"],
  },
  {
    name: "i-talk",
    slug: "italk",
    emoji: "💌",
    description: "아이 일상 영상을 25년차 치료사가 직접 보고, 논문 근거로 분석 리포트를 써주는 서비스.",
    url: "https://italk.jjangsaem.com",
    status: "live",
    tags: ["AI", "리포트", "Vite"],
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
    detail: {
      // 시작일 → "0 → 베타 N일" 자동 계산용 (배포 전이면 launched 생략)
      started: "2026-02-10",
      summary: [
        "공인중개사 한 명이 매물 등록부터 손님 응대, 계약, 광고까지 전부 손으로 처리하는 걸 옆에서 봤습니다. 엑셀과 메신저, 부동산 포털을 오가며 같은 정보를 몇 번씩 옮겨 적고 있었어요.",
        "그 반복을 한 화면에서 끝내자는 게 중개프로의 시작입니다. 매물·계약·CRM·문의·AI 글쓰기 도구를 하나로 묶고, 중개사무소마다 독립된 공간을 갖는 멀티테넌트 구조로 만들고 있습니다.",
      ],
      // 핵심 기능
      features: [
        "매물 관리 — 등록·수정·상태(거래중/완료)·사진까지 한 곳에서",
        "계약/CRM — 손님과 진행 단계를 카드로 추적",
        "문의 인박스 — 여러 채널 문의를 한 화면으로 수집",
        "AI 도구 — 매물 홍보 문구·블로그 글 자동 초안",
        "멀티테넌트 — 사무소별 독립 데이터·권한",
      ],
      // 상세 스택
      stack: ["React", "Next.js", "Supabase", "PostgreSQL(RLS)", "Tailwind CSS", "Vercel"],
      // 타임라인 (0 → 베타)
      timeline: [
        { date: "2026-02-10", label: "첫 커밋 — 매물 데이터 모델 설계" },
        { date: "2026-03-05", label: "멀티테넌트 뼈대(RLS 기반 사무소 분리)" },
        { date: "2026-04-12", label: "매물·CRM 화면 1차 완성" },
        { date: "2026-05-20", label: "AI 홍보문구 도구 붙임, 내부 베타 시작" },
      ],
      // 막혔던 점
      challenges: [
        "멀티테넌트 데이터 격리 — 사무소끼리 데이터가 절대 새지 않게. Supabase RLS(행 수준 보안) 정책을 테이블마다 다시 짜면서 가장 오래 막혔다.",
        "권한 모델 — 대표/소속 공인중개사/실장 역할별로 보이는 메뉴와 수정 권한을 어떻게 데이터로 표현할지.",
        "매물 상태 흐름 — '거래중'과 '광고중'이 겹치는 현실의 상태를 깔끔한 상태머신으로 정리하는 일.",
      ],
      // 핵심 프롬프트 (바이브 코딩 기록)
      prompts: [
        {
          title: "RLS 정책 설계",
          text: "중개사무소(tenant)별로 데이터가 완전히 분리돼야 해. 모든 테이블에 office_id를 두고, 로그인한 유저의 office_id와 일치하는 행만 select/insert/update 되도록 Supabase RLS 정책을 테이블별로 만들어줘. 정책 누락 시 데이터가 새는 케이스도 같이 점검해줘.",
        },
        {
          title: "매물 상태 정리",
          text: "현실 부동산 매물은 '광고중'이면서 동시에 '거래중'일 수 있어. 이 모호함을 없애도록 상태를 분리하고, 가능한 상태 전이만 허용하는 상태머신을 설계해줘.",
        },
      ],
      // 회고
      retro: [
        "기획자가 아니라 '쓰는 사람'의 동선을 먼저 그렸더니, 화면 수가 절반으로 줄었다. 기능을 더하는 것보다 빼는 결정이 더 어려웠다.",
        "RLS는 한 번 제대로 깔아두니 이후 기능 추가가 빨라졌다. 보안을 처음부터 데이터 계층에 박는 게 결국 속도였다.",
      ],
    },
  },
  {
    name: "소리야 놀자!",
    slug: "soriya",
    emoji: "🗣️",
    description: "얼굴 인식으로 입 모양을 따라 하며 노는, 발달장애 아동을 위한 언어치료 앱.",
    url: "https://speech-therapy-ten-theta.vercel.app",
    status: "building",
    tags: ["언어치료", "얼굴인식", "Next.js"],
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
