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
    const state = { shape: 'facet', cap: 'block', capColor: 'gold', glass: 'noir', label: 'YOUR BRAND', sub: 'EAU DE PARFUM', liquid: '#2a1c10' };
    const liquids = { noir: '#2a1c10', clear: '#e8c47e', frosted: '#e9dcc2', amber: '#9b531c', smoke: '#5a4a3a', rose: '#f0b4aa' };
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
    const draw = function () {
      state.liquid = liquids[state.glass];
      render.innerHTML = window.bottleSVG(state);
      render.classList.remove('swap'); void render.offsetWidth; render.classList.add('swap');
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
    draw();
    const toRfq = document.getElementById('packToRfq');
    const field = document.getElementById('packField');
    if (toRfq && field) toRfq.addEventListener('click', function () { field.value = 'Configuration: ' + describe(); });
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
