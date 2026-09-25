# M0 — Concierge Validation (1 week, no code)

**Goal:** before building anything, find out whether the core answer — *photo → what
exactly is it → what part do I need → where do I get it, with honest confidence* — is
good enough, **in India, for our 6 launch categories**, using the exact prompts the app
will use.

**Cost:** ₹0 extra (uses your Claude Pro plan). The $100/month API cap applies from M1
onwards.

**Output of M0:**
1. A go / no-go decision (and which categories to keep or cut).
2. **~60 labelled photos** — this becomes the first version of the *golden set* the app
   is tested against in M4 onwards.
3. Tuned Stage A / Stage B prompts, ready to move into code in M3/M5.
4. Evidence on the biggest risk: *is this clearly better than just using Google Lens or
   ChatGPT?*

## What's in this folder

| File | Use it for |
|---|---|
| [`photo-collection-guide.md`](photo-collection-guide.md) | What to photograph, how, from whom, and how to record the ground truth |
| [`case-plan.csv`](case-plan.csv) | 60 pre-numbered cases (category × scenario). Fill in as you go. Opens in Google Sheets / Excel. |
| [`prompts/stage-a-perceive.md`](prompts/stage-a-perceive.md) | Prompt 1: paste into Claude.ai together with the photo |
| [`prompts/stage-b-research.md`](prompts/stage-b-research.md) | Prompt 2: paste into the same chat to run web research |
| [`scoring-rubric.md`](scoring-rubric.md) | How to fill in each scoring column, with examples |
| [`score.py`](score.py) | Reads your filled sheet, prints per-category results and the go/no-go verdict |
| [`interview-script.md`](interview-script.md) | 5 short conversations with the people who gave you photos |

## Day-by-day plan

| Day | Do | Time |
|---|---|---|
| 1 | Read the photo guide. Photograph ~20 items at home. Message 5–10 family members/friends (WhatsApp template in the guide) asking for photos of broken/lost/unknown items. | 1.5 h |
| 2–3 | Collect the rest until every row in `case-plan.csv` has a photo. Record the **ground truth** for each (from the label, box, invoice or owner). | 2 h |
| 3–5 | Run each case: fresh Claude.ai chat → Prompt 1 + photo → Prompt 2 → score the row. ~5 min per case. | 5 h |
| 5 | For the 12 cases marked `compare=yes`, also try Google Lens and ChatGPT or Gemini with a plain question, and score those. | 1 h |
| 6 | Do the 5 short interviews. Run `python3 score.py case-plan.csv`. | 1.5 h |
| 7 | Review together: paste the `score.py` output and your notes into this chat. We'll decide go/no-go and tune the prompts. | 30 min |

## How to run one case (exact steps)

1. Open a **new chat** in Claude.ai (one chat per case — never reuse, so earlier cases
   don't leak in). Pick **Sonnet** in the model picker if available (it's the model the
   app will use), and turn **web search on**. Record the model name in the sheet.
2. Paste the whole of **Prompt 1** (`stage-a-perceive.md`, the part inside the code
   block). Fill in the `USER_TEXT` / `INTENT` lines exactly as written in the case row.
   Attach the photo(s). Send.
3. Save the JSON reply into the case folder as `CASEID-a.json` (optional but useful).
4. Paste **Prompt 2** (`stage-b-research.md`) into the **same chat**. Send.
5. Save the reply as `CASEID-b.json`.
6. **Open every link** it gives and check it. Then fill in the scoring columns using
   [`scoring-rubric.md`](scoring-rubric.md).
7. If it asked for more information (another photo or a measurement) **and** the item is
   at hand, provide it in the same chat ("Here is the photo of the bottom.") and score the
   follow-up in the `followup_*` columns.

Don't fix or hint at the answer. We're measuring what a real user would get.

## Go / no-go criteria

`score.py` checks these automatically:

| Check | Bar | Why |
|---|---|---|
| Useful answer rate (score ≥ 2 of 3) | **≥ 50% in at least 4 of the 6 categories** | The product has to be worth opening |
| Hallucinations (invented brand/model/part no./price/link) | **≤ 5% of cases overall** | Trust is the product |
| HIGH-confidence precision | **≥ 90%** of HIGH answers correct | "High confidence" must mean it |
| Appropriate abstention | On "unknown / poor photo" cases, **≥ 70%** say they aren't sure and ask for the right thing | Fail safely |
| Better than alternatives | On `compare=yes` cases, ours useful **≥** Lens and **≥** ChatGPT/Gemini in most cases | Biggest business risk |

**Outcomes:**
- **Go**: all bars met → start M1 with the categories that passed.
- **Go with changes**: useful rate passes but hallucination/abstention fails → we fix the
  prompts (usually the evidence rules), re-run the failing cases, then go.
- **Rethink**: useful rate fails in most categories, or alternatives win clearly → we
  discuss narrowing (e.g. kitchen-appliance parts only) or pivoting *before* writing
  code.
