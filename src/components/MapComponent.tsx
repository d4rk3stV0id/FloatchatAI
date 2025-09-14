import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

// Define the type for a single float
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

// --- FIX: Create a helper component to access the map instance via the useMap hook ---
const MapSetup = () => {
  const map = useMap();
  useEffect(() => {
    // This code runs once when the map is created
    map.createPane('labels');
    const pane = map.getPane('labels');
    if (pane) {
      pane.style.zIndex = "650";
      pane.style.pointerEvents = 'none';
    }
  }, [map]);
  return null; // This component does not render anything
};


const MapComponent: React.FC<MapComponentProps> = ({ floats }) => {
  const mapCenter: L.LatLngExpression = [10.8231, 80.2707];
  const [landData, setLandData] = useState<any>(null);

  // Fetch the land data once when the component mounts
  useEffect(() => {
    fetch('/land.geojson')
      .then(res => res.json())
      .then(data => setLandData(data))
      .catch(err => console.error("Failed to fetch land data:", err));
  }, []);

  const pulsingIcon = L.divIcon({
    className: 'pulsing-icon-container',
    html: `
      <div class="pulsing-icon">
        <div class="sonar-emitter"></div>
        <div class="sonar-wave"></div>
      </div>
    `,
    iconSize: [15, 15],
    iconAnchor: [7.5, 7.5],
    popupAnchor: [0, -9]
  });

  // Style for the GeoJSON land layer
  const landStyle = {
    fillColor: '#111827', // Dark color for land
    weight: 0.5,
    color: '#374151', // Border color for countries
    fillOpacity: 1,
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
      <style>{`
        /* --- High-performance, wavefront animation with fading trail --- */
        .ocean-background {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #001f3f; /* Base deep blue ocean color */
          overflow: hidden;
          z-index: 1;
        }
        .wave {
          --wave-color: rgba(10, 88, 144, 0.6);
          position: absolute;
          width: 300vw;
          height: 300vw;
          border-radius: 45%;
          opacity: 0; /* Start transparent before animation begins */
          background: radial-gradient(
            circle at 100% 100%, 
            var(--wave-color) 15%,
            rgba(10, 88, 144, 0) 60%
          );
          bottom: -150vw;
          right: -150vw;
          animation-name: sweep-across;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        .wave.one { animation-duration: 20s; animation-delay: 0s; }
        .wave.two {
          width: 320vw; height: 320vw; border-radius: 47%;
          bottom: -160vw; right: -160vw;
          animation-duration: 25s; animation-delay: -8s;
        }
        .wave.three {
          width: 280vw; height: 280vw; border-radius: 43%;
          bottom: -140vw; right: -140vw;
          animation-duration: 30s; animation-delay: -15s;
        }
        @keyframes sweep-across {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(-100vw, -100vw); opacity: 0; }
        }
        /* --- End of animation styles --- */

        .leaflet-container {
          background-color: transparent !important;
        }
        
        .pulsing-icon-container { 
          --float-color: #00ffff;
          --float-glow: #00ffff;
          border: none; 
          background: none; 
        }
        .pulsing-icon .sonar-emitter {
          position: relative;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: var(--float-color);
          border: 1px solid #ffffff;
          box-shadow: 0 0 8px var(--float-glow), inset 0 0 4px rgba(255,255,255,0.6);
        }
        .pulsing-icon .sonar-wave {
          position: absolute; top: -2px; left: -2px;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          border: 2px solid var(--float-color);
          opacity: 0;
          animation: sonar-wave 2.5s infinite;
          transform-origin: center;
        }
        @keyframes sonar-wave {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        .leaflet-popup-content-wrapper {
          background-color: #1a2c;
          color: #e2e8f0;
          border: 1px solid #00ffff80;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        .leaflet-popup-tip { background-color: #1a2c; }
        .leaflet-popup-close-button { color: #e2e8f0 !important; }
      `}</style>

      <div className="ocean-background">
        <div className="wave one"></div>
        <div className="wave two"></div>
        <div className="wave three"></div>
      </div>
      
      <MapContainer 
        center={mapCenter} 
        zoom={4} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', position: 'relative', zIndex: 2 }}
        // --- FIX: The whenCreated prop has been removed to prevent the crash ---
      >
        {/* --- FIX: The new MapSetup component is added here to configure the map --- */}
        <MapSetup />

        {landData && <GeoJSON data={landData} style={landStyle} />}
        
        <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            pane="labels"
        />
        
        {floats.map((float) => (
          <Marker key={float.id} position={[float.latitude, float.longitude]} icon={pulsingIcon}>
            <Popup>
              <b>WMO ID:</b> {float.wmo_id} <br />
              <b>Position:</b> {float.latitude.toFixed(2)}, {float.longitude.toFixed(2)} <br />
              <b>Last Seen:</b> {new Date(float.last_seen).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

