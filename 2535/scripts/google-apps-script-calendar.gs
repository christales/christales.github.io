/**
 * ============================================================================
 * PROJEKT 25-35 — Google Apps Script JSON Feed (obejście CORS dla Google Calendar)
 * ============================================================================
 * Jak wdrożyć w 2 minuty (darmowe, zero backendu):
 * 1. Wejdź na https://script.google.com -> "Nowy projekt".
 * 2. Wklej cały poniższy kod i zapisz (Ctrl+S).
 * 3. Kliknij "Wdróż" -> "Nowe wdrożenie" -> Typ: "Aplikacja internetowa":
 *    - Wykonaj jako: "Ja"
 *    - Kto ma dostęp: "Wszyscy"
 * 4. Skopiuj wygenerowany URL (kończy się na /exec) i wklej go do
 *    assets/js/config.js -> calendar.jsonEndpointUrl
 * ============================================================================
 */

// [ACTION_REQUIRED]: Update with your Google Calendar iCal address
const ICAL_URL = 'https://calendar.google.com/calendar/ical/d8f3663e0f66308ba6dae0a6cb03e4ca9c4b702f1dc41cb394d33c00bf9b2c4b%40group.calendar.google.com/public/basic.ics';
const TIME_ZONE = 'Europe/Warsaw';
const CACHE_KEY = 'projekt2535_events_v1';
const CACHE_TTL_SECONDS = 900; // 15 minut

/**
 * Web App entry point returning cached or freshly parsed calendar events as JSON.
 *
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response containing events.
 */
function doGet() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    return jsonResponse(cached);
  }

  if (!ICAL_URL || ICAL_URL === 'INSERT_ICAL_URL_HERE') {
    return jsonResponse(JSON.stringify({ error: 'ICAL_URL is not configured.', events: [] }));
  }

  try {
    const response = UrlFetchApp.fetch(ICAL_URL, { muteHttpExceptions: true });
    const code = response.getResponseCode();
    if (code !== 200) {
      console.error(`Failed to fetch iCal feed. HTTP ${code}: ${response.getContentText()}`);
      return jsonResponse(JSON.stringify({ error: `HTTP ${code} fetching calendar feed`, events: [] }));
    }

    const icsText = response.getContentText();
    const now = new Date();
    const startRange = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const endRange = new Date(now.getFullYear(), now.getMonth() + 14, 1);

    const events = parseIcsEvents(icsText, startRange, endRange);
    const payload = JSON.stringify({
      updatedAt: new Date().toISOString(),
      events: events,
    });

    cache.put(CACHE_KEY, payload, CACHE_TTL_SECONDS);
    return jsonResponse(payload);
  } catch (err) {
    console.error(`Error in doGet: ${err}`);
    return jsonResponse(JSON.stringify({ error: String(err), events: [] }));
  }
}

/**
 * Parses VEVENT blocks from an iCalendar (.ics) string within the given date range.
 *
 * @param {string} icsText Raw iCalendar feed text.
 * @param {Date} startRange Inclusive lower bound for event end dates.
 * @param {Date} endRange Inclusive upper bound for event start dates.
 * @returns {Array<Object>} Formatted event objects sorted by start time.
 */
function parseIcsEvents(icsText, startRange, endRange) {
  // Unfold RFC 5545 continuation lines (CRLF or LF followed by space/tab)
  const lines = icsText.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
  const events = [];
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === 'BEGIN:VEVENT') {
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current && current.startObj) {
        const eventEndObj = current.endObj || current.startObj;
        if (eventEndObj >= startRange && current.startObj <= endRange) {
          events.push({
            title: current.title || 'Spotkanie Projekt 25-35',
            start: current.start,
            end: current.end || current.start,
            allDay: current.allDay,
            hasTime: !current.allDay,
            location: current.location || '',
            description: current.description || '',
            _sortMs: current.startObj.getTime(),
          });
        }
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const propPart = line.slice(0, colonIndex);
    const propName = propPart.split(';')[0].toUpperCase();
    const valPart = line.slice(colonIndex + 1);

    if (propName === 'SUMMARY') {
      current.title = unescapeIcsText(valPart);
    } else if (propName === 'LOCATION') {
      current.location = unescapeIcsText(valPart);
    } else if (propName === 'DESCRIPTION') {
      current.description = unescapeIcsText(valPart);
    } else if (propName === 'DTSTART') {
      const parsed = parseIcsDate(propPart, valPart, TIME_ZONE);
      if (parsed) {
        current.start = parsed.formatted;
        current.startObj = parsed.date;
        current.allDay = parsed.allDay;
      }
    } else if (propName === 'DTEND') {
      const parsed = parseIcsDate(propPart, valPart, TIME_ZONE);
      if (parsed) {
        current.end = parsed.formatted;
        current.endObj = parsed.date;
      }
    }
  }

  events.sort((a, b) => a._sortMs - b._sortMs);
  return events.map(({ _sortMs, ...rest }) => rest);
}

/**
 * Parses an iCalendar DTSTART/DTEND property into a Date and formatted string.
 *
 * @param {string} propPart Property name and parameters before the colon.
 * @param {string} valPart Raw date/datetime string after the colon.
 * @param {string} defaultTimeZone Fallback IANA time zone.
 * @returns {{date: Date, formatted: string, allDay: boolean}|null} Parsed date info.
 */
function parseIcsDate(propPart, valPart, defaultTimeZone) {
  const isDateOnly = propPart.indexOf('VALUE=DATE') !== -1 || /^\d{8}$/.test(valPart);
  if (isDateOnly) {
    const match = valPart.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    return {
      date: new Date(year, month, day),
      formatted: `${match[1]}-${match[2]}-${match[3]}`,
      allDay: true,
    };
  }

  if (valPart.endsWith('Z')) {
    const match = valPart.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
    if (!match) return null;
    const date = new Date(
      Date.UTC(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6])
      )
    );
    return { date: date, formatted: date.toISOString(), allDay: false };
  }

  const tzMatch = propPart.match(/TZID=([^;:]+)/);
  const tz = tzMatch ? tzMatch[1] : defaultTimeZone;
  try {
    const date = Utilities.parseDate(valPart, tz, "yyyyMMdd'T'HHmmss");
    return { date: date, formatted: date.toISOString(), allDay: false };
  } catch (e) {
    const fallbackDate = Utilities.parseDate(valPart, defaultTimeZone, "yyyyMMdd'T'HHmmss");
    return { date: fallbackDate, formatted: fallbackDate.toISOString(), allDay: false };
  }
}

/**
 * Unescapes RFC 5545 text escape sequences.
 *
 * @param {string} text Escaped iCalendar property value.
 * @returns {string} Unescaped plain text.
 */
function unescapeIcsText(text) {
  return text.replace(/\\([\\,;nN])/g, (_, ch) => (ch === 'n' || ch === 'N' ? '\n' : ch));
}

function jsonResponse(jsonString) {
  return ContentService.createTextOutput(jsonString).setMimeType(ContentService.MimeType.JSON);
}
