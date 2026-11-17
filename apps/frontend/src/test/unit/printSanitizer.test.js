import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizeUrl, PRINT_CSP_META } from '../../utils/printSanitizer.js';

describe('Print Sanitizer Security Suite (SEC-03 XSS Defense)', () => {
  it('escapes standard XSS script injection payloads', () => {
    const payload = '<script>alert("XSS")</script>';
    const sanitized = escapeHtml(payload);
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    expect(sanitized).not.toContain('<script>');
  });

  it('escapes image onerror and event-handler injection payloads', () => {
    const payload = '<img src="x" onerror="alert(1)">';
    const sanitized = escapeHtml(payload);
    expect(sanitized).toBe('&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;');
    expect(sanitized).not.toContain('<img');
  });

  it('handles null, undefined, numbers, and boolean values safely', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(12345)).toBe('12345');
    expect(escapeHtml(true)).toBe('true');
  });

  it('escapes quotes and forward slashes to prevent attribute and tag breakouts', () => {
    const payload = '"><svg onload=alert(1)>';
    const sanitized = escapeHtml(payload);
    expect(sanitized).toContain('&quot;&gt;&lt;svg');
  });

  it('sanitizes javascript: and data: pseudo-protocols in URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizeUrl('JAVASCRIPT:alert(document.cookie)')).toBe('#');
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#');
  });

  it('permits valid HTTP, HTTPS, and mailto links', () => {
    expect(sanitizeUrl('https://thinkwires.com')).toBe('https://thinkwires.com');
    expect(sanitizeUrl('http://example.com/profile')).toBe('http://example.com/profile');
    expect(sanitizeUrl('mailto:contact@thinkwires.com')).toBe('mailto:contact@thinkwires.com');
    expect(sanitizeUrl('/portal/profile')).toBe('/portal/profile');
  });

  it('provides a strict Content Security Policy meta tag preventing arbitrary script execution', () => {
    expect(PRINT_CSP_META).toContain("default-src 'none'");
    expect(PRINT_CSP_META).not.toContain("'unsafe-eval'");
  });
});
