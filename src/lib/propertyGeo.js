/** City and neighbourhood coordinates for map previews (WGS84). */

const CITY_GEO = {
  Mumbai: { lat: 19.076, lng: 72.8777, zoom: 12 },
  Bengaluru: { lat: 12.9716, lng: 77.5946, zoom: 12 },
  Hyderabad: { lat: 17.385, lng: 78.4867, zoom: 12 },
  Pune: { lat: 18.5204, lng: 73.8567, zoom: 12 },
  'Delhi NCR': { lat: 28.6139, lng: 77.209, zoom: 11 },
  Delhi: { lat: 28.6139, lng: 77.209, zoom: 11 },
  Chennai: { lat: 13.0827, lng: 80.2707, zoom: 12 },
  Goa: { lat: 15.2993, lng: 74.124, zoom: 11 },
  Kolkata: { lat: 22.5726, lng: 88.3639, zoom: 12 },
};

/** Substring matches against `location` (lowercase). */
const LOCATION_GEO = [
  { match: 'worli sea face', lat: 18.9986, lng: 72.8174, zoom: 15 },
  { match: 'worli', lat: 18.9986, lng: 72.8174, zoom: 14 },
  { match: 'bandra', lat: 19.0596, lng: 72.8295, zoom: 14 },
  { match: 'bkc', lat: 19.066, lng: 72.8687, zoom: 15 },
  { match: 'lower parel', lat: 18.9982, lng: 72.8308, zoom: 14 },
  { match: 'whitefield', lat: 12.9698, lng: 77.7499, zoom: 14 },
  { match: 'koramangala', lat: 12.9352, lng: 77.6245, zoom: 14 },
  { match: 'hitech city', lat: 17.4435, lng: 78.3772, zoom: 14 },
  { match: 'gachibowli', lat: 17.4401, lng: 78.3489, zoom: 14 },
  { match: 'koregaon park', lat: 18.5362, lng: 73.8958, zoom: 14 },
  { match: 'baner', lat: 18.559, lng: 73.7868, zoom: 14 },
  { match: 'gurugram', lat: 28.4595, lng: 77.0266, zoom: 13 },
  { match: 'noida', lat: 28.5355, lng: 77.391, zoom: 13 },
  { match: 'adyar', lat: 13.0067, lng: 80.2576, zoom: 14 },
  { match: 'anna nagar', lat: 13.085, lng: 80.2101, zoom: 14 },
  { match: 'panaji', lat: 15.4909, lng: 73.8278, zoom: 14 },
  { match: 'salt lake', lat: 22.586, lng: 88.4102, zoom: 14 },
];

function hashJitter(id) {
  const s = String(id ?? 'estateone');
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 997;
  }
  return {
    dLat: ((h % 40) - 20) * 0.00025,
    dLng: (((h * 3) % 40) - 20) * 0.00025,
  };
}

/**
 * @param {{ id?: string, city?: string, location?: string, geo?: { lat: number, lng: number, zoom?: number } }} property
 */
export function resolvePropertyGeo(property) {
  if (property?.geo?.lat != null && property?.geo?.lng != null) {
    return {
      lat: property.geo.lat,
      lng: property.geo.lng,
      zoom: property.geo.zoom ?? 15,
    };
  }

  const loc = (property?.location ?? '').toLowerCase();
  for (const entry of LOCATION_GEO) {
    if (loc.includes(entry.match)) {
      return { lat: entry.lat, lng: entry.lng, zoom: entry.zoom };
    }
  }

  const city =
    property?.city ||
    property?.location?.split(',').pop()?.trim() ||
    'Mumbai';

  const base = CITY_GEO[city] ?? CITY_GEO.Mumbai;
  const { dLat, dLng } = hashJitter(property?.id);

  return {
    lat: base.lat + dLat,
    lng: base.lng + dLng,
    zoom: Math.min((base.zoom ?? 12) + 1, 15),
  };
}

export function googleMapsUrl(lat, lng, query) {
  const q = query ? encodeURIComponent(query) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}