# Portfolio

A static, dependency-free portfolio site. No build step.

## Edit your content

Everything personal (name, bio, projects, experience, skills, links) lives in [content.js](content.js).

- **Project previews**: each project gets a generated gradient card from its `hue` (0–360). To use a real screenshot, add `image: "img/your-shot.jpg"` (portrait 4:5 works best).
- **Statement**: the large About line whose words light up as you scroll.
- **Clock**: set `timezone` to your IANA zone (e.g. `"America/New_York"`).
- **Résumé**: drop a PDF in this folder and set `resumeUrl: "resume.pdf"`.
- **Availability badge**: set `available: false` to hide it.

Writing the copy? Templates, AI prompts, a voice guide and reusable email spiels are in [playbook/](playbook/).

## Motion

Loader counter → curtain reveal, letter-by-letter hero, interactive dot-field canvas, custom cursor,
cursor-proximity font weight, floating project preview, scroll-velocity marquee, scroll-lit text,
text scramble on hover, magnetic buttons. Cursor effects are skipped on touch devices, and
everything respects `prefers-reduced-motion`.

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
```

## Deploy

Upload the folder as-is to any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages.
