# CLAUDE.md — junominu.com 허브 사이트 (junominu)

## 이 프로젝트는 무엇인가

**junominu.com** — 키즈피지오짱샘 패밀리의 **도구 모음 허브 사이트**.

- **모델**: 자체 도구를 호스팅하지 않고, 각 도구(서브도메인·별도 도메인)로 가는 **카드 링크 허브**.
- **첫 카드**: 킁킁메이트 (`kungkung.junominu.com` 예정, 배포 전까진 `Coming Soon` 라벨)
- **이전 용도**: 게임 링크 허브 (폐기). 코드는 `archive/games-hub-2026-05-04` 브랜치에 백업됨.
- **현재 상태**: Vite + React 스캐폴드 + 허브 1페이지(헤더/히어로/카드 그리드/풋터) 완료
- **호스팅**: Vercel — 기존 `junominu's project` 재사용 (D28). 도메인 `junominu.com`(NS=Vercel)
- **레포**: `https://github.com/haemiru/junominu`
- **로컬 폴더**: `C:\Users\bsuha\Claude-prj\junominu\`

## 🚨 작업 시 반드시 먼저 할 일

**짱샘의 책방 프로젝트의 마스터 전략 문서를 먼저 읽으세요**:

```
C:\Users\bsuha\Claude-prj\ebook\jjangsaem-bookshop\docs\junominu-strategy.md
```

이 문서에:
- 전체 비즈니스 결정 사항 (D1~D30)
- 100+개의 전체 to-do 리스트 (P0~P4 우선순위, 카테고리, 의존성, 공수)
- 12주 로드맵
- 운영 규칙 (섹션 0) — "할일 알려줘" 트리거 시 답변 형식
- 핵심 인프라 결정 (Supabase 통합, SSO, schema 분리 등)

이 폴더(`junominu/`)에서 진행할 작업은 **카테고리 DOM**으로 표시되어 있습니다.

## 핵심 결정 요약 (자세한 내용은 마스터 문서)

| 항목 | 결정 |
|---|---|
| 사이트 모델 | **도구 모음 허브** — 각 도구는 자체 도메인·서브도메인, junominu.com은 카드 링크만 (D14) |
| 첫 도구 | 킁킁메이트, `kungkung.junominu.com` 서브도메인 (D19) |
| 임시 표시 | 킁킁메이트 배포 전까진 카드에 `Coming Soon` 라벨 (D17) |
| 폴더 위치 | `Claude-prj/junominu/` 신규 생성, 기존 게임 허브 폐기 (D18) |
| Vercel | 기존 `junominu's project` 재사용 — 도메인·설정 유지, 코드만 갈아치움 (D28) |
| 레포 | `https://github.com/haemiru/junominu` |
| 백엔드 | **없음** — 정적 허브. 인증·DB는 각 도구 앱이 담당 |
| Supabase | 직접 사용 X. 관련 인프라는 `kungkung-mate/`·책방 쪽에서 관리 |
| 메일 발신자 | `hello@junominu.com` (책방과 분리, D23) — 도메인 인증은 별도 |

## 디자인

- 베이스 컬러: 라벤더 `#9B89B3` (책방·킁킁메이트와 동일 — 패밀리 시그널)
- Accent: 딥 틸 `#0F766E` (책방의 코랄과 차별, 킁킁메이트와 동일)
- 헤더 배지: "키즈피지오짱샘 공식 도구" + 짱샘의 책방 링크
- 풋터: 짱샘의 책방 링크 + 사업자 정보 (jjangsaem.com과 동일 — 강남상회/하성재/893-19-02019)
- 분위기: 능동·대시보드 (책방의 "따뜻한 책장"과 차별)
- 폰트: Pretendard / 시스템 한글 스택

## 프로젝트 구조

```
junominu/
├── index.html              # lang="ko", title="키즈피지오짱샘 도구 모음"
├── src/
│   ├── main.jsx            # Vite + React 진입점
│   ├── App.jsx             # Header / Hero / Tools(카드 그리드) / Footer
│   ├── App.css             # 컴포넌트 스타일
│   ├── index.css           # 컬러 토큰 (--lavender, --teal …)
│   └── assets/             # (현재 비어 있음)
├── public/                 # (현재 비어 있음 — 추후 favicon, OG 이미지 등)
├── package.json            # vite, react
├── vite.config.js
├── eslint.config.js
└── CLAUDE.md               # 이 문서
```

도구 카탈로그는 `src/App.jsx` 안의 `tools` 배열로 관리. 카드 추가 시 이 배열만 수정.

## 폴더 매핑 (전체 시스템)

| 폴더 | 역할 |
|---|---|
| `Claude-prj/ebook/jjangsaem-bookshop/` | 책방 + 마스터 전략 문서 |
| `Claude-prj/kungkung-mate/` | 킁킁메이트 앱 (KKM 카테고리) |
| `Claude-prj/junominu/` (이 폴더) | junominu.com 허브 사이트 (DOM 카테고리) |

## 명령어

```bash
npm install      # 의존성 설치
npm run dev      # Vite dev 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 로컬 확인
```

배포: `main` 브랜치 push → Vercel 자동 배포 → `junominu.com`.

## 진행 상황 갱신

작업 완료 후 마스터 문서의 to-do 행 `☐` → `✅` 갱신해주세요. 위치: `docs/junominu-strategy.md` 섹션 9. 이 폴더에서 다루는 항목은 **카테고리 DOM** (#5~#9-3, #77, #82, #102 등) 및 풋터·약관 등 일부 LGL.

## 관련 메모리 (참고)

- `project_junominu_strategy.md` — 전체 전략 인덱스
- `project_corp_transition_solapi.md` — 법인·결제 인프라 로드맵
- `user_profile.md` — 짱샘 프로필 (이름·역할 표기 규칙)
