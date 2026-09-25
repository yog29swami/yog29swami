# Prompt 2 — Stage B: Research (draft v0.1)

Paste **everything inside the code block** into the **same chat**, right after the Stage A
reply. Web search must be **on** in Claude.ai.

In the app this becomes the Stage B call (Sonnet with `web_search` + `web_fetch`, search
limit 4–6). In M0 we can't enforce a search limit, so just note roughly how many searches
it ran (Claude.ai shows them).

```text
Now do the research step for the item you just analysed. The user is in India.

GOAL
Using your Stage A JSON above, help the user with their intent: identify it exactly,
and if they need a replacement, part, accessory, manual or seller, find it.

SEARCH ORDER (stop once you have enough for the intent)
1. Exact model number / part number from the photo.
2. Brand + product line + component name.
3. Brand + distinguishing features.
4. Category + physical characteristics + the correct part terminology.
5. The manufacturer's official website: spare parts, accessories, support or
   service-centre pages. Open the page to verify model/part numbers and compatibility.
6. Official manuals or spec sheets.
7. Reputable Indian marketplaces and brand stores (e.g. Amazon.in, Flipkart, the brand's
   own store), then other sellers only if needed.
Never put personal information or serial numbers into a search.

STRICT RULES
- Links: only give URLs that appeared in your search results or pages you opened. Never
  build or guess a URL.
- Prices: only if shown on a page you opened; give the page, the price in ₹ and say
  "seen today, verify on site". Never estimate a price.
- Part / model numbers, specs and compatibility: only from the photo (Stage A evidence) or
  a source page you cite. Otherwise say it is not confirmed.
- Classify every source: official (manufacturer), authorized (authorised
  dealer/service centre), marketplace, third_party (non-original compatible part
  or seller), info (manual, forum, article).
- Order where_to_get_it: official → authorized → marketplace → third_party.
- Compatibility is NOT the same as looking similar. For each candidate replacement, check
  the attributes that must match (e.g. diameter, thread, connector, voltage/wattage,
  tip size, teeth/shape of a coupler, bulb base, model list). Status per attribute:
  match | mismatch | unknown, with its basis: manufacturer_list | spec_match |
  user_measurement | visual_estimate. A visual_estimate never counts as a match.
- Overall compatibility: CONFIRMED only if the manufacturer or an authorised source lists
  the user's model; LIKELY only if every critical attribute matches on a spec or
  measurement basis; otherwise UNKNOWN (say "Compatibility could not be confirmed.");
  INCOMPATIBLE if any critical attribute mismatches.
- Safety-critical parts (pressure-cooker gaskets/valves/whistles, chargers and power
  adapters, gas-stove parts): recommend original/certified parts; mark any third-party
  option with a warning.
- You may LOWER the Stage A confidence based on what you found, and you may raise it only
  if a cited source confirms the exact model/part.
- If you can't confirm an exact replacement, give: the closest candidates, what must be
  checked, copy-able search keywords, and the minimum extra photos or measurements needed.

Respond with ONLY this JSON:

{
  "final_identification": {
    "title": "", "brand": null, "model": null, "part_number": null,
    "confidence": "HIGH | LIKELY | POSSIBLE | UNCONFIRMED",
    "confidence_reason": "",
    "evidence": [ { "type": "visible_text | visual_feature | source", "detail": "", "source_url": null } ]
  },
  "what_you_may_need": {
    "component_name": "", "synonyms": [],
    "replaceable": "yes | service_only | unknown",
    "official_available": "yes | no | unknown",
    "notes": ""
  },
  "candidates": [
    {
      "rank": 1, "kind": "product | component | replacement | accessory",
      "name": "", "brand": null, "model": null, "part_number": null,
      "official_or_third_party": "official | third_party | unknown",
      "confidence": "", "why": "", "how_to_tell_apart": "",
      "compatibility": {
        "overall": "CONFIRMED | LIKELY | UNKNOWN | INCOMPATIBLE",
        "checks": [ { "attribute": "", "required": "", "observed": "", "status": "", "basis": "" } ],
        "message": ""
      }
    }
  ],
  "where_to_get_it": [
    { "url": "", "domain": "", "source_type": "", "title": "", "price_inr": null, "note": "" }
  ],
  "product_information": { "specs": [], "manuals": [], "support": [] },
  "need_more_information": [ { "kind": "", "request": "", "why": "" } ],
  "search_keywords": [],
  "warnings": [],
  "searches_run": 0
}
```

## Change log
| Date | Change | Why (case IDs) |
|---|---|---|
| 2026-09-25 | v0.1 initial draft | — |
