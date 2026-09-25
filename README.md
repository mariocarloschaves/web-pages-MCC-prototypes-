# MCC Website Prototypes

Static website concepts hosted with GitHub Pages. The first prototype is Tip.TopBarbershop, available in Dutch and English with an animated hero and a booking demonstration.

This is an MCC design concept, not the business's official website. The visuals are generated concept imagery. The booking demonstration does not send appointments or collect submitted requests.

## Enable GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Actions → Deploy MCC Prototypes**. A push to `main` starts a deployment; you can also select **Run workflow**. If an earlier deployment failed because Pages was not enabled, rerun it after changing the source.
4. Wait for both the `build` and `deploy` jobs to succeed.

Expected URLs after the first successful deployment:

- Portfolio: https://mariocarloschaves.github.io/web-pages-MCC-prototypes-/
- Tip.Top prototype: https://mariocarloschaves.github.io/web-pages-MCC-prototypes-/tiptop/

## Local development

Use Node.js 22, Python 3.12, and FFmpeg. Install Pillow and the JavaScript dependencies, then prepare the existing generated media:

```sh
python3 -m pip install Pillow==11.3.0
npm ci
npm run assets
npm run dev
```

Open the development server's `/tiptop/` path. Build and preview the static output with:

```sh
npm run build
npm run preview
```

The media preparation script downloads previously generated assets and processes them for the website. It does not request new AI generations. Generated output goes into `public/tiptop/assets/`, and Vite copies it into the deployment so media is served directly from GitHub Pages.

## Structure

- `src/`: prototype application and scroll animation.
- `tiptop/index.html`: Tip.Top entry page.
- `scripts/assets.py`: prepares the prototype's image and video assets.
- `scripts/finish.mjs`: adds the portfolio index and search indexing exclusions to `dist/`.
- `.github/workflows/pages.yml`: builds and deploys the static website.

The app uses relative asset URLs so it works under this repository's GitHub Pages path. Robots exclusions and `noindex` metadata signal that this is a preview; they do not make it private.
