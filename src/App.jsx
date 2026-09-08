import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './App.css'
import Home from './Home'
import TopBar from './TopBar'
import BackToTop from './BackToTop'

// ────────────────────────────────────────────────────────────────
//  코드 스플리팅 — 홈만 처음에 받고, 나머지 라우트는 "그 주소로 갈 때" 받는다.
//
//  핵심 목적: 마크다운 파서 `marked`(+ 글 원문)가 blogData.js → Blog/Post 로만
//  쓰이는데 전 페이지 번들에 들어 있었다. 아래처럼 나누면 블로그에 실제로
//  들어가는 사람만 그 조각을 내려받는다.
//
//  홈(Home)은 가장 흔한 진입점이라 일부러 즉시 로드로 남겨 둔다 —
//  lazy로 만들면 첫 화면에 네트워크 왕복이 한 번 더 생긴다.
// ────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────
//  내 방문을 계측에서 뺀다 (2026-09-08)
//
//  🔴 Vercel Web Analytics 는 **본인 트래픽을 자동으로 제외하지 않는다.**
//     IP 차단 기능도 없다. 그래서 배포 확인하러 들어간 것이 그대로 Visitors 에 쌓인다.
//     실제로 2026-09-08 기준 7일 방문자 23명 중 referrer 가 붙은 건 5명뿐이었다.
//
//  켜는 법:  junominu.com/?va-off=1  을 한 번 연다
//  푸는 법:  junominu.com/?va-on=1
//
//  ⚠️ 표시는 **브라우저·기기마다 따로** 남는다(localStorage). PC·휴대폰 각각 한 번씩
//     해야 하고, 사이트 데이터를 지우면 표시도 함께 사라진다.
//  ⚠️ 사파리 프라이빗 등에서 localStorage 접근 자체가 막힐 수 있어 try 로 감쌌다 —
//     실패하면 그냥 평소대로 계측한다(계측이 죽는 것보다 낫다).
// ────────────────────────────────────────────────────────────────
const VA_FLAG = 'va-disable'

try {
  const q = new URLSearchParams(window.location.search)
  if (q.has('va-off')) localStorage.setItem(VA_FLAG, '1')
  if (q.has('va-on')) localStorage.removeItem(VA_FLAG)
} catch { /* 접근 불가 — 무시하고 평소대로 */ }

function skipMyVisits(event) {
  try {
    if (localStorage.getItem(VA_FLAG)) return null   // null 이면 전송하지 않는다
  } catch { /* 접근 불가 — 그냥 보낸다 */ }
  return event
}

const ProjectDetail = lazy(() => import('./ProjectDetail'))
const Blog = lazy(() => import('./Blog'))
const Post = lazy(() => import('./Post'))
const Prompts = lazy(() => import('./Prompts'))
const Contact = lazy(() => import('./Contact'))
const Courses = lazy(() => import('./Courses'))

// 라우트가 바뀌면(홈↔상세) 맨 위에서 시작. #앵커가 붙어 있으면 그 자리로 간다.
//
// 🔴 SPA 라 브라우저가 해시 스크롤을 대신 해 주지 않는다 — 주소가 바뀌는 시점에
//    대상 요소가 아직 안 그려져 있기 때문이다(라우트가 lazy 면 더 늦다).
//    그래서 없으면 몇 프레임 더 기다렸다가 찾는다. 이게 없으면
//    다른 페이지에서 온 `/#work`·`/courses#faq` 같은 링크가 조용히 맨 위에 떨어진다.
// 약 3초. 라우트가 lazy 라 조각을 받아오는 데 0.5초로는 모자랐다(2026-09-08 실측 —
// /courses#faq 가 조용히 맨 위에 떨어졌다). 찾는 즉시 멈추므로 넉넉해도 손해가 없다.
const HASH_TRIES = 180

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const id = decodeURIComponent(hash.slice(1))
    let raf = 0
    let timer = 0
    let left = HASH_TRIES
    const seek = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView()
        // ⚠️ 한 번으로는 부족하다 — 그 아래 이미지가 늦게 도착하면 자리가 밀린다.
        //    비율을 미리 잡아 두긴 했지만(폰트 로딩 등 남은 변수가 있다) 한 번 더 맞춘다.
        timer = setTimeout(() => document.getElementById(id)?.scrollIntoView(), 300)
        return
      }
      if (left-- > 0) raf = requestAnimationFrame(seek)
    }
    seek()
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [pathname, hash])
  return null
}

// lazy 라우트를 받아오는 동안 잠깐 보이는 자리 — 높이를 잡아 화면이 튀지 않게 한다.
function RouteFallback() {
  return <div className="page route-loading" role="status" aria-label="불러오는 중" />
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* 상단 바는 라우트 밖에 있다 — 어느 페이지에서도 같은 자리에 그대로 있고,
          로고를 누르면 홈으로 간다(2026-09-08). */}
      <TopBar />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/p/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/prompts" element={<Prompts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <BackToTop />
      {/* 방문/유입 계측 — Vercel Analytics. 라우트 변경(SPA)도 자동 추적.
          dev에서는 스크립트만 로드되고 데이터는 안 쌓임(프로덕션에서만 집계).
          beforeSend 로 내 방문을 뺀다 — 위 skipMyVisits 주석 참고. */}
      <Analytics beforeSend={skipMyVisits} />
    </BrowserRouter>
  )
}
