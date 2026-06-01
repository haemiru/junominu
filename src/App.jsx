import './App.css'
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

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <p className="hero__kicker">VIBE CODING WORKSHOP</p>
        <h1 className="hero__name">{ME.name}<span className="hero__dot">.</span></h1>
        <p className="hero__tagline">{ME.tagline}</p>
        <p className="hero__intro">{ME.intro}</p>
      </header>

      <main className="grid">
        {PROJECTS.map((p) => <ProjectCard key={p.name} p={p} />)}
      </main>

      <footer className="foot">
        <span>© {new Date().getFullYear()} {ME.name}</span>
        <span className="foot__sep">·</span>
        <span>made with vibe coding</span>
      </footer>
    </div>
  )
}
