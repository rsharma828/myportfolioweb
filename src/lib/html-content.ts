import { markdownToHTML } from "@/lib/mdx";
import { resolvePublicUrl } from "@/lib/storage";
import sanitizeHtml from "sanitize-html";

/** Heuristic: WYSIWYG output is stored as HTML; legacy posts are Markdown. */
export function isProbablyHtml(input: string): boolean {
  const t = input.trim();
  if (!t) return false;
  return t.startsWith("<");
}

/**
 * Sanitize HTML for public rendering (blog body, project sections, profile bio).
 * Uses `sanitize-html` (no JSDOM) so Next.js server bundles stay stable.
 */
export function sanitizePublicHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "figure",
      "figcaption",
      "div",
      "span",
      "video",
      "source",
      "iframe",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel", "class"],
      img: ["src", "alt", "title", "width", "height", "class", "loading"],
      code: ["class"],
      pre: ["class"],
      span: ["class", "style"],
      div: ["class"],
      p: ["class"],
      ol: ["class", "start", "type"],
      ul: ["class"],
      li: ["class"],
      h1: ["class"],
      h2: ["class"],
      h3: ["class"],
      h4: ["class"],
      h5: ["class"],
      h6: ["class"],
      blockquote: ["class"],
      video: ["src", "controls", "playsinline", "class", "poster", "width", "height"],
      source: ["src", "type"],
      iframe: ["src", "title", "allow", "allowfullscreen", "class", "width", "height", "loading", "frameborder"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      iframe: ["http", "https"],
      video: ["http", "https"],
      source: ["http", "https"],
      img: ["http", "https"],
    },
  });
}

/** Rewrite img `src` from R2 keys to public URLs when needed. */
export function rewriteMediaUrlsInHtml(html: string): string {
  return html.replace(/<img\b([^>]*)\bsrc="([^"]+)"([^>]*)>/gi, (full, _before: string, src: string) => {
    const resolved = resolvePublicUrl(src);
    return full.replace(`src="${src}"`, `src="${resolved}"`);
  });
}

function rewriteVideoAndSourceUrls(html: string): string {
  let out = html.replace(/<video\b([^>]*)\bsrc="([^"]+)"([^>]*)>/gi, (full, _b, src: string) => {
    const resolved = resolvePublicUrl(src);
    return full.replace(`src="${src}"`, `src="${resolved}"`);
  });
  out = out.replace(/<source\b([^>]*)\bsrc="([^"]+)"([^>]*)>/gi, (full, _b, src: string) => {
    const resolved = resolvePublicUrl(src);
    return full.replace(`src="${src}"`, `src="${resolved}"`);
  });
  return out;
}

export function processHtmlForDisplay(html: string): string {
  const sanitized = sanitizePublicHtml(html);
  return rewriteVideoAndSourceUrls(rewriteMediaUrlsInHtml(sanitized));
}

/** First image in HTML (for listing thumbnails when no separate upload). */
export function extractFirstImgSrcFromHtml(html: string): string {
  const m = html.match(/<img[^>]+src="([^"]+)"/i);
  return m?.[1]?.trim() ?? "";
}

/** First video `src` in HTML (project cards / hero). */
export function extractFirstVideoSrcFromHtml(html: string): string {
  const v = html.match(/<video[^>]+src="([^"]+)"/i);
  if (v?.[1]) return v[1].trim();
  const s = html.match(/<source[^>]+src="([^"]+)"/i);
  return s?.[1]?.trim() ?? "";
}

/**
 * Blog / rich text: HTML if stored from editor; otherwise Markdown → HTML.
 */
export async function richBodyToDisplayHtml(body: string): Promise<string> {
  const trimmed = body.trim();
  if (!trimmed) return "";
  if (isProbablyHtml(trimmed)) {
    return processHtmlForDisplay(trimmed);
  }
  const fromMd = await markdownToHTML(body);
  return processHtmlForDisplay(fromMd);
}

/**
 * Short HTML snippets (challenge, solution, outcome): treat as HTML if it looks like markup; else plain text wrapped in <p>.
 */
export function snippetToDisplayHtml(snippet: string): string {
  const t = snippet.trim();
  if (!t) return "";
  if (isProbablyHtml(t)) {
    return processHtmlForDisplay(t);
  }
  const escaped = t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
  return `<p class="text-muted-foreground leading-relaxed">${escaped}</p>`;
}

/** Plain text or legacy Markdown-ish fields → minimal HTML for Tiptap. */
export function legacyTextToEditorHtml(text: string): string {
  const t = text.trim();
  if (!t) return "";
  if (isProbablyHtml(t)) return t;
  return `<p>${t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />")}</p>`;
}

/** True when the editor has no visible text (empty tags / whitespace only). */
export function isRichHtmlEmpty(html: string): boolean {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length === 0;
}
