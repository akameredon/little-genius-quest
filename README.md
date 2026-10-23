# Little Genius Quest

A mobile-first, installable Progressive Web App (PWA) learning game for children ages 4–6.

## Included
- Five learning worlds: Math, Reading, Science, Logic, and Emotions
- 25 starter questions with hints and friendly feedback
- Stars and points
- Parent area protected by a demo PIN
- Local progress persistence using `localStorage`
- Web app manifest, app icon, and service worker for offline app-shell caching
- Responsive touch-friendly design

## Run locally
Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build for hosting

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`. Deploy the contents of `dist/` to a static host that supports HTTPS, such as GitHub Pages, Netlify, or Vercel. The app must be served over HTTPS (or localhost during development) for install/offline capabilities.

## Install on a phone/tablet
- **iPhone/iPad:** open the hosted site in Safari → Share → Add to Home Screen → Add.
- **Android:** open the hosted site in Chrome → menu → Install app / Add to Home screen.

The app is designed for portrait phone/tablet use. It can also run in a desktop browser.

## Parent area
The prototype parent PIN is `2468` so you can test the parent dashboard. **Change this before public use.** This client-side PIN is a convenience gate, not strong security. A production app should use a stronger parental gate and secure account controls if needed.

## Privacy and limitations
- No account or backend is required.
- Progress is stored locally in the browser on that device.
- Clearing browser data can erase saved progress.
- The starter app does not send child data to a server.
- Offline support caches the app shell and same-origin assets; first launch requires internet and external font loading may not be available offline.
- The current difficulty selector is a preference placeholder. Questions are fixed in this starter version; adaptive difficulty, audio narration, and synced multi-device profiles are not implemented.

## Suggested next steps
1. Deploy to HTTPS and test install on real iOS and Android devices.
2. Replace the demo parent PIN gate with a production-grade parental gate.
3. Add optional spoken instructions, reduced-motion settings, and more question packs.
4. Add automated tests and accessibility review.
