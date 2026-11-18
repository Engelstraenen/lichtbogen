#!/usr/bin/env python3
"""Baut die vier statischen Seiten nach site/.  Start:  python3 build.py"""
from pathlib import Path

OUT = Path(__file__).parent / "site"
TEL = "0231 000 00 00"
CALL = 'href="#" data-demo="Demo: Hier wählt das Handy direkt die Nummer des Betriebs."'
SEND = "Demo: Hier geht die Anfrage direkt an den Betrieb. Gesendet wird nichts."

I = {
    "phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    "cam": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    "bulb": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.800 1-2.5A6 6 0 0 0 12 3z"/></svg>',
    "sound": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h3l5 4V6L7 10z"/><path class="on" d="M16 9a4 4 0 0 1 0 6M18.500 6.500a8 8 0 0 1 0 11"/><path class="off" d="M16 9.500l5 5M21 9.500l-5 5"/></svg>',
    "logo": '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M4 24a12 12 0 0 1 24 0"/><path d="M16 5v9" /><circle cx="16" cy="24" r="2.500" fill="currentColor" stroke="none"/></svg>',
    "check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.500l5 5L20 6.500"/></svg>',
}

LAMP = ""

NAV = [("index.html", "Start"), ("rechner.html", "Rechner"), ("foto-check.html", "Foto-Check"), ("jobs.html", "Jobs")]


VARIANTS = {
    "haus": dict(n=1, name="Das Haus unter Strom", theme=None, css="v1.css", js=["v1.js"]),
    "schaltschrank": dict(n=2, name="Der Sicherungskasten", theme="dark", css="v2.css", js=["fx.js", "v2.js"]),
    "stromausfall": dict(n=3, name="Stromausfall", theme="light", css="v3.css", js=["fx.js", "v3.js"]),
}
PAGES = []
import time as _t
VER = str(int(_t.time()))


def page(file, title, desc, body, scripts=""):
    """Unterseiten merken; sie werden für jede Testversion ausgegeben."""
    PAGES.append((file, title, desc, body, scripts))


