/* Testversion 3 · Stromausfall · Scrollytelling
   Scrollen steuert die Geschichte. Der Schalter oben macht das Licht aus und wieder an. */
(function () {
  'use strict';
  var root = document.documentElement, FX = window.FX, S = window.LB_SERVICES || [], VIZ = window.LB_VIZ || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AR = 2752 / 1536;
  var shade = $('#shade'), hot = $('#hot'), flip = $('#flip'), flash = $('#flash'), wave = $('#wave'), lsw = $('#lsw');
  var s1 = $('#s1'), s3 = $('#s3'), s5 = $('#s5'), kwrap = $('#k-wrap');
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var isOut = function () { return root.classList.contains('out'); };
  var store = function () {}; /* die Seite startet bei jedem Öffnen dunkel, der Zustand wird nicht gemerkt */
  function cover(w, h, u, v, px, py) { var dw = Math.max(w, h * AR), dh = dw / AR; return [(w - dw) * px + u * dw, (h - dh) * py + v * dh]; }
  function prog(sec) { var r = sec.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight), 0, 1); }
  function inView(sec) { var r = sec.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }

  /* Überschrift in Wörter teilen */
  $$('.split').forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/); h.textContent = '';
    words.forEach(function (w, i) {
      var o = document.createElement('span'), s = document.createElement('span');
      o.className = 'w' + (i >= 3 ? ' hi' : ''); s.textContent = w; s.style.transitionDelay = (i * 0.06) + 's';
      o.appendChild(s); h.appendChild(o); h.appendChild(document.createTextNode(' '));
    });
  });
  if ('IntersectionObserver' in window) {
    var once = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        once.unobserve(en.target);
        if (en.target.classList.contains('split')) en.target.classList.add('in');
        else if (!reduce) {
          var b = en.target, to = +b.getAttribute('data-count'), t0 = performance.now();
          (function f(t) { var k = Math.min(1, (t - t0) / 1400); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
        }
      });
    }, { threshold: 0.4 });
    $$('.split,[data-count]:not([data-plain])').forEach(function (el) { once.observe(el); });
  } else $$('.split').forEach(function (el) { el.classList.add('in'); });

  /* ---------- Texte der Szenen ein- und ausblenden ---------- */
  var beatSets = [s1, s3, s5].map(function (sec) {
    return { sec: sec, beats: $$('.beat', sec).map(function (el) { return { el: el, a: +el.getAttribute('data-a'), b: +el.getAttribute('data-b') }; }) };
  });
  function beats(set, p) {
    set.beats.forEach(function (b) {
      var o = Math.min(ease((p - b.a) / 0.06), 1 - ease((p - b.b) / 0.06));
      b.el.style.opacity = o.toFixed(3);
      b.el.style.translate = '0 ' + ((1 - ease((p - b.a) / 0.1)) * 40 - ease((p - b.b) / 0.06) * 40).toFixed(1) + 'px';
    });
  }

  /* ---------- Szene 1: Film. Scrollen spult bis zum Griff an den Schalter ---------- */
  var hotX = innerWidth / 2, hotY = innerHeight / 2, p1 = 0, manualOff = false;
  var vid = $('#kvid'), vOK = false, playing = false;
  /* Zeiten im Film (Sekunden) und Lage des Hauptschalters im Bild am Anfang und beim Griff */
  var T0 = 1.7, TF = 3.5, TS = 5.45, TL = 6.7, RATE = 1.6, U0 = 0.44, V0 = 0.40, U1 = 0.445, V1 = 0.41;
  function seek(t) { if (!vOK || playing || vid.seeking) return; if (Math.abs(vid.currentTime - t) > 0.03) vid.currentTime = t; }
  function film() { root.classList.toggle('film', vOK && !manualOff); }
  if (vid && !reduce) {
    var ready = function () { if (vOK) return; vOK = true; kwrap.classList.add('has-vid'); film(); scene1(); };
    vid.addEventListener('loadeddata', ready); if (vid.readyState >= 2) ready();
    /* iPhone lädt Videos erst beim Abspielen: kurz stumm anspielen und gleich wieder anhalten */
    try { var warm = vid.play(); if (warm && warm.then) warm.then(function () { if (!playing) { vid.pause(); vid.currentTime = T0; } }).catch(function () {}); } catch (e) {}
    vid.addEventListener('error', function () { vOK = false; kwrap.classList.remove('has-vid'); film(); }, true);
  }
  function scene1() {
    p1 = prog(s1);
    var W = kwrap.offsetWidth, H = kwrap.offsetHeight, k = ease((p1 - 0.05) / (vOK ? 0.47 : 0.58));
    var zm = vOK ? (innerWidth < 720 ? 2.0 : 1.8) : (innerWidth < 720 ? 2.0 : 2.5);
    var s = 1 + (zm - 1) * k, u = vOK ? U0 + (U1 - U0) * k : 0.44, v = vOK ? V0 + (V1 - V0) * k : 0.40;
    var ox = (u - 0.5) * W, oy = (v - 0.5) * H, tx = -ox * s * k, ty = -oy * s * k;
    /* nicht über den Bildrand hinaus schieben */
    var mx = Math.max(0, (W * s - innerWidth) / 2), my = Math.max(0, (H * s - innerHeight) / 2);
    tx = clamp(tx, -mx, mx); ty = clamp(ty, -my, my);
    kwrap.style.transform = 'translate(calc(-50% + ' + tx.toFixed(1) + 'px),calc(-50% + ' + ty.toFixed(1) + 'px)) scale(' + s.toFixed(4) + ')';
    hotX = innerWidth / 2 + ox * s + tx; hotY = innerHeight / 2 + oy * s + ty;
    hot.style.transform = 'translate(' + (ox * s + tx).toFixed(1) + 'px,' + (oy * s + ty).toFixed(1) + 'px)';
    hot.classList.toggle('show', p1 > (vOK ? 0.5 : 0.74) && isOut() && !playing);
    if (vOK) seek(isOut() ? T0 + k * (TF - T0) : (vid.duration || 8) - 0.05);
    beats(beatSets[0], p1);
    if (p1 > (vOK ? 0.6 : 0.94) && isOut() && !manualOff) power(true);
  }

  /* ---------- Taschenlampe ---------- */
  var x = innerWidth / 2, y = innerHeight * 0.45, tx0 = x, ty0 = y, last = -9999, torchOn = false;
  function torch(t) {
    if (!isOut()) { torchOn = false; return; }
    if (t - last > 2400) {
      if (inView(s1) && p1 < 0.95) {
        var k = p1 > 0.7 ? 1 : 0.5 + 0.5 * Math.sin(t / 1500);
        tx0 = innerWidth / 2 + (hotX - innerWidth / 2) * k + Math.sin(t / 700) * 26;
        ty0 = innerHeight * 0.5 + (hotY - innerHeight * 0.5) * k + Math.cos(t / 900) * 20;
      } else { tx0 = innerWidth / 2 + Math.sin(t / 1100) * innerWidth * 0.2; ty0 = innerHeight * 0.48 + Math.cos(t / 1400) * innerHeight * 0.14; }
    }
    x += (tx0 - x) * 0.13; y += (ty0 - y) * 0.13;
    shade.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    requestAnimationFrame(torch);
  }
  function startTorch() { if (!torchOn) { torchOn = true; requestAnimationFrame(torch); } }
  addEventListener('pointermove', function (e) { tx0 = e.clientX; ty0 = e.clientY; last = performance.now(); }, { passive: true });
  addEventListener('pointerdown', function (e) { tx0 = e.clientX; ty0 = e.clientY; last = performance.now(); }, { passive: true });

  /* ---------- Licht an / aus ---------- */
  var busy = false;
  function setSwitch() { if (lsw) lsw.setAttribute('aria-checked', isOut() ? 'false' : 'true'); }
  function lit() { root.classList.remove('out'); store(true); setSwitch(); }
  function runWave(done) {
    var W = innerWidth, H = innerHeight;
    wave.classList.add('go');
    var a = wave.animate([{ transform: 'translate(-3%,-14vh)' }, { transform: 'translate(3%,112vh)' }], { duration: 1900, delay: 120, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'both' });
    var iv = setInterval(function () {
      var p = a.effect && a.effect.getComputedTiming ? (a.effect.getComputedTiming().progress || 0) : 0, ey = -0.14 * H + p * 1.26 * H + 60;
      if (ey > 0 && ey < H + 40) FX.spark(Math.random() * W, ey + (Math.random() - 0.5) * 50, 7, '#ffd166');
    }, 70);
    a.onfinish = function () { clearInterval(iv); wave.classList.remove('go'); flash.classList.remove('go'); busy = false; if (done) done(); };
  }
  function power(full) {
    if (busy || !isOut()) return;
    busy = true; manualOff = false; film();
    if (reduce || !wave.animate) { lit(); busy = false; return; }
    var W = innerWidth, H = innerHeight, bx = W * 0.56, by = H * 0.44;
    flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
    var burst = function () {
      for (var i = 0; i < 6; i++) FX.bolt(bx, by, bx + (Math.random() - 0.2) * W * 0.8, by - Math.random() * H * 0.7, { life: 260 + Math.random() * 260, w: 3 });
      FX.spark(bx, by, 46, '#d6e9ff');
    };
    if (!full) { burst(); setTimeout(function () { lit(); runWave(); }, 180); return; }
    if (vOK) {
      /* der Film läuft von selbst weiter: Hand greift, Hebel hoch, Funke, Licht */
      flash.classList.remove('go'); playing = true; hot.classList.remove('show');
      bx = hotX; by = hotY;
      if (vid.currentTime < TF - 0.05 || vid.currentTime > TL) vid.currentTime = TF;
      var sparked = false, done = false;
      var watch = function () {
        if (done) return;
        if (!sparked && vid.currentTime >= TS) { sparked = true; void flash.offsetWidth; flash.classList.add('go'); burst(); setTimeout(burst, 220); }
        if (vid.currentTime >= TL || vid.ended) { done = true; vid.playbackRate = 1; lit(); runWave(function () { playing = false; }); return; }
        requestAnimationFrame(watch);
      };
      vid.playbackRate = RATE; var pr = vid.play(); if (pr && pr.catch) pr.catch(function () { done = true; playing = false; vid.currentTime = (vid.duration || 8) - 0.05; lit(); runWave(); });
      requestAnimationFrame(watch);
      return;
    }
    flip.classList.add('go');
    $('img', flip).animate([{ transform: 'scale(1.35)' }, { transform: 'scale(1.04)' }], { duration: 1500, easing: 'cubic-bezier(.1,.7,.2,1)', fill: 'forwards' });
    burst(); setTimeout(burst, 260); setTimeout(burst, 620);
    setTimeout(function () {
      lit();
      flip.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).onfinish = function () { flip.classList.remove('go'); flip.getAnimations().forEach(function (a) { a.cancel(); }); };
      runWave();
    }, 1250);
  }
  function dark() {
    if (busy || isOut()) return;
    manualOff = true; film();
    root.classList.add('out'); store(false); setSwitch(); if (vOK) { vid.pause(); scene1(); }
    x = innerWidth - 80; y = 40; startTorch();
    if (window.LB) window.LB.toast('Licht aus. Finger oder Maus sind jetzt die Taschenlampe.');
  }
  if (lsw) lsw.addEventListener('click', function () { isOut() ? power(inView(s1) && p1 > 0.5) : dark(); });
  hot.addEventListener('click', function () { power(true); });
  $('#replay').addEventListener('click', function () { store(false); scrollTo(0, 0); location.reload(); });
  setSwitch(); if (isOut()) startTorch();

  /* ---------- Szene 3: Kabelenden fahren zusammen, Lichtbogen ---------- */
  var stage = $('#arc'), hl = $('.hl', stage), hr = $('.hr', stage), cv = $('canvas', stage), g = cv.getContext('2d');
  var dpr = Math.min(2, devicePixelRatio || 1), w = 0, h = 0, tipL = [0, 0], tipR = [0, 0], gap = 0, power3 = 0;
  var px = 0.5, py = 0.5, ptx = 0.5, pty = 0.5, plast = -9999, vis3 = false, n = 0;
  function fit3() { var r = stage.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; }
  function scene3() {
    var p = prog(s3), e = ease(p / 0.5);
    gap = (1 - e) * w * (innerWidth < 720 ? 0.2 : 0.13);
    hl.style.transform = 'translateX(' + (-gap).toFixed(1) + 'px)'; hr.style.transform = 'translateX(' + gap.toFixed(1) + 'px)';
    tipL = cover(w, h, 0.415, 0.49, 0.5, 0.5); tipR = cover(w, h, 0.585, 0.49, 0.5, 0.5);
    tipL[0] -= gap; tipR[0] += gap;
    power3 = clamp((e - 0.55) / 0.45, 0, 1);
    beats(beatSets[1], p);
  }
  stage.addEventListener('pointermove', function (e) { var r = stage.getBoundingClientRect(); ptx = (e.clientX - r.left) / r.width; pty = (e.clientY - r.top) / r.height; plast = performance.now(); });
  stage.addEventListener('pointerdown', function (e) { FX.spark(e.clientX, e.clientY, 22, '#bfe0ff'); });
  function arcLoop(t) {
    if (!vis3) return;
    var cx = (tipL[0] + tipR[0]) / 2 / w, cy = tipL[1] / h;
    if (t - plast > 1800) { ptx = cx + 0.04 * Math.sin(t / 900); pty = cy + 0.1 * Math.sin(t / 620); }
    px += (clamp(ptx, tipL[0] / w + 0.02, tipR[0] / w - 0.02) - px) * 0.14; py += (clamp(pty, cy - 0.28, cy + 0.28) - py) * 0.14;
    if (n++ % 2 === 0) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
      if (power3 > 0.02) {
        var mx = px * w, my = py * h, lw = 1 + 2.4 * power3;
        FX.draw(g, tipL[0], tipL[1], mx, my, { w: lw, rough: 0.34, color: '#8fc4ff', alpha: 0.4 + 0.6 * power3 });
        FX.draw(g, mx, my, tipR[0], tipR[1], { w: lw, rough: 0.34, color: '#8fc4ff', alpha: 0.4 + 0.6 * power3 });
        if (Math.random() < 0.5 * power3) FX.draw(g, tipL[0], tipL[1], tipR[0], tipR[1], { w: 1.4, rough: 0.5, alpha: 0.6, color: '#8fc4ff' });
        [tipL, tipR, [mx, my]].forEach(function (p, i) {
          var R = (i === 2 ? 120 : 76) * (0.5 + power3 / 2), rg = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], R);
          rg.addColorStop(0, 'rgba(190,225,255,' + (0.55 * power3).toFixed(2) + ')'); rg.addColorStop(1, 'rgba(190,225,255,0)');
          g.fillStyle = rg; g.fillRect(p[0] - R, p[1] - R, R * 2, R * 2);
        });
      } else if (Math.random() < 0.12) {           /* noch zu weit weg: nur einzelne Funken an den Enden */
        var tp = Math.random() < 0.5 ? tipL : tipR, dir = tp === tipL ? 1 : -1;
        FX.draw(g, tp[0], tp[1], tp[0] + dir * (20 + Math.random() * 50), tp[1] + (Math.random() - 0.5) * 60, { w: 1.2, rough: 0.5, color: '#8fc4ff', branch: false });
      }
    }
    requestAnimationFrame(arcLoop);
  }

  /* ---------- Szene 5: selbst fotografieren, Polaroids fliegen zum Meister ---------- */
  var cam = $('#cam'), vf = $('#vf'), vfImg = $('#vf-img'), vfN = $('#vf-n'), shut = $('#shut'), pols = $$('.pol', cam);
  var camOk = $('#cam-ok'), OKIMG = false; /* OKIMG = true, sobald das Schlussbild mit Haken da ist */
  var camB = $('#cam-b'), camC = $('#cam-c'), camFlash = $('#cam-flash'), camSay = $('#cam-say');
  /* Lage im Foto (Anteile): Handy-Display im Kellerbild, Mappe und Seitenverhältnisse */
  var VF = [0.441, 0.302, 0.562, 0.778], FOLD = [0.535, 0.66], ARA = 16 / 9, FOCA = 0.5, FOCB = 0.52;
  var NAMES = ['Sicherungskasten.', 'Zähler.', 'Problemstelle.'], shots = 0, motif = 0, shotT = [0, 0, 0], landed = [false, false, false], p5 = 0, loop5 = false;
  var camAs = $('#cam-as'), camBgs = $$('.cam-a', cam), camCnt = $('#cam-cnt');
  var vfR = { x: 0, y: 0, w: 10, h: 10 }, fold = [0, 0], cw = 0, ch = 0, pw = 150;
  function cov(w, h, u, v, px) { var dw = Math.max(w, h * ARA), dh = dw / ARA; return [(w - dw) * px + u * dw, (h - dh) * 0.5 + v * dh]; }
  function fitPhone() {
    var r = cam.getBoundingClientRect(); cw = r.width; ch = r.height;
    var a = cov(cw, ch, VF[0], VF[1], FOCA), b = cov(cw, ch, VF[2], VF[3], FOCA);
    vfR = { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] };
    vf.style.transform = 'translate(' + a[0].toFixed(1) + 'px,' + a[1].toFixed(1) + 'px)';
    vf.style.width = vfR.w.toFixed(1) + 'px'; vf.style.height = vfR.h.toFixed(1) + 'px';
    fold = cov(cw, ch, FOLD[0], FOLD[1], FOCB);
    pw = Math.min(ch * 0.19, cw * 0.27); cam.style.setProperty('--pw', pw.toFixed(0) + 'px');
    camFlash.style.setProperty('--fx', ((vfR.x + vfR.w / 2) / cw * 100).toFixed(1) + '%');
    camFlash.style.setProperty('--fy', ((vfR.y + vfR.h * 0.1) / ch * 100).toFixed(1) + '%');
    $$('.cam-bg img', cam).forEach(function (im, i) { im.style.objectPosition = ((i ? FOCB : FOCA) * 100) + '% 50%'; });
  }
  /* nächstes Motiv vor die Kamera: Hintergrund wechselt, die Kamera schwenkt kurz */
  function nextMotif() {
    if (motif >= 2) return;
    motif++;
    camBgs.forEach(function (el, i) { el.classList.toggle('on', i === motif); });
    vfImg.src = vfImg.src.replace(/foto-\d/, 'foto-' + (motif + 1)); vfN.textContent = 'Foto ' + (motif + 1) + ' von 3'; camSay.textContent = NAMES[motif];
    if (camAs.animate && !reduce) camAs.animate([{ transform: 'translateX(0) scale(1)' }, { transform: 'translateX(-3.5%) scale(1.06)', offset: 0.45 }, { transform: 'translateX(0) scale(1)' }], { duration: 900, easing: 'cubic-bezier(.4,0,.2,1)' });
  }
  function shoot() {
    var now = performance.now();
    if (shots >= 3 || shots > motif || (shots && now - shotT[shots - 1] < 1500)) return;
    var i = shots++; shotT[i] = now;
    camFlash.classList.remove('go'); void camFlash.offsetWidth; camFlash.classList.add('go');
    if (FX && !reduce) { var r = cam.getBoundingClientRect(); FX.spark(r.left + vfR.x + vfR.w / 2, r.top + vfR.y, 30, '#fff3c9'); }
    if (shots < 3) setTimeout(nextMotif, reduce ? 0 : 1250);
    else { vfN.textContent = '3 von 3'; setTimeout(function () { camSay.textContent = 'Zack. Zack. Zack.'; }, 900); cam.classList.add('done'); }
    if (!loop5) { loop5 = true; requestAnimationFrame(tick5); }
  }
  function back(t) { t = clamp(t, 0, 1); var c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  function placePols(now) {
    var cx = vfR.x + vfR.w / 2, ty = vfR.y, busy = false, r = cam.getBoundingClientRect(), nLand = 0;
    var fan = [[-1.02, 0.1, -11], [0, -0.16, 2], [1.02, 0.1, 12]], big = cw < 720 ? 2.0 : 1.9;
    pols.forEach(function (el, i) {
      if (i >= shots) { el.style.opacity = 0; el.style.zIndex = 1; return; }
      var s = reduce ? 1 : (now - shotT[i]) / 1500; if (s < 1) busy = true;
      /* 1. Foto poppt groß aus dem Handy, bleibt kurz stehen, legt sich dann in den Fächer */
      var a = back(s / 0.22), h = ease((s - 0.62) / 0.38);
      var bx = cw / 2, by = ch * 0.43, fx = cx + fan[i][0] * pw, fy = ty + fan[i][1] * pw + pw * 0.1;
      var x = cx + (bx - cx) * a, y = (ty + pw * 0.4) + (by - (ty + pw * 0.4)) * a, sc = 0.3 + (big - 0.3) * a, rot = (i - 1) * 3 * a, op = clamp(s * 9, 0, 1);
      x += (fx - x) * h; y += (fy - y) * h; sc += (1 - sc) * h; rot += (fan[i][2] - rot) * h;
      el.style.zIndex = s < 1 ? 9 : 2 + i;
      /* 2. einzeln zur Mappe des Meisters: Bogen, dann hineinfallen */
      var t0 = 0.6 + i * 0.08, t = ease((p5 - t0) / 0.07), d = ease((p5 - t0 - 0.065) / 0.035);
      var mx = fold[0], my = fold[1] - pw * 1.05, arc = Math.sin(t * Math.PI) * -ch * 0.1;
      x += (mx - x) * t; y += (my - y) * t + arc; sc *= 1 - 0.3 * t; rot += (-6 + i * 6 - rot) * t;
      x += (fold[0] - x) * d; y += (fold[1] - y) * d; sc *= 1 - 0.62 * d; op *= 1 - ease((d - 0.55) / 0.45);
      el.style.opacity = op.toFixed(3);
      el.style.transform = 'translate(' + (x - pw / 2).toFixed(1) + 'px,' + (y - pw * 0.62).toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      var isIn = d > 0.7;
      if (isIn && !landed[i]) {
        landed[i] = true;
        if (FX && !reduce) FX.spark(r.left + fold[0], r.top + fold[1], 34, '#ffd166');
        camCnt.classList.remove('bump'); void camCnt.offsetWidth; camCnt.classList.add('bump');
      } else if (!isIn) landed[i] = false;
      if (isIn) nLand++;
    });
    camCnt.textContent = nLand + ' von 3 in der Akte';
    return busy;
  }
  function tick5(now) {
    scene5();
    if ((placePols(now) || wantShots() > shots) && inView(s5)) requestAnimationFrame(tick5); else loop5 = false;
  }
  /* wer nur scrollt, bekommt die drei Fotos trotzdem, eins nach dem anderen */
  function wantShots() { return p5 > 0.44 ? 3 : p5 > 0.28 ? 2 : p5 > 0.12 ? 1 : 0; }
  function scene5() {
    p5 = prog(s5);
    if (wantShots() > shots && inView(s5)) { shoot(); if (!loop5) { loop5 = true; requestAnimationFrame(tick5); } }
    var k = ease((p5 - 0.56) / 0.07);
    camB.style.opacity = k.toFixed(3); vf.style.opacity = (1 - ease((p5 - 0.55) / 0.05)).toFixed(3);
    vf.style.pointerEvents = p5 > 0.55 ? 'none' : 'auto';
    camC.style.opacity = ease((p5 - 0.89) / 0.04).toFixed(3);
    if (camOk) { var ko = ease((p5 - 0.89) / 0.04); camOk.style.opacity = (OKIMG ? 0 : ko).toFixed(3); camOk.style.transform = 'translate(' + fold[0].toFixed(1) + 'px,' + fold[1].toFixed(1) + 'px) scale(' + (0.6 + 0.4 * back(ko)).toFixed(3) + ')'; }
    var co = Math.min(ease((p5 - 0.62) / 0.04), 1 - ease((p5 - 0.87) / 0.03));
    camCnt.style.opacity = co.toFixed(3);
    camCnt.style.transform = 'translate(' + fold[0].toFixed(1) + 'px,' + (fold[1] + pw * 0.55).toFixed(1) + 'px) translate(-50%,0)';
    placePols(performance.now());
    beats(beatSets[2], p5);
  }
  if (shut) shut.addEventListener('click', shoot);

  /* ---------- eine Schleife für alles, was am Scrollen hängt ---------- */
  var tick = false;
  function frame() {
    tick = false;
    if (inView(s1)) scene1();
    if (inView(s3)) { scene3(); if (!vis3 && !reduce) { vis3 = true; requestAnimationFrame(arcLoop); } } else vis3 = false;
    if (inView(s5)) scene5();
  }
  function onScroll() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  function resize() { fit3(); fitPhone(); frame(); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', resize); addEventListener('load', resize);
  resize(); scene1(); scene3(); scene5();

  /* ---------- Karten zünden und gehen auf ---------- */
  var cards = $$('.svc');
  if (reduce || !('IntersectionObserver' in window)) cards.forEach(function (c) { c.classList.add('lit'); });
  else {
    var q = 0, io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, d = q++ * 170;
        setTimeout(function () {
          q = Math.max(0, q - 1);
          var r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
          FX.bolt(cx + (Math.random() - 0.5) * 200, Math.max(0, r.top - 300), cx, r.top + 4, { life: 420, w: 2.8 });
          FX.spark(cx, r.top + 4, 20, '#ffd166');
          setTimeout(function () { el.classList.add('lit'); }, 130);
        }, d);
      });
    }, { threshold: 0.3 });
    cards.forEach(function (c) { io.observe(c); });
  }
  var sheet = $('#sheet'), inn = $('.sheet-in', sheet), lastCard = null;
  function open(card) {
    var s = S[+card.getAttribute('data-i')]; if (!s) return;
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
  document.addEventListener('pointerdown', function (e) { if (e.target.closest('.btn,.lsw')) FX.spark(e.clientX, e.clientY, 12, '#ffd166'); });
})();
