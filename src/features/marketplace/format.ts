import { CONDITION_LABELS } from './constants';

const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
});

const postedDateFormatter = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  day: 'numeric',
  timeZone: 'America/Toronto',
});

const torontoHourFormatter = new Intl.DateTimeFormat('en-CA', {
  hour: 'numeric',
  hourCycle: 'h23',
  timeZone: 'America/Toronto',
});

export function formatPrice(priceCents: number) {
  return cadFormatter.format(priceCents / 100);
}

export function formatCondition(condition: string | null) {
  if (!condition) return null;
  return CONDITION_LABELS[condition] ?? condition.replaceAll('_', ' ');
}

export function formatPostedDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return postedDateFormatter.format(date);
}

export function formatPostedTime(value: string | null, now = new Date()) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const elapsedMs = Math.max(0, now.getTime() - date.getTime());
  const elapsedMinutes = Math.floor(elapsedMs / 60_000);

  if (elapsedMinutes < 1) return 'Just now';
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 7) return `${elapsedDays}d ago`;

  return postedDateFormatter.format(date);
}

export function getTorontoGreeting(value = new Date()) {
  const hour = Number.parseInt(torontoHourFormatter.format(value), 10);

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
