# Graphic World Ltd: website

Static site (no build step). Upload the whole folder to any host (cPanel, Netlify, Vercel, GitHub Pages) and point **graphicworldgroup.com** at it.

```
index.html                page content
css/styles.css            design (brand colours at the top)
js/main.js                WhatsApp links, quote form, service slide-in animation
assets/logo.webp          client logo (transparent)
assets/banner.webp        client banner: shown as-is at the top on desktop
assets/banner-mobile.jpg  portrait banner: top of the page on phones, and beside "How it works" on desktop
assets/services/          the 4 service images (flattened onto white and compressed from the PNGs in the project folder;
                          the van's cut-off wheels were rebuilt and a ground shadow added)
assets/work/              12 recent project photos from @graphicworldltd on Instagram (each tile links to its post)
```

The large PNGs in the project root are the originals and don't need to be uploaded.

All prices are on request. Every service links to the quote form with that service pre-selected.

## Updating "Recent projects"
Each tile in `index.html` is an `<a class="work">` with an image in `assets/work/`, a caption, and a link to the Instagram post.
To add a job, copy a tile, change the image, caption and link. Tiles are 4:3, and `object-position` on the `<img>` sets which part of a tall photo stays in frame.

## Before launch: confirm with the client
- [ ] **WhatsApp number**: set in `js/main.js` (`WA_NUMBER`, currently 254722442724)
- [ ] **Project photos & client names**: the 12 photos are from their own Instagram. Confirm they're happy to show these jobs and to name the brands (flydubai, Kohler, Swahilipot Hub, Al-Husnain Motors, eMOS, Chop It, Bread·Tin, NATO, Go Jump Kenya). Original files would also be sharper than the Instagram copies.
- [ ] **Full third phone number** (0798 123 …) and opening hours, if they want them shown
- [ ] **Map pin**: currently searches "Simu ya Upepo Road". Swap in the exact Google Maps embed for the shop.
