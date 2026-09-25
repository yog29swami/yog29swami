# MVP Proposal: Photo → Identify → Replace/Repair → Buy

> Status: **Draft v1 for review.** No application code has been written yet.
> Working name in this document: **SnapSpare** (see §1 for alternatives).
> All third-party prices marked *(verify)* must be re-checked before launch; Claude API
> prices are from Anthropic's published list prices as of mid-2026.

---

## 0. Executive summary

**The bet:** People regularly hold a physical thing in their hand (a broken lid, a
charger, a mixer-grinder coupler, a remote, a cam-lock bolt) and cannot turn it into a
search query. General tools (Google Lens, ChatGPT/Gemini with vision) will tell them
*roughly what it looks like*. Nobody reliably walks them through **what exactly it is →
what part they need → will it fit → where do I get the official one**, while being honest
about uncertainty.

**The smallest product that proves it:**

- A single-screen app: take a photo, optionally say what's wrong, get a structured,
  confidence-labelled answer.
- One vision call (identification) + one optional research call (web search for the
  part/replacement and where to buy it).
- A strict **evidence-and-confidence contract**: every brand, model, part number,
  price, and link must be traceable to either visible evidence in the photo or a fetched
  web source. No evidence → not shown.
- A **"need one more photo"** loop that asks for the *minimum* extra evidence (label,
  underside, measurement).
- 6 launch categories, defined as **data ("category packs")**, not code. Everything else
  still works through a generic fallback that says "I couldn't confidently identify this
  yet" plus useful next steps.
- No payments. Free with generous limits, a "Pro — coming soon" fake door to measure
  willingness to pay.

**Recommended stack:** Expo (React Native, SDK 57) universal app → Supabase (Auth,
Postgres, private Storage, Edge Functions) → Claude API (Sonnet 5 for vision +
web search; Opus 5.5 as an escalation tier; Haiku 4.5 for cheap utility tasks).

**Estimated AI cost:** ≈ **$0.03** per identify-only scan, ≈ **$0.10–0.20** per full
replacement-part research, **≈ $0.08–0.12 blended** per user session (§19).

**Before writing code:** run a one-week *concierge test* (M0 in §26) using Claude.ai
manually on 40–60 real photos. It costs nothing and tells us whether the core answer
quality is good enough to build around.

---

## 1. Product name ideas

| Name | Notes |
|---|---|
| **SnapSpare** | Clear "photo → spare part" story. Recommended working name. |
| PartSnap | Very literal; likely crowded namespace. |
| Whatsit | Friendly, captures "I don't know what this is"; broader than parts. |
| FitCheck | Emphasises compatibility — strongest differentiator — but used in fashion. |
| Refit | Short; "replace and fit". |
| KnowPart | Descriptive, a bit clunky. |
| Spareo | Brandable, neutral. |
| IdentiFix | Identify + fix; repair angle. |
| ThisThing | Conversational ("what is this thing?"). |
| Lookup Lens | Descriptive; risks confusion with Google Lens. |

Do a trademark + app-store + domain check on the top 3 before committing. Nothing in the
code should depend on the name (config value only).

## 2. One-line value proposition

> **"Snap anything. We'll tell you what it is, which part you need, whether it'll fit,
> and where to get it — and we'll tell you when we're not sure."**

Shorter store tagline: *"Photo in. Right part out."*

## 3. Target users

| Segment | Why they care | MVP priority |
|---|---|---|
| **Parents / household managers** | Constant broken lids, straws, lunchbox seals, toy parts, remotes. High frequency, low willingness to spend time searching. | **Primary** |
| **Home-appliance owners (esp. India)** | Mixer-grinder couplers, pressure-cooker gaskets/whistles, RO filters, washing-machine knobs, chimney filters. Official spare-part channels exist but are hard to navigate. | **Primary** |
| **Gadget users** | Lost/broken chargers, cables, adapters — need exact wattage/connector. | **Primary** |
| DIY / renters | Furniture hardware, bulbs, batteries, fittings. | Secondary |
| Elderly users / less tech-savvy | Can't describe the item in words. | Secondary (UX must be simple) |
| Repair shops, resellers, facility managers | Many lookups per day — future B2B/API. | Later |

## 4. Top user problems

1. "I don't know what this thing is **called**, so I can't search for it."
2. "I know what it is but not the **exact model/variant**."
3. "A **small part** broke; I don't want to buy the whole product again."
4. "I found something that **looks** the same — will it actually **fit**?"
5. "Is there an **official** replacement, and where is it sold?"
6. "Marketplaces show 50 near-identical listings; which one is right?"
7. "I need the **manual / spec / warranty** info for this old thing."

## 5. Core use cases (MVP)

| # | Use case | Example |
|---|---|---|
| U1 | **Identify** an object | "What is this connector?" |
| U2 | **Find a replacement part** for a broken/missing component | Broken double-flap bottle lid; mixer coupler |
| U3 | **Find an exact replacement** of a whole accessory | Laptop charger with correct wattage/tip |
| U4 | **Check compatibility** of a candidate | "Will this lid fit my bottle?" |
| U5 | **Where to buy** (official first) | Official spare-part page, authorized sellers, marketplaces |
| U6 | **Find manual/spec** | Remote model → manual PDF |

Explicitly **not** MVP: repair tutorials generation, price tracking, multi-product
comparison tables, AR measurement, barcode catalog lookup at scale.

## 6. Recommended initial categories

Chosen for India-first *and* global relevance. Launch with the first 6; 7–8 are stretch.

| # | Category pack | Typical asks |
|---|---|---|
| 1 | **Chargers, adapters & cables** | Laptop/phone chargers, barrel tips, USB-C PD, cables |
| 2 | **Bottles, flasks & lunchboxes** | Lids, flip caps, straws, seals, sipper spouts |
| 3 | **Kitchen appliance parts** | Mixer-grinder couplers/jars/blades, pressure-cooker gaskets/whistles/safety valves, kettle lids |
| 4 | **Remote controls** | TV/AC/set-top-box remotes |
| 5 | **Home-appliance consumables & knobs** | RO/water-purifier filters, vacuum/chimney filters, washing-machine/stove knobs |
| 6 | **Batteries & bulbs** | Coin cells (CR2032…), AA/AAA, bulb bases (B22/E27/GU10), tube lights |
| 7 | *Furniture hardware* (stretch) | Cam locks, dowels, hinges, IKEA-style numbered parts |
| 8 | *Phone/computer accessories* (stretch) | Earbud tips, stylus, cases, keyboard keys |

