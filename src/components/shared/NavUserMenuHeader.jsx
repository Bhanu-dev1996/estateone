import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

/**
 * Identity block at the top of the signed-in nav user menu.
 */
export default function NavUserMenuHeader({ user, className, linkToAccount = true }) {
  const name = user?.name || 'EstateOne member';
  const email = user?.email?.trim();
  const avatar = user?.avatar || DEFAULT_AVATAR;

  const inner = (
  <>
      <img
        src={avatar}
        alt=""
        className="h-9 w-9 shrink-0 rounded-xl object-cover ring-2 ring-white shadow-sm"
      />
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-small font-bold leading-snug text-brand-navy">{name}</p>
        {email ? (
          <p className="mt-0.5 truncate text-[length:var(--text-micro)] leading-snug text-slate-500">
            {email}
          </p>
        ) : null}
      </div>
    </>
  );

  const shellClass = cn(
    'estate-nav-user-head w-full rounded-xl border border-slate-100/80 bg-slate-50/60 p-2',
    linkToAccount &&
      'cursor-pointer transition-colors hover:border-brand-blue/20 hover:from-blue-50/50 hover:to-blue-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40',
    className
  );

  if (linkToAccount) {
    return (
      <Link to="/account" className={cn(shellClass, 'flex items-start gap-2.5 no-underline')}>
        {inner}
      </Link>
    );
  }

  return <div className={cn(shellClass, 'flex items-start gap-2.5')}>{inner}</div>;
}