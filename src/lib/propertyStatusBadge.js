const READY_MOVE_PATTERNS = ['ready to move', 'immediate move', 'ready to occupy'];

/**
 * Badge colors for listing status on photo overlays (dark scrim).
 */
export function getPropertyStatusBadgeClassOnMedia(status) {
  const s = (status || '').toLowerCase();

  if (READY_MOVE_PATTERNS.some((p) => s.includes(p))) {
    return 'bg-brand-blue/90 text-white';
  }
  if (s.includes('under construction')) {
    return 'bg-amber-600/90 text-white';
  }
  if (s.includes('fitout') || s.includes('fit-out')) {
    return 'bg-violet-600/90 text-white';
  }
  return 'bg-brand-navy/85 text-white';
}

/**
 * Badge colors for status chips on light page backgrounds.
 */
export function getPropertyStatusBadgeClassOnPage(status) {
  const s = (status || '').toLowerCase();

  if (READY_MOVE_PATTERNS.some((p) => s.includes(p))) {
    return 'bg-blue-50 text-brand-blue border border-blue-200/80';
  }
  if (s.includes('under construction')) {
    return 'bg-amber-50 text-amber-900 border border-amber-200/80';
  }
  if (s.includes('fitout') || s.includes('fit-out')) {
    return 'bg-violet-50 text-violet-900 border border-violet-200/80';
  }
  return 'bg-slate-100 text-slate-700 border border-slate-200/80';
}