def emit(vdir, file, title, desc, body, scripts="", landing=False):
    v = VARIANTS[vdir]
    nav = "".join(
        '<a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if h == file else "", t) for h, t in NAV
    )
    forced = "'%s'" % v["theme"] if v["theme"] else "null"
    head_extra = ""
    if vdir == "stromausfall" and landing:
        head_extra = "<script>try{sessionStorage.removeItem('lb3-power');if(location.search.indexOf('licht=an')<0){var d=document.documentElement;d.setAttribute('data-theme','dark');d.classList.add('out')}}catch(e){}</script>"
    light = ('<button class="tool" type="button" data-light aria-pressed="true" aria-label="Licht ausschalten">%s</button>' % I["bulb"]) if not v["theme"] else ""
    if vdir == "stromausfall" and landing:
        light = '<button class="lsw" id="lsw" type="button" role="switch" aria-checked="false" aria-label="Licht an oder aus"><span>Licht</span><i></i></button>'
    js = "".join('\n<script src="../assets/js/%s?v=%s" defer></script>' % (j, VER) for j in v["js"] if landing or j == "fx.js")
    html = """<!doctype html>
<html lang="de" data-theme="light" data-v="%(n)s">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#f4efe6">
<link rel="icon" href="data:image/svg+xml,%%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%%3E%%3Crect width='32' height='32' rx='7' fill='%%23080a0f'/%%3E%%3Cpath d='M6 23a10 10 0 0 1 20 0' fill='none' stroke='%%23ffc83d' stroke-width='3' stroke-linecap='round'/%%3E%%3Ccircle cx='16' cy='23' r='2.500' fill='%%23ffc83d'/%%3E%%3C/svg%%3E">
<script>(function(){var F=%(forced)s,t=F;if(!t){try{t=localStorage.getItem('lb-theme')}catch(e){}}if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)})()</script>
<script>try{fetch('../version.txt?'+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.text():''}).then(function(v){v=v.trim();if(v&&v!=='%(ver)s'&&location.search.indexOf('v='+v)<0){var u=new URL(location.href);u.searchParams.set('v',v);location.replace(u.href)}}).catch(function(){})}catch(e){}</script>%(head_extra)s
<link rel="preload" href="../assets/fonts/grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../assets/css/style.css?v=%(ver)s">
<link rel="stylesheet" href="../assets/css/%(css)s?v=%(ver)s">
</head>
<body>
<div class="demo"><div class="wrap"><span class="for">So könnte das für <span data-firma></span> aussehen.</span>
<b>Demo von <a href="https://projektex.de/" rel="noopener">PROJEKT EX</a></b>, erfundene Firma, alle Personen, Zahlen und Stimmen sind Beispiele.%(tv)s</div></div>
<header class="head">
<div class="wrap head-in">
<a class="logo" href="index.html" aria-label="LICHTBOGEN Startseite">%(logo)s<span>LICHTBOGEN<small>ELEKTROTECHNIK · DORTMUND</small></span></a>
<nav class="nav" aria-label="Hauptmenü">%(nav)s</nav>
<div class="head-tools">
<button class="tool" type="button" data-sound aria-pressed="false" aria-label="Schalter-Klick an oder aus">%(sound)s</button>
%(light)s
<a class="btn btn--sm" %(call)s>%(phone)s %(tel)s</a>
</div>
</div>
<nav class="subnav" aria-label="Seiten">%(nav)s</nav>
</header>
<main>
%(body)s
</main>
<footer class="foot"><div class="wrap foot-in">
<div><a class="logo" href="index.html">%(logo)s<span>LICHTBOGEN</span></a>
<p style="margin-top:14px">Erfundener Elektrobetrieb aus Dortmund. Diese Seite ist ein Muster von <a href="https://projektex.de/" rel="noopener">PROJEKT EX</a>: So kann die Website eines Elektrobetriebs aussehen und arbeiten.</p></div>
<nav aria-label="Fußmenü">%(nav)s<div class="foot-soc"><button class="soc-i" type="button" aria-label="Instagram" data-demo="Demo: Hier geht es zu eurem Instagram-Kanal."><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></svg></button><button class="soc-i" type="button" aria-label="Facebook" data-demo="Demo: Hier geht es zu eurem Facebook-Kanal."><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 21v-7h2.6l.5-3.2h-3.1V8.9c0-1 .5-1.7 1.8-1.7h1.4V4.4c-.5-.1-1.300-.2-2.2-.2-2.500 0-4 1.500-4 4.200v2.400H9V14h2.500v7"/></svg></button><button class="soc-i" type="button" aria-label="YouTube" data-demo="Demo: Hier geht es zu eurem YouTube-Kanal."><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.200 9.300l4.800 2.700-4.800 2.700z" fill="currentColor"/></svg></button><button class="soc-i" type="button" aria-label="TikTok" data-demo="Demo: Hier geht es zu eurem TikTok-Kanal."><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.500a3.500 3.500 0 1 1-3.500-3.500"/><path d="M14 4c.4 2.600 2 4.200 4.500 4.500"/></svg></button><button class="soc-i" type="button" aria-label="WhatsApp" data-demo="Demo: Hier geht es zu eurem WhatsApp-Kanal."><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.300-4.200A8 8 0 1 1 8.300 19z"/><path d="M9.200 9.200c.3 2.300 2.200 4.500 5 5.400l1.300-1.300"/></svg></button></div></nav>
<div><p>Alle Namen, Zahlen und Stimmen sind Beispiele. Formulare senden nichts, Fotos bleiben auf deinem Gerät.</p>
<p style="margin-top:10px">Weitere Demos: <a href="https://projektex.de/referenzen/warmherz/" rel="noopener">WARMHERZ</a> · <a href="https://projektex.de/referenzen/werkakte-app/" rel="noopener">Werkakte-App</a></p></div>
</div></footer>
<div class="bar"><a class="btn" %(call)s>%(phone)s Anrufen</a><a class="btn btn--ghost" href="foto-check.html">%(cam)s Foto-Check</a></div>
<script src="../assets/js/app.js?v=%(ver)s" defer></script>%(js)s%(scripts)s
</body>
</html>
""" % dict(title=title, desc=desc, body=body, nav=nav, scripts=scripts.replace('src="assets/', 'src="../assets/'), call=CALL, tel=TEL,
           n=v["n"], tv=("" if vdir == "stromausfall" else ' · Testversion %s von 3 · <a href="../versionen.html">andere ansehen</a>' % v["n"]), ver=VER, forced=forced, head_extra=head_extra, css=v["css"], js=js, light=light,
           logo=I["logo"], sound=I["sound"], bulb=I["bulb"], phone=I["phone"], cam=I["cam"])
    (OUT / vdir).mkdir(exist_ok=True)
    # Cache-Stempel auch an Bilder und Filme, sonst zeigt der Browser alte Fassungen
    for ext in (".jpg", ".mp4"):
        html = html.replace(ext + '"', ext + "?v=" + VER + '"')
    (OUT / vdir / file).write_text(html, encoding="utf-8")
    print("ok", vdir, file, len(html))


