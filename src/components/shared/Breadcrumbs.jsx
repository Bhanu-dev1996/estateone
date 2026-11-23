import React from 'react';
import { Link } from 'react-router-dom';
import { CaretRight, House } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

/** Pages sometimes pass `{ label: 'Home', href: '/' }`; root Home is always rendered below. */
function stripRedundantHomeCrumb(items) {
  if (!Array.isArray(items) || items.length === 0) return items;
  const trail = [...items];
  while (
    trail.length > 0 &&
    typeof trail[0].label === 'string' &&
    trail[0].label.trim().toLowerCase() === 'home' &&
    (trail[0].href == null || trail[0].href === '' || trail[0].href === '/')
  ) {
    trail.shift();
  }
  return trail;
}

export default function Breadcrumbs({ items = [], className = '' }) {
  const trail = stripRedundantHomeCrumb(items);
  if (!trail || trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('site-breadcrumbs', className)}>
      <ol className="site-breadcrumbs__list">
        <li className="site-breadcrumbs__segment">
          <Link to="/" className="site-breadcrumbs__link" title="Return to homepage">
            <House size={11} weight="duotone" className="site-breadcrumbs__home-icon" aria-hidden />
            <span>Home</span>
          </Link>
        </li>

        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <li aria-hidden="true" className="site-breadcrumbs__separator">
                <CaretRight size={9} weight="bold" aria-hidden />
              </li>
              <li
                className={cn(
                  isLast ? 'flex min-w-0 max-w-full items-center' : 'site-breadcrumbs__segment'
                )}
              >
                {isLast || !item.href ? (
                  <span aria-current="page" className="site-breadcrumbs__current">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.href} className="site-breadcrumbs__link">
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}