**Deliberately deferred:** automotive (year/make/model fitment data is a deep problem),
plumbing (thread standards vary by region, measurements critical), electronics
components (huge long tail), clothing/fashion (covered by visual shopping already).

## 7. Why these categories suit an MVP

| Criterion | Why it matters | How the chosen set scores |
|---|---|---|
| **Visible identifiers** | OCR of labels/model numbers gives HIGH confidence cheaply | Chargers, remotes, filters, batteries, bulbs carry printed specs/model numbers |
| **Well-defined compatibility attributes** | Makes a checklist feasible | Voltage/wattage/tip size; cap diameter/thread; coupler shape/teeth; bulb base; battery code |
| **Official spares exist** | Lets us prove "official-first" differentiation | Prestige/Hawkins/Preethi/Bajaj/Philips spares; Milton/Cello/Borosil/Contigo/CamelBak/Thermos lids; Kent/Aquaguard filters |
| **High frequency, low price** | Many repeat uses; low risk of a wrong purchase | ₹50–₹2,500 items |
| **Hard to search by text** | Where we add the most value over Google | "that rubber star thing on top of the mixer motor" |
| **Low safety/liability** | Avoid giving advice where errors are dangerous | Excluding gas fittings, car brakes, mains wiring; pressure-cooker safety parts get an explicit "buy official only" rule |

## 8. Complete user journey

```
[Open app] ─► HOME: "Take a photo of anything you want to identify"
     │           [📷 Take photo]  [🖼 Upload]   (optional: "What's wrong?" text/chips)
     ▼
[Photo taken] ─► client: resize to ≤1568px long edge, JPEG ~80%, strip EXIF/GPS
     │
     ▼
INTENT (one tap, skippable; AI also infers it)
  • Identify this        • Find a replacement / part   • Where to buy
  • Compatible accessory • Find a manual               • How it works / repair info
     │
     ▼
ANALYZING (progress: "Reading labels… Identifying… Checking sources…")  ~10–40 s
     │
     ├─► Enough evidence ──► RESULT (sections 1–8, see §9)
     │                          │
     │                          ├─ tap "Where to get it" → outbound link (tracked)
     │                          ├─ tap "Was this right? 👍/👎" → feedback
     │                          └─ tap "Add a photo / measurement" → FOLLOW-UP
     │
     └─► Not enough evidence ─► RESULT with UNCONFIRMED + "NEED MORE INFORMATION"
                                  "Please photograph: the bottom of the bottle,
                                   the logo, and the opening (with a ruler)."
                                        │
                                        ▼
                                  FOLLOW-UP capture ─► re-analysis with all photos
                                        │
                                        ▼
                                  Updated RESULT (confidence can go up or down)

HISTORY: every scan saved (images auto-deleted after N days; results kept).
```

Key UX rules:

- **Never more than 2 taps before the first result.** Intent selection is optional.
- The first screen of the result answers "What is this?" and "How sure are we?" in one
  glance. Everything else is below the fold.
- Follow-up requests ask for **one to three specific things**, each with a tiny
  illustration ("photo of the underside", "measure across the opening in mm").

## 9. Required screens

| # | Screen | Purpose |
|---|---|---|
| S1 | **Home / Capture** | Camera + upload + optional "what's wrong?" text |
| S2 | **Intent picker** (sheet) | 6 chips; skippable |
| S3 | **Analyzing** | Staged progress, cancel |
| S4 | **Result** | The 8-section result page |
| S5 | **Follow-up capture** | Guided extra photo / measurement / answer |
| S6 | **Candidate detail** | One match: evidence, differences, compatibility, sources |
| S7 | **History** | Past scans, re-open, delete |
| S8 | **Settings & privacy** | Retention, delete my data, how images are processed, sign-in |
| S9 | **Onboarding** (3 cards) | What it does, privacy promise, tips for good photos |
| S10 | **Pro waitlist** (fake door) | Measures willingness to pay; no payment |

### Wireframe-level descriptions

**S1 Home / Capture**
```
┌──────────────────────────────┐
│  SnapSpare              ⚙ 🕘 │
│                              │
│   Take a photo of anything   │
│   you want to identify.      │
│                              │
│   ┌──────────────────────┐   │
│   │      [ 📷 Camera ]    │   │
│   └──────────────────────┘   │
│        [ 🖼 Upload photo ]    │
│                              │
│  What's wrong? (optional)    │
│  [ broken ] [ missing ] [lost]│
│  [ type here…              ] │
│                              │
│  Tips: fill the frame, show  │
│  any label or model number.  │
└──────────────────────────────┘
```

**S4 Result** (scrolling, collapsible sections)
```
┌──────────────────────────────┐
│ ◀  Result            ⋯ share │
│ [photo thumb]                │
│ 1 WHAT IS THIS?              │
│  Children's water bottle —   │
│  double-flap sipper lid      │
│  Brand: Milton (logo read)   │
│  Model: not confirmed        │
│  ● POSSIBLE  ⓘ why?          │
│──────────────────────────────│
│ 8 NEED MORE INFORMATION  ◀── pinned high when confidence < LIKELY
│  To confirm the lid, add:    │
│  [📷 bottom of bottle]       │
│  [📏 opening diameter (mm)]  │
│──────────────────────────────│
│ 2 WHAT I FOUND  (evidence)   │
│  • "MILTON" moulded on lid   │
│  • Two hinged flaps, straw   │
│  • ~500 ml (proportions)     │
│ 3 WHAT YOU MAY NEED          │
│  Replacement sipper lid      │
│  (also called "flip-top cap")│
│ 4 POSSIBLE MATCHES (3)       │
│  ▸ Milton Kool Stunner lid ● │
│  ▸ Milton Kool Kid lid     ● │
│ 5 COMPATIBILITY              │
│  ✔ brand   ? neck diameter   │
│  ? thread type  ? capacity   │
│  "Compatibility could not be │
│   confirmed."                │
│ 6 WHERE TO GET IT            │
│  Official: milton… (no spare │
│  listed)  Marketplace: …     │
│  Search terms: "Milton … lid"│
│ 7 PRODUCT INFORMATION        │
│ 👍 👎  Was this right?        │
└──────────────────────────────┘
```

