import './App.css'

const BOOKSTORE_URL = 'https://jjangsaem.com'

const tools = [
  {
    id: 'kungkung-mate',
    name: '킁킁메이트',
    tagline: '아이의 후각·호흡 루틴을 함께하는 작은 친구',
    description:
      '향과 호흡을 활용해 아이가 스스로 진정하고 몰입할 수 있도록 돕는 보호자용 도구입니다.',
    status: 'live',
    href: 'https://kungkung.junominu.com/?utm_source=junominu-hub&utm_medium=hub-card&utm_campaign=kungkung-mate-trial',
  },
]

function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <span className="badge">키즈피지오짱샘 공식 도구</span>
        <a
          className="site-header__link"
          href={BOOKSTORE_URL}
          target="_blank"
          rel="noreferrer"
        >
          짱샘의 책방 →
        </a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero__title">키즈피지오짱샘 도구 모음</h1>
        <p className="hero__subtitle">
          감각·호흡·놀이 기반으로 아이와 보호자의 하루를 돕는 작은 도구들을
          모았습니다.
        </p>
      </div>
    </section>
  )
}

function ToolCard({ tool }) {
  const isComingSoon = tool.status === 'coming-soon'
  const isLive = tool.status === 'live'

  const cardClass = `card${isComingSoon ? ' card--soon' : ''}${
    isLive ? ' card--live' : ''
  }`

  const content = (
    <>
      <div className="card__head">
        <h2 className="card__title">{tool.name}</h2>
        {isComingSoon && <span className="chip">Coming Soon</span>}
        {isLive && <span className="chip chip--new">NEW</span>}
      </div>
      <p className="card__tagline">{tool.tagline}</p>
      <p className="card__desc">{tool.description}</p>
      {isLive && <span className="card__cta">바로 사용해보기 →</span>}
    </>
  )

  if (isLive && tool.href) {
    return (
      <a
        className={cardClass}
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    )
  }

  return <article className={cardClass}>{content}</article>
}

function Tools() {
  return (
    <section className="tools">
      <div className="container">
        <div className="tools__grid">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <a
            className="site-footer__bookstore"
            href={BOOKSTORE_URL}
            target="_blank"
            rel="noreferrer"
          >
            📖 짱샘의 책방 — 감각 치유 전문 전자책
          </a>
        </div>
        <dl className="biz">
          <div className="biz__row">
            <dt>상호</dt>
            <dd>강남상회</dd>
            <dt>대표</dt>
            <dd>하성재</dd>
          </div>
          <div className="biz__row">
            <dt>사업자등록번호</dt>
            <dd>893-19-02019</dd>
            <dt>통신판매업</dt>
            <dd>제2025-충북청주-1318호</dd>
          </div>
          <div className="biz__row">
            <dt>주소</dt>
            <dd>충청북도 청주시 흥덕구 진재로41, 3층 A220호</dd>
          </div>
          <div className="biz__row">
            <dt>이메일</dt>
            <dd>
              <a href="mailto:junominu@gmail.com">junominu@gmail.com</a>
            </dd>
            <dt>전화</dt>
            <dd>
              <a href="tel:01057763325">010-5776-3325</a>
            </dd>
          </div>
        </dl>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} 강남상회. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Tools />
      </main>
      <Footer />
    </>
  )
}