# ------------------------------------------------------------------ Startseite
VIZ = {
    "wallbox": '<svg viewBox="0 0 200 160"><rect x="62" y="18" width="76" height="104" rx="14"/><circle class="a" cx="100" cy="58" r="16"/><path class="af" d="M103 46l-10 14h7l-3 10 10-14h-7z"/><path class="a dash" d="M100 122v14c0 10 46 10 46-6V96"/><rect x="138" y="80" width="16" height="18" rx="4"/></svg>',
    "pv": '<svg viewBox="0 0 200 160"><circle class="a" cx="156" cy="36" r="14"/><path class="a" d="M156 10v6M156 56v6M130 36h6M176 36h6M138 18l4 4M170 50l4 4M174 18l-4 4"/><path d="M26 124l22-62h92l22 62z"/><path d="M71 62l-12 62M117 62l12 62M38 92h112"/><path class="a dash" d="M94 124v22"/></svg>',
    "smart": '<svg viewBox="0 0 200 160"><path d="M34 78l66-52 66 52"/><path d="M50 68v70h100V68"/><path class="a" d="M82 106a26 26 0 0 1 36 0M70 94a42 42 0 0 1 60 0"/><circle class="af" cx="100" cy="120" r="6"/></svg>',
    "echeck": '<svg viewBox="0 0 200 160"><rect x="54" y="22" width="92" height="120" rx="10"/><path d="M82 22v-6h36v6"/><path d="M72 58h56M72 80h56M72 102h30"/><circle class="a" cx="130" cy="112" r="20"/><path class="a" d="M121 112l7 7 12-13"/></svg>',
    "altbau": '<svg viewBox="0 0 200 160"><rect x="30" y="26" width="140" height="108" rx="10"/><path d="M30 60h140"/><rect x="48" y="76" width="16" height="40" rx="3"/><rect x="74" y="76" width="16" height="40" rx="3"/><rect class="a" x="100" y="76" width="16" height="40" rx="3"/><rect class="a" x="126" y="76" width="16" height="40" rx="3"/><path class="a dash" d="M48 43h94"/></svg>',
    "not": '<svg viewBox="0 0 200 160"><circle cx="100" cy="82" r="56"/><path d="M100 26V14M88 14h24"/><path class="af" d="M108 44L74 90h22l-6 32 36-48h-22z"/></svg>',
}

KREISE = [
    ("wallbox", "Wallbox", "Laden, während du schläfst.",
     "Wir schauen uns Zählerschrank und Leitungsweg an, montieren die Wallbox und kümmern uns um die Anmeldung. Du steckst nur noch ein.",
     ["Erste Einschätzung per Foto, ohne Termin", "Montage in der Regel an einem Tag", "Vorbereitet für Laden mit Sonnenstrom"],
     ("rechner.html", "Ladezeit grob ausrechnen")),
    ("pv", "PV und Speicher", "Dein Dach macht Strom.",
     "Wir planen die Anlage nach deinem Verbrauch und nicht nach dem größten Angebot. Dach, Zähler und Inbetriebnahme kommen aus einer Hand.",
     ["Planung nach deinem Jahresverbrauch", "Speicher passend, nicht zu groß", "Ein Ansprechpartner von Anfang bis Ende"],
     ("rechner.html#pv", "Ertrag grob einschätzen")),
    ("smart", "Smart Home", "Licht, Rollläden, Heizung. Ein Tipp.",
     "Wir bauen Steuerungen, die du wirklich nutzt. Auch nachträglich, oft ohne eine Wand aufzumachen.",
     ["Nachrüsten per Funk oder Kabel", "Szenen für Alltag, Urlaub und Abend", "Einweisung, bis jeder im Haus klarkommt"],
     ("foto-check.html", "Fotos schicken und beraten lassen")),
    ("echeck", "E-Check", "Einmal durchmessen, ruhig schlafen.",
     "Wir prüfen Anlage und Geräte und schreiben auf, was wir gefunden haben. Mit Fotos und in klarem Deutsch.",
     ["Prüfung von Anlage und Geräten", "Protokoll mit Fotos", "Klare Liste: was sofort, was später"],
     ("foto-check.html", "Termin für den E-Check anfragen")),
    ("altbau", "Altbau-Sanierung", "Alte Leitungen, neuer Stand.",
     "Neuer Zählerschrank, sauber getrennte Stromkreise, genug Steckdosen. Raum für Raum, damit du weiter wohnen kannst.",
     ["Bestandsaufnahme mit Fotos und Plan", "Staubarm, ein Raum nach dem anderen", "Fester Bauleiter, feste Termine"],
     ("foto-check.html", "Zählerschrank fotografieren")),
    ("not", "Notdienst", "Strom weg? Wir kommen.",
     "Sicherung fliegt, Herd tot, Keller dunkel. Ruf an, wir sagen dir am Telefon, was du sofort tun kannst, und fahren los.",
     ["Tag und Nacht erreichbar", "Erst Fehler finden, dann Aufwand nennen", "Dortmund und Umgebung"],
     None),
]

