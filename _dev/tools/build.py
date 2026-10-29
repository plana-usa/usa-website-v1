#!/usr/bin/env python3
"""Convert the HTTrack mirror of plana.aero (WordPress) into a clean static site.

Usage: python3 -I build.py <mirror_root/plana.aero> <fontawesome_dir> <out_dir>
"""
import os, re, shutil, sys, posixpath, html
from urllib.parse import urlsplit, unquote, quote

SRC, FA_DIR, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
THEME = "wp-content/themes/plana-v2/assets"

# ---------- helpers ----------------------------------------------------------
def read(p):  return open(p, encoding="utf-8", errors="replace").read()
def write(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8").write(s)
def copy(src, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)

HASH_RE = re.compile(r"^(.*?\.(?:min|minf719|mincfa9))?([0-9a-f]{4})?(\.(?:css|js))$")
def unhash(name):
    """swiper-bundle.minf719.css -> swiper-bundle.min.css ; jquery.minf43b.js -> jquery.min.js"""
    m = re.match(r"^(.*?\.min)[0-9a-f]{4}(\.(?:css|js))$", name)
    return m.group(1) + m.group(2) if m else name

# ---------- 1. redirect stubs: index####.html -> real page -------------------
stub_target = {}
for f in os.listdir(SRC):
    if re.match(r"index[0-9a-f]{4}\.html$", f):
        m = re.search(r'URL=([^"]+)"', read(os.path.join(SRC, f)))
        if m: stub_target[f] = m.group(1)
# index9898.html is the "?page_id=338" Contact page (a 404 on the live site)
stub_target.setdefault("index9898.html", "contact.html")

# ---------- 2. path mapping (mirror-relative -> site-absolute) ---------------
CACHE_MAP = {
    "wp-content/cache/autoptimize/css/autoptimize_single_d695fd1ea95bc4bef9f4c79ba.css": "/assets/fonts/DCAirSans.css",
    "wp-content/cache/autoptimize/css/autoptimize_single_e7135787f02d8352382516518.css": "/assets/fonts/AkzidenzGroteskPro.css",
    "wp-content/cache/autoptimize/css/autoptimize_single_98299c087d014dd4a9dffac49.css": "/assets/css/app.css",
    "wp-content/cache/autoptimize/js/autoptimize_single_13a985347b378ffbc99027f5fa.js": "/assets/js/common.js",
    "wp-content/cache/autoptimize/js/autoptimize_single_1de05f5275f7f589645d809633.js": "/assets/js/about.js",
    "wp-content/cache/autoptimize/js/autoptimize_single_ef10f6dd621514c5a12ab70d65.js": "/assets/js/home.js",
    "wp-content/cache/autoptimize/js/autoptimize_single_477c920e17716873adc3823ab0.js": "/assets/js/product.js",
    "wp-content/cache/autoptimize/js/autoptimize_single_bc7c9c052c23acfaf25f77f845.js": "/assets/js/page.js",
    "wp-includes/js/jquery/jquery.minf43b.js": "/assets/vendor/jquery.min.js",
    "wp-includes/blocks/heading/style.minf719.css": "/assets/css/wp-blocks.css",
    "wp-includes/blocks/paragraph/style.minf719.css": "/assets/css/wp-blocks.css",
    "wp-content/uploads/2023/08/PLANA-logo.html": "/uploads/2023/08/PLANA-logo.zip",  # missing on live site too
    "contact.html": "/contact/",
}

def map_path(m):
    """m: normalized mirror-relative path (no query/fragment). Returns site-absolute path or None."""
    if m in CACHE_MAP: return CACHE_MAP[m]
    if m in stub_target: return map_path(posixpath.normpath(stub_target[m]))
    if m.startswith("../cdnjs.cloudflare.com/") or "font-awesome" in m:
        return "/assets/vendor/fontawesome/css/all.min.css"
    if m.startswith(THEME + "/"):
        rest = m[len(THEME) + 1:]
        d, n = posixpath.split(rest)
        return "/assets/" + posixpath.join(d, unhash(n))
    if m.startswith("wp-content/uploads/"):
        return "/" + m.replace("wp-content/", "", 1)
    if m == "index.html" or m == "": return "/"
    if m.endswith("/index.html"): return "/" + m[:-len("index.html")]
    if m.startswith("wp-json") or m.startswith("wp-admin") or m.startswith("xmlrpc"):
        return None  # dropped elsewhere
    return None

def rewrite_url(raw, page_dir):
    raw = html.unescape(raw.strip())
    if not raw or raw.startswith(("http://", "https://", "//", "mailto:", "tel:", "data:", "javascript:", "#")):
        return raw
    parts = urlsplit(raw)
    path = unquote(parts.path)
    frag = ("#" + parts.fragment) if parts.fragment else ""
    m = posixpath.normpath(posixpath.join(page_dir, path)) if path else page_dir + "/index.html"
    if m.startswith("./"): m = m[2:]
    new = map_path(m)
    if new is None:
        return raw  # leave untouched; reported later
    return quote(new, safe="/:@") + frag

ATTR_RE = re.compile(r'''(\s(?:href|src|content|data-src|poster|__poster))=(["'])(.*?)\2''', re.S)
SRCSET_RE = re.compile(r'''(\ssrcset)=(["'])(.*?)\2''', re.S)
CSSURL_RE = re.compile(r'''url\((['"]?)([^'")]+)\1\)''')

def rewrite_html(s, page_dir):
    def attr(m):
        name, q, val = m.groups()
        if name.strip() == "content" and not (re.search(r"\.(png|jpe?g|svg|ico|gif|webp)$", val, re.I) or "wp-content/" in val): return m.group(0)
        return f"{name}={q}{rewrite_url(val, page_dir)}{q}"
    s = ATTR_RE.sub(attr, s)
    def srcset(m):
        name, q, val = m.groups()
        items = []
        for it in val.split(","):
            it = it.strip()
            if not it: continue
            bits = it.split()
            bits[0] = rewrite_url(bits[0], page_dir)
            items.append(" ".join(bits))
        return f"{name}={q}{', '.join(items)}{q}"
    s = SRCSET_RE.sub(srcset, s)
    s = CSSURL_RE.sub(lambda m: f"url({m.group(1)}{rewrite_url(m.group(2), page_dir)}{m.group(1)})", s)
    return s

# ---------- 3. WordPress / HTTrack clean-up ----------------------------------
DROP_PATTERNS = [
    r"<!-- Mirrored from .*?-->\s*", r"<!-- Added by HTTrack -->.*?<!-- /Added by HTTrack -->\s*",
    r"<style id=\"wp-img-auto-sizes-contain-inline-css\">.*?</style>",
    r"<style id=\"wp-emoji-styles-inline-css\">.*?</style>",
    r"<style id=\"wp-block-library-inline-css\">.*?</style>",
    r"<style id=\"classic-theme-styles-inline-css\">.*?</style>",
    r"<style id=\"global-styles-inline-css\">.*?</style>",
    r"<script[^>]*>\s*window\._wpemojiSettings.*?</script>\s*(<script[^>]*>.*?wp-emoji.*?</script>)?",
    r"<link rel='dns-prefetch' href='http://cdnjs\.cloudflare\.com/' />",
    r"<link rel=\"alternate\" title=\"oEmbed[^>]*>", r"<link rel=\"https://api\.w\.org/\"[^>]*>",
    r"<link rel=\"alternate\" title=\"JSON\"[^>]*>", r"<link rel=\"EditURI\"[^>]*>",
    r"<meta name=\"generator\"[^>]*>", r"<link rel='shortlink'[^>]*>",
    r"<link rel=\"alternate\" type=\"application/rss\+xml\"[^>]*>",
    r"<style id=\"wp-block-[a-z-]+-inline-css\">.*?</style>",
    r"<script id=\"jquery-migrate-js\"[^>]*></script>",
    r"<script type=\"speculationrules\">.*?</script>\s*",
    r"<script id=\"wp-emoji-settings\"[^>]*>.*?</script>\s*",
    r"<script type=\"module\">/\*! This file is auto-generated \*/\s*var e=\"script#wp-emoji-settings\".*?</script>\s*",
    r"<script[^>]*id=\"wp-embed-js\"[^>]*></script>\s*",
    r"<link rel='stylesheet' id='wp-block-(?:heading|paragraph)-css'[^>]*/>",  # re-added once below
]
# Vimeo playback ids seen in the mirror -> local files (expiring CDN links; files must be supplied, see README)
VIDEOS = {
    "a0918c3e-d5ab-438b-84f4-d0abd04ac1b9": "/assets/video/home-intro.mp4",
    "8398e91c-a9d3-41c1-b3de-94760d1578fc": "/assets/video/about-intro.mp4",
    "d0a4283a-b023-4089-9646-8e504db27787": "/assets/video/product-cp01-a.mp4",
    "68e9cdb7-aab1-4778-967d-ee8539f8a73b": "/assets/video/product-cp01-b.mp4",
}
def clean(s, needs_wp_blocks):
    for p in DROP_PATTERNS: s = re.sub(p, "", s, flags=re.S)
    s = re.sub(r"<script>window\.SITE_URL = .*?</script>",
               "<script>window.SITE_URL='/';window.ASSETS_URL='/assets/';window.ADMIN_AJAX_URL='';</script>", s, flags=re.S)
    if needs_wp_blocks:
        s = s.replace("<link rel='stylesheet' id='plana-css-app-css'",
                      "<link rel='stylesheet' id='wp-blocks-css' href='/assets/css/wp-blocks.css' media='all' />"
                      "<link rel='stylesheet' id='plana-css-app-css'")
    s = re.sub(r"\?ver=[\d.]+", "", s)
    s = s.replace("https://plana.aero/wp-content/uploads/", "https://plana.aero/uploads/")
    # expiring Vimeo CDN link -> local placeholder (video file must be supplied; see README)
    for key, local in VIDEOS.items():
        s = re.sub(r'src="https://download-video[^"]*vimeocdn\.com/v3-1/playback/' + key + r'[^"]*"', f'src="{local}"', s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s

# ---------- 4. pages ---------------------------------------------------------
PAGE_DIRS = ["", "about-us", "product", "newsroom", "career", "data-protection",
             "news-category/event", "news-category/media", "news-category/press-release",
             "news-category/media/page/2", "news-category/press-release/page/2"]
PAGE_DIRS += sorted("news/" + d for d in os.listdir(os.path.join(SRC, "news")))
unmapped = set()
for d in PAGE_DIRS:
    src = os.path.join(SRC, d, "index.html")
    if not os.path.exists(src): print("missing", src); continue
    s = read(src)
    s = clean(s, needs_wp_blocks=("wp-block-heading" in s or "wp-block-paragraph" in s or d == "data-protection"))
    s = rewrite_html(s, d)
    for m in re.finditer(r'(?:href|src)="([^"]+)"', s):
        v = m.group(1)
        if not v.startswith(("/", "http", "mailto", "#", "data:")): unmapped.add((d, v))
    write(os.path.join(OUT, d, "index.html"), s)

# Contact page: live site 404s. Build a minimal page from the home template so the nav link works.
home = read(os.path.join(OUT, "index.html"))
contact = home.replace("<title>PLANA</title>", "<title>Contact - PLANA</title>")
contact = re.sub(r'<body class="[^"]*"', '<body class="page page-template page-template-templates page-template-contact"', contact)
contact = re.sub(r"<main id=\"main\">.*?</main>", """<main id="main">
<section class="section section-kv full-height" id="location">
  <div class="section-inner"><div class="section-content centered-content"><div class="container">
    <h2 class="headline1 __title font-akzidenz"><span class="__sentence">Contact</span></h2>
    <p class="txt-xl __sub-title"><span class="__sentence"><a href="mailto:plana@plana.aero">plana@plana.aero</a></span></p>
    <!-- TODO: office locations / map. The original WordPress contact page (page_id=338) was not published on the live site. -->
  </div></div></div>
</section>
</main>""", contact, flags=re.S)
contact = contact.replace('id="plana-js-home-js" src="/assets/js/home.js"', 'id="plana-js-page-js" src="/assets/js/page.js"')
write(os.path.join(OUT, "contact", "index.html"), contact)

# ---------- 5. assets --------------------------------------------------------
SKIP_NAME = re.compile(r"^index(?:[0-9a-f]{4})?\.html$")
for root, dirs, files in os.walk(os.path.join(SRC, THEME)):
    rel = os.path.relpath(root, os.path.join(SRC, THEME))
    for f in files:
        if SKIP_NAME.match(f): continue                       # directory listings
        if re.search(r"\.min[0-9a-f]{4}\.(css|js)$", f): continue  # hashed duplicates
        if f.endswith(".scss.html"):                          # SCSS sources -> _dev/scss
            copy(os.path.join(root, f), os.path.join(OUT, "_dev", "scss", rel, f[:-5])); continue
        if rel.startswith("scss"): continue
        copy(os.path.join(root, f), os.path.join(OUT, "assets", rel, f))
# jQuery, WP block css
copy(os.path.join(SRC, "wp-includes/js/jquery/jquery.minf43b.js"), os.path.join(OUT, "assets/vendor/jquery.min.js"))
write(os.path.join(OUT, "assets/css/wp-blocks.css"),
      read(os.path.join(SRC, "wp-includes/blocks/heading/style.minf719.css")) + "\n" +
      read(os.path.join(SRC, "wp-includes/blocks/paragraph/style.minf719.css")))
# uploads
for root, dirs, files in os.walk(os.path.join(SRC, "wp-content/uploads")):
    for f in files:
        if f.endswith(".html"): continue
        rel = os.path.relpath(os.path.join(root, f), os.path.join(SRC, "wp-content"))
        rel = re.sub(r"#U([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), rel)
        copy(os.path.join(root, f), os.path.join(OUT, rel))
# Font Awesome (self-hosted; only the brands face is used)
copy(os.path.join(FA_DIR, "css/all.minf719.css"), os.path.join(OUT, "assets/vendor/fontawesome/css/all.min.css"))
for f in ("fa-brands-400.woff2", "fa-brands-400.ttf"):
    copy(os.path.join(FA_DIR, "webfonts", f), os.path.join(OUT, "assets/vendor/fontawesome/webfonts", f))

print("pages:", len(PAGE_DIRS) + 1)
print("unmapped refs:", len(unmapped))
for u in sorted(unmapped)[:40]: print("  ", u)
