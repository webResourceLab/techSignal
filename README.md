# TechSignal – static blog
Pure HTML + Tailwind (CDN, no build step) + vanilla JS. Content lives in `data/*.json`.

## Run (a local server is required because pages `fetch()` JSON)
- VS Code: install **Live Server**, right-click `index.html` → *Open with Live Server*.
- or: `python -m http.server 8000` (or `npm start`), then open http://localhost:8000

## Edit
- `data/posts.json` posts (body = array of blocks: p, h2, h3, h4, img, ul, ol, blockquote, code, hr; inline `**bold**`, `*italic*`, `[text](url)`)
- `data/categories.json`, `data/site.json` categories, nav, social, contact, FAQ.
## Deploy
Upload the folder to any static host (Netlify, GitHub Pages, Cloudflare Pages). Forms/newsletter are simulated; connect a real service in `js/main.js`.
