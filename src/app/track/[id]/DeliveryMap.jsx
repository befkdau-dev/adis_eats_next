"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_COURIER = [8.9806, 38.7578];
const DEFAULT_DELIVERY = [8.9906, 38.7678];

function coordinates(value, fallback) {
  if (!value) return fallback;

  const lat = Number(value.lat ?? value.latitude);
  const lng = Number(value.lng ?? value.longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    return fallback;
  }

  return [lat, lng];
}

function createIcon(emoji, className) {
  return L.divIcon({
    className: "adis-map-marker-wrapper",
    html: `<span class="adis-map-marker ${className}">${emoji}</span>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -18],
  });
}

const courierIcon = createIcon("🛵", "courier-marker");
const deliveryIcon = createIcon("📍", "delivery-marker");

function FitMarkers({ courier, delivery }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([courier, delivery]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, courier, delivery]);

  return null;
}

export default function DeliveryMap({
  order,
  courierPosition,
  deliveryPosition,
  isApproximate = false,
}) {
  const courier = coordinates(courierPosition, DEFAULT_COURIER);
  const delivery = coordinates(deliveryPosition, DEFAULT_DELIVERY);

  return (
    <div className="space-y-3">
      <div
        className="h-[360px] w-full overflow-hidden rounded-2xl border border-[#dce5d9]"
        role="region"
        aria-label="Delivery map showing courier and delivery destination"
      >
        <MapContainer
          center={delivery}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={courier} icon={courierIcon}>
            <Popup>Courier location</Popup>
          </Marker>

          <Marker position={delivery} icon={deliveryIcon}>
            <Popup>Delivery destination</Popup>
          </Marker>

          <FitMarkers courier={courier} delivery={delivery} />
        </MapContainer>
      </div>

      <div className="rounded-xl bg-[#f5f7f1] p-4 text-sm text-[#203b2d]">
        <p className="font-semibold">Delivery locations</p>
        <p className="mt-2">
          <span aria-hidden="true">🛵 </span>
          Courier:{" "}
          {courierPosition
            ? `${courier[0].toFixed(5)}, ${courier[1].toFixed(5)}`
            : "Approximate preview location"}
        </p>
        <p className="mt-1">
          <span aria-hidden="true">📍 </span>
          Destination:{" "}
          {order?.area ||
            order?.deliveryArea ||
            order?.address ||
            "Delivery address not recorded"}
        </p>

        {isApproximate && (
          <p className="mt-2 text-amber-800">
            This is an illustrative map preview. The order does not contain
            verified GPS coordinates, so the markers are not live locations.
          </p>
        )}
      </div>
    </div>
  );
}
