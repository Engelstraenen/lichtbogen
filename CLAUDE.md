# PROJEKT-MASTERFILE – LICHTBOGEN
Gilt zusätzlich zur globalen Masterfile (~/.claude/CLAUDE.md).

## 1. Ziel und Endprodukt
Interaktive Demo-Website für einen erfundenen Elektrobetrieb (LICHTBOGEN Elektrotechnik, Dortmund). Musterbeispiel für Akquise-Mails von PROJEKT EX an Elektriker.

## 2. Qualitätsanspruch & Referenzen
Vorbild: WARMHERZ (projektex.de/referenzen/warmherz/) und Werkakte-App. Hell und dunkel gleich gut, mobil zuerst, nur transform/opacity/filter animieren.

## 3. Regeln für dieses Projekt
- Keine echten Firmen, keine Preise/Euro, kein Wort „KI“, keine Rechtsaussagen, keine Förderbeträge.
- Demo-Hinweis oben auf jeder Seite. Formulare senden nichts, Fotos bleiben im Browser.
- Rein grafisch (SVG/CSS), keine Fotos, kein GSAP (alles Vanilla-JS).

## 4. Skills, Plugins, Agenten, MCP
Keine zusätzlichen nötig.

## 5. Zugänge
gh (Account Engelstraenen) vorhanden. projektex.de-Upload: nur nach OK.

## 6. Workflow & Freigabepunkte
build.py ändern → `python3 build.py` → lokal prüfen → commit → gh-pages aktualisieren.

## 7. Befehle
- Bauen: `python3 build.py` (erzeugt site/*.html; CSS/JS liegen direkt in site/assets/)
- Vorschau: `cd site && python3 -m http.server 4350`
- Veröffentlichen: `git push origin main && git push -f origin $(git subtree split --prefix site main):refs/heads/gh-pages`

## 8. Offene Fragen
- Umzug nach projektex.de/referenzen/lichtbogen/ (wartet auf OK).
- Optional: Fotos über SJinn ergänzen.
- Welches Konzept (1 Haus, 2 Sicherungskasten, 3 Stromausfall)? Wartet auf Eugen.

## 9. Entschieden
- 18.11.2026: Name LICHTBOGEN, Stadt Dortmund, rein grafisch. Verbesserungen 1–8 freigegeben (Zugschnur, Sicherungskasten, Notdienst im Dunkeln, ?firma=-Link, Rechner ohne Euro, Foto-Vorschau + Akte, 60-s-Uhr, reduzierte Bewegung).
- 18.11.2026: Persönlicher Link per `?firma=Name` (wird in sessionStorage gemerkt).

- 18.11.2026: Erste Fassung (Lampe + normale Abschnitte) von Eugen abgelehnt: zu simpel. Neues Design nach Konzeptwahl (Storyboards in konzepte/). Vorschläge immer als Storyboard zeigen.

## 10. Ablage
Code: Dropbox/CLAUDE/Projekte/LICHTBOGEN · Repo: github.com/Engelstraenen/lichtbogen
