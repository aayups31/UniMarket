import { assertSameOrigin, messageErrorResponse, messageJson } from '@/features/messages/http';
import { markMessageConversationRead } from '@/features/messages/queries';

type MessageReadRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: MessageReadRouteContext) {
  try {
    assertSameOrigin(request);
    const { id } = await params;
    const readAt = await markMessageConversationRead(id);
    return messageJson({ readAt });
  } catch (error) {
    return messageErrorResponse(error);
  }
}
