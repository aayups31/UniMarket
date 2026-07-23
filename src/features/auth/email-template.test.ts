import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const confirmationTemplate = readFileSync(
  join(process.cwd(), 'supabase/templates/confirmation.html'),
  'utf8',
);
const supabaseConfig = readFileSync(join(process.cwd(), 'supabase/config.toml'), 'utf8');

describe('signup email configuration', () => {
  it('renders a scanner-safe code without a confirmation link', () => {
    expect(confirmationTemplate).toContain('{{ .Token }}');
    expect(confirmationTemplate).not.toContain('ConfirmationURL');
    expect(confirmationTemplate).not.toMatch(/href\s*=/i);
  });

  it('keeps the local OTP contract aligned with the verification UI', () => {
    expect(supabaseConfig).toMatch(/otp_length\s*=\s*6/);
    expect(supabaseConfig).toMatch(/otp_expiry\s*=\s*900/);
    expect(supabaseConfig).toContain('content_path = "./supabase/templates/confirmation.html"');
  });
});
