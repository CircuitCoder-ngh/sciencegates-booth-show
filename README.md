# Science Gates booth showcase

An animated, looping film for the **SCIENCEGATES SDN BHD** booth, with an interactive layer for answering visitor questions: tap a product for its photos, description, specifications, product sheets, brochures and a WhatsApp enquiry code; tap **Learn more** for a self-running deep dive into the chapter on screen; or tap **Explore** to search all 390 products from 37 principals, browse by principal or industry, open brochures, watch product videos or see the company and contact details.

The look follows sciencegates.com: the red contact strip and logo row along the top, ScienceGates red and green, Poppins throughout, green eyebrow labels, red uppercase headings, red pill buttons and the site's thin-bordered product cards. The five product scenes that open the film use the home page's own hero banners.

Everything runs locally. No internet connection is needed, except for the YouTube videos described below.

**Online preview:** https://circuitcoder-ngh.github.io/sciencegates-booth-show/ (for reviewing the show in a browser; at the booth, run the local copy so it does not depend on the venue's internet).

## Run it at the booth

1. Copy this whole folder to the booth laptop.
2. Double-click **`Start Booth Show.bat`**. It opens Chrome (or Edge) full screen in kiosk mode.
3. To leave kiosk mode, press **Alt+F4**.

You can also open `index.html` directly in Chrome or Edge and press **F** for full screen. The layout is a fixed 1920 × 1080 stage that scales to any screen size or aspect ratio.

## Set the event

Open `assets/js/data.js` and fill in `event` near the top, for example:

```js
const event = { name: "CEM Asia 2026", place: "Kuala Lumpur, Malaysia", dates: "17 to 19 November 2026", booth: "Booth 12" };
```

It appears in the top-right corner. With `name` left empty, the corner shows the tagline, *Partners in science*.

## Using it during a conversation

| Action | Mouse / touch | Keyboard |
| --- | --- | --- |
| Open a product | Tap any product picture, label, chip or card | |
| Deep dive into the chapter on screen | **Learn more** (bottom right) | L |
| Browse and search all products | **Explore** (bottom right) | E, or S to jump straight to the search box |
| Principals (all 37 brands) | Explore → Principals, or any brand tile | B |
| Industries | Explore → Industries, or any industry tile | I |
| Brochures (PDF) | Explore → Brochures, or the Documents list on a product | D |
| Product videos | Explore → Videos | V |
| About us, facility, sales network, vision and values | Explore → About us | A |
| Contact details and QR codes | Explore → Contact | C |
| Jump to a chapter | Tap a chapter name on the bottom line | 1–9, 0 |
| Pause / resume the film | Move the mouse to show the controls (top centre) | Space |
| Previous / next scene | Controls | ← / → |
| Back / close | Back, Close | Esc |
| Full screen | Controls | F |

**Product pages** show the product's photos (cycling through the gallery), its brand and category, the description and specification tables from sciencegates.com, and any **product sheets** (794 in all). Many products on the website describe themselves with datasheet images rather than text; those appear as product sheets. Tap one to read it full screen: tap to zoom in at that spot, drag to move around, tap again to fit, scroll to zoom in steps, ← / → for the next sheet. Every product page also has a **Scan to WhatsApp us** code that opens a WhatsApp chat with Science Gates, pre-filled with the product's name and web address, so visitors can follow up from their own phone.

**Learn more.** Every chapter except the closing one has a Learn more button. It pauses the film and plays a short slideshow (1 to 5 slides) that goes deeper: product features and specifications, the principal's story, product ranges, how-it-works steps, brochures, the sales network map, vision and values, and contact details. It runs and loops on its own; nobody needs to tap anything. The bar at the top shows where it is (tap a segment to jump). Anything on a slide can still be tapped; **Back** returns to the deep dive. **Return to slideshow** (or Esc) closes it and the film carries on where it paused. ← / → step through slides and Space pauses.

**Automatic return.** An open panel goes back to the film after 90 seconds without input (product sheets and brochures after 4 minutes), with a 10-second warning. A deep dive goes back after two full passes without input. A paused film resumes after 2 minutes. The cursor hides itself while the film plays.

## What's in the film (about 5 minutes, loops forever)

