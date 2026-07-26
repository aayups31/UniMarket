import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { compressImageFile } from './imageCompression';

describe('compressImageFile', () => {
  beforeEach(() => {
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private value = '';

      set src(next: string) {
        this.value = next;
        queueMicrotask(() => this.onload?.());
      }

      get src() {
        return this.value;
      }
    }

    vi.stubGlobal('Image', MockImage);
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    });

    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => ({
        clearRect: vi.fn(),
        drawImage: vi.fn(),
      })),
    });

    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      configurable: true,
      value: vi.fn((callback: BlobCallback) => {
        callback(new Blob(['x'.repeat(2_500)]));
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reduces a large image file before upload', async () => {
    const original = new File(['x'.repeat(12_000)], 'large.jpg', { type: 'image/jpeg' });

    const compressed = await compressImageFile(original, { maxBytes: 2_000 });

    expect(compressed).toBeInstanceOf(File);
    expect(compressed.size).toBeLessThan(original.size);
    expect(compressed.type).toBe('image/jpeg');
  });
});
