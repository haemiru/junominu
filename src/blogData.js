// ────────────────────────────────────────────────────────────────
//  블로그 — src/posts/*.md 를 읽어 글 목록을 만든다.
//
//  새 글 쓰는 법: src/posts/ 에 .md 파일 하나 추가하면 끝.
//  파일 맨 위에 frontmatter(--- 사이)를 넣는다:
//
//    ---
//    title: 글 제목
//    date: 2026-06-01
//    summary: 목록에 보일 한 줄 요약
//    tags: [바이브코딩, 회고]
//    slug: my-post        # (선택) 없으면 파일명에서 자동 생성
//    ---
//    여기부터 본문(마크다운)...
// ────────────────────────────────────────────────────────────────
import { marked } from 'marked'

// 빌드 시 posts 폴더의 모든 .md를 원문 문자열로 읽어들인다.
const files = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default', eager: true })

// 아주 단순한 frontmatter 파서 (key: value, [a, b] 배열 지원)
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { meta: {}, body: raw }
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else {
      val = val.replace(/^["']|["']$/g, '')
    }
    meta[key] = val
  }
  return { meta, body: m[2] }
}

function slugFromPath(path) {
  return path
    .split('/')
    .pop()
    .replace(/\.md$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '') // 날짜 접두사 제거
}

export const POSTS = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw)
    const tags = Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : []
    return {
      slug: meta.slug || slugFromPath(path),
      title: meta.title || slugFromPath(path),
      date: meta.date || '',
      summary: meta.summary || '',
      tags,
      html: marked.parse(body),
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1)) // 최신 글 먼저

export function findPost(slug) {
  return POSTS.find((p) => p.slug === slug)
}