kreise_html = ""
box = ""
for n, (key, name, head, text, pts, link) in enumerate(KREISE, 1):
    lis = "".join("<li>%s</li>" % p for p in pts)
    if link:
        cta = '<a class="link" href="%s">%s</a>' % link
    else:
        cta = '<a class="btn" %s>%s Notdienst %s</a>' % (CALL, I["phone"], TEL)
    kreise_html += """
<article class="kreis%s" id="f%d"><div class="fuse" aria-hidden="true"><i></i><span>F%d</span></div>
<div class="kreis-in"><div><p class="eyebrow">Stromkreis %d · %s</p><h3>%s</h3><p class="lead">%s</p><ul>%s</ul>%s</div>
<div class="card viz">%s</div></div></article>""" % (" kreis--not" if key == "not" else "", n, n, n, name, head, text, lis, cta, VIZ[key])
    box += '<a href="#f%d"><i></i>F%d %s</a>' % (n, n, name)

# ------------------------------------------------------------------ Rechner
def rng(id, label, mn, mx, step, val, unit):
    return ('<div class="field"><label for="%s">%s <output id="%s-o"></output></label>'
            '<input type="range" id="%s" min="%s" max="%s" step="%s" value="%s" data-unit="%s"></div>'
            % (id, label, id, id, mn, mx, step, val, unit))


def seg(name, label, opts, checked):
    o = "".join('<label><input type="radio" name="%s" value="%s"%s><span>%s</span></label>'
                % (name, v, " checked" if v == checked else "", t) for v, t in opts)
    return '<div class="field"><span class="lab">%s</span><div class="seg">%s</div></div>' % (label, o)


