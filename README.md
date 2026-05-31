# AI Storyboard Engine — Deploy to a GoDaddy domain

This app runs entirely in the browser and talks directly to Google's Gemini API
(text, image, and Veo video). **Each user pastes their own Gemini API key** in the
"Source Data" panel; the key is stored only in that browser's `localStorage` and
sent straight to Google. Nothing is hardcoded.

You have two ways to get it live. Pick ONE.

---

## Option A — Proper build with Vite (recommended)

Produces small, fast, static files. Requires Node.js 18+ on your computer (not on
GoDaddy — only to build).

```bash
cd vite-project
npm install
npm run build      # outputs a ready-to-upload "dist/" folder
```

Then upload **the contents of `vite-project/dist/`** to GoDaddy (see "Uploading"
below). To preview locally before uploading: `npm run preview`.

---

## Option B — No build step (if you don't have Node)

Upload the two files in the `no-build/` folder (`index.html` and `app.jsx`) directly.
The page loads React/lucide from a CDN and compiles the JSX in the browser on first
load (a few seconds). Simplest path, slightly slower first paint. Requires the
visitor to have internet access to the CDNs.

---

## Uploading to GoDaddy

You need a **Web Hosting / cPanel plan** (or FTP access). The GoDaddy *Website
Builder* product does NOT let you upload custom HTML/JS — if that's all you have,
you can't host this there.

1. Log in to GoDaddy → your hosting product → **cPanel Admin**.
2. Open **File Manager** → go into **`public_html`** (this is your domain's web root).
   - To serve at `https://dundee.in/` put the files directly in `public_html`.
   - To serve at `https://dundee.in/app/` make a folder `public_html/app` and put them there.
3. Upload:
   - **Option A:** everything inside `dist/` (the `index.html` plus the `assets/` folder).
   - **Option B:** `index.html` and `app.jsx`.
4. Make sure `index.html` sits at the top of that folder (it's the entry page).
5. Turn on **SSL** for the domain (GoDaddy → hosting → SSL). HTTPS is required —
   browsers restrict `localStorage` and some APIs on plain HTTP.
6. Visit your domain. Open the app, paste a Gemini API key, and generate.

No `.htaccess` / URL-rewrite rules are needed — this is a single page with no router.

(FTP alternative: connect with FileZilla using the FTP credentials from cPanel and
drop the same files into `public_html`.)

---

## Get a Gemini API key

Each user gets their own at <https://aistudio.google.com/apikey>. Note:

- **Image generation and especially Veo video are billed** and Veo requires a
  **paid** tier / billing enabled. Free-tier keys will work for text/shot planning
  but may fail on video.
- The Veo model is set to `veo-3.1-generate-preview`. If a key lacks access, edit
  `GEMINI_VIDEO_MODEL` in the source to `veo-3.0-generate-001` (stable) or a
  fast/lite variant.

---

## SECURITY — read this

A static website **cannot keep an API key secret** — anything shipped to the
browser is visible to anyone. This app is designed around that fact:

- **Never hardcode YOUR key into the source.** Leave it blank; users enter their own.
  A baked-in key on a public site will be scraped and your account billed.
- **Restrict the key in Google Cloud Console** (APIs & Services → Credentials → your
  key):
  - *Application restrictions* → **HTTP referrers** → add `https://dundee.in/* and https://www.dundee.in/* (and https://*.dundee.in/* to cover subdomains)`
    so only your site can use it.
  - *API restrictions* → limit it to the **Generative Language API**.
- If you want **one shared key** for all visitors instead of per-user keys, do NOT
  put it in the client. Stand up a tiny **server-side proxy** that holds the key and
  forwards requests; the site calls the proxy. On GoDaddy cPanel a small PHP proxy
  works well for the text/image endpoints. (Ask and I'll generate one — Veo's
  long-running + polling + file-download flow needs a few proxied routes.)

---

## Going further (optional, production polish)

- Replace the Tailwind Play CDN with a real Tailwind build (install `tailwindcss`,
  add a `tailwind.config.js` whose `content` scans `src/**/*.jsx`, and import the
  generated CSS) to drop the CDN dependency and shrink CSS.
- Add Subresource Integrity (SRI) hashes to the runtime CDN scripts the app loads
  (pdf.js, JSZip, jsPDF, mammoth) for supply-chain safety.
- Add IndexedDB autosave so a refresh doesn't lose generated frames.
