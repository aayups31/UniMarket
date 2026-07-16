const LOCAL_ORIGIN = 'http://localhost:3000';

type AuthCallbackUrlOptions = {
  configuredOrigin?: string;
  path?: '/auth/callback' | '/auth/recovery-callback';
  requestOrigin?: string | null;
};

function getHttpOrigin(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

export function buildAuthCallbackUrl({
  configuredOrigin,
  path = '/auth/callback',
  requestOrigin,
}: AuthCallbackUrlOptions) {
  const origin = getHttpOrigin(configuredOrigin) ?? getHttpOrigin(requestOrigin) ?? LOCAL_ORIGIN;
  return new URL(path, origin).toString();
}
