import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Globe,
  Mail,
  Video,
} from "lucide-react";
import {
  HOST,
  buildGoogleCalendarUrl,
  buildIcs,
  buildMailtoUrl,
  buildOutlookUrl,
  buildSlots,
  buildSummary,
  endOf,
  formatInHostZone,
  formatLongDate,
  formatMonth,
  formatTime,
  groupByLocalDay,
  localDayKey,
  prettyZone,
  visitorTimeZone,
} from "../lib/booking.js";
import "../styles/bookcall.css";

const WEEK_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const STEPS = ["Time", "Details", "Confirm"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Triggers a client-side file download without leaving the page. */
function downloadFile(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a tick to start the download before reclaiming the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ─── Step chrome ──────────────────────────────────────────────── */

function StepRail({ index }) {
  return (
    <ol className="bk-rail" aria-label="Booking progress">
      {STEPS.map((label, i) => (
        <li
          key={label}
          className={`bk-rail-step${i === index ? " is-current" : ""}${i < index ? " is-done" : ""}`}
          aria-current={i === index ? "step" : undefined}
        >
          <span className="bk-rail-dot">{i < index ? <Check size={10} strokeWidth={3} /> : i + 1}</span>
          <span className="bk-rail-label">{label}</span>
        </li>
      ))}
    </ol>
  );
}

/* ─── Month grid ───────────────────────────────────────────────── */

function MonthGrid({ view, onView, availableDays, selectedKey, onSelect, bounds }) {
  const cells = useMemo(() => {
    const lead = new Date(view.year, view.month, 1).getDay();
    const total = new Date(view.year, view.month + 1, 0).getDate();
    const out = [];
    for (let i = 0; i < lead; i++) out.push(null);
    for (let d = 1; d <= total; d++) out.push(d);
    return out;
  }, [view]);

  const shift = (delta) => {
    const next = new Date(view.year, view.month + delta, 1);
    onView({ year: next.getFullYear(), month: next.getMonth() });
  };

  const cursor = view.year * 12 + view.month;
  const canPrev = cursor > bounds.min;
  const canNext = cursor < bounds.max;

  return (
    <div className="bk-cal">
      <div className="bk-cal-head">
        <h3 className="bk-cal-month">{formatMonth(view.year, view.month)}</h3>
        <div className="bk-cal-nav">
          <button
            type="button"
            className="bk-cal-arrow"
            onClick={() => shift(-1)}
            disabled={!canPrev}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="bk-cal-arrow"
            onClick={() => shift(1)}
            disabled={!canNext}
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="bk-cal-weekdays" aria-hidden="true">
        {WEEK_LABELS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <div className="bk-cal-grid" role="grid">
        {cells.map((day, i) => {
          if (day === null) return <span key={`pad-${i}`} className="bk-day bk-day--pad" aria-hidden="true" />;
          const key = localDayKey(new Date(view.year, view.month, day));
          const open = availableDays.has(key);
          const selected = key === selectedKey;
          return (
            <button
              key={key}
              type="button"
              className={`bk-day${open ? " is-open" : ""}${selected ? " is-selected" : ""}`}
              disabled={!open}
              onClick={() => onSelect(key)}
              aria-pressed={selected}
              aria-label={formatLongDate(new Date(view.year, view.month, day))}
            >
              {day}
              {open && !selected && <span className="bk-day-dot" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */

export default function BookCall() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const tz = useMemo(() => visitorTimeZone(), []);
  const byDay = useMemo(() => groupByLocalDay(buildSlots()), []);
  const dayKeys = useMemo(() => [...byDay.keys()].sort(), [byDay]);

  const bounds = useMemo(() => {
    if (dayKeys.length === 0) return { min: 0, max: 0 };
    const toCursor = (key) => {
      const [y, m] = key.split("-").map(Number);
      return y * 12 + (m - 1);
    };
    return { min: toCursor(dayKeys[0]), max: toCursor(dayKeys[dayKeys.length - 1]) };
  }, [dayKeys]);

  const [selectedKey, setSelectedKey] = useState(() => dayKeys[0] ?? null);
  const [view, setView] = useState(() => {
    const base = dayKeys[0] ? new Date(`${dayKeys[0]}T00:00:00`) : new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });
  const [slot, setSlot] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: "" });
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const nameRef = useRef(null);
  const copyTimer = useRef(null);

  const slotsForDay = selectedKey ? (byDay.get(selectedKey) ?? []) : [];
  const selectedDate = selectedKey ? new Date(`${selectedKey}T00:00:00`) : null;

  const booking = useMemo(
    () => (slot ? { start: slot, tz, guest: form } : null),
    [slot, tz, form],
  );

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  // Move focus into the form when the step opens — keyboard flow stays linear.
  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
  }, [step]);

  const pickDay = useCallback((key) => {
    setSelectedKey(key);
    setSlot(null);
  }, []);

  const confirmSlot = (value) => {
    setSlot(value);
    setStep(1);
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Tell me what to call you.";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "That email doesn't look right.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const finalBooking = { start: slot, tz, guest: { ...form, name: form.name.trim(), email: form.email.trim() } };
    setForm(finalBooking.guest);
    setStep(2);
    // Hand the request to their mail client so it actually reaches Rayat.
    window.location.href = buildMailtoUrl(finalBooking);
  };

  const copySummary = async () => {
    if (!booking) return;
    const text = buildSummary(booking);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2200);
  };

  const fade = reduced
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
      };

  const rise = (i) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.06 + i * 0.07, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        };

  return (
    <main className="bk">
      <div className="bk-glow" aria-hidden="true" />

      <motion.div className="bk-shell" {...rise(0)}>
        {/* ── Left: what you're booking ── */}
        <aside className="bk-side">
          <div className="bk-avatar" aria-hidden="true">
            RC
          </div>
          <p className="bk-host">{HOST.name}</p>
          <h1 className="bk-heading">{HOST.durationMinutes} Minute Call</h1>

          <ul className="bk-facts">
            <li className="bk-fact">
              <Clock size={15} />
              <span>{HOST.durationMinutes} minutes</span>
            </li>
            <li className="bk-fact">
              <Video size={15} />
              <span>Google Meet or phone</span>
            </li>
            <li className="bk-fact">
              <Globe size={15} />
              <span title={tz}>{prettyZone(tz)} time</span>
            </li>
            {slot && (
              <li className="bk-fact bk-fact--picked">
                <Calendar size={15} />
                <span>
                  {formatTime(slot)} – {formatTime(endOf(slot))}, {formatLongDate(slot)}
                </span>
              </li>
            )}
          </ul>

          <p className="bk-blurb">
            Grab a slot and let's talk — about a role, a project you want built, or
            anything you're curious about. No agenda required.
          </p>

          <button type="button" className="bk-backhome" onClick={() => navigate("/")}>
            <ArrowLeft size={13} />
            Back to home
          </button>
        </aside>

        {/* ── Right: the flow ── */}
        <section className="bk-main">
          <StepRail index={step} />

          <AnimatePresence mode="wait" initial={false}>
            {/* Step 1 — pick a time */}
            {step === 0 && (
              <motion.div key="pick" className="bk-step bk-step--pick" {...fade}>
                {dayKeys.length === 0 ? (
                  <div className="bk-empty">
                    <p>No open slots in the next {HOST.daysAhead} days.</p>
                    <a className="bk-btn bk-btn--fill" href={`mailto:${HOST.email}`}>
                      <Mail size={14} /> Email me instead
                    </a>
                  </div>
                ) : (
                  <>
                    <MonthGrid
                      view={view}
                      onView={setView}
                      availableDays={byDay}
                      selectedKey={selectedKey}
                      onSelect={pickDay}
                      bounds={bounds}
                    />

                    <div className="bk-times">
                      <div className="bk-times-head">
                        <p className="bk-times-day">
                          {selectedDate ? formatLongDate(selectedDate) : "Pick a day"}
                        </p>
                        <span className="bk-tz-chip" title={tz}>
                          <Globe size={11} /> {prettyZone(tz)}
                        </span>
                      </div>

                      <div className="bk-times-scroll">
                        {slotsForDay.length === 0 && <p className="bk-times-none">Nothing open this day.</p>}
                        {slotsForDay.map((value) => {
                          const key = value.toISOString();
                          const active = slot?.getTime() === value.getTime();
                          return (
                            <div key={key} className={`bk-slot-row${active ? " is-active" : ""}`}>
                              <button
                                type="button"
                                className="bk-slot"
                                onClick={() => setSlot(active ? null : value)}
                                aria-pressed={active}
                              >
                                {formatTime(value)}
                              </button>
                              <button
                                type="button"
                                className="bk-slot-confirm"
                                onClick={() => confirmSlot(value)}
                                tabIndex={active ? 0 : -1}
                                aria-hidden={!active}
                              >
                                Confirm
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Step 2 — who's calling */}
            {step === 1 && (
              <motion.form key="details" className="bk-step bk-step--form" onSubmit={submit} {...fade} noValidate>
                <div className="bk-when">
                  <Calendar size={14} />
                  <span>
                    {formatTime(slot)} – {formatTime(endOf(slot))} · {formatLongDate(slot)}
                  </span>
                </div>

                <label className="bk-field">
                  <span className="bk-label">Your name *</span>
                  <input
                    ref={nameRef}
                    className={`bk-input${errors.name ? " has-error" : ""}`}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    autoComplete="name"
                    enterKeyHint="next"
                  />
                  {errors.name && <span className="bk-error">{errors.name}</span>}
                </label>

                <label className="bk-field">
                  <span className="bk-label">Email *</span>
                  <input
                    className={`bk-input${errors.email ? " has-error" : ""}`}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint="next"
                  />
                  {errors.email && <span className="bk-error">{errors.email}</span>}
                </label>

                <label className="bk-field">
                  <span className="bk-label">
                    Company <span className="bk-optional">optional</span>
                  </span>
                  <input
                    className="bk-input"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    autoComplete="organization"
                  />
                </label>

                <label className="bk-field">
                  <span className="bk-label">
                    What should we cover? <span className="bk-optional">optional</span>
                  </span>
                  <textarea
                    className="bk-input bk-textarea"
                    rows={3}
                    value={form.topic}
                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                  />
                </label>

                <div className="bk-actions">
                  <button type="button" className="bk-btn bk-btn--ghost" onClick={() => setStep(0)}>
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button type="submit" className="bk-btn bk-btn--fill">
                    Confirm booking <ArrowRight size={14} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 3 — confirmed */}
            {step === 2 && booking && (
              <motion.div key="done" className="bk-step bk-step--done" {...fade}>
                <motion.div
                  className="bk-check"
                  initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 340, damping: 20 }}
                >
                  <Check size={22} strokeWidth={2.6} />
                </motion.div>

                <h2 className="bk-done-title">You're on the calendar</h2>
                <p className="bk-done-sub">
                  Your email app should have opened with the request ready to send to{" "}
                  <strong>{HOST.email}</strong>. Send it and I'll confirm shortly.
                </p>

                <div className="bk-receipt">
                  <div className="bk-receipt-row">
                    <span className="bk-receipt-key">When</span>
                    <span className="bk-receipt-val">
                      {formatLongDate(booking.start)}
                      <br />
                      {formatTime(booking.start)} – {formatTime(endOf(booking.start))} ({prettyZone(tz)})
                    </span>
                  </div>
                  <div className="bk-receipt-row">
                    <span className="bk-receipt-key">My time</span>
                    <span className="bk-receipt-val">{formatInHostZone(booking.start)} ET</span>
                  </div>
                  <div className="bk-receipt-row">
                    <span className="bk-receipt-key">Guest</span>
                    <span className="bk-receipt-val">
                      {booking.guest.name}
                      <br />
                      {booking.guest.email}
                    </span>
                  </div>
                </div>

                <p className="bk-done-hint">Didn't open? Use any of these instead:</p>

                <div className="bk-grid-actions">
                  <a className="bk-btn bk-btn--fill" href={buildMailtoUrl(booking)}>
                    <Mail size={14} /> Send email
                  </a>
                  <a
                    className="bk-btn bk-btn--ghost"
                    href={buildGoogleCalendarUrl(booking)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CalendarPlus size={14} /> Google Calendar
                  </a>
                  <a
                    className="bk-btn bk-btn--ghost"
                    href={buildOutlookUrl(booking)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CalendarPlus size={14} /> Outlook
                  </a>
                  <button
                    type="button"
                    className="bk-btn bk-btn--ghost"
                    onClick={() =>
                      downloadFile(
                        `call-with-${HOST.name.split(" ")[0].toLowerCase()}.ics`,
                        buildIcs(booking),
                        "text/calendar;charset=utf-8",
                      )
                    }
                  >
                    <Download size={14} /> Apple / .ics
                  </button>
                  <button type="button" className="bk-btn bk-btn--ghost" onClick={copySummary}>
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy details"}
                  </button>
                </div>

                <button
                  type="button"
                  className="bk-restart"
                  onClick={() => {
                    setStep(0);
                    setSlot(null);
                  }}
                >
                  Pick a different time
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </motion.div>
    </main>
  );
}
