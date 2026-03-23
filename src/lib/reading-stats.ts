/** Strip HTML and count words for editor stats (Medium-style read time). */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

/** Typical reading speed ~200 wpm for web articles. */
export function readingMinutesFromWordCount(words: number, wpm = 200): number {
  if (words <= 0) return 0;
  return Math.max(1, Math.ceil(words / wpm));
}

export function statsFromHtml(html: string): { words: number; minutes: number } {
  const plain = htmlToPlainText(html);
  const words = countWords(plain);
  return { words, minutes: readingMinutesFromWordCount(words) };
}
