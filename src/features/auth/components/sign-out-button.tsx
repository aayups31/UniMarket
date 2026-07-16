import { LogOut } from 'lucide-react';

import { signOutAction } from '../actions';

type SignOutButtonProps = {
  className?: string;
  label?: string;
};

export function SignOutButton({
  className = 'inline-flex min-h-11 items-center gap-2 rounded-sm px-3 text-sm font-semibold text-black/55 transition hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a900]',
  label = 'Sign out',
}: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <button className={className} type="submit">
        <LogOut aria-hidden="true" className="size-4" />
        {label}
      </button>
    </form>
  );
}
