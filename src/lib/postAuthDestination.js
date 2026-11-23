import { ENABLE_CUSTOMER_DASHBOARD } from '../config/productScope';

const DASHBOARD_PATH = /^\/dashboard(\/|$)/;

/**
 * When the customer dashboard is off, map dashboard URLs to landing equivalents.
 */
export function resolvePostAuthDestination(path) {
  const target = path?.trim() || '/';
  if (ENABLE_CUSTOMER_DASHBOARD || !DASHBOARD_PATH.test(target)) {
    return target;
  }
  if (target.startsWith('/dashboard/saved')) return '/saved-properties';
  if (target.startsWith('/dashboard/compare')) return '/compare';
  if (target.startsWith('/dashboard/discover')) return '/buy';
  return '/account';
}