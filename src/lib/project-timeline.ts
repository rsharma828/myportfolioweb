/**
 * Project `timeline` is stored as a human-readable string for display.
 * Admin uses two date inputs; we format / parse for editing legacy rows.
 */

const ISO_DATE = /(\d{4}-\d{2}-\d{2})/g;

export function formatProjectTimelineFromDates(start: string, end: string): string {
  const s = start.trim();
  const e = end.trim();
  if (!s && !e) return "";
  const fmt = (iso: string) => {
    const d = new Date(`${iso}T12:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };
  if (s && !e) return fmt(s);
  if (!s && e) return fmt(e);
  return `${fmt(s)} – ${fmt(e)}`;
}

export function parseProjectTimelineForDates(timeline: string): { start: string; end: string } {
  const t = timeline.trim();
  if (!t) return { start: "", end: "" };
  const matches = t.match(ISO_DATE);
  if (matches && matches.length >= 2) return { start: matches[0], end: matches[1] };
  if (matches && matches.length === 1) return { start: matches[0], end: "" };
  return { start: "", end: "" };
}
