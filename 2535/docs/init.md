# Zadanie: Statyczna strona One-Page (Mobile-First) — Projekt 25-35

Działaj ściśle w workflow **Spec-Driven Development**:
1. **NIE pisz jeszcze kodu produkcyjnego.**
2. Najpierw wykonaj **Etap 0 (Audyt zasobów)**, a następnie wygeneruj kompletny plik `SPEC.md` z architekturą, wyselekcjonowanymi treściami, planem komponentów oraz listą brakujących zasobów/decyzji.
3. Dopiero po mojej akceptacji `SPEC.md` przejdź do implementacji.

---

## Kontekst i zasoby w repozytorium
Przeanalizuj lokalne pliki w projekcie:
1. `Projekt 25-35 — Wytyczne Marki dla Agentów AI.md` — **nadrzędne źródło prawdy** w zakresie palety barw, typografii, hierarchii nagłówków (nagłówki sekcji pisane małą literą z podkreśleniem, separatory `|` w datach, kropka po numerze BLIK), tonu komunikacji („nie tylko gość, ale domownik”) i reguł wizualnych.
2. `statement plakat filary fundamenty.webp` (lub `.png`) — manifest (5 punktów), 4 fundamenty (Eucharystia, Uwielbienie, Ewangelizacja, Ekumenizm), daty spotkań, dane wsparcia BLIK/przelew, kod QR WhatsApp, sygnet wspólnoty Hallelu Jah.
3. `1.png` (logo główne `PROJEKT 25-35`) — wzorzec do wektoryzacji SVG.
4. Folder `Prezentacja 25-35 webp/` — 12 slajdów prezentacji (`1.webp`–`12.webp`).

---

## Etap 0: Audyt i przygotowanie zasobów (do ujęcia w `SPEC.md`)
1. **Selekcja treści ze slajdów (`Prezentacja 25-35 webp/`):** Obejrzyj wszystkie 12 plików `.webp` i zestaw je ze `statement plakat filary fundamenty.webp`.
   * Wybierz wyłącznie treści **statyczne / ponadczasowe** (np. misja, dla kogo to jest, przebieg typowego spotkania, lokalizacja we Wrocławiu, 4 fundamenty, wartości).
   * Odrzuć treści jednorazowe / przeterminowane (stare ogłoszenia, minione tematy), bo bieżące komunikaty będą szły z osadzonej prezentacji Canva.
   * W `SPEC.md` przedstaw tabelę: `Slajd -> Co zawiera -> Decyzja (Zostaje jako statyczne / Odrzucone) + sekcja docelowa`.
2. **Dekodowanie QR WhatsApp:** Użyj lokalnego skryptu (np. Python + `cv2`/`pyzbar`), aby odczytać dokładny link URL z kodu QR WhatsApp na plakacie. Na mobile użyjemy bezpośredniego przycisku CTA zamiast samego kodu QR (kod QR opcjonalnie pokażemy na desktopie). Jeśli dekodowanie się nie uda, oznacz zmienną `WHATSAPP_INVITE_URL` jako `TODO`.
3. **Weryfikacja fontów:** Sprawdź, czy w repo znajdują się pliki fontu `Safira March` (`.woff2`/`.ttf`/`.otf`).
   * `Lora` ładuj z Google Fonts (`400`, `400i`, `500`, `600`, `latin-ext`).
   * Dla `Safira March` przygotuj `@font-face` na ścieżkę lokalną `./assets/fonts/SafiraMarch.woff2` + elegancki fallback szeryfowy (`'Cormorant Garamond', Georgia, serif`) i zgłoś w `SPEC.md`, jeśli pliku brakuje.
4. **Wektoryzacja logo (`1.png` -> SVG):**
   * **NIE rysuj krzywych Béziera „z głowy”**. Zaproponuj i po akceptacji wykonaj deterministyczną wektoryzację `1.png` (np. Python + `vtracer` / `potrace` lub konwersja konturów z wysoką precyzją) do jednego, czystego pliku/inline SVG z zachowaniem dokładnych proporcji oryginału i koloru `#422B1D`.
   * Ścieżki w SVG muszą być logicznie pogrupowane pod animację w 4 niezależne kontenery (`<g>`):
     * `#logo-projekt` (słowo `PROJEKT`)
     * `#logo-25` (cyfry `25`)
     * `#logo-dash` (myślnik `-`)
     * `#logo-35` (cyfry `35`)

---

