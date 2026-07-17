import { cn } from '@/lib/utils';

type CampusRouteGraphicProps = {
  className?: string;
  tone?: 'dark' | 'light';
};

/** A line-free black-and-gold atmosphere retained behind platform empty states and panels. */
export function CampusRouteGraphic({ className, tone = 'dark' }: CampusRouteGraphicProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('um-campus-glow relative h-full w-full overflow-hidden', className)}
      data-tone={tone}
    >
      <span className="um-campus-glow__field um-campus-glow__field--primary" />
      <span className="um-campus-glow__field um-campus-glow__field--secondary" />
    </div>
  );
}
