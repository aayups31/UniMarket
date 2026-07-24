import { describe, expect, it } from 'vitest';

import {
  loginSchema,
  passwordResetRequestSchema,
  signupSchema,
  updatePasswordSchema,
  verifySignupOtpSchema,
} from './schemas';

const strongPassword = 'Waterloo8';

describe('loginSchema', () => {
  it('normalizes a valid Waterloo email', () => {
    const result = loginSchema.parse({
      email: ' Student@UWATERLOO.CA ',
      password: strongPassword,
    });

    expect(result.email).toBe('student@uwaterloo.ca');
  });

  it('rejects Gmail even when it previously belonged to a provisioned moderator', () => {
    expect(
      loginSchema.safeParse({ email: 'aayupsuw@gmail.com', password: strongPassword }).success,
    ).toBe(false);
  });

  it('rejects any other non-Waterloo account', () => {
    expect(
      loginSchema.safeParse({ email: 'student@gmail.com', password: strongPassword }).success,
    ).toBe(false);
  });
});

describe('signupSchema', () => {
  it('accepts a Waterloo email with matching strong passwords', () => {
    expect(
      signupSchema.safeParse({
        confirmPassword: strongPassword,
        email: 'student@uwaterloo.ca',
        password: strongPassword,
      }).success,
    ).toBe(true);
  });

  it.each(['aayupsuw@gmail.com', 'student@gmail.com'])(
    'rejects every non-Waterloo signup address: %s',
    (email) => {
      expect(
        signupSchema.safeParse({
          confirmPassword: strongPassword,
          email,
          password: strongPassword,
        }).success,
      ).toBe(false);
    },
  );

  it.each(['Short1', 'waterloo8', 'WATERLOO8', 'WaterlooOnly'])(
    'rejects a password that misses the policy: %s',
    (password) => {
      expect(
        signupSchema.safeParse({
          confirmPassword: password,
          email: 'student@uwaterloo.ca',
          password,
        }).success,
      ).toBe(false);
    },
  );

  it('rejects mismatched password confirmation', () => {
    expect(
      signupSchema.safeParse({
        confirmPassword: 'Different8',
        email: 'student@uwaterloo.ca',
        password: strongPassword,
      }).success,
    ).toBe(false);
  });
});

describe('password recovery schemas', () => {
  it('rejects password recovery for a Gmail account', () => {
    expect(passwordResetRequestSchema.safeParse({ email: 'aayupsuw@gmail.com' }).success).toBe(
      false,
    );
  });

  it('requires matching strong passwords when updating', () => {
    expect(
      updatePasswordSchema.safeParse({
        confirmPassword: strongPassword,
        password: strongPassword,
      }).success,
    ).toBe(true);
    expect(
      updatePasswordSchema.safeParse({
        confirmPassword: 'Different8',
        password: strongPassword,
      }).success,
    ).toBe(false);
  });
});

describe('verifySignupOtpSchema', () => {
  it('normalizes the email and accepts exactly six digits', () => {
    expect(
      verifySignupOtpSchema.parse({
        email: ' Student@UWATERLOO.CA ',
        token: ' 123456 ',
      }),
    ).toEqual({ email: 'student@uwaterloo.ca', token: '123456' });
  });

  it('rejects a Gmail account for OTP verification', () => {
    expect(
      verifySignupOtpSchema.safeParse({
        email: 'aayupsuw@gmail.com',
        token: '123456',
      }).success,
    ).toBe(false);
  });

  it.each(['12345', '1234567', '12a456', ''])('rejects an invalid code: %s', (token) => {
    expect(verifySignupOtpSchema.safeParse({ email: 'student@uwaterloo.ca', token }).success).toBe(
      false,
    );
  });
});