Rules for the Result page:
- Confidence chip colours: HIGH (green), LIKELY (teal), POSSIBLE (amber),
  UNCONFIRMED (grey). Tapping explains *why* in one sentence.
- Section 8 ("Need more information") **moves to the top** whenever top-candidate
  confidence < LIKELY.
- Every source row shows: source type badge (**Official / Authorized / Marketplace /
  Third-party**), domain, and, if present, "Price seen ₹X on <date> — verify on site".
- Empty sections are hidden, not filled with filler.

**S5 Follow-up capture**: a checklist of the requested items, each with an icon, one
line of instruction, and a camera/number-input button. "Skip — show what you have".

**S6 Candidate detail**: name, confidence + reason, "How to tell apart" (distinguishing
features vs the other candidates), compatibility table (attribute / required / yours /
status), sources.

**S7 History**: list of cards (thumb, title, confidence, date). Swipe to delete.

## 10. MVP vs future features

| Area | MVP | Future |
|---|---|---|
| Input | 1 photo + up to 3 follow-up photos, optional text | Video, multi-angle auto-capture, AR ruler, barcode/QR |
| Identification | Category, object, component, brand/model/part no. with evidence, confidence | Visual-embedding catalog match, user-contributed ground truth |
| Research | Web search (official-first), up to ~5 searches/scan | Retailer/affiliate APIs, manufacturer part catalogs, price comparison |
| Replacement | Part name, terminology, candidates, search keywords, official vs third-party | Exploded-diagram lookup, part-number cross-reference DB |
| Compatibility | Checklist from category pack; CONFIRMED only with source | Structured compatibility graph, crowd-verified fits |
| Account | Anonymous by default, optional email magic-link | Social login, family sharing |
| History | Yes | Saved "My things" inventory, reminders (filter replacement) |
| Monetization | None (fake-door Pro waitlist) | Subscription, affiliate, API |
| Platforms | Web (PWA) + Android internal build | iOS App Store + Play Store |
| Languages | English | Hindi and regional languages |

## 11. Technical architecture

### Options considered (brief)

| Decision | Options | Recommendation (MVP) | Why |
|---|---|---|---|
| Client | Native iOS/Android · Next.js PWA · **Expo universal** | **Expo (SDK 57) — web + Android first** | Camera is core; you already use Expo; one codebase ships web (share a link to testers instantly) and Android/iOS later. |
| Backend | Custom Node server · Firebase · **Supabase** | **Supabase** | Postgres + Auth (anonymous users) + private Storage + Edge Functions (TypeScript) + cron in one free-tier product. Relational data fits candidates/sources/compat well. |
| Pipeline runtime | Edge Functions · Cloud Run/Fly Node | **Supabase Edge Functions**, async job pattern | No servers to run. If wall-clock limits bite for long research calls, move only the worker to a small Node service; API stays the same. |
| AI | Multi-vendor · **Claude API** | **Claude API** (vision + built-in web search + web fetch) | One vendor gives vision, OCR-quality text reading, web search with citations, and structured outputs. Fewer integrations = faster MVP. |
| OCR | Google Vision / Tesseract · **model-native** | **Model-native** reading in the vision call | Modern vision models read labels well; a dedicated OCR API adds cost and plumbing. Revisit if the eval shows missed text. |
| Visual search | Google Lens via SerpApi *(verify)* · none | **Experiment in M5b**, only for scans with no readable text | Helps unbranded items; adds a vendor, so gate it behind data. |
| Analytics | PostHog · **Postgres events table** | Events table (+ PostHog free tier optional) | Our key metrics are tied to scans; SQL is enough for 50–500 users. |
| Errors | **Sentry** (free tier) | Sentry | Standard. |

### High-level diagram

```
 ┌───────────── Expo app (web / Android / iOS) ─────────────┐
 │ capture → resize/compress/strip EXIF → upload (signed)   │
 │ poll or realtime-subscribe to scan status → render result │
 └───────────────┬──────────────────────────────▲───────────┘
                 │ HTTPS (Supabase JWT)          │ result JSON
                 ▼                               │
 ┌──────────────────────── Supabase ────────────────────────────┐
 │ Auth (anonymous → optional email)                             │
 │ Storage: private bucket scan-images/{user}/{scan}/{n}.jpg     │
 │ Edge Functions:                                               │
 │   api-scans  (create, get, follow-up, feedback, delete)       │
 │   worker-analyze  ── Stage A: Perceive  (Claude vision)       │
 │                   ── Stage B: Research  (Claude + web_search) │
 │                   ── Stage C: Verify & score (deterministic)  │
 │   r (redirect)    ── logs outbound clicks                     │
 │ Postgres: scans, candidates, sources, compat, cache, events   │
 │ Cron: image retention purge, monthly quota reset, budget alert│
 └───────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
      Anthropic Claude API (Sonnet 5 / Opus 5.5 / Haiku 4.5,
      web_search + web_fetch server tools)
```

### Async job pattern

1. `POST /scans` → creates `scans` row (`status=awaiting_upload`) and returns signed
   upload URLs.
2. Client uploads, then `POST /scans/:id/analyze` → `status=queued`, invokes worker.
3. Worker updates `status` through `perceiving → researching → done | needs_info | failed`,
   writing partial results as it goes (so the UI can show "What is this?" before
   research finishes).
4. Client subscribes via Supabase Realtime (or polls every 2 s) on the scan row.

## 12. AI model strategy

Current Claude list prices (per 1M tokens, input / output):
**Haiku 4.5** $1 / $5 · **Sonnet 5** $2 / $10 · **Opus 5.5** $4 / $20.
Web search: **$10 per 1,000 searches** plus the tokens of the results.

