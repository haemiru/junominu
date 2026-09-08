import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ME, courseProof, STATUS } from './projects'
import BizInfo from './BizInfo'

// ────────────────────────────────────────────────────────────────
//  /courses — 강의 세 과정 소개 (기초 · 원데이 · 정규)
//
//  들어오는 문: /contact 의 「바이브 코딩 강의」 카드 안 "어떤걸 배우나요? →".
//  카드에는 과정마다 한 줄씩만 적혀 있어 "무엇을 배우는지"가 안 보였다 — 그 답이 여기다.
//
//  🔴 이 페이지는 「파는 페이지」다. 순서가 곧 설득이다 —
//     문제 공감 → 세 과정 비교 → 과정 상세(+ 만들 것의 화면) → 가르치는 사람
//     → 진행 방식 → 준비물·안 맞는 분 → FAQ → CTA.
//     순서를 바꾸기 전에 왜 이 순서인지 생각할 것. 제품 이야기보다 독자의 문제가 앞이다.
//
//  데이터는 전부 `projects.js` 의 `ME.courses` · `ME.courseCommon` 이고,
//  커리큘럼의 원천은 `D:/Claude-prj/lecture` 레포의 chapters/*.html 이다.
//  🔴 커리큘럼을 여기서 손으로 고치지 말 것 — 저 레포와 어긋나면 파는 것과 다른 말을 하게 된다.
//
//  탭은 주소에 남긴다(`?c=basic|oneday|regular`) — 카톡으로 "원데이는 이거예요" 하고
//  링크를 보낼 수 있어야 하기 때문이다. 값이 이상하면 첫 과정으로 떨어진다.
// ────────────────────────────────────────────────────────────────

function totalMin(curriculum) {
  return curriculum.reduce((sum, c) => sum + (c.min || 0), 0)
}

/* 이미지가 없거나 깨지면 그 자리를 통째로 감춘다 — 죽은 이미지가 곧 클레임이다. */
function Shot({ src, alt, className }) {
  const [dead, setDead] = useState(false)
  if (!src || dead) return null
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setDead(true)} />
}

