# PLANA website — static source

This folder is the editable source of plana.aero, converted from the original
WordPress site (theme "plana-v2") into plain HTML/CSS/JS. There is no CMS, no
database and no PHP: what you see in this folder is exactly what gets served.

## Run it locally

Open this folder in VS Code and click **Go Live** (Live Server extension), or run
`python -m http.server 8000` here and open http://localhost:8000.
Serve from *this* folder: links are root-absolute (`/assets/...`), so the site
must sit at the server root.

## Layout

| Path | What it is |
|---|---|
| `index.html` | Home |
| `about-us/`, `product/`, `newsroom/`, `career/`, `contact/`, `data-protection/` | Main pages (each is an `index.html`) |
| `news/<slug>/` | 47 news articles |
| `news-category/<event|media|press-release>/` | Newsroom category listings (+ `page/2/`) |
| `assets/css/app.css` | The site stylesheet (compiled from `_dev/scss`) |
| `assets/css/swiper-bundle.min.css`, `assets/css/wp-blocks.css` | Slider styles; minimal heading/paragraph styles used by Data Protection and news articles |
| `assets/fonts/` | DC Air Sans + Akzidenz-Grotesk Pro web fonts and their `@font-face` CSS |
| `assets/js/common.js` | Page loader, GSAP scroll/text animations, nav |
| `assets/js/home.js`, `about.js`, `product.js`, `page.js` | Per-page scripts |
| `assets/js/vendors/` | GSAP (+ plugins), Swiper, Three.js, Lottie |
| `assets/vendor/` | jQuery, Font Awesome (brands only) |
| `assets/img/`, `assets/lottie/`, `assets/video/` | Theme images, animated icons, videos |
| `uploads/` | Media uploaded through WordPress (news images, team photos, CI guide PDF) |
| `_dev/scss/` | Original SCSS sources for `app.css` (reference; not served) |

Every page carries its own copy of the header, nav and footer. To change one of
those site-wide, edit it in one page and we propagate it with a script.

## Known gaps (as of the 2026-10-29 conversion)

- `assets/video/about-intro.mp4`, `product-cp01-a.mp4`, `product-cp01-b.mp4`:
  three videos still stream from Vimeo on the live site through expiring links.
  Download them the same way as the homepage video and drop them in.
- `uploads/2023/08/PLANA-logo.zip` (footer "Logo File"): missing on the live site too.
- `contact/`: the live site's Contact link was broken (404). A minimal page with the
  email address was created; office locations still need to be added.
- Google tag `GT-MK5Q2VD` is kept as-is.
