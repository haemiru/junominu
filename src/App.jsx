import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Home from './Home'
import ProjectDetail from './ProjectDetail'
import Blog from './Blog'
import Post from './Post'
import Prompts from './Prompts'
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
        <Route path="*" element={<Home />} />
      </Routes>
      <BackToTop />
    </BrowserRouter>
  )
}
