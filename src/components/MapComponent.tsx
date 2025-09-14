import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// --- REMOVE THE OLD FIX for broken marker icons ---
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
// L.Icon.Default.mergeOptions({ ... });

// --- ADD A NEW CUSTOM ICON using Tailwind CSS classes ---
const floatIcon = new L.DivIcon({
  html: `<div class="relative flex h-3 w-3">
           <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>
           <div class="relative inline-flex rounded-full h-3 w-3 bg-sky-500 border border-white"></div>
         </div>`,
  className: '', // important to clear default styling
  iconSize: [12, 12],
  iconAnchor: [6, 6] // center the icon
});
// --- End of CUSTOM ICON ---

// Define the type for a single float based on your Supabase table
interface Float {
  id: number;
  wmo_id: number;
  latitude: number;
  longitude: number;
  last_seen: string;
}

interface MapComponentProps {
  floats: Float[];
}

const MapComponent: React.FC<MapComponentProps> = ({ floats }) => {
  // Center the map on the Indian Ocean
  const mapCenter: L.LatLngExpression = [10.8231, 80.2707];

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={4} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Map over the floats data and create a Marker for each one */}
      {floats.map((float) => (
        <Marker key={float.id} position={[float.latitude, float.longitude]} icon={floatIcon}>
          <Popup>
            <b>WMO ID:</b> {float.wmo_id} <br />
            <b>Position:</b> {float.latitude.toFixed(2)}, {float.longitude.toFixed(2)} <br />
            <b>Last Seen:</b> {new Date(float.last_seen).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;

