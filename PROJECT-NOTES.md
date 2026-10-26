# Camp Landau, project notes

Internal notes for whoever edits this site next. Not deployed: `.assetsignore` keeps this file off the live site.

## Client Source of Truth

Only state facts listed here (or newly given by the client). Everything below is already on the live site.

- **Name:** Camp Landau
- **What:** summer camp, self-described as "Beit Shemesh's #1 summer camp" (client's own claim)
- **Who for:** English-speaking boys finishing grades 1 to 8
- **Where:** Sha'alei Torah, Nachal Sorek 16, Ramat Beit Shemesh
- **Camp Director:** Rabbi Yehoshua Landau, 02-999-6341, 052-760-0897
- **Mordy Landau** ("Papa Mo"): 058-675-8475
- **Email:** Camp@Camp-Landau.com
- **Activities:** sports, swimming, trips, Ruach, games, Color War, shtick, special surprises
- **Summer 2026:** daily clips run Sunday July 26 to Friday August 7
- **Summer 2027:** camp is back Sunday August 15, 2027 at 9:00 (the home countdown target, confirmed by the client)
- **Music:** original camp songs on Spotify (artist 5GvoGwRrTwcms4Vo4EOi9o) and 24six (artist 2650)
- **YouTube:** @camplandau9410
- **STG, See the Good:** daily Dan L'chaf Zechus video program, 7 episodes (August 2026)

### Settled with the client
- The countdown date (2027-08-15 09:00) is correct.
- "There will be no Color War this year" on the Color War card is a **deliberate running joke**, kept every year. Don't remove or "fix" it, and don't repeat it as a fact anywhere (llms.txt lists Color War as an activity).

## Direction

The site is meant to feel **fun and kid-like**, not corporate. Bright colors, emoji, caps and "SO MUCH MORE!!!" are the voice. Don't tone it down.

## Stack and deploy

- Plain HTML pages, CSS and JS inline per page. No build step.
- Hosted on **Cloudflare Workers static assets** (`wrangler.jsonc`, assets directory is the repo root). Pushing to `main` deploys automatically.
- Clean URLs: `/gallery`, `/clips`, `/see-the-good` (Cloudflare drops `.html`; linking to `gallery.html` costs a redirect).
- `.assetsignore` lists repo files that must not be served (`.git`, `wrangler.jsonc`, this file).
- `_headers`: one-week cache on `/img/*` and `/audio/*`, plus basic security headers on everything.
- Local preview with Cloudflare's real routing: `npx wrangler@4 dev`.

## Images

All images are self-hosted under `/img` as WebP sized for display. No page loads images from Google Photos, base44 or raw.githubusercontent.com any more (they were slow, and 33 Google Photos links had died).

- `img/logo.webp` (hero), `img/logo-sm.webp` (nav, footer), `img/hero-*.webp` (portrait crop for phones, landscape for wide screens), `img/about.webp`, `img/24six.webp`, `img/spotify.webp`, `img/stg-*.webp`, `img/simplysite.webp`.
- `og.jpg` (1200x630, under 200KB so WhatsApp shows it) is the share image for home, gallery and clips. See the Good keeps `stg-og.jpg`.

### Gallery
- The list lives in **`gallery-photos.js`**, shared by the home page (first 12) and `/gallery` (all). Newest first.
- Each id has `img/gallery/<id>-t.webp` (600x450 thumbnail) and `img/gallery/<id>.webp` (full, max 1400px).
- **Adding a photo:** download it, make the thumbnail as a 4:3 crop placed a third of the way down (faces survive better than a centered crop), WebP quality ~68; make the full size at 1400px max, quality ~76; name both with any unique 10-character id; add the id at the top of `gallery-photos.js`, and add an `<image:image>` line for the full-size file under `/gallery` in `sitemap.xml`.
- Existing ids are the first 10 hex characters of the SHA-1 of the photo's old Google Photos URL. 33 exact duplicates were dropped when the gallery moved here.
- A photo that fails to load is removed from the grid and the lightbox, so it never leaves a hole.

### Files kept on purpose
- `SimplySite.png`: older SimplySite logo. Other sites may hotlink it from raw.githubusercontent.com.
- `camp-landau-low-logo.jpg`: the old share image. Social platforms may still have it cached.
- `stg-0N-poster.jpg`: referenced as `thumbnailUrl` in See the Good's VideoObject data, already indexed by Google. Pages display the WebP copies.
- `spotify-icon.png`, `stg-logo.png`: originals of the WebP versions.

## Header (home page)

The hero shows the big logo, so the nav's logo is hidden while the hero logo is on screen (`nav.at-hero`, toggled by an IntersectionObserver on `.hero-logo` with a -68px top margin). It fades in once the hero logo has slid under the 68px nav bar, so the two logos never show together. A deep link into the page shows it straight away. While the phone menu is open, the nav takes its white scrolled look and shows its logo (`nav:has(.hamburger.open)`), so header and menu read as one panel. On phones the logo in the white bar is 46px. The other pages have no big hero logo and keep the nav logo throughout.

## Third parties

| Service | Where | Why |
|---|---|---|
| Google Fonts (Figtree, Inter) | all pages | type |
| YouTube (nocookie) | home videos, See the Good via Plyr | video |
| Plyr 3.7.8 (jsDelivr) | See the Good | custom player chrome over YouTube |
| Spotify embed | home, music section | built only when the section nears the screen |
| Google Drive | `/clips` players and downloads, See the Good downloads | daily clips |
| GitHub API | home songs list | lists `/audio` so a newly uploaded song appears by itself |
| Cloudflare Web Analytics | injected by Cloudflare | traffic stats |

**Songs:** the list comes from the GitHub contents API for `/audio`, and the files play from this site (`/audio/...`). GitHub allows 60 API calls an hour per network, so `index.html` has `SONGS_FALLBACK`. **When you add a song, add its file name there too.**

**See the Good players:** each Plyr player opens a ~1MB YouTube frame, so a player is built when its episode comes within 600px of the screen, never all seven on load.

## SEO and GEO

- Structured data: home has `WebSite` plus `SummerCamp` + `LocalBusiness` (address, phones, director, audience). Gallery is `ImageGallery`, clips is `CollectionPage`, See the Good has one `VideoObject` per episode and a `BreadcrumbList`.
- `sitemap.xml` uses clean URLs, lists every gallery photo as an image entry (the gallery is built by script), and lists the 7 See the Good episodes as video entries built from the page's VideoObject data. When an episode or photo is added, add it to the sitemap too and bump that page's `lastmod`. Submit `https://camp-landau.com/sitemap.xml` in Google Search Console (the site is already verified there).
- `llms.txt` summarizes the camp for AI answer engines. Keep it in step with the Source of Truth.
- `robots.txt` allows everyone. **Cloudflare's AI Crawl Control** still returns 403 to AI *training* crawlers (GPTBot, ClaudeBot, CCBot). Search and answer bots (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot, Applebot) get through. The client is turning this on in the Cloudflare dashboard.
- Every page has one `h1`, a `main` landmark, canonical, description and share tags.

## Known issues

- `/clips` is still heavy (about 7MB on a phone) because Google Drive's player is heavy. The real fix is hosting the daily clips on YouTube like See the Good.
- At 360px the home page measures 2px wide because the music cards slide in from the side. The body's `overflow-x:hidden` clips it, so nothing scrolls.
- See the Good's meta description is about 200 characters, so Google shows it cut.
