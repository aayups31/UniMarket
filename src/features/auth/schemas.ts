import { z } from 'zod';

import { isWaterlooEmail } from '@/lib/auth/email';

const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Enter your university email.')
  .email('Enter a valid email address.')
  .max(254, 'That email address is too long.');

export const authEmailSchema = normalizedEmailSchema.refine(
  isWaterlooEmail,
  'Use your @uwaterloo.ca email address.',
);

export const waterlooEmailSchema = normalizedEmailSchema.refine(
  isWaterlooEmail,
  'Use your @uwaterloo.ca email address.',
);

export const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(72, 'Use no more than 72 characters.')
  .regex(/[a-z]/, 'Add a lowercase letter.')
  .regex(/[A-Z]/, 'Add an uppercase letter.')
  .regex(/[0-9]/, 'Add a number.');

export const loginSchema = z.object({
  email: authEmailSchema,
  next: z.string().max(2_048).optional(),
  password: z.string().min(1, 'Enter your password.').max(72, 'That password is too long.'),
});

export const signupSchema = z
  .object({
    confirmPassword: z.string(),
    email: waterlooEmailSchema,
    next: z.string().max(2_048).optional(),
    password: passwordSchema,
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const resendSignupSchema = z.object({
  email: waterlooEmailSchema,
  next: z.string().max(2_048).optional(),
});

export const verifySignupOtpSchema = z.object({
  email: waterlooEmailSchema,
  next: z.string().max(2_048).optional(),
  token: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the six-digit code from your email.'),
});

export const passwordResetRequestSchema = z.object({
  email: authEmailSchema,
});

export const updatePasswordSchema = z
  .object({
    confirmPassword: z.string(),
    password: passwordSchema,
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type ResendSignupInput = z.infer<typeof resendSignupSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type VerifySignupOtpInput = z.infer<typeof verifySignupOtpSchema>;