| Stage | Model | Effort | Why |
|---|---|---|---|
| A. Perceive (vision + text reading + intent) | **Sonnet 5** | low → medium | Strong vision/OCR at low cost. One call does category, object, component, visible text, damage, intent, PII flags, missing-evidence list. |
| B. Research (web search + fetch, candidates, sources, compat) | **Sonnet 5** | medium | Needs judgement over search results; web_search/web_fetch with dynamic filtering are supported on Sonnet 5. |
| Escalation (conflicting evidence, user 👎, or "Try harder") | **Opus 5.5** | medium | Only on demand; ~2× Sonnet price. Measure in the eval whether it actually lifts accuracy before using it automatically. |
| Utility (query normalisation, title cleanup, dedupe keys, eval judging) | **Haiku 4.5** | n/a | Cheapest; text-only tasks. |

Principles:

- **Structured outputs** (`output_config.format` with a JSON schema) for every stage — the
  UI renders fields, never free text blobs.
- **Evidence fields are mandatory**: each claimed attribute carries
  `evidence: {type: "visible_text" | "visual_feature" | "source", detail, source_url?}`.
  Stage C drops any brand/model/part number/price/link without evidence.
- **Category packs injected into the prompt** (see §15) so domain knowledge is data.
- **Prompt caching** for the stable system prompt + category-pack block.
- Before building a cascade (Haiku → Sonnet → Opus), first measure **Sonnet 5 at low vs
  medium effort** on the golden set; one model at the right effort is often cheaper and
  simpler than a cascade.

### Confidence rubric (applied by code in Stage C, not by the model's say-so)

| Level | Rule (identification) |
|---|---|
| **HIGH CONFIDENCE** | Model/part number read in the photo **and** matched on an official or authorized source page (fetched), **or** a unique identifier (e.g. barcode) matched. |
| **LIKELY** | Brand read in the photo **and** product family matched on a source with ≥2 distinguishing features agreeing; no contradicting candidate. |
| **POSSIBLE** | Category and component clear; candidates based on visual similarity or brand-only; ≥1 plausible alternative. |
| **UNCONFIRMED** | Category unclear, or evidence conflicting, or image unusable. |

The model *proposes* a level with reasons; Stage C can only **lower** it (never raise it)
when rules aren't met. Displayed "why" text comes from the rule that fired.

## 13. Web / product search strategy

Use Claude's `web_search` tool inside Stage B with `max_uses` capped (default 4, max 6),
`user_location` set to the user's country, and a **blocked_domains** list of known
spam/clone sites. Stage B receives Stage A's structured output (text only — **the photo
is never sent to a search engine**).

Progressive query ladder (stop as soon as confidence is sufficient for the intent):

1. Exact **model number / part number** read from the photo (`"HK-123" lid`).
2. **Brand + product line + component** (`Prestige mixer grinder coupler`).
3. **Brand + distinguishing visual features**.
4. **Category + physical characteristics + standard terminology**
   (`double flap sipper lid 500ml kids bottle replacement`).
5. **Official site** targeted query (`site:<brand domain> spare parts`), then
   `web_fetch` the page to verify model/part numbers and compatibility lists.
6. **Manuals** (`<model> user manual pdf`).
7. **Reputable marketplaces** (Amazon.in, Flipkart, brand stores; global: Amazon, eBay,
   specialist parts sites).
8. Other sellers only if 1–7 produce nothing.

Rules:
- **Source classification** in code by domain lists per category pack:
  `official`, `authorized`, `marketplace`, `third_party`, `info` (manuals/forums).
- **Price** shown only when present on a fetched page; stored with `seen_at`; always
  labelled "verify on site". Never estimated by the model.
- **Links** shown only if they came from a search/fetch result (never model-composed).
  Stage C validates each URL (HEAD request, allowed scheme, not on blocklist).
- **Search cache**: key = normalised query + country; TTL 7 days (prices 24 h).
- **Research cache by identity**: once a (brand, model, component) is resolved with
  HIGH/LIKELY, store its research bundle; later scans that resolve to the same identity
  reuse it (big cost saver for popular products).

Future: Amazon/Flipkart affiliate product APIs, manufacturer catalogs, SerpApi
Google Lens for visual matches.

## 14. Replacement-part search strategy

Triggered when intent is `replace` **or** Stage A detects damage/missing component
**or** user text contains broken/missing/lost/cracked/leaking, etc.

Steps (Stage B prompt enforces this order; output schema has a slot for each):

1. **Name the component** — canonical name + synonyms (e.g. "coupler" = "coupling",
   "drive socket", "star connector"). Category packs supply terminology.
2. **Is it normally replaceable?** (sold separately / service-only / not sold).
3. **Official replacement?** Search manufacturer spare-part pages / service centres.
4. **Exact part / model number** — only if found on a source or read in the photo.
5. **Compatible products** — from the source's compatibility list only.
6. **Third-party alternatives** — clearly labelled *Third-party*; "universal" items
   flagged with the attributes that must match.
7. **What must match** — attributes from the category pack's
   `critical_compat_attributes`.
8. **Where to buy** — ordered: official → authorized → marketplace → third-party.

If exact replacement can't be confirmed → output: closest candidates, compatibility
requirements, **copy-able search keywords**, required measurements, and specific extra
photos needed.

**Safety rule** (category-pack flag `safety_critical: true`, e.g. pressure-cooker
safety valve/gasket, chargers): recommend official/certified parts only, show a
warning, never recommend "universal" alternatives as equivalent.

## 15. Compatibility strategy (a separate engine)

Compatibility is computed **per candidate × per attribute**, independent of
identification.

```
compatibility_check {
  attribute:  "neck_inner_diameter_mm"
  required:   "48" (from source: official spec page)      ← what the part needs
  observed:   "~47–50 (estimated from photo)" | "48 (user measured)"
  status:     match | mismatch | unknown
  basis:      manufacturer_list | spec_match | user_measurement | visual_estimate
}
```

Overall compatibility status:

| Status | Rule |
|---|---|
| **CONFIRMED** | Manufacturer/authorized source lists the user's model as compatible. |
| **LIKELY** | All `critical_compat_attributes` match with basis ≥ spec_match/user_measurement. |
| **UNKNOWN** — "Compatibility could not be confirmed." | Any critical attribute unknown or only visually estimated. |
| **INCOMPATIBLE** | Any critical attribute mismatches. |

"Looks similar" alone can never produce better than UNKNOWN. Visual estimates of size
are shown as ranges and never count as a match.

