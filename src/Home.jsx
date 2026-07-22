import { Link } from 'react-router-dom'
import Logo from './Logo'
import { ME, PROJECTS, STATUS, totalCommits, maxCommits } from './projects'

const LINK_ICONS = {
  github: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z"/>
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/>
      <path d="m3.5 6.5 8.5 6 8.5-6"/>
    </svg>
  ),
}

// 카드 상단 미디어 밴드. 썸네일 이미지가 있으면 깔고, 없으면 tint 그라데이션 +
// 큰 이모지로 대체. 이미지가 깨지면 onError로 숨겨 그라데이션 배경만 남김(graceful).
function CardMedia({ p }) {
  const tint = p.detail?.tint ?? 'var(--accent)'
  const img = p.detail?.thumb ?? p.detail?.cover
  return (
    <div
      className="card__media"
      style={{ '--tint': tint }}
      aria-hidden="true"
    >
      <span className="card__media-emoji">{p.emoji}</span>
      {img && (
        <img
          className="card__media-img"
          src={img}
          alt=""
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      )}
    </div>
  )
}

function ProjectCard({ p }) {
  const status = STATUS[p.status] ?? STATUS.idea
  const hasDetail = Boolean(p.detail && p.slug)

  const inner = (
    <>
      <CardMedia p={p} />
      <div className="card__top">
        <span className={status.cls}>{status.label}</span>
        {p.detail?.commits && (
          <span className="card__commits">{p.detail.commits} commits</span>
        )}
      </div>
      <h2 className="card__title">{p.name}</h2>
      <p className="card__desc">{p.description}</p>
      {p.tags?.length > 0 && (
        <ul className="card__tags">
          {p.tags.map((t) => <li key={t}>{t}</li>)}
        </ul>
      )}
      {hasDetail
        ? <span className="card__cta">메이킹 스토리 →</span>
        : p.url && <span className="card__cta">열기 →</span>}
    </>
  )

  // 상세가 있으면 내부 상세 페이지로, 없으면 외부 링크, 둘 다 없으면 정적 카드
  if (hasDetail) {
    return <Link className="card card--link" to={`/p/${p.slug}`}>{inner}</Link>
  }
  if (p.url) {
    return <a className="card card--link" href={p.url} target="_blank" rel="noreferrer">{inner}</a>
  }
  return <div className="card">{inner}</div>
}

