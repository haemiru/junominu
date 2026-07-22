import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './App.css'
import Home from './Home'
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
const ProjectDetail = lazy(() => import('./ProjectDetail'))
const Blog = lazy(() => import('./Blog'))
const Post = lazy(() => import('./Post'))
const Prompts = lazy(() => import('./Prompts'))
const Contact = lazy(() => import('./Contact'))

// 라우트가 바뀌면(홈↔상세) 맨 위에서 시작 — 단, #앵커 이동은 건드리지 않음
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'instant' })
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
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/p/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/prompts" element={<Prompts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <BackToTop />
      {/* 방문/유입 계측 — Vercel Analytics. 라우트 변경(SPA)도 자동 추적.
          dev에서는 스크립트만 로드되고 데이터는 안 쌓임(프로덕션에서만 집계). */}
      <Analytics />
    </BrowserRouter>
  )
}
