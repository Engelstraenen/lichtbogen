"""Startseiten der drei Testversionen + Übersichtsseite. Wird von build.py benutzt."""
import json


def services_json(KREISE):
    return json.dumps([dict(key=k, name=n, head=h, text=t, pts=p, link=(l[0] if l else ""), cta=(l[1] if l else ""))
                       for k, n, h, t, p, l in KREISE], ensure_ascii=False)


STEPS = """
<section class="band"><div class="wrap">
<div class="sec-head"><p class="eyebrow">So läuft es ab</p><h2>Drei Schritte bis zum Termin.</h2></div>
<div class="grid3">
<div class="card step rv"><b>1</b><h3>Fotos schicken</h3><p class="muted" style="margin-top:8px">Zählerschrank, Problemstelle, Raum. Dauert zwei Minuten und spart die erste Anfahrt.</p></div>
<div class="card step rv"><b>2</b><h3>Rückruf vom Meister</h3><p class="muted" style="margin-top:8px">Wir haben deine Fotos schon gesehen, wenn wir anrufen.</p></div>
<div class="card step rv"><b>3</b><h3>Fester Termin</h3><p class="muted" style="margin-top:8px">Du bekommst einen Tag und eine Uhrzeit. Und jemanden, der dann auch da ist.</p></div>
</div></div></section>
"""

# ------------------------------------------------------------ 3 · Stromausfall (Scrollytelling)
WAVE = "M0 90C170 0 330 170 520 86S850 0 1000 80"


