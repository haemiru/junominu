import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './App.css'
import Home from './Home'
import ProjectDetail from './ProjectDetail'
import Blog from './Blog'
import Post from './Post'
import Prompts from './Prompts'
import Contact from './Contact'
import BackToTop from './BackToTop'

// 라우트가 바뀌면(홈↔상세) 맨 위에서 시작 — 단, #앵커 이동은 건드리지 않음
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Post />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <BackToTop />
      {/* 방문/유입 계측 — Vercel Analytics. 라우트 변경(SPA)도 자동 추적.
          dev에서는 스크립트만 로드되고 데이터는 안 쌓임(프로덕션에서만 집계). */}
      <Analytics />
    </BrowserRouter>
  )
}