RECHNER = """
<section class="hero hero--sub"><div class="wrap"><div class="hero-in">
<p class="eyebrow hero-top">Rechner</p>
<h1>Lohnt sich das <em>bei mir?</em></h1>
<p class="lead">Ein paar Regler, eine grobe Einschätzung. Ohne Anmeldung und ohne Euro-Versprechen. Die genaue Planung machen wir bei dir vor Ort.</p>
</div></div></section>

<section style="padding-top:20px"><div class="wrap">
<div class="tabs" role="tablist">
<button role="tab" id="t-wb" aria-selected="true" aria-controls="p-wb">Wallbox</button>
<button role="tab" id="t-pv" aria-selected="false" aria-controls="p-pv">PV und Speicher</button>
</div>

<div class="calc" id="p-wb" role="tabpanel" aria-labelledby="t-wb">
<div class="viz" id="viz-wb" aria-hidden="true">
<img class="viz-bg" src="../assets/img/wallbox.jpg" alt="">
<img class="viz-on" id="wb-on" src="../assets/img/wallbox-an.jpg" alt="">
<svg class="viz-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<path class="cab cab-glow" id="wb-c1" d="M0 0"/><path class="cab cab-core" id="wb-c2" d="M0 0"/><path class="cab cab-pulse" id="wb-c3" d="M0 0"/>
</svg>
<div class="hud hud-a"><div class="hbat"><i id="wb-fill"></i></div><b id="wb-hud-night">–</b><span>über Nacht im Akku</span></div>
<div class="hud hud-b"><b id="wb-hud-kmh">–</b><span>Reichweite je Stunde Laden</span></div>
<div class="hud hud-c"><b id="wb-hud-kw">–</b><span>Ladeleistung</span></div>
</div>
<div class="card">
%(wb_km)s%(wb_v)s%(wb_akku)s%(wb_home)s%(wb_kw)s
</div>
<div class="card res" aria-live="polite">
<h3>Deine Wallbox, grob</h3>
<div class="kpis">
<div class="kpi"><b id="wb-time">–</b><span>Ladezeit von 20 auf 80 %%</span></div>
<div class="kpi"><b id="wb-kmh">–</b><span>Reichweite pro Stunde Laden</span></div>
<div class="kpi"><b id="wb-year">–</b><span>Strom fürs Auto zuhause pro Jahr</span></div>
<div class="kpi"><b id="wb-week">–</b><span>Ladestunden pro Woche</span></div>
</div>
<div class="meter"><div class="lab"><span>Über Nacht voll (8 Stunden)?</span><b id="wb-night">–</b></div><div class="track"><i id="wb-bar"></i></div></div>
<p class="verdict" id="wb-verdict"></p>
<div class="btn-row" style="margin-top:18px"><a class="btn" href="foto-check.html">%(cam)s Zählerschrank fotografieren</a></div>
<details><summary>So rechnen wir</summary><ul>
<li>Ladezeit = 60 %% der Akkugröße geteilt durch die Ladeleistung, plus rund 10 %% Ladeverlust.</li>
<li>Reichweite pro Stunde = Ladeleistung geteilt durch deinen Verbrauch.</li>
<li>Jahresstrom = Kilometer mal Verbrauch mal Anteil zuhause, plus Ladeverlust.</li>
<li>Was dein Auto und dein Hausanschluss wirklich schaffen, prüfen wir vor Ort.</li>
</ul></details>
</div>
</div>

<div class="calc" id="p-pv" role="tabpanel" aria-labelledby="t-pv" hidden>
<div class="viz" id="viz-pv" aria-hidden="true">
<img class="viz-bg" src="../assets/img/haus.jpg" alt="">
<img class="viz-lay" id="pv-lit" src="../assets/img/haus-pv.jpg" alt="">
<img class="viz-lay" id="pv-roof" src="../assets/img/haus-pv.jpg" alt="">
<div class="viz-sun" id="pv-sun"></div>
<svg class="viz-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<path class="flow" id="pv-f1" d="M0 0"/><path class="flow" id="pv-f2" d="M0 0"/><path class="flow" id="pv-f3" d="M0 0"/>
</svg>
<div class="chip" id="pv-chip-bat"><i></i><b>Speicher</b></div>
<div class="chip" id="pv-chip-car"><b>E-Auto lädt mit</b></div>
<div class="hud hud-a"><b id="pv-hud-kwp">–</b><span id="pv-hud-mod">Module</span></div>
<div class="hud hud-ring"><svg viewBox="0 0 120 120"><circle class="r-bg" cx="60" cy="60" r="48"/><circle class="r-fg" id="pv-ring" cx="60" cy="60" r="48" pathLength="100"/></svg><b id="pv-hud-aut">–</b><span>deckt das Dach</span></div>
</div>
<div class="card">
%(pv_area)s%(pv_dir)s%(pv_use)s%(pv_bat)s%(pv_car)s
</div>
<div class="card res" aria-live="polite">
<h3>Dein Dach, grob</h3>
<div class="kpis">
<div class="kpi"><b id="pv-kwp">–</b><span>mögliche Anlagengröße</span></div>
<div class="kpi"><b id="pv-yield">–</b><span>Stromertrag pro Jahr</span></div>
</div>
<div class="meter"><div class="lab"><span>Davon nutzt du selbst</span><b id="pv-self">–</b></div><div class="track"><i id="pv-self-bar"></i></div></div>
<div class="meter"><div class="lab"><span>So viel deines Verbrauchs deckt das Dach</span><b id="pv-aut">–</b></div><div class="track"><i id="pv-aut-bar"></i></div></div>
<p class="verdict" id="pv-verdict"></p>
<div class="btn-row" style="margin-top:18px"><a class="btn" href="foto-check.html">%(cam)s Dach und Zähler fotografieren</a></div>
<details><summary>So rechnen wir</summary><ul>
<li>Rund 5,5 m² Dachfläche je Kilowatt-Peak.</li>
<li>Ertrag: 800 bis 950 kWh je Kilowatt-Peak und Jahr bei Südausrichtung, bei Ost/West und Nord entsprechend weniger. Das ist ein Faustwert für unsere Region, kein Messwert für dein Dach.</li>
<li>Eigenverbrauch und Deckung sind Faustformeln aus Ertrag, Verbrauch und Speichergröße. Dein Tagesablauf verschiebt das spürbar.</li>
<li>Zu Förderungen sagen wir hier nichts. Was aktuell gilt, prüfen wir im Gespräch für deinen Fall.</li>
</ul></details>
</div>
</div>
</div></section>
""" % dict(
    lamp=LAMP, cam=I["cam"],
    wb_km=rng("wb-km", "Kilometer pro Jahr", 4000, 40000, 1000, 14000, " km"),
    wb_v=rng("wb-v", "Verbrauch des Autos", 13, 26, 1, 18, " kWh/100 km"),
    wb_akku=rng("wb-akku", "Akkugröße", 30, 110, 5, 60, " kWh"),
    wb_home=rng("wb-home", "Anteil Laden zuhause", 20, 100, 5, 80, " %"),
    wb_kw=seg("wb-kw", "Ladeleistung der Wallbox", [("3.7", "3,7 kW"), ("11", "11 kW"), ("22", "22 kW")], "11"),
    pv_area=rng("pv-area", "Nutzbare Dachfläche", 15, 120, 5, 45, " m²"),
    pv_dir=seg("pv-dir", "Ausrichtung", [("1", "Süd"), ("0.86", "Ost/West"), ("0.62", "Nord")], "1"),
    pv_use=rng("pv-use", "Stromverbrauch pro Jahr", 1500, 10000, 250, 4000, " kWh"),
    pv_bat=seg("pv-bat", "Speicher", [("0", "ohne"), ("5", "5 kWh"), ("10", "10 kWh")], "5"),
    pv_car=seg("pv-car", "E-Auto am Haus", [("0", "nein"), ("1", "ja")], "0"),
)
page("rechner.html", "Wallbox- und PV-Rechner · LICHTBOGEN (Demo)",
     "Grobe Einschätzung für Wallbox und Solaranlage. Demo von PROJEKT EX.", RECHNER,
     '\n<script src="assets/js/pages.js" defer></script>')

