import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ME } from './projects'
import BizInfo from './BizInfo'

// ────────────────────────────────────────────────────────────────
//  /courses — 강의 세 과정 소개 (기초 · 원데이 · 정규)
//
//  들어오는 문: /contact 의 「바이브 코딩 강의」 카드 안 "어떤걸 배우나요? →".
//  카드에는 과정마다 한 줄씩만 적혀 있어 "무엇을 배우는지"가 안 보였다 — 그 답이 여기다.
//
//  데이터는 전부 `projects.js` 의 `ME.courses` · `ME.courseCommon` 이고,
//  그 원천은 `D:/Claude-prj/lecture` 레포의 chapters/*.html 이다(projects.js 주석 참고).
//  🔴 커리큘럼을 여기서 손으로 고치지 말 것 — 저 레포와 어긋나면 파는 것과 다른 말을 하게 된다.
//
//  탭은 주소에 남긴다(`?c=basic|oneday|regular`) — 카톡으로 "원데이는 이거예요" 하고
//  링크를 보낼 수 있어야 하기 때문이다. 값이 이상하면 첫 과정으로 떨어진다.
// ────────────────────────────────────────────────────────────────

function totalMin(curriculum) {
  return curriculum.reduce((sum, c) => sum + (c.min || 0), 0)
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

      <section className="course__sec">
        <h3 className="course__h">이런 분께 맞습니다</h3>
        <ul className="now">
          {c.who.map((w, i) => <li className="now__item" key={i}>{w}</li>)}
        </ul>
      </section>

      {c.tracks && (
        <section className="course__sec">
          <h3 className="course__h">셋 중 하나를 골라 만듭니다</h3>
          <div className="tracks">
            {c.tracks.map((t) => (
              <div className="track" key={t.name}>
                <span className="track__name">{t.name}</span>
                <span className="track__desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </section>
      )}

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
  const common = ME.courseCommon

  return (
    <div className="page">
      <Link to="/contact" className="back">← 문의하기로</Link>

      <header className="dhero">
        <p className="hero__kicker cta__kicker">COURSES · 바이브 코딩 강의</p>
        <h1 className="dhero__name">어떤 걸 배우나요?</h1>
        <p className="dhero__desc">
          코딩을 한 번도 안 해본 분들을 위한 세 과정입니다.
          어디서부터 막히셨는지에 따라 시작점이 다릅니다.
        </p>
      </header>

      {/* 세 과정 한눈에 — 탭을 열기 전에 "나는 어디쯤인가"부터 고르게 한다. */}
      <section className="dsection">
        <h2 className="section__label">세 과정 한눈에</h2>
        <div className="ctable">
          {courses.map((c) => (
            <button
              type="button"
              key={c.key}
              className={c.key === active.key ? 'ccard ccard--on' : 'ccard'}
              onClick={() => setParams({ c: c.key })}
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
              onClick={() => setParams({ c: c.key })}
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
        </div>
      </section>

      {common && (
        <section className="dsection">
          <h2 className="section__label">세 과정 공통</h2>
          <div className="course__sec">
            <h3 className="course__h">준비물</h3>
            <ul className="now">
              {common.need.map((n, i) => <li className="now__item" key={i}>{n}</li>)}
            </ul>
          </div>
          <div className="course__sec">
            <h3 className="course__h">이런 분께는 맞지 않습니다</h3>
            <ul className="now">
              {common.notFor.map((n, i) => <li className="now__item" key={i}>{n}</li>)}
            </ul>
          </div>
        </section>
      )}

      <section className="cta">
        <div className="cta__inner">
          <p className="hero__kicker cta__kicker">어느 과정이 맞을지 모르겠다면</p>
          <h2 className="cta__title">먼저 이야기부터 나눠요</h2>
          <p className="cta__lead">
            지금 하시는 일과 막힌 지점을 들어보고, 셋 중 어느 것이 맞는지 같이 정합니다.
            맞는 게 없으면 없다고 말씀드립니다.
          </p>
          {offer?.href ? (
            <a className="btn btn--primary" href={offer.href} target="_blank" rel="noreferrer">
              {offer.cta} →
            </a>
          ) : (
            <Link className="btn btn--primary" to="/contact">문의하기 →</Link>
          )}
        </div>
      </section>

      <footer className="foot">
        <Link to="/contact" className="back">← 문의하기로 돌아가기</Link>
        <BizInfo />
      </footer>
    </div>
  )
}
