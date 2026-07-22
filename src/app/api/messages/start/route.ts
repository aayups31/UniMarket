import {
  assertSameOrigin,
  messageErrorResponse,
  messageJson,
  readJsonBody,
} from '@/features/messages/http';
import { startMessageConversation } from '@/features/messages/queries';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const conversationId = await startMessageConversation(await readJsonBody(request));
    return messageJson({ conversationId }, { status: 201 });
  } catch (error) {
    return messageErrorResponse(error);
  }
}
