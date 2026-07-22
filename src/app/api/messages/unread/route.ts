import { messageErrorResponse, messageJson } from '@/features/messages/http';
import { getMessageUnreadCount } from '@/features/messages/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return messageJson({ totalUnread: await getMessageUnreadCount() });
  } catch (error) {
    return messageErrorResponse(error);
  }
}
