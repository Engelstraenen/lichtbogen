/* LICHTBOGEN · Rechner, Foto-Check, Jobs. Nichts wird gesendet. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var toast = function (m) { if (window.LB) window.LB.toast(m); };
  var nf = function (n, d) { return n.toLocaleString('de-DE', { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }); };
  var val = function (id) { return parseFloat($('#' + id).value); };
  var radio = function (name) { var r = $('input[name="' + name + '"]:checked'); return r ? r.value : null; };
  var txt = function (id, t) { $('#' + id).textContent = t; };
  var bar = function (id, p) { $('#' + id).style.transform = 'scaleX(' + Math.max(0, Math.min(1, p)).toFixed(3) + ')'; };

  /* ================= Rechner ================= */
  if ($('#p-wb')) {
    var tabs = $$('[role="tab"]');
    var show = function (id) {
      tabs.forEach(function (t) {
        var on = t.id === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        $('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.id); }); });
    if (location.hash === '#pv') show('t-pv');

    var outs = function () {
      $$('input[type=range]').forEach(function (r) {
        $('#' + r.id + '-o').textContent = nf(parseFloat(r.value)) + r.getAttribute('data-unit');
      });
    };
    var hm = function (h) {
      var m = Math.round(h * 60), H = Math.floor(m / 60), M = m % 60;
      return H ? H + ' h' + (M ? ' ' + M + ' min' : '') : M + ' min';
    };
    var wallbox = function () {
      var km = val('wb-km'), v = val('wb-v'), akku = val('wb-akku'), home = val('wb-home') / 100, kw = parseFloat(radio('wb-kw'));
      var loss = 1.1;
      var year = km * v / 100 * home * loss;
      txt('wb-time', hm(0.6 * akku * loss / kw));
      txt('wb-kmh', 'ca. ' + nf(kw / v * 100) + ' km');
      txt('wb-year', 'ca. ' + nf(Math.round(year / 50) * 50) + ' kWh');
      txt('wb-week', 'ca. ' + nf(year / 52 / kw, 1) + ' h');
      var night = Math.min(1, kw * 8 / loss / akku);
      txt('wb-night', night >= 1 ? 'Ja, komplett' : 'ca. ' + nf(night * 100) + ' % vom Akku');
      bar('wb-bar', night);
      var t;
      if (kw < 5) t = 'Mit 3,7 kW lädst du langsam, aber über Nacht kommt bei den meisten Pendelstrecken genug zusammen. Gut, wenn das Auto lange steht.';
      else if (kw < 20) t = '11 kW passt für die meisten Haushalte: über Nacht ist der Akku voll, und der Hausanschluss kommt in der Regel gut damit klar.';
      else t = '22 kW lädt schnell, aber nur, wenn Auto und Hausanschluss das mitmachen. Das klären wir mit einem Blick in deinen Zählerschrank.';
      txt('wb-verdict', t);
    };
    var pv = function () {
      var area = val('pv-area'), f = parseFloat(radio('pv-dir')), use = val('pv-use'), bat = parseFloat(radio('pv-bat')), car = radio('pv-car') === '1';
      if (car) use += 2500;
      var kwp = area / 5.5;
      var lo = kwp * 800 * f, hi = kwp * 950 * f, mid = (lo + hi) / 2;
      var r = mid / use;
      var s0 = Math.min(0.95, 0.32 / Math.pow(r, 0.75));
      var direct = mid * s0;
      var extra = Math.max(0, Math.min(bat * 250, (mid - direct) * 0.8, use * 0.92 - direct));
      var selfKwh = Math.min(direct + extra, use * 0.95);
      var self = selfKwh / mid, aut = selfKwh / use;
      var span = function (p) {
        var a = Math.max(0, Math.round(p * 100 / 5) * 5 - 5), b = Math.min(100, a + 10);
        return 'ca. ' + a + ' bis ' + b + ' %';
      };
      txt('pv-kwp', 'ca. ' + nf(kwp, 1) + ' kWp');
      txt('pv-yield', nf(Math.round(lo / 100) * 100) + ' bis ' + nf(Math.round(hi / 100) * 100) + ' kWh');
      txt('pv-self', span(self)); bar('pv-self-bar', self);
      txt('pv-aut', span(aut)); bar('pv-aut-bar', aut);
      var t;
      if (f < 0.7) t = 'Ein Norddach bringt deutlich weniger. Ob es sich trotzdem rechnet, hängt von Neigung und Schatten ab. Schick uns ein Foto, wir sagen es dir ehrlich.';
      else if (r > 1.8 && bat === 0) t = 'Dein Dach liefert deutlich mehr, als du verbrauchst. Ein Speicher oder ein E-Auto würden viel mehr davon im Haus halten.';
      else if (r < 0.6) t = 'Dein Dach ist klein im Verhältnis zum Verbrauch. Fast jede Kilowattstunde bleibt im Haus, ein großer Speicher bringt hier wenig.';
      else t = 'Dach und Verbrauch passen gut zusammen. Die genaue Größe von Anlage und Speicher legen wir nach deinem Tagesablauf fest.';
      if (car) t += ' Das E-Auto ist mit rund 2.500 kWh pro Jahr eingerechnet.';
      txt('pv-verdict', t);
    };
    var all = function () { outs(); wallbox(); pv(); };
    document.addEventListener('input', all);
    all();
  }

  /* ================= Foto-Check ================= */
  var fForm = $('#foto-form');
  if (fForm) {
    var slots = $$('.slot'), akte = $('#akte');
    var fill = function (slot, url) {
      var img = $('img', slot) || slot.appendChild(document.createElement('img'));
      img.alt = 'Vorschau ' + $('b', slot).textContent;
      img.src = url;
      slot.classList.add('full');
    };
    slots.forEach(function (s) {
      $('input', s).addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (file) fill(s, URL.createObjectURL(file));
      });
    });
    var sample = function (label, hue) {
      var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'><rect width='300' height='400' fill='hsl(" + hue + ",18%,24%)'/>" +
        "<rect x='60' y='70' width='180' height='230' rx='10' fill='hsl(" + hue + ",12%,78%)'/>" +
        "<g fill='hsl(" + hue + ",14%,30%)'><rect x='82' y='100' width='22' height='56' rx='4'/><rect x='112' y='100' width='22' height='56' rx='4'/><rect x='142' y='100' width='22' height='56' rx='4'/><rect x='172' y='100' width='22' height='56' rx='4'/><rect x='82' y='190' width='136' height='74' rx='6'/></g>" +
        "<text x='150' y='352' font-family='sans-serif' font-size='22' font-weight='700' fill='#fff' text-anchor='middle'>" + label + "</text></svg>";
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    };
    $('#foto-demo').addEventListener('click', function () {
      [['Zählerschrank', 38], ['Problemstelle', 205], ['Raum', 150]].forEach(function (d, i) { fill(slots[i], sample('Beispiel: ' + d[0], d[1])); });
    });
    fForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = slots.filter(function (s) { return !s.classList.contains('full'); }).length;
      if (missing) { toast('Es fehlen noch ' + missing + (missing === 1 ? ' Foto.' : ' Fotos.') + ' Oder nimm die Beispielfotos.'); return; }
      var name = $('#f-name').value.trim() || 'dich';
      var thema = radio('thema');
      $('#akte-no').textContent = 'LB-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
      $('#akte-sub').textContent = 'Für ' + name + (thema ? ' · Thema: ' + thema : '') + '. So kommt deine Anfrage im Betrieb an.';
      var pics = $('#akte-pics');
      pics.textContent = '';
      slots.forEach(function (s) { var i = document.createElement('img'); i.src = $('img', s).src; i.alt = ''; pics.appendChild(i); });
      var rows = $$('.akte-row', akte);
      rows.forEach(function (r) { r.classList.remove('in'); });
      fForm.hidden = true; akte.hidden = false;
      akte.scrollIntoView({ block: 'center', behavior: 'smooth' });
      $$('img', pics).forEach(function (im, i) { setTimeout(function () { im.classList.add('in'); }, 150 + i * 160); });
      rows.forEach(function (r, i) { setTimeout(function () { r.classList.add('in'); }, 800 + i * 550); });
    });
    $('#foto-again').addEventListener('click', function () {
      akte.hidden = true; fForm.hidden = false; fForm.reset();
      slots.forEach(function (s) { s.classList.remove('full'); var i = $('img', s); if (i) i.remove(); });
      fForm.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }

  /* ================= Jobs ================= */
  var jForm = $('#job-form');
  if (jForm) {
    var step = 1, t0 = 0, tick = 0;
    var steps = $$('.qstep', jForm), dots = $$('.dots i', jForm);
    var next = $('#job-next'), back = $('#job-back'), timer = $('#timer'), done = $('#job-done');
    var render = function () {
      steps.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== step; });
      dots.forEach(function (d, i) { d.classList.toggle('on', i < step); });
      back.hidden = step === 1;
      next.textContent = step === 4 ? 'Bewerbung abschicken' : 'Weiter';
    };
    var start = function () {
      if (t0) return;
      t0 = performance.now();
      timer.hidden = false;
      (function loop() {
        if (!t0) return;
        var s = (performance.now() - t0) / 1000;
        $('#timer-bar').style.transform = 'scaleX(' + Math.max(0, 1 - s / 60).toFixed(4) + ')';
        $('#timer-t').textContent = s < 60 ? Math.ceil(60 - s) + ' s' : '+' + Math.floor(s - 60) + ' s';
        tick = requestAnimationFrame(loop);
      })();
    };
    var ok = function () {
      if (step === 1) return !!radio('was');
      if (step === 2) return $$('input[name="lieb"]:checked').length > 0;
      if (step === 3) return !!radio('wann');
      return $('#j-name').value.trim().length > 1 && $('#j-tel').value.replace(/\D/g, '').length >= 6;
    };
    jForm.addEventListener('input', start);
    jForm.addEventListener('change', function (e) {
      start();
      if (e.target.type === 'radio' && step < 4) setTimeout(function () { if (ok()) { step++; render(); } }, 220);
    });
    next.addEventListener('click', function () {
      start();
      if (!ok()) { toast(step === 4 ? 'Vorname und Handynummer fehlen noch.' : 'Tipp bitte eine Antwort an.'); return; }
      if (step < 4) { step++; render(); if (step === 4) $('#j-name').focus(); return; }
      var secs = Math.max(1, Math.round((performance.now() - t0) / 1000));
      cancelAnimationFrame(tick); t0 = 0;
      $('#job-time').textContent = secs + (secs === 1 ? ' Sekunde' : ' Sekunden');
      $('#job-thanks').textContent = 'Danke, ' + $('#j-name').value.trim() + '. Jonas ruft dich an.';
      $('#job-sum').textContent = radio('was') + ' · ' + $$('input[name="lieb"]:checked').map(function (i) { return i.value; }).join(', ') + ' · Start: ' + radio('wann') + '. Demo: Es wurde nichts gesendet.';
      jForm.hidden = true; timer.hidden = true; done.hidden = false;
    });
    back.addEventListener('click', function () { if (step > 1) { step--; render(); } });
    jForm.addEventListener('submit', function (e) { e.preventDefault(); next.click(); });
    $('#job-again').addEventListener('click', function () {
      jForm.reset(); step = 1; render(); done.hidden = true; jForm.hidden = false;
    });
    render();
  }
})();