### Category packs (how we stay category-agnostic)

A category pack is a **database row / JSON document**, not code:

```json
{
  "id": "bottle_lids",
  "version": 3,
  "parent": "kitchen_and_dining",
  "match_hints": ["bottle", "flask", "sipper", "lid", "cap", "straw"],
  "key_identifiers": ["brand", "product_line", "capacity_ml", "model_code_on_base"],
  "components": [
    {"name": "sipper lid", "synonyms": ["flip-top cap", "double flap lid", "spout lid"]},
    {"name": "silicone seal", "synonyms": ["gasket", "O-ring"]}
  ],
  "critical_compat_attributes": [
    {"key": "neck_inner_diameter_mm", "unit": "mm", "how_to_measure": "Measure inside of the bottle opening, edge to edge."},
    {"key": "thread_type", "values": ["screw", "push-fit", "bayonet"]},
    {"key": "product_line", "note": "Lids are usually line-specific"}
  ],
  "photo_requests": [
    {"key": "base", "prompt": "Photo of the bottom of the bottle (model/capacity is often printed there)"},
    {"key": "opening", "prompt": "Photo looking into the bottle opening next to a ruler"}
  ],
  "source_domains": {
    "official": ["milton.in", "cello.in", "borosil.com", "contigo.com", "camelbak.com", "thermos.com"],
    "marketplace": ["amazon.in", "flipkart.com", "amazon.com"]
  },
  "safety_critical": false
}
```

- Stage A predicts `category_pack_id` (or `generic`). The worker loads that pack and
  injects it into Stage B.
- **Adding a category = inserting a row** + adding ~20 test photos to the golden set.
- The **generic pack** has universal attributes (dimensions, material, connector type,
  markings) and universal photo requests (label, underside, scale reference) so
  unsupported categories still get useful, honest output.

## 16. Database design (Postgres / Supabase)

```sql
-- Users come from Supabase auth.users (anonymous allowed)
create table profiles (
  user_id        uuid primary key references auth.users on delete cascade,
  country        text default 'IN',
  plan           text not null default 'free',            -- free | beta | pro(later)
  image_retention_days int not null default 30,
  created_at     timestamptz default now()
);

create table category_packs (
  id             text primary key,                        -- 'bottle_lids', 'generic'
  version        int not null,
  status         text not null default 'active',          -- active | draft | retired
  definition     jsonb not null,                          -- see §15
  updated_at     timestamptz default now()
);

create table scans (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users on delete cascade,
  status         text not null,  -- awaiting_upload|queued|perceiving|researching|done|needs_info|failed
  intent         text,           -- identify|replace|buy|accessory|manual|how_it_works|repair (user or inferred)
  intent_source  text,           -- user | inferred
  user_text      text,
  category_pack_id text references category_packs(id),
  top_confidence text,           -- HIGH|LIKELY|POSSIBLE|UNCONFIRMED
  result         jsonb,          -- final rendered result contract (§17)
  parent_scan_id uuid references scans(id),               -- follow-ups chain
  cost_usd       numeric(10,5) default 0,
  latency_ms     int,
  created_at     timestamptz default now()
);

create table scan_images (
  id             uuid primary key default gen_random_uuid(),
  scan_id        uuid not null references scans on delete cascade,
  storage_path   text,                                    -- null after purge
  sha256         text not null,                           -- exact-duplicate cache key
  phash          text,                                    -- near-duplicate key
  role           text default 'primary',                  -- primary|base|label|opening|measurement…
  width int, height int, bytes int,
  purge_after    timestamptz not null,
  created_at     timestamptz default now()
);

create table model_runs (                                 -- every AI call, for cost + debugging
  id             uuid primary key default gen_random_uuid(),
  scan_id        uuid references scans on delete cascade,
  stage          text not null,                           -- perceive|research|escalate|utility
  model          text not null,
  input_tokens int, output_tokens int, cache_read_tokens int,
  web_searches   int default 0,
  cost_usd       numeric(10,5),
  output         jsonb,
  error          text,
  created_at     timestamptz default now()
);

create table candidates (
  id             uuid primary key default gen_random_uuid(),
  scan_id        uuid not null references scans on delete cascade,
  rank           int not null,
  kind           text not null,          -- product | component | replacement | accessory
  name           text not null,
  brand          text, model text, part_number text, variant text,
  confidence     text not null,
  confidence_reason text,
  evidence       jsonb not null,         -- [{type, detail, source_url?}]
  distinguishing jsonb,                  -- how it differs from other candidates
  compat_status  text                    -- CONFIRMED|LIKELY|UNKNOWN|INCOMPATIBLE
);

create table sources (
  id             uuid primary key default gen_random_uuid(),
  candidate_id   uuid references candidates on delete cascade,
  scan_id        uuid not null references scans on delete cascade,
  url            text not null,
  domain         text not null,
  source_type    text not null,          -- official|authorized|marketplace|third_party|info
  title          text,
  price_amount   numeric, price_currency text, price_seen_at timestamptz,
  verified       boolean default false   -- fetched & model/part number found on page
);

create table compatibility_checks (
  id             uuid primary key default gen_random_uuid(),
  candidate_id   uuid not null references candidates on delete cascade,
  attribute      text not null,
  required_value text, observed_value text,
  status         text not null,          -- match|mismatch|unknown
  basis          text not null           -- manufacturer_list|spec_match|user_measurement|visual_estimate
);

create table info_requests (             -- "Need more information"
  id             uuid primary key default gen_random_uuid(),
  scan_id        uuid not null references scans on delete cascade,
  kind           text not null,          -- photo|measurement|question
  key            text, prompt text not null,
  fulfilled_by_scan_id uuid references scans(id)
);

create table feedback (
  id             uuid primary key default gen_random_uuid(),
  scan_id        uuid not null references scans on delete cascade,
  user_id        uuid not null,
  verdict        text not null,          -- correct|partly|wrong|not_sure
  bought         boolean,
  correct_answer text, comment text,
  created_at     timestamptz default now()
);

create table events (                    -- product analytics
  id             bigserial primary key,
  user_id        uuid, scan_id uuid,
  name           text not null,          -- scan_started, result_viewed, source_clicked, followup_submitted, pro_waitlist_joined…
  props          jsonb,
  created_at     timestamptz default now()
);

create table research_cache (
  key            text primary key,       -- hash(normalised identity or query + country)
  kind           text not null,          -- query | identity
  payload        jsonb not null,
  expires_at     timestamptz not null
);

create table usage_ledger (
  user_id        uuid not null,
  period         date not null,          -- first day of month
  scans          int default 0,
  deep_research  int default 0,
  cost_usd       numeric(10,4) default 0,
  primary key (user_id, period)
);
```

