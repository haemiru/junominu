import { Link, Navigate } from 'react-router-dom'
import { ME, PROJECTS, totalCommits } from './projects'

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

function OfferCard({ o, contact }) {
  // 개별 폼(offer.formUrl) → 공용 폼(contact.formUrl) → 이메일 폴백 순으로 연결
  const url = o.formUrl || contact.formUrl || gmailCompose(contact.email, o.subject)
  return (
    <article className="offer">
      <div className="offer__head">
        <span className="offer__emoji" aria-hidden="true">{o.emoji}</span>
        <h3 className="offer__title">{o.title}</h3>
      </div>
      <p className="offer__tagline">{o.tagline}</p>
      <p className="offer__who">{o.who}</p>
      <ul className="now">
        {o.points.map((pt, i) => <li className="now__item" key={i}>{pt}</li>)}
      </ul>
      {o.note && <p className="offer__note">{o.note}</p>}
      <a className="btn btn--primary offer__cta" href={url} target="_blank" rel="noreferrer">
        {o.cta} →
      </a>
    </article>
  )
}

export default function Contact() {
  const c = ME.contact
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
