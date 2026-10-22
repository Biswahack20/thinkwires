/**
 * Safely parse redirect query parameters to protect against Open Redirect vulnerabilities.
 * Ensures the destination is strictly an internal relative path starting with '/' and not '//'
 */
export const getSafeRedirectUrl = (
  searchParams,
  fallback = '/candidate/dashboard'
) => {
  const redirectParam = searchParams.get('redirect');
  if (!redirectParam) return fallback;

  try {
    const decoded = decodeURIComponent(redirectParam).trim();
    // Must start with single '/' and NOT '//' (protocol-relative URLs) or 'http'
    if (
      decoded.startsWith('/') &&
      !decoded.startsWith('//') &&
      !decoded.includes('://')
    ) {
      return decoded;
    }
  } catch (e) {
    // Malformed URI component fallback
  }

  return fallback;
};
