// ────────────────────────────────────────────────────────────────
//  JunoMinu 로고 — 바이브 코딩 마크
//  둥근 배지 안에 코드 브래킷 </>  + 가운데 번개(에너지)로
//  "코드 + 바이브"를 표현. 액션 블루(#00a1ff) 계열 그라데이션.
// ────────────────────────────────────────────────────────────────

export default function Logo({ size = 56 }) {
  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="JunoMinu logo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="jm-grad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00a1ff" />
          <stop offset="1" stopColor="#0077cc" />
        </linearGradient>
      </defs>

      {/* 배지 */}
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="16"
        fill="url(#jm-grad)"
        fillOpacity="0.10"
        stroke="url(#jm-grad)"
        strokeWidth="2"
      />

      {/* 코드 브래킷 < > */}
      <path
        d="M24 22 L14 32 L24 42"
        stroke="url(#jm-grad)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 22 L50 32 L40 42"
        stroke="url(#jm-grad)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 가운데 번개 — 바이브/에너지 */}
      <path
        d="M34 18 L27 34 H32 L30 46 L38 29 H33 L34 18 Z"
        fill="url(#jm-grad)"
      />
    </svg>
  )
}
