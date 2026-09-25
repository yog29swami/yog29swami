# Photo collection guide (M0)

## Target: 60 cases

| Code | Category | Cases | Indian examples to look for |
|---|---|---|---|
| CHG | Chargers, adapters & cables | 10 | Laptop bricks (Dell/HP/Lenovo barrel tips), phone chargers (Samsung/Mi/OnePlus/Apple), USB-C PD chargers, unbranded cables |
| BTL | Bottles, flasks & lunchboxes | 10 | Milton, Cello, Borosil, Signoraware, Tupperware, Nayasa, kids' sipper bottles, steel flasks, broken lids/straws/seals |
| KIT | Kitchen-appliance parts | 10 | Mixer-grinder couplers/jars/blades (Preethi, Prestige, Bajaj, Philips, Sujata, Butterfly), pressure-cooker gaskets/whistles/safety valves (Prestige, Hawkins, Pigeon), kettle lids |
| RMT | Remote controls | 8 | TV (Samsung, LG, Sony, Mi), AC (Voltas, Daikin, LG, Blue Star), set-top box (Tata Play, Airtel) |
| APL | Appliance consumables & knobs | 8 | RO filters/candles (Kent, Aquaguard, Pureit), chimney filters, vacuum filters, washing-machine/gas-stove knobs |
| BAT | Batteries & bulbs | 6 | Coin cells (CR2032/CR2025), AA/AAA, 9V, LED bulbs (B22/E27), tube lights, torch bulbs |
| GEN | Outside our categories / unknown | 8 | Furniture cam-lock, random screw, toy part, car accessory, plumbing fitting, "no idea what this is" |

Within each category, `case-plan.csv` asks for a **mix of scenarios** so we test the
hard cases, not just easy ones:

| Scenario code | Meaning | What to shoot |
|---|---|---|
| `labelled` | Label/model no. visible | Photo that includes the label |
| `no_label` | Same kind of item, label hidden or absent | Main view only, label not visible |
| `broken` | Damaged/broken part, user wants replacement | Show the damage |
| `missing` | Part is lost; photo of the product it belongs to | Product without the part |
| `partial` | Only part of the item / odd angle | Close-up of one end, side view |
| `poor` | Blurry, dark, glare, cluttered background | Deliberately imperfect (but real-life) |
| `lookalike` | One of 2+ similar models | The item; ground truth notes what the lookalike is |
| `unbranded` | Generic/no-brand item | As is |
| `unknown` | Owner doesn't know what it is | As is |

## How to photograph (the "real user" shot)

- Use a phone camera, normal lighting, **no special setup** — we want realistic photos.
- One main photo per case. Keep extra photos (label, underside, with a ruler) in the
  same folder **but don't attach them unless the AI asks** (that tests the follow-up loop).
- **Also always photograph the label/box/invoice separately** for ground truth, even if
  it isn't shown to the AI.

## Recording ground truth (important!)

For each case, fill in these columns in `case-plan.csv` **before** running the AI:

- `truth_item` — what it is in plain words ("sipper lid for kids' bottle")
- `truth_brand`, `truth_model`, `truth_part` — from the label/box/invoice/owner.
  Write `unknown` if even the owner doesn't know (that's fine — then score only
  category/component and honesty).
- `truth_source` — where the truth came from: `label`, `box`, `invoice`, `owner`,
  `manufacturer_site`.
- `user_text` / `intent` — what the owner actually wants, in their words
  ("the lid broke, need a new one").

## Privacy and consent

- Ask permission; tell people photos are used only for testing this idea, stored
  privately, and deleted on request.
- Crop out or avoid **faces, addresses, bills with names, phone screens, documents**.
- If a label shows a **serial number**, that's fine for ground truth but don't paste it
  into prompts yourself.
- Store photos in a private folder (e.g. Google Drive, not shared), named `CASEID.jpg`,
  `CASEID-label.jpg`, `CASEID-extra1.jpg`. **Don't commit photos to GitHub.**

## WhatsApp message template

> Hi! I'm testing an app idea: you take a photo of something (a broken part, a lost lid,
> a charger, a remote, anything you don't know the name of) and it tells you exactly what
> it is and where to get a replacement.
>
> Could you send me 2–3 photos of such things at your home? Ideally something broken or
> missing a part, or something you don't know the name of. Please also tell me:
> (1) what you'd want to know or buy, and (2) the brand/model if you know it (a photo of
> the label or box helps).
>
> Photos are only for testing and I'll delete them whenever you want. Thanks! 🙏
