import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p", "br", "hr", "div", "span", "strong", "em", "b", "i", "u", "s", "small", "mark",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "pre", "code",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
      "iframe", "video", "source", "audio",
    ],
    ALLOWED_ATTR: [
      "href", "title", "target", "rel",
      "src", "alt", "width", "height", "loading",
      "class", "id",
      "colspan", "rowspan",
      "allow", "allowfullscreen", "frameborder", "controls", "poster", "type",
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["script", "style", "form", "input", "button", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur", "onchange", "onsubmit"],
  });
}
