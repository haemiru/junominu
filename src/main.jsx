import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { captureAttribution } from './attribution'

// 유입 경로(utm/referrer)를 첫 진입 때 붙잡아 둔다 — 라우트 이동으로 쿼리가
// 사라지기 전에 실행돼야 하므로 렌더보다 먼저.
captureAttribution()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
