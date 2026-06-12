# Concept 34 – Static Rebuild

Dieses Paket ist die vereinfachte HTML/CSS/JS-Version des Horizon-Exports.

## Entfernt
- React / Vite
- React Router
- Tailwind / PostCSS
- shadcn/ui-Komponenten
- framer-motion
- generierte UI-Dateien, die im echten Projekt nicht gebraucht wurden

## Enthalten
- index.html
- leistungen.html
- referenzen.html
- ueber-uns.html
- kontakt.html
- styles.css
- script.js

## Hinweise
- Der Stil wurde so nah wie möglich am Export nachgebaut.
- Das Kontaktformular speichert Anfragen wie im Horizon-Prototyp lokal im localStorage.
- Bilder bleiben über die vorhandenen CDN-/Unsplash-Links eingebunden.

## Aktueller Fertigstellungsstand
- `datenschutz.html` und `impressum.html` sind angelegt und im Footer verlinkt.
- Die Rechtstexte enthalten bewusst Platzhalter und muessen vor einem Launch mit echten Unternehmensdaten ersetzt und rechtlich geprueft werden.
- Das Kontaktformular versendet noch keine Nachricht; es speichert nur lokal im Browser.
- Adresse, Telefonnummer und E-Mail sind noch Musterangaben.

## Launch-Blocker
1. Echte Unternehmens- und Kontaktdaten eintragen.
2. Finales Impressum und finale Datenschutzhinweise ergaenzen.
3. Entscheiden, ob externe Bilder/Fonts lokal gehostet werden sollen.
4. Kontaktformular an E-Mail, CRM oder Backend anbinden.
