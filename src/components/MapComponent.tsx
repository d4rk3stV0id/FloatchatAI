import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AIAction } from '@/pages/Dashboard';
import { Float } from '@/lib/dataHooks';

interface MapComponentProps {
  floats: Float[];
  actions: AIAction[];
  mapRef: React.RefObject<any>;
}

const MapSetup = () => {
  const map = useMap();
  useEffect(() => {
    map.createPane('labels');
    const pane = map.getPane('labels');
    if (pane) {
      pane.style.zIndex = "650";
      pane.style.pointerEvents = 'none';
    }
  }, [map]);
  return null;
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
  
  useEffect(() => {
      const highlightAction = actions.find(a => a.type === 'HIGHLIGHT_FLOAT');
      if (highlightAction) {
          const wmo_id = highlightAction.payload.wmo_id;
          const floatToHighlight = floats.find(f => f.wmo_id === wmo_id);
          if(floatToHighlight) {
            setHighlightedFloatId(floatToHighlight.id);
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
    // The main container is now a CSS Grid for stable layering.
    <div style={{ display: 'grid', height: '100%', width: '100%' }}>
      
      {/* The video background, layered underneath */}
      <div style={{ gridArea: '1 / 1 / 2 / 2', zIndex: 1, overflow: 'hidden', backgroundColor: '#001f3f' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="/ocean-bg.mp4"
        />
      </div>
      
      {/* The map, layered on top with a transparent background */}
      <div style={{ gridArea: '1 / 1 / 2 / 2', zIndex: 2 }}>
          <MapContainer 
            center={mapCenter} 
            zoom={4} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }} // No longer needs transparent bg here
            ref={mapRef}
          >
            <MapSetup />
            {landData && <GeoJSON data={landData} style={landStyle} />}
            
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
    </div>
  );
};

export default MapComponent;