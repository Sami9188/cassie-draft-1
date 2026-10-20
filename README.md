# CASSIE Perfumes — Website Draft 1

First design direction for the CASSIE Perfumes website redesign, prepared by The Digital Elites for client review.

**Live preview:** https://sami9188.github.io/cassie-draft-1/
**Draft 2 (for comparison):** https://sami9188.github.io/cassie-draft-2/

## The idea

Draft 1's own structure and copy, styled by the rules of the CASSIE brand book: Porcelain ground, Vetiver for authority, Mist for glass and image grounds, Saffron kept to about 5%. Bodoni Moda for display with one italic phrase per headline, Inter Tight for text and for spaced capitals on labels and data. The open-C monogram lockup, formula tags and 1.5px line icons are the graphic elements. Motion stays quiet: 10px fade-ins, a 2px button lift, and a perfume spray from the hero bottle every few seconds plus one spray entering the Process section from the left edge (`mist.js`, canvas particle mist that pauses off-screen). Headlines rise word by word, lists stagger in, a notes marquee runs under the stats, and portfolio cards tilt. Everything is off with reduced motion.

## Sections

1. Hero — manufacturing-first headline, spraying bottle composition
2. Key figures (placeholders)
3. What we manufacture — OEM, ODM, private/white label, bulk supply & export
4. Manufacturing process — six steps
5. Packaging configurator — bottle, cap, finish and glass, with "Quote this configuration" feeding the RFQ
6. Inside the atelier — six illustrated tiles (factory, lab, bottles, raw materials, people, finishing)
7. Sample kit and spec sheet
8. Portfolio (anonymised)
9. Four-step request for quotation with sample-kit option, footer, WhatsApp button

## Pages

- `index.html` — home (sections above)
- `about.html` — story, company facts, how we work, leadership, CASSIE Fragrances and distributor link
- `contact.html` — phone, email, WhatsApp, office and factory, contact form (`?topic=distributor` preselects the topic), quick routes and FAQ

The header and footer are copied from `index.html` into the inner pages; change them in all three files.

## Notes

- Static HTML/CSS/JS, no build step, no external libraries. Fonts load from Google Fonts.
- Figures marked with a sand-coloured chip are placeholders and must be confirmed by CASSIE.
- Forms are front-end demos; CRM / email wiring is part of the build phase.

## Themes

A switch at the bottom left swaps between **Vetiver** (default) and **Rouge Atelier** (oxblood, pearl, blush and rose-copper, rounder corners and pill buttons). The choice is remembered per visitor, and `?theme=rouge` on any URL opens a page in Rouge. Colours live as tokens on `:root` and `:root[data-theme="rouge"]` in `style.css`; the illustrations in `atelier/` come in a `-vetiver` and a `-rouge` file and are swapped by `main.js`.
