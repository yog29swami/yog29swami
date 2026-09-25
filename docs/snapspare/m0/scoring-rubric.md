# Scoring rubric (M0)

Score each row of `case-plan.csv` **after** opening every link the AI gave. Leave a cell
empty only if it doesn't apply; `score.py` treats empty/`na` as "not applicable".

| Column | Values | How to decide |
|---|---|---|
| `model_used` | e.g. `sonnet` | Model shown in Claude.ai |
| `category_ok` | `y` / `n` | Did Stage A pick the right `category_pack`? (For GEN cases, `generic` is correct unless it clearly fits a pack.) |
| `component_ok` | `y` / `n` / `na` | Correct name for the part the user cares about (synonyms OK)? |
| `brand_result` | `correct` / `wrong` / `abstained` / `na` | `na` if truth brand is `unknown` **and** it abstained. `abstained` = left null or said not confirmed. |
| `model_result` | `correct` / `wrong` / `abstained` / `na` | Same, for model **or** part number (whichever the case is about). "Family correct but exact model not claimed" = `abstained`. |
| `confidence` | `HIGH` / `LIKELY` / `POSSIBLE` / `UNCONFIRMED` | From Stage B `final_identification` |
| `hallucination` | `y` / `n` | **Any** invented brand, model, part number, spec, price, seller or link (link doesn't exist, or page doesn't show what was claimed). One is enough for `y`. Note which in `notes`. |
| `official_found` | `y` / `n` / `none_exists` / `na` | Found the manufacturer's page/spare part, or correctly said none is sold online |
| `buy_link_ok` | `y` / `n` / `na` | At least one link that actually sells the right item (or a correctly labelled compatible one) |
| `compat_ok` | `y` / `n` / `na` | Compatibility verdict was right **and** honest. Saying "could not be confirmed" when it really couldn't = `y`. Calling a mismatching part compatible = `n`. |
| `followup_asked_ok` | `y` / `n` / `na` | If it asked for more info: was it the right, minimal thing? If it didn't ask but should have = `n`. |
| `followup_lift` | `up` / `same` / `down` / `na` | After you supplied what it asked for, did the answer get better? |
| `useful` | `0` / `1` / `2` / `3` | **The key score.** Put yourself in the owner's shoes: 0 = wrong or misleading · 1 = right direction but I'd still have to search a lot · 2 = I could act on this (buy/search/ask a shop) · 3 = exactly what I needed |
| `would_buy` | `y` / `n` / `unsure` / `na` | Ask the owner: would they buy from a link it gave? |
| `minutes` | number | Rough time to run the case |
| `lens_useful` | `0`–`3` / blank | Only for `compare=yes`: Google Lens on the same photo, same 0–3 scale |
| `chatgpt_useful` | `0`–`3` / blank | Only for `compare=yes`: ChatGPT or Gemini with the photo + the user's words in plain language (no special prompt) |
| `notes` | text | What went wrong/right; what the prompt should change |

## Examples

- Kids' bottle, truth = Milton Kool Kid 500 ml. AI says "Milton (logo read), model not
  confirmed, POSSIBLE", asks for the base photo, links Milton's site and an Amazon.in
  listing for Kool Kid lids with "compatibility could not be confirmed" →
  `brand_result=correct`, `model_result=abstained`, `hallucination=n`, `compat_ok=y`,
  `followup_asked_ok=y`, `useful=2`.
- Charger, truth = Dell 65 W 4.5 mm tip. AI says "Dell 90 W, 7.4 mm, HIGH" without reading
  it from the label → `model_result=wrong`, `hallucination=y`, `useful=0`.
