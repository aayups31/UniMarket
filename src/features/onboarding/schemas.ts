import { z } from 'zod';

export const ACADEMIC_YEARS = [
  '1A',
  '1B',
  '2A',
  '2B',
  '3A',
  '3B',
  '4A',
  '4B',
  'Graduate',
  'Other',
] as const;

export const RESIDENCE_AREAS = [
  'ICON',
  'UWP',
  'REV',
  'CMH',
  'Lester',
  'Off campus / other',
] as const;

export const onboardingSchema = z.object({
  academicYear: z.enum(ACADEMIC_YEARS, {
    message: 'Select your current academic year.',
  }),
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter your full name.')
    .max(80, 'Keep your name under 80 characters.'),
  next: z.string().max(2_048).optional(),
  program: z
    .string()
    .trim()
    .min(2, 'Enter your program.')
    .max(100, 'Keep your program under 100 characters.'),
  residenceArea: z
    .string()
    .trim()
    .max(120, 'Keep the residence area under 120 characters.')
    .optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
