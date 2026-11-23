import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ArrowSquareOut } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import { resolvePropertyGeo, googleMapsUrl } from '../../lib/propertyGeo';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Interactive neighbourhood map (OpenStreetMap tiles).
 */
export default function PropertyLocationMap({
  className,
  aspectClassName = 'aspect-[21/9]',
  property,
  lat,
  lng,
  zoom,
  label,
  showOpenLink = true,
}) {
  const geo = useMemo(() => {
    if (lat != null && lng != null) {
      return { lat, lng, zoom: zoom ?? 15 };
    }
    return resolvePropertyGeo(property ?? {});
  }, [property, lat, lng, zoom]);

  const title = label || property?.location || 'Property location';
  const mapsHref = googleMapsUrl(geo.lat, geo.lng, title);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100',
        aspectClassName,
        className
      )}
    >
      <MapContainer
        center={[geo.lat, geo.lng]}
        zoom={geo.zoom}
        scrollWheelZoom={false}
        className="absolute inset-0 z-0 h-full w-full min-h-[12rem] [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:opacity-80"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[geo.lat, geo.lng]} icon={defaultIcon}>
          <Popup>
            <span className="text-small font-semibold text-brand-navy">{title}</span>
          </Popup>
        </Marker>
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[400] bg-gradient-to-t from-brand-navy/75 via-brand-navy/25 to-transparent p-3 sm:p-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="flex items-center gap-2 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-navy shadow-md">
              <MapPin size={16} weight="fill" aria-hidden />
            </span>
            <div className="text-left">
              <p className="text-caption font-semibold leading-tight">{title}</p>
              <p className="text-caption text-slate-200 leading-snug hidden sm:block">
                Verified prime neighbourhood corridor
              </p>
            </div>
          </div>
          {showOpenLink && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-caption font-semibold text-brand-blue shadow-xs hover:bg-white"
            >
              Open in Maps
              <ArrowSquareOut size={12} weight="bold" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}