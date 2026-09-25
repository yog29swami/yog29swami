#!/usr/bin/env python3
"""Score the M0 concierge-validation sheet and print a go / no-go verdict.

Usage:  python3 score.py case-plan.csv
(Export from Google Sheets as CSV first if you edited it there.)
Only rows with a `useful` score are counted as run.
"""
import csv
import sys
from collections import defaultdict

PACKS = ["chargers_cables", "bottles_lunchboxes", "kitchen_appliance_parts",
         "remote_controls", "appliance_consumables_knobs", "batteries_bulbs"]
ABSTAIN_SCENARIOS = {"poor", "unknown"}
MIN_PER_CATEGORY = 5

USEFUL_RATE_BAR = 0.50
USEFUL_CATEGORIES_BAR = 4
HALLUCINATION_BAR = 0.05
HIGH_PRECISION_BAR = 0.90
ABSTENTION_BAR = 0.70


def val(row, key):
    return (row.get(key) or "").strip().lower()


def rate(num, den):
    return f"{num}/{den} ({num / den:.0%})" if den else "n/a"


def is_wrong(row):
    return (val(row, "hallucination") == "y"
            or val(row, "brand_result") == "wrong"
            or val(row, "model_result") == "wrong"
            or val(row, "category_ok") == "n")


def high_is_correct(row):
    return not is_wrong(row) and val(row, "model_result") in ("correct", "na")


def fails_safely(row):
    """Poor/unknown photo: must not be wrong, and must not claim HIGH/LIKELY unless right."""
    if is_wrong(row):
        return False
    return val(row, "confidence") in ("possible", "unconfirmed") or high_is_correct(row)


def main(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        rows = [r for r in csv.DictReader(f) if val(r, "useful") not in ("", "na")]
    if not rows:
        sys.exit("No scored rows yet (fill in the `useful` column).")

    by_cat = defaultdict(list)
    for r in rows:
        by_cat[val(r, "category")].append(r)

    print(f"Scored cases: {len(rows)}\n")
    print(f"{'category':30} {'n':>3} {'useful>=2':>12} {'halluc.':>10} {'brand ok':>10} {'model ok':>10}")
    passing = []
    for cat in PACKS + ["generic"]:
        rs = by_cat.get(cat, [])
        if not rs:
            print(f"{cat:30} {0:>3}  (no cases)")
            continue
        useful = sum(int(val(r, "useful")) >= 2 for r in rs)
        hall = sum(val(r, "hallucination") == "y" for r in rs)
        b = [r for r in rs if val(r, "brand_result") in ("correct", "wrong", "abstained")]
        m = [r for r in rs if val(r, "model_result") in ("correct", "wrong", "abstained")]
        b_ok = sum(val(r, "brand_result") == "correct" for r in b)
        m_ok = sum(val(r, "model_result") == "correct" for r in m)
        flag = "" if len(rs) >= MIN_PER_CATEGORY else "  <- too few cases"
        print(f"{cat:30} {len(rs):>3} {useful / len(rs):>12.0%} {hall / len(rs):>10.0%} "
              f"{(b_ok / len(b) if b else 0):>10.0%} {(m_ok / len(m) if m else 0):>10.0%}{flag}")
        if cat in PACKS and len(rs) >= MIN_PER_CATEGORY and useful / len(rs) >= USEFUL_RATE_BAR:
            passing.append(cat)

    hall_n = sum(val(r, "hallucination") == "y" for r in rows)
    high = [r for r in rows if val(r, "confidence") == "high"]
    high_ok = sum(high_is_correct(r) for r in high)
    abst = [r for r in rows if val(r, "scenario") in ABSTAIN_SCENARIOS]
    abst_ok = sum(fails_safely(r) for r in abst)

    def conf_row(level):
        rs = [r for r in rows if val(r, "confidence") == level]
        return rate(sum(not is_wrong(r) for r in rs), len(rs))

    print("\nConfidence calibration (not wrong / total):")
    for level in ("high", "likely", "possible", "unconfirmed"):
        print(f"  {level.upper():12} {conf_row(level)}")

    print("\nOther signals:")
    for label, key, yes in [("Official source found", "official_found", ("y", "none_exists")),
                            ("Working buy link", "buy_link_ok", ("y",)),
                            ("Compatibility honest/right", "compat_ok", ("y",)),
                            ("Follow-up request right", "followup_asked_ok", ("y",)),
                            ("Owner would buy", "would_buy", ("y",))]:
        rs = [r for r in rows if val(r, key) not in ("", "na")]
        print(f"  {label:28} {rate(sum(val(r, key) in yes for r in rs), len(rs))}")
    lift = [r for r in rows if val(r, "followup_lift") not in ("", "na")]
    print(f"  {'Follow-up improved answer':28} {rate(sum(val(r, 'followup_lift') == 'up' for r in lift), len(lift))}")
    mins = [float(val(r, "minutes")) for r in rows if val(r, "minutes").replace(".", "", 1).isdigit()]
    if mins:
        print(f"  {'Avg minutes per case':28} {sum(mins) / len(mins):.1f}")

    comp = [r for r in rows if val(r, "compare") == "yes"]
    lens = [r for r in comp if val(r, "lens_useful").isdigit()]
    gpt = [r for r in comp if val(r, "chatgpt_useful").isdigit()]
    lens_win = sum(int(val(r, "useful")) >= int(val(r, "lens_useful")) for r in lens)
    gpt_win = sum(int(val(r, "useful")) >= int(val(r, "chatgpt_useful")) for r in gpt)
    print("\nVersus alternatives (ours >= theirs):")
    print(f"  Google Lens      {rate(lens_win, len(lens))}")
    print(f"  ChatGPT/Gemini   {rate(gpt_win, len(gpt))}")

    checks = [
        (f"Useful >= {USEFUL_RATE_BAR:.0%} in >= {USEFUL_CATEGORIES_BAR} categories",
         len(passing) >= USEFUL_CATEGORIES_BAR, f"{len(passing)} passing: {', '.join(passing) or '-'}"),
        (f"Hallucination <= {HALLUCINATION_BAR:.0%}",
         hall_n / len(rows) <= HALLUCINATION_BAR, rate(hall_n, len(rows))),
        (f"HIGH precision >= {HIGH_PRECISION_BAR:.0%}",
         not high or high_ok / len(high) >= HIGH_PRECISION_BAR, rate(high_ok, len(high))),
        (f"Fails safely on poor/unknown >= {ABSTENTION_BAR:.0%}",
         not abst or abst_ok / len(abst) >= ABSTENTION_BAR, rate(abst_ok, len(abst))),
        ("Beats or ties alternatives in most compared cases",
         (not lens or lens_win / len(lens) > 0.5) and (not gpt or gpt_win / len(gpt) > 0.5),
         f"Lens {rate(lens_win, len(lens))}, ChatGPT/Gemini {rate(gpt_win, len(gpt))}"),
    ]
    print("\nGo / no-go checks:")
    for name, ok, detail in checks:
        print(f"  [{'PASS' if ok else 'FAIL'}] {name}: {detail}")

    useful_ok, trust_ok, alt_ok = checks[0][1], all(c[1] for c in checks[1:4]), checks[4][1]
    if useful_ok and trust_ok and alt_ok:
        verdict = "GO - start M1 with the passing categories."
    elif useful_ok:
        verdict = "GO WITH CHANGES - fix prompts for the failing checks, re-run those cases."
    else:
        verdict = "RETHINK - discuss narrowing or pivoting before writing code."
    print(f"\nVERDICT: {verdict}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "case-plan.csv")
