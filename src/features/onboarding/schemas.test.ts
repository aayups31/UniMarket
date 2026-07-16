import { describe, expect, it } from 'vitest';

import { onboardingSchema } from './schemas';

const validProfile = {
  academicYear: '2B' as const,
  fullName: 'Avery Student',
  program: 'Computer Science',
  residenceArea: 'UWP',
};

describe('onboardingSchema', () => {
  it('accepts a complete student profile', () => {
    expect(onboardingSchema.safeParse(validProfile).success).toBe(true);
  });

  it('allows residence area to be omitted', () => {
    const withoutResidence = {
      academicYear: validProfile.academicYear,
      fullName: validProfile.fullName,
      program: validProfile.program,
    };
    expect(onboardingSchema.safeParse(withoutResidence).success).toBe(true);
  });

  it.each([
    [{ ...validProfile, fullName: 'A' }, 'short name'],
    [{ ...validProfile, program: '' }, 'empty program'],
    [{ ...validProfile, academicYear: 'fifth' }, 'unknown year'],
  ])('rejects a profile with an %s', (profile) => {
    expect(onboardingSchema.safeParse(profile).success).toBe(false);
  });
});
