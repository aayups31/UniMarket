const joinedDateFormatter = new Intl.DateTimeFormat('en-CA', {
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Toronto',
});

export function formatProfileJoinedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently' : joinedDateFormatter.format(date);
}

export function getProfileInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase('en-CA'))
    .join('');
}

export function getProfileStudyLine(program: string | null, academicYear: string | null) {
  return [program, academicYear].filter(Boolean).join(' · ') || 'University of Waterloo';
}
