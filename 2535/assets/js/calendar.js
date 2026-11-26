/* ==========================================================================
   PROJEKT 25-35 — Dynamiczny moduł kalendarza + Statyczny Fallback
   ========================================================================== */

(function () {
  const MONTHS_GENITIVE = [
    'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
  ];

  const DAYS_PL = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];

  function parseDateSafe(str) {
    if (!str) return null;
    // Obsługa formatu YYYY-MM-DD jako data lokalna (bez przesunięcia UTC)
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d, 19, 0, 0);
    }
    const dt = new Date(str);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  function formatPolishDate(ev) {
    if (ev.label) return ev.label;
    const start = parseDateSafe(ev.start);
    if (!start) return '';
    const end = ev.end ? parseDateSafe(ev.end) : null;
    if (end && end.toDateString() !== start.toDateString() && ev.allDay) {
      // Google Calendar all-day end date jest ekskluzywna (+1 dzień)
      const adjEnd = new Date(end.getTime() - 86400000);
      if (adjEnd.getMonth() === start.getMonth()) {
        return `${start.getDate()}–${adjEnd.getDate()} ${MONTHS_GENITIVE[start.getMonth()]}`;
      }
      return `${start.getDate()} ${MONTHS_GENITIVE[start.getMonth()]} – ${adjEnd.getDate()} ${MONTHS_GENITIVE[adjEnd.getMonth()]}`;
    }
    return `${start.getDate()} ${MONTHS_GENITIVE[start.getMonth()]}`;
  }

  function formatMeta(ev) {
    const start = parseDateSafe(ev.start);
    const parts = [];
    if (start) {
      parts.push(DAYS_PL[start.getDay()]);
      if (!ev.allDay && ev.hasTime) {
        const hh = String(start.getHours()).padStart(2, '0');
        const mm = String(start.getMinutes()).padStart(2, '0');
        parts.push(`godz. ${hh}:${mm}`);
      }
    }
    if (ev.location) parts.push(ev.location);
    return parts.join(' · ');
  }

  function downloadSingleIcs(ev) {
    const start = parseDateSafe(ev.start);
    if (!start) return;
    const pad = (n) => String(n).padStart(2, '0');
    const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const ymdHis = (d) => `${ymd(d)}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    let dtStartLine, dtEndLine;
    if (ev.hasTime && !ev.allDay) {
      const end = ev.end ? parseDateSafe(ev.end) : new Date(start.getTime() + 2 * 3600000);
      dtStartLine = `DTSTART;TZID=Europe/Warsaw:${ymdHis(start)}`;
      dtEndLine = `DTEND;TZID=Europe/Warsaw:${ymdHis(end)}`;
    } else {
      const endBase = ev.end ? parseDateSafe(ev.end) : start;
      const endNext = new Date(endBase.getFullYear(), endBase.getMonth(), endBase.getDate() + 1);
      dtStartLine = `DTSTART;VALUE=DATE:${ymd(start)}`;
      dtEndLine = `DTEND;VALUE=DATE:${ymd(endNext)}`;
    }

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Projekt 25-35//Hallelu Jah//PL',
      'BEGIN:VEVENT',
      `UID:projekt2535-${ymd(start)}@hallelujah.wroclaw.pl`,
      dtStartLine,
      dtEndLine,
      `SUMMARY:${(ev.title || 'Spotkanie Projekt 25-35').replace(/[\r\n]+/g, ' ')}`,
      ev.location ? `LOCATION:${ev.location.replace(/[\r\n]+/g, ' ')}` : 'LOCATION:Wrocław',
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projekt-25-35-${ymd(start)}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function renderMeetings(events, isLive) {
    const cardEl = document.getElementById('next-meeting-card');
    const ribbonEl = document.getElementById('dates-ribbon');
    const noteEl = document.getElementById('calendar-source-note');
    if (!cardEl || !ribbonEl) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const normalized = events
      .map((ev) => ({ ...ev, _startDate: parseDateSafe(ev.start), _endDate: parseDateSafe(ev.end || ev.start) }))
      .filter((ev) => ev._startDate)
      .sort((a, b) => a._startDate - b._startDate);

    const upcoming = normalized.filter((ev) => ev._endDate >= today);
    const nextEv = upcoming[0] || null;

    if (nextEv) {
      const label = formatPolishDate(nextEv);
      const meta = formatMeta(nextEv);
      const subUrl = window.PROJEKT_CONFIG?.calendar?.googleSubscribeUrl || '#';

      cardEl.innerHTML = `
        <span class="next-meeting-badge">Najbliższe spotkanie</span>
        <h3 class="next-meeting-date">${label}</h3>
        <p class="next-meeting-meta">${nextEv.title || 'Spotkanie Projekt 25-35'}${meta ? ' · ' + meta : ''}</p>
        <div class="next-meeting-actions">
          <button type="button" class="btn btn--primary btn--sm" id="btn-download-ics">Dodaj do kalendarza (.ics)</button>
          <a class="btn btn--sm" href="${subUrl}" target="_blank" rel="noopener noreferrer">Subskrybuj kalendarz Google ↗</a>
        </div>
      `;

      const dlBtn = document.getElementById('btn-download-ics');
      if (dlBtn) dlBtn.addEventListener('click', () => downloadSingleIcs(nextEv));
    } else {
      cardEl.innerHTML = `
        <span class="next-meeting-badge">Kalendarz spotkań</span>
        <h3 class="next-meeting-date">Nowe terminy wkrótce</h3>
        <p class="next-meeting-meta">Śledź sekcję aktualności powyżej lub dołącz do grupy WhatsApp, aby nie przegapić kolejnego spotkania.</p>
      `;
    }

    // Lista terminów zgodna z Brand Bookiem (separator |)
    ribbonEl.innerHTML = normalized
      .map((ev, idx) => {
        const isPast = ev._endDate < today;
        const isNext = nextEv && ev === nextEv;
        const cls = ['date-item', isPast ? 'is-past' : '', isNext ? 'is-next' : ''].filter(Boolean).join(' ');
        const sep = idx < normalized.length - 1 ? '<span class="date-sep" aria-hidden="true">|</span>' : '';
        return `<span class="${cls}">${formatPolishDate(ev)}</span>${sep}`;
      })
      .join(' ');

    if (noteEl) {
      noteEl.textContent = isLive
        ? 'Terminy synchronizowane automatycznie z kalendarzem Google Projektu 25-35.'
        : 'Harmonogram sezonu 2026/2027 (aktualizowany również w kalendarzu Google).';
    }
  }

  async function initCalendar() {
    const cfg = window.PROJEKT_CONFIG?.calendar;
    if (!cfg) return;

    // 1. Natychmiast wyrenderuj fallback (zero layout shift / pustego ekranu)
    renderMeetings(cfg.fallbackEvents || [], false);

    // 2. Jeśli skonfigurowano Google Apps Script endpoint, dociągnij świeże dane live
    if (!cfg.jsonEndpointUrl) return;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(cfg.jsonEndpointUrl, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (Array.isArray(payload.events) && payload.events.length > 0) {
        renderMeetings(payload.events, true);
      }
    } catch (err) {
      clearTimeout(timer);
      // Cichy fallback — użytkownik już widzi statyczne terminy
      console.warn('[Projekt 25-35] Calendar live fetch failed, using fallback:', err.message);
    }
  }

  document.addEventListener('DOMContentLoaded', initCalendar);
})();
