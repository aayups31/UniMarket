import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  finalizeListingImageAction: vi.fn(),
  registerListingImageAction: vi.fn(),
  removeListingImageAction: vi.fn(),
  reorderListingImagesAction: vi.fn(),
  reverifyListingImagesAction: vi.fn(),
  uploadListingImageToSignedUrl: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: (
    props: ImgHTMLAttributes<HTMLImageElement> & {
      fill?: boolean;
      unoptimized?: boolean;
    },
  ) => {
    const imageProps = { ...props };
    delete imageProps.fill;
    delete imageProps.unoptimized;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...imageProps} />;
  },
}));

vi.mock('@dnd-kit/core', () => ({
  closestCenter: vi.fn(),
  DndContext: ({ children }: { children: ReactNode }) => children,
  KeyboardSensor: class KeyboardSensor {},
  PointerSensor: class PointerSensor {},
  useSensor: vi.fn(() => ({})),
  useSensors: vi.fn(() => []),
}));

vi.mock('@dnd-kit/sortable', () => ({
  arrayMove: <T,>(items: T[]) => items,
  rectSortingStrategy: {},
  SortableContext: ({ children }: { children: ReactNode }) => children,
  sortableKeyboardCoordinates: vi.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

vi.mock('../actions', () => ({
  finalizeListingImageAction: mocks.finalizeListingImageAction,
  registerListingImageAction: mocks.registerListingImageAction,
  removeListingImageAction: mocks.removeListingImageAction,
  reorderListingImagesAction: mocks.reorderListingImagesAction,
  reverifyListingImagesAction: mocks.reverifyListingImagesAction,
}));

vi.mock('./imageUploadTransfer', () => ({
  uploadListingImageToSignedUrl: mocks.uploadListingImageToSignedUrl,
}));

import { ImageUploader } from './ImageUploader';

const LISTING_ID = '11111111-1111-4111-8111-111111111111';
const SIGNED_URL = 'https://project.supabase.co/storage/signed/photo';

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterAll(() => vi.unstubAllGlobals());

beforeEach(() => {
  vi.clearAllMocks();
  mocks.finalizeListingImageAction.mockResolvedValue({ ok: true, data: { id: 'image-id' } });
  mocks.removeListingImageAction.mockResolvedValue({ ok: true, data: undefined });
  mocks.reorderListingImagesAction.mockResolvedValue({ ok: true, data: undefined });
  mocks.reverifyListingImagesAction.mockResolvedValue({ ok: true, data: { updated: [] } });
  mocks.uploadListingImageToSignedUrl.mockResolvedValue({ ok: true });

  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: vi.fn((file: File) => `blob:test-${file.name}`),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function renderUploader(ensureDraft = vi.fn().mockResolvedValue(LISTING_ID)) {
  return {
    ensureDraft,
    ...render(<ImageUploader listingId={null} ensureDraft={ensureDraft} />),
  };
}

function choosePhotos(files: File[]) {
  fireEvent.change(screen.getByLabelText('Upload listing photos'), {
    target: { files },
  });
}

function jpeg(name: string) {
  return new File(['camera-photo'], name, { type: 'image/jpeg' });
}

describe('ImageUploader upload reliability', () => {
  it('shows the selected image immediately while secure registration is still pending', async () => {
    mocks.registerListingImageAction.mockImplementation(() => new Promise(() => undefined));
    renderUploader();

    choosePhotos([jpeg('IMG_4821.jpg')]);

    expect(screen.getByAltText('IMG_4821.jpg preview')).toHaveAttribute(
      'src',
      'blob:test-IMG_4821.jpg',
    );
    expect(screen.getByRole('progressbar', { name: 'Uploading IMG_4821.jpg' })).toBeVisible();
    await waitFor(() => expect(mocks.registerListingImageAction).toHaveBeenCalledOnce());
    expect(mocks.uploadListingImageToSignedUrl).not.toHaveBeenCalled();
  });

  it('retries a failed registration with the same client image id and transfers once', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    mocks.registerListingImageAction
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockImplementationOnce(async ({ imageId }: { imageId: string }) => ({
        ok: true,
        data: {
          id: imageId,
          path: `seller/${LISTING_ID}/${imageId}.jpg`,
          position: 0,
          signedUploadUrl: SIGNED_URL,
        },
      }));
    renderUploader();

    choosePhotos([jpeg('first-photo.jpg')]);

    await waitFor(() => expect(mocks.registerListingImageAction).toHaveBeenCalledTimes(2), {
      timeout: 2_500,
    });
    const firstImageId = mocks.registerListingImageAction.mock.calls[0][0].imageId;
    const secondImageId = mocks.registerListingImageAction.mock.calls[1][0].imageId;
    expect(firstImageId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(secondImageId).toBe(firstImageId);

    await waitFor(() => expect(mocks.uploadListingImageToSignedUrl).toHaveBeenCalledOnce());
    expect(mocks.uploadListingImageToSignedUrl).toHaveBeenCalledWith(
      SIGNED_URL,
      expect.objectContaining({ name: 'first-photo.jpg' }),
      expect.any(AbortSignal),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole('progressbar', { name: 'Uploading first-photo.jpg' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('keeps a resolved registration failure retryable without starting a transfer', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    mocks.registerListingImageAction.mockResolvedValue({
      ok: false,
      message: 'The image upload could not be prepared. Please try again.',
    });
    renderUploader();

    choosePhotos([jpeg('schema-cache-photo.jpg')]);
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(mocks.registerListingImageAction).toHaveBeenCalledTimes(3);
    const attemptedIds = mocks.registerListingImageAction.mock.calls.map(
      ([registrationInput]) => registrationInput.imageId,
    );
    expect(new Set(attemptedIds).size).toBe(1);
    expect(mocks.uploadListingImageToSignedUrl).not.toHaveBeenCalled();
    expect(mocks.finalizeListingImageAction).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Retry upload schema-cache-photo.jpg' }),
    ).toBeVisible();
    expect(
      screen.getByText('The image upload could not be prepared. Please try again.'),
    ).toBeVisible();
  });

  it('uses the current optimistic count when photos are selected in rapid succession', async () => {
    mocks.registerListingImageAction.mockImplementation(() => new Promise(() => undefined));
    renderUploader();

    choosePhotos([jpeg('one.jpg'), jpeg('two.jpg'), jpeg('three.jpg'), jpeg('four.jpg')]);
    choosePhotos([jpeg('five.jpg'), jpeg('six.jpg'), jpeg('seven.jpg'), jpeg('eight.jpg')]);

    expect(screen.getAllByRole('progressbar')).toHaveLength(6);
    expect(screen.getByAltText('six.jpg preview')).toBeVisible();
    expect(screen.queryByAltText('seven.jpg preview')).not.toBeInTheDocument();
    expect(screen.queryByAltText('eight.jpg preview')).not.toBeInTheDocument();
    expect(screen.getByText('You can add 2 more images.')).toBeVisible();

    await act(async () => {
      await Promise.resolve();
    });
  });
});
