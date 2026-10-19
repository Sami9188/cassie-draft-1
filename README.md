# CASSIE Perfumes — Website Draft 1

First design direction for the CASSIE Perfumes website redesign, prepared by The Digital Elites for client review.

**Live preview:** https://sami9188.github.io/cassie-draft-1/
**Draft 2 (for comparison):** https://sami9188.github.io/cassie-draft-2/

## The idea

Draft 1's own structure and copy, styled by the rules of the CASSIE brand book: Porcelain ground, Vetiver for authority, Mist for glass and image grounds, Saffron kept to about 5%. Newsreader for display with one italic phrase per headline, Hanken Grotesk for text, IBM Plex Mono only for labels and data. The open-C monogram lockup, fine scent-trail lines, formula tags and 1.5px line icons are the graphic elements. Motion stays quiet: 10px fade-ins, a 2px button lift, and one scent trail that draws itself in the hero.

## Sections

1. Hero — manufacturing-first headline, bottle composition on Mist
2. Key figures (placeholders)
3. What we manufacture — OEM, ODM, private/white label, bulk supply & export
4. Manufacturing process — six steps
5. Packaging configurator — bottle, cap, finish and glass, with "Quote this configuration" feeding the RFQ
6. Quality & compliance hub
7. Portfolio (anonymised)
8. Four-step request for quotation with sample-kit option, footer, WhatsApp button

## Pages

- `index.html` — home (sections above)
- `about.html` — story, company facts, how we work, leadership, CASSIE Fragrances and distributor link
- `contact.html` — phone, email, WhatsApp, office and factory, contact form (`?topic=distributor` preselects the topic), quick routes and FAQ

The header and footer are copied from `index.html` into the inner pages; change them in all three files.

## Notes

- Static HTML/CSS/JS, no build step, no external libraries. Fonts load from Google Fonts.
- Figures marked with a sand-coloured chip are placeholders and must be confirmed by CASSIE.
- Forms are front-end demos; CRM / email wiring is part of the build phase.
