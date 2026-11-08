# Foca Foca — MCC project record

## Current baseline
This folder is the maintained Foca Foca website inside the MCC prototypes repository. The visual baseline was the approved rounded-controls build from 26 September 2026.

## Client update mapped and applied — 8 November 2026

### Supplied photography
The client-supplied photographs are mapped to the existing menu assets so menu cards and dish-detail dialogs continue to use the same stable paths:

- La Parmigiana → `images/dish-la-parmigiana.webp`
- Mortadella → `images/dish-mortadella.webp`
- Messico & Nuvole → `images/dish-messico-nuvole.webp`
- Napoli → `images/dish-napoli.webp`
- Caprese 2.0 → `images/dish-caprese.webp`
- Del Giorno → `images/dish-del-giorno.webp`
- Gabriele + Janainy portrait → `images/foca-02.webp` in the story section

The remaining focaccia images stay on the existing illustrative assets until the client supplies real photographs.

### Menu removals
Removed because the client confirmed they are no longer offered:
- Cornetto simples / Plain cornetto
- Cornetto recheado / Filled cornetto
- Sfogliatella napolitana / Neapolitan sfogliatella
- Cappuccino com pistáchio / Pistachio cappuccino

### Menu additions
- Cynar Spritz — €8.00
  - PT: “Herbal e ligeiramente amargo. Uma tradição do aperitivo veneto.”
  - EN: “Herbal and slightly bitter. A tradition of the Veneto aperitivo.”
- Estrella Bock Damm — €3.50
- Barbera d’Alba — Tinto / Red, Egidio 2023 — glass €6.00, bottle €23.00

### Video
The “Camada a camada / Layer by layer” section now uses the client-supplied local video:
- `media/camada-a-camada.mp4`
- `media/camada-a-camada-poster.jpg`

The previous external concept-film URL is no longer used in that section.

### Language/source consistency
Both `index.html` (PT) and `en.html` (EN) are updated. The generator `scripts/foca-bilingual.py` is updated in the same commit so regeneration will preserve these client changes.

## Pending client content
- Real photographs for the remaining focaccias, when Gabriele sends them.
- Final pre-launch verification of menu availability/prices.
- Removal/rewording of the prototype/concept disclaimer when the project is formally promoted to the official production site.
- Production domain/deployment work for `focafoca.pt` when approved.

## Asset policy
Original replaced assets remain recoverable through Git history. Client images are re-encoded as optimized WebP for web delivery; the supplied short video is re-encoded for lower bandwidth while retaining the original vertical composition.
