/* ────────────────────────────────────────────────────────────────
   Booking engine — timezone-correct 30 minute slots, no backend.

   Availability is declared once, in Rayat's own timezone. Everything
   the visitor sees is converted into *their* local timezone so nobody
   has to do mental math before booking.

   To change your hours, edit HOST below — nothing else needs to move.
   ──────────────────────────────────────────────────────────────── */

export const HOST = {
  name: "Rayat Chowdhury",
  email: "rayatchowdhury2005@gmail.com",
  timeZone: "America/New_York",
  durationMinutes: 30,
  /** Minutes from midnight, in HOST.timeZone. 9:00 → 17:00. */
  workday: { start: 9 * 60, end: 17 * 60 },
  /** 0 = Sunday … 6 = Saturday. */
  availableWeekdays: [1, 2, 3, 4, 5],
  /** How far ahead the calendar opens. */
  daysAhead: 45,
  /** Don't allow bookings inside this window. */
  minNoticeMinutes: 180,
};

/* ─── Timezone primitives ──────────────────────────────────────── */

const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const formatterCache = new Map();

function zoneFormatter(timeZone) {
  let f = formatterCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatterCache.set(timeZone, f);
  }
  return f;
}

/** Wall-clock fields of `date` as seen inside `timeZone`. */
export function getZonedParts(date, timeZone) {
  const parts = {};
  for (const p of zoneFormatter(timeZone).formatToParts(date)) parts[p.type] = p.value;
  let hour = Number(parts.hour);
  if (hour === 24) hour = 0; // some engines render midnight as "24"
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour,
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: WEEKDAY_INDEX[parts.weekday] ?? 0,
  };
}

/** Offset of `timeZone` at `date`, in ms (EDT → -4h). */
function zoneOffsetMs(date, timeZone) {
  const p = getZonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/**
 * Turn a wall-clock time in `timeZone` into a real instant. The second
 * pass re-reads the offset at the candidate instant so DST changeover
 * days resolve to the right hour instead of drifting by 60 minutes.
 */
export function zonedTimeToUtc(year, month, day, minutesFromMidnight, timeZone) {
  const hh = Math.floor(minutesFromMidnight / 60);
  const mm = minutesFromMidnight % 60;
  const naive = Date.UTC(year, month - 1, day, hh, mm, 0);
  const firstPass = zoneOffsetMs(new Date(naive), timeZone);
  let ts = naive - firstPass;
  const secondPass = zoneOffsetMs(new Date(ts), timeZone);
  if (secondPass !== firstPass) ts = naive - secondPass;
  return new Date(ts);
}

/* ─── Slot generation ──────────────────────────────────────────── */

const DAY_MS = 86_400_000;

/** Every bookable start instant between now and HOST.daysAhead. */
export function buildSlots(now = new Date(), cfg = HOST) {
  const slots = [];
  const earliest = now.getTime() + cfg.minNoticeMinutes * 60_000;
  const today = getZonedParts(now, cfg.timeZone);
  // Walk civil dates as UTC midnights so DST never skips or repeats a day.
  const firstDay = Date.UTC(today.year, today.month - 1, today.day);
  const lastStart = cfg.workday.end - cfg.durationMinutes;

  for (let i = 0; i <= cfg.daysAhead; i++) {
    const civil = new Date(firstDay + i * DAY_MS);
    if (!cfg.availableWeekdays.includes(civil.getUTCDay())) continue;
    const y = civil.getUTCFullYear();
    const m = civil.getUTCMonth() + 1;
    const d = civil.getUTCDate();

    for (let mins = cfg.workday.start; mins <= lastStart; mins += cfg.durationMinutes) {
      const start = zonedTimeToUtc(y, m, d, mins, cfg.timeZone);
      if (start.getTime() >= earliest) slots.push(start);
    }
  }
  return slots;
}

/** `YYYY-MM-DD` for the *visitor's* local calendar. */
export function localDayKey(date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Map of local day key → sorted slots falling on that local day. */
export function groupByLocalDay(slots) {
  const map = new Map();
  for (const slot of slots) {
    const key = localDayKey(slot);
    const bucket = map.get(key);
    if (bucket) bucket.push(slot);
    else map.set(key, [slot]);
  }
  return map;
}

/* ─── Formatting ───────────────────────────────────────────────── */

export function visitorTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
  } catch {
    return "Local time";
  }
}

