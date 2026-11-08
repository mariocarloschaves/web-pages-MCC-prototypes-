# Foca Foca — MCC project record

## Source and preview

Maintained in `mariocarloschaves/web-pages-MCC-prototypes-`, branch `main`, under `public/foca-foca/`. The existing preview is GitHub Pages:

- PT: https://mariocarloschaves.github.io/web-pages-MCC-prototypes-/foca-foca/index.html
- EN: https://mariocarloschaves.github.io/web-pages-MCC-prototypes-/foca-foca/en.html

The approved rounded-controls design is commit `36dd041c24b2a4b9274b31920870ac161ad7fbe7`. The client media was imported in `5c5c855fd884426f69cc601512fafb075303a9e5`. These are historical references, not reset targets. No standalone repository or Vercel Foca Foca project was found during this update. Prototype/non-official wording and `noindex,nofollow` remain. No domain, DNS, billing or official launch changes are authorized by this update.

## Client content — 8 November 2026

### Supplied photographs

| Placement (both languages) | Asset | Intrinsic dimensions |
| --- | --- | --- |
| La Parmigiana card and dialog | `images/dish-la-parmigiana.webp` | 1152 × 1536 |
| Mortadella card and dialog | `images/dish-mortadella.webp` | 1600 × 1066 |
| Messico & Nuvole card and dialog | `images/dish-messico-nuvole.webp` | 1066 × 1600 |
| Napoli card and dialog | `images/dish-napoli.webp` | 1600 × 1066 |
| Caprese 2.0 card and dialog | `images/dish-caprese.webp` | 1600 × 1066 |
| Del Giorno card and dialog | `images/dish-del-giorno.webp` | 1600 × 1066 |
| Gabriele and Janainy story portrait | `images/foca-02.webp` | 900 × 1600 |

The committed media was visually inspected. The six food photographs use `object-fit:contain` within the existing card grid and dialogs, keeping the complete food visible without distortion. The story crop retains both people, with `object-position:50% 40%`. Images remain optimized WebP and below-the-fold images remain lazy loaded. No photograph was re-encoded or generated during the finishing work.

Cards carry localized photo/illustration alternative text. Dialogs reuse the selected card's exact asset URL, intrinsic dimensions and correct provenance wording. The general note distinguishes six supplied food photographs from the remaining illustrations; it does not claim all imagery is original photography.

### Menu removals

Removed from the generator and both generated pages:

- Cornetto simples / Plain cornetto
- Cornetto recheado / Filled cornetto
- Sfogliatella napolitana / Neapolitan sfogliatella
- Cappuccino com pistáchio / Pistachio cappuccino

Standard Cappuccino, plant-based Cappuccino, all twelve focaccias and other desserts remain. All other menu data, prices and ingredients match the prior client-content commit.

### Menu additions

| Category | Product | PT | EN |
| --- | --- | --- | --- |
| Spritz | Cynar Spritz | 8,00 € | €8.00 |
| Beer | Estrella Bock Damm | 3,50 € | €3.50 |
| Italian wines | Barbera d’Alba — Egidio 2023 | Tinto · 6,00 € copo / 23,00 € garrafa | Red · €6.00 glass / €23.00 bottle |

Cynar description (PT): “Herbal e ligeiramente amargo. Uma tradição do aperitivo veneto.”

Cynar description (EN): “Herbal and slightly bitter. A tradition of the Veneto aperitivo.”

No serving size or substitute beer was added. The wine uses the existing glass/bottle columns.

### Supplied lower-page video

- Section: `#filme` — “Camada a camada” / “Layer by layer”.
- Clip: `media/camada-a-camada.mp4` — H.264, 512 × 910, 30 fps, 3.733 seconds, 595,643 bytes; no audio stream.
- Poster: `media/camada-a-camada-poster.jpg`, visually matched to the supplied clip.
- Caption: “Vídeo Foca Foca · fornecido pela equipa” / “Foca Foca video · supplied by the team”.
- Accessible label describes focaccia presented on a tray by the team.
- Compact portrait frame with the actual aspect ratio; `object-fit:contain`, no severe crop or stretching.
- Muted looping inline playback begins when visible. `preload="none"` avoids downloading the lower clip on arrival at the top of the page.
- Rounded, keyboard-operable Play/Pause button. A deliberate pause survives scrolling away/back and visibility changes. Reduced motion prevents automatic playback and responds to preference changes; explicit manual playback remains possible.
- Native video controls remain the no-JavaScript fallback. The enhanced control exposes no meaningless audio toggle for the silent clip.

The separate hero film, its source, and hero HTML are unchanged byte-for-byte.

## Maintained source and cache handling

`scripts/foca-bilingual.py` is the source for both pages. It resolves its project root from the script location, reads actual dimensions with Pillow and versions local photos, the supplied film/poster, CSS and JavaScript using content hashes. Dialogs inherit the same versioned image URLs. Replaced files therefore receive new URLs without renaming or recompressing the originals.

Run from the repository root:

