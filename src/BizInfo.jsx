import { ME } from './projects'

/**
 * 사업자 정보 — 모든 페이지 풋터 아래에 붙는다.
 *
 * 🔴 풋터 마크업이 6개 파일(Home·Contact·Blog·Post·Prompts·ProjectDetail)에 각각
 *    복제돼 있어서, 사업자 정보까지 6벌로 두면 한 곳만 고치는 사고가 난다.
 *    그래서 이 컴포넌트 하나만 각 풋터에 끼운다. **값은 `ME.biz` 한 곳에만 있다.**
 *
 * ⚠️ 표기를 바꿀 땐 `src/projects.js` 의 `ME.biz` 를 고친다. 여기는 배치만 한다.
 */
export default function BizInfo() {
  const b = ME.biz
  if (!b) return null

  return (
    <div className="bizinfo">
      <p className="bizinfo__line">
        <span>{b.company}</span>
        <span className="bizinfo__sep">·</span>
        <span>대표 {b.ceo}</span>
        <span className="bizinfo__sep">·</span>
        <span>사업자등록번호 {b.bizNo}</span>
        {b.bizCheckUrl && (
          <a
            className="bizinfo__check"
            href={b.bizCheckUrl}
            target="_blank"
            rel="noreferrer"
          >
            사업자 확인
          </a>
        )}
      </p>
      <p className="bizinfo__line">
        <span>통신판매업 신고번호 {b.mailOrderNo}</span>
      </p>
      <p className="bizinfo__line">
        <span>{b.address}</span>
      </p>
      <p className="bizinfo__line">
        <a href={`mailto:${b.email}`} className="bizinfo__link">{b.email}</a>
        <span className="bizinfo__sep">·</span>
        <a href={`tel:${b.tel.replace(/-/g, '')}`} className="bizinfo__link">{b.tel}</a>
      </p>
    </div>
  )
}
