// components/MapComponent.tsx

import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AIAction } from '@/pages/dashboard';
import { Float } from '@/lib/dataHooks'; // Make sure this is the updated Float type

interface MapComponentProps {
  floats: Float[];
  actions: AIAction[];
  mapRef: React.RefObject<any>;
}

// Helper component to configure the map instance after creation
const MapSetup = () => {
  const map = useMap();
  useEffect(() => {
    // This creates a dedicated "pane" or layer for the labels
    map.createPane('labels');
    const pane = map.getPane('labels');
    if (pane) {
      // Ensure labels appear on top of other layers
      pane.style.zIndex = "650";
      // Make sure the label layer doesn't intercept mouse clicks
      pane.style.pointerEvents = 'none';
    }
  }, [map]);
  return null; // This component does not render anything itself
};

const MapComponent: React.FC<MapComponentProps> = ({ floats, actions, mapRef }) => {
  const mapCenter: L.LatLngExpression = [10.8231, 80.2707];
  const [landData, setLandData] = useState<any>(null);
  const [highlightedFloatId, setHighlightedFloatId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/land.geojson')
      .then(res => res.json())
      .then(data => setLandData(data));
  }, []);
  
  // Handle incoming actions from the AI to highlight a float
  useEffect(() => {
      const highlightAction = actions.find(a => a.type === 'HIGHLIGHT_FLOAT');
      if (highlightAction) {
          const wmo_id = highlightAction.payload.wmo_id;
          const floatToHighlight = floats.find(f => f.wmo_id === wmo_id);
          if(floatToHighlight) {
            setHighlightedFloatId(floatToHighlight.id);
            // Remove the highlight after 5 seconds
            setTimeout(() => setHighlightedFloatId(null), 5000);
          }
      }
  }, [actions, floats]);


  const landStyle = {
    fillColor: '#111827',
    weight: 0.5,
    color: '#374151',
    fillOpacity: 1,
  };
  
  // Helper function to format the timestamp for readability
  const formatTimestamp = (ts: string | null) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
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
          background-color: #1a2c38e6; /* Added some opacity */
          color: #e2e8f0;
          border: 1px solid #00ffff80;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
        }
        .leaflet-popup-tip { background-color: #1a2c38; }
        .leaflet-popup-close-button { color: #e2e8f0 !important; }

        /* Highlight animation for the float */
        .highlighted-float .sonar-emitter {
            animation: highlight-pulse 2s infinite;
        }
        @keyframes highlight-pulse {
            0% { box-shadow: 0 0 12px #00ffff, 0 0 20px #00ffff; }
            50% { box-shadow: 0 0 20px #ffffff, 0 0 30px #ffffff; }
            100% { box-shadow: 0 0 12px #00ffff, 0 0 20px #00ffff; }
        }

        /* --- NEW STYLES for Popup Content --- */
        .map-popup h3 {
          font-size: 16px; font-weight: bold; color: #ffffff;
          margin: 0 0 8px 0; padding-bottom: 6px;
          border-bottom: 1px solid #00ffff50;
        }
        .map-popup p { margin: 4px 0; }
        .map-popup strong { color: #00ffff; }
        .map-popup hr { border: none; border-top: 1px solid #00ffff50; margin: 8px 0; }
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
        ref={mapRef}
      >
        <MapSetup />

        {landData && <GeoJSON data={landData} style={landStyle} />}
        
        {/* This new layer adds the city and country names */}
        <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            pane="labels"
        />
        
        {floats.map((float) => {
            const isHighlighted = float.id === highlightedFloatId;
            const icon = L.divIcon({
                className: `pulsing-icon-container ${isHighlighted ? 'highlighted-float' : ''}`,
                html: `<div class="pulsing-icon"><div class="sonar-emitter"></div><div class="sonar-wave"></div></div>`,
                iconSize: [15, 15], iconAnchor: [7.5, 7.5], popupAnchor: [0, -9]
            });
            return (
              <Marker key={float.id} position={[float.latitude, float.longitude]} icon={icon}>
                {/* --- UPDATED POPUP SECTION --- */}
                <Popup>
                  <div className="map-popup">
                    <h3>ARGO Float Details</h3>
                    <p><strong>ARGO ID:</strong> {float.wmo_id}</p>
                    <p><strong>Region:</strong> {float.region || 'N/A'}</p>
                    <p><strong>Last Seen:</strong> {formatTimestamp(float.last_seen)}</p>
                    <hr/>
                    <p><strong>Temp:</strong> {float.latest_temperature?.toFixed(1) ?? 'N/A'} °C</p>
                    <p><strong>Pressure:</strong> {float.latest_pressure?.toFixed(1) ?? 'N/A'} dbar</p>
                  </div>
                </Popup>
              </Marker>
            );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;