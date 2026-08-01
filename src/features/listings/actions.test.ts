import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  createSignedUploadUrl: vi.fn(),
  revalidatePath: vi.fn(),
  requireStudentSeller: vi.fn(),
  rpc: vi.fn(),
  rpcSingle: vi.fn(),
  storageFrom: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('@/lib/auth/session', () => ({ requireStudentSeller: mocks.requireStudentSeller }));
vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }));

import { registerListingImageAction } from './actions';

const LISTING_ID = '11111111-1111-4111-8111-111111111111';
const IMAGE_ID = '22222222-2222-4222-8222-222222222222';
const STORAGE_PATH = `seller/${LISTING_ID}/${IMAGE_ID}.jpg`;
const SIGNED_URL = 'https://project.supabase.co/storage/v1/object/upload/sign/photo?token=signed';

const input = {
  imageId: IMAGE_ID,
  listingId: LISTING_ID,
  name: 'IMG_4821.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 2_500_000,
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireStudentSeller.mockResolvedValue({ id: 'seller-id' });
  mocks.rpc.mockReturnValue({ single: mocks.rpcSingle });
  mocks.storageFrom.mockReturnValue({ createSignedUploadUrl: mocks.createSignedUploadUrl });
  mocks.createClient.mockResolvedValue({
    rpc: mocks.rpc,
    storage: { from: mocks.storageFrom },
  });
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('registerListingImageAction', () => {
  it('uses the singular reservation row to create and return a signed upload', async () => {
    mocks.rpcSingle.mockResolvedValue({
      data: {
        id: IMAGE_ID,
        listing_id: LISTING_ID,
        storage_path: STORAGE_PATH,
        position: 0,
        upload_status: 'pending',
        mime_type: 'image/jpeg',
        size_bytes: input.sizeBytes,
        width: null,
        height: null,
      },
      error: null,
    });
    mocks.createSignedUploadUrl.mockResolvedValue({
      data: { signedUrl: SIGNED_URL },
      error: null,
    });

    await expect(registerListingImageAction(input)).resolves.toEqual({
      ok: true,
      data: {
        id: IMAGE_ID,
        path: STORAGE_PATH,
        position: 0,
        signedUploadUrl: SIGNED_URL,
      },
    });

    expect(mocks.rpc).toHaveBeenCalledWith('reserve_listing_image', {
      p_listing_id: LISTING_ID,
      p_image_id: IMAGE_ID,
      p_mime_type: 'image/jpeg',
      p_size_bytes: input.sizeBytes,
      p_width: null,
      p_height: null,
    });
    expect(mocks.rpcSingle).toHaveBeenCalledOnce();
    expect(mocks.storageFrom).toHaveBeenCalledWith('listing-images');
    expect(mocks.createSignedUploadUrl).toHaveBeenCalledWith(STORAGE_PATH, { upsert: false });
  });

  it('does not contact Storage when the reservation RPC is missing from the schema cache', async () => {
    mocks.rpcSingle.mockResolvedValue({
      data: null,
      error: {
        code: 'PGRST202',
        message: 'Could not find the function public.reserve_listing_image in the schema cache',
      },
    });

    await expect(registerListingImageAction(input)).resolves.toEqual({
      ok: false,
      message: 'The image upload could not be prepared. Please try again.',
    });
    expect(mocks.storageFrom).not.toHaveBeenCalled();
    expect(mocks.createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it('rejects a malformed reservation before asking Storage for a signed URL', async () => {
    mocks.rpcSingle.mockResolvedValue({
      data: {
        id: IMAGE_ID,
        listing_id: LISTING_ID,
        position: 0,
        upload_status: 'pending',
        mime_type: 'image/jpeg',
        size_bytes: input.sizeBytes,
      },
      error: null,
    });

    await expect(registerListingImageAction(input)).resolves.toEqual({
      ok: false,
      message: 'The image upload could not be prepared. Please try again.',
    });
    expect(mocks.storageFrom).not.toHaveBeenCalled();
    expect(mocks.createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it('returns a retryable failure when Storage cannot create a signed upload URL', async () => {
    mocks.rpcSingle.mockResolvedValue({
      data: {
        id: IMAGE_ID,
        listing_id: LISTING_ID,
        storage_path: STORAGE_PATH,
        position: 0,
        upload_status: 'pending',
        mime_type: 'image/jpeg',
        size_bytes: input.sizeBytes,
      },
      error: null,
    });
    mocks.createSignedUploadUrl.mockResolvedValue({
      data: null,
      error: { code: 'StorageUnknownError', message: 'Temporary Storage failure' },
    });

    await expect(registerListingImageAction(input)).resolves.toEqual({
      ok: false,
      message: 'The secure image upload could not be started. Please retry.',
    });
    expect(mocks.createSignedUploadUrl).toHaveBeenCalledWith(STORAGE_PATH, { upsert: false });
  });
});
