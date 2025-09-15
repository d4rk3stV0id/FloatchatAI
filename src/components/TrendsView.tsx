// components/TrendsView.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Globe, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { useDashboardAnalytics } from '@/lib/dataHooks';
import {
  AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, ComposedChart
} from 'recharts';

// A small component for the custom tooltip on the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg">
        <p className="font-bold text-foreground">{`${label}`}</p>
        <p className="text-sm text-cyan-400">{`Avg. Temp: ${payload[0].value.toFixed(1)}°C`}</p>
      </div>
    );
  }
  return null;
};

const TrendsView: React.FC = () => {
  const { data, isLoading, error } = useDashboardAnalytics();

  const tempTrend = data?.temp_trend ?? 0;
  const trendColor = tempTrend > 0 ? 'text-green-500' : tempTrend < 0 ? 'text-red-500' : 'text-muted-foreground';
  
  // Calculate the overall average temperature to use as a reference line on the chart
  const overallAvgTemp = data?.global_avg_temp;

  if (isLoading) {
    return <div className="h-full w-full flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  if (error) {
    return <div className="h-full w-full flex items-center justify-center text-destructive">Error loading trends: {error.message}</div>;
  }
  
  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Ocean Trends</h1>
        <p className="text-muted-foreground">Long-term patterns and seasonal variations</p>
      </div>

      {/* --- NEW LAYOUT: Main chart is featured, secondary cards are below --- */}
      <div className="flex flex-col gap-6">

        {/* --- HERO CARD: Seasonal Temperature Pattern --- */}
        <Card className="card-shadow border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              Seasonal Temperature Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                        data={data?.seasonal_pattern}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false}/>
                        <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(value) => `${value}°C`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 255, 255, 0.2)', strokeWidth: 1 }}/>
                        {overallAvgTemp && (
                            <ReferenceLine y={overallAvgTemp} label={{ value: 'Annual Avg', position: 'insideTopLeft', fill: '#a0a0a0', fontSize: 12 }} stroke="#a0a0a0" strokeDasharray="4 4" />
                        )}
                        <Area type="monotone" dataKey="avg_temp" stroke="none" fill="url(#colorTemp)" />
                        <Line type="monotone" dataKey="avg_temp" name="Avg. Temp" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: '#06b6d4' }} activeDot={{ r: 6, stroke: '#fff' }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* --- Secondary Cards Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* --- Regional Temps Card (takes 2/3 width) --- */}
            <Card className="card-shadow border-border/20 lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-cyan-400" />
                        Regional Average Temperatures
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {!data?.regional_temps || data.regional_temps.length === 0 ? (
                        <div className="col-span-3 text-center text-muted-foreground p-4">No regional data available.</div>
                    ) : (
                        data.regional_temps.map((region: any, index: number) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-medium mb-1 text-sm text-muted-foreground">{region.region} Ocean</h4>
                            <div className="text-2xl font-bold text-cyan-400">{region.avg_temp.toFixed(1)}°C</div>
                        </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* --- Temperature Trend Card (takes 1/3 width) --- */}
            <Card className="card-shadow border-border/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    7-Day Trend
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full gap-2">
                    <div className={`flex items-center gap-2 ${trendColor}`}>
                        {tempTrend > 0 && <ArrowUp className="h-8 w-8" />}
                        {tempTrend < 0 && <ArrowDown className="h-8 w-8" />}
                        <span className="text-3xl font-bold">
                            {tempTrend > 0 ? 'Warmer' : tempTrend < 0 ? 'Cooler' : 'Stable'}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Global Average vs. Last Week</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default TrendsView;