# ------------------------------------------------------------------ Foto-Check
def slot(n, title, sub):
    return ('<label class="slot" data-slot="%d"><input type="file" accept="image/*" capture="environment" aria-label="%s">'
            '<span>%s<b>%s</b>%s</span></label>' % (n, title, I["cam"], title, sub))


chips = "".join('<label><input type="radio" name="thema" value="%s"><span>%s</span></label>' % (t, t)
                for t in ["Wallbox", "PV und Speicher", "Sicherung fliegt raus", "Sanierung", "Smart Home", "Etwas anderes"])

FOTO = """
<section class="hero hero--sub"><div class="wrap"><div class="hero-in">
<p class="eyebrow hero-top">Foto-Check</p>
<h1>Drei Fotos statt <em>drei Telefonate.</em></h1>
<p class="lead">Fotografier Zählerschrank und Problemstelle. Die Bilder landen direkt als Akte in der Werkakte-App, und der Meister ruft vorbereitet zurück.</p>
</div></div></section>

<section style="padding-top:20px"><div class="wrap narrow">
<form class="card" id="foto-form" novalidate>
<div class="field"><span class="lab">1. Deine drei Fotos</span>
<div class="slots">%(s1)s%(s2)s%(s3)s</div>
<button class="textbtn" type="button" id="foto-demo">Kein Foto zur Hand? Beispielfotos einsetzen</button></div>
<div class="field"><span class="lab">2. Worum geht es?</span><div class="chips">%(chips)s</div></div>
<div class="field"><label for="f-name">3. Wie erreichen wir dich?</label>
<input type="text" id="f-name" placeholder="Dein Name" autocomplete="name">
<input type="tel" id="f-tel" placeholder="Telefonnummer" autocomplete="tel" inputmode="tel"></div>
<button class="btn" type="submit" style="width:100%%">Fotos abschicken</button>
<p class="hero-note">Demo: Es wird nichts gesendet. Deine Fotos bleiben auf deinem Gerät.</p>
</form>

<div class="card" id="akte" hidden>
<div class="akte-head"><div><p class="eyebrow">Werkakte-App</p><h3 style="margin-top:8px;font-size:1.5rem">Akte angelegt</h3></div><span class="akte-no" id="akte-no"></span></div>
<p class="muted" id="akte-sub"></p>
<div class="akte-pics" id="akte-pics"></div>
<div class="akte-row"><i>1</i><div><b>Fotos eingegangen</b><small>3 Bilder, automatisch der Akte zugeordnet</small></div></div>
<div class="akte-row"><i>2</i><div><b>Meister benachrichtigt</b><small>Jonas Brandt sieht die Akte auf dem Handy</small></div></div>
<div class="akte-row"><i>3</i><div><b>Rückruf geplant</b><small>Noch am selben Werktag</small></div></div>
<div class="btn-row" style="margin-top:20px">
<a class="btn" href="https://projektex.de/referenzen/werkakte-app/" rel="noopener">So sieht die Akte im Betrieb aus</a>
<button class="btn btn--ghost" type="button" id="foto-again">Noch einmal probieren</button></div>
</div>
</div></section>

<section class="band"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Warum Fotos</p><h2>Der Betrieb sieht, was los ist, bevor jemand losfährt.</h2></div>
<div class="grid3">
<div class="card rv"><h3>Kein Hin und Her</h3><p class="muted" style="margin-top:8px">Die meisten Rückfragen klärt ein Bild vom Zählerschrank.</p></div>
<div class="card rv"><h3>Richtiges Material dabei</h3><p class="muted" style="margin-top:8px">Wer vorher weiß, was verbaut ist, kommt mit dem passenden Teil.</p></div>
<div class="card rv"><h3>Alles an einem Ort</h3><p class="muted" style="margin-top:8px">Fotos, Notizen und Termine liegen in einer Akte, nicht in fünf Chats.</p></div>
</div></div></section>
""" % dict(lamp=LAMP, chips=chips,
           s1=slot(1, "Zählerschrank", "Tür offen, ganz drauf"),
           s2=slot(2, "Problemstelle", "so nah wie nötig"),
           s3=slot(3, "Raum", "ein Schritt zurück"))
