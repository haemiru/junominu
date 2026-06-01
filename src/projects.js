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
  name: "Juno",
  tagline: "바이브 코딩으로 하나씩 만들어 갑니다",
  intro: "혼자서 기획하고, 만들고, 운영하는 작은 프로젝트들의 작업실.",
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
  // 예시) 구상 단계 카드 — url 없이 추가:
  // {
  //   name: "다음 프로젝트",
  //   emoji: "✨",
  //   description: "여기에 한 줄 설명.",
  //   status: "idea",
  //   tags: ["아이디어"],
  // },
];