Row-level security: users can read only their own `scans` and children; `category_packs`
readable by all; writes to result tables only by the service role (worker).

## 17. API requirements

All endpoints are Supabase Edge Functions behind Supabase Auth JWT.

| Method & path | Purpose |
|---|---|
| `POST /scans` | Create scan `{intent?, user_text?, image_count}` → `{scan_id, upload_urls[]}`. Enforces quota. |
| `POST /scans/:id/analyze` | Start pipeline after upload. Dedupe by image sha256 (same user, 24 h) → return cached. |
| `GET /scans/:id` | Status + partial/final result contract. (Or Realtime subscription.) |
| `POST /scans/:id/followup` | `{images?, measurements?: {key: value}, answers?}` → new child scan, re-runs with all evidence. |
| `POST /scans/:id/research` | Run/deepen Stage B on demand ("Find replacement", "Where to buy", "Try harder"). |
| `POST /scans/:id/feedback` | 👍/👎, correct answer, bought? |
| `GET /r/:source_id` | Redirect to source URL; logs `source_clicked`. Future home of affiliate tagging. |
| `GET /history` | Paginated scans. |
| `DELETE /scans/:id` | Delete scan + images immediately. |
| `DELETE /me` | Delete account and all data. |
| `POST /events` | Client analytics events (batched). |
| `POST /waitlist` | Pro fake-door sign-up. |

### Result contract (what the app renders)

```ts
type Confidence = "HIGH" | "LIKELY" | "POSSIBLE" | "UNCONFIRMED";
type Evidence = { type: "visible_text" | "visual_feature" | "source" | "user_input";
                  detail: string; source_url?: string };

interface ScanResult {
  what_is_this: {
    title: string;                 // "Children's water bottle — double-flap sipper lid"
    category: { pack_id: string; label: string };
    component?: string;            // the part in focus (e.g. "sipper lid")
    brand?:  { value: string; evidence: Evidence[] };
    model?:  { value: string; evidence: Evidence[] };
    part_number?: { value: string; evidence: Evidence[] };
    confidence: Confidence;
    confidence_reason: string;
  };
  what_i_found: { summary: string; evidence: Evidence[] };
  what_you_may_need?: { component_name: string; synonyms: string[];
                        replaceable: "yes" | "service_only" | "unknown";
                        official_available: "yes" | "no" | "unknown"; notes?: string };
  candidates: Candidate[];         // ranked, max 5
  compatibility?: { overall: "CONFIRMED" | "LIKELY" | "UNKNOWN" | "INCOMPATIBLE";
                    checks: CompatCheck[]; message: string };
  where_to_get_it: Source[];       // ordered official → authorized → marketplace → third_party
  product_information?: { specs?: Record<string, {value: string; evidence: Evidence[]}>;
                          manuals?: Source[]; support?: Source[] };
  need_more_information: InfoRequest[];   // 0–3 items, minimal
  search_keywords: string[];       // copy-able queries the user can try themselves
  warnings: string[];              // safety, PII detected, low image quality
}
```

## 18. Security & privacy

| Risk | Control |
|---|---|
| Location/device metadata in photos | **Strip EXIF on device** before upload (re-encode JPEG). |
| Photos containing documents, faces, addresses, cards | Stage A returns `pii_detected[]`; result shows a notice; worker **never** puts PII or serial numbers into web queries; option "blur & re-upload". |
| Image exposure | Private bucket; access only via short-lived signed URLs; no public URLs; images sent to Claude as base64 from the worker, not as public links. |
| Retention | Default **30-day** image purge (cron), user-configurable (0 = delete right after analysis). Results (text) kept until user deletes. |
| Third-party processing | Only Anthropic receives images. Search providers receive **text queries only**. State this in onboarding + privacy policy. (Anthropic's commercial API terms say inputs aren't used for training by default — re-verify current terms before launch.) |
| Account data | Anonymous by default; email optional (to sync history). Delete-my-data in Settings. |
| Prompt injection via web pages | Search/fetch content treated as data; Stage C validates URLs and domains; model can't add links not present in tool results. |
| Abuse / cost attacks | Per-user and per-IP rate limits, monthly quota, global daily spend cap (kill switch), max image size/count. |
| Secrets | Anthropic key only in Edge Function secrets; never in the app bundle. |
| Minors | Children's products are in scope, but users are adults; state "13+/18+" per store policy. |
| Compliance | India DPDP Act 2023 and GDPR basics: purpose limitation, consent notice, deletion rights, data-processing disclosure. |

## 19. Estimated cost per search

Assumptions: image resized to ≤1568 px long edge ≈ **1,500 image tokens**; system
prompt + category pack ≈ 3,000 tokens (cached after first hit); Sonnet 5 at $2/$10;
web search $10/1,000.

| Stage | Tokens (approx.) | Cost |
|---|---|---|
| A. Perceive (Sonnet 5, low effort) | in ~5k (3k cached), out ~1.5k incl. thinking | **≈ $0.02** |
| B. Research (Sonnet 5, medium, 3–5 searches + 1–2 fetches) | in ~25–45k (search results), out ~2.5k | tokens ≈ $0.08–0.12 + searches $0.03–0.05 = **≈ $0.11–0.17** |
| C. Verify (code; URL HEAD checks) | — | ~$0 |
| Escalation (Opus 5.5, only when triggered) | similar to B | **≈ $0.20–0.30** |
| Infra (Supabase, storage) | — | ≈ $0 on free tier; <$0.001/scan at paid tier |

