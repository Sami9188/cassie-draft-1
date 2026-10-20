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

    // filter dropdowns: one open at a time, placed under their button (fixed, so the scrolling bar never clips them)
    const bar = document.getElementById('filters');
    const drops = Array.from(bar.querySelectorAll('.fdrop'));
    const place = function (d) {
      const btn = d.querySelector('.fdrop-btn').getBoundingClientRect();
      const panel = d.querySelector('.fdrop-panel');
      const w = panel.offsetWidth;
      panel.style.top = (btn.bottom + 8) + 'px';
      panel.style.left = Math.max(16, Math.min(btn.left, window.innerWidth - w - 16)) + 'px';
    };
    const closeAll = function (except) {
      drops.forEach(function (d) {
        if (d === except) return;
        d.classList.remove('open');
        d.querySelector('.fdrop-btn').setAttribute('aria-expanded', 'false');
      });
    };
    drops.forEach(function (d) {
      d.querySelector('.fdrop-btn').addEventListener('click', function () {
        const open = !d.classList.contains('open');
        closeAll(d);
        d.classList.toggle('open', open);
        this.setAttribute('aria-expanded', open);
        if (open) place(d);
      });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.fdrop')) closeAll(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
    const reposition = function () {
      drops.forEach(function (d) { if (d.classList.contains('open')) place(d); });
      bar.classList.toggle('stuck', bar.getBoundingClientRect().top <= 70);
    };
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition);
    bar.querySelector('.fbar-drops').addEventListener('scroll', reposition, { passive: true });
    reposition();

    // quick links in the hero filter in place
    document.querySelectorAll('.shop-hero-links a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const q = new URLSearchParams(a.getAttribute('href').slice(1));
        Object.keys(groups).forEach(function (k) { state[k].clear(); });
        q.forEach(function (v, k) { if (state[k]) state[k].add(v); });
        document.querySelectorAll('.fopt input').forEach(function (i) {
          const k = i.closest('[data-filter]').dataset.filter;
          i.checked = state[k].has(k === 'size' ? +i.value : i.value);
        });
        render();
        window.scrollTo({ top: catalogueTop(), behavior: 'smooth' });
      });
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

    const catalogueTop = function () { return document.getElementById('catalogue').getBoundingClientRect().top + window.scrollY - 68; };
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
      document.getElementById('clearFilters').hidden = !chips.length;
      Object.keys(groups).forEach(function (key) {
        const badge = bar.querySelector('[data-badge="' + key + '"]');
        badge.textContent = state[key].size || '';
      });
      bar.querySelector('[data-badge="max"]').textContent = state.max < 350 ? '≤ ' + state.max : '';

      const q = new URLSearchParams();
      Object.keys(groups).forEach(function (key) { if (state[key].size) q.set(key, Array.from(state[key]).join(',')); });
      const theme = new URLSearchParams(location.search).get('theme');
      if (theme) q.set('theme', theme);
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q.toString() : ''));

      // a shorter list shouldn't leave the visitor looking at the footer: bring the filter bar back to the top
      if (!first) {
        const top = catalogueTop();
        if (window.scrollY > top + 2) window.scrollTo({ top: top, behavior: 'smooth' });
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
    const gift = p.category === 'Gift set';
    const conc = gift ? 'Five 20 ml eau de parfum sprays' : 'Eau de parfum';
    document.title = p.name + ' | CASSIE Fragrances';
    document.getElementById('crumbName').textContent = p.name;
    document.getElementById('pdpName').textContent = p.name;
    document.getElementById('pdpEyebrow').textContent = p.collection ? 'Luxury collection' : (gift ? 'CASSIE Gift sets' : 'CASSIE Fragrances');
    document.getElementById('pdpLine').textContent = p.line;
    document.getElementById('pdpPrice').textContent = aed(p.price);
    document.getElementById('pdpConc').textContent = conc;
    document.getElementById('pdpFacts').innerHTML = [
      ['For', p.for === 'Unisex' ? 'Everyone' : p.for],
      ['Family', p.family],
      ['Size', gift ? '5 × 20 ml' : sizeLabel(p)],
      ['Type', gift ? 'Gift set' : 'EDP']
    ].filter(function (f) { return f[1]; }).map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
    if (gift || p.size) document.getElementById('pdpSizes').innerHTML = '<button type="button" aria-pressed="true">' + esc(gift ? '5 × 20 ml' : sizeLabel(p)) + '</button>';
    else document.querySelector('.pdp-option').remove();
    document.getElementById('liveLink').href = p.url;
    document.getElementById('pdpDesc').innerHTML = p.description ? '<p>' + esc(p.description) + '</p>' : '<p><span class="tbc">Description to come from CASSIE</span></p>';
    if (p.ingredients) { document.getElementById('ingredientsAcc').hidden = false; document.getElementById('pdpIngredients').textContent = p.ingredients; }

    // the story band leads with the first line of the description
    const first = (p.description || p.line).split(/(?<=[.!?])\s/)[0];
    document.getElementById('pdpQuote').textContent = first;
    const notes = document.getElementById('pdpNotes');
    if (p.notes) {
      notes.innerHTML = '<p class="eyebrow">Notes</p><div class="note-cols">' + ['top', 'heart', 'base'].map(function (k, i) {
        return '<div class="note-col reveal" style="--d:' + (i * 120) + 'ms"><span class="note-num">0' + (i + 1) + '</span><h3>' + { top: 'Top', heart: 'Heart', base: 'Base' }[k] + '</h3><p>' + { top: 'The first impression', heart: 'Once it settles', base: 'What stays on skin' }[k] + '</p><ul>' + p.notes[k].map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>';
    } else notes.innerHTML = '<p class="eyebrow">Notes</p><p class="note-tbc">The note breakdown for ' + esc(p.name) + ' is to come from CASSIE.</p>';
    reveal(notes);

    // gallery: rail of thumbnails, arrows and a counter
    const main = document.getElementById('galleryMain');
    const thumbs = document.getElementById('galleryThumbs');
    const counter = document.getElementById('galleryCount');
    let current = 0;
    const available = function () { return Array.from(thumbs.querySelectorAll('button')); };
    const show = function (i) {
      const list = available();
      const n = Math.max(1, list.length);
      current = (i + n) % n;
      const idx = list[current] ? +list[current].dataset.i : 0;
      main.innerHTML = '<img src="' + p.images[idx] + '" alt="' + esc(p.name) + ', image ' + (idx + 1) + '" data-fallback=\'' + JSON.stringify(p.fallback) + '\'>';
      window.attachBottleFallbacks && window.attachBottleFallbacks();
      list.forEach(function (b, j) { b.setAttribute('aria-selected', j === current); });
      counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
      document.querySelector('.gallery').classList.toggle('single', list.length < 2);
    };
    thumbs.innerHTML = p.images.map(function (src, i) {
      return '<button type="button" role="tab" data-i="' + i + '" aria-label="Image ' + (i + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>';
    }).join('');
    available().forEach(function (b) {
      b.addEventListener('click', function () { show(available().indexOf(b)); });
      b.querySelector('img').addEventListener('error', function () { b.remove(); show(Math.min(current, available().length - 1)); }, { once: true });
    });
    document.querySelectorAll('[data-step]').forEach(function (b) {
      b.addEventListener('click', function () { show(current + +b.dataset.step); });
    });
    show(0);

    // light zoom that follows the pointer
    main.addEventListener('pointermove', function (e) {
      const r = main.getBoundingClientRect();
      main.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      main.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });

    // quantity, bag and wishlist (front-end demo)
    const qty = document.getElementById('qty');
    document.querySelectorAll('[data-qty]').forEach(function (b) {
      b.addEventListener('click', function () { qty.value = Math.max(1, Math.min(20, (+qty.value || 1) + +b.dataset.qty)); });
    });
    const toast = document.getElementById('toast');
    const add = function () {
      const n = +qty.value || 1;
      toast.innerHTML = n + ' × ' + esc(p.name) + ' added. In the live site this goes to the CASSIE checkout.';
      toast.hidden = false;
      clearTimeout(toast._t);
      toast._t = setTimeout(function () { toast.hidden = true; }, 4200);
    };
    document.getElementById('addToBag').addEventListener('click', add);
    document.getElementById('stickyAdd').addEventListener('click', function () { add(); document.getElementById('pdpBuy').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    const wish = document.getElementById('wish');
    wish.addEventListener('click', function () { wish.setAttribute('aria-pressed', wish.getAttribute('aria-pressed') !== 'true'); });

    // sticky buy bar once the main button is out of view
    const sticky = document.getElementById('pdpSticky');
    document.getElementById('stickyName').textContent = p.name;
    document.getElementById('stickyPrice').textContent = aed(p.price);
    new IntersectionObserver(function (en) {
      const show = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      sticky.classList.toggle('on', show);
      sticky.setAttribute('aria-hidden', !show);
      document.getElementById('stickyAdd').tabIndex = show ? 0 : -1;
    }).observe(document.getElementById('pdpBuy'));

    // related: same family first, then same audience
    const others = all.filter(function (x) { return x.slug !== p.slug; });
    const rel = others.filter(function (x) { return p.family && x.family === p.family; })
      .concat(others.filter(function (x) { return x.for === p.for && x.family !== p.family; }))
      .concat(others).filter(function (x, i, arr) { return arr.indexOf(x) === i; }).slice(0, 8);
    if (!p.family) document.querySelector('.related-head h2').innerHTML = 'More from <em>CASSIE.</em>';
    const relGrid = document.getElementById('relatedGrid');
    relGrid.innerHTML = rel.map(card).join('').replace(/pcard reveal/g, 'pcard');
    reveal(relGrid);
    if (window.initCarousel) window.initCarousel(relGrid.closest('.carousel'));
  }
})();
