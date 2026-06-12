import DOMPurify from 'dompurify'

// Sanitizes CMS/API-provided HTML before it reaches v-html, neutralizing XSS
// (script, onerror, javascript: URLs…) while preserving normal rich-text markup
// and images. Use for any v-html whose source is not a literal in our codebase.
export function useSanitizedHtml() {
  const sanitize = (html) =>
    DOMPurify.sanitize(html ?? '', {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['img'],
      ADD_ATTR: ['src', 'href', 'alt', 'title', 'target', 'rel'],
    })

  return { sanitize }
}
