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
};

export const PROJECTS = [
  {
    name: "짱샘의 책방",
    emoji: "📚",
    description: "발달·재활 전자책과 부모를 위한 도구를 파는 온라인 책방.",
    url: "https://jjangsaem.com",
    status: "live",
    tags: ["전자책", "커머스", "Next.js"],
  },
  {
    name: "킁킁메이트",
    emoji: "🌿",
    description: "호흡·후각 자가훈련을 매일 기록하면 변화를 자동 리포트로 보여주는 앱.",
    url: "https://kungkung.jjangsaem.com",
    status: "live",
    tags: ["SaaS", "헬스케어", "Vite"],
  },
  {
    name: "i-talk",
    emoji: "💌",
    description: "아이 일상 영상을 25년차 치료사가 직접 보고, 논문 근거로 분석 리포트를 써주는 서비스.",
    url: "https://italk.jjangsaem.com",
    status: "live",
    tags: ["AI", "리포트", "Vite"],
  },
  {
    name: "중개프로",
    emoji: "🏢",
    description: "매물·계약·CRM·문의·AI 도구까지, 공인중개사 업무를 하나로 모은 올인원 플랫폼.",
    url: "https://jungaepro.com",
    status: "building",
    tags: ["SaaS", "멀티테넌트", "React"],
  },
  {
    name: "소리야 놀자!",
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
