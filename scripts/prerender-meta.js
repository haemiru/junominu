// ────────────────────────────────────────────────────────────────
//  라우트별 메타(제목·설명·OG) 프리렌더
//
//  문제: 이 사이트는 SPA라 모든 경로가 같은 index.html 을 받는다.
//        스레드·카카오톡·구글 크롤러는 JS를 실행하지 않으므로,
//        /p/bokjimoa 를 공유해도 미리보기 카드가 "사이트 공통 OG"로 뜬다.
//
//  해결: 빌드 후 라우트마다 dist/<경로>/index.html 을 만들고 메타만 갈아끼운다.
//        Vercel 은 rewrites 보다 **실제 파일**을 먼저 서빙하므로 vercel.json 은
//        그대로 둬도 된다(파일 없는 경로만 SPA fallback 으로 넘어감).
//
//  실행: npm run build (vite build 다음에 자동 실행)
//  데이터 원천: src/projects.js, src/posts/*.md — 새 프로젝트·글을 넣으면 자동 반영.
// ────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const SITE = 'https://www.junominu.com'
const BRAND = 'JunoMinu'
const OG_FALLBACK = `${SITE}/og.png`

const { ME, PROJECTS } = await import(pathToFileURL(join(ROOT, 'src/projects.js')).href)

/* ── src/posts/*.md 읽기 (blogData.js 의 파서와 동일 규칙) ───────────── */

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

function loadPosts() {
  const dir = join(ROOT, 'src/posts')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { meta, body } = parseFrontmatter(readFileSync(join(dir, f), 'utf8'))
      const auto = f.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
      return {
        slug: meta.slug || auto,
        title: meta.title || auto,
        summary: meta.summary || '',
        date: meta.date || '',
        updated: meta.updated || '',          // (선택) 수정일 → dateModified
        cover: meta.cover || '',              // (선택) 공유 카드 이미지. 없으면 본문 첫 이미지
        tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
        body,
      }
    })
}

/* ── 블로그 글 구조화 데이터(JSON-LD) ─────────────────────────────────
   SPA 라 크롤러는 여기서 만든 정적 HTML만 본다. 본문(.md)에 <script>를 적어도
   렌더 시점에 실행/노출되지 않으므로, 구조화 데이터는 **여기서** 심는다.
   FAQPage 는 본문의 "### Q. 질문 / 답변 문단" 형식을 그대로 읽어 만든다. ── */

const AUTHOR = {
  '@type': 'Person',
  name: BRAND,
  description: '비개발자 출신 1인 메이커. AI 바이브 코딩으로 혼자 기획·개발·운영합니다.',
  url: SITE,
}

/** 본문의 첫 이미지(마크다운 또는 <img>) — 공유 카드 이미지 후보. */
function firstImage(body) {
  const md = body.match(/!\[[^\]]*\]\(\s*([^)\s]+)/)
  if (md) return md[1]
  const html = body.match(/<img[^>]+src="([^"]+)"/)
  return html ? html[1] : ''
}

/** 마크다운 장식을 걷어낸 순수 텍스트(JSON-LD 값용). */
function stripMd(s) {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 본문에서 FAQ를 뽑는다.
 *   ### Q. 질문?   (### Q1. / #### Q2) 도 인식)
 *   바로 아래 문단이 답변. 다음 제목을 만나면 그 문답은 끝난 것으로 본다.
 */
function parseFaq(body) {
  const faq = []
  let q = null
  let buf = []
  const flush = () => {
    const a = stripMd(buf.join(' '))
    if (q && a) faq.push({ q, a })
    q = null
    buf = []
  }
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^#{3,4}\s+Q\d*\s*[.)]?\s*(.+)$/)
    if (m) {
      flush()
      q = stripMd(m[1])
      continue
    }
    if (/^#{1,6}\s/.test(line)) {
      flush()
      continue
    }
    if (q) buf.push(line)
  }
  flush()
  return faq
}

function postJsonLd(p, url, image) {
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.summary || p.title,
    image,
    author: AUTHOR,
    publisher: { '@type': 'Organization', name: BRAND, url: SITE },
    datePublished: p.date,
    dateModified: p.updated || p.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'ko-KR',
  }
  if (p.tags.length) article.keywords = p.tags.join(', ')

  const blocks = [article]
  const faq = parseFaq(p.body)
  if (faq.length >= 2) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return blocks
}

/* ── 라우트 목록 ─────────────────────────────────────────────────── */