1. Opening: *Partners in science*, founded 2004, 37 principals, 390 products, 50+ years of leadership experience
2. Lab water: RephiLe, with the Genie G's 18.2 MΩ·cm ultrapure water and Type I, II and III systems
3. Filtration: Advantec filter papers and membranes (since 1916), RephiQuik and Wanox
4. Elemental: CKIC automatic calorimeters, with the 5E-C5808's 8-minute analysis
5. Climate: Pol-Eko climatic chambers and incubators
6. Specac pellet presses, powder to pellet
7. Sample preparation: Rocklabs crush, divide, pulverise, verify; then homogenisers, sieves, evaporators, spray dryers, ultrasonic baths and pumps
8. Heat: the temperature ladder from boiling baths to 1,850 °C furnaces (Nickel-Electro, Elite, LAC, KeJia)
9. Food, pharma and QC: Bellingham + Stanley, behr, Labindia, Alpha MOS
10. Measurement: Optika, PERSEE, Ohaus, Zehntner
11. Stack emissions: Apex Instruments isokinetic source sampling to MS 1596:2003 and US EPA methods
12. Air quality: Apex AIR series, AMS Analitica samplers, Shinagawa gas meters
13. Lab safety: Air Science ductless fume hoods, SICCO, Rodwell, Biobase
14. Sampling: Bürkle samplers and pumps
15. Principals: the wall of all 37 brands
16. Industries we serve
17. Sales and service network across Malaysia, and the Subang Jaya facility
18. Vision, mission and core values
19. Contact, with QR codes for sciencegates.com and WhatsApp

Readings shown in some scenes (calorific value, temperature and humidity, Brix, weights, air quality) are animated examples and are labelled as illustrative.

## Editing content

- **`assets/js/data.js`**: everything written by hand. Company facts, industries, chapters, which area each brand belongs to, brand countries, extra details for featured products, and the Learn more slides.
- **`assets/js/catalog.js`**: the product catalogue generated from sciencegates.com (brands, categories, products, photos, product sheets, descriptions, brochures and videos). It is large and machine-written; edit it only for small corrections, such as a product name.
- **Scene timing and wording:** each scene is a block in `assets/js/scenes.js` with its own `dur` (seconds).
- **Start on a particular scene** (handy for checking): `index.html?scene=heat` (ids: intro, water, filtration, elemental, climate, specac, prep, heat, qc, measure, stack, airq, safety, sampling, brands, industries, network, values, outro).
- **Learn more slides:** the `deep` block at the end of `data.js`, one entry per scene id. The slide layouts are listed in the comment above it. To check one, open `index.html?deep=water` (add `&slide=2` for its second slide).
- Other handy links: `index.html?explore=docs`, `index.html?product=4612131` (product ids are the ones in sciencegates.com product addresses), `index.html?brand=ckic`, `index.html?industry=food`.
- **Industry → brand suggestions** (`industries` in `data.js`) are an editorial starting point for the conversation, not a statement from the website. Adjust them to how the sales team talks about each industry.

## Documents and videos

`docs/` holds the 60 brochure PDFs attached to product pages on sciencegates.com, from Rocklabs, CKIC, RephiLe, Bellingham + Stanley, AMS Analitica, Apex Instruments, behr, PERSEE, Bandelin, Ludwig Schneider, Pol-Eko and Shinagawa. They open in a full-screen viewer inside the show; first-page previews are in `assets/thumbs/`.

The 42 product videos embedded on the website (mostly Bürkle, plus Alpha MOS, Labindia, Lab Plant and others) are on YouTube. In the show they open in a new browser window when there is internet; close it with Ctrl+W to come back. Their thumbnails and titles are stored locally, so the Videos tab looks complete offline.

## Folder layout

```
index.html              The show
Start Booth Show.bat    Kiosk launcher for Windows
assets/css/show.css     Styles matched to sciencegates.com (red, green, Poppins)
assets/js/data.js       Hand-written content: company, industries, chapters, Learn more
assets/js/catalog.js    Generated catalogue: 37 brands, 390 products
assets/js/malaysia.js   Malaysia states for the network map (geoBoundaries, CC BY 4.0)
assets/js/scenes.js     The 19 film scenes, plus the Learn more slide layouts
assets/js/app.js        Player, chapter line, product pages, Explore, drawers, sheet viewer, idle return
assets/img/             Logo, home page banners, About Us photo, YouTube thumbnails (yt/)
assets/prod/            Product photos (p-*) and card thumbnails (t-*), WebP
assets/sheets/          Product sheet images from the product pages, WebP
assets/thumbs/          First-page previews of the brochures
assets/fonts/           Poppins (SIL Open Font License), local copy
assets/vendor/          GSAP 3.12.5 animation library, qrcode-generator 1.4.4 (local copies)
docs/                   Brochure PDFs
```

## Sources

Content, photos, product sheets, brochures and video links were gathered from sciencegates.com in November 2026: the home page, About Us, Contact Us, the news page, all 100 category and brand pages and the 390 product pages listed in the site map. The map of Malaysia uses geoBoundaries ADM1 boundaries (CC BY 4.0). Brand countries are general knowledge, not from the website.
