# Placeholders to replace before launch

## Online ordering — VERIFY WITH OWNER
- `content/ordering.ts` → **VERIFY WITH OWNER — confirm which location each listing belongs to and whether
  Friendswood has its own.** Both listings are named "casa-matcha-houston" and are currently assigned to Webster:
  - Pickup (joe coffee): `https://joe.coffee/locations/tx/houston/casa-matcha-houston/`
  - Delivery (DoorDash): `https://www.doordash.com/store/casa-matcha-houston-35488877/`
  - Friendswood has `pickup: null, delivery: null`, so no order buttons render for it until links are added.
- `content/ordering.ts` → `joeSupportsScheduledOrders` is `true` (the pickup button reads "Order for later" while the
  shop is closed). Set to `false` if scheduled pickups are off in joe.
- Microsoft Clarity: set `NEXT_PUBLIC_CLARITY_ID` in Vercel → Project → Environment Variables to record the
  `order_click_<provider>_<location>` events. Without it the events are no-ops and the privacy page omits the
  analytics section.


Everything below works today (every link resolves, nothing is empty) but should be swapped for the real thing.
Items are grouped by the file you edit.

## Domain
- `content/site.ts` → `url: "https://casamatchahtx.com"` — placeholder domain (the Instagram handle). Also used for
  canonical URLs, the sitemap, robots and JSON-LD.
- `vercel.json` → the `www.casamatchahtx.com` → `casamatchahtx.com` redirect. Update both host names.

## Locations (`content/locations.ts`)
- **Phone numbers**: both are `555` placeholders (`(281) 555-0142` Friendswood, `(281) 555-0187` Webster). Replace
  `phone` (E.164, used in `tel:` links and JSON-LD) and `phoneDisplay`.
- **Geo coordinates**: approximate from the street addresses. Verify against Google Maps (right-click → copy
  coordinates) so the LocalBusiness schema is exact.
- Addresses and hours match the Instagram bio and the "Hours of operation" post. Confirm holiday hours.

## Brand
- `public/brand/logo.svg`, `app/icon.svg`, `app/apple-icon.tsx` and the inline `components/brand/Logo.tsx` are a
  hand-drawn approximation of the astronaut mark (circle, "CASA MATCHA" / "AND COFFEE" arcs, astronaut with a
  cup). Replace with the official vector; keep the badge and mark-only variants.

## Photos
All photography except the hero video is cropped from the two Instagram screenshots in `source/reference/`
(about 540 px wide). Fine for the demo, soft on large screens. Replace with originals (≥ 1200 px on the long
side, same aspect ratios):
- `public/drop/pumpkin-biscoff-matcha.jpg`, `public/drop/smores-pumpkin-cookie.jpg` (3:4);
  `public/drop/pumpkin-creme-cold-brew.jpg` is from the larger screenshot (1086 px) and is fine.
- `public/menu/*.jpg` — six tiles (3:4).
- `public/ig/01–06.jpg` — six squares.
- `public/locations/friendswood.jpg` (interior shot) and `public/locations/webster.jpg` (the door with the
  astronaut). Confirm the interior photo is actually Friendswood.
- `public/about/owners.jpg` — a single owner from the "love you so matcha" post. Swap for the owners' photo.
- `public/events/dj-night.jpg` — DJ photo from the "Matcha, Café y Perreo" post.

## Copy to confirm
- `components/sections/Familia.tsx` — the three sentences and the pull quote ("Matcha-te-ame …", attributed to
  "the owners") are drafts written in the brand voice. Confirm or rewrite.
- `content/menu.ts` — item one-liners and tags are drafted from the photos. Confirm names ("Sea-Salt Cold Brew",
  "Fruity Pebbles Matcha", "Conchas & Pan Dulce").
- `content/drop.ts` — item descriptions are drafts.
- `content/site.ts` → `marquee` words.
- `app/menu/page.tsx` — placeholder "full menu coming soon" page; replace with the real menu when available.
- `app/privacy/page.tsx` — real policy text, but confirm the legal entity name (`Casa Matcha LLC`, from Instagram)
  and the effective date.

## Reviews (`content/reviews.ts`)
- All three are **sample** reviews (`sample: true`, rendered with a "sample" tag). Paste the real Google reviews
  and remove the flag.

## Events (`content/events.ts`)
- `next.date` is a placeholder (Fri Oct 2, 2026, 7 pm). Update per event.
- `next.ticketsUrl` is the Eventbrite link from the Instagram bio
  (`https://www.eventbrite.com/e/1997638683076?aff=oddtdtcreator`). Verify it is the current event.

## Generated assets
- `public/og/splash-1200x630.jpg` is generated from `public/hero/still-splash.png`; regenerate if the video changes
  (see README).
- `source/reference/*.png` are the raw Instagram screenshots used for cropping. Not deployed (`.vercelignore`).
  Delete once real photography is in.
