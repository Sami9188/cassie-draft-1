(function () {
  // Render every decorative bottle declared with data-bottle
  document.querySelectorAll('[data-bottle]').forEach(function (el) {
    let cfg = {};
    try { cfg = JSON.parse(el.dataset.bottle); } catch (e) {}
    el.innerHTML = window.bottleSVG(cfg);
  });
  window.attachBottleFallbacks();

  // Header state
  const header = document.querySelector('.site-header');
  const onScroll = function () { header && header.classList.toggle('scrolled', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') links.classList.remove('open'); });
  }

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Headlines rise word by word out of a mask
  function splitWords(el) {
    let i = 0;
    (function walk(node) {
      Array.from(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.textContent = part;
            inner.style.setProperty('--i', i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
    el.classList.add('split');
    if (!el.classList.contains('reveal')) el.setAttribute('data-observe', '');
  }
  if (!still) document.querySelectorAll('main h1:not(#pdpName), main h2:not(.cf-title)').forEach(splitWords);

  // Lists and grids come in one item after another
  document.querySelectorAll('.hero-copy, .stats, .mood, .kitspec-grid, .service-list, .process-steps, .comp-grid, .port-grid, .principle-list, .team-grid, .shop-row, .routes, .contact-info, .faq-list').forEach(function (list) {
    let n = 0;
    Array.from(list.children).forEach(function (el) {
      el.style.setProperty('--n', n);
      el.style.setProperty('--d', (Math.min(n++, 5) * 90) + 'ms');
    });
  });

  // Scroll progress, a saffron hairline under the header
  if (header) {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.innerHTML = '<i></i>';
    header.appendChild(bar);
    const fill = bar.firstChild;
    const onProgress = function () {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    };
    onProgress();
    window.addEventListener('scroll', onProgress, { passive: true });
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!still && finePointer) {
    // Hero bottles lean towards the pointer, each at its own depth
    const stage = document.querySelector('.hero-stage');
    const hero = document.querySelector('.hero');
    if (stage && hero) {
      hero.addEventListener('pointermove', function (e) {
        const r = stage.getBoundingClientRect();
        stage.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
        stage.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
      });
      hero.addEventListener('pointerleave', function () { stage.style.setProperty('--mx', 0); stage.style.setProperty('--my', 0); });
    }
    // Portfolio cards tilt under the pointer
    document.querySelectorAll('.port-art').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
        card.style.setProperty('--sx', ((x + .5) * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () { card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg'); });
    });
  }

  // Horizontal carousels: arrows page through, the bar shows position, a mouse can drag
  window.initCarousel = function (wrap) {
    if (!wrap || wrap.dataset.ready) return;
    wrap.dataset.ready = '1';
    const car = wrap.querySelector('.car-track');
    const bar = wrap.querySelector('.car-progress span');
    const count = wrap.querySelector('.car-count');
    const btns = wrap.querySelectorAll('.car-btn');
    const total = car.children.length;
    const pad = function (n) { return String(n).padStart(2, '0'); };
    const cardStep = function () {
      const c = car.children;
      return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : car.clientWidth;
    };
    const perView = function () { return Math.max(1, Math.round(car.clientWidth / cardStep())); };
    const update = function () {
      const max = car.scrollWidth - car.clientWidth;
      bar.style.width = (car.clientWidth / car.scrollWidth * 100) + '%';
      bar.style.transform = 'translateX(' + (car.scrollLeft / car.clientWidth * 100) + '%)';
      btns[0].disabled = car.scrollLeft < 4;
      btns[1].disabled = car.scrollLeft > max - 4;
      const first = Math.round(car.scrollLeft / cardStep()) + 1;
      if (count) count.textContent = pad(first) + '–' + pad(Math.min(total, first + perView() - 1)) + ' / ' + pad(total);
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () { car.scrollBy({ left: +b.dataset.dir * cardStep() * perView(), behavior: 'smooth' }); });
    });
    car.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // drag to scroll with a mouse; touch already swipes natively
    let startX = 0, startLeft = 0, moved = false, dragging = false;
    car.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = false; startX = e.clientX; startLeft = car.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5 && !moved) { moved = true; car.classList.add('dragging'); }
      if (moved) car.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        car.classList.remove('dragging');
        const step = cardStep();
        car.scrollTo({ left: Math.round(car.scrollLeft / step) * step, behavior: 'smooth' });
      }
    });
    car.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    car.addEventListener('dragstart', function (e) { e.preventDefault(); });
    update();
  };
  document.querySelectorAll('.carousel').forEach(function (wrap) {
    if (wrap.querySelector('.car-track').children.length) window.initCarousel(wrap);
  });

  // Header highlights the home section in view (Shop is the only menu item that leaves the page)
  const spyLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)'));
  if (spyLinks.length) {
    const spy = function () {
      let current = spyLinks[0], best = -Infinity;
      spyLinks.forEach(function (a) {
        const sec = a.getAttribute('href') === '#top' ? null : document.querySelector(a.getAttribute('href'));
        const top = sec ? sec.getBoundingClientRect().top : -Infinity;
        if (top < window.innerHeight * .4 && top > best) { best = top; current = a; }
      });
      spyLinks.forEach(function (a) { if (a === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  // Theme switch: Vetiver (default) or Rouge Atelier, remembered per visitor
  const root = document.documentElement;
  function applyTheme(t) {
    if (t === 'rouge') root.setAttribute('data-theme', 'rouge'); else root.removeAttribute('data-theme');
    document.querySelectorAll('img[data-art]').forEach(function (img) {
      img.src = 'atelier/' + img.dataset.art + '-' + (t === 'rouge' ? 'rouge' : 'vetiver') + '.svg';
    });
    document.querySelectorAll('[data-theme-set]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.themeSet === t); });
    document.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  }
  const switcher = document.createElement('div');
  switcher.className = 'theme-switch';
  switcher.setAttribute('role', 'group');
  switcher.setAttribute('aria-label', 'Site theme');
  switcher.innerHTML = '<span>Theme</span><button type="button" data-theme-set="vetiver"><i></i>Vetiver</button><button type="button" data-theme-set="rouge"><i></i>Rouge</button>';
  document.body.appendChild(switcher);
  switcher.addEventListener('click', function (e) {
    const b = e.target.closest('[data-theme-set]');
    if (!b) return;
    applyTheme(b.dataset.themeSet);
    try { localStorage.setItem('cassie-theme', b.dataset.themeSet); } catch (err) {}
  });
  applyTheme(root.getAttribute('data-theme') === 'rouge' ? 'rouge' : 'vetiver');

  // Font switch: three type pairings, remembered per visitor
  function applyFont(f) {
    if (f === 'playfair' || f === 'baskerville') root.setAttribute('data-font', f); else { f = 'cormorant'; root.removeAttribute('data-font'); }
    document.querySelectorAll('[data-font-set]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.fontSet === f); });
  }
  const fontSwitch = document.createElement('div');
  fontSwitch.className = 'theme-switch font-switch';
  fontSwitch.setAttribute('role', 'group');
  fontSwitch.setAttribute('aria-label', 'Site font');
  fontSwitch.innerHTML = '<span>Font</span><button type="button" data-font-set="cormorant">Cormorant</button><button type="button" data-font-set="playfair">Playfair</button><button type="button" data-font-set="baskerville">Baskerville</button>';
  document.body.appendChild(fontSwitch);
  fontSwitch.addEventListener('click', function (e) {
    const b = e.target.closest('[data-font-set]');
    if (!b) return;
    applyFont(b.dataset.fontSet);
    try { localStorage.setItem('cassie-font', b.dataset.fontSet); } catch (err) {}
    window.dispatchEvent(new Event('resize'));
  });
  applyFont(root.getAttribute('data-font'));

  // Scroll reveals and counters
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal, .process, .stat, [data-observe]').forEach(function (el) { io.observe(el); });

  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = 1;
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1600;
    (function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  // Packaging configurator
  const render = document.getElementById('packRender');
  if (render) {
    const state = { shape: 'facet', cap: 'block', capColor: 'black', glass: 'clear', label: 'YOUR BRAND', sub: 'EAU DE PARFUM', liquid: '#d9a24e' };
    const liquids = { noir: '#2a1c10', clear: '#d9a24e', frosted: '#e9dcc2', amber: '#9b531c', smoke: '#5a4a3a', rose: '#f0b4aa' };
    const names = {
      shape: { facet: 'Facet', flacon: 'Flacon', column: 'Column', orb: 'Orb', slim: 'Slim' },
      cap: { block: 'Zamac block cap', tall: 'Tower cap', dome: 'Dome cap', crystal: 'Crystal cap', disc: 'Disc cap' },
      capColor: { gold: 'Gold', silver: 'Silver', black: 'Matte black', rosegold: 'Rose gold', wood: 'Natural wood' },
      glass: { noir: 'Noir lacquer', clear: 'Extra-flint clear', frosted: 'Frosted', amber: 'Amber', smoke: 'Smoke', rose: 'Blush' }
    };
    const caption = document.getElementById('packCaption');
    const describe = function () {
      return names.shape[state.shape] + ' bottle · ' + names.capColor[state.capColor] + ' ' + names.cap[state.cap].toLowerCase() + ' · ' + names.glass[state.glass] + ' glass';
    };
    const draw = function (quiet) {
      state.liquid = liquids[state.glass];
      render.innerHTML = window.bottleSVG(state);
      if (!quiet) { render.classList.remove('swap'); void render.offsetWidth; render.classList.add('swap'); }
      if (caption) caption.textContent = describe();
    };
    document.querySelectorAll('.opts').forEach(function (group) {
      group.addEventListener('click', function (e) {
        const b = e.target.closest('button');
        if (!b) return;
        group.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        state[group.dataset.key] = b.dataset.val;
        draw();
      });
    });
    // Live brand name: the label on the bottle follows what the visitor types
    [['packLabel', 'label', 'YOUR BRAND'], ['packSub', 'sub', 'EAU DE PARFUM']].forEach(function (f) {
      const input = document.getElementById(f[0]);
      if (!input) return;
      input.addEventListener('input', function () {
        state[f[1]] = input.value.trim().toUpperCase() || f[2];
        draw(true);
      });
    });
    draw();
    const toRfq = document.getElementById('packToRfq');
    const field = document.getElementById('packField');
    if (toRfq && field) toRfq.addEventListener('click', function () { field.value = (state.label !== 'YOUR BRAND' ? 'Brand: ' + state.label + (state.sub !== 'EAU DE PARFUM' ? ' / ' + state.sub : '') + '\n' : '') + 'Configuration: ' + describe(); });
  }

  // "Order a Sample Kit" pre-ticks the sample box in the quotation form
  const sampleBox = document.getElementById('sampleBox');
  document.querySelectorAll('[data-sample]').forEach(function (a) {
    a.addEventListener('click', function () { if (sampleBox) sampleBox.checked = true; });
  });

  // Contact form (front-end demo) with ?topic= preselection
  const cform = document.getElementById('contactForm');
  if (cform) {
    const topic = new URLSearchParams(location.search).get('topic');
    const sel = document.getElementById('topicSelect');
    if (topic && sel && sel.querySelector('option[value="' + topic + '"]')) sel.value = topic;
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      let ok = true;
      cform.querySelectorAll('[required]').forEach(function (f) {
        const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      Array.from(cform.children).forEach(function (el) { if (!el.classList.contains('cf-done')) el.hidden = true; });
      cform.querySelector('.cf-done').hidden = false;
    });
  }

  // Multi-step RFQ
  const form = document.getElementById('rfqForm');
  if (form) {
    const steps = form.querySelectorAll('.rfq-step');
    const labels = form.querySelectorAll('.rfq-steps-label li');
    const bar = form.querySelector('.rfq-progress i');
    const next = document.getElementById('rfqNext');
    const back = document.getElementById('rfqBack');
    let i = 0;
    const show = function () {
      steps.forEach(function (s, n) { s.classList.toggle('on', n === i); });
      labels.forEach(function (l, n) { l.classList.toggle('on', n <= i); });
      if (bar) bar.style.width = ((i + 1) / steps.length * 100) + '%';
      back.hidden = i === 0;
      next.textContent = i === steps.length - 1 ? 'Submit request' : 'Continue';
    };
    const valid = function () {
      let ok = true;
      steps[i].querySelectorAll('[required]').forEach(function (f) {
        const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      return ok;
    };
    next.addEventListener('click', function () {
      if (!valid()) return;
      if (i < steps.length - 1) { i++; show(); return; }
      steps.forEach(function (s) { s.style.display = 'none'; });
      form.querySelector('.rfq-nav').hidden = true;
      form.querySelector('.rfq-steps-label').hidden = true;
      form.querySelector('.rfq-done').hidden = false;
    });
    back.addEventListener('click', function () { if (i > 0) { i--; show(); } });
    show();
  }
})();
