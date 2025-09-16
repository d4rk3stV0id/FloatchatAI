import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMetricsData } from '@/lib/dataHooks';
import { Thermometer, Droplet, Gauge, Loader2, Layers, Signal } from 'lucide-react';
import { T } from '@/contexts/LanguageContexts'; // Corrected import path

// Add the new metric options to the type
type MetricParameter = 'temperature' | 'salinity' | 'pressure' | 'density' | 'speed_of_sound';

const ProfessionalMetricsView: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState<MetricParameter>('temperature');
  const { data: metricsData, isLoading, error } = useMetricsData();

  // Add configuration for the new parameters
  const parameterConfig = {
    temperature: { label: 'Temperature', unit: '°C', color: '#06b6d4', icon: Thermometer },
    salinity: { label: 'Salinity', unit: 'PSU', color: '#34d399', icon: Droplet },
    pressure: { label: 'Pressure', unit: 'dbar', color: '#a855f7', icon: Gauge },
    density: { label: 'Sea Water Density', unit: 'kg/m³', color: '#f59e0b', icon: Layers },
    speed_of_sound: { label: 'Speed of Sound', unit: 'm/s', color: '#ef4444', icon: Signal },
  };

  const currentConfig = parameterConfig[selectedParameter];
  const currentStats = metricsData?.stats?.[selectedParameter];

  const formatValue = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return 'N/A';
    return `${value.toFixed(2)} ${currentConfig.unit}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{formatDate(label)}</p>
          <p className="text-sm" style={{ color: currentConfig.color }}>
            <T>{currentConfig.label}</T>: {formatValue(payload[0].value as number)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-ocean-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-destructive">
        <T>Error loading metrics data</T>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 bg-background animate-fade-in-up">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <T>Professional Metrics</T>
          </h1>
          <p className="text-muted-foreground">
            <T>Interactive analysis of key oceanographic parameters</T>
          </p>
        </div>

        <div className="w-64 mb-8">
          <Select value={selectedParameter} onValueChange={(value: MetricParameter) => setSelectedParameter(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="temperature"><div className="flex items-center gap-2"><Thermometer className="h-4 w-4" style={{ color: parameterConfig.temperature.color }} /><T>Temperature</T></div></SelectItem>
              <SelectItem value="salinity"><div className="flex items-center gap-2"><Droplet className="h-4 w-4" style={{ color: parameterConfig.salinity.color }} /><T>Salinity</T></div></SelectItem>
              <SelectItem value="pressure"><div className="flex items-center gap-2"><Gauge className="h-4 w-4" style={{ color: parameterConfig.pressure.color }} /><T>Pressure</T></div></SelectItem>
              <SelectItem value="density"><div className="flex items-center gap-2"><Layers className="h-4 w-4" style={{ color: parameterConfig.density.color }} /><T>Sea Water Density</T></div></SelectItem>
              <SelectItem value="speed_of_sound"><div className="flex items-center gap-2"><Signal className="h-4 w-4" style={{ color: parameterConfig.speed_of_sound.color }} /><T>Speed of Sound</T></div></SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-shadow border-border/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium"><T>Average</T> <T>{currentConfig.label}</T></CardTitle><currentConfig.icon className="h-4 w-4" style={{ color: currentConfig.color }} /></CardHeader>
            <CardContent><div className="text-2xl font-bold" style={{ color: currentConfig.color }}>{formatValue(currentStats?.avg)}</div></CardContent>
          </Card>
          <Card className="card-shadow border-border/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium"><T>Maximum</T> <T>{currentConfig.label}</T></CardTitle><currentConfig.icon className="h-4 w-4" style={{ color: currentConfig.color }} /></CardHeader>
            <CardContent><div className="text-2xl font-bold" style={{ color: currentConfig.color }}>{formatValue(currentStats?.max)}</div></CardContent>
          </Card>
          <Card className="card-shadow border-border/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium"><T>Minimum</T> <T>{currentConfig.label}</T></CardTitle><currentConfig.icon className="h-4 w-4" style={{ color: currentConfig.color }} /></CardHeader>
            <CardContent><div className="text-2xl font-bold" style={{ color: currentConfig.color }}>{formatValue(currentStats?.min)}</div></CardContent>
          </Card>
        </div>

        <Card className="col-span-full card-shadow border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><currentConfig.icon className="h-5 w-5" style={{ color: currentConfig.color }} /><T>{currentConfig.label} Time Series</T></CardTitle>
            <CardDescription><T>Historical data trends over time</T></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsData?.timeseries || []}>
                  <defs>
                    <linearGradient id={`gradient-${selectedParameter}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.6}/>
                      <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={formatDate} className="text-muted-foreground" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis label={{ value: `${currentConfig.label} (${currentConfig.unit})`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }} className="text-muted-foreground" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey={selectedParameter} stroke={currentConfig.color} strokeWidth={2} fill={`url(#gradient-${selectedParameter})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalMetricsView;