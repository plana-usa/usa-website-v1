# Revision log

## 2026-10-29 — Batch 1: positioning revisions (Home + About Us)
- Home hero: headline → "A Hybrid eVTOL Built for the Real World"; subtitle → "eVTOL 2.0".
- About Us › Executives: added Duc Huy Tran (President & Chief Product Officer) beside Braden, with flip-card bio and LinkedIn link. Photo: `uploads/2025/10/duc-huy-tran.jpg`.
- About Us › Team section → "An American Aerospace Company": new copy, three stat tiles (USA / FAA / $664M), new background `assets/img/about/american-headquarters.jpg` (source in `_dev/src-img/`), dark gradient overlay.
- About Us › Roadmap: merged live-site history with pitch deck v12.1 slide 9; now runs 2021–2032, one entry per year.
- About Us › Partners: hidden (not deleted) via `hidden` + `style="display:none"` on `#aboutPartners`; "Partners" submenu link removed from the nav on all pages.

## 2026-10-30 — Batch 2: Home + Product page
- Home: "500km Operation Range" card and intro paragraph → 350 miles.
- Product › CP-01: title "PLANA CP-01" + slide-2 tagline; new benefits row (350 miles / ½ the operating cost / ~25,000 landing sites) styled as hero tier; spec strip converted to imperial with deck v12.1 numbers (6 pax / 1,850 lb, IFR, 200 mph, 50 ft, hybrid electric, jet fuel/SAF, 67 dBA, 15 min).
- Product › Noise: "i" tooltip on 67 dBA (hover/tap/keyboard; outside-click and Esc close) explaining the level vs. helicopters at 85–90 dBA.
- Product › vs Helicopters: "Efficient" card → "Affordable" ($7+ → ½ the cost per seat-mile, expensive-MRO message from slide 18); 65 dB → 67 dB.
- Product › vs battery eVTOL: "Highly enhanced flight range" → "3x Faster Door-to-Door" with SoCal route map; new row "Faster Than Flying Private" with NorCal map (image left); remaining rows re-alternated. Fixed inline-image gap under diagram images.
- Assets: web copies in `assets/img/product/` (socal-/nocal-route-map.jpg, 2000px); originals in `_dev/src-img/`.
- CSS/JS: additions at the end of `assets/css/app.css` + `_dev/scss/scss/page/product.scss`; tooltip logic appended to `assets/js/product.js`.

## 2026-10-30 — Batch 3: Military / Tactical toggle (Product › use cases)
- Each use-case card (Passenger, Logistics, EMS & Special Mission) gets a flag pill ("Military & Tactical") bottom-right of the image; click/tap crossfades to the military image and back (`article.__military`, `aria-pressed`). Wired into both the desktop image and the phone-layout copy.
- Images: `assets/img/product/uc1-military.jpg` (marine seating), `uc2-military.jpg` (military cargo), `uc3-military.jpg` (medevac); originals in `_dev/src-img/`.
- CSS appended to `app.css` + `product.scss`; JS appended to `product.js` (`initMilitaryToggle`).