def v3(KREISE, VIZ, CALL, TEL, I):
    cards = ""
    for n, (key, name, head, text, pts, link) in enumerate(KREISE):
        cards += ('<button class="svc" type="button" data-i="%d"><span class="viz">%s</span><b>%s</b>'
                  '<span class="svc-t">%s</span><span class="svc-go">Aufmachen <i>+</i></span></button>' % (n, VIZ[key], name, head))
    return """
<div class="shade" id="shade" aria-hidden="true"></div>
<div class="s-flip" id="flip" aria-hidden="true"><picture><source media="(max-width:700px)" srcset="../assets/img/hand-m.jpg"><img src="../assets/img/hand.jpg" alt=""></picture></div>
<div class="flash" id="flash"></div>
<svg class="wave" id="wave" viewBox="0 0 1000 1500" preserveAspectRatio="none" aria-hidden="true"><path class="wv-fill" d="%(wave)sV1500H0Z"/><path class="wv-edge" d="%(wave)s"/></svg>

<section class="st" id="s1" style="padding:0"><div class="pin">
<div class="k-wrap" id="k-wrap"><picture><source media="(max-width:700px)" srcset="../assets/img/kasten-m.jpg"><img class="k-img" src="../assets/img/kasten.jpg" alt="Offener Sicherungskasten an einer dunklen Wand"></picture><video class="k-vid" id="kvid" muted playsinline preload="auto" tabindex="-1" aria-hidden="true" data-src="../assets/vid/schalter.mp4" data-src-m="../assets/vid/schalter-m.mp4"></video></div>
<div class="k-vig"></div>
<div class="beats">
<div class="beat" data-a="-1" data-b=".13"><h1>Strom weg?</h1><p class="only-out">Scroll weiter. Unten im Keller sitzt der Schalter.</p></div>
<div class="beat" data-a=".18" data-b=".34"><p class="big">Kein Licht.<br>Kein Herd.<br>Kein WLAN.</p></div>
<div class="beat" data-a=".4" data-b=".56"><p class="big">Irgendwo im Keller<br>sitzt der Grund.</p></div>
<div class="beat low" data-a=".62" data-b="2"><p class="big only-out">Leg den Hauptschalter um.</p><p class="big only-on">Strom läuft.<br><em>Wir bringen ihn zurück.</em></p></div>
</div>
<button class="dk-hot" id="hot" type="button" aria-label="Hauptschalter umlegen"><i></i></button>
<p class="hint-scroll">scrollen</p>
</div></section>

<section class="v3-hero"><div class="wrap hero-grid">
<div><p class="eyebrow">Meisterbetrieb und Notdienst · Dortmund</p>
<h2 class="split">Elektrik, die läuft. Und jemand, der kommt, wenn nicht.</h2></div>
<div class="hero-side"><p class="lead">Notdienst Tag und Nacht. Und damit es gar nicht erst dunkel wird: Wallbox, Solaranlage, Smart Home, E-Check und Sanierung vom Meisterbetrieb.</p>
<div class="btn-row"><a class="btn" %(call)s>%(phone)s Notdienst %(tel)s</a><a class="btn btn--ghost" href="foto-check.html">%(cam)s 3 Fotos schicken</a></div></div>
</div>
<div class="wrap"><div class="hn-facts">
<div><b data-count="8">8</b><span>Leute im Team</span></div><div><b data-count="2009" data-plain>2009</b><span>gegründet</span></div>
<div><b data-count="24">24</b><span>Stunden Notdienst</span></div><div><b data-count="1">1</b><span>Werktag bis zum Rückruf</span></div>
</div></div></section>

<section class="st" id="s3" style="padding:0"><div class="pin cb" id="arc">
<div class="half hl"><picture><source media="(max-width:700px)" srcset="../assets/img/kabel-m.jpg"><img src="../assets/img/kabel.jpg" alt="Durchtrenntes Kupferkabel" loading="lazy"></picture></div>
<div class="half hr"><picture><source media="(max-width:700px)" srcset="../assets/img/kabel-m.jpg"><img src="../assets/img/kabel.jpg" alt="" loading="lazy"></picture></div>
<canvas></canvas>
<div class="beats dark-ink">
<div class="beat top" data-a="-1" data-b=".3"><p class="eyebrow">Unser Name</p><p class="big">Kabel durch.</p></div>
<div class="beat top" data-a=".36" data-b=".62"><p class="big">Der Strom springt<br>trotzdem.</p></div>
<div class="beat top" data-a=".68" data-b="2"><p class="big">Das ist ein Lichtbogen.</p><p class="mid">In deiner Wand will ihn niemand haben. Dafür gibt es uns.</p></div>
</div>
<p class="arc-cap">Beweg Maus oder Finger. Der Lichtbogen folgt dir.</p>
</div></section>

<section class="svc-sec" id="leistungen"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Leistungen</p><h2>Sechs Dinge, die wir unter Strom setzen.</h2><p class="lead">Tipp eine Karte an. Sie geht auf, und wieder zu.</p></div>
<div class="svc-grid" id="svc">%(cards)s</div></div></section>

<section class="st" id="s5" style="padding:0"><div class="pin phs">
<div class="ph" id="ph"><img src="../assets/img/handy.jpg" alt="Hand hält ein Smartphone" loading="lazy">
<div class="ph-screen" id="ph-screen" aria-hidden="true">
<div class="scr on"><b>LICHTBOGEN</b><span>Foto-Check</span><em>3 Fotos, 2 Minuten</em></div>
<div class="scr"><img src="../assets/img/kasten-m.jpg" alt=""><span class="sm">Foto 1 · Zählerschrank</span><u></u></div>
<div class="scr"><div class="thumbs"><img src="../assets/img/kasten-m.jpg" alt=""><img src="../assets/img/kabel-m.jpg" alt=""><img src="../assets/img/hand-m.jpg" alt=""></div><span class="sm">3 von 3 Fotos</span><em>Abschicken</em></div>
<div class="scr"><i class="okc">✓</i><span>Akte angelegt</span><span class="sm">Rückruf noch heute</span></div>
</div></div>
<div class="wrap ph-txt"><div class="beats rel">
<div class="beat" data-a="-1" data-b=".22"><p class="eyebrow">Foto-Check</p><p class="big">Der kürzeste Weg zum Elektriker: <em>drei Fotos.</em></p></div>
<div class="beat" data-a=".28" data-b=".47"><p class="big">Zählerschrank fotografieren.</p></div>
<div class="beat" data-a=".53" data-b=".72"><p class="big">Problemstelle und Raum dazu. Abschicken.</p></div>
<div class="beat" data-a=".78" data-b="2"><p class="big">Fertig. Der Meister ruft <em>vorbereitet</em> zurück.</p><p style="margin-top:22px;pointer-events:auto"><a class="btn pill" href="foto-check.html">Jetzt ausprobieren →</a></p></div>
</div></div>
</div></section>
%(steps)s
<section class="v3-cta"><div class="wrap">
<p class="eyebrow">Notdienst</p><h2>Dunkel bei dir?<br>Ein Anruf.</h2>
<p><a class="btn pulse" %(call)s>%(phone)s %(tel)s</a></p>
<p><button class="textbtn" type="button" id="replay">Stromausfall noch einmal von vorn</button></p>
</div></section>

<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-h" hidden><div class="sheet-in">
<button class="sh-x" type="button" id="sh-x" aria-label="Schließen">×</button>
<div class="sh-grid"><div><p class="eyebrow" id="sh-eye"></p><h2 id="sh-h"></h2><p class="lead" id="sh-t"></p><ul id="sh-l"></ul><a class="btn" id="sh-a" href="#"></a></div><div class="viz" id="sh-v"></div></div>
</div></div>
""" % dict(cards=cards, steps=STEPS, call=CALL, tel=TEL, phone=I["phone"], cam=I["cam"], wave=WAVE)


