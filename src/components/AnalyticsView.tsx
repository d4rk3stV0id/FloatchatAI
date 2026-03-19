import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Wind, Thermometer, Sunrise, Sunset, Navigation, Sailboat, Waves, Fish, Filter, Flower2, Droplets, BarChart3 } from 'lucide-react';
import { useFloats, useMarineForecast, Float } from '@/lib/dataHooks';
import { T } from '@/contexts/LanguageContexts'; // Corrected import path
import { MapContainer, TileLayer, Marker, Tooltip, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Helper functions to derive insights ---
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

const getMarineLifeHealth = (temperature: number | null) => {
  if (temperature === null) return { rating: "N/A", icon: Fish, color: "text-gray-400" };
  if (temperature < 18 || temperature > 30) return { rating: "Stressed", icon: Fish, color: "text-red-400" };
  if (temperature >= 20 && temperature <= 28) return { rating: "Thriving", icon: Fish, color: "text-green-400" };
  return { rating: "Good", icon: Fish, color: "text-cyan-400" };
};

const getCoralBleachingRisk = (temperature: number | null) => {
  if (temperature === null) return { rating: "N/A", icon: Flower2, color: "text-gray-400" };
  if (temperature > 29.5) return { rating: "High Risk", icon: Flower2, color: "text-red-400" };
  if (temperature > 28) return { rating: "Moderate Risk", icon: Flower2, color: "text-yellow-400" };
  return { rating: "Low Risk", icon: Flower2, color: "text-green-400" };
};

const MiniMap: React.FC<{ floats: Float[], onSelectFloat: (float: Float) => void, selectedFloatId: number | null }> = ({ floats, onSelectFloat, selectedFloatId }) => {
  const [landData, setLandData] = useState<any>(null);
  useEffect(() => { fetch('/land.geojson').then(res => res.json()).then(data => setLandData(data)); }, []);
  const landStyle = { fillColor: '#111827', weight: 0.5, color: '#374151', fillOpacity: 1 };
  
  return (
    <MapContainer 
      center={[10, 80]} 
      zoom={4} 
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem', backgroundColor: '#001f3f' }} 
      scrollWheelZoom={false} 
      zoomControl={false}
      // --- ZOOM FIX IS HERE ---
      doubleClickZoom={false}
      dragging={false}
    >
      {landData && <GeoJSON data={landData} style={landStyle} />}
      {floats?.map(float => {
        const isSelected = float.id === selectedFloatId;
        const icon = L.divIcon({
          className: `pulsing-icon-container ${isSelected ? 'selected' : ''}`,
          html: `<div class="pulsing-icon"><div class="sonar-emitter"></div><div class="sonar-wave"></div></div>`,
          iconSize: isSelected ? [20, 20] : [15, 15],
          iconAnchor: isSelected ? [10, 10] : [7.5, 7.5],
        });
        
        return (
          <Marker key={float.id} position={[float.latitude, float.longitude]} icon={icon} eventHandlers={{ click: () => onSelectFloat(float) }}>
            <Tooltip><T>ARGO ID</T>: {float.wmo_id}</Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

const InsightCard: React.FC<{ title: string; data: { rating: string; icon: React.ElementType; color: string; } }> = ({ title, data }) => (
    <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center text-center h-full">
        <data.icon className={`h-8 w-8 mb-2 ${data.color}`} />
        <p className={`text-xl font-bold ${data.color}`}><T>{data.rating}</T></p>
        <p className="text-xs text-muted-foreground"><T>{title}</T></p>
    </div>
);

const AnalyticsView: React.FC = () => {
  const [selectedFloat, setSelectedFloat] = useState<Float | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  
  const { data: floats, isLoading: isLoadingFloats } = useFloats();
  const location = selectedFloat ? { lat: selectedFloat.latitude, lon: selectedFloat.longitude } : null;
  const { data: forecast, isLoading: isLoadingForecast, error } = useMarineForecast(location);

  useEffect(() => {
    setSelectedDayIndex(0);
  }, [selectedFloat]);

  const formatTime = (timestamp: number) => new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const getDay = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'short' });

  const sailingConditions = forecast ? getSailingConditions(forecast.current.wind_speed * 3.6) : null;
  const surfability = forecast ? getSurfability(forecast.current.wind_speed * 3.6) : null;
  const marineLifeHealth = selectedFloat ? getMarineLifeHealth(selectedFloat.latest_temperature) : null;
  const coralRisk = selectedFloat ? getCoralBleachingRisk(selectedFloat.latest_temperature) : null;

  return (
    <div className="h-full w-full overflow-y-auto p-8 animate-fade-in-up bg-gradient-to-br from-background via-ocean-surface/10 to-background">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-ocean-gradient rounded-2xl shadow-lg animate-ocean-pulse">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-ocean-primary to-ocean-accent bg-clip-text text-transparent">
              <T>Insights & Predictions</T>
            </h1>
            <p className="text-muted-foreground text-lg"><T>Select a float to view real-time marine forecasts and alerts.</T></p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{height: 'calc(100% - 120px)'}}>
        <Card className="card-shadow border-ocean-primary/20 h-full p-0 overflow-hidden bg-card/95 backdrop-blur-xl shadow-2xl">
          <div className="p-6 border-b border-ocean-primary/10 bg-gradient-to-r from-ocean-primary/5 to-ocean-accent/5">
            <h3 className="text-xl font-bold text-ocean-primary mb-2">Interactive Ocean Map</h3>
            <p className="text-sm text-muted-foreground">Click any ARGO float to explore its location and data</p>
          </div>
          {isLoadingFloats ? (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-ocean-surface/20 to-ocean-deep/5">
              <Loader2 className="h-12 w-12 animate-spin text-ocean-primary mb-4" />
              <p className="text-ocean-primary font-medium">Loading ocean data...</p>
            </div>
          ) : (
            <div className="h-full overflow-hidden rounded-b-lg">
              <MiniMap floats={floats || []} onSelectFloat={setSelectedFloat} selectedFloatId={selectedFloat?.id || null} />
            </div>
          )}
        </Card>

        <div className="h-full flex flex-col">
          <Tabs defaultValue="forecast" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-card/90 backdrop-blur-sm border border-ocean-primary/20 shadow-lg">
              <TabsTrigger value="forecast" className="data-[state=active]:bg-ocean-primary/20 data-[state=active]:text-ocean-primary font-medium">
                <T>Forecast</T>
              </TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-ocean-primary/20 data-[state=active]:text-ocean-primary font-medium">
                <T>Derived Insights</T>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="forecast" className="flex-1 mt-6">
              <Card className="card-shadow border-ocean-primary/20 h-full flex flex-col bg-card/95 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  {selectedFloat ? (
                    <>
                      <CardTitle><T>ARGO ID</T>: {selectedFloat.wmo_id}</CardTitle>
                      <CardDescription>
                        <T>Region</T>: {selectedFloat.region || 'N/A'} | Lat: {selectedFloat.latitude.toFixed(2)}, Lon: {selectedFloat.longitude.toFixed(2)}
                      </CardDescription>
                    </>
                  ) : (
                    <>
                      <CardTitle><T>Marine Weather Forecast</T></CardTitle>
                      <CardDescription><T>Live forecast for the selected float location.</T></CardDescription>
                    </>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center">
                  {isLoadingForecast && <Loader2 className="h-10 w-10 animate-spin text-ocean-primary" />}
                  {error && <div className="text-destructive text-center"><T>Could not load forecast.</T><p className="text-xs">{error.message}</p></div>}
                  {!selectedFloat && !isLoadingForecast && !error && (
                      <div className="text-center text-muted-foreground">
                          <Navigation className="mx-auto h-12 w-12 mb-4" />
                          <p className="font-semibold"><T>Select a float on the map</T></p>
                          <p className="text-sm"><T>Click any pulsing dot to view its forecast.</T></p>
                      </div>
                  )}
                  {forecast && (
                    <div className="w-full h-full flex flex-col space-y-4 animate-fade-in">
                      <div className="grid grid-cols-5 gap-2 text-center">
                          {forecast.daily.slice(0, 5).map((day, index) => (
                              <button key={index} onClick={() => setSelectedDayIndex(index)} className={`p-2 rounded-lg transition-colors ${selectedDayIndex === index ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                                  <p className="font-semibold text-sm">{getDay(day.dt)}</p>
                                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt={day.weather[0].description} className="mx-auto h-10 w-10"/>
                                  <p className="text-xs font-bold">{day.temp.max.toFixed(0)}° / {day.temp.min.toFixed(0)}°</p>
                              </button>
                          ))}
                      </div>
                      <Card className="flex-1 card-shadow border-border/20">
                        <CardHeader>
                            <CardTitle className="text-lg"><T>Details for</T> {getDay(forecast.daily[selectedDayIndex].dt)}</CardTitle>
                            <CardDescription className="capitalize">{forecast.daily[selectedDayIndex].weather[0].description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-red-400" /><p><T>High</T>: <span className="font-semibold">{forecast.daily[selectedDayIndex].temp.max.toFixed(1)}°C</span></p></div>
                            <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-blue-400" /><p><T>Low</T>: <span className="font-semibold">{forecast.daily[selectedDayIndex].temp.min.toFixed(1)}°C</span></p></div>
                            <div className="flex items-center gap-2"><Wind className="h-4 w-4 text-cyan-400" /><p><T>Wind</T>: <span className="font-semibold">{(forecast.daily[selectedDayIndex].wind_speed * 3.6).toFixed(1)} km/h</span></p></div>
                            <div className="flex items-center gap-2"><Droplets className="h-4 w-4 text-indigo-400" /><p><T>Humidity</T>: <span className="font-semibold">{forecast.daily[selectedDayIndex].humidity}%</span></p></div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="flex-1 mt-6">
                <Card className="card-shadow border-ocean-primary/20 h-full flex flex-col bg-card/95 backdrop-blur-xl shadow-2xl">
                    <CardHeader><CardTitle><T>Derived Insights</T></CardTitle><CardDescription><T>Actionable intelligence based on forecast and float data.</T></CardDescription></CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center">
                        {isLoadingForecast && <Loader2 className="h-10 w-10 animate-spin text-ocean-primary" />}
                        {error && <div className="text-destructive text-center"><T>Could not derive insights.</T></div>}
                        {!selectedFloat && !isLoadingForecast && !error && <div className="text-center text-muted-foreground"><Navigation className="mx-auto h-12 w-12 mb-4" /><p className="font-semibold"><T>Select a float on the map</T></p></div>}
                        {forecast && selectedFloat && (
                            <div className="w-full grid grid-cols-2 gap-4 animate-fade-in h-full">
                                {sailingConditions && <InsightCard title="Sailing Conditions" data={sailingConditions} />}
                                {surfability && <InsightCard title="Surfability" data={surfability} />}
                                {marineLifeHealth && <InsightCard title="Marine Life Health" data={marineLifeHealth} />}
                                {coralRisk && <InsightCard title="Coral Bleaching Risk" data={coralRisk} />}
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