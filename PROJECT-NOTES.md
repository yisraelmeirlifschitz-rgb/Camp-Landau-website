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
- **Summer 2026:** camp days ran Sunday July 26 to Friday August 7
- **Summer 2027:** camp is back Sunday August 15, 2027 at 9:00 (the home countdown target, confirmed by the client)
- **Music:** original camp songs on Spotify (artist 5GvoGwRrTwcms4Vo4EOi9o) and 24six (artist 2650)
- **YouTube:** @camplandauRBS (channel UCSWhIE838GQKOFuzxCQY_uQ). The old link, @camplandau9410, is dead (404), so don't use it.
- **Other YouTube channels with camp videos:** @STG-landau (See the Good), and the videographer Aryeh Rothenberg's @aryehrothenberg6554 (Highlights 2025, Color War 2025, 25 Years of Camp Landau song). "Camp Landau - Topic" (UCqwyAmEKgm2smBQ2U0_59Xg) is YouTube's auto-made music channel.
- **STG, See the Good:** daily Dan L'chaf Zechus video program, 7 episodes (August 2026)

### Settled with the client
- The countdown date (2027-08-15 09:00) is correct.
- "There will be no Color War this year" on the Color War card is a **deliberate running joke**, kept every year. Don't remove or "fix" it, and don't repeat it as a fact anywhere (llms.txt lists Color War as an activity).

## Direction

The site is meant to feel **fun and kid-like**, not corporate. Bright colors, emoji, caps and "SO MUCH MORE!!!" are the voice. Don't tone it down.

## Stack and deploy

- Plain HTML pages, CSS and JS inline per page. No build step.
- Hosted on **Cloudflare Workers static assets** (`wrangler.jsonc`, assets directory is the repo root). Pushing to `main` deploys automatically.
- Clean URLs: `/gallery`, `/videos`, `/music`, `/see-the-good` (Cloudflare drops `.html`; linking to `gallery.html` costs a redirect).
- `_redirects`: old addresses sent for good (301) to their replacement. `/clips` goes to `/videos`, `/stg` to `/see-the-good`. Cloudflare reads it; it is not served.
- `404.html` is the not-found page (`"not_found_handling": "404-page"` in `wrangler.jsonc`), with a real 404 status and links to every page. It is `noindex`.
- `.assetsignore` lists repo files that must not be served (`.git`, `wrangler.jsonc`, this file).
- `_headers`: one-week cache on `/img/*` and `/audio/*`, plus basic security headers on everything.
- Local preview with Cloudflare's real routing: `npx wrangler@4 dev`.

## Images

All images are self-hosted under `/img` as WebP sized for display. No page loads images from Google Photos, base44 or raw.githubusercontent.com any more (they were slow, and 33 Google Photos links had died).

- `img/logo.webp` (hero), `img/logo-sm.webp` (nav, footer), `img/hero-*.webp` (portrait crop for phones, landscape for wide screens), `img/about.webp`, `img/24six.webp`, `img/spotify.webp`, `img/stg-*.webp`, `img/simplysite.webp`.
- `img/videos/<youtube id>.webp` (960x540) and `<id>-sm.webp` (480x270): video thumbnails, made from YouTube's own. Black bars are trimmed, and square art (a logo or drawing) sits whole on a black 16:9 field.
- `og.jpg` (1200x630, under 200KB so WhatsApp shows it) is the share image for home, gallery, videos and music. See the Good keeps `stg-og.jpg`.

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

## Pages and menu

| Page | What's on it |
|---|---|
| `/` | About, activities, 12 photos, 3 videos, music, contact |
| `/gallery` | every photo |
| `/videos` | every Camp Landau video: highlights by year, Color War, song videos, a link to See the Good |
| `/music` | the camp songs player, Spotify, 24six, the music videos |
| `/see-the-good` | the 7 STG episodes and the theme song |

- **Menu rule:** anything with its own page links to that page (Gallery, Videos, Music, STG). About, Activities and Contact only live on the home page, so they link to `/#about` and so on. The current page is marked `class="here" aria-current="page"`.
- Every page has the same menu, the same phone menu and the same footer, with a row linking every page. There is no build step, so **a menu change means editing all six HTML files** (404 included).
- The home sections for photos, videos and music each end in a button to their page ("View More Photos", "More Videos", "More Music"). These are real links, so Google follows them.
- `/clips` (the Summer 2026 daily clips on Google Drive) was removed at the client's request; its address redirects to `/videos`.

### Adding a video
1. Make the two thumbnails in `img/videos` (see Images).
2. Add a card to the right section of `videos.html` (copy one: the `data-yt` id, the title, the duration on the badge), and a `VideoObject` to the page's structured data with the upload date and duration from YouTube.
3. Add a `<video:video>` entry under `/videos` in `sitemap.xml`, and bump its `lastmod`.
4. A song video also goes on `music.html` the same way.

## Header (home page)