# ------------------------------------------------------------ 2 · Sicherungskasten
GAUGE = ('<div class="gauge"><svg viewBox="0 0 120 78" aria-hidden="true"><path class="g-arc" d="M12 66A48 48 0 0 1 108 66"/>'
         '<path class="g-hot" d="M94 32A48 48 0 0 1 108 66"/><line class="g-needle" id="%s" x1="60" y1="66" x2="60" y2="24"/>'
         '<circle class="g-hub" cx="60" cy="66" r="5"/></svg><span>%s</span></div>')


def v2(KREISE, VIZ, CALL, TEL, I):
    brk = ""
    for n, k in enumerate(KREISE):
        brk += ('<button class="lever brk" type="button" data-i="%d" aria-pressed="false" disabled><i class="lmp"></i>'
                '<span class="slot"><span class="knob"></span></span><b>F%d</b><small>%s</small></button>' % (n, n + 1, k[1]))
    return """
<section class="cab" id="cab"><div class="wrap"><div class="cab-panel">
<i class="screw s1"></i><i class="screw s2"></i><i class="screw s3"></i><i class="screw s4"></i>
<div class="cab-top">
<div class="lcd" id="lcd" aria-live="polite">ANLAGE AUS</div>
<div class="gauges">%(g1)s%(g2)s</div>
<div class="leds" id="leds"><i></i><i></i><i></i><i></i><i></i><i></i></div>
</div>
<div class="cab-head"><h1>Schalt uns ein.</h1><p class="lead" id="hint">Das hier ist unser Sicherungskasten. Leg zuerst den Hauptschalter um.</p></div>
<div class="main-wrap"><button class="lever lever--main" id="main" type="button" aria-pressed="false"><span class="slot"><span class="knob"></span></span><b>Hauptschalter</b></button></div>
<div class="breakers" id="brk">%(brk)s</div>
<div class="drawer" id="drawer" hidden><div class="drawer-in"><div><p class="eyebrow" id="d-eye"></p><h2 id="d-h"></h2><p class="lead" id="d-t"></p><ul id="d-l"></ul><a class="btn" id="d-a" href="#"></a></div><div class="viz" id="d-v"></div></div></div>
</div></div></section>

<section class="patch"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Probier es aus</p><h2>Steck die Wallbox an.</h2><p class="lead">Zieh den Stecker rüber zum Hausanschluss. Oder tipp einfach auf die rechte Dose.</p></div>
<div class="patch-stage"><svg id="patch" viewBox="0 0 600 260" role="img" aria-label="Kabel von der Wallbox zum Hausanschluss ziehen">
<path id="cable" class="cable" d=""/><g id="dots"></g>
<g class="sock"><circle cx="70" cy="130" r="38"/><circle class="hole" cx="70" cy="130" r="14"/><text x="70" y="200">Wallbox</text></g>
<g class="sock" id="target" tabindex="0" role="button" aria-label="Hier einstecken"><circle cx="530" cy="130" r="38"/><circle class="hole" cx="530" cy="130" r="14"/><text x="530" y="200">Hausanschluss</text></g>
<g id="plug" class="plug"><circle r="24"/><rect x="-9" y="-5" width="5" height="10" rx="2"/><rect x="4" y="-5" width="5" height="10" rx="2"/></g>
</svg></div>
<div class="card" id="patch-res" hidden><p class="eyebrow">Angeschlossen</p><h3 style="margin:10px 0 8px;font-size:1.5rem">Strom fließt. So einfach soll es sich anfühlen.</h3>
<p class="muted">Mit 11 kW lädst du rund 60 km Reichweite pro Stunde. Wie lange dein Auto braucht, zeigt der Rechner.</p>
<div class="btn-row" style="margin-top:16px"><a class="btn" href="rechner.html">Zum Rechner</a></div></div>
</div></section>
%(steps)s
<section class="notaus"><div class="wrap">
<p class="eyebrow">Notdienst</p><h2>Wenn es brennt: der rote Knopf.</h2>
<button class="mush" type="button" data-demo="Demo: Hier wählt das Handy direkt den Notdienst." aria-label="Notdienst anrufen"><span>NOT<br>DIENST</span></button>
<p class="lead" style="margin:18px auto 0">%(tel)s · Tag und Nacht</p>
</div></section>
""" % dict(brk=brk, steps=STEPS, tel=TEL, g1=GAUGE % ("g-volt", "Spannung"), g2=GAUGE % ("g-load", "Last"))


