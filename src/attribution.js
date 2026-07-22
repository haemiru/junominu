// ────────────────────────────────────────────────────────────────
//  유입 경로(attribution) — "어느 글이 문의를 만들었나"를 잇는 한 조각
//
//  문제: 방문자가 `/p/bokjimoa?utm_source=threads&utm_campaign=...` 로 들어와도
//        SPA 라우팅으로 /contact 에 가는 순간 쿼리스트링이 사라진다.
//        → 첫 진입 때 한 번 붙잡아 sessionStorage 에 넣어두고,
//          /contact 의 Tally 폼에 숨김필드 `src` 로 실어 보낸다.
//
//  first-touch(최초 유입) 방식: 이미 저장돼 있으면 덮어쓰지 않는다.
//  세션이 끝나면 사라진다(sessionStorage) — 방문 단위 귀속이면 충분.
// ────────────────────────────────────────────────────────────────

const KEY = 'jm_src'

/** sessionStorage 접근 실패(프라이빗 모드·차단 등)에도 사이트가 죽지 않게 감싼다. */
function read() {
  try { return sessionStorage.getItem(KEY) } catch { return null }
}
function write(v) {
  try { sessionStorage.setItem(KEY, v) } catch { /* 저장 못 해도 무시 */ }
}

/**
 * 최초 진입 시 1회 호출(main.jsx). 유입 경로를 한 줄 문자열로 저장한다.
 *
 *   utm 있음 → "threads/bokjimoa-anchor"  (utm_source/utm_campaign)
 *   utm 없음 → "l.threads.com"            (referrer 호스트)
 *   둘 다 없음 → "direct"
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return
  if (read()) return // 이미 이번 세션의 첫 유입이 기록됨 → 유지

  const q = new URLSearchParams(window.location.search)
  const source = q.get('utm_source')
  const campaign = q.get('utm_campaign')

  let value = ''
  if (source) {
    value = campaign ? `${source}/${campaign}` : source
  } else if (document.referrer) {
    // 외부에서 온 경우만 의미가 있다(내부 이동은 referrer 가 자기 도메인).
    try {
      const host = new URL(document.referrer).hostname
      if (host && host !== window.location.hostname) value = host
    } catch { /* 잘못된 referrer 는 무시 */ }
  }

  write(value || 'direct')
}

/** 저장된 유입 경로. 없으면 'direct'. */
export function getAttribution() {
  return read() || 'direct'
}