```sh
python scripts/foca-bilingual.py
python scripts/foca-bilingual.py
git diff --check
node --check public/foca-foca/app.js
npm ci --no-audit --no-fund
npm run assets
npm run build
```

The generator was checked against the current pages before editing: it produced no diff, so no newer hand-maintained improvements were overwritten. A second generation after the update is identical. Menu data and existing contact/order URLs were compared programmatically with the prior commit and remain unchanged beyond the already-approved menu edits.

Reservations remain a locally prepared request message, with validation and explicit restaurant confirmation wording. No customer request is sent during QA. Dialog Tab/Shift+Tab cycling is explicit; Escape closes the dialog and restores focus to its opener.

## Verification and deployment record

Final source QA passed on commit `e06c82d226bb0d407c6600ed54a00951b0701e4e`: 617 assertions in Chromium 151.0.7922.34, both languages at 375, 390, 768 and 1440 px, with 48 captured screenshots. Source run: https://github.com/mariocarloschaves/web-pages-MCC-prototypes-/actions/runs/42518190819. Public-preview QA also passed all 617 assertions after deployment; see the verified release below.

Checks actually executed:

- `npm ci`, existing `npm run assets` (download/preparation of approved assets, no generation), production `npm run build`, `node --check`, Python compilation and `git diff --check`: pass.
- Generator ran twice with no additional diff; generated PT/EN files matched their copies in `dist/` byte-for-byte.
- All six updated dish cards and dialogs: expected asset URLs, natural/intrinsic dimensions, localized photo notes, keyboard opening/Tab cycling/Escape/focus restoration. Remaining illustration wording checked separately.
- Story portrait, all removals and exact additions/prices/descriptions, retained Cappuccinos and twelve focaccias, wine-table mobile fit.
- Search, category filters, empty results/reset, mobile navigation, sticky actions and language switching preserving section.
- Actual advancing video frames, source dimensions, muted inline loop, manual pause/resume, scroll/visibility persistence, initial and changed reduced-motion preferences; no lower-clip download at top-of-page arrival.
- Reservation invalid/valid/past-date cases and prepared SMS URL; nothing sent. Existing tel/SMS/map/order links retained.
- No JavaScript runtime errors, failed same-site requests or horizontal page overflow in the passing suite. The log records external hero-stream `ERR_ABORTED` events when tests navigate away/close pages; the hero remains unchanged.
- Public map and Uber Eats links returned HTTP 200. Instagram redirected to its login page, which is external-provider behavior; no sign-in or contact was attempted.
- Desktop/mobile screenshots inspected visually for all six food photos, story portrait, dialog, lower video and drinks/wine. No Lighthouse score, Safari or Firefox coverage is claimed.

The initial inspection found the preview serving an older Mortadella asset (102,130 bytes instead of 205,172) and returning HTTP 404 for the supplied MP4. The successful asset-import run did not trigger a deployment of its final commit. The existing `.github/workflows/pages.yml` publishes `dist/` with Foca Foca correctly nested at `/foca-foca/`; it must publish the tested main revision, not merely complete an asset job.

A Foca Foca-only regression workflow, `.github/workflows/foca-qa.yml`, runs `scripts/qa/foca-foca.py` with Playwright Chromium and uploads screenshots/results. Its QA dependencies are not part of the website bundle. Local browser launch was blocked by the workspace's socket restriction, so the browser suite runs in GitHub Actions.

### Verified preview release

- Verified source commit: `e06c82d226bb0d407c6600ed54a00951b0701e4e`, on `main`.
- GitHub Pages build **and deploy** succeeded: https://github.com/mariocarloschaves/web-pages-MCC-prototypes-/actions/runs/42518398100.
- Public-site browser QA succeeded: https://github.com/mariocarloschaves/web-pages-MCC-prototypes-/actions/runs/42518535971 (617 assertions, both languages, all four widths; 48 screenshots in the `foca-foca-qa` artifact).
- Downloaded and compared 21 actual public URLs against the tested source bytes: both HTML pages, CSS/JS, all referenced images including all seven replacements, MP4 and poster. All returned HTTP 200 and matched exactly. The supplied MP4 is now available at the existing repository base path; the old 404 is resolved.
- Public browser inspection confirmed the real Mortadella photo/dialog, localized PT/EN supplied-video captions, actual 512 × 910 playback and a working pause button. The preview opens without an account/login requirement.
- Live mobile/desktop screenshots were captured by the public QA run and reviewed visually. The code and all media remain identical in the documentation-only follow-up commit; its Pages deployment records that commit's exact SHA in Actions.
- No unresolved implementation or deployment issue was observed. The earlier keyboard-focus failure was fixed and re-tested successfully. No booking, message, order, paid generation, domain or billing action was performed.

## Genuine remaining client dependency

Real photos are still awaited for Golosa, Sole di Calabria, La Tonnata, Carciofara, Crudo & Búfala and Parma. Their products and existing illustrative images remain intact. Official launch/domain work is separate from this preview update.
