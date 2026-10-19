/* Hero atomiser spray (canvas).
   A spritz enters the hero stage from the left: a fast cone of fine mist, a soft haze that
   blooms and lingers, and a few larger droplets that catch the light and settle under gravity.
   Pauses off-screen and in background tabs; with reduced motion it draws a single still frame. */
(function () {
  const stage = document.querySelector('.hero-stage');
  if (!stage) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'spray';
  stage.insertBefore(canvas, stage.firstChild);
  const ctx = canvas.getContext('2d');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, dpr = 1, scale = 1;
  const parts = [];
  const rnd = function (a, b) { return a + Math.random() * (b - a); };
  // Roughly normal, for natural-looking spread in the cone
  const gauss = function () { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; };

  // Pre-rendered sprites: a refractive droplet (dark rim, bright core, specular glint) and a soft haze puff
  function sprite(size, draw) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    draw(c.getContext('2d'), size);
    return c;
  }
  const DROP = sprite(64, function (g, s) {
    const r = s / 2;
    // Body: clear liquid lens, darker toward the lower rim where it refracts the background
    let gr = g.createRadialGradient(r * 0.9, r * 0.75, 0, r, r, r);
    gr.addColorStop(0, 'rgba(255,255,255,0.7)');
    gr.addColorStop(0.5, 'rgba(226,234,230,0.45)');
    gr.addColorStop(0.85, 'rgba(130,148,140,0.28)');
    gr.addColorStop(1, 'rgba(130,148,140,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(r, r, r, 0, Math.PI * 2); g.fill();
    // Caustic: light focused through the drop onto its lower side
    gr = g.createRadialGradient(r * 1.1, r * 1.45, 0, r * 1.1, r * 1.45, r * 0.4);
    gr.addColorStop(0, 'rgba(255,250,236,0.8)'); gr.addColorStop(1, 'rgba(255,250,236,0)');
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
    // Specular glint
    gr = g.createRadialGradient(r * 0.7, r * 0.62, 0, r * 0.7, r * 0.62, r * 0.22);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
  });
  const MIST = sprite(32, function (g, s) {
    const r = s / 2;
    const gr = g.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.35, 'rgba(255,255,255,0.6)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
  });
  const HAZE = sprite(128, function (g, s) {
    const r = s / 2;
    const gr = g.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, 'rgba(255,255,255,0.55)');
    gr.addColorStop(0.5, 'rgba(250,252,251,0.22)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
  });

  function resize() {
    const r = stage.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    scale = W / 600;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // One spritz: the nozzle sits just off the left edge, aimed slightly up and across the stage
  function burst() {
    const ox = -0.02 * W, oy = rnd(0.3, 0.36) * H;
    const aim = rnd(-0.16, -0.06);
    const n = Math.round(rnd(1500, 1800) * Math.min(1.4, Math.max(0.55, scale)));
    for (let i = 0; i < n; i++) {
      const kind = Math.random() < 0.012 ? 'drop' : 'mist';
      const a = aim + gauss() * (kind === 'drop' ? 0.12 : 0.17);
      const v = (kind === 'drop' ? rnd(520, 900) : rnd(380, 1100)) * scale;
      parts.push({
        kind: kind,
        x: ox, y: oy + gauss() * 3,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        r: kind === 'drop' ? rnd(1.8, 3.6) * Math.max(0.7, scale) : Math.pow(Math.random(), 2.2) * 1.5 * Math.max(0.7, scale) + 0.35,
        delay: Math.random() * 0.32 + (kind === 'drop' ? 0.04 : 0),
        age: 0,
        life: kind === 'drop' ? rnd(2.6, 4.2) : rnd(2.2, 4.6),
        drag: kind === 'drop' ? rnd(1.1, 1.7) : rnd(2.6, 4.2),
        seed: Math.random() * 1000
      });
    }
    // Haze clouds that bloom along the jet and drift
    for (let i = 0; i < 26; i++) {
      const t = rnd(0.12, 0.9);
      parts.push({
        kind: 'haze',
        x: ox + t * W * 0.95, y: oy + (aim * t * W * 0.9) + gauss() * 22 * scale,
        vx: rnd(14, 40) * scale, vy: rnd(-6, 8) * scale,
        r: rnd(26, 54) * scale, grow: rnd(10, 22) * scale,
        delay: t * 0.38, age: 0, life: rnd(3.2, 5.2), drag: 0.4, seed: Math.random() * 1000
      });
    }
  }

  function step(dt, t) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (p.delay > 0) { p.delay -= dt; continue; }
      p.age += dt;
      if (p.age > p.life) { parts.splice(i, 1); continue; }
      const k = Math.exp(-p.drag * dt);
      p.vx *= k; p.vy *= k;
      if (p.kind === 'drop') p.vy += 260 * scale * dt;
      else if (p.kind === 'mist') {
        // Settling plus a gentle swirl so the cloud breathes instead of moving as one sheet
        p.vy += 26 * scale * dt;
        p.vx += Math.sin(t * 1.3 + p.seed) * 18 * scale * dt;
        p.vy += Math.cos(t * 1.1 + p.seed * 1.7) * 14 * scale * dt;
      } else {
        p.r += p.grow * dt;
        p.vy += 4 * scale * dt;
      }
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.delay > 0) continue;
      const u = p.age / p.life;
      if (p.kind === 'haze') {
        const a = Math.min(1, p.age / 0.4) * Math.pow(1 - u, 1.4) * 0.8;
        ctx.globalAlpha = a;
        ctx.drawImage(HAZE, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
    }
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.delay > 0 || p.kind === 'haze') continue;
      const u = p.age / p.life;
      const fade = Math.min(1, p.age / 0.06) * (1 - u * u);
      const speed = Math.hypot(p.vx, p.vy);
      if (p.kind === 'mist') {
        ctx.globalAlpha = fade * 0.9;
        const s = p.r * 3.2;
        // Fast particles read as short streaks, like a real jet caught on camera
        if (speed > 180 * scale) {
          const len = Math.min(18 * scale, speed * 0.012);
          ctx.save();
          ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx));
          ctx.drawImage(MIST, -len, -s / 2, len + s, s);
          ctx.restore();
        } else {
          ctx.drawImage(MIST, p.x - s / 2, p.y - s / 2, s, s);
        }
      } else {
        ctx.globalAlpha = fade * 0.9;
        const s = p.r * 2;
        ctx.drawImage(DROP, p.x - s / 2, p.y - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
  }

  resize();
  window.addEventListener('resize', resize);

  if (still) {
    burst();
    for (let i = 0; i < 40; i++) step(1 / 60, i / 60);
    draw();
    return;
  }

  let visible = true, last = 0, clock = 0, next = 0.6, raf = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    clock += dt;
    if (clock >= next) { burst(); next = clock + rnd(4.2, 5.6); }
    step(dt, clock);
    draw();
    raf = requestAnimationFrame(frame);
  }
  function run() { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  new IntersectionObserver(function (en) { visible = en[0].isIntersecting; visible ? run() : stop(); }).observe(stage);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : run(); });
  run();
})();
