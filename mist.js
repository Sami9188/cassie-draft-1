/* Perfume spray mist (canvas).
   data-mist="spray": puffs of fine droplets from the nozzle of the bottle named by data-mist-bottle
   (nozzle sits at x 88, y 80 in the 200x320 bottle viewBox), drifting, slowing and evaporating.
   data-mist="ambient": a few slow droplets hanging in the light, for quieter panels.
   Pauses off-screen and in background tabs; shows nothing with reduced motion. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = function (a, b) { return a + Math.random() * (b - a); };
  const gauss = function () { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; };

  function Mist(host) {
    this.host = host;
    this.mode = host.dataset.mist || 'spray';
    this.bottle = host.dataset.mistBottle ? host.querySelector(host.dataset.mistBottle) : null;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'mist-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.drops = [];
    this.haze = [];
    this.visible = false;
    this.last = 0;
    this.nextPuff = 0.6;
    this.puffLeft = 0;
    this.clock = 0;
    this.resize();
    const self = this;
    window.addEventListener('resize', function () { self.resize(); }, { passive: true });
    new IntersectionObserver(function (en) {
      self.visible = en[0].isIntersecting;
      if (self.visible) self.start();
    }, { threshold: 0.05 }).observe(host);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) self.start(); });
    if (this.mode === 'ambient') for (let i = 0; i < this.ambientCount(); i++) this.drops.push(this.ambientDrop(true));
  }

  Mist.prototype.resize = function () {
    const r = this.host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = r.width; this.h = r.height;
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.scale = Math.max(.55, Math.min(1.4, r.width / 560));
  };

  Mist.prototype.nozzle = function () {
    if (!this.bottle) return { x: this.w * .5, y: this.h * .4 };
    const hr = this.host.getBoundingClientRect();
    const hole = this.bottle.querySelector('.nozzle');
    if (hole) {
      const r = hole.getBoundingClientRect();
      return { x: r.left - hr.left + r.width * .3, y: r.top - hr.top + r.height / 2 };
    }
    const br = this.bottle.getBoundingClientRect();
    const k = br.width / 200;
    return { x: br.left - hr.left + 88 * k, y: br.top - hr.top + 80 * k };
  };

  Mist.prototype.ambientCount = function () { return Math.round(26 * this.scale); };
  Mist.prototype.ambientDrop = function (anywhere) {
    return {
      x: rand(0, this.w), y: anywhere ? rand(0, this.h) : this.h + 10,
      vx: rand(-6, 6), vy: rand(-14, -4), r: Math.random() < .15 ? rand(2, 4) : rand(.6, 1.8),
      life: 0, max: rand(7, 14), ambient: true
    };
  };

  Mist.prototype.emit = function (dt) {
    const n = this.nozzle();
    const s = this.scale;
    const count = Math.round(dt * 2200 * s);
    for (let i = 0; i < count; i++) {
      // tight jet out of the nozzle that opens into a cone, pointing left and slightly up
      const ang = Math.PI + 0.05 + gauss() * 0.2;
      // a spread of speeds fills the cone from the hole to its tip instead of firing one clump
      const speed = (90 + Math.pow(Math.random(), .8) * 640) * s;
      const big = Math.random() < .015;
      const off = rand(0, 4) * s; // born just outside the hole so the jet touches it
      this.drops.push({
        x: n.x + Math.cos(ang) * off, y: n.y + Math.sin(ang) * off + rand(-.6, .6),
        vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
        r: big ? rand(1.5, 2.6) : rand(.25, .9),
        life: 0, max: rand(1.8, 3.6), big: big, dark: Math.random() < .12, seed: Math.random() * 10
      });
    }
    // soft cloud blooming along the cone, longer than it is tall
    if (Math.random() < dt * 30) {
      const d = rand(20, 170) * s;
      this.haze.push({ x: n.x - d, y: n.y - d * .05 + rand(-5, 5) * s, r: (6 + d * .09) * s, grow: rand(14, 24) * s, life: 0, max: rand(2.4, 3.8), stretch: rand(1.5, 2.1) });
    }
    if (this.drops.length > 2600) this.drops.splice(0, this.drops.length - 2600);
  };

  Mist.prototype.step = function (dt) {
    this.clock += dt;
    if (this.mode === 'spray') {
      this.nextPuff -= dt;
      if (this.nextPuff <= 0) { this.puffLeft = rand(.55, .8); this.nextPuff = rand(4, 5.2); }
      if (this.puffLeft > 0) { this.emit(dt); this.puffLeft -= dt; }
      this.glow = this.puffLeft > 0 ? Math.min(1, (this.glow || 0) + dt * 14) : Math.max(0, (this.glow || 0) - dt * 4);
    }
    const drag = Math.exp(-2.4 * dt);
    const t = this.clock;
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const p = this.drops[i];
      p.life += dt;
      if (p.ambient) {
        p.vx += Math.sin(t * .6 + p.y * .02) * 2 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.y < -10 || p.life >= p.max) this.drops[i] = this.ambientDrop(false);
        continue;
      }
      if (p.life >= p.max) { this.drops.splice(i, 1); continue; }
      p.vx *= drag; p.vy *= drag;
      // air currents once the jet has slowed
      p.vx += Math.sin(t * 1.3 + p.seed + p.y * .03) * 18 * dt;
      p.vy += (Math.cos(t * 1.1 + p.seed + p.x * .025) * 14 - (p.big ? -18 : 4)) * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.r > .3) p.r *= 1 - dt * .06; // evaporating
    }
    for (let j = this.haze.length - 1; j >= 0; j--) {
      const h = this.haze[j];
      h.life += dt; h.r += h.grow * dt; h.x -= 8 * dt; h.y -= 3 * dt;
      if (h.life >= h.max) this.haze.splice(j, 1);
    }
  };

  Mist.prototype.draw = function () {
    const c = this.ctx;
    c.clearRect(0, 0, this.w, this.h);
    for (const h of this.haze) {
      const a = Math.sin(Math.PI * h.life / h.max) * .26;
      c.save();
      c.translate(h.x, h.y); c.scale(h.stretch, 1);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, h.r);
      g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g;
      c.beginPath(); c.arc(0, 0, h.r, 0, Math.PI * 2); c.fill();
      c.restore();
    }
    if (this.puffLeft > 0 || this.glow > 0) this.drawJet(c);
    c.lineCap = 'round';
    for (const p of this.drops) {
      const f = p.life / p.max;
      const a = p.ambient ? Math.sin(Math.PI * f) * .55 : Math.pow(1 - f, 1.3) * .95;
      if (a <= .01) continue;
      const v = Math.hypot(p.vx, p.vy);
      if (!p.ambient && v > 120 && !p.big) {
        // still in the jet: draw the droplet as a short motion streak
        const k = Math.min(.016, 7 / v);
        c.strokeStyle = 'rgba(255,255,255,' + (a * .85) + ')';
        c.lineWidth = p.r * 1.5 + .2;
        c.beginPath(); c.moveTo(p.x - p.vx * k, p.y - p.vy * k); c.lineTo(p.x, p.y); c.stroke();
      } else if (p.big || p.r > 1.9) {
        // out-of-focus droplet: soft disc, faint rim, small highlight
        const g = c.createRadialGradient(p.x - p.r * .3, p.y - p.r * .3, 0, p.x, p.y, p.r * 1.6);
        g.addColorStop(0, 'rgba(255,255,255,' + (a * .9) + ')');
        g.addColorStop(.55, 'rgba(255,255,255,' + (a * .35) + ')');
        g.addColorStop(.8, 'rgba(30,58,52,' + (a * .14) + ')');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = g;
        c.beginPath(); c.arc(p.x, p.y, p.r * 1.6, 0, Math.PI * 2); c.fill();
      } else {
        // fine droplet: faint refraction rim, then a bright core
        c.fillStyle = 'rgba(30,58,52,' + (a * (p.dark ? .28 : .15)) + ')';
        c.beginPath(); c.arc(p.x + .3, p.y + .4, p.r + .4, 0, Math.PI * 2); c.fill();
        c.fillStyle = 'rgba(255,255,255,' + (p.dark ? a * .5 : a) + ')';
        c.beginPath(); c.arc(p.x - .15, p.y - .2, p.r * .9, 0, Math.PI * 2); c.fill();
      }
    }
  };

  // the dense white plume right at the nozzle while the pump is pressed
  Mist.prototype.drawJet = function (c) {
    const n = this.nozzle();
    const s = this.scale;
    const a = this.glow * .5;
    const len = 150 * s;
    c.save();
    c.translate(n.x, n.y); c.rotate(Math.PI + .05);
    const g = c.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
    g.addColorStop(.35, 'rgba(255,255,255,' + (a * .45) + ')');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.filter = 'blur(' + (4 * s).toFixed(1) + 'px)';
    c.beginPath();
    c.moveTo(0, -1.5 * s); c.lineTo(len, -len * .17); c.lineTo(len, len * .17); c.lineTo(0, 1.5 * s);
    c.closePath(); c.fill();
    c.restore();
  };

  Mist.prototype.start = function () {
    if (this.running || reduce) return;
    this.running = true;
    this.last = performance.now();
    const self = this;
    (function frame(now) {
      if (!self.visible || document.hidden) { self.running = false; return; }
      const dt = Math.min(.05, (now - self.last) / 1000);
      self.last = now;
      self.step(dt);
      self.draw();
      requestAnimationFrame(frame);
    })(this.last);
  };

  document.querySelectorAll('[data-mist]').forEach(function (el) { new Mist(el); });
})();