The hero shows the big logo, so the nav's logo is hidden while the hero logo is on screen (`nav.at-hero`, toggled by an IntersectionObserver on `.hero-logo` with a -68px top margin). It fades in once the hero logo has slid under the 68px nav bar, so the two logos never show together. A deep link into the page shows it straight away. While the phone menu is open, the nav takes its white scrolled look and shows its logo (`nav:has(.hamburger.open)`), so header and menu read as one panel. On phones the logo in the white bar is 46px. The other pages have no big hero logo and keep the nav logo throughout.

## Third parties

| Service | Where | Why |
|---|---|---|
| Google Fonts (Figtree, Inter) | all pages | type |
| YouTube (nocookie) | home, `/videos`, `/music`, See the Good via Plyr | video, loaded only when a visitor taps play |
| Plyr 3.7.8 (jsDelivr) | See the Good | custom player chrome over YouTube |
| Spotify embed | home music section, `/music` | built only when the section nears the screen |
| Google Drive | See the Good downloads | full-quality episode files |
| GitHub API | songs list on home and `/music` (`songs.js`) | lists `/audio` so a newly uploaded song appears by itself |
| Cloudflare Web Analytics | injected by Cloudflare | traffic stats |

**Songs:** the player is `songs.js`, shared by the home page and `/music`. The list comes from the GitHub contents API for `/audio`, and the files play from this site (`/audio/...`). GitHub allows 60 API calls an hour per network, so `songs.js` has `SONGS_FALLBACK`. **When you add a song, add its file name there too**, and a row for it in the static list in `music.html` (see GEO below). `/#songs` and `/music#songs` both land on the player.

**See the Good players:** each Plyr player opens a ~1MB YouTube frame, so a player is built when its episode comes within 600px of the screen, never all seven on load.

## SEO and GEO

- Structured data: home has `WebSite` plus `SummerCamp` + `LocalBusiness` (address, phones, director, audience). Gallery is `ImageGallery`; videos is a `CollectionPage` and music a `WebPage`, each with one `VideoObject` per video; See the Good has one `VideoObject` per episode. Every page but home has a `BreadcrumbList` (Camp Landau > page).
- `sitemap.xml` uses clean URLs, lists every gallery photo as an image entry (the gallery is built by script), and lists every video on `/videos`, `/music` and `/see-the-good` as video entries built from each page's VideoObject data. When an episode, video or photo is added, add it to the sitemap too and bump that page's `lastmod`. Submit `https://camp-landau.com/sitemap.xml` in Google Search Console (the site is already verified there).
- **Sitelinks** (the menu of pages Google can show under the home result) are chosen by Google and can't be switched on. What helps, and is in place: one short, distinct title per page, the same menu and footer links on every page, breadcrumbs, a sitemap with every page, and no orphan pages. After a change to the pages, use URL Inspection in Search Console to request indexing of each new page.
- `llms.txt` summarizes the camp for AI answer engines: key facts, every page, every video with its YouTube link, and the songs. Keep it in step with the Source of Truth, and add new videos and songs to it.
- **GEO, what AI crawlers see:** most AI search crawlers (ChatGPT search, Perplexity, Claude) read the raw HTML and don't run JavaScript. So anything that matters is in the HTML itself, not only drawn by script:
  - The home countdown's date is in a hidden sentence ("Camp is back on Sunday, August 15, 2027") for crawlers and screen readers. The ticking digits are `aria-hidden`. **When the date changes, change it there, in the countdown script and in `llms.txt`.**
  - `/music` lists the songs in its HTML; `songs.js` replaces that list with whatever is in `/audio` once it runs.
  - Video cards on home, `/videos` and `/music` are plain HTML. The gallery photos are still drawn by script, which Google renders but AI crawlers don't; they are images with no text to read, so little is lost.
- Every indexable page allows full snippets and large previews (`max-snippet:-1`, `max-image-preview:large`), which Google's AI Overviews and Discover use.
- `robots.txt` allows everyone. **Cloudflare's AI Crawl Control** still returns 403 to AI *training* crawlers (GPTBot, ClaudeBot, CCBot). Search and answer bots (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot, Applebot) get through. The client is turning this on in the Cloudflare dashboard.
- Every page has one `h1`, a `main` landmark with a skip link to it, canonical, description and share tags. The 404 page is `noindex` and has no canonical.
- **Domain setup (checked October 2026):** `http://` redirects (301) to `https://` (Cloudflare's Always Use HTTPS), and `www.camp-landau.com` redirects (301) to `https://camp-landau.com`, keeping the path and query. `http://www` takes two hops (to https, then off www), which is fine.
- The client has submitted the sitemap in Google Search Console, imported the site into Bing Webmaster Tools and turned on Cloudflare Crawler Hints (October 2026).
- **Bing matters for GEO:** ChatGPT search leans on Bing's index. Bing Webmaster Tools can import the site straight from Google Search Console. Cloudflare's Crawler Hints (Caching > Configuration) pings Bing and others through IndexNow whenever a page changes.

## Known issues

- At 360px the home page measures 2px wide because the music cards slide in from the side. The body's `overflow-x:hidden` clips it, so nothing scrolls.
