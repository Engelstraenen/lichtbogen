/* Testversion 3 · Stromausfall: Taschenlampe, Sicherung, Lichtwelle, Lichtbogen */
(function () {
  'use strict';
  var root = document.documentElement, FX = window.FX;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var blk = $('#blk'), mask = $('#blk-mask'), led = $('#blk-led'), box = $('#box'), flash = $('#flash'), wave = $('#wave');
  var meta = $('meta[name="theme-color"]');
  var ss = { get: function () { try { return sessionStorage.getItem('lb3-power'); } catch (e) { return null; } },
             set: function (v) { try { v ? sessionStorage.setItem('lb3-power', '1') : sessionStorage.removeItem('lb3-power'); } catch (e) {} } };

  /* ---------- Taschenlampe ---------- */
  var x = innerWidth * 0.3, y = innerHeight * 0.4, tx = x, ty = y, last = -9999, run = false;
  function torch(t) {
    if (!run) return;
    if (t - last > 2600) {            /* niemand bewegt etwas: Licht wandert von selbst */
      tx = innerWidth * (0.5 + 0.36 * Math.sin(t / 1900));
      ty = innerHeight * (0.47 + 0.27 * Math.sin(t / 1300 + 1.2));
    }
    x += (tx - x) * 0.14; y += (ty - y) * 0.14;
    mask.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    requestAnimationFrame(torch);
  }
  function aim(e) { tx = e.clientX; ty = e.clientY; last = performance.now(); }
  function placeLed() {
    var r = box.getBoundingClientRect();
    led.style.transform = 'translate(' + (r.left + r.width / 2) + 'px,' + (r.top + r.height * 0.72) + 'px)';
  }
  function startDark() {
    run = true;
    placeLed();
    addEventListener('pointermove', aim, { passive: true });
    addEventListener('pointerdown', aim, { passive: true });
    addEventListener('resize', placeLed);
    scrollTo(0, 0);
    requestAnimationFrame(torch);
  }

  /* ---------- Strom an ---------- */
  var powering = false;
  function lit() {
    root.classList.remove('out');
    root.setAttribute('data-theme', 'light');
    if (meta) meta.setAttribute('content', '#f4efe6');
    box.classList.add('on');
    box.setAttribute('aria-label', 'Hauptsicherung ist eingeschaltet');
    ss.set(true);
  }
  function power() {
    if (powering || !root.classList.contains('out')) return;
    powering = true; run = false;
    removeEventListener('pointermove', aim); removeEventListener('pointerdown', aim);
    if (reduce || !wave.animate) { lit(); root.classList.add('on'); return; }
    var r = box.getBoundingClientRect(), bx = r.left + r.width / 2, by = r.top + r.height * 0.55;
    var W = innerWidth, H = innerHeight;
    flash.style.setProperty('--fx', (bx / W * 100) + '%');
    flash.style.setProperty('--fy', (by / H * 100) + '%');
    flash.classList.add('go');
    for (var i = 0; i < 7; i++) FX.bolt(bx, by, Math.random() * W, Math.random() * H, { life: 420 + Math.random() * 300, w: 2.6 });
    FX.spark(bx, by, 40, '#cfe6ff');
    box.classList.add('on');
    setTimeout(function () {
      lit();
      wave.classList.add('go');
      var dur = 1700, t0 = performance.now();
      var a = wave.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(112%)' }], { duration: dur, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'forwards' });
      var iv = setInterval(function () {
        var ct = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming().progress : (performance.now() - t0) / dur;
        var ey = (ct || 0) * H * 1.12;
        if (ey > H + 40) return;
        FX.bolt(0, ey, W, ey + (Math.random() - 0.5) * 30, { life: 170, w: 1.6, rough: 0.05, color: '#ffe2a0' });
        FX.spark(Math.random() * W, ey, 6, '#ffd166');
      }, 110);
      a.onfinish = function () { clearInterval(iv); wave.classList.remove('go'); flash.classList.remove('go'); root.classList.add('on'); };
      root.classList.add('on');
    }, 150);
  }
  if (root.classList.contains('out')) startDark();
  else { box.classList.add('on'); root.classList.add('on'); }
  box.addEventListener('click', function () {
    if (root.classList.contains('out')) power();
    else if (window.LB) window.LB.toast('Der Strom läuft schon. Unten kannst du den Stromausfall noch einmal starten.');
  });
  $('#blk-skip').addEventListener('click', power);
  $('#replay').addEventListener('click', function () { ss.set(false); scrollTo(0, 0); location.reload(); });

  /* ---------- Lichtbogen zwischen zwei Kontakten ---------- */
  var stage = $('#arc');
  if (stage && !reduce) {
    var cv = $('canvas', stage), g = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
    var w = 0, h = 0, px = 0.5, py = 0.5, ptx = 0.5, pty = 0.5, plast = -9999, vis = false, n = 0;
    var fit = function () { var r = stage.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; };
    fit(); addEventListener('resize', fit);
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      ptx = (e.clientX - r.left) / r.width; pty = (e.clientY - r.top) / r.height; plast = performance.now();
    });
    stage.addEventListener('pointerdown', function (e) { FX.spark(e.clientX, e.clientY, 18, '#bfe0ff'); });
    var arcLoop = function (t) {
      if (!vis) return;
      if (t - plast > 1800) { ptx = 0.5 + 0.22 * Math.sin(t / 900); pty = 0.5 + 0.3 * Math.sin(t / 620); }
      px += (ptx - px) * 0.12; py += (pty - py) * 0.12;
      if (n++ % 2 === 0) {               /* jedes zweite Bild neu zeichnen: wirkt wie echtes Flackern */
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, w, h);
        g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
        var lx = w * 0.24 + 34, rx = w * 0.76 - 34, cy = h / 2, mx = px * w, my = py * h;
        FX.draw(g, lx, cy, mx, my, { w: 2.6, rough: 0.3 });
        FX.draw(g, mx, my, rx, cy, { w: 2.6, rough: 0.3 });
        if (Math.random() < 0.35) FX.draw(g, lx, cy, rx, cy, { w: 1.2, rough: 0.45, alpha: 0.5, branch: false });
        var rg = g.createRadialGradient(mx, my, 0, mx, my, 90);
        rg.addColorStop(0, 'rgba(170,210,255,.35)'); rg.addColorStop(1, 'rgba(170,210,255,0)');
        g.fillStyle = rg; g.fillRect(mx - 90, my - 90, 180, 180);
      }
      requestAnimationFrame(arcLoop);
    };
    new IntersectionObserver(function (es) {
      var was = vis; vis = es[0].isIntersecting;
      if (vis && !was) requestAnimationFrame(arcLoop);
    }, { threshold: 0.1 }).observe(stage);
  }

  /* ---------- Karten zünden beim Scrollen ---------- */
  var cards = $$('.ign');
  if (reduce || !('IntersectionObserver' in window)) cards.forEach(function (c) { c.classList.add('lit'); });
  else {
    var q = 0;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting || root.classList.contains('out')) return;
        io.unobserve(en.target);
        var el = en.target, d = q++ * 150;
        setTimeout(function () {
          q = Math.max(0, q - 1);
          var r = el.getBoundingClientRect(), cx = r.left + r.width * (0.3 + Math.random() * 0.4);
          FX.bolt(cx + (Math.random() - 0.5) * 160, Math.max(0, r.top - 260), cx, r.top + 6, { life: 360, w: 2.4 });
          FX.spark(cx, r.top + 6, 16, '#ffd166');
          setTimeout(function () { el.classList.add('lit'); }, 110);
        }, d);
      });
    }, { threshold: 0.35 });
    cards.forEach(function (c) { io.observe(c); });
    document.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.ign,.btn')) FX.spark(e.clientX, e.clientY, 10, '#ffd166');
    });
  }
})();
