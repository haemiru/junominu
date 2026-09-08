import { Link, useLocation } from 'react-router-dom'
import { ME } from './projects'
import Logo from './Logo'

// ────────────────────────────────────────────────────────────────
//  상단 바 — 모든 페이지 공통 (App.jsx 가 라우트 위에 한 번만 그린다)
//
//  원래 Home.jsx 안에만 있어서 /blog · /p/:slug · /courses 로 들어가면
//  사라졌다. "어느 사이트인지"와 "다른 데로 가는 길"이 같이 없어지는 셈이라
//  2026-09-08 에 여기로 뺐다.
//
//  🔴 내비는 4개까지만(DESIGN.md §10 "Easy to answer"). 늘리려면 뭘 뺄지 먼저 정할 것.
//  🔴 홈이냐 아니냐로 링크 종류가 갈린다 —
//     홈에서는 같은 문서 안 이동이라 순수 앵커(<a href="#work">)가 맞고,
//     다른 페이지에서는 라우터 이동이라 <Link to="/#work"> 여야 한다.
//     (해시로 들어온 뒤 그 자리로 스크롤하는 일은 App.jsx 의 ScrollToTop 이 한다.)
// ────────────────────────────────────────────────────────────────
export default function TopBar() {
  const home = useLocation().pathname === '/'

  return (
    <div className="topbar">
      <div className="topbar__inner">
        {home ? (
          <a className="topbar__brand" href="#top" aria-label={ME.name}>
            <Logo size={30} />
            <span className="topbar__name">{ME.name}</span>
          </a>
        ) : (
          <Link className="topbar__brand" to="/" aria-label={`${ME.name} — 홈으로`}>
            <Logo size={30} />
            <span className="topbar__name">{ME.name}</span>
          </Link>
        )}

        <nav className="topbar__nav" aria-label="바로가기">
          {home ? <a href="#work">프로젝트</a> : <Link to="/#work">프로젝트</Link>}
          <Link to="/blog">블로그</Link>
          <Link to="/prompts">프롬프트 노트</Link>
          <Link to="/contact">문의하기</Link>
        </nav>
      </div>
    </div>
  )
}
