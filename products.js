/* CASSIE Fragrances catalogue for the shop and product pages.
   Names, prices, sizes, notes, descriptions and images are taken from cassieperfumes.com (October 2026).
   "family" is our grouping from each product's published notes, for CASSIE to confirm; "for" follows
   the wording of each product's own description. Images load from the live shop, with a drawn bottle
   (fallback) if they can't be reached. */
(function () {
  const up = 'https://www.cassieperfumes.com/wp-content/uploads/';
  const shop = 'https://www.cassieperfumes.com/shop/';
  window.CASSIE_PRODUCTS = [
    {
      slug: 'oud-royale', collection: 'Luxury', name: 'Oud Royale', price: 269.10, size: null, category: 'Fragrance', for: 'Him', family: 'Woody & oud',
      line: 'Opulent oud for those who inherit, not just acquire.',
      description: 'Immerse your senses in the opulence of Royal Oud. This intoxicating fragrance is a tapestry of desire and dominance. A scent woven from the heart of ancient traditions and crafted for the modern king.',
      notes: null,
      images: [up + '2025/08/OUD-ROYALE-1.jpg', up + '2025/08/oud-royal-2.jpg', up + '2025/08/cassie-oud-royal.jpg'],
      url: shop + 'oud-royale-perfume-in-dubai/',
      fallback: { shape: 'facet', glass: 'noir', capColor: 'gold', label: 'OUD ROYALE', liquid: '#3a1d0c' }
    },
    {
      slug: 'africa-couture', name: 'Africa Couture', price: 198, size: 100, category: 'Fragrance', for: 'Unisex', family: 'Floral',
      line: 'A gender-fluid floral that leaves a trail.',
      description: 'Embark on a sensory journey with African Couture, a captivating, gender-fluid fragrance that elevates the ordinary to the extraordinary. Meticulously crafted to envelop you in its scent, this exquisite perfume leaves a trail that commands attention.',
      notes: { top: ['Lemon', 'Apple'], heart: ['Jasmine', 'Rose'], base: ['Dry wood', 'Oakmoss', 'Musk'] },
      images: [up + '2025/07/AFRICA-COUTURE.png', up + '2025/07/perfume-2a.png', up + '2025/07/perfume-01.jpg'],
      url: shop + 'africa-couture-perfumes/',
      fallback: { shape: 'column', glass: 'amber', capColor: 'gold', label: 'AFRICA', liquid: '#b06a2a' }
    },
    {
      slug: 'amor-loco', name: 'Amor Loco', price: 225, size: 100, category: 'Fragrance', for: 'Her', family: 'Floral',
      line: 'A burst of citrus over a heart of white florals.',
      description: 'Imagine a woman who glides through life with an air of quiet confidence. The fragrance itself is a captivating dance of contrasting elements: an intoxicating burst of citrus, then a heart of exquisite florals as it settles.',
      notes: { top: ['Bergamot', 'Pink peppercorns', 'Almond'], heart: ['Jasmine', 'Orange blossom', 'Tuberose'], base: ['Cocoa', 'Vanilla', 'Tonka bean'] },
      images: [up + '2025/08/perfume-8-1.png', up + '2025/08/perfume-8a.png', up + '2025/08/perfume-05.jpg'],
      url: shop + 'amor-loco-perfumes/',
      fallback: { shape: 'orb', glass: 'rose', capColor: 'rosegold', label: 'AMOR LOCO', liquid: '#f1b4a8' }
    },
    {
      slug: 'belle-mademoiselle', name: 'Belle Mademoiselle', price: 225, size: 100, category: 'Fragrance', for: 'Her', family: 'Floral',
      line: 'Parisian spring mornings, raspberry and magnolia.',
      description: 'Capture the Parisian je ne sais quoi with Belle Mademoiselle. A love letter to the carefree spirit of Parisian mornings, with a warm breeze carrying the whispers of springtime.',
      notes: { top: ['Raspberry', 'Lychee', 'Mandarin'], heart: ['Magnolia', 'Rose', 'Lily of the valley'], base: ['Ambroxan', 'Sugar', 'Vanilla'] },
      images: [up + '2025/08/perfume-3.png', up + '2025/08/perfume-3a.png', up + '2025/08/perfume-06.jpg'],
      url: shop + 'belle-mademoiselle-perfumes/',
      fallback: { shape: 'orb', glass: 'rose', capColor: 'gold', label: 'BELLE', liquid: '#f2c2c8' }
    },
    {
      slug: 'boujee', name: 'Boujee', price: 207, size: 75, category: 'Fragrance', for: 'Her', family: 'Floral',
      line: 'Plum, rose and caramel for the unapologetic.',
      description: 'A fragrance for the unapologetic. Boujee isn’t for the woman who blends into the background. It’s an olfactory adventure for the woman who dances to the beat of her own drum, a whisper of defiance wrapped in audacious elegance.',
      notes: { top: ['Plum', 'Lemon'], heart: ['Rose', 'Freesia', 'Jasmine'], base: ['Vanilla', 'Caramel', 'Musk'] },
      images: [up + '2025/08/perfume-4.png', up + '2025/08/perfume-4a.png', up + '2025/08/perfume-02.jpg'],
      url: shop + 'boujee-perfumes/',
      fallback: { shape: 'flacon', glass: 'rose', capColor: 'gold', label: 'BOUJEE', liquid: '#c9768a' }
    },
    {
      slug: 'central', name: 'Central', price: 170.10, size: 100, category: 'Fragrance', for: 'Him', family: 'Aromatic',
      line: 'Lavender, pine and sandalwood. Find your center.',
      description: 'Find your center. Attract your world. Central, our fragrance for the modern man, is the scent of shared moments, of laughter and of meaningful connections.',
      notes: { top: ['Nutmeg', 'Apple', 'Orange'], heart: ['Lavender', 'Geranium', 'Pine'], base: ['Sandalwood', 'Oakmoss', 'Dry wood'] },
      images: [up + '2025/08/perfume-5.png', up + '2025/08/perfume-5a.png', up + '2025/08/perfume-5b.png'],
      url: shop + 'central-perfumes/',
      fallback: { shape: 'column', glass: 'smoke', capColor: 'black', label: 'CENTRAL', liquid: '#6a5a44' }
    },
    {
      slug: 'indulge', name: 'Indulge – Choco Kunafa', price: 225, size: 75, category: 'Fragrance', for: 'Unisex', family: 'Gourmand',
      line: 'Chocolate and kunafa, gourmand and modern.',
      description: 'Indulge is an irresistible fragrance for men and women who love to stand out with a signature scent. Inspired by the rich decadence of chocolate and the sweetness of kunafa, it blends gourmand warmth with modern sophistication.',
      notes: null,
      images: [up + '2025/08/indulge-4.jpg', up + '2025/08/indulge-2.jpg', up + '2025/08/indulge-1.jpg'],
      url: shop + 'indulge-perfumes/',
      fallback: { shape: 'facet', glass: 'amber', capColor: 'gold', label: 'INDULGE', liquid: '#7a3f1d' }
    },
    {
      slug: 'legend', collection: 'Luxury', name: 'Legend', price: 342, size: 100, category: 'Fragrance', for: 'Him', family: '',
      line: 'Rare ingredients for the man who defies definition.',
      description: 'He is the enigma, the cypher, the man who defies definition. Legend is a fragrance as extraordinary as the man it embodies: a symphony of rare and precious ingredients that whispers secrets and ignites desire.',
      notes: null,
      images: [up + '2025/12/legend.jpg', up + '2025/07/legend-02-3.jpg', up + '2025/07/legend-02-2.jpg'],
      url: shop + 'legend-perfumes/',
      fallback: { shape: 'flacon', glass: 'noir', capColor: 'gold', label: 'LEGEND', liquid: '#2a1c10' }
    },
    {
      slug: 'lucid-dreams', collection: 'Luxury', name: 'Lucid Dreams', price: 315, size: 80, category: 'Fragrance', for: 'Unisex', family: 'Gourmand',
      line: 'A unisex vanilla for the dreamer in you.',
      description: 'Indulge in the graceful embrace of Lucid Dreams, a unisex fragrance that whispers promises of sweet reveries. Crafted for the dreamer in you, it is a symphony of vanilla that weaves enchantment into every moment.',
      notes: null,
      images: [up + '2025/12/Lucid-Dreams.jpg', up + '2025/07/Lucid-Dreams-1.jpg', up + '2025/07/Lucid-Dreams-03.jpg'],
      url: shop + 'lucid-dreams-perfumes/',
      fallback: { shape: 'slim', glass: 'frosted', capColor: 'silver', label: 'LUCID', liquid: '#e8d6b0' }
    },
    {
      slug: 'lush', name: 'Lush', price: 198, size: 100, category: 'Fragrance', for: 'Her', family: 'Floral',
      line: 'Pear, gardenia and sugared vanilla.',
      description: 'A symphony of sweetness. Lush is an exquisite elixir crafted for the woman who ignites desire. As it unfolds, a heart of resplendent florals awakens the senses, a prelude to an unforgettable evening.',
      notes: { top: ['Apple', 'Pear', 'Lemon'], heart: ['Gardenia', 'Jasmine'], base: ['Ambroxan', 'Vanilla', 'Sugar'] },
      images: [up + '2025/08/perfume-10.png', up + '2025/08/perfume-10a.png', up + '2025/08/perfume-10b.png'],
      url: shop + 'lush-perfumes-in-dubai/',
      fallback: { shape: 'orb', glass: 'clear', capColor: 'rosegold', label: 'LUSH', liquid: '#efc9a0' }
    },
    {
      slug: 'rizz', name: 'Rizz', price: 207, size: 75, category: 'Fragrance', for: 'Him', family: 'Woody & oud',
      line: 'Citrus, gaiac wood and amber. Owns the room.',
      description: 'Dare to be the Rizzler. He doesn’t need to say a word: a magnetic persona that draws everyone in. A symphony of notes that dance on the skin, leaving an unforgettable trail of allure.',
      notes: { top: ['Lemon', 'Lime'], heart: ['Elemi', 'Gaiac wood'], base: ['Cedarwood', 'Patchouli', 'Amber'] },
      images: [up + '2025/08/perfume-9.png', up + '2025/08/perfume-9a.png', up + '2025/08/perfume-9b.png'],
      url: shop + 'rizz-perfumes/',
      fallback: { shape: 'column', glass: 'smoke', capColor: 'black', label: 'RIZZ', liquid: '#4a3a2a' }
    },
    {
      slug: 'supremacy', collection: 'Luxury', name: 'Supremacy', price: 288, size: 100, category: 'Fragrance', for: 'Him', family: '',
      line: 'Everyday armour for the modern man.',
      description: 'Supremacy isn’t just a title; it’s a scent, crafted for the modern man who commands attention without demanding it. Not a perfume for special occasions: your everyday armour.',
      notes: null,
      images: [up + '2025/12/Supremecy-1.jpg', up + '2025/08/Supremecy-02.jpg', up + '2025/08/Supremecy-3-1.jpg'],
      url: shop + 'supremecy-perfumes/',
      fallback: { shape: 'facet', glass: 'noir', capColor: 'silver', label: 'SUPREMACY', liquid: '#2a2a2a' }
    },
    {
      slug: 'swave', name: 'Swave', price: 207, size: 100, category: 'Fragrance', for: 'Him', family: 'Aromatic',
      line: 'Lavender and sandalwood for the man who sets trends.',
      description: 'For the man who dares to be different. Swave isn’t just a fragrance; it’s a proclamation: the scent of power, ambition and undeniable charisma, crafted for the man who doesn’t follow trends but sets them.',
      notes: { top: ['Nutmeg', 'Apple', 'Orange'], heart: ['Lavender', 'Geranium', 'Pine'], base: ['Sandalwood', 'Oakmoss', 'Dry wood'] },
      images: [up + '2025/06/perfume-1-1.png', up + '2025/07/perfume-1a-2.png', up + '2025/07/perfume-1b-1.png'],
      url: shop + 'swave-perfumes/',
      fallback: { shape: 'flacon', glass: 'smoke', capColor: 'silver', label: 'SWAVE', liquid: '#5a4a3a' }
    },
    {
      slug: 'xcalibur', name: 'Xcalibur', price: 170.10, size: 100, category: 'Fragrance', for: 'Him', family: 'Spicy',
      line: 'Saffron, ginger and rose. Forged in legend.',
      description: 'Forged in legend, sealed in scent. Xcalibur, a fragrance as potent as destiny, is crafted for the man who commands respect: the courage of a warrior, the charisma of a leader and the allure of a king.',
      notes: { top: ['Saffron', 'Ginger', 'Lemon'], heart: ['Rose', 'Heliotrope'], base: ['Gaiac wood', 'Vanilla', 'Sugar'] },
      images: [up + '2025/08/perfume-6.png', up + '2025/08/perfume-6a.png', up + '2025/08/perfume-04.jpg'],
      url: shop + 'xcalibur-perfumes/',
      fallback: { shape: 'column', glass: 'amber', capColor: 'black', label: 'XCALIBUR', liquid: '#9b531c' }
    },
    {
      slug: 'xtreme', name: 'Xtreme', price: 198, size: 100, category: 'Fragrance', for: 'Him', family: 'Aromatic',
      line: 'Grapefruit, rosemary and leather. Wide open.',
      description: 'Unleash the wild from within. For the man who defies gravity to conquer the unknown, Xtreme is more than a fragrance; it’s an adrenaline rush, as fearless as the open road.',
      notes: { top: ['Plum', 'Pink peppercorns', 'Grapefruit'], heart: ['Lavender', 'Rosemary', 'Benzoin'], base: ['Dry wood', 'Vanilla', 'Leather'] },
      images: [up + '2025/08/perfume-7.png', up + '2025/08/perfume-7a.png', up + '2025/08/perfume-03.jpg'],
      url: shop + 'xtreme-perfumes/',
      fallback: { shape: 'flacon', glass: 'smoke', capColor: 'black', label: 'XTREME', liquid: '#3a3a3a' }
    },
    {
      slug: 'el-hombre', collection: 'Luxury', name: 'El Hombre', price: 315, size: null, category: 'Fragrance', for: 'Him', family: '',
      line: 'Description and notes to come from CASSIE.',
      description: '',
      notes: null,
      images: [up + '2025/12/El-Hombre.jpg', up + '2025/07/El-Ombre.jpg', up + '2025/07/El-Ombre-02-1.jpg'],
      url: shop + 'el-hombre-perfumes-dubai/',
      fallback: { shape: 'facet', glass: 'smoke', capColor: 'black', label: 'EL HOMBRE', liquid: '#4a3a2a' }
    },
    {
      slug: 'gift-set-pour-femme', name: 'Gift Set Pour Femme', price: 50, size: 20, category: 'Gift set', for: 'Her', family: '',
      line: 'Five 20 ml eau de parfum sprays in one box.',
      description: 'Five eau de parfum travel sprays, 20 ml (0.5 fl oz) each, in a single gift box.',
      notes: null,
      ingredients: 'Alcohol Denat, Parfum (Fragrance), Aqua (Dm Water), Linalool, Coumarin, Ethylhexyl Methoxycinnamate, Limonene, Hydroxycitronellal, Ethylhexyl Butyl Salicylate, Citronellol, Benzyl Alcohol. Of vegetal origin, 80% vol.',
      images: [up + '2025/09/Gift-04-1.png', up + '2025/09/Gift-05.png', up + '2025/09/Gift-06.png'],
      url: shop + 'gift-set-pour-femme-eau-de-parfum-e20ml-0-5-fl-oz-x-5pcs/',
      fallback: { shape: 'slim', glass: 'rose', capColor: 'rosegold', label: 'POUR FEMME', liquid: '#f0b4aa' }
    },
    {
      slug: 'gift-set-pour-homme', name: 'Gift Set Pour Homme', price: 50, size: 20, category: 'Gift set', for: 'Him', family: '',
      line: 'Five 20 ml eau de parfum sprays in one box.',
      description: 'Five eau de parfum travel sprays, 20 ml (0.5 fl oz) each, in a single gift box.',
      notes: null,
      ingredients: 'Alcohol Denat, Parfum (Fragrance), Aqua (Dm Water), Linalool, Coumarin, Ethylhexyl Methoxycinnamate, Limonene, Hydroxycitronellal, Ethylhexyl Butyl Salicylate, Citronellol, Benzyl Alcohol. Of vegetal origin, 80% vol.',
      images: [up + '2025/09/Gift-01-1.png', up + '2025/09/Gift-02.png', up + '2025/09/Gift-03.png'],
      url: shop + 'gift-set-pour-homme-eau-de-parfumen-e20ml-0-5-fl-oz-x-5pcs/',
      fallback: { shape: 'slim', glass: 'smoke', capColor: 'black', label: 'POUR HOMME', liquid: '#5a4a3a' }
    }
  ];
})();
