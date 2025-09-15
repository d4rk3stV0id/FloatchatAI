// components/AnalyticsView.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Activity, Database, Loader2 } from 'lucide-react';
import { useDashboardAnalytics } from '@/lib/dataHooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { T } from '@/contexts/LanguageContexts'; // Import the translation component

// The 'title' prop is now a ReactNode to allow passing the <T> component
const StatCard: React.FC<{ title: React.ReactNode; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
  <Card className="card-shadow border-ocean-primary/20">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base">
        <Icon className="h-5 w-5 text-ocean-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const AnalyticsView: React.FC = () => {
  const { data, isLoading, error } = useDashboardAnalytics();

  if (isLoading) {
    return <div className="h-full w-full flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  if (error) {
    return <div className="h-full w-full flex items-center justify-center text-destructive"><T>Error loading analytics</T>: {error.message}</div>;
  }

  return (
    <div className="h-full w-full overflow-y-auto p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2"><T>Data Analytics</T></h1>
          <p className="text-muted-foreground"><T>Comprehensive analysis of ARGO float data</T></p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title={<T>Avg. Temperature</T>}
          value={`${data?.global_avg_temp?.toFixed(2) ?? 'N/A'}°C`}
          icon={BarChart3}
        />
        <StatCard
          title={<T>Avg. Salinity</T>}
          value={`${data?.global_avg_salinity?.toFixed(2) ?? 'N/A'} PSU`}
          icon={TrendingUp}
        />
        <StatCard
          title={<T>Active Floats</T>}
          value={`${data?.active_float_count ?? 'N/A'}`}
          icon={Activity}
        />
      </div>

      <Card className="card-shadow border-ocean-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-ocean-primary" />
            <T>Temperature Profile by Depth</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.depth_profile || []}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="depth_range" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°C`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 30, 40, 0.8)',
                    borderColor: '#00ffff80',
                    color: '#e2e8f0'
                  }}
                  cursor={{ fill: 'rgba(0, 255, 255, 0.1)' }}
                />
                <Bar dataKey="avg_temp" fill="#00f2ff" name="Avg. Temperature" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsView;