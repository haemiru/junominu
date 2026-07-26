# 발달장애 육아 답글 — 근거 있는 답 쓰기 (짱샘의 책방 전자책 기반)

발달장애 육아 니치 답글이 **"저는 답을 드릴 만한 사람은 못 되고…"** 로 끝나면 상대에게도 도움이 안 되고 관계도 안 생긴다.
질문을 던진 글에는 **근거가 닿는 답**을 준다. 근거 원천은 **짱샘의 책방 전자책 52권**(하성재님 본인 프로젝트).

> 원본 참고: 짱샘의 책방 레포의 `/threads-reply` 커맨드
> (`D:\Claude-prj\ebook\jjangsaem-bookshop\.claude\commands\threads-reply.md`).
> ⚠️ **경로는 `D:\Claude-prj\...`가 진짜다.** `C:\Users\bsuha\Claude-prj\...`도 열리지만 D:로 연결된 같은 폴더다.
> 그건 **치료사 계정용**이라 그대로 못 쓴다 — 아래 §1 정체성 경계가 이 문서의 존재 이유다.

---

## 1. 정체성 경계 (이걸 어기면 경력 사칭이다)

| | 짱샘 = 키즈피지오 장지예 | 하성재 = @solopreneur.jm |
|---|---|---|
| 직업 | **소아물리치료사** (25년 임상) | IT 22년 → 1인 메이커 |
| 전자책 | **집필자** | **책방을 만든 사람** + 논문 리서치·목차 구성·내용 검증 |
| 쓸 수 있는 말 | "치료실에 왔던 아이 중에…" | "원고 보다가…" |

**❌ 절대 금지 (하성재 계정에서)**
- 임상 경험 서술 — "치료실에 왔던 아이가", "제가 본 아이는", "8살 여자아이가 처음 왔을 때"
- 치료사·전문가를 자처하는 모든 표현
- 진단·처방 — "그건 ○○예요", "○○ 검사 받아보세요"

**⭕ 정직한 귀속 (이것만 쓴다)**
- "제가 발달 쪽 전자책 만드는 걸 돕고 있어서 원고를 좀 보는데,"
- "책 작업하면서 자료 찾다가 본 건데,"
- 근거: `src/projects.js`의 짱샘의 책방 항목 — *"정확한 근거에 의한 전자책 집필이 되도록 논문을 리서치해 자료로 사용하고… 목차 구성과 실제 내용에 대한 검증 및 검토."* **사실이므로 써도 된다.**
- 단정하지 말고 한 발 뒤에 선다 — "물론 아이마다 다를 테고, 어머니가 제일 잘 아실 거예요."

---

## 2. 언제 쓰나 (남용하면 소프트 홍보가 된다)

- ✅ **진짜 질문이 있는 글에만.** "어떻게 해야 할까요", "방법 있을까요", "다들 어떻게 하세요" 같은 물음이 실제로 있을 때.
- ❌ **감정·사연·일상 공유 글엔 쓰지 않는다.** 그림 올린 글, 아이 근황, 마음이 바뀐 이야기 — 여긴 SKILL §1-4대로 **순수 공감**이다. 묻지 않은 사람에게 지식을 얹으면 훈수다.
- ❌ **유산·상실·심각한 우울 글은 여전히 접근 금지.**
- ⚠️ **배치당 최대 1건.** 같은 니치 답글 여러 개에 반복해서 "제가 전자책 만드는데…"가 붙으면 광고 패턴으로 읽힌다.

---

## 3. 근거 찾는 법

> 🚨 **`src/data/ebooks.ts`는 30권짜리 낡은 스냅샷이다.** 진짜 원천은 **Supabase `ebooks` 테이블(59행)** — 그중 체크리스트 이용권 7개와 영문판 2권을 빼면 **한국어 전자책 52권**. `ebooks.ts`만 보면 `meltdown-manual`·`sleep-recovery-6week`·`hsp-overloaded-brain` 같은 핵심 책 20권 넘게 놓친다. (`scripts/books-summary.json`도 34권짜리 옛 스냅샷)

**한 권 조회** — 스크립트가 `ebooks.ts`에 없으면 자동으로 Supabase로 넘어간다:
```bash
cd "D:/Claude-prj/ebook/jjangsaem-bookshop"
node scripts/lookup-ebook.mjs --slug meltdown-manual --json   # toc 포함
node scripts/lookup-ebook.mjs --title "멜트다운"
```

**전체 목록 / 목차 뽑기** — 아래를 `scripts/_tmp.mjs`로 저장해 실행하고 **바로 지운다**(그 레포에 파일을 남기지 말 것). `node_modules` 때문에 반드시 그 레포 안에서 실행:
```js
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
if(existsSync(".env.local")){for(const l of readFileSync(".env.local","utf8").split(/\r?\n/)){const m=l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);if(!m)continue;let[,k,v]=m;if(v.startsWith('"')&&v.endsWith('"'))v=v.slice(1,-1);if(!process.env[k])process.env[k]=v;}}
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
const {data}=await sb.from("ebooks").select("slug,title,category,toc").order("category");
console.log(data.map(b=>`${b.category}\t${b.slug}\t${b.title}`).join("\n"));
```

**목차(toc)의 챕터 제목이 곧 답의 뼈대다.** 예: `nervous-system-parenting` **Ch9. 윈드다운 실패: 내려오지 못하는 아이** / `sleep-recovery-6week` **7장. ASD — 멜라토닌이 늦게 켜지는 뇌**.

### 주제 → 책 매핑 (Supabase 실측, 2026-07-26)

| 주제 | slug |
|---|---|
| 멜트다운·폭발·떼쓰기 구분 | `meltdown-manual` |
| 수면·새벽 기상·야경증·잠들기 2시간 | `sleep-recovery-6week`, `sensory-sleep` |
| 못 멈춤·못 내려옴·자율신경·미주신경 | `nervous-system-parenting` (·`-2` ·`-3`), `vagus-nose-power`, `footsole-rebalancing` |
| 감각 과민·예민함 | `sensory-hypersensitivity`, `hsp-overloaded-brain`, `signal-blindness` |
| 불안·분리불안·쉬지 못하는 뇌 | `separation-anxiety`, `olfactory-safety` |
| 발달 감별(자폐·영재·ADHD)·눈맞춤·호명반응 | `is-my-child-okay` |
| 시선·양안시·눈 | `binocular-vision-brain`, `brain-eye-stability` |
| 후각 | `smell-is-brain`, `olfactory-training`, `olfactory-development`, `olfactory-kit`, `nose-nervous-system`, `reading-brain-through-smell`, `brain-changes-from-nose`, `nose-brain-decoder` |
| 호흡·구강호흡·비염 | `breath-first`, `golden-time-breathing`, `neurogenic-rhinitis`, `nose-brain-fitness`, `nose-breathing`, `kosum-massage`, `breathe-right-for-you` |
| 원시반사 | `primitive-reflex`, `primitive-reflex-play`, `primitive-reflex-checklist` |
| 터미타임 | `tummy-time-protocol` ·`-essence` ·`-casebook` ·`-crying` ·`-everything` ·`-breathing`, `neurodevelopmental-tummy-time` |
| 사경·사두증 | `beyond-the-tilt`, `plagiocephaly-guide`, `parent-play-guide` |
| 언어·몸 못 쓰는 아이·코어 | `language-starts-from-body`, `why-kids-cant-use-body`, `core-is-not-strength` |
| 치료보다 회복 | `recovery-before-treatment` |
| 부모 소진·마음 | `healing-parent` |

---

## 4. 답글에 담는 방식

**공식**: `원글 인용 한 조각` + `정직한 귀속 한 마디` + `근거에서 온 관점/방법 1개` + `한 발 물러서기`

- **관점 재구성이 방법 나열보다 세다.** "못 멈추는 게 아니라 못 내려오는 것"처럼 프레임을 바꿔주는 한 문장이 실행법 3개보다 오래 남는다.
- **방법은 최대 1~2개.** 목록으로 늘어놓지 않는다.
- **길이 150~220자.** 답글에서 강의하지 않는다.

## 5. 금지 (짱샘 스킬에서 그대로 승계)

- **의료 진단·처방 금지** — "~일 수도 있대요" 정도의 가능성까지만
- **단정형 인과 금지** — "이 반사 때문에 ~된다" ❌
- **다른 전문가 비하 금지** — 치료사·의사 의견을 부정하지 않는다
- **책 제목·URL·구매 유도 금지** — 책방 이름도 말하지 않는다. "전자책 만드는 걸 돕는다"까지가 끝
- **약물·수술·식이는 "해당 전문가와 상담" 안내만**
- **가운뎃점(`·`) 금지** — 핸드폰으로 직접 안 치는 문자라 티가 난다. 쉼표를 쓴다 (이 문서 같은 내부 문서엔 써도 됨)
- `ai-tell-checklist.md`는 여기서도 그대로 적용된다

---

## 6. ⛔ 이 코퍼스가 **안 통하는** 니치 (2026-07-27)

**짱샘의 책방 전자책 52권은 전부 소아 발달이다.** 터미타임, 원시반사, 사경·사두, 후각·호흡, 감각 과민, 자율신경, 소아 수면 — 대상이 **영유아~청소년**이다.

- ⛔ **시니어·치매 예방(기억정원) 니치에 이 책들을 근거로 쓰지 말 것.** "원고에서 봤는데" 하고 소아 발달 내용을 치매·인지 훈련에 갖다 붙이면 **틀린 근거**다. 정직한 귀속(§1)을 지켜도 내용이 틀리면 소용없다.
- ⛔ **공인중개사·메이커 니치도 마찬가지** — 애초에 접점이 없다.
- ⭕ 시니어 니치에서 쓸 수 있는 건 **기억정원을 만들며 직접 겪은 것**뿐이다(`src/projects.js`의 기억정원 `detail`). 예: "큰 글씨 큰 버튼으로 다시 짜는 것부터가 어렵더라고요", "어르신이 혼자 켜지는 게 제일 어려웠어요". **이건 사실이라 써도 된다.**
- 시니어 니치의 기본은 **순수 공감**이고, **의료 단정은 어떤 형태로도 금지**다(가능성 언급까지도). SKILL §1-4B·§2-3 참고.
