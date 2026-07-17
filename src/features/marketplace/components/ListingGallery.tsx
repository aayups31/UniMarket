'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';

import { CampusRouteGraphic } from '@/components/ui/CampusRouteGraphic';
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
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-um-surface-warm shadow-[0_16px_42px_rgba(5,7,11,0.11)] lg:aspect-[7/5]">
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
          <div className="relative isolate grid h-full place-items-center overflow-hidden bg-um-ink-900 px-8 text-center">
            <CampusRouteGraphic className="absolute inset-0 -z-10 opacity-[0.45]" />
            <div className="relative">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-white/[0.08] text-white/58 ring-1 ring-white/10">
                <ImageIcon aria-hidden="true" className="size-6" />
              </span>
              <p className="mt-3 text-sm font-medium text-white/58">Photo unavailable</p>
            </div>
          </div>
        )}

        {availableImages.length > 1 ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-um-ink-950/84 px-3 py-1.5 text-xs font-bold tabular-nums text-white shadow-um-xs backdrop-blur-sm">
            {selectedPosition} / {availableImages.length}
          </span>
        ) : null}
      </div>

      {availableImages.length > 1 ? (
        <div
          aria-label="Choose a listing photo"
          className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
        >
          {availableImages.map((image, index) => {
            const isSelected = image.id === selectedImage?.id;

            return (
              <button
                aria-label={`Show photo ${index + 1} of ${availableImages.length}`}
                aria-pressed={isSelected}
                className={`relative aspect-[4/3] h-16 shrink-0 overflow-hidden rounded-[0.7rem] bg-um-surface-warm transition duration-160 ease-um-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2 sm:h-[4.5rem] ${
                  isSelected
                    ? 'ring-2 ring-um-gold-500 ring-offset-2'
                    : 'opacity-[0.68] hover:opacity-100'
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