## Wymagania technologiczne
* **Stack:** Czysty, statyczny HTML5 + nowoczesny CSS3 (CSS Custom Properties z tokenami z brand booka, bez ciężkich frameworków) + Vanilla JS (ES6+, modułowy kod). Zero wymaganego build stepu (strona ma działać z dowolnego hostingu statycznego: GitHub Pages / Netlify / Cloudflare Pages / klasyczny FTP).
* **Podejście:** Mobile-First, minimalistyczna estetyka „ciepłego minimalizmu” (`#EBE7E0`, `#422B1D`, `#6E5747`), duża ilość oddechu (whitespace), cienkie linie separujące (`1px solid`), dopracowana typografia dla języka polskiego (brak sierotek/spójników na końcach wersów tam, gdzie to możliwe).
* **Animacje:** `anime.js` — przypnij jawnie wersję **`3.2.2`** (CDN z `defer` lub lokalny plik), aby uniknąć konfliktów API z v4.
* **Dostępność i wydajność:**
  * Respektowanie `prefers-reduced-motion: reduce` (natychmiastowe wyłączenie intro i animacji scrolla).
  * `IntersectionObserver` do lekkich, estetycznych reveal-animacji sekcji przy scrollowaniu (bez agresywnego przesuwania, subtelny `translateY(16px) -> 0` + `opacity`).
  * Semantyczny HTML5, poprawne meta tagi Open Graph, favicon bazujący na logo/sygnecie.

---

## Choreografia ekranu wejścia (Intro / Splash Preloader — `anime.js@3.2.2`)
Pełnoekranowy overlay w kolorze tła marki (`#EBE7E0`) z wyśrodkowanym zwektoryzowanym SVG logo (`PROJEKT 25-35`). Sekwencja `anime.timeline()`:
1. **Wjazd `PROJEKT`:** `#logo-projekt` zjeżdża płynnie z góry (`translateY: [-60, 0]`, `opacity: [0, 1]`, `easing: 'easeOutExpo'`).
2. **Wjazd `25`:** `#logo-25` wjeżdża z lewej (`translateX: [-70, 0]`, `opacity: [0, 1]`, lekkie nałożenie w timeline).
3. **Wjazd `35`:** `#logo-35` wjeżdża z prawej (`translateX: [70, 0]`, `opacity: [0, 1]`).
4. **Myślnik (łączenie):** Po dojechaniu `25` i `35`, `#logo-dash` wykonuje punktowy `zoom-in` ze środka (`scale: [0, 1]`, `opacity: [0, 1]`, `transform-origin: center`, `easing: 'easeOutBack'`).
5. **Finał — „Zapraszające wrota”:**
   * Krótka pauza (~250 ms) na wybrzmienie pełnego znaku.
   * Cały kontener logo powiększa się w stronę użytkownika (**scale up**, efekt wjazdu kamery w głąb: `scale: [1, 2.2]`, `easing: 'easeInOutQuart'`).
   * Równocześnie `#logo-dash` znika (`opacity: 0`), `#logo-projekt` unosi się lekko ku górze i znika, a `#logo-25` i `#logo-35` rozsuwają się symetrycznie na boki (`translateX` w lewo i w prawo, opcjonalnie z subtelnym `perspective` + `rotateY` imitującym otwieranie skrzydeł wrót).
   * Overlay płynnie schodzi do `opacity: 0` i `pointer-events: none` (usuwany z flow), odsłaniając gotową sekcję Hero.
* **Reguły UX dla intro:**
  * Całkowity czas trwania: **maksymalnie 2.5–3.0 s**.
  * Dyskretny przycisk „Pomiń” / tapnięcie ekranu przerywa i od razu kończy animację.
  * Zapis flagi w `sessionStorage` — przy ponownym załadowaniu w tej samej sesji intro nie blokuje powracającego użytkownika (chyba że kliknie logo/przycisk powtórki).

---

## Struktura One-Page (sekcje)

1. **Nawigacja (minimalistyczna, sticky):**
   * Dyskretny pasek pojawiający się po zescrollowaniu Hero: małe logo + minimalistyczne menu (na mobile lekkie drawer/overlay menu, na desktopie 4–5 linków kotwicowych: *kim jesteśmy*, *aktualności*, *spotkania*, *wsparcie*, *kontakt*).

2. **Hero:**
   * Zwektoryzowane logo `PROJEKT 25-35` (statyczna wersja po zamknięciu intro).
   * Zwięzłe hasło wprowadzające (przestrzeń modlitwy, relacji i stawania się uczniami Jezusa dla młodych dorosłych 25–35 we Wrocławiu — wspólnota Hallelu Jah).
   * Jedno główne CTA (np. scroll do *najbliższych spotkań* lub *aktualności*) + subtelny wskaźnik przewijania.

3. **Sekcja: `kim jesteśmy i dokąd zmierzamy?`** (treści statyczne)
   * Pięć punktów manifestu ze statementu (estetyczna, czytelna typografia, wyraźna numeracja, nie ściana tekstu).
   * **4 fundamenty** (Eucharystia, Uwielbienie, Ewangelizacja, Ekumenizm) w minimalistycznym układzie kart lub akordeonu/siatki 2x2 z krótkim opisem (w oparciu o wyselekcjonowane slajdy z `Prezentacja 25-35 webp/`).
   * Ewentualne dodatkowe statyczne informacje wybrane z prezentacji w Etapie 0 (np. jak wygląda spotkanie / lokalizacja).

4. **Sekcja: `aktualności`** (Canva Smart Embed)
   * Osadzenie bieżącej prezentacji z Canvy:
     `https://www.canva.com/design/DAG_jIXUzfA/0QFobBp4rq0-3rOt9AP-Ig/view?embed`
   * Dostosuj kod embedu do estetyki brand booka (zamiast domyślnego szarego cienia Canvy zastosuj subtelną ramkę w kolorze marki `#422B1D` o niskiej przezroczystości, zaokrąglenie `8px`, `loading="lazy"`, responsywne proporcje `16:9`).
   * **Kluczowe dla Mobile-First:** Pod iframe umieść wyraźny, estetyczny przycisk/link **„Otwórz prezentację na pełnym ekranie ↗”** prowadzący do `https://www.canva.com/design/DAG_jIXUzfA/0QFobBp4rq0-3rOt9AP-Ig/view` (`target="_blank" rel="noopener"`), ponieważ na małych ekranach slajdy 16:9 wymagają trybu pełnoekranowego.

5. **Sekcja: `najbliższe spotkania:`** (Dynamiczny kalendarz `.ics` + Fallback)
   * Źródło docelowe: `https://calendar.google.com/calendar/ical/d8f3663e0f66308ba6dae0a6cb03e4ca9c4b702f1dc41cb394d33c00bf9b2c4b%40group.calendar.google.com/public/basic.ics`
   * **Uwaga architektoniczna (CORS):** Przeglądarka zablokuje bezpośredni `fetch()` do `calendar.google.com`. W kodzie wydziel konfigurację (`CALENDAR_CONFIG`):
     * Obsługa pobierania z konfigurowalnego endpointu JSON (np. Google Apps Script) LUB proxowanego `.ics` + lekki parser iCalendar (obsługujący `VEVENT`, `DTSTART`, `DTEND`, `SUMMARY`, `LOCATION`, `DESCRIPTION`, strefę `Europe/Warsaw`).
     * Przygotuj w osobnym pliku folderu `/scripts` gotowy, 20-liniowy szablon **Google Apps Script** (lub **Cloudflare Worker**), który użytkownik wdroży w 2 minuty, żeby ominąć CORS bez kosztu i backendu.
     * **Fallback (obowiązkowy):** Jeśli endpoint proxy nie jest jeszcze skonfigurowany lub zapytanie zawiedzie, strona bezbłędnie wyświetla statyczną listę dat ze statementu (odfiltrowując automatycznie daty z przeszłości względem aktualnej daty przeglądarki, wyróżniając najbliższe nadchodzące spotkanie).
   * Formatowanie: najbliższe spotkanie wyróżnione (karta z datą, godziną, miejscem i przyciskiem „Dodaj do kalendarza”), poniżej pełna lista nadchodzących terminów z separatorem `|` zgodnie z brand bookiem.

6. **Sekcja: `wsparcie (blik): 797 994 738.`**
   * Zgodność 1:1 z brand bookiem (nagłówek z małej litery, podkreślony, z kropką po numerze).
   * Odbiorca: `Stowarzyszenie Hallelu Jah`, tytuł: `Darowizna na cele statutowe`.
   * **Mobile UX:** Dodaj minimalistyczne przyciski **„Kopiuj numer”** i **„Kopiuj dane do przelewu”** (Clipboard API) z subtelnym potwierdzeniem (`Skopiowano`).

7. **Sekcja: `dołącz do nas` + Stopka**
   * **WhatsApp:** Przycisk CTA „Dołącz do grupy WhatsApp” (z zdekodowanym URL z plakatu) + na desktopie opcjonalny estetyczny podgląd kodu QR w kolorze `#422B1D`.
   * **Instagram:** Link/przycisk `@projekt.2535` -> `https://www.instagram.com/projekt.2535/`.
   * **Stopka:** Cienka linia oddzielająca, sygnet wspólnoty Hallelu Jah, krótka nota informacyjna.

---

## Oczekiwany rezultat w pierwszej turze
Wykonaj Etap 0 na plikach lokalnych i utwórz plik `SPEC.md` zawierający:
1. Mapę treści wybranych z `Prezentacja 25-35 webp/` (tabela 12 slajdów).
2. Status zasobów lokalnych (czy znaleziono font `Safira March`, wynik dekodowania QR WhatsApp, metoda wektoryzacji `1.png`).
3. Proponowaną strukturę plików projektu.
4. Decyzję w sprawie obejścia CORS dla kalendarza Google (Google Apps Script vs Cloudflare Worker).
5. Krótką listę pytań blokujących, jeśli jakieś występują.

Zatrzymaj się po wygenerowaniu `SPEC.md` i poczekaj na moje potwierdzenie przed napisaniem HTML/CSS/JS.