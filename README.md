# Casa Matcha — marketing site

Next.js (app router) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis · react-three-fiber · sonner.
Deploys to Vercel. No CMS: every piece of copy lives in one file per section under `/content`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

Add `?demo=1` to any URL to get the hidden toast demo panel (fires all five brand toasts on demand,
resets the once-per-session flags, replays the intro curtain).

---

## Editing content (`/content`)

| File | What it controls |
| --- | --- |
| `content/site.ts` | Name, SEO title/description, domain (`url`), Instagram, hero subhead, marquee words, footer line |
| `content/drop.ts` | "What's new" section: headline, live tag, intro, the three items |
| `content/locations.ts` | Both addresses, phones, geo, callouts, hours (drives the live status pill, JSON-LD and the hours toast) |
| `content/menu.ts` | Six menu highlight tiles + the `/menu` page groups |
| `content/events.ts` | DJ night series name, blurb, next date, Eventbrite URL |
| `content/reviews.ts` | Three Google reviews (name, quote, rating) |
| `content/instagram.ts` | Handle, profile URL, six grid images |

All of these are plain TypeScript objects. Save the file, the dev server reloads.

### Hours

`content/locations.ts` → `defaultHours`. Days are `0` (Sunday) … `6` (Saturday), times are 24h `"HH:MM"`
in Central time, `null` means closed. To give one location different hours, replace its `hours: defaultHours`
with its own object. The status pill ("Open · closes 6:00 pm"), the footer summary (`hoursSummary`, edit by hand)
and the schema.org opening hours all read from here.

### Swapping the drop

1. Put three portrait photos (3:4 works best, ≥ 1000px tall) in `public/drop/`.
2. In `content/drop.ts` update `title`, `tag` (the little live pill), `intro` and the three `items`
   (`name`, `line`, `image`, `alt`, `width`, `height`).
3. Update the "Pumpkin Drop" toast copy in `lib/toasts.ts` (`toasts.drop`) if the name changes.
4. If the drop is over, keep three evergreen items here; the section design does not depend on the season.

### Events

`content/events.ts` → `next.date` (ISO with the `-05:00`/`-06:00` Central offset) and `next.ticketsUrl`.
The "DJ night this Friday" toast only fires when that date is within the next 7 days, so an old date silently
switches the toast off.

### Reviews

Paste real Google reviews into `content/reviews.ts` (first name + last initial) and remove `sample: true`.
While `sample` is set, a small "sample" tag shows on the card so nobody mistakes drafts for real quotes.

---

## Hero frames (if the video changes)

The hero is a scroll-scrubbed frame sequence drawn to a `<canvas>`, not a `<video>`. Frames live in
`public/hero/frames` (desktop) and `public/hero/frames-m` (mobile) with a `manifest.json` next to each set.

```bash
# needs ffmpeg on PATH
npm run frames            # == bash scripts/extract-frames.sh
DQ=66 MQ=54 npm run frames  # lower quality if the new video comes out heavier
```

What the script does, and why it is not a single ffmpeg line:

- The payload budget is a hard requirement (≤ 3.5 MB desktop, ≤ 1.2 MB mobile). A plain 24 fps / 1080px dump of
  the current clip is ~10 MB, so the script **crops each frame to what the viewport actually shows** around the
  focal point (50% 38%): a 4:3 band for desktop, a 9:16 band for phones.
- It keeps **every frame during the splash** and thins the near-static pour, so the payload goes where the eye is.
- Output names keep the **source frame number** (`f-057.webp` = frame 57 of 97) and `manifest.json` lists which
  frames exist. The loader picks the nearest available frame, so you can add or remove frames freely.

If the new clip has different beats, update the two constants near the top of the script (`POUR_START`,
`SPLASH_START`) and the `KEYS` table in `lib/frames.ts` (scroll progress → source frame). The three headline
lines slam in at scroll progress 0.55 / 0.63 / 0.74 (see `components/hero/Hero.tsx`); pick the frames where the
splash peaks and adjust those numbers by eye.

Also regenerate the stills if the video changes:

```bash
ffmpeg -y -i public/hero/pour.mp4 -vf "select=eq(n\,0)" -vframes 1 public/hero/still-front.png
ffmpeg -y -sseof -0.05 -i public/hero/pour.mp4 -update 1 -vframes 1 public/hero/still-splash.png
```

`still-splash.png` is used by the reduced-motion hero and the OG image base (`public/og/splash-1200x630.jpg`,
a 1200×630 crop of the same still).

---

## Motion and performance notes

- **Curtain**: 900 ms, once per tab session (`sessionStorage` key `cm:curtain`), skipped for reduced motion. The
  head boot script in `app/layout.tsx` decides before first paint so there is no flash.
- **Reduced motion** (`prefers-reduced-motion: reduce`): no curtain, no pin/scrub (static splash still), no marquee
  motion, no particles, no magnetic/cursor, toasts fade instead of slide.
- **WebGL** is desktop-only, lazy (`next/dynamic`, `ssr: false`), and skipped when
  `navigator.hardwareConcurrency < 4` or `saveData` is on. Contexts are force-lost on unmount.
- **Perf cut order** if Lighthouse mobile drops under 80: mobile frame count (`select_frames 8 4 3` → `8 6 4` in
  the script) → particle `COUNT` in `components/hero/MatchaDust.tsx` → the marquee blur (`blurOk` in
  `components/sections/Marquee.tsx`).
- **Toasts**: `lib/toasts.ts`. Each fires once per session, max two visible, bottom-center, above the sticky bar
  on mobile.

## Deploy

Vercel, production branch `main`. `vercel.json` pins `"framework": "nextjs"` (the project was first imported
before the app existed, so the dashboard had stored "Other"); no environment variables are needed. It also
redirects `www.` to the apex domain: change both host names there and `url` in `content/site.ts` when the real
domain is known. Frame sequences are served with immutable cache headers (`next.config.ts`).
