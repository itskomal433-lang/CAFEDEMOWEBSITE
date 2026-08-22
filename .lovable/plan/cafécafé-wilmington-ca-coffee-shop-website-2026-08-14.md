# cafécafé — Wilmington, CA coffee shop website

A warm, mobile-first marketing site for cafécafé built on the existing TanStack Start template. Home page carries the full experience; Menu, About, Gallery, Reviews, and Contact get their own indexable pages for local SEO.

## Pages

- `/` — Hero, featured drinks, food menu preview, "Why people love cafécafé", about teaser, reviews strip, gallery preview, order-online CTA, location + hours, contact form, footer.
- `/menu` — Full menu with category filtering (Coffee & Espresso, Specialty Drinks, Breakfast, Bakery, Lunch & Snacks). Prices are placeholders, all in one editable data file.
- `/about` — "More Than Just Coffee" story with a large café image.
- `/gallery` — Masonry grid with category filters (All, Coffee, Food & Drink, Iced Coffee, Chicken Sandwich, Juice, Café Vibe) and a lightbox.
- `/reviews` — 4.6 ★ / 418 reviews summary, animated rating counter, review-theme cards (no fabricated names or quotes — editable placeholders).
- `/contact` — Contact form with validation, phone, address, map, hours.

## Design direction

Coffee-inspired palette in semantic tokens: warm cream background, espresso brown, soft beige, caramel accent, off-white surfaces, muted green as a small accent. Elegant serif display headings paired with a clean sans body, rounded cards, soft shadows, subtle grain texture, generous whitespace. Restrained scroll and hover micro-animations. Dark espresso footer.

## Content and assets

- All AI-generated photography saved to `src/assets/`: hero iced-coffee shot, four signature drinks (Horchata Iced Espresso, Horchata Latte, Dulce de Leche Macchiato, Frappes), pastries, breakfast bagel, chicken sandwich, café interior, barista, storefront.
- Business facts used verbatim: address 1330 W Pacific Coast Hwy Ste E, Wilmington, CA 90744; phone +1 424-287-0071; 4.6 ★ / 418 reviews; $1–10; Dine-in · Takeaway · Delivery; Open daily, closes ~9 PM.

## Interactions

Sticky nav with mobile hamburger, smooth scroll, menu category filters, gallery lightbox with keyboard close, hover zoom on images, animated rating count-up, click-to-call, floating mobile call button, back-to-top, validated contact form (client-side, shows a success toast — no email backend yet).

## Technical notes

- Editable content lives in `src/data/cafe.ts`: business info, hours array, ordering URL, social links, menu items with `price` placeholder strings, gallery items, review themes. Owner edits one file.
- Map: static-styled embed placeholder plus a "Get Directions" link to Google Maps for the address. A live interactive map needs the Google Maps connector — I can add it on request.
- "Order Online" points to an `orderingUrl` constant in the data file (placeholder until the café's real link is supplied).
- SEO: per-route `head()` with local keywords, single H1 per page, semantic sections, alt text, and LocalBusiness/CafeShop JSON-LD (address, geo-free, phone, hours, aggregateRating 4.6/418) on the home route.
- Contact form is presentational only; wiring submissions to email/database would need Lovable Cloud.

## Open items

- Real online-ordering URL and social links — placeholders until provided.
- Exact per-item prices and full weekly hours — placeholders in the data file.