/** 프로젝트 상세는 detail 이 있는 것만 내부 페이지를 갖는다(App 라우팅과 동일). */
function projectRoutes() {
  return PROJECTS.filter((p) => p.slug && p.detail).map((p) => {
    const shot = p.detail.cover || p.detail.thumb // 실제 제품 화면이 있으면 그걸 카드 이미지로
    return {
      path: `/p/${p.slug}`,
      title: `${p.name} — 메이킹 스토리 · ${BRAND}`,
      description: p.description || `${p.name} 을(를) 바이브 코딩으로 만든 과정.`,
      image: shot ? `${SITE}${shot}` : OG_FALLBACK,
      imageIsShot: Boolean(shot),
      imageAlt: `${p.name} 화면`,
    }
  })
}

function postRoutes(posts) {
  return posts.map((p) => {
    const url = `${SITE}/blog/${p.slug}`
    const shot = p.cover || firstImage(p.body) // 글 안의 실제 앱 캡처를 공유 카드로
    const image = shot ? `${SITE}${shot}` : OG_FALLBACK
    return {
      path: `/blog/${p.slug}`,
      title: `${p.title} · ${BRAND} 블로그`,
      description: p.summary || p.title,
      image,
      imageIsShot: Boolean(shot),
      imageAlt: p.title,
      type: 'article',
      jsonld: postJsonLd(p, url, image),
    }
  })
}

const posts = loadPosts()

const ROUTES = [
  {
    path: '/blog',
    title: `블로그 · ${BRAND}`,
    description: '바이브 코딩으로 만들면서 배운 것들 — 삽질과 우회, 실제로 쓴 방법을 기록합니다.',
    image: OG_FALLBACK,
    imageAlt: `${BRAND} 블로그`,
  },
  {
    path: '/prompts',
    title: `프롬프트 노트 · ${BRAND}`,
    description: '프로젝트를 만들 때 실제로 쓴 프롬프트를 모았습니다. AI 코딩에 그대로 가져다 쓰세요.',
    image: OG_FALLBACK,
    imageAlt: '프롬프트 노트',
  },
  {
    path: '/contact',
    title: `1:1 코칭 · 외주 문의 · ${BRAND}`,
    description:
      ME.contact?.lead?.replace(/\n/g, ' ') ||
      '바이브 코딩 1:1 코칭과 외주 제작을 문의하세요.',
    image: OG_FALLBACK,
    imageAlt: '1:1 코칭 · 외주 문의',
  },
  ...projectRoutes(),
  ...postRoutes(posts),
]

/* ── 메타 치환 ───────────────────────────────────────────────────── */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** 템플릿의 특정 메타 태그 content 만 바꾼다. 없으면 그대로 둔다. */
function setMeta(html, attr, name, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`)
  return html.replace(re, `$1${esc(value)}$2`)
}

function render(template, r) {
  let html = template

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`)
  html = setMeta(html, 'name', 'description', r.description)
  html = setMeta(html, 'property', 'og:title', r.title)
  html = setMeta(html, 'property', 'og:description', r.description)
  html = setMeta(html, 'property', 'og:url', SITE + r.path)
  html = setMeta(html, 'property', 'og:image', r.image)
  html = setMeta(html, 'property', 'og:image:alt', r.imageAlt)
  html = setMeta(html, 'name', 'twitter:title', r.title)
  html = setMeta(html, 'name', 'twitter:description', r.description)
  html = setMeta(html, 'name', 'twitter:image', r.image)
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${SITE + r.path}$2`,
  )

  // 글 상세는 article 로 표시(og:type 은 사이트 기본이 website)
  if (r.type === 'article') {
    html = html.replace(/(<meta property="og:type" content=")[^"]*(")/, `$1article$2`)
  }

  // og.png 는 1200×630 이지만 스크린샷은 크기가 제각각이라
  // 잘못된 width/height 를 남기면 카드가 이상하게 잘린다 → 해당 태그 제거.
  if (r.imageIsShot) {
    html = html.replace(/\s*<meta property="og:image:(width|height)" content="[^"]*" \/>/g, '')
  }

  // 구조화 데이터(JSON-LD) — </head> 직전에 심는다.
  // "</" 를 이스케이프해야 본문에 </script> 가 섞여도 태그가 깨지지 않는다.
  if (r.jsonld?.length) {
    const tags = r.jsonld
      .map(
        (o) =>
          `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`,
      )
      .join('\n    ')
    html = html.replace('</head>', `  ${tags}\n  </head>`)
  }

  return html
}

/* ── 실행 ────────────────────────────────────────────────────────── */

const templatePath = join(DIST, 'index.html')
if (!existsSync(templatePath)) {
  console.error('✗ dist/index.html 이 없습니다. vite build 를 먼저 실행하세요.')
  process.exit(1)
}
const template = readFileSync(templatePath, 'utf8')

for (const r of ROUTES) {
  const outDir = join(DIST, r.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), render(template, r), 'utf8')
}

console.log(
  `✓ 메타 프리렌더 ${ROUTES.length}개 — 프로젝트 ${projectRoutes().length} · 글 ${posts.length} · 고정 3`,
)