function CourseBody({ c }) {
  const min = totalMin(c.curriculum)

  // 정규과정은 분 표기가 없고 회차로 묶인다 → 같은 part 가 이어지면 머리글을 한 번만 그린다.
  // 렌더 중에 변수를 바꾸지 않도록(react-hooks/immutability) 먼저 한 번에 계산한다.
  const heads = c.curriculum.map((u, i) => i === 0 || u.part !== c.curriculum[i - 1].part)

  return (
    <div className="course">
      <p className="course__lead">{c.lead}</p>

      <div className="course__meta">
        <div className="course__metaitem">
          <span className="course__metalabel">수강료</span>
          <span className="course__metavalue">{c.price}</span>
          {c.priceNote && <span className="course__metanote">{c.priceNote}</span>}
        </div>
        <div className="course__metaitem">
          <span className="course__metalabel">시간</span>
          <span className="course__metavalue">{c.length}</span>
        </div>
        <div className="course__metaitem">
          <span className="course__metalabel">진행</span>
          <span className="course__metavalue">{c.format}</span>
        </div>
      </div>

      {/* 기초처럼 결과물이 웹앱이 아닌 과정 — 가로 한 장 */}
      {c.demo && (
        <figure className="course__demo">
          <Shot className="course__demoimg" src={c.demo.src} alt={c.demo.caption} />
          <figcaption className="course__cap">{c.demo.caption}</figcaption>
        </figure>
      )}

      {/* 원데이 — 셋 중 하나를 고른다. 화면이 있으면 같이 보여준다. */}
      {c.tracks && (
        <section className="course__sec">
          <h3 className="course__h">셋 중 하나를 골라 만듭니다</h3>
          <div className="tracks">
            {c.tracks.map((t) => (
              <figure className="track" key={t.name}>
                <Shot className="track__shot" src={t.shot} alt={`${t.name} 화면 예시`} />
                <figcaption className="track__cap">
                  <span className="track__name">{t.name}</span>
                  <span className="track__desc">{t.desc}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="course__cap course__cap--after">
            강사가 만든 완성본입니다. 수강생이 하루에 만드는 수준과 같게 맞춰 두었습니다.
          </p>
        </section>
      )}

      {/* 정규 — 무엇을 만들 수 있나 */}
      {c.builds && (
        <section className="course__sec">
          <h3 className="course__h">이런 것을 만듭니다</h3>
          <div className="tracks">
            {c.builds.map((b) => (
              <figure className="track" key={b.name}>
                <Shot className="track__shot" src={b.src} alt={`${b.name} 화면 예시`} />
                <figcaption className="track__cap">
                  <span className="track__name">{b.name}</span>
                  <span className="track__desc">{b.desc}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="course__cap course__cap--after">
            예시 화면입니다. 실제로는 <b>본인 일에 쓸 것</b>을 첫 회차에 같이 정합니다.
          </p>
        </section>
      )}

      <section className="course__sec">
        <h3 className="course__h">이런 분께 맞습니다</h3>
        <ul className="now">
          {c.who.map((w, i) => <li className="now__item" key={i}>{w}</li>)}
        </ul>
      </section>

      <section className="course__sec">
        <h3 className="course__h">
          커리큘럼
          {min > 0 && <span className="course__hnote">합계 {min}분</span>}
        </h3>
        <ol className="curri">
          {c.curriculum.map((u, i) => {
            const head = heads[i]
            return (
              <li className="curri__item" key={i}>
                <span className={head ? 'curri__part' : 'curri__part curri__part--dim'}>
                  {head ? u.part : ''}
                </span>
                <span className="curri__title">{u.title}</span>
                {u.min && <span className="curri__min">{u.min}분</span>}
              </li>
            )
          })}
        </ol>
      </section>

      <section className="course__sec">
        <h3 className="course__h">끝나면 남는 것</h3>
        <ul className="now">
          {c.outcome.map((o, i) => <li className="now__item" key={i}>{o}</li>)}
        </ul>
      </section>

      {c.extra && (
        <section className="course__sec">
          <h3 className="course__h">알아두실 것</h3>
          <ul className="now">
            {c.extra.map((e, i) => <li className="now__item" key={i}>{e}</li>)}
          </ul>
        </section>
      )}
    </div>
  )
}

export default function Courses() {
  const courses = ME.courses || []
  const [params, setParams] = useSearchParams()

  const asked = params.get('c')
  const active = courses.find((c) => c.key === asked) || courses[0]

  // 강의가 비어 있으면 페이지 자체가 성립하지 않는다 → 문의 페이지로 보낸다.
  if (!active) return <Navigate to="/contact" replace />

  // 신청 창구는 /contact 의 강의 오퍼 하나뿐이다 — 카톡 주소를 여기 또 적지 않는다.
  const offer = ME.contact?.offers?.find((o) => o.key === 'coaching')
  const common = ME.courseCommon || {}
  const proof = courseProof()

  // 탭을 누르면 그 자리에서 내용만 바뀐다(주소도 같이 바뀜).
  const pick = (key) => setParams({ c: key })

  const applyBtn = (label) =>
    offer?.href ? (
      <a className="btn btn--primary" href={offer.href} target="_blank" rel="noreferrer">{label} →</a>
    ) : (
      <Link className="btn btn--primary" to="/contact">{label} →</Link>
    )

  return (
    <div className="page">
      <Link to="/contact" className="back">← 문의하기로</Link>

      <header className="dhero">
        <p className="hero__kicker cta__kicker">COURSES · 바이브 코딩 강의</p>
        <h1 className="dhero__name">코딩 배운 적 없이,<br />내 손으로 만듭니다</h1>
        <p className="dhero__desc">
          IT 회사에 22년 있었지만 개발은 한 번도 안 해봤습니다.
          지금은 AI에게 우리 말로 시켜서 혼자 만들고, 인터넷에 올려 운영합니다.
          그 방법을 세 과정으로 나눠 알려드립니다.
        </p>
        <div className="dhero__actions">{applyBtn('카카오톡으로 물어보기')}</div>
      </header>

      {/* ── ① 문제 공감 — 제품 이야기보다 독자의 문제가 먼저다 ── */}
      {common.problems && (
        <section className="dsection">
          <h2 className="section__label">이런 적 있으신가요</h2>
          <div className="probs">
            {common.problems.map((p) => (
              <div className="prob" key={p.title}>
                <span className="prob__emoji" aria-hidden="true">{p.emoji}</span>
                <h3 className="prob__title">{p.title}</h3>
                <p className="prob__body">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="probs__after">
            혼자 되는 사람도 있습니다. 안 되는 이유는 머리가 아니라 <b>막힌 자리를 넘겨 줄 사람</b>이 없어서입니다.
          </p>
        </section>
      )}

      {/* ── ② 세 과정 비교 — "나는 어디쯤인가"부터 고르게 한다 ── */}
      <section className="dsection">
        <h2 className="section__label">어디서부터 막히셨나요</h2>
        <div className="ctable">
          {courses.map((c) => (
            <button
              type="button"
              key={c.key}
              className={c.key === active.key ? 'ccard ccard--on' : 'ccard'}
              onClick={() => pick(c.key)}
            >
              <span className="ccard__emoji" aria-hidden="true">{c.emoji}</span>
              <span className="ccard__tab">{c.tab}</span>
              <span className="ccard__title">{c.title}</span>
              <span className="ccard__price">{c.price}</span>
              <span className="ccard__len">{c.length}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── ③ 과정 상세 ── */}
      <section className="dsection">
        <div className="tabs" role="tablist" aria-label="과정 선택">
          {courses.map((c) => (
            <button
              type="button"
              key={c.key}
              role="tab"
              id={'tab-' + c.key}
              aria-selected={c.key === active.key}
              aria-controls={'panel-' + c.key}
              className={c.key === active.key ? 'tab tab--on' : 'tab'}
              onClick={() => pick(c.key)}
            >
              {c.tab}
            </button>
          ))}
        </div>

        <div
          className="tabpanel"
          role="tabpanel"
          id={'panel-' + active.key}
          aria-labelledby={'tab-' + active.key}
        >
          <h2 className="course__name">
            <span aria-hidden="true">{active.emoji}</span> {active.tab} — {active.title}
          </h2>
          <CourseBody c={active} />
          <div className="course__foot">{applyBtn(`${active.tab} 문의하기`)}</div>
        </div>
      </section>

      {/* ── ④ 가르치는 사람 — 후기가 0개인 지금 유일한 근거다 ── */}
      {proof.length > 0 && (
        <section className="dsection" id="proof">
          <h2 className="section__label">가르치는 사람</h2>
          <p className="proof__lead">
            아래는 전부 제가 직접 만들어 <b>지금 운영하거나 팔고 있는 것</b>들입니다.
            눌러서 직접 열어 보세요.
          </p>
          <div className="proof">
            {proof.map((p) => (
              <Link className="pcard" to={`/p/${p.slug}`} key={p.slug}>
                <span className="pcard__media">
                  <Shot className="pcard__img" src={p.img} alt={`${p.name} 화면`} />
                </span>
                <span className="pcard__body">
                  <span className="pcard__head">
                    <span className="pcard__name">{p.name}</span>
                    {STATUS[p.status] && (
                      <span className={`status status--${p.status}`}>{STATUS[p.status].label}</span>
                    )}
                  </span>
                  <span className="pcard__desc">{p.desc}</span>
                </span>
              </Link>
            ))}
          </div>
          {common.proofNote && <p className="proof__note">{common.proofNote}</p>}
        </section>
      )}

      {/* ── ⑤ 진행 방식 — 결제부터 시키지 않는다 ── */}
      {common.how && (
        <section className="dsection" id="how">
          <h2 className="section__label">신청하면 어떻게 되나요</h2>
          <ol className="steps">
            {common.how.map((h) => (
              <li className="step" key={h.step}>
                <span className="step__n">{h.step}</span>
                <span className="step__body">
                  <span className="step__title">{h.title}</span>
                  <span className="step__desc">{h.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── ⑥ 준비물 · 안 맞는 분 ── */}
      {(common.need || common.notFor) && (
        <section className="dsection">
          <h2 className="section__label">신청 전에 알아두실 것</h2>
          <div className="twocol">
            {common.need && (
              <div className="course__sec course__sec--flush">
                <h3 className="course__h">준비물</h3>
                <ul className="now">
                  {common.need.map((n, i) => <li className="now__item" key={i}>{n}</li>)}
                </ul>
              </div>
            )}
            {common.notFor && (
              <div className="course__sec course__sec--flush">
                <h3 className="course__h">이런 분께는 맞지 않습니다</h3>
                <ul className="now now--x">
                  {common.notFor.map((n, i) => <li className="now__item" key={i}>{n}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── ⑦ FAQ ── */}
      {common.faq && (
        <section className="dsection" id="faq">
          <h2 className="section__label">자주 묻는 질문</h2>
          <div className="faq">
            {common.faq.map((f, i) => (
              /* 첫 문항만 열어 둔다 — 전부 닫혀 있으면 내용이 없는 것처럼 보인다 */
              <details className="faq__item" key={i} open={i === 0}>
                <summary className="faq__q">{f.q}</summary>
                <p className="faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="cta">
        <div className="cta__inner">
          <p className="hero__kicker cta__kicker">어느 과정이 맞을지 모르겠다면</p>
          <h2 className="cta__title">먼저 이야기부터 나눠요</h2>
          <p className="cta__lead">
            지금 하시는 일과 막힌 지점을 들어보고, 셋 중 어느 것이 맞는지 같이 정합니다.
            결제는 그다음입니다. 맞는 게 없으면 없다고 말씀드립니다.
          </p>
          {applyBtn(offer?.cta || '문의하기')}
        </div>
      </section>

      <footer className="foot">
        <Link to="/contact" className="back">← 문의하기로 돌아가기</Link>
        <BizInfo />
      </footer>
    </div>
  )
}
