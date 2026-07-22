import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ME, PROJECTS, totalCommits } from './projects'
import { getAttribution } from './attribution'

// 폼 URL 이 없을 때의 폴백 — 성함/문의유형이 subject 로 채워진 Gmail 작성창을 연다.
// (PC에 기본 메일 앱이 없어도 열리도록 mailto 대신 Gmail 웹 작성창 사용 — ME.links 와 동일 패턴)
function gmailCompose(email, subject) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`
}

function monthsSince(ym) {
  const [y, m] = ym.split('-').map(Number)
  const now = new Date()
  return Math.max(1, (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m))
}

// 버튼 URL: 개별 폼(offer.formUrl) → 공용 폼(contact.formUrl) → 이메일 폴백.
// 폼으로 갈 땐 Tally 숨김필드 2개를 쿼리로 붙인다:
//   type — 버튼별 문의유형(코칭/외주). 폼에서 다시 안 물어봐도 된다.
//   src  — 유입 경로(어느 스레드 글에서 왔나). attribution.js 가 첫 진입 때 잡아둔 값.
function buildFormUrl(o, c, src) {
  const base = o.formUrl || c.formUrl
  if (!base) return gmailCompose(c.email, o.subject)
  const q = new URLSearchParams()
  if (o.typeValue) q.set('type', o.typeValue)
  if (src) q.set('src', src)
  if (![...q].length) return base
  return `${base}${base.includes('?') ? '&' : '?'}${q}`
}

function OfferCard({ o, contact }) {
  const src = getAttribution()
  const url = buildFormUrl(o, contact, src)

  // 버튼 클릭 → Tally 팝업을 사이트 안에서 연다(type·src 는 숨김필드로 전달).
  // Tally 스크립트가 아직 안 떴으면 preventDefault 를 안 해서 기본 동작(새 탭)으로 폴백.
  const openForm = (e) => {
    if (typeof window !== 'undefined' && window.Tally && contact.formId) {
      e.preventDefault()
      window.Tally.openPopup(contact.formId, {
        layout: 'modal',
        width: 720,
        hiddenFields: { type: o.typeValue, src },
        autoClose: 3000,
      })
    }
  }

  return (
    <article className="offer">
      <div className="offer__head">
        <span className="offer__emoji" aria-hidden="true">{o.emoji}</span>
        <h3 className="offer__title">{o.title}</h3>
      </div>
      <div className="offer__body">
        <p className="offer__tagline">{o.tagline}</p>
        <p className="offer__who">{o.who}</p>
        <ul className="now">
          {o.points.map((pt, i) => <li className="now__item" key={i}>{pt}</li>)}
        </ul>
        {o.note && <p className="offer__note">{o.note}</p>}
      </div>
      <a className="btn btn--primary offer__cta" href={url} target="_blank" rel="noreferrer" onClick={openForm}>
        {o.cta} →
      </a>
    </article>
  )
}

export default function Contact() {
  const c = ME.contact

  // Tally 팝업 임베드 스크립트 로드(/contact 진입 시 1회). 오퍼 버튼이 이걸로 팝업을 띄운다.
  useEffect(() => {
    const id = 'tally-embed-script'
    if (document.getElementById(id)) return
    const s = document.createElement('script')
    s.id = id
    s.src = 'https://tally.so/widgets/embed.js'
    s.async = true
    document.body.appendChild(s)
  }, [])

  if (!c) return <Navigate to="/" replace />

  const live = PROJECTS.filter((p) => p.status === 'live').length
  const stats = [
    { n: PROJECTS.length, label: '개 프로젝트' },
    { n: totalCommits().toLocaleString(), label: '누적 커밋' },
    { n: monthsSince(ME.since), label: '개월째 빌딩' },
    { n: live, label: '운영 중' },
  ]

  return (
    <div className="page">
      <Link to="/" className="back">← 작업실로</Link>

      <header className="dhero">
        <p className="hero__kicker cta__kicker">WORK WITH ME · 함께하기</p>
        <h1 className="dhero__name">1:1 코칭 · 외주 문의</h1>
        <p className="dhero__desc">
          {c.lead.split('\n').map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </p>
      </header>

      <section className="dmeta">
        {stats.map((s) => (
          <div className="dmeta__item" key={s.label}>
            <span className="dmeta__n">{s.n}</span>
            <span className="dmeta__label">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="dsection">
        <h2 className="section__label">무엇을 도와드릴까요</h2>
        <div className="offers">
          {c.offers.map((o) => <OfferCard key={o.key} o={o} contact={c} />)}
        </div>
      </section>

      <section className="dsection">
        <h2 className="section__label">다른 방법으로 연락</h2>
        <ul className="links">
          {ME.links.map((l) => (
            <li key={l.label}>
              <a className="link" href={l.url} target="_blank" rel="noreferrer">
                <span className="link__label">{l.label}</span>
                {l.hint && <span className="link__hint">{l.hint}</span>}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="foot">
        <Link to="/" className="back">← 작업실로 돌아가기</Link>
      </footer>
    </div>
  )
}
