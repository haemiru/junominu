import { Link } from 'react-router-dom'
import { PROJECTS } from './projects'

// 모든 프로젝트의 detail.prompts 를 모아 보여주는 "프롬프트 노트" 페이지.
// projects.js의 데이터를 그대로 읽으므로, (초안)을 실제 프롬프트로 채우면 자동 반영된다.
export default function Prompts() {
  const groups = PROJECTS.filter((p) => p.detail?.prompts?.length > 0)

  return (
    <div className="page">
      <Link to="/" className="back">← 작업실로</Link>

      <header className="dhero">
        <h1 className="dhero__name">프롬프트 노트</h1>
        <p className="dhero__desc">
          프로젝트를 만들며 실제로 썼던 핵심 프롬프트 모음. 바이브 코딩의 재료입니다.
        </p>
      </header>

      {groups.length === 0 ? (
        <p className="section__para">아직 정리된 프롬프트가 없습니다.</p>
      ) : (
        groups.map((p) => (
          <section className="dsection" key={p.name}>
            <div className="promptgroup__head">
              <span aria-hidden="true">{p.emoji}</span>
              <span className="promptgroup__name">{p.name}</span>
              {p.slug && (
                <Link className="promptgroup__more" to={`/p/${p.slug}`}>
                  메이킹 스토리 →
                </Link>
              )}
            </div>
            <div className="prompts">
              {p.detail.prompts.map((pr, i) => {
                const draft = pr.title.includes('(초안)')
                return (
                  <figure className="prompt" key={i}>
                    <figcaption className="prompt__title">
                      {pr.title}
                      {draft && <span className="prompt__draft">초안</span>}
                    </figcaption>
                    <blockquote className="prompt__text">{pr.text}</blockquote>
                  </figure>
                )
              })}
            </div>
          </section>
        ))
      )}

      {groups.length > 0 && (
        <section className="cta">
          <div className="cta__inner">
            <p className="hero__kicker cta__kicker">이 프롬프트가 도움이 됐다면</p>
            <h2 className="cta__title">내 프로젝트엔 어떻게 적용할까요?</h2>
            <p className="cta__lead">
              전부 실제로 써서 배포까지 간 프롬프트예요. 막상 내 것에 적용하려면
              막히는 지점이 생기죠. 1:1 코칭·외주로 같이 풀어드립니다.
            </p>
            <Link className="btn btn--primary" to="/contact">코칭 · 외주 문의하기 →</Link>
          </div>
        </section>
      )}

      <footer className="foot">
        <Link to="/" className="back">← 작업실로 돌아가기</Link>
      </footer>
    </div>
  )
}
