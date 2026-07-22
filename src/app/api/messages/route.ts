import { getMessageInbox } from '@/features/messages/queries';
import { messageErrorResponse, messageJson } from '@/features/messages/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return messageJson(await getMessageInbox());
  } catch (error) {
    return messageErrorResponse(error);
  }
}
