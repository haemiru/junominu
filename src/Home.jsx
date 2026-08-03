import { Link } from 'react-router-dom'
import Logo from './Logo'
import {
  ME, PROJECTS, STATUS, totalCommits, maxCommits,
  featuredProjects, projectsByCategory,
} from './projects'

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

// 카드 껍데기 — 상세가 있으면 내부 상세로, 없으면 외부 링크, 둘 다 없으면 정적 div.
// 대표작 카드(.card)와 컴팩트 카드(.mini)가 같은 분기를 쓴다.
function CardShell({ p, className, children }) {
  if (p.detail && p.slug) {
    return <Link className={`${className} ${className}--link`} to={`/p/${p.slug}`}>{children}</Link>
  }
  if (p.url) {
    return (
      <a className={`${className} ${className}--link`} href={p.url} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  return <div className={className}>{children}</div>
}

// 대표작 — 2열 큰 카드. 앱 캡처가 주인공이다(CLAUDE.md 디자인 원칙).
function ProjectCard({ p }) {
  const status = STATUS[p.status] ?? STATUS.idea
  const hasDetail = Boolean(p.detail && p.slug)

  return (
    <CardShell p={p} className="card">
      <CardMedia p={p} />
      <div className="card__top">
        <span className={status.cls}>{status.label}</span>
        {p.detail?.commits && (
          <span className="card__commits">{p.detail.commits} commits</span>
        )}
      </div>
      <h3 className="card__title">{p.name}</h3>
      <p className="card__desc">{p.description}</p>
      {p.tags?.length > 0 && (
        <ul className="card__tags">
          {p.tags.map((t) => <li key={t}>{t}</li>)}
        </ul>
      )}
      {hasDetail
        ? <span className="card__cta">메이킹 스토리 →</span>
        : p.url && <span className="card__cta">열기 →</span>}
    </CardShell>
  )
}

// 컴팩트 카드 — 카테고리 목록용. 이미지 없이 이모지·이름·한 줄로 밀도를 높인다.
// 프로젝트가 수십 개가 돼도 페이지가 감당되는 이유가 이 카드다.
function MiniCard({ p }) {
  const status = STATUS[p.status] ?? STATUS.idea
  return (
    <CardShell p={p} className="mini">
      <span className="mini__emoji" aria-hidden="true">{p.emoji}</span>
      <span className="mini__body">
        <span className="mini__head">
          <span className="mini__name">{p.name}</span>
          <span className={status.cls}>{status.label}</span>
        </span>
        <span className="mini__desc">{p.description}</span>
      </span>
    </CardShell>
  )
}

// PROJECTS 섹션 — 대표작 2열 + 카테고리별 컴팩트 3열.
function Work() {
  const featured = featuredProjects()
  const groups = projectsByCategory()

  return (
    <section id="work" className="section">
      <h2 className="section__title">바이브 코딩으로 만든 것들</h2>
      <p className="section__sub">
        기획부터 배포·운영까지 혼자 했습니다. 카드를 누르면 어떻게 만들었는지 나옵니다.
      </p>

      <div className="grid">
        {featured.map((p) => <ProjectCard key={p.name} p={p} />)}
      </div>

      {groups.map((g) => (
        <div className="catgroup" key={g.key}>
          <div className="catgroup__head">
            <h3 className="catgroup__title">{g.label}</h3>
            {g.desc && <span className="catgroup__desc">{g.desc}</span>}
            <span className="catgroup__n">{g.items.length}</span>
          </div>
          <div className="minigrid">
            {g.items.map((p) => <MiniCard key={p.name} p={p} />)}
          </div>
        </div>
      ))}
    </section>
  )
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
      <h2 className="section__title">시간순으로 본 여정</h2>
      <p className="section__sub">막대는 누적 커밋 수입니다. 최근이 위.</p>
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
// 2026-08-03부터 독립 섹션이 아니라 ABOUT 안에 들어간다(섹션 수 줄이기).
function Resume() {
  if (!ME.resume?.length) return null
  return (
    <div id="resume" className="subsection">
      <h3 className="subsection__title">걸어온 길</h3>
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
    </div>
  )
}

function monthsSince(ym) {
  const [y, m] = ym.split('-').map(Number)
  const now = new Date()
  return Math.max(1, (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m))
}

// 히어로 아래 작업물 스트립 (2026-08-03) — Dribbble 히어로 패턴.
// SaaS 랜딩 950개가 예외 없이 하는 단 하나가 "히어로 바로 아래 제품 화면"인데
// 이 사이트엔 첫 화면에 이미지가 한 장도 없었다. 스크롤 전에 만든 것이 보여야 한다.
// 양옆이 잘려 나가면서 "더 있다"는 신호가 되고, 그게 스크롤을 부른다.
function WorkStrip() {
  const items = PROJECTS.filter((p) => p.detail?.thumb || p.detail?.cover)
  if (!items.length) return null
  return (
    <div className="strip">
      <div className="strip__row">
        {items.map((p) => {
          const img = p.detail.thumb ?? p.detail.cover
          const inner = (
            <img src={img} alt={p.name} loading="lazy"
                 onError={(e) => { e.currentTarget.closest('.strip__item')?.remove() }} />
          )
          return p.slug
            ? <Link className="strip__item" key={p.name} to={`/p/${p.slug}`} title={p.name}>{inner}</Link>
            : <span className="strip__item" key={p.name} title={p.name}>{inner}</span>
        })}
      </div>
    </div>
  )
}

// 숫자 밴드 (2026-08-03) — Mobbin 랜딩의 "A growing library of / 1,150 apps …" 패턴.
// 지표를 얇은 줄로 흘리지 않고 화면 한 장을 통째로 쓰는 자랑으로 만든다.
// 숫자 주위에 프로젝트 이모지가 떠 있다(모빈은 앱 아이콘을 띄운다).
function NumbersBand() {
  const live = PROJECTS.filter((p) => p.status === 'live').length
  const floats = PROJECTS.filter((p) => p.emoji).slice(0, 8)
  return (
    <section className="nums" aria-label="작업실 지표">
      <div className="nums__floats" aria-hidden="true">
        {floats.map((p, i) => (
          <span className={`nums__float nums__float--${i + 1}`} key={p.name}>{p.emoji}</span>
        ))}
      </div>
      <p className="nums__kicker">혼자 기획하고, 만들고, 운영합니다</p>
      <p className="nums__line">{PROJECTS.length}개 프로젝트</p>
      <p className="nums__line">{totalCommits().toLocaleString()}번의 커밋</p>
      <p className="nums__line">{live}개 운영 중</p>
      {/* monthsSince 는 "경과한 개월 수"다(2026-01 시작 → 2026-08 이면 7).
          "N개월째"로 쓰면 한 달 어긋나 보이므로 "시작한 지 N개월"로 적는다. */}
      <p className="nums__foot">
        시작한 지 {monthsSince(ME.since)}개월 · 전부 AI 바이브 코딩으로
      </p>
    </section>
  )
}

// PROJECTS 바로 아래 프로모 밴드 — 카드를 다 본 방문자를 프롬프트 노트(/prompts)로.
// 개수는 projects.js의 detail.prompts에서 자동 계산되므로 프롬프트를 추가하면 알아서 늘어난다.
function PromptsBand() {
  const withPrompts = PROJECTS.filter((p) => p.detail?.prompts?.length > 0)
  const count = withPrompts.reduce((n, p) => n + p.detail.prompts.length, 0)
  if (!count) return null
  return (
    <section className="band">
      <div className="band__text">
        <p className="band__kicker">PROMPT NOTE</p>
        <h2 className="band__title">이 프로젝트들을 만든 실제 프롬프트</h2>
        <p className="band__lead">
          위 {withPrompts.length}개 프로젝트를 만들며 실제로 썼던 핵심 프롬프트 {count}개를
          다듬지 않고 그대로 모아 뒀습니다. 바이브 코딩의 재료입니다.
        </p>
      </div>
      <Link className="btn btn--ghost band__btn" to="/prompts">프롬프트 노트 보기 →</Link>
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
        <p className="cta__kicker">WORK WITH ME</p>
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
    // 🔴 풀블리드(.strip·.nums)를 .page 안에 넣고 `margin: 0 calc(50% - 50vw)` 로 빼면
    //    50vw 가 스크롤바 폭을 포함해서 가로 스크롤이 생긴다. 그래서 아예 형제로 쪼갰다.
    //    .page 가 max-width 를 맡고, 그 사이 구간은 자연스럽게 화면 전체를 쓴다.
    <>
    {/* 상단 바 — 로고와 내비를 히어로 밖으로 뺐다(2026-08-03 2차).
        히어로 안에 쌓아두니 PC 폭에서 7단이 세로로 늘어져 어색했다.
        내비는 4개까지만(DESIGN.md §10 "Easy to answer"). */}
    <div className="topbar">
      <div className="topbar__inner">
        <a className="topbar__brand" href="#top" aria-label={ME.name}>
          <Logo size={30} />
          <span className="topbar__name">{ME.name}</span>
        </a>
        <nav className="topbar__nav" aria-label="바로가기">
          <a href="#work">프로젝트</a>
          <Link to="/blog">블로그</Link>
          <Link to="/prompts">프롬프트 노트</Link>
          <Link to="/contact">함께하기</Link>
        </nav>
      </div>
    </div>

    <div className="page page--top" id="top">
      {/* 히어로는 4단만 — 배지 · 이름 · 한 줄 · CTA (Dribbble 구조).
          예전엔 태그라인과 소개문이 둘 다 있었는데 배지까지 합쳐 "바이브 코딩"을
          세 번, "혼자"를 두 번 말하고 있었다. 한 줄로 합쳤다. */}
      <header className="hero">
        {ME.badge && <p className="hero__badge">{ME.badge}</p>}
        <h1 className="hero__name">{ME.name}<span className="hero__dot">.</span></h1>
        <p className="hero__tagline">{ME.tagline}</p>
        {/* CTA는 하나만. 둘이면 고민하고, 고민하면 안 누른다(Granola 랜딩 참고).
            코칭 전환은 상단 내비 "함께하기" + 하단 ContactCTA 밴드가 받는다 —
            요구보다 가치가 먼저다(DESIGN.md §10 "Value first, cost later"). */}
        <div className="hero__actions">
          <a className="btn btn--primary" href="#work">만든 것들 보기 ↓</a>
        </div>
      </header>
    </div>

    <WorkStrip />
    <NumbersBand />

    <div className="page page--rest">
      <Work />

      <PromptsBand />

      {/* ABOUT — 소개 + 걸어온 길(RÉSUMÉ) + 링크를 한 섹션으로 합쳤다(2026-08-03) */}
      <section id="about" className="section">
        <h2 className="section__title">비개발자의 바이브 코딩</h2>
        {ME.about.map((para, i) => (
          <p className="section__para" key={i}>
            {para.split('\n').map((line, j) => (
              <span key={j}>{j > 0 && <br />}{line}</span>
            ))}
          </p>
        ))}

        <Resume />

        <div className="subsection">
          <h3 className="subsection__title">연락처</h3>
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
        </div>
      </section>

      {/* NOW + STACK 을 한 섹션으로 합쳤다(2026-08-03) */}
      <section id="now" className="section">
        <h2 className="section__title">지금 만들고 있는 것</h2>
        <ul className="now">
          {ME.now.map((item, i) => (
            <li className="now__item" key={i}>{item}</li>
          ))}
        </ul>

        <div className="subsection" id="stack">
          <h3 className="subsection__title">쓰는 도구</h3>
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
    </>
  )
}
