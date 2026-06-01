import { Link } from 'react-router-dom'
import { POSTS } from './blogData'

function fmtDate(iso) {
  return iso ? iso.replaceAll('-', '.') : ''
}

export default function Blog() {
  return (
    <div className="page">
      <Link to="/" className="back">← 작업실로</Link>

      <header className="dhero">
        <h1 className="dhero__name">블로그</h1>
        <p className="dhero__desc">바이브 코딩으로 만들고 운영하며 남긴 기록.</p>
      </header>

      {POSTS.length === 0 ? (
        <p className="section__para">아직 글이 없습니다. 곧 채워집니다.</p>
      ) : (
        <ul className="postlist">
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link className="postcard" to={`/blog/${p.slug}`}>
                {p.date && <span className="postcard__date">{fmtDate(p.date)}</span>}
                <h2 className="postcard__title">{p.title}</h2>
                {p.summary && <p className="postcard__sum">{p.summary}</p>}
                {p.tags?.length > 0 && (
                  <ul className="card__tags">
                    {p.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <footer className="foot">
        <Link to="/" className="back">← 작업실로 돌아가기</Link>
      </footer>
    </div>
  )
}
