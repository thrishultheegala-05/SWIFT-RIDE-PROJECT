import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { DriverInfo, LocationPoint, TripPhase } from '../types';

interface MapViewProps {
  pickup: LocationPoint;
  destination: LocationPoint | null;
  drivers: DriverInfo[];
  activeDriver: DriverInfo | null;
  activeDriverPosition: [number, number] | null;
  tripPhase: TripPhase;
  routeCoordinates: [number, number][];
  onSelectDestination?: (point: LocationPoint) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  pickup,
  destination,
  drivers,
  activeDriver,
  activeDriverPosition,
  tripPhase,
  routeCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const driverMarkersRef = useRef<{ [id: string]: L.Marker }>({});
  const activeDriverMarkerRef = useRef<L.Marker | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const traveledPolylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [pickup.lat, pickup.lng],
      zoom: 15,
      zoomControl: false,
    });

    // Clean, modern CartoDB Voyager tiles designed for navigation
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Pickup Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
    }

    const pickupIcon = L.divIcon({
      className: 'custom-pickup-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-white">
            <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
            Pickup
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(map);
    if (!destination && !activeDriverPosition) {
      map.setView([pickup.lat, pickup.lng], 15);
    }
  }, [pickup, destination, activeDriverPosition]);

  // Update Destination Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }

    if (destination) {
      const destIcon = L.divIcon({
        className: 'custom-destination-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div class="absolute -bottom-6 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
              ${destination.name}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      destinationMarkerRef.current = L.marker([destination.lat, destination.lng], { icon: destIcon }).addTo(map);

      if (tripPhase === 'idle' && !activeDriverPosition) {
        const bounds = L.latLngBounds([
          [pickup.lat, pickup.lng],
          [destination.lat, destination.lng],
        ]);
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 15 });
      }
    }
  }, [destination, pickup, tripPhase, activeDriverPosition]);

  // Update Nearby Drivers (when idle)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tripPhase !== 'idle' && tripPhase !== 'matching') {
      // Remove other idle cars during active trip
      (Object.values(driverMarkersRef.current) as L.Marker[]).forEach((marker) => marker.remove());
      driverMarkersRef.current = {};
      return;
    }

    // Keep idle drivers synced
    drivers.forEach((driver) => {
      if (!driverMarkersRef.current[driver.id]) {
        const carIcon = L.divIcon({
          className: 'custom-car-marker',
          html: `
            <div class="w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center transform transition-transform hover:scale-110">
              <div class="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-amber-400">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([driver.currentLocation.lat, driver.currentLocation.lng], {
          icon: carIcon,
        }).addTo(map);
        driverMarkersRef.current[driver.id] = marker;
      } else {
        driverMarkersRef.current[driver.id].setLatLng([
          driver.currentLocation.lat,
          driver.currentLocation.lng,
        ]);
      }
    });
  }, [drivers, tripPhase]);

  // Update Active Driver Position (Rajan V. during active trip)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!activeDriverPosition || tripPhase === 'idle' || tripPhase === 'completed') {
      if (activeDriverMarkerRef.current) {
        activeDriverMarkerRef.current.remove();
        activeDriverMarkerRef.current = null;
      }
      return;
    }

    const pos = activeDriverPosition;

    if (!activeDriverMarkerRef.current) {
      const activeCarIcon = L.divIcon({
        className: 'custom-active-car-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <!-- Pulsing radar wave -->
            <div class="absolute w-12 h-12 rounded-full bg-amber-400/30 animate-ping"></div>
            <div class="w-11 h-11 rounded-full bg-slate-950 shadow-2xl border-2 border-amber-400 flex items-center justify-center relative z-10">
              <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
              </svg>
            </div>
            <div class="absolute -top-7 bg-slate-900 text-amber-400 text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-lg border border-slate-700 whitespace-nowrap">
              ${activeDriver?.name || 'Rajan V.'}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      activeDriverMarkerRef.current = L.marker(pos, { icon: activeCarIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      activeDriverMarkerRef.current.setLatLng(pos);
    }
  }, [activeDriverPosition, tripPhase, activeDriver]);

  // Update Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (routeCoordinates && routeCoordinates.length > 1) {
      // Background glow
      routePolylineRef.current = L.polyline(routeCoordinates, {
        color: '#F59E0B',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Fit bounds nicely with padding
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [routeCoordinates]);

  // Center on user
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (activeDriverPosition && (tripPhase === 'driver_en_route' || tripPhase === 'in_progress')) {
      mapInstanceRef.current.flyTo(activeDriverPosition, 16, { duration: 1 });
    } else {
      mapInstanceRef.current.flyTo([pickup.lat, pickup.lng], 16, { duration: 1 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Quick Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          id="btn-recenter-map"
          onClick={handleRecenter}
          className="p-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-lg border border-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          title="Recenter Map"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Floating City & Live Traffic Tag */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>India Live • Hyderabad</span>
        <span className="text-slate-300">•</span>
        <span className="text-amber-600 font-bold">{drivers.length} Drivers Online</span>
      </div>
    </div>
  );
};