export function prettyZone(tz) {
  return tz.replace(/_/g, " ").split("/").pop();
}

export const formatTime = (d) =>
  d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export const formatLongDate = (d) =>
  d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });

export const formatMonth = (y, m) =>
  new Date(y, m, 1).toLocaleDateString([], { month: "long", year: "numeric" });

/** Same instant, spelled out in Rayat's timezone — shown as a courtesy. */
export function formatInHostZone(date, cfg = HOST) {
  return date.toLocaleString([], {
    timeZone: cfg.timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const endOf = (start, cfg = HOST) =>
  new Date(start.getTime() + cfg.durationMinutes * 60_000);

/* ─── Calendar hand-offs ───────────────────────────────────────── */

const icsStamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function meetingTitle(guest, cfg = HOST) {
  return `${cfg.durationMinutes} min call — ${guest.name || "Guest"} & ${cfg.name}`;
}

function meetingBody(booking, cfg = HOST) {
  const { start, guest, tz } = booking;
  return [
    `${cfg.durationMinutes} minute intro call.`,
    "",
    `Guest:   ${guest.name}`,
    `Email:   ${guest.email}`,
    guest.company ? `Company: ${guest.company}` : null,
    "",
    `When:    ${formatLongDate(start)} at ${formatTime(start)} (${tz})`,
    `         ${formatInHostZone(start, cfg)} for ${cfg.name}`,
    "",
    "Topic:",
    guest.topic || "—",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function buildSummary(booking) {
  return meetingBody(booking);
}

/** Adds Rayat as a guest, so saving the event emails him the invite. */
export function buildGoogleCalendarUrl(booking, cfg = HOST) {
  const { start } = booking;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: meetingTitle(booking.guest, cfg),
    dates: `${icsStamp(start)}/${icsStamp(endOf(start, cfg))}`,
    details: meetingBody(booking, cfg),
    add: cfg.email,
    ctz: cfg.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookUrl(booking, cfg = HOST) {
  const { start } = booking;
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: meetingTitle(booking.guest, cfg),
    startdt: start.toISOString(),
    enddt: endOf(start, cfg).toISOString(),
    body: meetingBody(booking, cfg),
    to: cfg.email,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

const escapeIcs = (s) =>
  String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** Folds long lines, as iCalendar requires. */
const foldIcs = (line) => line.match(/.{1,73}/g).join("\r\n ");

export function buildIcs(booking, cfg = HOST) {
  const { start, guest } = booking;
  const uid = `${start.getTime()}-${Math.random().toString(36).slice(2, 10)}@rayat.booking`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rayat Chowdhury//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(endOf(start, cfg))}`,
    foldIcs(`SUMMARY:${escapeIcs(meetingTitle(guest, cfg))}`),
    foldIcs(`DESCRIPTION:${escapeIcs(meetingBody(booking, cfg))}`),
    foldIcs(`ORGANIZER;CN=${escapeIcs(guest.name)}:mailto:${guest.email}`),
    foldIcs(`ATTENDEE;CN=${escapeIcs(cfg.name)};RSVP=TRUE:mailto:${cfg.email}`),
    "BEGIN:VALARM",
    "TRIGGER:-PT10M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function buildMailtoUrl(booking, cfg = HOST) {
  const subject = meetingTitle(booking.guest, cfg);
  const body = [
    `Hi ${cfg.name.split(" ")[0]},`,
    "",
    `I'd like to book a ${cfg.durationMinutes} minute call with you.`,
    "",
    meetingBody(booking, cfg),
    "",
    "Looking forward to it,",
    booking.guest.name,
  ].join("\n");
  return `mailto:${cfg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
