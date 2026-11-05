# PUBG: BATTLEGROUNDS — Fan Experience

A cinematic, responsive PUBG landing page built with Next.js App Router, React, TypeScript, Tailwind CSS 4, Framer Motion, and Lucide icons. All artwork and fonts are self-hosted. No API keys or database are required.

## Develop

Requires Node.js 20.9+ (validated with Node.js 24) and npm.

```sh
npm ci
npm run dev
```

The development server listens on port 3000. Use the existing checkout; each cloud task is already isolated, so there is no need to create a worktree.

## Validate and run production

```sh
npm run typecheck
npm run build
npm start
```

The build uses Next.js's supported Webpack compiler because the cloud sandbox restricts Turbopack's build-worker port. The page is statically prerendered; responsive images are optimized by Next.js at runtime.

## Browser checks

With the application running in a separate terminal:

```sh
# If system Chromium is unavailable, install Playwright's browser first:
npx playwright install chromium
npm test
```

Tests automatically use `/usr/bin/chromium` if present. Set `CHROMIUM_PATH` to use another browser installation, or `TEST_BASE_URL` to test another server port. Checks cover desktop interactions, modal focus trapping and restoration, map navigation, keyboard-accessible weapon tabs, article previews, trailer embedding, mobile navigation, reduced motion, and overflow at five viewport sizes.

## Content and behavior

- Four map detail views, a three-weapon showcase, and platform links to official stores.
- Native smooth scrolling, parallax, magnetic buttons, scroll reveals, a desktop cursor, and reduced-motion support.
- A privacy-enhanced YouTube trailer embed loads only when requested. Playback depends on YouTube connectivity and availability; an official trailers link is provided.
- News cards contain evergreen editorial introductions, with links to the official news hub rather than invented live announcements.
- Generated cinematic artwork represents the game's atmosphere; it is not an official game screenshot. The AKM and AWM now use generated studio-style product images alongside the M416. Weapon bars are explicitly illustrative relative ratings.
- Independent fan concept, not affiliated with KRAFTON. PUBG trademarks belong to their respective owners. Local fonts include their SIL Open Font License files in `public/fonts`.

## Publish to GitHub Pages

The GitHub Pages version works as static files, without a Node.js server:

```sh
npm run deploy:pages
```

This command builds with `/Pubg` as the base path, then publishes the `out/` contents to `gh-pages` using your existing Git authentication. It creates a temporary clone, preserves deployment history, and uses a normal push. The source checkout is kept intact. No personal token is stored in the script.

For the first publication, open the repository's **Settings → Pages**. Set **Source** to **Deploy from a branch**, then select **gh-pages** and **/(root)** and save. The expected address is **https://feelford.github.io/Pubg/** once GitHub completes deployment. Merely pushing a branch does not enable Pages; GitHub's settings must allow it.

To build without publishing, run `npm run build:pages`. All images have the correct project prefix; image optimization is disabled only for static export because GitHub Pages has no image server. The locally optimized WebP hero keeps the exported download small. The normal `npm run build` / `npm start` workflow remains available without a base path.

## Visual refinement after пабг1

The current unpublished refinement adds a separate cinematic squad scene, subtle scroll parallax, a thin reading-progress indicator, masked map reveals and expanding desktop map cards, realistic weapon imagery, and a draggable weapon showcase. Keyboard users can switch weapons with Left/Right and Home/End. Reduced-motion settings disable scene movement, map masking, and the custom cursor. Cursor movement uses isolated motion values, avoiding a render of the full page on every pointer event.

The `pubg1` Git tag and `/workspace/backups/pubg1.zip` remain the original restore point. Visual changes are not deployed by building or running tests. Only the explicit `npm run deploy:pages` command publishes to GitHub Pages.
