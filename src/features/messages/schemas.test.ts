import { describe, expect, it } from 'vitest';

import { conversationIdSchema, listingConversationSchema, sendMessageSchema } from './schemas';

const uuid = '61000000-0000-4000-8000-000000000001';

describe('message request schemas', () => {
  it('accepts listing and conversation UUIDs', () => {
    expect(listingConversationSchema.parse({ listingId: uuid })).toEqual({ listingId: uuid });
    expect(conversationIdSchema.parse(uuid)).toBe(uuid);
  });

  it('trims safe message text', () => {
    expect(sendMessageSchema.parse({ body: '  Is this available?  ' })).toEqual({
      body: 'Is this available?',
    });
  });

  it('rejects blank and oversized messages', () => {
    expect(sendMessageSchema.safeParse({ body: '   ' }).success).toBe(false);
    expect(sendMessageSchema.safeParse({ body: 'x'.repeat(2001) }).success).toBe(false);
  });
});