# ------------------------------------------------------------ 1 · Haus
HOUSE = """
<svg class="house" id="house" viewBox="0 0 800 720" role="img" aria-label="Aufgeschnittenes Haus mit allen Leistungen">
<rect class="sky" width="800" height="560"/>
<g class="stars"><circle cx="90" cy="60" r="2"/><circle cx="210" cy="36" r="1.500"/><circle cx="330" cy="70" r="1.500"/><circle cx="560" cy="44" r="2"/><circle cx="720" cy="150" r="1.500"/><circle cx="60" cy="190" r="1.500"/></g>
<circle class="sun" cx="700" cy="78" r="34"/><circle class="moon" cx="104" cy="92" r="24"/>
<rect class="ground" y="540" width="800" height="180"/>
<path class="shell" d="M170 250H630V700H170z"/><path class="shell" d="M630 420H790V540H630z"/>
<path class="roof" d="M136 252L400 88L664 252z"/><path class="roof" d="M624 420h172v-12H624z"/>
<g class="rooms">
<rect class="room r-smart" x="182" y="262" width="212" height="126"/><rect class="room r-alt" x="406" y="262" width="212" height="126"/>
<rect class="room r-wohn" x="182" y="400" width="212" height="128"/><rect class="room r-kue" x="406" y="400" width="212" height="128"/>
<rect class="room r-kel" x="182" y="552" width="212" height="136"/><rect class="room r-sp" x="406" y="552" width="212" height="136"/>
<rect class="room r-gar" x="642" y="432" width="136" height="96"/>
</g>
<!-- Leitungen -->
<g class="wires">
<path class="wire w-pv" d="M606 226V620H548"/><path class="wire w-bat" d="M462 620H306"/>
<path class="wire w-house" d="M214 600H176V300H206"/><path class="wire w-house" d="M176 440H206"/><path class="wire w-house" d="M306 640H400V394H430"/><path class="wire w-house" d="M400 534H430"/>
<path class="wire w-gar" d="M400 546H636V470H652"/>
</g>
<!-- Dach / PV -->
<g class="hot" data-z="pv" tabindex="0" role="button" aria-label="Solaranlage"><g transform="translate(436,112) rotate(31.600)"><rect class="pvp" x="0" y="-17" width="50" height="14" rx="2"/><rect class="pvp" x="56" y="-17" width="50" height="14" rx="2"/><rect class="pvp" x="112" y="-17" width="50" height="14" rx="2"/><rect class="pvp" x="168" y="-17" width="50" height="14" rx="2"/></g></g>
<!-- Smart Home: Fenster mit Rollladen -->
<g class="hot" data-z="smart" data-act="shut" tabindex="0" role="button" aria-label="Rollladen fahren"><rect class="win" x="232" y="286" width="84" height="66" rx="3"/><rect class="shutter" x="232" y="286" width="84" height="66"/><path class="frame" d="M232 286h84v66h-84zM274 286v66"/></g>
<rect class="furn" x="330" y="352" width="54" height="30" rx="4"/><circle class="knobc" cx="208" cy="318" r="7"/>
<!-- Altbau -->
<g class="hot" data-z="altbau" tabindex="0" role="button" aria-label="Altbau-Sanierung"><path class="oldwire" d="M420 290h60l10 14 12-14h100"/><rect class="sockn" x="432" y="340" width="20" height="20" rx="4"/><rect class="sockn" x="470" y="340" width="20" height="20" rx="4"/><rect class="socko" x="560" y="340" width="20" height="20" rx="4"/><path class="frame" d="M520 388v-52l24-10v62"/></g>
<!-- Wohnen: Lampe + Schalter -->
<path class="glow-l" d="M268 442L210 528H366L308 442z"/>
<g class="hot" data-z="licht" data-act="lamp" tabindex="0" role="button" aria-label="Licht schalten"><path class="frame" d="M288 400v26"/><path class="lampsh" d="M266 444c0-12 10-18 22-18s22 6 22 18z"/><circle class="lampb" cx="288" cy="446" r="6"/><rect class="sw" x="374" y="452" width="12" height="18" rx="3"/></g>
<rect class="furn" x="200" y="496" width="90" height="26" rx="8"/>
<!-- Küche: E-Check -->
<g class="hot" data-z="echeck" tabindex="0" role="button" aria-label="E-Check"><rect class="furn" x="420" y="486" width="130" height="38" rx="3"/><rect class="furn" x="560" y="430" width="46" height="94" rx="4"/><circle class="hob" cx="450" cy="482" r="9"/><circle class="hob" cx="482" cy="482" r="9"/><path class="chk" d="M506 436h34v40h-34zM514 456l7 7 12-13"/></g>
<!-- Keller: Zählerschrank -->
<g class="hot" data-z="not" data-act="fuse" tabindex="0" role="button" aria-label="Hauptsicherung schalten"><rect class="fbox" x="214" y="574" width="92" height="84" rx="6"/><rect class="fb" x="226" y="588" width="12" height="24" rx="2"/><rect class="fb" x="244" y="588" width="12" height="24" rx="2"/><rect class="fb" x="262" y="588" width="12" height="24" rx="2"/><rect class="fmain" x="282" y="586" width="16" height="30" rx="3"/><circle class="fled" cx="236" cy="640" r="5"/></g>
<!-- Speicher -->
<g class="hot" data-z="pv" tabindex="0" role="button" aria-label="Stromspeicher"><rect class="fbox" x="462" y="576" width="86" height="96" rx="8"/><rect class="bat b1" x="474" y="646" width="62" height="14" rx="3"/><rect class="bat b2" x="474" y="626" width="62" height="14" rx="3"/><rect class="bat b3" x="474" y="606" width="62" height="14" rx="3"/><rect class="bat b4" x="474" y="586" width="62" height="14" rx="3"/></g>
<!-- Garage -->
<g class="hot" data-z="wallbox" data-act="plug" tabindex="0" role="button" aria-label="Auto einstecken"><rect class="wb" x="650" y="452" width="20" height="34" rx="4"/><path class="chg" d="M670 470c14 0 8 26 24 26"/><path class="car" d="M690 506c0-10 6-14 14-16l10-18h40l12 18c6 2 10 6 10 16z"/><circle class="wheel" cx="712" cy="510" r="10"/><circle class="wheel" cx="758" cy="510" r="10"/><rect class="carbat" x="712" y="480" width="44" height="7" rx="2"/><rect class="carfill" x="712" y="480" width="44" height="7" rx="2"/></g>
</svg>"""

