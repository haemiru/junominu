import { useParams, Link, Navigate } from 'react-router-dom'
import { findPost } from './blogData'

function fmtDate(iso) {
  return iso ? iso.replaceAll('-', '.') : ''
}

export default function Post() {
  const { slug } = useParams()
  const post = findPost(slug)

  // 없는 글은 목록으로 되돌림
  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="page">
      <Link to="/blog" className="back">← 블로그</Link>

      <header className="dhero">
        {post.date && <span className="post__date">{fmtDate(post.date)}</span>}
        <h1 className="dhero__name post__title">{post.title}</h1>
        {post.tags?.length > 0 && (
          <ul className="card__tags dhero__tags">
            {post.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
      </header>

      {/* 본문은 내가 직접 쓴 로컬 .md → 신뢰 가능한 출처 */}
      <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

      <footer className="foot">
        <Link to="/blog" className="back">← 블로그로 돌아가기</Link>
      </footer>
    </div>
  )
}
