import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Activity, Database, Loader2 } from 'lucide-react';
import { useSummaryStats, useActiveFloatCount } from '@/lib/dataHooks';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
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
  const { data: summaryData, isLoading: isLoadingSummary, error: summaryError } = useSummaryStats();
  const { data: activeCount, isLoading: isLoadingCount, error: countError } = useActiveFloatCount();

  const isLoading = isLoadingSummary || isLoadingCount;
  const error = summaryError || countError;

  if (isLoading) {
    return <div className="h-full w-full flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  if (error) {
    return <div className="h-full w-full flex items-center justify-center text-destructive">Error loading analytics: {error.message}</div>;
  }

  return (
    <div className="h-full w-full overflow-y-auto p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Data Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analysis of ARGO float data</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Avg. Temperature"
          value={`${summaryData?.avg_temp?.toFixed(2) ?? 'N/A'}°C`}
          icon={BarChart3}
        />
        <StatCard
          title="Avg. Salinity"
          value={`${summaryData?.avg_salinity?.toFixed(2) ?? 'N/A'} PSU`}
          icon={TrendingUp}
        />
        <StatCard
          title="Active Floats"
          value={`${activeCount ?? 'N/A'}`}
          icon={Activity}
        />
      </div>

      <Card className="card-shadow border-ocean-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-ocean-primary" />
            Detailed Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-ocean-deep/10 to-ocean-primary/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Database className="h-16 w-16 text-ocean-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics Dashboard</h3>
              <p className="text-muted-foreground">More interactive charts and data tools coming soon.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsView;