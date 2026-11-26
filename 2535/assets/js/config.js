/* ==========================================================================
   PROJEKT 25-35 — Centralna konfiguracja
   ========================================================================== */

window.PROJEKT_CONFIG = {
  brand: {
    name: 'Projekt 25-35',
    community: 'Stowarzyszenie Hallelu Jah',
    city: 'Wrocław',
    website: 'https://hallelujah.pl',
    website_project: 'https://hallelujah.pl/25-35',
    website_project_temp: 'https://christales.github.io/2535'
  },

  links: {
    // Zdekodowane z kodu QR na plakacie statement
    whatsapp: 'https://chat.whatsapp.com/FQcHV9p5gZxECVSYGdqY8i',
    instagram: 'https://www.instagram.com/projekt.2535/',
    instagramHandle: '@projekt.2535',
    canvaEmbed: 'https://www.canva.com/design/DAG_jIXUzfA/0QFobBp4rq0-3rOt9AP-Ig/view?embed',
    canvaFullscreen: 'https://www.canva.com/design/DAG_jIXUzfA/0QFobBp4rq0-3rOt9AP-Ig/view',
  },

  support: {
    blikDisplay: '797 994 738.',
    blikRaw: '797994738',
    recipient: 'Stowarzyszenie Hallelu Jah',
    title: 'Darowizna na cele statutowe',
  },

  calendar: {
    // Wklej tutaj URL wdrożonego Google Apps Script (patrz: /scripts/google-apps-script-calendar.gs)
    // Dopóki jest pusty (''), strona bezbłędnie korzysta z dat statycznych poniżej (sezon 2026/2027).
    jsonEndpointUrl: 'https://script.google.com/macros/s/AKfycbwmcN-OcurBKehHTIXkw5KYEz0Oio8wSGv7ThM1Cf5R-Fs334nCHlEOjjY-PlF7bFag/exec',

    // Referencyjny publiczny link .ics (używany po stronie serwera / Apps Script, bo Google blokuje CORS w przeglądarce)
    icsReferenceUrl:
      'https://calendar.google.com/calendar/ical/d8f3663e0f66308ba6dae0a6cb03e4ca9c4b702f1dc41cb394d33c00bf9b2c4b%40group.calendar.google.com/public/basic.ics',

    // Publiczny link "Dodaj cały kalendarz" w Google Calendar
    googleSubscribeUrl:
      'https://calendar.google.com/calendar/u/0/r?cid=d8f3663e0f66308ba6dae0a6cb03e4ca9c4b702f1dc41cb394d33c00bf9b2c4b@group.calendar.google.com',

    // Zapisy na najbliższe spotkanie (tymczasowy formularz Google Forms; docelowo własny formularz)
    // forEventDate (YYYY-MM-DD) wiąże formularz z konkretnym terminem, aby po rozpoczęciu spotkania
    // przycisk nie wyświetlał się dla kolejnego miesiąca ze starym linkiem (ustaw null dla formularza uniwersalnego).
    registration: {
      url: 'https://forms.gle/JwHV1rqet3ffC4LJ6',
      forEventDate: '2026-12-05',
    },

    // Statyczny fallback — sezon 2026/2027 ze statementu (wszystkie regularne spotkania to soboty, rekolekcje pt-nd)
    fallbackEvents: [
      { start: '2026-09-05', label: '5 września', title: 'Spotkanie Projekt 25-35' },
      { start: '2026-10-17', label: '17 października', title: 'Spotkanie Projekt 25-35' },
      { start: '2026-11-07', label: '7 listopada', title: 'Spotkanie Projekt 25-35' },
      { start: '2026-12-05', label: '5 grudnia', title: 'Spotkanie Projekt 25-35' },
      { start: '2027-01-16', label: '16 stycznia', title: 'Spotkanie Projekt 25-35' },
      {
        start: '2027-02-05',
        end: '2027-02-07',
        label: '5–7 lutego (rekolekcje wyjazdowe)',
        title: 'Rekolekcje wyjazdowe — Projekt 25-35',
      },
      { start: '2027-03-06', label: '6 marca', title: 'Spotkanie Projekt 25-35' },
      { start: '2027-04-10', label: '10 kwietnia', title: 'Spotkanie Projekt 25-35' },
      { start: '2027-05-22', label: '22 maja', title: 'Spotkanie Projekt 25-35' },
      { start: '2027-06-19', label: '19 czerwca', title: 'Spotkanie Projekt 25-35' },
    ],
  },
};
