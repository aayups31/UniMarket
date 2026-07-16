import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Tag,
} from 'lucide-react';

import { ModeratorRemoveDialog } from '@/features/listings/components/ModeratorRemoveDialog';
import { ListingGallery } from './ListingGallery';
import { formatCondition, formatPostedDate, formatPrice, getInitials } from '../format';
import type { MarketplaceListing, MarketplaceViewer } from '../types';

type ListingDetailProps = {
  listing: MarketplaceListing;
  viewer: MarketplaceViewer | null;
  contactUnavailable?: boolean;
  publishSuccess?: boolean;
};

export function ListingDetail({
  listing,
  viewer,
  contactUnavailable = false,
  publishSuccess = false,
}: ListingDetailProps) {
  const isOwner = viewer?.id === listing.sellerId;
  const isModerator = viewer?.role === 'moderator';
  const canContact = viewer?.role === 'student' && !isOwner && Boolean(listing.seller);
  const condition = formatCondition(listing.condition);
  const posted = formatPostedDate(listing.publishedAt ?? listing.createdAt);
  const contactHref = `/listings/${listing.id}/contact`;
  const editHref = `/listings/${listing.id}/edit`;

  return (
    <div className="min-h-screen bg-um-canvas text-um-text-strong">
      <div className="mx-auto max-w-um-content px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-24 lg:pt-8">
        <Link
          href="/marketplace"
          className="inline-flex min-h-11 items-center gap-2 rounded-um-sm px-1 text-sm font-semibold text-um-text-muted transition-colors duration-160 ease-um-out hover:text-um-text-strong"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to marketplace
        </Link>

        {publishSuccess ? (
          <div
            className="mt-4 overflow-hidden rounded-um-md border border-um-success/25 bg-white shadow-um-xs"
            role="status"
            aria-live="polite"
          >
            <div className="grid h-1 grid-cols-4" aria-hidden="true">
              <span className="bg-um-gold-300" />
              <span className="bg-um-gold-400" />
              <span className="bg-um-gold-500" />
              <span className="bg-um-gold-600" />
            </div>
            <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
              <BadgeCheck className="mt-0.5 size-5 shrink-0 text-um-success" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-um-text-strong">Listed for Waterloo.</p>
                <p className="mt-0.5 text-xs leading-5 text-um-text-muted">
                  Your item is now visible to verified students on campus.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {contactUnavailable ? (
          <div
            className="mt-4 rounded-um-md border border-um-gold-600/35 bg-um-gold-300/25 px-4 py-3 text-sm text-um-text"
            role="status"
          >
            Seller contact is temporarily unavailable. Your listing view is still here.
          </div>
        ) : null}

        <div className="mt-5 grid items-start gap-7 lg:grid-cols-[minmax(0,1.38fr)_minmax(21rem,0.62fr)] lg:gap-x-12 lg:gap-y-11">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <ListingGallery listing={listing} />
          </div>

          <aside className="min-w-0 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="overflow-hidden rounded-um-xl border border-black/10 bg-um-surface shadow-um-sm">
              <div className="h-1.5 bg-um-gold-500" aria-hidden="true" />
              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-2 font-condensed text-xs font-bold uppercase tracking-[0.13em] text-um-text-muted">
                  <span>{listing.category?.label ?? 'Marketplace'}</span>
                  {listing.featuredAt ? (
                    <>
                      <span aria-hidden="true">/</span>
                      <span className="text-um-gold-700">Campus pick</span>
                    </>
                  ) : null}
                </div>

                <h1 className="mt-3 text-[clamp(1.8rem,5vw,2.7rem)] font-semibold leading-[1.03] tracking-[-0.05em]">
                  {listing.title}
                </h1>
                <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <p className="text-[2rem] font-bold tracking-[-0.05em]">
                    {formatPrice(listing.priceCents)}
                  </p>
                  {listing.openToOffers ? (
                    <p className="pb-1 text-sm font-medium text-um-text-muted">Offers welcome</p>
                  ) : null}
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-black/10 py-5 text-sm">
                  <DetailItem
                    icon={<Tag className="size-4" />}
                    label="Condition"
                    value={condition ?? 'Not specified'}
                  />
                  <DetailItem
                    icon={<MapPin className="size-4" />}
                    label="Pickup area"
                    value={listing.pickupArea ?? 'Arrange with seller'}
                  />
                  <DetailItem
                    icon={<CalendarDays className="size-4" />}
                    label="Posted"
                    value={posted ?? 'Recently'}
                  />
                  <DetailItem
                    icon={<BadgeCheck className="size-4" />}
                    label="Community"
                    value="Waterloo verified"
                  />
                </dl>

                <SellerSummary listing={listing} />

                <div className="mt-6 hidden lg:block">
                  <PrimaryAction
                    canContact={canContact}
                    contactHref={contactHref}
                    editHref={editHref}
                    isOwner={isOwner}
                  />
                </div>

                {isModerator && !isOwner ? (
                  <ModeratorRemoveDialog listingId={listing.id} listingTitle={listing.title} />
                ) : null}
              </div>
            </div>
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <section
              className="border-t border-black/10 pt-8"
              aria-labelledby="description-heading"
            >
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-um-gold-700">
                Item details
              </p>
              <h2
                id="description-heading"
                className="mt-2 text-2xl font-semibold tracking-[-0.035em]"
              >
                About this item
              </h2>
              <div className="mt-4 max-w-3xl whitespace-pre-wrap text-[0.96rem] leading-7 text-um-text">
                {listing.description}
              </div>
            </section>

            <section
              className="mt-8 overflow-hidden rounded-um-lg border border-um-gold-600/30 bg-um-gold-300/20"
              aria-labelledby="meet-safely-heading"
            >
              <div className="h-1 bg-um-gold-500" aria-hidden="true" />
              <div className="flex gap-4 p-5 sm:p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-um-sm bg-um-ink-950 text-um-gold-400">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="meet-safely-heading" className="font-semibold">
                    Meet where campus is busy
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-um-text">
                    Meet in a public campus location and inspect the item before completing the
                    exchange. Share an exact meetup point only after you agree on the sale.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-3 bottom-[5.15rem] z-30 lg:hidden">
        <div className="mx-auto max-w-lg rounded-um-md border border-black/10 bg-white/96 p-2 shadow-um-md backdrop-blur-md">
          <PrimaryAction
            canContact={canContact}
            contactHref={contactHref}
            editHref={editHref}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
}

function PrimaryAction({
  canContact,
  contactHref,
  editHref,
  isOwner,
}: {
  canContact: boolean;
  contactHref: string;
  editHref: string;
  isOwner: boolean;
}) {
  if (isOwner) {
    return (
      <Link
        href={editHref}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-um-sm bg-um-ink-950 px-4 text-sm font-bold text-white transition duration-160 ease-um-out hover:-translate-y-0.5 hover:bg-um-ink-850"
      >
        <Pencil className="size-4" aria-hidden="true" />
        Edit your listing
      </Link>
    );
  }

  if (canContact) {
    return (
      <a
        href={contactHref}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-um-sm bg-um-gold-500 px-4 text-sm font-bold text-um-ink-950 shadow-um-xs transition duration-160 ease-um-out hover:-translate-y-0.5 hover:bg-um-gold-400"
      >
        <Mail className="size-4" aria-hidden="true" />
        Email seller
      </a>
    );
  }

  return (
    <p className="rounded-um-sm bg-um-surface-warm px-4 py-3 text-center text-sm text-um-text-muted">
      Seller contact is available to verified student accounts.
    </p>
  );
}

function DetailItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs text-um-text-muted">
        <span aria-hidden="true">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1.5 truncate font-semibold text-um-text-strong" title={value}>
        {value}
      </dd>
    </div>
  );
}

function SellerSummary({ listing }: { listing: MarketplaceListing }) {
  const sellerName = listing.seller?.fullName ?? 'Waterloo student';
  const sellerDetails = [listing.seller?.program, listing.seller?.academicYear]
    .filter(Boolean)
    .join(' · ');
  const joined = listing.seller?.joinedAt ? formatJoinedDate(listing.seller.joinedAt) : null;

  return (
    <div className="mt-6 rounded-um-md bg-um-canvas-soft p-4">
      <div className="flex items-center gap-3.5">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-um-ink-950 text-sm font-bold text-um-gold-400">
          {getInitials(sellerName) || 'UW'}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{sellerName}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-um-gold-700">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            Verified Waterloo student
          </p>
        </div>
      </div>
      {sellerDetails || joined ? (
        <div className="mt-3 border-t border-black/10 pt-3 text-xs leading-5 text-um-text-muted">
          {sellerDetails ? <p>{sellerDetails}</p> : null}
          {joined ? <p>Member since {joined}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function formatJoinedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', { month: 'short', year: 'numeric' }).format(date);
}
