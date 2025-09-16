import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Calendar, Globe, ArrowUp, ArrowDown, Loader2, Thermometer, Wind, ShieldAlert } from 'lucide-react';
import { useDashboardAnalytics } from '@/lib/dataHooks';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { T } from '@/contexts/LanguageContexts';

// --- Helper function to determine cyclone risk based on temperature ---
const getCycloneRisk = (avgTemp: number) => {
    // Simplified model: risk increases significantly above 26.5°C
    if (avgTemp > 28.5) return { level: "High", color: "text-red-400", icon: ShieldAlert };
    if (avgTemp > 27.5) return { level: "Elevated", color: "text-yellow-400", icon: Wind };
    if (avgTemp > 26.5) return { level: "Moderate", color: "text-orange-400", icon: Wind };
    return { level: "Low", color: "text-green-400", icon: Wind };
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg">
                <p className="font-bold text-foreground">{label}</p>
                <p className="text-sm text-cyan-400"><T>Avg. Temp</T>: {payload[0].value.toFixed(1)}°C</p>
            </div>
        );
    }
    return null;
};

const TrendsView: React.FC = () => {
    const { data, isLoading, error } = useDashboardAnalytics();

    const tempTrend = data?.temp_trend ?? 0;
    const trendColor = tempTrend > 0 ? 'text-green-400' : tempTrend < 0 ? 'text-red-400' : 'text-muted-foreground';
    
    const overallAvgTemp = data?.global_avg_temp;
    const indianOceanTemp = data?.regional_temps?.find((r: any) => r.region === 'Indian')?.avg_temp ?? 0;
    const cycloneRisk = getCycloneRisk(indianOceanTemp);

    if (isLoading) return <div className="h-full w-full flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
    if (error) return <div className="h-full w-full flex items-center justify-center text-destructive"><T>Error loading trends</T>: {error.message}</div>;
    
    return (
        <div className="h-full w-full overflow-y-auto p-6 md:p-8 animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1"><T>Global Ocean Trends</T></h1>
                <p className="text-muted-foreground"><T>Strategic overview of long-term climate and marine patterns.</T></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- Key Insight Cards --- */}
                <Card className="card-shadow border-border/20 bg-gradient-to-br from-ocean-primary/20 to-transparent">
                    <CardHeader><CardTitle className="text-muted-foreground text-sm font-medium"><T>Global 7-Day Trend</T></CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-center gap-4">
                        {/* --- FIX: Reduced font and icon sizes for a more subtle look --- */}
                        <div className={`flex items-center gap-2 text-3xl font-bold ${trendColor}`}>
                            {tempTrend > 0 && <ArrowUp className="h-8 w-8" />}
                            {tempTrend < 0 && <ArrowDown className="h-8 w-8" />}
                            <span>{tempTrend > 0 ? <T>Warmer</T> : tempTrend < 0 ? <T>Cooler</T> : <T>Stable</T>}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-shadow border-border/20 bg-gradient-to-br from-ocean-primary/20 to-transparent">
                    <CardHeader><CardTitle className="text-muted-foreground text-sm font-medium"><T>Annual Average Temp.</T></CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-center gap-3">
                        <Thermometer className="h-8 w-8 text-cyan-400" />
                        <span className="text-4xl font-bold text-foreground">{overallAvgTemp?.toFixed(1)}°C</span>
                    </CardContent>
                </Card>

                <Card className="card-shadow border-border/20 bg-gradient-to-br from-ocean-primary/20 to-transparent">
                     <CardHeader><CardTitle className="text-muted-foreground text-sm font-medium"><T>Cyclone Likeliness (Indian Ocean)</T></CardTitle></CardHeader>
                     <CardContent className="flex items-center justify-center gap-3">
                        <cycloneRisk.icon className={`h-8 w-8 ${cycloneRisk.color}`} />
                        <span className={`text-3xl font-bold ${cycloneRisk.color}`}>{cycloneRisk.level}</span>
                     </CardContent>
                </Card>

                {/* --- Main Seasonal Chart --- */}
                <Card className="card-shadow border-border/20 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-cyan-400" /> <T>Global Seasonal Temperature Pattern</T></CardTitle>
                        <CardDescription><T>Average sea surface temperature over the last 12 months.</T></CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.seasonal_pattern || []} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs><linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0891b2" stopOpacity={0.6}/><stop offset="95%" stopColor="#0891b2" stopOpacity={0}/></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false}/>
                                <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(value) => `${value}°C`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 255, 255, 0.2)', strokeWidth: 1 }}/>
                                {overallAvgTemp && <ReferenceLine y={overallAvgTemp} label={{ value: `Annual Avg (${overallAvgTemp.toFixed(1)}°C)`, position: 'insideTopLeft', fill: '#a0a0a0', fontSize: 12 }} stroke="#a0a0a0" strokeDasharray="4 4" />}
                                <Area type="monotone" dataKey="avg_temp" stroke="#06b6d4" strokeWidth={2} fill="url(#colorTemp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* --- NEW: Global Heat Index Card --- */}
                <Card className="card-shadow border-border/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-cyan-400" /> <T>Global Heat Index</T></CardTitle>
                        <CardDescription><T>Regional temperature anomaly vs. global average.</T></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!data?.regional_temps || !Array.isArray(data.regional_temps) || data.regional_temps.length === 0 ? (
                            <div className="text-center text-muted-foreground p-4"><T>No regional data available.</T></div>
                        ) : (
                            data.regional_temps.map((region: any, index: number) => {
                                const anomaly = region.avg_temp - (overallAvgTemp ?? region.avg_temp);
                                const anomalyColor = anomaly > 0.5 ? 'bg-red-500/80' : anomaly < -0.5 ? 'bg-blue-500/80' : 'bg-green-500/80';
                                return (
                                    <div key={index} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold">{region.region} <T>Ocean</T></h4>
                                            <p className="text-xs text-muted-foreground">{region.avg_temp.toFixed(1)}°C <T>Average</T></p>
                                        </div>
                                        <div className={`text-lg font-bold px-3 py-1 rounded-md ${anomalyColor} text-white`}>
                                            {anomaly.toFixed(1)}°
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default TrendsView;

