'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';

import type { MarketplaceImage, MarketplaceListing } from '../types';

export function ListingGallery({ listing }: { listing: MarketplaceListing }) {
  const availableImages = listing.images.filter(
    (image): image is MarketplaceImage & { url: string } => Boolean(image.url),
  );
  const [selectedId, setSelectedId] = useState(availableImages[0]?.id ?? null);
  const selectedImage =
    availableImages.find((image) => image.id === selectedId) ?? availableImages[0] ?? null;
  const selectedPosition = selectedImage
    ? availableImages.findIndex((image) => image.id === selectedImage.id) + 1
    : 0;

  return (
    <section aria-label="Listing photos">
      <div className="relative aspect-[4/3] overflow-hidden rounded-um-xl border border-black/10 bg-um-surface-warm">
        {selectedImage ? (
          <Image
            alt={`${listing.title}, photo ${selectedPosition} of ${availableImages.length}`}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            src={selectedImage.url}
          />
        ) : (
          <div className="grid h-full place-items-center px-8 text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-um-md bg-um-surface text-um-text-muted shadow-um-xs">
                <ImageIcon aria-hidden="true" className="size-6" />
              </span>
              <p className="mt-3 text-sm font-medium text-um-text-muted">Photo unavailable</p>
            </div>
          </div>
        )}

        {availableImages.length > 1 ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-um-ink-950/90 px-3 py-1.5 text-xs font-bold tabular-nums text-white shadow-um-xs">
            {selectedPosition} / {availableImages.length}
          </span>
        ) : null}
      </div>

      {availableImages.length > 1 ? (
        <div
          aria-label="Choose a listing photo"
          className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6"
          role="group"
        >
          {availableImages.map((image, index) => {
            const isSelected = image.id === selectedImage?.id;

            return (
              <button
                aria-label={`Show photo ${index + 1} of ${availableImages.length}`}
                aria-pressed={isSelected}
                className={`relative aspect-square min-h-11 overflow-hidden rounded-um-sm border bg-um-surface-warm transition duration-160 ease-um-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-um-ink-950 ring-2 ring-um-gold-500 ring-offset-2'
                    : 'border-black/10'
                }`}
                key={image.id}
                onClick={() => setSelectedId(image.id)}
                type="button"
              >
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 10vw, 25vw"
                  src={image.url}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
