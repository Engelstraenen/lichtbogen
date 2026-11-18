/* LICHTBOGEN · Blitze und Funken auf einer Leinwand über der Seite */
window.FX = (function () {
  'use strict';
  var c, ctx, bolts = [], sparks = [], raf = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (c) return;
    c = document.createElement('canvas');
    c.className = 'fx';
    document.body.appendChild(c);
    ctx = c.getContext('2d');
    size();
    addEventListener('resize', size);
  }
  function size() { c.width = innerWidth * dpr; c.height = innerHeight * dpr; }

  /* gezackter Weg per Mittelpunkt-Verschiebung */
  function jag(x1, y1, x2, y2, disp) {
    var pts = [[x1, y1], [x2, y2]];
    while (disp > 3) {
      var n = [];
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1];
        n.push(a, [(a[0] + b[0]) / 2 + (Math.random() - 0.5) * disp, (a[1] + b[1]) / 2 + (Math.random() - 0.5) * disp]);
      }
      n.push(pts[pts.length - 1]);
      pts = n; disp /= 2;
    }
    return pts;
  }
  function stroke(g, pts, w, alpha, color) {
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.shadowColor = color; g.shadowBlur = 22;
    g.strokeStyle = color; g.globalAlpha = alpha * 0.55; g.lineWidth = w * 3; g.stroke();
    g.shadowBlur = 8;
    g.strokeStyle = '#fff'; g.globalAlpha = alpha; g.lineWidth = w; g.stroke();
  }
  /* einen Blitz zeichnen (auch für eigene Leinwände nutzbar) */
  function draw(g, x1, y1, x2, y2, o) {
    o = o || {};
    var d = Math.hypot(x2 - x1, y2 - y1);
    var pts = jag(x1, y1, x2, y2, d * (o.rough || 0.22));
    stroke(g, pts, o.w || 2.2, o.alpha == null ? 1 : o.alpha, o.color || '#9fd0ff');
    if (o.branch !== false && Math.random() < 0.6) {
      var p = pts[Math.floor(pts.length * (0.3 + Math.random() * 0.4))];
      var ang = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.6, len = d * (0.15 + Math.random() * 0.2);
      stroke(g, jag(p[0], p[1], p[0] + Math.cos(ang) * len, p[1] + Math.sin(ang) * len, len * 0.3), (o.w || 2.2) * 0.6, (o.alpha == null ? 1 : o.alpha) * 0.7, o.color || '#9fd0ff');
    }
    g.globalAlpha = 1; g.shadowBlur = 0;
  }

  function bolt(x1, y1, x2, y2, o) {
    if (reduce) return;
    init(); o = o || {};
    bolts.push({ x1: x1, y1: y1, x2: x2, y2: y2, t: performance.now(), life: o.life || 380, o: o });
    kick();
  }
  function spark(x, y, n, color) {
    if (reduce) return;
    init();
    for (var i = 0; i < (n || 12); i++) {
      var a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 5;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, t: performance.now(), life: 350 + Math.random() * 450, color: color || '#ffd166' });
    }
    kick();
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  function frame(now) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    bolts = bolts.filter(function (b) { return now - b.t < b.life; });
    bolts.forEach(function (b) {
      var k = 1 - (now - b.t) / b.life, o = b.o;
      draw(ctx, b.x1, b.y1, b.x2, b.y2, { w: o.w, color: o.color, rough: o.rough, branch: o.branch, alpha: k });
    });
    sparks = sparks.filter(function (s) { return now - s.t < s.life; });
    sparks.forEach(function (s) {
      var k = 1 - (now - s.t) / s.life;
      s.vy += 0.22; s.x += s.vx; s.y += s.vy;
      ctx.globalAlpha = k; ctx.fillStyle = s.color; ctx.shadowColor = s.color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(s.x, s.y, 1.2 + k * 1.8, 0, 6.3); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    if (bolts.length || sparks.length) raf = requestAnimationFrame(frame);
    else { raf = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  return { bolt: bolt, spark: spark, draw: draw, jag: jag, reduce: reduce };
})();
