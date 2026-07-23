'use client';

import { useEffect } from 'react';

import { getSafeNextPath } from '@/lib/auth/navigation';
import { WEB_SESSION_HEARTBEAT_MS, WEB_SESSION_IDLE_TIMEOUT_MS } from '@/lib/auth/web-session';
import { createClient } from '@/lib/supabase/client';

const ACTIVITY_STORAGE_KEY = 'unimarket:web:last-activity';
const ACTIVITY_RECORD_THROTTLE_MS = 30_000;

export function WebSessionGuard() {
  useEffect(() => {
    const supabase = createClient();
    let lastActiveAt = Date.now();
    let lastHeartbeatAt = 0;
    let lastRecordedAt = 0;
    let expiryTimer = 0;
    let signingOut = false;
    let stopped = false;

    function expiredLoginPath() {
      const requestedNext = getSafeNextPath(`${window.location.pathname}${window.location.search}`);
      const params = new URLSearchParams({ error: 'session-expired' });
      if (requestedNext !== '/marketplace') params.set('next', requestedNext);
      return `/login?${params.toString()}`;
    }

    async function expireSession() {
      if (signingOut || stopped) return;
      signingOut = true;
      window.clearTimeout(expiryTimer);
      window.localStorage.removeItem(ACTIVITY_STORAGE_KEY);

      try {
        await supabase.auth.signOut({ scope: 'local' });
      } finally {
        window.location.replace(expiredLoginPath());
      }
    }

    function scheduleExpiry() {
      window.clearTimeout(expiryTimer);
      const remaining = lastActiveAt + WEB_SESSION_IDLE_TIMEOUT_MS - Date.now();
      if (remaining <= 0) {
        void expireSession();
        return;
      }

      expiryTimer = window.setTimeout(() => void expireSession(), remaining);
    }

    async function sendHeartbeat() {
      const now = Date.now();
      if (now - lastHeartbeatAt < WEB_SESSION_HEARTBEAT_MS) return;
      lastHeartbeatAt = now;

      try {
        const response = await fetch('/api/auth/activity', {
          cache: 'no-store',
          credentials: 'same-origin',
          method: 'POST',
        });
        if (response.status === 401) await expireSession();
      } catch {
        // A transient network failure should not destroy a valid local session.
        // The proxy rechecks the server cookie on the next request.
      }
    }

    function recordActivity(force = false) {
      if (signingOut || stopped || document.visibilityState === 'hidden') return;
      const now = Date.now();
      if (!force && now - lastRecordedAt < ACTIVITY_RECORD_THROTTLE_MS) return;

      lastRecordedAt = now;
      lastActiveAt = now;
      window.localStorage.setItem(ACTIVITY_STORAGE_KEY, String(now));
      scheduleExpiry();
      void sendHeartbeat();
    }

    function checkAfterVisibilityChange() {
      if (document.visibilityState === 'hidden') return;

      const sharedActivity = Number(window.localStorage.getItem(ACTIVITY_STORAGE_KEY));
      if (Number.isFinite(sharedActivity) && sharedActivity > lastActiveAt) {
        lastActiveAt = sharedActivity;
      }

      if (Date.now() - lastActiveAt >= WEB_SESSION_IDLE_TIMEOUT_MS) {
        void expireSession();
        return;
      }

      recordActivity(true);
    }

    function syncActivity(event: StorageEvent) {
      if (event.key !== ACTIVITY_STORAGE_KEY || !event.newValue) return;
      const sharedActivity = Number(event.newValue);
      if (!Number.isFinite(sharedActivity) || sharedActivity <= lastActiveAt) return;

      lastActiveAt = sharedActivity;
      scheduleExpiry();
    }

    const handleActivity = () => recordActivity();

    const activityEvents: Array<keyof WindowEventMap> = [
      'keydown',
      'pointerdown',
      'touchstart',
      'wheel',
    ];

    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, handleActivity, { passive: true }),
    );
    window.addEventListener('focus', checkAfterVisibilityChange);
    window.addEventListener('storage', syncActivity);
    document.addEventListener('visibilitychange', checkAfterVisibilityChange);

    recordActivity(true);

    return () => {
      stopped = true;
      window.clearTimeout(expiryTimer);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
      window.removeEventListener('focus', checkAfterVisibilityChange);
      window.removeEventListener('storage', syncActivity);
      document.removeEventListener('visibilitychange', checkAfterVisibilityChange);
    };
  }, []);

  return null;
}
