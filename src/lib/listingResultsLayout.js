const GRID_CATALOGUE =
  'property-results-grid property-results-grid--grid grid grid-cols-1 gap-6 md:grid-cols-2';
const GRID_THREE_COL =
  'property-results-grid property-results-grid--grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3';
const LIST =
  'property-results-grid property-results-grid--list grid grid-cols-1 gap-4';

/**
 * @param {'grid' | 'list'} layout
 * @param {'catalogue' | 'three'} [variant='catalogue']
 * @param {string} [suffix] Extra utility classes (e.g. `mb-8`)
 */
export function getPropertyResultsLayoutClass(layout, variant = 'catalogue', suffix = 'mb-8') {
  const base = layout === 'list' ? LIST : variant === 'three' ? GRID_THREE_COL : GRID_CATALOGUE;
  return suffix ? `${base} ${suffix}`.trim() : base;
}