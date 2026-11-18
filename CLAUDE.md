# PROJEKT-MASTERFILE – LICHTBOGEN
Gilt zusätzlich zur globalen Masterfile (~/.claude/CLAUDE.md).

## 1. Ziel und Endprodukt
Interaktive Demo-Website für einen erfundenen Elektrobetrieb (LICHTBOGEN Elektrotechnik, Dortmund). Musterbeispiel für Akquise-Mails von PROJEKT EX an Elektriker.

## 2. Qualitätsanspruch & Referenzen
Vorbild: WARMHERZ (projektex.de/referenzen/warmherz/) und Werkakte-App. Hell und dunkel gleich gut, mobil zuerst, nur transform/opacity/filter animieren.

## 3. Regeln für dieses Projekt
- Keine echten Firmen, keine Preise/Euro, kein Wort „KI“, keine Rechtsaussagen, keine Förderbeträge.
- Demo-Hinweis oben auf jeder Seite. Formulare senden nichts, Fotos bleiben im Browser.
- Version 3 arbeitet mit fotorealistischen Bildern und einem Schalter-Video (seit 18.11.2026), kein GSAP (alles Vanilla-JS).
- Bilder für die Seite immer in 4K erzeugen (sjinn 5504×3072), auf der Seite 3840 px breit ausliefern, mobil 1800 px. Originale in assets-roh/4k/.

## 4. Skills, Plugins, Agenten, MCP
Keine zusätzlichen nötig.

## 5. Zugänge
gh (Account Engelstraenen) vorhanden. projektex.de-Upload: nur nach OK.

## 6. Workflow & Freigabepunkte
build.py ändern → `python3 build.py` → lokal prüfen → commit → gh-pages aktualisieren.

## 7. Befehle
- Bauen: `python3 build.py` (erzeugt site/<version>/*.html aus build.py + landings.py; CSS/JS liegen in site/assets/)
- Vorschau: `cd site && python3 -m http.server 4350`
- Vorschau mit Video: `python3 tools/serve.py 4351` (kann Teilabrufe, damit das Video spulbar ist). Der einfache http.server reicht dafür nicht.
- Links an Eugen immer mit frischem Anhang schicken (`…/stromausfall/?v=<Zahl>`), nie mit `?licht=an`: GitHub Pages lässt den Browser die Seite bis zu 10 Minuten zwischenspeichern, sonst sieht er den alten Stand.
- Veröffentlichen: `git push origin main && git push -f origin $(git subtree split --prefix site main):refs/heads/gh-pages`

## 8. Offene Fragen
- Umzug nach projektex.de/referenzen/lichtbogen/ (wartet auf OK).
- Optional: Fotos über SJinn ergänzen.
- Schalter-Video ist nur 480p: schärfere Fassung (Upscale oder 1080P-Render) kostet Credits, wartet auf Eugen.
- Unterseiten (Rechner, Foto-Check, Jobs) auf das Niveau der Startseite bringen.

## 9. Entschieden
- 18.11.2026: Name LICHTBOGEN, Stadt Dortmund, rein grafisch. Verbesserungen 1–8 freigegeben (Zugschnur, Sicherungskasten, Notdienst im Dunkeln, ?firma=-Link, Rechner ohne Euro, Foto-Vorschau + Akte, 60-s-Uhr, reduzierte Bewegung).
- 18.11.2026: Persönlicher Link per `?firma=Name` (wird in sessionStorage gemerkt).

- 18.11.2026: Erste Fassung (Lampe + normale Abschnitte) von Eugen abgelehnt: zu simpel. Neues Design nach Konzeptwahl (Storyboards in konzepte/). Vorschläge immer als Storyboard zeigen.

- 18.11.2026: Drei Testversionen gebaut (stromausfall/, schaltschrank/, haus/). Eugens Favorit: 3 Stromausfall; Leitmotiv = durchgetrenntes Kabel, über das der Strom springt.
- 18.11.2026: Version 3 ist der Weg (Scrollytelling, dunkle Farbwelt). Szene 1 ist ein Film: `site/assets/vid/schalter.mp4` (Wan 3.0 bezahlt, 480P, 560 Credits, von Eugen freigegeben), Scrollen spult bis zum Griff an den Schalter.
- 18.11.2026: Eugen will alle Bilder in 4K (Reinzoomen darf nicht schwammig werden). Kasten, Kabel, Handy neu in 4K.
- 18.11.2026: Szenen hängen nur an der Scroll-Position (kein gemerkter Zustand, kein Autoplay). Seite startet immer dunkel.
- 18.11.2026: Bewertungen (Google/Trustpilot-Stil) und Social Media gehören auf die Seite, als „Beispiel“ markiert, ohne Marken-Logos.

## 10. Ablage
Code: Dropbox/CLAUDE/Projekte/LICHTBOGEN · Repo: github.com/Engelstraenen/lichtbogen
