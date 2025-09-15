import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMetricsData } from '@/lib/dataHooks';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { T } from '@/contexts/LanguageContexts';

type MetricParameter = 'temperature' | 'salinity' | 'pressure';

const ProfessionalMetricsView: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState<MetricParameter>('temperature');
  const { data: metricsData, isLoading, error } = useMetricsData();

  const parameterConfig = {
    temperature: {
      label: 'Temperature',
      unit: '°C',
      color: 'hsl(var(--chart-1))',
      icon: Activity
    },
    salinity: {
      label: 'Salinity',
      unit: 'PSU',
      color: 'hsl(var(--chart-2))',
      icon: TrendingUp
    },
    pressure: {
      label: 'Pressure',
      unit: 'dbar',
      color: 'hsl(var(--chart-3))',
      icon: BarChart3
    }
  };

  const currentConfig = parameterConfig[selectedParameter];
  const currentStats = metricsData?.stats?.[selectedParameter];

  const formatValue = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(2)} ${currentConfig.unit}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <T>Loading metrics data...</T>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-destructive">
          <T>Error loading metrics data</T>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-background animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <T>Professional Metrics</T>
          </h1>
          <p className="text-muted-foreground">
            <T>Interactive analysis of key oceanographic parameters</T>
          </p>
        </div>

        {/* Parameter Selector */}
        <div className="w-64">
          <Select value={selectedParameter} onValueChange={(value: MetricParameter) => setSelectedParameter(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="temperature">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <T>Temperature</T>
                </div>
              </SelectItem>
              <SelectItem value="salinity">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <T>Salinity</T>
                </div>
              </SelectItem>
              <SelectItem value="pressure">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <T>Pressure</T>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <T>{`Average ${currentConfig.label}`}</T>
              </CardTitle>
              <currentConfig.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(currentStats?.avg)}</div>
              <CardDescription>
                <T>The average value for the selected metric</T>
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <T>{`Maximum ${currentConfig.label}`}</T>
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(currentStats?.max)}</div>
              <CardDescription>
                <T>The highest recorded value for the selected metric</T>
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <T>{`Minimum ${currentConfig.label}`}</T>
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(currentStats?.min)}</div>
              <CardDescription>
                <T>The lowest recorded value for the selected metric</T>
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Time Series Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentConfig.icon className="h-5 w-5" />
              <T>{`${currentConfig.label} Time Series`}</T>
            </CardTitle>
            <CardDescription>
              <T>Historical data trends over time</T>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsData?.timeseries || []}>
                  <defs>
                    <linearGradient id={`gradient-${selectedParameter}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDate}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    label={{ 
                      value: `${currentConfig.label} (${currentConfig.unit})`, 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="text-sm font-medium">{formatDate(label)}</p>
                            <p className="text-sm" style={{ color: currentConfig.color }}>
                              {currentConfig.label}: {formatValue(payload[0].value as number)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedParameter}
                    stroke={currentConfig.color}
                    strokeWidth={2}
                    fill={`url(#gradient-${selectedParameter})`}
                  />
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