/* Testversion 3 · Stromausfall nach Storyboard
   1 Dunkel + Taschenlampe · 2 Sicherungskasten · 3 Hand legt um, Blitz · 4 Lichtwelle · 5 Kabel + Lichtbogen + Karten · 6 Handy */
(function () {
  'use strict';
  var root = document.documentElement, FX = window.FX, S = window.LB_SERVICES || [], VIZ = window.LB_VIZ || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AR = 2752 / 1536;
  var dark = $('#dark'), shade = $('#shade'), hot = $('#hot'), flip = $('#flip'), flash = $('#flash'), wave = $('#wave');
  var meta = $('meta[name="theme-color"]');
  var ss = { set: function (v) { try { v ? sessionStorage.setItem('lb3-power', '1') : sessionStorage.removeItem('lb3-power'); } catch (e) {} } };

  /* Punkt im Foto -> Punkt im Kasten (object-fit: cover) */
  function cover(w, h, u, v, px, py) {
    var dw = Math.max(w, h * AR), dh = dw / AR;
    return [(w - dw) * px + u * dw, (h - dh) * py + v * dh];
  }

  /* Überschrift in Wörter teilen, damit sie einzeln hochfahren */
  $$('.split').forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/); h.textContent = '';
    words.forEach(function (w, i) {
      var o = document.createElement('span'), s = document.createElement('span');
      o.className = 'w' + (i >= 2 ? ' hi' : ''); s.textContent = w; s.style.transitionDelay = (0.25 + i * 0.09) + 's';
      o.appendChild(s); h.appendChild(o); h.appendChild(document.createTextNode(' '));
    });
  });
  function countUp() {
    $$('[data-count]').forEach(function (b) {
      var to = +b.getAttribute('data-count');
      if (b.hasAttribute('data-plain') || reduce) return;
      var t0 = performance.now();
      (function f(t) { var k = Math.min(1, (t - t0) / 1400); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
    });
  }

  /* ---------- 1+2 Taschenlampe ---------- */
  var x = innerWidth * 0.3, y = innerHeight * 0.3, tx = x, ty = y, last = -9999, run = false, hx = 0, hy = 0;
  function placeHot() {
    var W = innerWidth * 1.06, H = innerHeight * 1.06, p = cover(W, H, 0.44, 0.40, 0.52, 0.45);
    hx = p[0] - innerWidth * 0.03; hy = p[1] - innerHeight * 0.03;
    hot.style.transform = 'translate(' + hx.toFixed(1) + 'px,' + hy.toFixed(1) + 'px)';
  }
  function torch(t) {
    if (!run) return;
    if (t - last > 2600) {          /* niemand bewegt etwas: Licht pendelt zwischen Schrift und Schalter */
      var k = 0.5 + 0.5 * Math.sin(t / 1700);
      tx = innerWidth * 0.3 + (hx - innerWidth * 0.3) * k + Math.sin(t / 700) * 30;
      ty = innerHeight * 0.26 + (hy - innerHeight * 0.26) * k + Math.cos(t / 900) * 24;
    }
    x += (tx - x) * 0.13; y += (ty - y) * 0.13;
    shade.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    requestAnimationFrame(torch);
  }
  function aim(e) { tx = e.clientX; ty = e.clientY; last = performance.now(); }
  function startDark() {
    run = true; placeHot(); scrollTo(0, 0);
    addEventListener('pointermove', aim, { passive: true });
    addEventListener('pointerdown', aim, { passive: true });
    addEventListener('resize', placeHot);
    requestAnimationFrame(torch);
  }

  /* ---------- 3+4 Schalter, Blitz, Lichtwelle ---------- */
  var powering = false;
  function lit() {
    root.classList.remove('out');
    root.setAttribute('data-theme', 'light');
    if (meta) meta.setAttribute('content', '#0a0f1c');
    ss.set(true);
  }
  function done() { root.classList.add('on'); countUp(); }
  function power() {
    if (powering || !root.classList.contains('out')) return;
    powering = true; run = false;
    removeEventListener('pointermove', aim); removeEventListener('pointerdown', aim);
    if (reduce || !wave.animate) { lit(); done(); return; }
    var W = innerWidth, H = innerHeight, bx = W * 0.56, by = H * 0.44;
    /* Szene 3: Großaufnahme Hand am Schalter */
    flip.classList.add('go');
    var img = $('img', flip);
    img.animate([{ transform: 'scale(1.35)' }, { transform: 'scale(1.04)' }], { duration: 1500, easing: 'cubic-bezier(.1,.7,.2,1)', fill: 'forwards' });
    flash.classList.add('go');
    var burst = function () {
      for (var i = 0; i < 6; i++) FX.bolt(bx, by, bx + (Math.random() - 0.2) * W * 0.8, by - Math.random() * H * 0.7, { life: 260 + Math.random() * 260, w: 3 });
      FX.spark(bx, by, 46, '#d6e9ff');
    };
    burst(); setTimeout(burst, 260); setTimeout(burst, 620);
    /* Szene 4: Welle */
    setTimeout(function () {
      lit();
      wave.classList.add('go');
      flip.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).onfinish = function () { flip.classList.remove('go'); };
      var dur = 2100;
      var a = wave.animate([{ transform: 'translate(-3%,-14vh)' }, { transform: 'translate(3%,112vh)' }], { duration: dur, delay: 200, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'both' });
      var iv = setInterval(function () {
        var p = a.effect && a.effect.getComputedTiming ? (a.effect.getComputedTiming().progress || 0) : 0;
        var ey = -0.14 * H + p * 1.26 * H + 60;
        if (ey < 0 || ey > H + 40) return;
        FX.spark(Math.random() * W, ey + (Math.random() - 0.5) * 50, 7, '#ffd166');
      }, 70);
      setTimeout(done, 500);
      a.onfinish = function () { clearInterval(iv); wave.classList.remove('go'); flash.classList.remove('go'); };
    }, 1250);
  }
  if (root.classList.contains('out')) startDark(); else { root.classList.add('on'); }
  hot.addEventListener('click', power);
  $('#blk-skip').addEventListener('click', power);
  $('#replay').addEventListener('click', function () { ss.set(false); scrollTo(0, 0); location.reload(); });

  /* ---------- 5 Lichtbogen zwischen den Kupferenden ---------- */
  var stage = $('#arc'), tipL = [0, 0], tipR = [0, 0];
  var cv = $('canvas', stage), g = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  var w = 0, h = 0, px = 0.5, py = 0.5, ptx = 0.5, pty = 0.5, plast = -9999, vis = false, n = 0;
  function fit() {
    var r = stage.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr;
    tipL = cover(w, h, 0.415, 0.49, 0.5, 0.5); tipR = cover(w, h, 0.585, 0.49, 0.5, 0.5);
  }
  fit(); addEventListener('resize', fit);
  stage.addEventListener('pointermove', function (e) {
    var r = stage.getBoundingClientRect();
    ptx = (e.clientX - r.left) / r.width; pty = (e.clientY - r.top) / r.height; plast = performance.now();
  });
  stage.addEventListener('pointerdown', function (e) { FX.spark(e.clientX, e.clientY, 22, '#bfe0ff'); });
  function arcLoop(t) {
    if (!vis) return;
    var cx = (tipL[0] + tipR[0]) / 2 / w, cy = tipL[1] / h;
    if (t - plast > 1800) { ptx = cx + 0.05 * Math.sin(t / 900); pty = cy + 0.12 * Math.sin(t / 620); }
    /* der Bogen bleibt zwischen den Enden, biegt sich aber zum Finger */
    var lim = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    var gx = lim(ptx, tipL[0] / w + 0.02, tipR[0] / w - 0.02), gy = lim(pty, cy - 0.3, cy + 0.3);
    px += (gx - px) * 0.14; py += (gy - py) * 0.14;
    if (n++ % 2 === 0) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
      var mx = px * w, my = py * h;
      FX.draw(g, tipL[0], tipL[1], mx, my, { w: 3, rough: 0.34, color: '#8fc4ff' });
      FX.draw(g, mx, my, tipR[0], tipR[1], { w: 3, rough: 0.34, color: '#8fc4ff' });
      if (Math.random() < 0.5) FX.draw(g, tipL[0], tipL[1], tipR[0], tipR[1], { w: 1.4, rough: 0.5, alpha: 0.6, color: '#8fc4ff' });
      [tipL, tipR, [mx, my]].forEach(function (p, i) {
        var R = i === 2 ? 110 : 70, rg = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], R);
        rg.addColorStop(0, 'rgba(190,225,255,.55)'); rg.addColorStop(1, 'rgba(190,225,255,0)');
        g.fillStyle = rg; g.fillRect(p[0] - R, p[1] - R, R * 2, R * 2);
      });
    }
    requestAnimationFrame(arcLoop);
  }
  if (!reduce) new IntersectionObserver(function (es) {
    var was = vis; vis = es[0].isIntersecting;
    if (vis && !was) { fit(); requestAnimationFrame(arcLoop); }
  }, { threshold: 0.05 }).observe(stage);

  /* ---------- Karten zünden: Blitz springt vom Kabel in die Karte ---------- */
  var cards = $$('.svc');
  if (reduce || !('IntersectionObserver' in window)) cards.forEach(function (c) { c.classList.add('lit'); });
  else {
    var q = 0;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting || root.classList.contains('out')) return;
        io.unobserve(en.target);
        var el = en.target, d = q++ * 170;
        setTimeout(function () {
          q = Math.max(0, q - 1);
          var r = el.getBoundingClientRect(), sr = stage.getBoundingClientRect(), cx = r.left + r.width / 2;
          var tip = cx < innerWidth / 2 ? tipL : tipR, sx = sr.left + tip[0], sy = sr.top + tip[1];
          if (sy < 0 || sy > innerHeight) { sx = cx + (Math.random() - 0.5) * 160; sy = Math.max(0, r.top - 260); }
          FX.bolt(sx, sy, cx, r.top + 4, { life: 420, w: 2.8 });
          FX.spark(cx, r.top + 4, 20, '#ffd166');
          setTimeout(function () { el.classList.add('lit'); }, 130);
        }, d);
      });
    }, { threshold: 0.3 });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- Karte geht auf ---------- */
  var sheet = $('#sheet'), inn = $('.sheet-in', sheet), lastCard = null;
  function open(card) {
    var i = +card.getAttribute('data-i'), s = S[i]; if (!s) return;
    lastCard = card;
    $('#sh-eye').textContent = s.name; $('#sh-h').textContent = s.head; $('#sh-t').textContent = s.text;
    var ul = $('#sh-l'); ul.textContent = '';
    s.pts.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; ul.appendChild(li); });
    var a = $('#sh-a');
    if (s.link) { a.href = s.link; a.textContent = s.cta; a.removeAttribute('data-demo'); }
    else { a.href = '#'; a.textContent = 'Notdienst anrufen'; a.setAttribute('data-demo', 'Demo: Hier wählt das Handy direkt den Notdienst.'); }
    $('#sh-v').innerHTML = VIZ[s.key] || '';
    sheet.hidden = false;
    var r = card.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    inn.style.setProperty('--ox', ((cx - inn.offsetLeft) / inn.offsetWidth * 100).toFixed(1) + '%');
    inn.style.setProperty('--oy', ((cy - inn.offsetTop) / inn.offsetHeight * 100).toFixed(1) + '%');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('open'); }); });
    FX.bolt(cx, cy, innerWidth / 2, innerHeight / 2, { life: 380, w: 3, color: '#ffd89a' });
    FX.spark(cx, cy, 26, '#ffd166');
    setTimeout(function () { $('#sh-x').focus(); }, 300);
  }
  function close() {
    sheet.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(function () { sheet.hidden = true; if (lastCard) lastCard.focus(); }, 320);
  }
  cards.forEach(function (c) { c.addEventListener('click', function () { c.classList.add('lit'); open(c); }); });
  $('#sh-x').addEventListener('click', close);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) close(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) close(); });

  /* Funken bei jedem Tipp auf einen Knopf */
  document.addEventListener('pointerdown', function (e) { if (e.target.closest('.btn')) FX.spark(e.clientX, e.clientY, 12, '#ffd166'); });
  /* Handy-Bildschirm genau auf das Foto legen */
  var ph = $('#ph'), scr = $('#ph-screen');
  function fitPhone() {
    var r = ph.getBoundingClientRect(), a = cover(r.width, r.height, 0.618, 0.155, 0.72, 0.5), b = cover(r.width, r.height, 0.772, 0.722, 0.72, 0.5);
    scr.style.transform = 'translate(' + a[0].toFixed(1) + 'px,' + a[1].toFixed(1) + 'px)';
    scr.style.width = (b[0] - a[0]).toFixed(1) + 'px'; scr.style.height = (b[1] - a[1]).toFixed(1) + 'px';
  }
  fitPhone(); addEventListener('resize', fitPhone); addEventListener('load', fitPhone);
})();
