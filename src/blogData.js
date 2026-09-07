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
// ⚠️ projects.js 는 blogData 를 import 하지 않는다 — 순환 참조가 아니다.
import { PROJECTS } from './projects'

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

/** 읽는 시간(분) — 한글 기준 분당 600자. 목록 카드에 "N분 읽기"로 표시. */
function readMinutes(body) {
  const plain = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[!-~]/g, '')
    .replace(/\s+/g, '')
  return Math.max(1, Math.round(plain.length / 600))
}

function slugFromPath(path) {
  return path
    .split('/')
    .pop()
    .replace(/\.md$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '') // 날짜 접두사 제거
}

/**
 * 글 ↔ 프로젝트 연결.
 *
 * 🔴 우선순위: frontmatter 의 `project:` → 없으면 **글 slug 의 접두사**.
 *    `/blog-post` 스킬이 `post-slug` 에 프로젝트 slug 를 접두사로 붙이게 해 뒀으므로
 *    (`jungaepro-void-terms`) 기존 글은 손대지 않아도 대부분 자동으로 붙는다.
 *
 * ⚠️ 접두사 규칙을 안 따르는 글은 `project:` 를 직접 적어야 한다.
 *    지금 그런 글: 사이트 자체 이야기 3편(built-this-site·data-first·windows-case-collision)과
 *    크몽 서비스 글(ax-onsite-diagnosis·work-automation-build·brandconnect-helper).
 *    프로젝트가 없는 글은 `projectSlug: ''` 로 남고, 목록에서 「그 밖의 기록」으로 묶인다.
 */
const PROJECT_SLUGS = PROJECTS.map((p) => p.slug).filter(Boolean)

function projectSlugFor(meta, postSlug) {
  if (meta.project) return meta.project
  // 긴 slug 부터 본다 — 짧은 것이 다른 프로젝트의 접두사인 경우를 피하려고
  return (
    [...PROJECT_SLUGS]
      .sort((a, b) => b.length - a.length)
      .find((s) => postSlug === s || postSlug.startsWith(`${s}-`)) || ''
  )
}

export const POSTS = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw)
    const tags = Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : []
    const slug = meta.slug || slugFromPath(path)
    return {
      slug,
      title: meta.title || slugFromPath(path),
      date: meta.date || '',
      summary: meta.summary || '',
      tags,
      cover: meta.cover || '',          // 목록 카드 썸네일(없으면 색조 플레이스홀더)
      projectSlug: projectSlugFor(meta, slug),
      readMin: readMinutes(body),
      html: marked.parse(body),
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1)) // 최신 글 먼저

export function findPost(slug) {
  return POSTS.find((p) => p.slug === slug)
}

/** 한 프로젝트로 쓴 글 — 프로젝트 상세 하단에서 쓴다. */
export function postsOfProject(projectSlug) {
  if (!projectSlug) return []
  return POSTS.filter((p) => p.projectSlug === projectSlug)
}

/**
 * 프로젝트별로 묶은 목록 — `/blog` 에서 쓴다.
 * 순서는 `PROJECTS` 배열 순서를 따르고, 어디에도 안 붙는 글은 맨 뒤 「그 밖의 기록」으로.
 */
export function postsByProject() {
  const groups = PROJECTS
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug, name: p.name, emoji: p.emoji, posts: postsOfProject(p.slug) }))
    .filter((g) => g.posts.length > 0)

  // `project:` 에 프로젝트 slug 가 아닌 **자유 라벨**을 적은 글들 — 그 라벨로 묶는다.
  //   상세 페이지가 없는 것(크몽 서비스처럼)이나 프로젝트가 아닌 것(이 사이트)을 담는 자리다.
  const labels = [...new Set(
    POSTS.map((p) => p.projectSlug).filter((s) => s && !PROJECT_SLUGS.includes(s)),
  )]
  labels.forEach((label) => {
    groups.push({
      slug: '',
      name: label,
      emoji: '🧰',
      posts: POSTS.filter((p) => p.projectSlug === label),
    })
  })

  const rest = POSTS.filter((p) => !p.projectSlug)
  if (rest.length) groups.push({ slug: '', name: '그 밖의 기록', emoji: '📝', posts: rest })
  return groups
}
