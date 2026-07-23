const DEFAULT_AUTHENTICATED_PATH = '/marketplace';
const ALLOWED_DESTINATIONS = [
  '/marketplace',
  '/listings',
  '/messages',
  '/moderation',
  '/my-listings',
  '/profile',
];

export function getSafeNextPath(value: string | null | undefined) {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /[\u0000-\u001f]/.test(value)
  ) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  try {
    const url = new URL(value, 'https://unimarket.local');
    const isAllowed = ALLOWED_DESTINATIONS.some(
      (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`),
    );

    if (!isAllowed || url.origin !== 'https://unimarket.local') {
      return DEFAULT_AUTHENTICATED_PATH;
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return DEFAULT_AUTHENTICATED_PATH;
  }
}
