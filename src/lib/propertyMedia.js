/**
 * Demo property walkthrough clips (public sample media).
 * Replace with verified listing URLs from CMS / seller portal in production.
 */
export const DUMMY_PROPERTY_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
];

/** @deprecated Use pickDummyPropertyVideo — kept for imports that expect a single default. */
export const DEFAULT_PROPERTY_VIDEO_EMBED = DUMMY_PROPERTY_VIDEOS[0];

/** Demo architectural layouts (diagram / blueprint style — not listing photography). */
export const DUMMY_FLOOR_PLANS = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Floorplan.png/960px-Floorplan.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sample_Floorplan.jpg/800px-Sample_Floorplan.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ground_floor_plan.jpg/800px-Ground_floor_plan.jpg',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581094794329-cd2c63f5c8ad?auto=format&fit=crop&w=1200&q=80',
];

/** Legacy placeholders that were house photos mis-tagged as floor plans. */
const LEGACY_FLOOR_PLAN_PLACEHOLDER =
  /photo-1600585154340-be6161a56a0c|photo-1600565193348-f74bd3c7ccdf/i;

const IMAGE_URL_PATTERN = /\.(jpe?g|png|webp|gif|avif)(\?|$)|images\.unsplash\.com/i;
const DIRECT_VIDEO_PATTERN = /\.(mp4|webm|ogg)(\?|$)/i;

function stableHash(seed) {
  const s = String(seed || 'estateone');
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) {
    hash = (hash + s.charCodeAt(i) * (i + 1)) % 997;
  }
  return hash;
}

export function pickDummyPropertyVideo(seed = '') {
  return DUMMY_PROPERTY_VIDEOS[stableHash(seed) % DUMMY_PROPERTY_VIDEOS.length];
}

export function pickDummyFloorPlan(seed = '') {
  return DUMMY_FLOOR_PLANS[stableHash(`${seed}-floor`) % DUMMY_FLOOR_PLANS.length];
}

export function isUsableFloorPlanUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  if (LEGACY_FLOOR_PLAN_PLACEHOLDER.test(trimmed)) return false;
  return true;
}

/** Floor plan image for a listing: seller upload when valid, else a stable dummy diagram per listing. */
export function getListingFloorPlanUrl(listing) {
  const candidates = [
    listing?.floorPlanImage,
    Array.isArray(listing?.floorPlans) ? listing.floorPlans[0] : null,
  ].filter(Boolean);
  for (const raw of candidates) {
    if (isUsableFloorPlanUrl(raw)) return raw.trim();
  }
  return pickDummyFloorPlan(listing?.id || listing?.slug || listing?.title);
}

/**
 * Returns an iframe-friendly embed URL, a direct file URL for <video>, or null if unusable.
 */
export function resolvePropertyVideoSource(url) {
  if (!url || typeof url !== 'string') return { kind: 'none' };
  const trimmed = url.trim();
  if (!trimmed || IMAGE_URL_PATTERN.test(trimmed)) return { kind: 'none' };

  if (DIRECT_VIDEO_PATTERN.test(trimmed)) {
    return { kind: 'file', src: trimmed };
  }

  if (/youtube\.com\/embed|youtube-nocookie\.com\/embed/.test(trimmed)) {
    return { kind: 'embed', src: trimmed };
  }

  const ytWatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (ytWatch) {
    return {
      kind: 'embed',
      src: `https://www.youtube-nocookie.com/embed/${ytWatch[1]}?rel=0&modestbranding=1`,
    };
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return { kind: 'embed', src: `https://player.vimeo.com/video/${vimeo[1]}` };
  }

  if (/player\.vimeo\.com/.test(trimmed)) {
    return { kind: 'embed', src: trimmed };
  }

  return { kind: 'embed', src: trimmed };
}

/** Video tour URL for a listing: real URL when valid, otherwise a stable dummy clip per listing. */
export function getListingVideoTourUrl(listing) {
  const raw = listing?.videoTourUrl?.trim();
  if (raw && !IMAGE_URL_PATTERN.test(raw)) {
    const resolved = resolvePropertyVideoSource(raw);
    if (resolved.kind !== 'none') return raw;
  }
  return pickDummyPropertyVideo(listing?.id || listing?.slug || listing?.title);
}

export function getPropertyVideoUrl(rawUrl, seed = 'default') {
  const resolved = resolvePropertyVideoSource(rawUrl);
  if (resolved.kind !== 'none') return rawUrl;
  return pickDummyPropertyVideo(seed);
}