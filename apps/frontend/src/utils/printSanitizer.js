/**
 * Security Utility: HTML Entity Escaping & Safe URL Sanitization (SEC-03)
 * Protects printable dossiers and exported HTML documents against Stored and Reflected XSS.
 */

export const escapeHtml = (str) => {
  if (str === null || str === undefined) return '';
  const stringVal = typeof str === 'string' ? str : String(str);
  return stringVal
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  // Neutralize javascript:, data:, vbscript: protocols
  if (/^(?:javascript|data|vbscript):/i.test(trimmed)) {
    return '#';
  }
  // Only permit safe web protocols or relative paths
  if (/^(?:https?:\/\/|\/|mailto:)/i.test(trimmed)) {
    return trimmed;
  }
  return '#';
};

export const PRINT_CSP_META = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data: https: http:; font-src data: https:;">';
