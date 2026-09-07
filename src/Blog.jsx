import { Link } from 'react-router-dom'
import { POSTS, postsByProject } from './blogData'
import BizInfo from './BizInfo'

function fmtDate(iso) {
  return iso ? iso.replaceAll('-', '.') : ''
}

export default function Blog() {
  // 🔴 프로젝트별로 묶어 보여준다(2026-09-07). 전에는 27편이 날짜순으로 한 줄에 늘어서
  //    있어서 "무엇에 대한 글인지"가 안 보였다. 묶음 순서는 PROJECTS 배열 순서다.
  const groups = postsByProject()

  return (
    <div className="page">
      <Link to="/" className="back">← 작업실로</Link>

      <header className="dhero">
        <h1 className="dhero__name">블로그</h1>
        <p className="dhero__desc">바이브 코딩으로 만들고 운영하며 남긴 기록. 프로젝트별로 묶었습니다.</p>
      </header>

      {POSTS.length === 0 ? (
        <p className="section__para">아직 글이 없습니다. 곧 채워집니다.</p>
      ) : (
        groups.map((g) => (
        <section className="pgroup" key={g.name}>
          <h2 className="pgroup__head">
            <span className="pgroup__emoji" aria-hidden="true">{g.emoji}</span>
            {g.slug ? (
              <Link to={`/p/${g.slug}`} className="pgroup__name">{g.name}</Link>
            ) : (
              <span className="pgroup__name">{g.name}</span>
            )}
            <span className="pgroup__count">{g.posts.length}편</span>
          </h2>
        <ul className="postlist">
          {g.posts.map((p) => (
            <li key={p.slug}>
              <Link className="postcard" to={`/blog/${p.slug}`}>
                {/* 썸네일 — cover 가 없거나 파일이 사라져도 색조 밴드가 남는다 */}
                <span className="postcard__media">
                  <span className="postcard__ph">{p.tags[0] || 'NOTE'}</span>
                  {p.cover && (
                    <img
                      src={p.cover}
                      alt=""
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                </span>

                <span className="postcard__body">
                  <span className="postcard__meta">
                    {p.tags[0] && <span className="postcard__cat">{p.tags[0]}</span>}
                    <span className="postcard__min">{p.readMin}분 읽기</span>
                  </span>

                  <h2 className="postcard__title">{p.title}</h2>
                  {p.summary && <p className="postcard__sum">{p.summary}</p>}

                  {p.date && <span className="postcard__date">{fmtDate(p.date)}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        </section>
        ))
      )}

      <footer className="foot">
        <Link to="/" className="back">← 작업실로 돌아가기</Link>
        <BizInfo />
      </footer>
    </div>
  )
}
