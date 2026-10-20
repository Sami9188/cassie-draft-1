/* Shop listing (shop.html) and product detail (product.html?p=slug), rendered from products.js. */
(function () {
  const all = window.CASSIE_PRODUCTS || [];
  const aed = function (n) { return 'AED ' + n.toFixed(2).replace(/\.00$/, ''); };
  const esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  const sizeLabel = function (p) { return p.size ? p.size + ' ml' : ''; };
  const meta = function (p) { return [p.family, sizeLabel(p)].filter(Boolean).join(' · ') || p.category; };

  function card(p) {
    const second = p.images[1] ? '<img class="alt" src="' + p.images[1] + '" alt="" loading="lazy">' : '';
    return '<a class="pcard reveal" href="product.html?p=' + p.slug + '">' +
      '<div class="pcard-img"><img src="' + p.images[0] + '" alt="' + esc(p.name) + ' perfume" loading="lazy" data-fallback=\'' + JSON.stringify(p.fallback) + '\'>' + second +
      (p.category === 'Gift set' ? '<span class="pcard-flag">Gift set</span>' : '') + '</div>' +
      '<div class="pcard-body"><h3>' + esc(p.name) + '</h3><p class="pcard-meta">' + esc(meta(p)) + '</p><p class="pcard-price">' + aed(p.price) + '</p></div></a>';
  }
  function reveal(scope) {
    // cards are added after main.js set up its observer, so fade them in here
    requestAnimationFrame(function () {
      scope.querySelectorAll('.reveal').forEach(function (el, i) { el.style.setProperty('--d', Math.min(i, 8) * 60 + 'ms'); el.classList.add('in'); });
    });
    window.attachBottleFallbacks && window.attachBottleFallbacks();
    // a failed main image takes the hover image down with it
    scope.querySelectorAll('.pcard-img img.alt').forEach(function (alt) {
      alt.addEventListener('error', function () { alt.remove(); }, { once: true });
    });
  }

  /* ---------- Carousel (about.html) ---------- */
  const car = document.getElementById('shopCarousel');
  if (car) {
    car.innerHTML = all.map(card).join('').replace(/pcard reveal/g, 'pcard');
    reveal(car);
    if (window.initCarousel) window.initCarousel(car.closest('.carousel'));
  }

  /* ---------- Listing ---------- */
  const grid = document.getElementById('productGrid');
  if (grid) {
    const state = { collection: new Set(), category: new Set(), for: new Set(), family: new Set(), size: new Set(), q: '', max: 350, sort: 'featured' };
    const groups = {
      collection: ['Luxury'],
      category: ['Fragrance', 'Gift set'],
      for: ['Him', 'Her', 'Unisex'],
      family: ['Floral', 'Woody & oud', 'Aromatic', 'Gourmand', 'Spicy'],
      size: [20, 75, 80, 100]
    };
    const labelFor = function (key, v) {
      if (key === 'size') return v + ' ml';
      if (key === 'category') return v === 'Fragrance' ? 'Fragrances' : 'Gift sets';
      if (key === 'collection') return 'Luxury collection';
      return v;
    };
    const valueOf = function (p, key) { return key === 'size' ? p.size : p[key]; };

    // filters read from and write to the URL, so a filtered view can be shared
    const params = new URLSearchParams(location.search);
    Object.keys(groups).forEach(function (key) {
      (params.get(key) || '').split(',').filter(Boolean).forEach(function (v) { state[key].add(key === 'size' ? +v : v); });
    });

    // header: Luxury and Gift Sets are filtered views of the shop
    const navView = state.collection.has('Luxury') ? 'collection=Luxury' : (state.category.has('Gift set') && state.category.size === 1 ? 'category=Gift%20set' : '');
    if (navView) document.querySelectorAll('.nav-links a').forEach(function (a) {
      const href = a.getAttribute('href');
      if (href === 'shop.html') a.removeAttribute('aria-current');
      if (href === 'shop.html?' + navView) a.setAttribute('aria-current', 'page');
    });

    Object.keys(groups).forEach(function (key) {
      const box = document.querySelector('[data-filter="' + key + '"]');
      box.innerHTML = groups[key].map(function (v) {
        const n = all.filter(function (p) { return valueOf(p, key) === v; }).length;
        return '<label class="fopt"><input type="checkbox" value="' + v + '"' + (state[key].has(v) ? ' checked' : '') + '><span>' + labelFor(key, v) + '</span><em>' + n + '</em></label>';
      }).join('');
      box.addEventListener('change', function (e) {
        const v = key === 'size' ? +e.target.value : e.target.value;
        if (e.target.checked) state[key].add(v); else state[key].delete(v);
        render();
      });
    });

    const search = document.getElementById('shopSearch');
    const sort = document.getElementById('shopSort');
    const price = document.getElementById('priceMax');
    const priceOut = document.getElementById('priceOut');
    search.addEventListener('input', function () { state.q = search.value.trim().toLowerCase(); render(); });
    sort.addEventListener('change', function () { state.sort = sort.value; render(); });
    price.addEventListener('input', function () { state.max = +price.value; render(); });

    function clearAll() {
      Object.keys(groups).forEach(function (k) { state[k].clear(); });
      document.querySelectorAll('.fopt input').forEach(function (i) { i.checked = false; });
      state.q = ''; search.value = ''; state.max = 350; price.value = 350;
      render();
    }
    document.getElementById('clearFilters').addEventListener('click', clearAll);
    document.getElementById('emptyClear').addEventListener('click', clearAll);

    // phone: filters slide in as a panel
    const panel = document.getElementById('filters');
    const toggle = document.getElementById('filtersToggle');
    const setOpen = function (open) { panel.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); document.body.classList.toggle('filters-open', open); };
    toggle.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
    document.getElementById('filtersDone').addEventListener('click', function () {
      setOpen(false);
      const top = document.querySelector('.results').getBoundingClientRect().top + window.scrollY - 80;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
    });

    document.getElementById('activeChips').addEventListener('click', function (e) {
      const b = e.target.closest('button[data-key]');
      if (!b) return;
      const key = b.dataset.key;
      if (key === 'max') { state.max = 350; price.value = 350; }
      else if (key === 'q') { state.q = ''; search.value = ''; }
      else {
        const v = key === 'size' ? +b.dataset.val : b.dataset.val;
        state[key].delete(v);
        const input = document.querySelector('[data-filter="' + key + '"] input[value="' + b.dataset.val + '"]');
        if (input) input.checked = false;
      }
      render();
    });

    const results = document.querySelector('.results');
    let first = true;
    function render() {
      let list = all.filter(function (p) {
        for (const key of Object.keys(groups)) if (state[key].size && !state[key].has(valueOf(p, key))) return false;
        if (p.price > state.max) return false;
        if (state.q) {
          const hay = [p.name, p.family, p.line, p.for, p.notes ? [].concat(p.notes.top, p.notes.heart, p.notes.base).join(' ') : ''].join(' ').toLowerCase();
          if (hay.indexOf(state.q) === -1) return false;
        }
        return true;
      });
      if (state.sort === 'price-asc') list = list.slice().sort(function (a, b) { return a.price - b.price; });
      if (state.sort === 'price-desc') list = list.slice().sort(function (a, b) { return b.price - a.price; });
      if (state.sort === 'name') list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });

      grid.innerHTML = list.map(card).join('');
      reveal(grid);
      document.getElementById('emptyState').hidden = list.length > 0;
      document.getElementById('resultCount').textContent = list.length + (list.length === 1 ? ' fragrance' : ' fragrances');
      priceOut.textContent = 'AED ' + state.max;

      const chips = [];
      Object.keys(groups).forEach(function (key) {
        state[key].forEach(function (v) { chips.push('<button type="button" data-key="' + key + '" data-val="' + v + '">' + labelFor(key, v) + ' <span aria-hidden="true">×</span></button>'); });
      });
      if (state.max < 350) chips.push('<button type="button" data-key="max">Up to AED ' + state.max + ' <span aria-hidden="true">×</span></button>');
      if (state.q) chips.push('<button type="button" data-key="q">“' + esc(state.q) + '” <span aria-hidden="true">×</span></button>');
      document.getElementById('activeChips').innerHTML = chips.join('');
      const n = chips.length;
      document.getElementById('filterCount').textContent = n ? '(' + n + ')' : '';

      const q = new URLSearchParams();
      Object.keys(groups).forEach(function (key) { if (state[key].size) q.set(key, Array.from(state[key]).join(',')); });
      const theme = new URLSearchParams(location.search).get('theme');
      if (theme) q.set('theme', theme);
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q.toString() : ''));

      // a shorter list shouldn't leave the visitor looking at the footer: bring the top of the results back into view
      if (!first && !panel.classList.contains('open')) {
        const top = results.getBoundingClientRect().top + window.scrollY - 96;
        if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
      }
      first = false;
    }
    render();
  }

  /* ---------- Product page ---------- */
  const pdp = document.getElementById('pdp');
  if (pdp) {
    const slug = new URLSearchParams(location.search).get('p');
    const p = all.find(function (x) { return x.slug === slug; }) || all[0];
    document.title = p.name + ' | CASSIE Fragrances';
    document.getElementById('crumbName').textContent = p.name;
    document.getElementById('pdpName').textContent = p.name;
    document.getElementById('pdpEyebrow').textContent = p.category === 'Gift set' ? 'CASSIE Gift sets' : 'CASSIE Fragrances';
    document.getElementById('pdpLine').textContent = p.line;
    document.getElementById('pdpPrice').innerHTML = aed(p.price) + (p.size ? ' <span>· ' + sizeLabel(p) + '</span>' : '');
    document.getElementById('pdpTags').innerHTML = [p.for === 'Unisex' ? 'Unisex' : 'For ' + p.for.toLowerCase(), p.family, p.category === 'Gift set' ? '5 × 20 ml' : 'Eau de parfum'].filter(Boolean)
      .map(function (t) { return '<span class="formula-tag"><span>' + esc(t) + '</span></span>'; }).join('');
    document.getElementById('liveLink').href = p.url;
    document.getElementById('pdpDesc').innerHTML = p.description ? '<p>' + esc(p.description) + '</p>' : '<p><span class="tbc">Description to come from CASSIE</span></p>';
    if (p.ingredients) { document.getElementById('ingredientsAcc').hidden = false; document.getElementById('pdpIngredients').textContent = p.ingredients; }

    const notes = document.getElementById('pdpNotes');
    if (p.notes) {
      notes.innerHTML = '<h2 class="pdp-sub">Notes</h2><div class="pyramid">' + ['top', 'heart', 'base'].map(function (k, i) {
        return '<div class="tier tier-' + k + '" style="--i:' + i + '"><b>' + { top: 'Top', heart: 'Heart', base: 'Base' }[k] + '</b><span>' + p.notes[k].map(esc).join(' · ') + '</span></div>';
      }).join('') + '</div>';
    } else notes.remove();

    // gallery
    const main = document.getElementById('galleryMain');
    const thumbs = document.getElementById('galleryThumbs');
    let custom = '';
    const customCfg = function () {
      return Object.assign({}, p.fallback, custom ? { label: custom, sub: p.name.replace(/ –.*/, '').toUpperCase() } : {});
    };
    const show = function (i) {
      if (i === 'custom') {
        main.innerHTML = '<div class="gallery-custom">' + window.bottleSVG(customCfg()) + '</div>';
      } else {
        main.innerHTML = '<img src="' + p.images[i] + '" alt="' + esc(p.name) + ', image ' + (i + 1) + '" data-fallback=\'' + JSON.stringify(p.fallback) + '\'>';
        window.attachBottleFallbacks && window.attachBottleFallbacks();
      }
      main.dataset.view = i;
      thumbs.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.view === String(i)); });
    };
    thumbs.innerHTML = p.images.map(function (src, i) {
      return '<button type="button" role="tab" data-view="' + i + '" aria-label="Image ' + (i + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>';
    }).join('') + '<button type="button" role="tab" data-view="custom" class="thumb-custom" aria-label="Your name on the bottle">' + window.bottleSVG(customCfg()) + '<span>Your name</span></button>';
    thumbs.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { show(b.dataset.view === 'custom' ? 'custom' : +b.dataset.view); });
      const img = b.querySelector('img');
      if (img) img.addEventListener('error', function () { b.remove(); }, { once: true });
    });
    show(0);

    // name on the label: typing switches the main view to the drawn bottle and writes the name on it
    const nameInput = document.getElementById('pdpLabel');
    const thumbCustom = thumbs.querySelector('.thumb-custom');
    nameInput.addEventListener('input', function () {
      custom = nameInput.value.trim().toUpperCase();
      const svg = main.querySelector('.gallery-custom');
      if (svg) svg.innerHTML = window.bottleSVG(customCfg()); else show('custom');
      thumbCustom.innerHTML = window.bottleSVG(customCfg()) + '<span>Your name</span>';
    });

    // light zoom that follows the pointer
    main.addEventListener('pointermove', function (e) {
      const r = main.getBoundingClientRect();
      main.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      main.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });

    // quantity and bag
    const qty = document.getElementById('qty');
    document.querySelectorAll('[data-qty]').forEach(function (b) {
      b.addEventListener('click', function () { qty.value = Math.max(1, Math.min(20, (+qty.value || 1) + +b.dataset.qty)); });
    });
    const toast = document.getElementById('toast');
    document.getElementById('addToBag').addEventListener('click', function () {
      const n = +qty.value || 1;
      toast.innerHTML = n + ' × ' + esc(p.name) + (custom ? ' with “' + esc(custom) + '” on the label' : '') + ' added. In the live site this goes to the CASSIE checkout.';
      toast.hidden = false;
      clearTimeout(toast._t);
      toast._t = setTimeout(function () { toast.hidden = true; }, 4200);
    });

    // related: same family first, then same audience
    const others = all.filter(function (x) { return x.slug !== p.slug; });
    const rel = others.filter(function (x) { return p.family && x.family === p.family; })
      .concat(others.filter(function (x) { return x.for === p.for && x.family !== p.family; }))
      .concat(others).filter(function (x, i, arr) { return arr.indexOf(x) === i; }).slice(0, 4);
    if (!p.family) document.querySelector('.related-head h2').innerHTML = 'More from <em>CASSIE.</em>';
    const relGrid = document.getElementById('relatedGrid');
    relGrid.innerHTML = rel.map(card).join('');
    reveal(relGrid);
  }
})();