| Scenario | Estimated cost |
|---|---|
| Identify-only (answer from photo, no research) | **≈ $0.02–0.03** |
| Identify + where to buy / replacement research | **≈ $0.13–0.20** |
| Follow-up photo (re-run A + incremental B) | ≈ $0.05–0.10 |
| **Blended per session** (assume 50% need research, 10% cache hits, 5% escalations) | **≈ $0.08–0.12** |
| "Per *successful* search" (assume 60% success) | **≈ $0.13–0.20** |

Cost levers (in order of impact): research only when intent needs it; identity-level
research cache; `max_uses` on search; prompt caching; low effort for Stage A; Batch API
(50% off) for offline eval runs; downscaling images further if the eval shows no loss.

Budget example: 300 beta users × 8 sessions/month × $0.10 ≈ **$240/month**.

## 20. Free-tier strategy (MVP)

- **Beta = free.** Per user per month: **15 scans**, of which **5 deep researches**
  (replacement/where-to-buy). Follow-up photos on the same scan don't count.
- Soft wall message: "You've used this month's free searches. Join the Pro waitlist to
  get more when it launches." (fake door → measures demand).
- Global daily spend cap with graceful degradation (identify-only mode).

Post-validation free tier (hypothesis): 5 scans/month, identify + basic research;
no deep compatibility or history beyond 30 days.

## 21. Future subscription strategy

Build only after validation (§25). Hypotheses to test with the fake door and interviews:

| Tier | Price hypothesis | Includes |
|---|---|---|
| Free | ₹0 / $0 | 5 scans/month, basic identification + sources |
| Pro | ₹149–299/mo in India; $4.99–7.99/mo global | 100 scans, multi-image, deep replacement research, compatibility checks, history, saved "My things", manuals |
| Credits | ₹49 / $1.99 per 10 deep searches | For infrequent users who won't subscribe |

Unit-economics check: a Pro user doing 30 deep searches ≈ $4–6 of AI cost → the India
price point only works with caching, affiliate revenue, or lower usage. Credits may fit
the actual (bursty, need-driven) usage pattern better than subscriptions — test both.

## 22. Monetization possibilities

| Model | Viability notes |
|---|---|
| **Affiliate commissions** (Amazon Associates, Flipkart Affiliate, brand programs) | Natural fit (user already wants to buy). Low-ticket parts → small commissions (a few % of ₹200). Needs volume. Easiest first experiment: tagged links via `/r/:id`. |
| Subscription / credits | See §21. Depends on repeat usage — the biggest unknown. |
| Manufacturer partnerships | Brands want fewer "whole product" returns and more spare-part sales; could pay for official-part placement or listing. Must keep organic ranking honest and labelled. |
| Marketplace partnerships | Referral fees; later. |
| **B2B API** (product/part identification) | Repair shops, marketplaces, customer-support teams, insurers. Possibly the highest-value long-term route; needs proven accuracy data first. |
| Ads | Avoid — conflicts with trust and "official-first" ranking. |

No model is assumed viable; §25 defines what data decides it.

## 23. Competitors and differentiation

| Competitor | What they do well | Gap we target |
|---|---|---|
| **Google Lens** | Visual matches at massive scale, free | Shows lookalikes, not *the part you need*; no compatibility; no uncertainty |
| **ChatGPT / Gemini / Claude apps (vision + search)** | Can do much of this in a chat | Unstructured, user must know how to prompt, inconsistent confidence, no guided follow-up photos, no official-first sourcing, no history of "my things". **This is the biggest threat** — our edge must be workflow, accuracy, and parts depth. |
| Amazon Lens / Flipkart visual search | Buy-now convenience | Only their catalog; favours lookalikes; no official spares |
| Pinterest Lens, Bing visual search | Inspiration/discovery | Not replacement-oriented |
| PartSelect, RepairClinic, eReplacementParts, iFixit | Deep appliance-part catalogs, repair guides (US-centric) | Require the model number and text search; no photo entry; weak India coverage |
| Brand service centres / apps | Official parts | Hard to navigate; per-brand; no identification |

**Differentiation** = the pipeline, not the recognition:
photo → identification → **problem understanding** → **part terminology** →
**official-first sourcing** → **compatibility checklist** → **minimal follow-up** →
honest confidence. Plus (over time) a proprietary dataset of verified
"photo → exact part → fitted" outcomes that general assistants don't have.

## 24. Major technical and business risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| General AI assistants make this "good enough" for free | High | Win on structured workflow, parts depth in chosen categories, speed, and trust. Validate early (M0) whether users prefer our flow over asking ChatGPT. |
| Accuracy too low for exact model/part | Medium-High | Honest confidence, follow-up loop, categories with printed identifiers; golden-set eval gating every change. |
| Hallucinated links/prices/part numbers | Medium | Evidence contract + code-level validation; links only from tool results; nightly link checks on cached sources. |
| Low repeat usage (need is occasional) | High | Measure D30 retention; add "My things" + consumable reminders (filters, gaskets) to create repeat triggers; consider credits over subscription. |
| Official spare parts not sold online | Medium (India) | Show service-centre / brand support contact as a valid "where to get it"; third-party clearly labelled. |
| Cost per search too high for India pricing | Medium | Caching, research only on intent, affiliate revenue, credits. |
| Search result spam / counterfeit listings | Medium | Domain lists per pack, official-first ordering, blocked domains, "verify seller" warnings. |
| Liability for wrong/unsafe parts | Low-Medium | Safety-critical flag → official-only, disclaimers, never "CONFIRMED" without a manufacturer source. |
| Affiliate programme rules (e.g. link/price display rules, API access thresholds) | Medium | Read programme terms before launch; plain links until then. |
| Privacy incidents (sensitive photos) | Low-Medium | EXIF strip, PII flagging, retention, private storage. |

## 25. Validation strategy

### Phase 0 — Concierge test (1 week, no code)
Collect **40–60 real photos** from family/friends across the 6 categories (include broken
and unbranded items). Run each through Claude.ai (Pro) with the draft Stage A/B prompts.
Record: correct category / brand / model / part; useful source found? Would the person
have bought from it? **Go/no-go:** ≥50% "useful answer" in ≥4 categories.

### Phase 1 — Closed beta (4–6 weeks, 30–100 users)

