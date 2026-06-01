import './App.css'
import Logo from './Logo'
import { ME, PROJECTS } from './projects'

const STATUS = {
  live:     { label: 'LIVE',   cls: 'status status--live' },
  building: { label: '작업 중', cls: 'status status--building' },
  idea:     { label: '구상',   cls: 'status status--idea' },
}

function ProjectCard({ p }) {
  const status = STATUS[p.status] ?? STATUS.idea
  const Tag = p.url ? 'a' : 'div'
  const linkProps = p.url ? { href: p.url, target: '_blank', rel: 'noreferrer' } : {}

  return (
    <Tag className={`card${p.url ? ' card--link' : ''}`} {...linkProps}>
      <div className="card__top">
        <span className="card__emoji" aria-hidden="true">{p.emoji}</span>
        <span className={status.cls}>{status.label}</span>
      </div>
      <h2 className="card__title">{p.name}</h2>
      <p className="card__desc">{p.description}</p>
      {p.tags?.length > 0 && (
        <ul className="card__tags">
          {p.tags.map((t) => <li key={t}>{t}</li>)}
        </ul>
      )}
      {p.url && <span className="card__cta">열기 →</span>}
    </Tag>
  )
}

function monthsSince(ym) {
  const [y, m] = ym.split('-').map(Number)
  const now = new Date()
  return Math.max(1, (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m))
}

function Stats() {
  const live = PROJECTS.filter((p) => p.status === 'live').length
  const building = PROJECTS.filter((p) => p.status === 'building').length
  const stats = [
    { n: PROJECTS.length, label: '프로젝트' },
    { n: live, label: '운영 중' },
    { n: building, label: '작업 중' },
    { n: monthsSince(ME.since), label: '개월째 빌딩' },
  ]
  return (
    <section className="stats" aria-label="작업실 지표">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <span className="stat__n">{s.n}</span>
          <span className="stat__label">{s.label}</span>
        </div>
      ))}
    </section>
  )
}

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero__brand">
          <Logo size={56} />
          <p className="hero__kicker">VIBE CODING WORKSHOP</p>
        </div>
        <h1 className="hero__name">{ME.name}<span className="hero__dot">.</span></h1>
        <p className="hero__tagline">{ME.tagline}</p>
        <p className="hero__intro">{ME.intro}</p>
      </header>

      <Stats />

      <section id="about" className="section">
        <h2 className="section__label">ABOUT — 비개발자의 바이브 코딩</h2>
        {ME.about.map((para, i) => (
          <p className="section__para" key={i}>{para}</p>
        ))}
        <ul className="links">
          {ME.links.map((l) => (
            <li key={l.label}>
              <a href={l.url} target="_blank" rel="noreferrer">{l.label} →</a>
            </li>
          ))}
        </ul>
      </section>

      <section id="now" className="section">
        <h2 className="section__label">NOW — 지금 만드는 것</h2>
        <ul className="now">
          {ME.now.map((item, i) => (
            <li className="now__item" key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="work">
        <h2 className="section__label">PROJECTS — 만든 것들</h2>
        <div className="grid">
          {PROJECTS.map((p) => <ProjectCard key={p.name} p={p} />)}
        </div>
      </section>

      <footer className="foot">
        <span>© {new Date().getFullYear()} {ME.name}</span>
        <span className="foot__sep">·</span>
        <span>made with vibe coding</span>
      </footer>
    </div>
  )
}
