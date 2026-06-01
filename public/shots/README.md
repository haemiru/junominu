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