| Question | Metric | Target to continue |
|---|---|---|
| Can users identify products? | % scans with 👍 "correct" or "partly" | ≥ 60% in core categories |
| Useful replacement parts? | % replacement scans with a clicked source | ≥ 30% |
| Exact vs lookalike | Precision of HIGH-confidence results (golden set + feedback) | ≥ 95% |
| Do users click sources? | source_clicked / result_viewed | ≥ 25% |
| Do they return? | D30 return rate; scans per user per month | ≥ 25%; ≥ 3 |
| Best categories | success rate & click-through per pack | Rank → expand top 2 |
| Strongest use cases | intent distribution × success × click | Prioritise |
| Worth paying for? | Pro waitlist conversion; interview "would you pay ₹X" | ≥ 5% of active users join waitlist |
| Follow-up loop | % info requests fulfilled; confidence lift after follow-up | ≥ 40% fulfilled |

Plus 10 user interviews (watch them use it on a real broken item).

## 26. Step-by-step development roadmap

Assumes ~10–15 hrs/week with AI-assisted development. Each milestone ends with
something testable.

| # | Milestone | What / why | Test | Likely problems |
|---|---|---|---|---|
| **M0** | Concierge validation + golden set | Prove answer quality before code; build ~150 labelled photos (≈25/category + unknowns) | Spreadsheet scoring | Collecting ground truth for model numbers (photograph labels too) |
| **M1** | Project setup | New Expo SDK 57 app (TypeScript), Supabase project, anonymous auth, env/secrets, CI lint/typecheck | App boots on web + Android dev build; anon session created | Expo SDK 57 API changes — read versioned docs first |
| **M2** | Capture & private upload | Camera/gallery, resize + EXIF strip, signed upload to private bucket, `scans` + `scan_images` rows | Upload a photo; verify no GPS in stored file; bucket not publicly readable | Web vs native image-picker differences; HEIC on iOS |
| **M3** | Stage A: Perceive + Result v1 | Worker Edge Function, Claude vision with structured output, confidence rules, result screen sections 1, 2, 8 | Golden-set run: category accuracy, OCR accuracy, no invented brands | Latency; schema-validation retries; timeouts |
| **M4** | Eval harness | Script that runs the golden set through the pipeline, scores fields, confidence calibration, hallucination checks, cost; Batch API for cheap runs | Baseline report committed; runs in < 30 min | Ground-truth labelling effort |
| **M5** | Stage B: Research + Where to get it | web_search/web_fetch, source classification, URL validation, `/r/:id` click tracking, caches | Links resolve; no model-invented URLs; official ranked first | Search noise, clone sites, prices missing |
| **M5b** | *(experiment)* Visual search | Google Lens via SerpApi for no-text scans | A/B on golden set unbranded subset | Extra vendor cost/terms |
| **M6** | Replacement + compatibility + category packs | Packs table + 6 packs, compatibility checks, follow-up loop (photos + measurements) | Golden-set replacement cases; INCOMPATIBLE cases never shown as compatible | Measurement UX; attribute extraction from product pages |
| **M7** | History, feedback, quotas, privacy controls | History screen, 👍/👎, quota ledger, spend kill switch, retention cron, delete-my-data | Quota enforced; purge job deletes images; delete-me works | RLS mistakes — write RLS tests |
| **M8** | Closed beta launch | Web link + Android internal testing, onboarding, analytics events, Pro waitlist fake door, Sentry | Dashboard shows §25 metrics | Recruiting users; support load |
| **M9** | Learn & decide | Analyse metrics, expand top categories, decide monetization experiment (affiliate tags first) | Decision memo | Ambiguous data → run interviews |

Rough timeline: M0 1 wk · M1–M3 2–3 wks · M4 1 wk · M5–M6 2–3 wks · M7 1 wk ·
M8–M9 4–6 wks beta.

### Testing strategy (quality is a feature)

**Golden dataset** (versioned, stored privately, never user photos without consent):

| Test group | Examples | Expected behaviour |
|---|---|---|
| Exact identification | Charger with label, remote with model no. | HIGH, correct model, official source |
| Similar products | Two bottle lines with near-identical lids | ≤ POSSIBLE/LIKELY with distinguishing features listed |
| Unknown products | Obscure industrial part | UNCONFIRMED + generic next steps, no invented brand |
| Damaged products | Cracked lid, snapped coupler | Component named correctly, replacement flow triggered |
| Replacement parts | Pressure-cooker gasket, RO filter | Correct part name + critical attributes |
| Multiple possible models | Same remote shell used across TV models | Multiple candidates + ask for label/back photo |
| Missing model numbers | Unlabelled charger brick | Asks for label/tip measurement; no guessed wattage |
| Poor-quality photos | Blur, dark, glare | Asks for retake; no confident answer |
| Different angles / partial | Only the lid, only the plug | Lower confidence, targeted photo request |
| Unbranded | Generic lunchbox | "Unbranded" stated; search keywords + measurements |
| Fake/incorrect search results | Seeded clone-site results (unit test with mocked tool output) | Blocked/labelled; never top-ranked |
| Incompatible parts | Candidate with mismatching diameter/wattage | INCOMPATIBLE, never "fits" |
| PII in photo | Label next to an address slip | PII warning, nothing sent to search |

**Automated checks per run:** field accuracy (category/brand/model/part), HIGH-precision,
calibration table (confidence vs correctness), hallucination checks (brand/model must
appear in `visible_text` evidence or a fetched source; every URL came from a tool
result and resolves), compatibility false-positive rate, cost and latency per scan.
**No prompt/model change ships if HIGH precision drops or hallucination checks fail.**

Plus: unit tests for confidence/compat rules and source classification; RLS tests;
manual device tests on low-end Android.

---

## Decisions needed from you before M1

1. **Launch market:** India-first (Amazon.in/Flipkart, ₹ pricing, Indian appliance brands)
   or global/US-first? *Recommendation: India-first, English UI.*
2. **Repository:** this repo currently contains *TryOn Studio*. Build the new app in a
   **fresh repo** (recommended — cleaner, no ads/RevenueCat baggage) or in a
   sub-folder here?
3. **Platform order:** web (PWA) + Android first, iOS later? *Recommended.*
4. **Name:** pick from §1 (or suggest another) — non-blocking.
5. **Budget ceiling** for API spend during beta (e.g. $100/month cap).
