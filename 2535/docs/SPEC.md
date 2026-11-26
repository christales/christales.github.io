# SPEC.md — Projekt 25-35 (Static One-Page, Mobile-First)

## 1. Status prac (co jest już gotowe w pakiecie startowym)
Poniższe elementy zostały **już przygotowane i zweryfikowane**, nie wymagają ponownego generowania:
- [x] **Wektoryzacja logo (`1.png` -> SVG):** `assets/svg/logo-projekt-25-35.svg` (oraz wersje inline w `index.html`), 98.4% wierności względem 4K, podzielone na 4 grupy pod animację: `#logo-projekt`, `#logo-25`, `#logo-dash`, `#logo-35`.
- [x] **Wektoryzacja sygnetu wspólnoty:** `assets/svg/sygnet-hallelu-jah.svg`.
- [x] **Dekodowanie i wektoryzacja QR WhatsApp:** zdekodowany link `https://chat.whatsapp.com/FQcHV9p5gZxECVSYGdqY8i` + zweryfikowany wektorowy QR `assets/svg/whatsapp-qr.svg`.
- [x] **Dokładne tokeny kolorów (pomiar pikselowy):** `#EDEAE4` (tło Warm Sand), `#442B1C` (Deep Espresso — logo/nagłówki), `#4B2E0F` (tekst), `#6E5747` (Muted Umber).
- [x] **Choreografia intro (`anime.js@3.2.2`):** `assets/js/intro.js` (wjazd PROJEKT z góry -> 25 z lewej -> 35 z prawej -> zoom-in myślnika -> pauza -> scale-up w stronę widza + otwarcie 25 i 35 na boki jak wrota + obsługa skip, `sessionStorage`, `prefers-reduced-motion`).
- [x] **Canva Smart Embed (`aktualności`):** responsywny 16:9 w `index.html` + przycisk pełnoekranowy dla mobile.
- [x] **Kalendarz (`assets/js/calendar.js` + `scripts/google-apps-script-calendar.gs`):** gotowy proxy Google Apps Script z cache 15 min + automatyczny statyczny fallback sezonu 2026/2027 + eksport pojedynczego wydarzenia `.ics`.
- [x] **Wsparcie BLIK + Clipboard UX:** `797 994 738.` z przyciskami kopiowania.

---

## 2. Pozostały zakres dla Antigravity (Etap 0 + Finalizacja)
1. **Audyt 12 slajdów (`Prezentacja 25-35 webp/1.webp`–`12.webp`):**
   - Obejrzyj każdy slajd i stwórz krótką tabelę decyzji: `Slajd -> Temat -> Zostaje jako statyczne / Odrzucone`.
   - Wzbogać opisy 4 fundamentów w sekcji `#kim-jestesmy` (jeśli prezentacja je rozwija).
   - Dodaj w miejscu `<!-- TODO (ANTIGRAVITY — ETAP 0) -->` ewentualne ponadczasowe informacje z prezentacji (np. godzina/miejsce spotkań, przebieg typowego wieczoru, FAQ dla nowych osób).
   - Odrzuć ogłoszenia jednorazowe (te obsługuje dynamiczna Canva w `#aktualnosci`).
2. **Font `Safira March`:**
   - Sprawdź, czy w folderze projektu istnieje plik `.woff2`/`.otf`/`.ttf` dla `Safira March`. Jeśli tak, przenieś go do `assets/fonts/SafiraMarch.*` i zweryfikuj ładowanie.
3. **Weryfikacja wizualna (Mobile 375px + Desktop 1440px):**
   - Otwórz `index.html` w przeglądarce (lub z `?intro=1`), sprawdź płynność animacji intro, kontrast, zawijanie nagłówków i brak poziomych pasków przewijania.

---

## 3. Struktura plików
```text
.
├── index.html
├── SPEC.md
├── AGENT_HANDOFF.md
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   └── styles.css
│   ├── fonts/                 # <- tutaj wrzuć SafiraMarch.woff2 (opcjonalnie)
│   ├── js/
│   │   ├── config.js
│   │   ├── intro.js
│   │   ├── calendar.js
│   │   └── main.js
│   └── svg/
│       ├── logo-projekt-25-35.svg
│       ├── sygnet-hallelu-jah.svg
│       └── whatsapp-qr.svg
└── scripts/
    └── google-apps-script-calendar.gs
```
