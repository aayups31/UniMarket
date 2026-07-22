import {
  assertSameOrigin,
  messageErrorResponse,
  messageJson,
  readJsonBody,
} from '@/features/messages/http';
import { getMessageThread, sendMessage } from '@/features/messages/queries';

type MessageRouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: MessageRouteContext) {
  try {
    const { id } = await params;
    return messageJson(await getMessageThread(id));
  } catch (error) {
    return messageErrorResponse(error);
  }
}

export async function POST(request: Request, { params }: MessageRouteContext) {
  try {
    assertSameOrigin(request);
    const { id } = await params;
    const message = await sendMessage(id, await readJsonBody(request));
    return messageJson({ message }, { status: 201 });
  } catch (error) {
    return messageErrorResponse(error);
  }
}