page("foto-check.html", "Foto-Check · LICHTBOGEN (Demo)",
     "3 Fotos schicken, Rückruf bekommen. Demo von PROJEKT EX.", FOTO,
     '\n<script src="assets/js/pages.js" defer></script>')

# ------------------------------------------------------------------ Jobs
def q(name, kind, opts):
    return "".join('<label><input type="%s" name="%s" value="%s"><span>%s</span></label>' % (kind, name, o, o) for o in opts)


JOBS = """
<section class="hero hero--sub"><div class="wrap"><div class="hero-in">
<p class="eyebrow hero-top">Jobs</p>
<h1>Wir suchen <em>Elektroniker.</em></h1>
<p class="lead">Energie- und Gebäudetechnik (m/w/d), Geselle oder Meister. Acht Leute, kurze Wege, Baustellen im Umkreis. Bewerben dauert bei uns 60 Sekunden, ohne Lebenslauf.</p>
<div class="btn-row"><a class="btn" href="#bewerben">In 60 Sekunden bewerben</a></div>
</div></div></section>

<section style="padding-top:20px"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Was du bekommst</p><h2>Ein Betrieb, in dem man bleibt.</h2></div>
<div class="perks">
<div class="card perk rv">%(check)s<div><h3>Eigener Wagen, eigenes Werkzeug</h3><p class="muted" style="margin-top:6px">Ordentlich ausgestattet, nicht zusammengesucht.</p></div></div>
<div class="card perk rv">%(check)s<div><h3>Freitag mittags Schluss</h3><p class="muted" style="margin-top:6px">Notdienst im Wechsel und mit Ausgleich.</p></div></div>
<div class="card perk rv">%(check)s<div><h3>Papierkram erledigt die App</h3><p class="muted" style="margin-top:6px">Fotos, Zeiten und Material tippst du auf der Baustelle ins Handy. Abends ist Feierabend.</p></div></div>
<div class="card perk rv">%(check)s<div><h3>Weiterbildung bezahlt der Chef</h3><p class="muted" style="margin-top:6px">PV, Speicher, Ladetechnik, Meisterschule. Über Geld reden wir offen im ersten Gespräch.</p></div></div>
</div></div></section>

<section class="band" id="bewerben"><div class="wrap narrow">
<div class="sec-head"><p class="eyebrow">Schnell bewerben</p><h2>Vier Fragen. 60 Sekunden.</h2></div>
<div class="timer" id="timer" hidden><div class="lab"><span>Deine Zeit</span><b id="timer-t">60 s</b></div><div class="track"><i id="timer-bar"></i></div></div>
<form class="card" id="job-form" novalidate>
<div class="dots" aria-hidden="true"><i class="on"></i><i></i><i></i><i></i></div>
<div class="qstep" data-step="1"><h3>Was bist du?</h3><div class="chips">%(q1)s</div></div>
<div class="qstep" data-step="2" hidden><h3>Was machst du am liebsten?</h3><p class="muted" style="margin:-8px 0 14px">Mehrere möglich.</p><div class="chips">%(q2)s</div></div>
<div class="qstep" data-step="3" hidden><h3>Wann könntest du anfangen?</h3><div class="chips">%(q3)s</div></div>
<div class="qstep" data-step="4" hidden><h3>Wen rufen wir an?</h3>
<div class="field"><input type="text" id="j-name" placeholder="Dein Vorname" autocomplete="given-name" aria-label="Vorname">
<input type="tel" id="j-tel" placeholder="Handynummer" autocomplete="tel" inputmode="tel" aria-label="Handynummer"></div></div>
<div class="qnav"><button class="btn btn--ghost" type="button" id="job-back" hidden>Zurück</button><button class="btn" type="button" id="job-next">Weiter</button></div>
<p class="hero-note">Demo: Es wird nichts gesendet.</p>
</form>
<div class="card done" id="job-done" hidden>
<p class="eyebrow">Geschafft</p><b id="job-time"></b>
<h3 style="font-size:1.5rem" id="job-thanks"></h3>
<p class="muted" style="margin-top:10px" id="job-sum"></p>
<div class="btn-row" style="margin-top:20px"><button class="btn btn--ghost" type="button" id="job-again">Noch einmal probieren</button></div>
</div>
</div></section>
""" % dict(lamp=LAMP, check=I["check"],
           q1=q("was", "radio", ["Geselle", "Meister", "Azubi", "Quereinsteiger"]),
           q2=q("lieb", "checkbox", ["PV und Speicher", "Wallbox", "Smart Home", "Sanierung", "Service und Notdienst"]),
           q3=q("wann", "radio", ["Sofort", "In 1 bis 3 Monaten", "Später, erst mal reden"]))
