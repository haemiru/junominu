import { useParams, Link, Navigate } from 'react-router-dom'
import { findProject, STATUS } from './projects'

function fmtDate(iso) {
  return iso.replaceAll('-', '.')
}

function daysBetween(startIso, endIso) {
  const start = new Date(startIso)
  const end = endIso ? new Date(endIso) : new Date()
  return Math.max(1, Math.round((end - start) / 86400000))
}

// 스크린샷 한 장. 이미지가 없거나 깨지면 스스로 사라짐(graceful fallback).
function Shot({ src, alt, caption }) {
  return (
    <figure className="dshot">
      <img
        className="dshot__img"
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          const fig = e.currentTarget.closest('.dshot')
          if (fig) fig.style.display = 'none'
        }}
      />
      {caption && <figcaption className="dshot__cap">{caption}</figcaption>}
    </figure>
  )
}

// shots 항목은 문자열("/shots/a.png") 또는 { src, caption } 둘 다 허용
function shotSrc(s) {
  return typeof s === 'string' ? s : s?.src
}
function shotCap(s) {
  return typeof s === 'string' ? '' : s?.caption
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = findProject(slug)

  // 상세 데이터가 없는 프로젝트는 홈으로 되돌림
  if (!p || !p.detail) return <Navigate to="/" replace />

  const d = p.detail
  const status = STATUS[p.status] ?? STATUS.idea
  const isBeta = p.status !== 'live'
  const days = d.started ? daysBetween(d.started, d.launched) : null

  return (
    <div className="page">
      <Link to="/" className="back">← 작업실로</Link>

      <header className="dhero">
        <div className="dhero__top">
          <span className="dhero__emoji" aria-hidden="true">{p.emoji}</span>
          <span className={status.cls}>{status.label}</span>
        </div>
        <h1 className="dhero__name">{p.name}</h1>
        <p className="dhero__desc">{p.description}</p>
        {p.tags?.length > 0 && (
          <ul className="card__tags dhero__tags">
            {p.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
        {p.url && (
          <a className="dhero__cta" href={p.url} target="_blank" rel="noreferrer">
            사이트 열기 →
          </a>
        )}
      </header>

      {/* 커버 이미지(있을 때만) — public/ 기준 경로. 없으면 위 이모지 히어로 유지 */}
      {d.cover && <Shot src={d.cover} alt={`${p.name} 미리보기`} caption={d.coverCaption} />}

      {(days || d.started) && (
        <section className="dmeta">
          {days && (
            <div className="dmeta__item">
              <span className="dmeta__n">{days}일</span>
              <span className="dmeta__label">0 → {isBeta ? '베타' : '배포'}</span>
            </div>
          )}
          {d.started && (
            <div className="dmeta__item">
              <span className="dmeta__n">{fmtDate(d.started)}</span>
              <span className="dmeta__label">첫 커밋</span>
            </div>
          )}
        </section>
      )}

      {d.summary?.length > 0 && (
        <section className="dsection">
          <h2 className="section__label">왜 만들었나</h2>
          {d.summary.map((para, i) => (
            <p className="section__para" key={i}>{para}</p>
          ))}
        </section>
      )}

      {d.features?.length > 0 && (
        <section className="dsection">
          <h2 className="section__label">핵심 기능</h2>
          <ul className="now">
            {d.features.map((f, i) => <li className="now__item" key={i}>{f}</li>)}
          </ul>
        </section>
      )}

      {d.shots?.length > 0 && (
        <section className="dsection">
          <h2 className="section__label">화면</h2>
          <div className="shots">
            {d.shots.map((s, i) => (
              <Shot key={i} src={shotSrc(s)} alt={`${p.name} 화면 ${i + 1}`} caption={shotCap(s)} />
            ))}
          </div>
        </section>
      )}

      {d.stack?.length > 0 && (
        <section className="dsection">
          <h2 className="section__label">스택</h2>
          <ul className="stack__items">
            {d.stack.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      )}

      {d.timeline?.length > 0 && (
        <section className="dsection">
          <h2 className="section__label">0 → 배포 타임라인</h2>
          <ol className="tl">
            {d.timeline.map((t, i) => (
              <li className="tl__item" key={i}>
                <span className="tl__date">{fmtDate(t.date)}</span>
                <span className="tl__label">{t.label}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {d.challenges?.length > 0 && (
        <section className="dsection">
          <h2 className="section__label">막혔던 점</h2>
          <ul className="now">
            {d.challenges.map((c, i) => <li className="now__item" key={i}>{c}</li>)}
          </ul>
        </section>
      )}

      {d.prompts?.length > 0 && (
        <section className="dsection">
          <h2 className="section__label">핵심 프롬프트</h2>
          <div className="prompts">
            {d.prompts.map((pr, i) => (
              <figure className="prompt" key={i}>
                <figcaption className="prompt__title">{pr.title}</figcaption>
                <blockquote className="prompt__text">{pr.text}</blockquote>
              </figure>
            ))}
          </div>
        </section>
      )}

      {d.retro?.length > 0 && (
        <section className="dsection">
          <h2 className="section__label">회고</h2>
          {d.retro.map((r, i) => (
            <p className="section__para" key={i}>{r}</p>
          ))}
        </section>
      )}

      <footer className="foot">
        <Link to="/" className="back">← 작업실로 돌아가기</Link>
      </footer>
    </div>
  )
}