function Journey() {
  // detail.started 가 있는 프로젝트를 시작일 내림차순(최근이 위)으로
  const items = PROJECTS
    .filter((p) => p.detail?.started)
    .slice()
    .sort((a, b) => (a.detail.started < b.detail.started ? 1 : -1))

  if (items.length === 0) return null

  const max = maxCommits()

  return (
    <section id="journey" className="section">
      <h2 className="section__label">JOURNEY — 시간순 기록</h2>
      <ol className="tl tl--journey">
        {items.map((p) => {
          const status = STATUS[p.status] ?? STATUS.idea
          const tint = p.detail.tint ?? 'var(--accent)'
          const commits = p.detail.commits
          const body = (
            <>
              <span className="tl__date">{p.detail.started.replaceAll('-', '.')}</span>
              <span className="jrow">
                <span className="jrow__emoji" aria-hidden="true">{p.emoji}</span>
                <span className="jrow__name">{p.name}</span>
                <span className={status.cls}>{status.label}</span>
              </span>
              <span className="tl__label">{p.description}</span>
              {commits && (
                <span className="jbar" title={`${commits} commits`}>
                  <span
                    className="jbar__fill"
                    style={{ width: `${Math.round((commits / max) * 100)}%`, '--tint': tint }}
                  />
                  <span className="jbar__n">{commits} commits</span>
                </span>
              )}
            </>
          )
          return (
            <li className="tl__item" key={p.name}>
              {p.slug ? (
                <Link className="jlink" to={`/p/${p.slug}`}>{body}</Link>
              ) : (
                body
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

// RÉSUMÉ — 학력·경력 세로 연표. JOURNEY와 같은 .tl 타임라인 톤을 재사용.
function Resume() {
  if (!ME.resume?.length) return null
  return (
    <section id="resume" className="section">
      <h2 className="section__label">RÉSUMÉ — 걸어온 길</h2>
      <ol className="tl tl--resume">
        {ME.resume.map((r, i) => (
          <li className="tl__item" key={i}>
            <span className="tl__date">{r.period}</span>
            <span className="rrow">
              <span className={`rtag rtag--${r.kind}`}>
                {r.kind === 'edu' ? '학력' : '경력'}
              </span>
              <span className="tl__label rrow__label">{r.label}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
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
    { n: totalCommits().toLocaleString(), label: '누적 커밋' },
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

// 홈 하단 CTA 밴드 — 포트폴리오를 다 본 방문자를 코칭·외주로 전환. ME.contact 자동 렌더.
function ContactCTA() {
  const c = ME.contact
  if (!c) return null
  return (
    <section id="contact" className="cta">
      <div className="cta__inner">
        <p className="hero__kicker cta__kicker">WORK WITH ME</p>
        <h2 className="cta__title">함께 만들까요?</h2>
        <p className="cta__lead">
          {c.lead.split('\n').map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </p>
        <div className="cta__offers">
          {c.offers.map((o) => (
            <span className="cta__chip" key={o.key}>{o.emoji} {o.title}</span>
          ))}
        </div>
        <Link className="btn btn--primary" to="/contact">코칭 · 외주 문의하기 →</Link>
      </div>
    </section>
  )
}

export default function Home() {
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
        <div className="hero__actions">
          <Link className="btn btn--primary" to="/contact">1:1 코칭 · 외주 문의 →</Link>
        </div>
        <nav className="hero__nav" aria-label="섹션 바로가기">
          <a href="#work">PROJECTS</a>
          <a href="#about">About</a>
          <a href="#resume">RÉSUMÉ</a>
          <a href="#now">Now</a>
          <a href="#stack">STACK</a>
          <a href="#journey">JOURNEY</a>
          <Link to="/blog">BLOG</Link>
          <Link to="/contact">함께하기</Link>
        </nav>
      </header>

      <Stats />

      <section id="work">
        <h2 className="section__label">PROJECTS — 바이브 코딩으로 만든 것들</h2>
        <div className="grid">
          {PROJECTS.map((p) => <ProjectCard key={p.name} p={p} />)}
        </div>
      </section>

      <section id="about" className="section">
        <h2 className="section__label">ABOUT — 비개발자의 바이브 코딩</h2>
        {ME.about.map((para, i) => (
          <p className="section__para" key={i}>
            {para.split('\n').map((line, j) => (
              <span key={j}>{j > 0 && <br />}{line}</span>
            ))}
          </p>
        ))}
        <p className="links__lead">FIND ME</p>
        <ul className="links">
          {ME.links.map((l) => (
            <li key={l.label}>
              <a className="link" href={l.url} target="_blank" rel="noreferrer">
                <span className="link__icon">{LINK_ICONS[l.icon]}</span>
                <span className="link__label">{l.label}</span>
                {l.hint && <span className="link__hint">{l.hint}</span>}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Resume />

      <section id="now" className="section">
        <h2 className="section__label">NOW — 지금 만들고 있는 것</h2>
        <ul className="now">
          {ME.now.map((item, i) => (
            <li className="now__item" key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="stack" className="section">
        <h2 className="section__label">STACK — 내가 쓰는 도구</h2>
        <div className="stack">
          {ME.stack.map((g) => (
            <div className="stack__group" key={g.group}>
              <span className="stack__label">{g.group}</span>
              <ul className="stack__items">
                {g.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Journey />

      <ContactCTA />

      <footer className="foot">
        <span>© {new Date().getFullYear()} {ME.name}</span>
        <span className="foot__sep">·</span>
        <Link to="/prompts" className="foot__link">프롬프트 노트</Link>
        <span className="foot__sep">·</span>
        <Link to="/blog" className="foot__link">블로그</Link>
        <span className="foot__sep">·</span>
        <Link to="/contact" className="foot__link">코칭·외주</Link>
        <span className="foot__sep">·</span>
        <span>made with vibe coding</span>
      </footer>
    </div>
  )
}
