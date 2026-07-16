export const WATERLOO_EMAIL_DOMAIN = 'uwaterloo.ca';
export const MODERATOR_SIGN_IN_EMAIL = 'aayupsuw@gmail.com';

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isWaterlooEmail(email: string) {
  const normalized = normalizeEmail(email);
  const parts = normalized.split('@');

  return (
    parts.length === 2 &&
    Boolean(parts[0]) &&
    !/\s/.test(parts[0]) &&
    parts[1] === WATERLOO_EMAIL_DOMAIN
  );
}

export function isAllowedAuthEmail(email: string) {
  const normalized = normalizeEmail(email);
  return isWaterlooEmail(normalized) || normalized === MODERATOR_SIGN_IN_EMAIL;
}
