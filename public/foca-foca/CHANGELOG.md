# Changelog

## 2026-11-08 — Client-media finishing and QA

- Preserved the approved rounded controls, brand styling, layout, contact/order links and hero film.
- Verified seven supplied photo mappings and actual dimensions; kept all media bytes intact.
- Kept complete food photographs in cards/dialogs, both people in the story crop, and corrected localized photo/illustration notes.
- Added content-hash cache versions to photos, lower video/poster, CSS and JavaScript.
- Reframed the silent 512 × 910 supplied clip in a compact portrait container with accurate labels and team-supplied caption.
- Added accessible Play/Pause, lazy playback, persistent deliberate pause, reduced-motion handling and a native no-JavaScript fallback.
- Added explicit dialog keyboard focus cycling after QA caught focus escaping the dialog.
- Kept the bilingual generator authoritative and reproducible; no drift on a second generation.
- Added scoped Chromium checks and mobile/desktop screenshot artifacts. Source and live-preview results are recorded below.

### Verified release and results

- Implementation/source commit: `e06c82d226bb0d407c6600ed54a00951b0701e4e`.
- Production build and existing Pages deployment passed ([run 42518398100](https://github.com/mariocarloschaves/web-pages-MCC-prototypes-/actions/runs/42518398100)).
- Source QA: 617 passing assertions; public-preview QA: 617 passing assertions, Chromium 151.0.7922.34, PT/EN at 375/390/768/1440 px ([live run 42518535971](https://github.com/mariocarloschaves/web-pages-MCC-prototypes-/actions/runs/42518535971)). Each final run captured 48 screenshots; changed areas were visually reviewed.
- Confirmed exact source bytes on 21 public page/asset URLs, all HTTP 200, including the seven supplied images and previously missing MP4/poster. Browser playback/pause and localized captions verified on the public preview.
- Production build, generator reproducibility, image/media metadata, no same-site missing requests, no JavaScript runtime errors, no horizontal overflow, menu interactions, keyboard/focus, reservation validation, language switching, sticky actions and reduced motion passed. No requests were sent to the restaurant.
- Earlier QA caught dialog focus escaping and it was fixed. Browser logs include cancelled external hero streams during page navigation; no change to that film. Safari, Firefox and Lighthouse were not run.
- Documentation-only follow-up preserves the tested frontend and media. The six remaining real food photos are the only outstanding client-content dependency; official domain/launch work remains outside this preview task.

## 2026-11-08 — Client content import

- Replaced La Parmigiana, Mortadella, Messico & Nuvole, Napoli, Caprese 2.0 and Del Giorno images with client photography.
- Replaced story image with Gabriele + Janainy portrait.
- Imported `media/camada-a-camada.mp4` and `media/camada-a-camada-poster.jpg` for the lower section.
- Removed Cornetto simples, Cornetto recheado, Sfogliatella napolitana and Cappuccino com pistáchio (plus English equivalents).
- Added Cynar Spritz (€8.00), Estrella Bock Damm (€3.50), and Barbera d’Alba — Tinto/Red · Egidio 2023 (€6.00 glass / €23.00 bottle).
- Cynar descriptions: PT “Herbal e ligeiramente amargo. Uma tradição do aperitivo veneto.”; EN “Herbal and slightly bitter. A tradition of the Veneto aperitivo.”
- Synchronized Portuguese and English menu data and documented remaining real photos.
- Import commit: `5c5c855fd884426f69cc601512fafb075303a9e5`. Initial follow-up inspection established that this asset-import commit had not deployed: the live MP4 returned 404 and the old food image remained served. Import success alone was not website completion.
