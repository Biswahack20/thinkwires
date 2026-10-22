import { describe, it, expect } from 'vitest';
import { getSafeRedirectUrl } from '../../utils/redirectUtil';

describe('getSafeRedirectUrl (Open Redirect Defense)', () => {
  it('returns valid relative destination paths', () => {
    const params = new URLSearchParams(
      'redirect=%2Fcandidate-portal%2Fdashboard'
    );
    expect(getSafeRedirectUrl(params)).toBe('/candidate-portal/dashboard');
  });

  it('returns valid relative path with query parameters', () => {
    const params = new URLSearchParams(
      'redirect=%2Fjobs%3Fcategory%3Dengineering'
    );
    expect(getSafeRedirectUrl(params)).toBe('/jobs?category=engineering');
  });

  it('returns fallback when redirect parameter is not present', () => {
    const params = new URLSearchParams('');
    expect(getSafeRedirectUrl(params)).toBe('/candidate/dashboard');
  });

  it('defends against protocol-relative Open Redirect attacks (//evil.com)', () => {
    const params = new URLSearchParams('redirect=%2F%2Fevil-phishing.com');
    expect(getSafeRedirectUrl(params)).toBe('/candidate/dashboard');
  });

  it('defends against external absolute URL redirection (https://evil.com)', () => {
    const params = new URLSearchParams(
      'redirect=https%3A%2F%2Fevil-phishing.com%2Fsteal'
    );
    expect(getSafeRedirectUrl(params)).toBe('/candidate/dashboard');
  });

  it('defends against javascript: URI XSS redirection', () => {
    const params = new URLSearchParams('redirect=javascript%3Aalert(1)');
    expect(getSafeRedirectUrl(params)).toBe('/candidate/dashboard');
  });

  it('defends against malformed URI components gracefully', () => {
    const params = new URLSearchParams('redirect=%E0%A4%A');
    expect(getSafeRedirectUrl(params)).toBe('/candidate/dashboard');
  });

  it('honors custom fallback URL', () => {
    const params = new URLSearchParams('redirect=https%3A%2F%2Fevil.com');
    expect(getSafeRedirectUrl(params, '/custom-home')).toBe('/custom-home');
  });
});