page("jobs.html", "Jobs: Elektroniker gesucht · LICHTBOGEN (Demo)",
     "Bewerben in 60 Sekunden. Demo von PROJEKT EX.", JOBS,
     '\n<script src="assets/js/pages.js" defer></script>')

# ------------------------------------------------------------------ Ausgabe: drei Testversionen
import landings

LAND = {"haus": landings.v1, "schaltschrank": landings.v2, "stromausfall": landings.v3}
for vdir, v in VARIANTS.items():
    body = LAND[vdir](KREISE, VIZ, CALL, TEL, I)
    extra = ""
    if vdir in ("schaltschrank", "stromausfall"):
        extra = "\n<script>window.LB_SERVICES=%s;window.LB_VIZ=%s;</script>" % (
            landings.services_json(KREISE), landings.json.dumps(VIZ))
    emit(vdir, "index.html", "LICHTBOGEN Elektrotechnik Dortmund (Demo)" if vdir == "stromausfall" else "LICHTBOGEN · %s (Demo)" % v["name"],
         "Demo von PROJEKT EX: Website für einen erfundenen Elektrobetrieb.", body, extra, landing=True)
    for f, t, d, b, sc in PAGES:
        emit(vdir, f, t, d, b, sc)
# Hauptlink zeigt direkt die fertige Seite; die Übersicht der drei Testversionen liegt unter versionen.html
(OUT / "versionen.html").write_text(landings.HUB, encoding="utf-8")
(OUT / "version.txt").write_text(VER, encoding="utf-8")
(OUT / "index.html").write_text("""<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LICHTBOGEN Elektrotechnik Dortmund (Demo)</title>
<meta name="description" content="Demo von PROJEKT EX: Website für einen erfundenen Elektrobetrieb.">
<noscript><meta http-equiv="refresh" content="0; url=stromausfall/"></noscript>
<link rel="canonical" href="stromausfall/">
<script>(function(){function go(v){var q=new URLSearchParams(location.search);if(v)q.set('v',v);var t=q.toString();location.replace('stromausfall/'+(t?'?'+t:'')+location.hash)}try{fetch('version.txt?'+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.text():''}).then(function(v){go(v.trim())}).catch(function(){go('')})}catch(e){go('')}})();</script>
<style>body{margin:0;background:#070a12;color:#fff;font:16px system-ui;display:grid;place-items:center;min-height:100vh}a{color:#ffb347}</style>
</head><body><p><a href="stromausfall/">Weiter zur Seite</a></p></body></html>
""", encoding="utf-8")
for old in ("rechner.html", "foto-check.html", "jobs.html"):
    p = OUT / old
    if p.exists():
        p.unlink()
