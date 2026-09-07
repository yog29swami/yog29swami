# TryOn Studio

A cross-platform (Android + iOS) virtual try-on app built with Expo/React Native.
Point the camera at yourself (or pick a photo), and see glasses, earrings, or a
necklace placed on your face/neck in real time, in any of several colors —
then save or share the result.

This project was scaffolded to be a **real, submittable app**, not a demo: it
has a working camera + face-detection pipeline, a product catalog, drag/pinch/
rotate fit adjustment, and monetization wired up (ads + subscription) so it
can generate passive income once published.

## How it works

1. **Capture or pick a photo** — `expo-camera` (front camera) or
   `expo-image-picker` (gallery).
2. **Detect the face** — `@react-native-ml-kit/face-detection` runs Google
   ML Kit on-device against the photo and returns eye/ear/nose landmarks plus
   head tilt.
3. **Place the item** — `src/utils/overlayGeometry.ts` turns those landmarks
   into a size/position/rotation for the selected product category
   (glasses, earrings, necklace). Items are drawn procedurally with
   `react-native-svg` (see `src/components/overlays/`), so every color
   variant renders instantly with no image assets to manage.
4. **Fine-tune** — `src/components/DraggableOverlay.tsx` (gesture-handler +
   reanimated) lets the user pan/pinch/rotate the whole outfit as one rigid
   group, in case detection doesn't line up perfectly.
5. **Save/share** — `react-native-view-shot` flattens the photo + overlay
   into a JPEG, saved via `expo-media-library` or shared via `expo-sharing`.

## Project structure

```
App.tsx                     App entry: providers + store hydration
src/
  screens/                  Onboarding, Home, Catalog, TryOn, Paywall, Settings
  components/               Reusable UI (ProductCard, ColorSwatch, AdBanner, ...)
  components/overlays/      Procedural SVG glasses/earring/necklace renderers
  data/products.ts          Product catalog (edit this to add real products)
  services/
    faceDetection.ts        ML Kit wrapper
    purchases.ts            RevenueCat wrapper (subscriptions)
    storage.ts               AsyncStorage persistence (favorites, pro status)
  state/store.ts             Zustand global store
  config/env.ts               API keys / ad unit IDs — fill these in before release
  navigation/                React Navigation stack
  utils/overlayGeometry.ts   Landmark -> on-screen placement math
```

## Running it locally

This app uses native modules (camera, ML Kit face detection, ads, in-app
purchases), so it **cannot run inside Expo Go** — you need a custom
development client.

```bash
npm install

# Generates native ios/ and android/ projects
npx expo prebuild

# Run on a connected device/emulator (needs Android Studio / Xcode installed)
npm run android
npm run ios

# Once a dev client is installed on the device, subsequent iterations:
npm start
```

Or skip local native tooling entirely and build in the cloud with
[EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build --profile development --platform android   # or ios
```

`eas.json` already defines `development`, `preview`, and `production`
profiles.

### Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
```

Both are currently clean. Metro bundling has also been verified
(`npx expo export`) to make sure every import resolves.

## Before you publish

1. **Branding** — replace `assets/icon.png`, the adaptive icon layers, and
   `assets/splash-icon.png` with real artwork. Update `app.json` → `name`,
   `slug`, `ios.bundleIdentifier`, `android.package`.
2. **Ads** — `app.json` and `src/config/env.ts` currently use Google's
   public **test** AdMob app/unit IDs. Create a real AdMob app, then swap
   in your own IDs (`react-native-google-mobile-ads` requires a native
   rebuild after changing `app.json`).
3. **Subscriptions** — create a RevenueCat project, add your iOS/Android
   API keys to `src/config/env.ts`, and configure an entitlement called
   `pro` with a subscription product in App Store Connect / Play Console.
   Until you do this, the app runs in free-tier-only mode automatically
   (no crashes — `purchasePro()` just returns a friendly message).
4. **Legal** — a real Privacy Policy & Terms of Service page for this app
   lives at `legal/index.html` (`ENV.legalUrl` in `src/config/env.ts`
   currently points at a hosted copy of it). Before you submit:
   - Open the file and replace `REPLACE_WITH_YOUR_SUPPORT_EMAIL` (two spots)
     with a real support address.
   - Host it somewhere permanent and public — the simplest option is GitHub
     Pages on this repo: Settings → Pages → deploy from the `legal/` folder
     (or its own branch), which gives you a stable `https://<user>.github.io/...`
     URL. Then update `ENV.legalUrl` to point at it and rebuild.
   - The Play Console's Privacy Policy field needs a URL that's publicly
     reachable *without login* — double check that before submitting.
5. **Catalog** — `src/data/products.ts` has 10 placeholder styles. Add
   more, or adjust `baseScale`/colors, without touching any screen code.
6. **On-device testing** — I was not able to run this on a physical
   device/simulator in this environment. I verified: TypeScript compiles
   clean, ESLint is clean, and Metro successfully bundles the whole app
   (1640 modules) with no resolution errors. You should still do a full
   on-device pass (try-on accuracy, permission prompts, save/share flow)
   before submitting to the stores.

## The passive-income plan

- **Freemium model**: everyone can try on every item for free; free users
  see a small watermark on saved/shared photos and a banner ad on Home.
  Pro (`$4.99/mo`, configurable in RevenueCat) removes both and unlocks a
  few premium styles.
- **Virality loop**: the Share button is the main growth engine — every
  shared photo carries the watermark, which is free marketing. Prioritize
  making that photo look good.
- **Low operating cost**: everything runs on-device (ML Kit face detection
  needs no server, no per-request cost), so margins stay high as you scale
  users — the two ongoing costs are the Apple/Google developer accounts
  ($99/yr + $25 one-time) and your RevenueCat/AdMob accounts (both free
  up to meaningful volume).
- **Next milestones**, roughly in order of leverage:
  1. Get it building and tested on a real device via `eas build --profile development`.
  2. Replace placeholder branding/copy, add 15-20 real, well-designed try-on
     items (or license a small photo/PNG pack for higher-fidelity items).
  3. Submit to TestFlight + Play internal testing, gather feedback.
  4. Launch, then iterate on ASO (App Store keywords/screenshots) and the
     paywall copy — those two levers matter more than new features early on.