ZONES = [
    ("all", "Willkommen im Haus", "Alles, was wir machen, in einem Haus.", "Scroll durch die Räume oder tipp direkt etwas an: Lichtschalter, Rollladen, Auto, Sicherung. Oben rechts wird es Nacht.", "", ""),
    ("pv", "PV und Speicher", "Dein Dach macht Strom.", "Tagsüber fließt Strom vom Dach in den Speicher. Nachts versorgt der Speicher das Haus. Schalt oben auf Nacht und schau zu.", "rechner.html#pv", "Ertrag grob einschätzen"),
    ("wallbox", "Wallbox", "Laden, während du schläfst.", "Tipp auf das Auto und steck es ein. Wir montieren die Wallbox in der Regel an einem Tag.", "rechner.html", "Ladezeit ausrechnen"),
    ("smart", "Smart Home", "Rollläden, Licht, Heizung. Ein Tipp.", "Tipp auf das Fenster: Der Rollladen fährt. So fühlt sich das später auf deinem Handy an.", "foto-check.html", "Beraten lassen"),
    ("licht", "Licht und Schalter", "Licht, wo du es brauchst.", "Tipp auf den Schalter im Wohnzimmer. Neue Stromkreise, mehr Steckdosen, gutes Licht.", "foto-check.html", "Fotos schicken"),
    ("echeck", "E-Check", "Einmal durchmessen, ruhig schlafen.", "Wir prüfen Anlage und Geräte und schreiben auf, was wir gefunden haben. Mit Fotos.", "foto-check.html", "E-Check anfragen"),
    ("altbau", "Altbau-Sanierung", "Alte Leitungen, neuer Stand.", "Raum für Raum, staubarm, damit du weiter wohnen kannst.", "foto-check.html", "Zählerschrank fotografieren"),
    ("not", "Notdienst", "Strom weg? Wir kommen.", "Tipp auf die Hauptsicherung im Keller und schau, was passiert. Im Ernstfall: anrufen, wir fahren los.", "", ""),
]


