// ────────────────────────────────────────────────────────────────
//  글 하단 문의 블록 — 블로그 글(/blog/:slug) 맨 아래.
//
//  왜 댓글이 아니라 이것인가:
//    이 사이트는 백엔드가 없는 정적 사이트다(CLAUDE.md). 댓글을 받으려면
//    저장할 곳이 필요한데 그게 없다. 그래서 "글에 대한 질문"은 카톡 오픈채팅과
//    이메일로 받는다. 댓글 기능은 저장소가 생기면 그때 다시 본다.
//
//  데이터 원천은 ME.contact 하나다 — 주소를 고칠 땐 src/projects.js 만 고친다.
//  contact.kakao 가 비어 있으면 카톡 버튼은 그리지 않는다(죽은 링크 방지).
// ────────────────────────────────────────────────────────────────
import { ME } from './projects'

// PC에 기본 메일 앱이 없으면 mailto 는 먹통이다 → Gmail 웹 작성창으로 연다.
// (ME.links · Contact.jsx 와 같은 패턴)
function gmailCompose(email, subject) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`
}

export default function AskBox({ subject }) {
  const c = ME.contact
  if (!c?.email) return null

  // 어느 글을 읽고 물어보는지 제목에 남겨 둔다 — 답할 때 맥락을 다시 안 물어봐도 된다.
  const mail = gmailCompose(c.email, subject ? `[블로그] ${subject}` : '[블로그] 문의')

  return (
    <aside className="askbox">
      <h2 className="askbox__title">읽다가 막힌 데가 있으셨나요?</h2>
      <p className="askbox__desc">
        글에 안 적힌 부분이나, 직접 해보다 걸린 자리를 알려주시면 답해 드립니다.
        편한 쪽으로 하나만 고르세요.
      </p>

      <div className="askbox__actions">
        {c.kakao && (
          <a className="btn btn--primary" href={c.kakao} target="_blank" rel="noreferrer">
            카카오톡으로 물어보기 →
          </a>
        )}
        <a className="btn btn--ghost" href={mail} target="_blank" rel="noreferrer">
          이메일 보내기 →
        </a>
      </div>

      <p className="askbox__note">
        {c.kakao && <>카카오톡 오픈채팅은 친구 추가 없이 열립니다 · </>}
        {c.email}
      </p>
    </aside>
  )
}
