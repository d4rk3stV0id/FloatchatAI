// src/components/AnalyticsView.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Wind, Thermometer, Sunrise, Sunset, Navigation, Sailboat, Waves } from 'lucide-react';
import { useFloats, useMarineForecast } from '@/lib/dataHooks';
import { T } from '@/contexts/LanguageContexts';
import { MapContainer, TileLayer, Marker, Tooltip, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Helper functions to derive insights from weather data ---
const getSailingConditions = (windSpeedKmh: number) => {
  if (windSpeedKmh < 5) return { rating: "Becalmed", icon: Sailboat, color: "text-gray-400" };
  if (windSpeedKmh <= 25) return { rating: "Good", icon: Sailboat, color: "text-green-400" };
  if (windSpeedKmh <= 40) return { rating: "Challenging", icon: Sailboat, color: "text-yellow-400" };
  return { rating: "Hazardous", icon: Sailboat, color: "text-red-400" };
};

const getSurfability = (windSpeedKmh: number) => {
    if (windSpeedKmh < 20) return { rating: "Good", icon: Waves, color: "text-cyan-400" };
    if (windSpeedKmh <= 35) return { rating: "Choppy", icon: Waves, color: "text-yellow-400" };
    return { rating: "Poor", icon: Waves, color: "text-red-400" };
};

const MiniMap: React.FC<{ floats: any[], onSelectFloat: (location: { lat: number; lon: number }) => void }> = ({ floats, onSelectFloat }) => {
  // ... (MiniMap component remains the same)
  const [landData, setLandData] = useState<any>(null);
  useEffect(() => { fetch('/land.geojson').then(res => res.json()).then(data => setLandData(data)); }, []);
  const landStyle = { fillColor: '#111827', weight: 0.5, color: '#374151', fillOpacity: 1 };
  const pulsingIcon = L.divIcon({ className: 'pulsing-icon-container', html: `<div class="pulsing-icon"><div class="sonar-emitter"></div><div class="sonar-wave"></div></div>`, iconSize: [15, 15], iconAnchor: [7.5, 7.5] });
  return (
    <MapContainer center={[10, 80]} zoom={4} style={{ height: '100%', width: '100%', borderRadius: '0.75rem', backgroundColor: '#001f3f' }} scrollWheelZoom={false} zoomControl={false}>
      {landData && <GeoJSON data={landData} style={landStyle} />}
      {floats?.map(float => (
        <Marker key={float.id} position={[float.latitude, float.longitude]} icon={pulsingIcon} eventHandlers={{ click: () => onSelectFloat({ lat: float.latitude, lon: float.longitude }) }}>
          <Tooltip><T>ARGO ID</T>: {float.wmo_id}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

// Reusable Insight Card component
const InsightCard: React.FC<{ title: string; data: { rating: string; icon: React.ElementType; color: string; } }> = ({ title, data }) => (
    <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center text-center">
        <data.icon className={`h-8 w-8 mb-2 ${data.color}`} />
        <p className={`text-xl font-bold ${data.color}`}>{data.rating}</p>
        <p className="text-xs text-muted-foreground"><T>{title}</T></p>
    </div>
);


const AnalyticsView: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
  const { data: floats, isLoading: isLoadingFloats } = useFloats();
  const { data: forecast, isLoading: isLoadingForecast, error } = useMarineForecast(selectedLocation);

  const formatTime = (timestamp: number) => new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const getDay = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'short' });

  // Calculate derived insights when forecast data is available
  const sailingConditions = forecast ? getSailingConditions(forecast.current.wind_speed * 3.6) : null;
  const surfability = forecast ? getSurfability(forecast.current.wind_speed * 3.6) : null;

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2"><T>Insights & Predictions</T></h1>
        <p className="text-muted-foreground"><T>Select a float to view real-time marine forecasts and alerts.</T></p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{height: 'calc(100% - 90px)'}}>
        <Card className="card-shadow border-border/20 h-full p-0 overflow-hidden">
          {isLoadingFloats ? <div className="flex items-center justify-center h-full"><Loader2 className="h-10 w-10 animate-spin text-ocean-primary" /></div> : <MiniMap floats={floats || []} onSelectFloat={setSelectedLocation} />}
        </Card>

        <div className="h-full flex flex-col">
          <Tabs defaultValue="forecast" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="forecast"><T>Forecast</T></TabsTrigger>
              <TabsTrigger value="insights"><T>Derived Insights</T></TabsTrigger>
            </TabsList>
            
            <TabsContent value="forecast" className="flex-1">
              <Card className="card-shadow border-border/20 h-full flex flex-col">
                <CardHeader><CardTitle><T>Marine Weather Forecast</T></CardTitle><CardDescription><T>Live forecast for the selected float location.</T></CardDescription></CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center">
                  {isLoadingForecast && <Loader2 className="h-10 w-10 animate-spin text-ocean-primary" />}
                  {error && <div className="text-destructive text-center"><T>Could not load forecast.</T><p className="text-xs">{error.message}</p></div>}
                  {!selectedLocation && !isLoadingForecast && !error && <div className="text-center text-muted-foreground"><Navigation className="mx-auto h-12 w-12 mb-4" /><p className="font-semibold"><T>Select a float on the map</T></p></div>}
                  {forecast && (
                    <div className="w-full space-y-6 animate-fade-in">
                      <div>
                        <h3 className="font-semibold mb-2 text-sm text-muted-foreground"><T>Current Conditions</T></h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="p-2 bg-muted/50 rounded-lg"><Thermometer className="mx-auto mb-1 h-5 w-5 text-red-400" /><p className="font-bold">{forecast.current.temp.toFixed(1)}°C</p><p className="text-xs text-muted-foreground"><T>Temp</T></p></div>
                          <div className="p-2 bg-muted/50 rounded-lg"><Wind className="mx-auto mb-1 h-5 w-5 text-cyan-400" /><p className="font-bold">{(forecast.current.wind_speed * 3.6).toFixed(1)} km/h</p><p className="text-xs text-muted-foreground"><T>Wind</T></p></div>
                          <div className="p-2 bg-muted/50 rounded-lg"><Sunrise className="mx-auto mb-1 h-5 w-5 text-yellow-400" /><p className="font-bold">{formatTime(forecast.current.sunrise)}</p><p className="text-xs text-muted-foreground"><T>Sunrise</T></p></div>
                          <div className="p-2 bg-muted/50 rounded-lg"><Sunset className="mx-auto mb-1 h-5 w-5 text-orange-400" /><p className="font-bold">{formatTime(forecast.current.sunset)}</p><p className="text-xs text-muted-foreground"><T>Sunset</T></p></div>
                        </div>
                      </div>
                      <div>
                          <h3 className="font-semibold mb-2 text-sm text-muted-foreground"><T>5-Day Forecast</T></h3>
                          <div className="grid grid-cols-5 gap-2 text-center">
                              {forecast.daily.slice(0, 5).map((day, index) => (
                                  <div key={index} className="p-2 bg-muted/50 rounded-lg">
                                      <p className="font-semibold text-sm">{getDay(day.dt)}</p>
                                      <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt={day.weather[0].description} className="mx-auto h-8 w-8"/>
                                      <p className="text-xs font-bold">{day.temp.max.toFixed(0)}° / {day.temp.min.toFixed(0)}°</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="flex-1">
                <Card className="card-shadow border-border/20 h-full flex flex-col">
                    <CardHeader><CardTitle><T>Derived Insights</T></CardTitle><CardDescription><T>Actionable intelligence based on forecast data.</T></CardDescription></CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center">
                        {isLoadingForecast && <Loader2 className="h-10 w-10 animate-spin text-ocean-primary" />}
                        {error && <div className="text-destructive text-center"><T>Could not derive insights.</T></div>}
                        {!selectedLocation && !isLoadingForecast && !error && <div className="text-center text-muted-foreground"><Navigation className="mx-auto h-12 w-12 mb-4" /><p className="font-semibold"><T>Select a float on the map</T></p></div>}
                        {forecast && sailingConditions && surfability && (
                            <div className="w-full grid grid-cols-2 gap-6 animate-fade-in">
                                <InsightCard title="Sailing Conditions" data={sailingConditions} />
                                <InsightCard title="Surfability" data={surfability} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;