def v1(KREISE, VIZ, CALL, TEL, I):
    zones = json.dumps([dict(z=z, eye=e, h=h, t=t, link=l, cta=c) for z, e, h, t, l, c in ZONES], ensure_ascii=False)
    return """
<section class="hs" id="hs" style="padding:0"><div class="hs-stage">
<div class="hs-zoom" id="hs-zoom">%(house)s</div>
<button class="daynight" type="button" data-light aria-pressed="true" aria-label="Licht ausschalten"><span class="only-light">Nacht einschalten</span><span class="only-dark">Tag einschalten</span></button>
<div class="hs-card card" id="hs-card" aria-live="polite"><p class="eyebrow" id="hs-eye"></p><h1 id="hs-h"></h1><p class="muted" id="hs-t"></p>
<div class="hs-act"><a class="btn btn--sm" id="hs-a" href="#"></a><a class="btn btn--sm btn--ghost" id="hs-call" %(call)s>%(phone)s %(tel)s</a></div>
<div class="hs-dots" id="hs-dots"></div></div>
</div></section>
<script>window.LB_ZONES=%(zones)s;</script>
%(steps)s
<section><div class="wrap">
<div class="sec-head"><p class="eyebrow">Direkt loslegen</p><h2>Such dir den kürzesten Weg aus.</h2></div>
<div class="grid3">
<a class="card tease rv" href="rechner.html"><div><p class="eyebrow">Rechner</p><h3 style="margin-top:10px">Wallbox und PV grob einschätzen</h3></div><span class="go">Zum Rechner →</span></a>
<a class="card tease rv" href="foto-check.html"><div><p class="eyebrow">Foto-Check</p><h3 style="margin-top:10px">3 Fotos schicken, Rückruf bekommen</h3></div><span class="go">Fotos machen →</span></a>
<a class="card tease rv" href="jobs.html"><div><p class="eyebrow">Jobs</p><h3 style="margin-top:10px">Elektroniker gesucht. Bewerben in 60 Sekunden</h3></div><span class="go">Zu den Jobs →</span></a>
</div></div></section>
""" % dict(house=HOUSE, zones=zones, steps=STEPS, call=CALL, tel=TEL, phone=I["phone"])


