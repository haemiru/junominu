# 프로젝트 스크린샷 폴더

여기에 프로젝트 화면 캡처(PNG/JPG/WebP)를 넣으면 상세 페이지(`/p/:slug`)에 표시됩니다.

## 넣는 법

1. 캡처 파일을 이 폴더(`public/shots/`)에 둡니다. 예: `jungaepro-cover.png`, `jungaepro-1.png`
2. `src/projects.js`의 해당 프로젝트 `detail`에 경로를 적습니다. **경로는 `/shots/...`로 시작**합니다(앞에 `public` 빼기).

```js
detail: {
  // 히어로 커버 한 장 (선택)
  cover: "/shots/jungaepro-cover.png",
  coverCaption: "대시보드 첫 화면",       // (선택)

  // 갤러리 여러 장 (선택) — 문자열 또는 { src, caption }
  shots: [
    "/shots/jungaepro-1.png",
    { src: "/shots/jungaepro-2.png", caption: "계약서 PDF 출력" },
  ],
  // ...나머지 필드
}
```

## 동작

- `cover` → 히어로 아래 큰 배너로 표시
- `shots` → "화면" 섹션에 세로로 나열
- **파일이 없거나 경로가 틀리면 그 이미지는 자동으로 숨겨집니다**(에러 안 남, 이모지 히어로 유지). 그래서 미리 경로만 적어두고 나중에 파일을 채워도 됩니다.

## 권장 사양

- 가로 1200~1600px, 16:10 안팎. WebP면 더 가볍습니다.
- 개인정보·실고객 데이터가 보이지 않게 가린 화면을 사용하세요.

## `course-*` 는 강의 페이지(/courses) 전용

프로젝트 캡처가 아니라 **강의에서 만들 것의 예시 화면**이다. `ME.courses` 가 참조한다.

| 파일 | 무엇 | 어디서 왔나 |
|---|---|---|
| `course-basic-demo.png` (1200×630) | 영수증 사진 → 정리표 | 직접 제작(HTML + 사이트 토큰 → Chrome 헤드리스) |
| `course-oneday-{sns,mall,board}.png` (780×1560) | 원데이 트랙 셋 화면 | 직접 제작. 범위는 `lecture/oneday/완성본-프롬프트/*.txt` 기준 |
| `course-regular-{shop,booking,tool}.jpg` (780×1560) | 가게 소개 · 예약 칸 · 정리 도구 | `lecture/latpeed/images/examples/01~03.jpg` 복사 |

🔴 **원데이 화면의 완성도를 올리지 말 것.** 수강생이 하루에 만드는 수준과 같아야 한다
(그 이유는 `lecture/oneday/완성본-프롬프트/쇼핑몰-vibeMALL.txt` 「만들 것의 범위」에 있다).
🔴 **`lecture` 레포는 읽기만 한다** — 저기서 파일을 고치거나 커밋하지 말 것.
