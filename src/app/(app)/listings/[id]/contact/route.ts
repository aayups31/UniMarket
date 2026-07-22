import { NextResponse } from 'next/server';

type ContactRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: ContactRouteProps) {
  const { id } = await params;
  return NextResponse.redirect(
    new URL(`/listings/${encodeURIComponent(id)}?contact=unavailable`, request.url),
  );
}