HUB = """<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LICHTBOGEN · drei Testversionen (Demo)</title><meta name="robots" content="noindex">
<link rel="stylesheet" href="assets/css/style.css">
<style>body{background:#080a0f;color:#eef1f6}.hub{padding:48px 0 80px}.hub h1{font-size:clamp(2rem,7vw,3.6rem);margin:12px 0 10px}
.hub-grid{display:grid;gap:18px;margin-top:34px}.hub a{display:block;text-decoration:none;border:1px solid #1e2632;border-radius:20px;overflow:hidden;background:#10151e;transition:transform .25s}
.hub a:hover{transform:translateY(-5px)}.hub img{width:100%;aspect-ratio:16/9;object-fit:cover}.hub div.t{padding:18px 20px 22px}.hub b{font:600 1.4rem var(--head);display:block;margin:6px 0}
.hub .eyebrow{color:#ffc83d}.hub p{color:#939dae}@media(min-width:900px){.hub-grid{grid-template-columns:repeat(3,1fr)}}</style></head>
<body><div class="demo" style="background:#141a24;color:#c9d1dd"><div class="wrap"><b>Demo von PROJEKT EX</b>, erfundene Firma, alle Personen, Zahlen und Stimmen sind Beispiele.</div></div>
<main class="hub"><div class="wrap"><p class="eyebrow">LICHTBOGEN Elektrotechnik</p><h1>Drei Testversionen.</h1><p>Gleicher Betrieb, drei Ideen. Jede hat eine Startseite, Rechner, Foto-Check und Jobs.</p>
<div class="hub-grid">
<a href="stromausfall/"><img src="assets/img/3-stromausfall.jpg" alt="Storyboard Stromausfall" loading="lazy"><div class="t"><p class="eyebrow">Version 3</p><b>Stromausfall</b><p>Start im Dunkeln mit Taschenlampe. Sicherung finden, Licht geht in einer Welle an.</p></div></a>
<a href="schaltschrank/"><img src="assets/img/2-schaltschrank.jpg" alt="Storyboard Sicherungskasten" loading="lazy"><div class="t"><p class="eyebrow">Version 2</p><b>Der Sicherungskasten</b><p>Hauptschalter umlegen, Sicherungen schalten Leistungen frei, Kabel stecken.</p></div></a>
<a href="haus/"><img src="assets/img/1-haus.jpg" alt="Storyboard Haus" loading="lazy"><div class="t"><p class="eyebrow">Version 1</p><b>Das Haus unter Strom</b><p>Aufgeschnittenes Haus zum Anfassen, Tag und Nacht, Kamerafahrt durch die Räume.</p></div></a>
</div></div></main></body></html>
"""
