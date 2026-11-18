# LICHTBOGEN · Demo-Website für einen Elektrobetrieb

Demo von [PROJEKT EX](https://projektex.de/). LICHTBOGEN Elektrotechnik ist eine erfundene Firma, alle Personen, Zahlen und Stimmen sind Beispiele. Formulare senden nichts, Fotos bleiben im Browser.

**Live ansehen:** https://engelstraenen.github.io/lichtbogen/

## Was die Seite zeigt

- **Stromausfall:** Die Seite startet dunkel. Beim Scrollen fährt die Kamera in den Sicherungskasten, eine Hand legt den Hauptschalter um, das Licht geht an.
- **Lichtbogen:** Zwei Kabelenden fahren zusammen, der Strom springt über und folgt Maus oder Finger.
- **Leistungen:** Sechs Karten, die aufklappen.
- **Foto-Check:** Drei Fotos selbst knipsen, die Polaroids fliegen zum Meister in die Mappe.
- **Bewertungen und Social Media:** Beispiel-Bewertungen im Stil von Google und Trustpilot, Instagram-Bereich.
- **Unterseiten:** Wallbox- und Solar-Rechner, Foto-Check, Jobs.

## Einbetten

```html
<iframe src="https://engelstraenen.github.io/lichtbogen/" width="100%" height="800" style="border:0" loading="lazy" title="LICHTBOGEN Demo"></iframe>
```

## Aufbau

Statische Seite ohne Framework. `build.py` und `landings.py` erzeugen die HTML-Dateien in `site/`, Stil und Skripte liegen in `site/assets/`.

```bash
python3 build.py            # Seiten bauen
python3 tools/serve.py 4351 # Vorschau auf http://127.0.0.1:4351/
```

Veröffentlicht wird der Ordner `site/` über den Branch `gh-pages`. Die drei früheren Testversionen stehen unter `versionen.html`.
