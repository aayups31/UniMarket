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

import { CampusRouteGraphic } from '@/components/ui/CampusRouteGraphic';
import { ListingManagementActions } from '@/features/listings/components/ListingManagementActions';
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
      <div className="mx-auto max-w-um-content px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
        <Link
          href="/marketplace"
          className="font-condensed inline-flex min-h-11 items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.15em] text-um-text-muted transition-colors duration-160 ease-um-out hover:text-um-text-strong"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to marketplace
        </Link>

        {publishSuccess ? (
          <div
            className="mt-4 overflow-hidden border-l-2 border-um-success bg-um-success/[0.07]"
            role="status"
            aria-live="polite"
          >
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
            className="mt-4 border-l-2 border-um-gold-500 bg-um-gold-300/20 px-4 py-3 text-sm text-um-text"
            role="status"
          >
            Seller contact is temporarily unavailable. Your listing view is still here.
          </div>
        ) : null}

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.42fr)_minmax(21rem,0.58fr)] lg:gap-x-14 lg:gap-y-12">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <ListingGallery listing={listing} />
          </div>

          <aside className="min-w-0 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="relative isolate overflow-hidden bg-um-ink-900 text-um-text-inverse shadow-[0_22px_58px_rgba(5,7,11,0.18)]">
              <div className="absolute inset-x-0 top-0 h-px bg-um-gold-400" aria-hidden="true" />
              <CampusRouteGraphic className="absolute -right-32 -top-28 -z-10 h-72 w-[32rem] opacity-[0.22]" />
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 font-condensed text-xs font-bold uppercase tracking-[0.15em] text-white/44">
                  <span>{listing.category?.label ?? 'Marketplace'}</span>
                  {listing.featuredAt ? (
                    <>
                      <span aria-hidden="true">/</span>
                      <span className="text-um-gold-300">Campus pick</span>
                    </>
                  ) : null}
                </div>

                <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.01] tracking-[-0.058em] text-white">
                  {listing.title}
                </h1>
                <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <p className="text-[2.15rem] font-bold tracking-[-0.055em] text-white">
                    {formatPrice(listing.priceCents)}
                  </p>
                  {listing.openToOffers ? (
                    <p className="pb-1 text-sm font-medium text-um-gold-300">Offers welcome</p>
                  ) : null}
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-white/10 py-5 text-sm [&_dd]:text-white [&_dt]:text-white/42">
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

                {isOwner ? (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.15em] text-um-gold-300">
                      Listing controls
                    </p>
                    <p className="mt-1.5 text-xs leading-5 text-white/52">
                      Mark it sold once it is gone, or permanently delete it when you no longer need
                      the record.
                    </p>
                    <div className="mt-3">
                      <ListingManagementActions
                        listingId={listing.id}
                        redirectAfterAction="/my-listings"
                        showView={false}
                        status="published"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 hidden lg:block">
                    <PrimaryAction
                      canContact={canContact}
                      contactHref={contactHref}
                      editHref={editHref}
                      isOwner={false}
                      inverted
                    />
                  </div>
                )}

                {isModerator && !isOwner ? (
                  <ModeratorRemoveDialog listingId={listing.id} listingTitle={listing.title} />
                ) : null}
              </div>
            </div>
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <section
              className="border-t border-black/[0.08] pt-9"
              aria-labelledby="description-heading"
            >
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-um-gold-700">
                Item details
              </p>
              <h2
                id="description-heading"
                className="mt-2 text-3xl font-semibold tracking-[-0.045em]"
              >
                About this item
              </h2>
              <div className="mt-4 max-w-3xl whitespace-pre-wrap text-[0.96rem] leading-7 text-um-text">
                {listing.description}
              </div>
            </section>

            <section
              className="relative isolate mt-10 overflow-hidden bg-um-ink-900 text-um-text-inverse"
              aria-labelledby="meet-safely-heading"
            >
              <CampusRouteGraphic className="absolute inset-y-0 right-0 -z-10 w-[58%] opacity-[0.38]" />
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-r from-um-ink-900 via-um-ink-900/96 to-um-ink-900/55"
                aria-hidden="true"
              />
              <div className="flex gap-4 p-6 sm:p-8">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.07] text-um-gold-300 ring-1 ring-white/10">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="meet-safely-heading" className="font-semibold">
                    Meet where campus is busy
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/55">
                    Meet in a public campus location and inspect the item before completing the
                    exchange. Share an exact meetup point only after you agree on the sale.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {!isOwner ? (
        <div className="fixed inset-x-3 bottom-[5.15rem] z-30 lg:hidden">
          <div className="mx-auto max-w-lg rounded-um-md border border-black/10 bg-um-surface/96 p-2 shadow-um-md backdrop-blur-md">
            <PrimaryAction
              canContact={canContact}
              contactHref={contactHref}
              editHref={editHref}
              isOwner={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PrimaryAction({
  canContact,
  contactHref,
  editHref,
  inverted = false,
  isOwner,
}: {
  canContact: boolean;
  contactHref: string;
  editHref: string;
  inverted?: boolean;
  isOwner: boolean;
}) {
  if (isOwner) {
    return (
      <Link
        href={editHref}
        className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-um-sm px-4 text-sm font-bold transition duration-160 ease-um-out hover:-translate-y-0.5 ${
          inverted
            ? 'bg-white text-um-ink-950 hover:bg-um-surface-warm'
            : 'bg-um-ink-950 text-white hover:bg-um-ink-850'
        }`}
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
    <p
      className={`rounded-um-sm px-4 py-3 text-center text-sm ${
        inverted ? 'bg-white/[0.06] text-white/48' : 'bg-um-surface-warm text-um-text-muted'
      }`}
    >
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
    <div className="mt-6 bg-white/[0.055] p-4 ring-1 ring-white/[0.07]">
      <div className="flex items-center gap-3.5">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-white/[0.08] text-sm font-bold text-um-gold-300 ring-1 ring-white/10">
          {getInitials(sellerName) || 'UW'}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{sellerName}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-um-gold-300">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            Verified Waterloo student
          </p>
        </div>
      </div>
      {sellerDetails || joined ? (
        <div className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/42">
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
