import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Globe, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { useRegionalTemps, useSummaryStats } from '@/lib/dataHooks';

const TrendsView: React.FC = () => {
  const { data: regionalData, isLoading: isLoadingRegional, error: regionalError } = useRegionalTemps();
  const { data: summaryData, isLoading: isLoadingSummary, error: summaryError } = useSummaryStats();

  const tempTrend = summaryData?.temp_trend ?? 0;
  const trendColor = tempTrend > 0 ? 'text-green-500' : tempTrend < 0 ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className="h-full w-full overflow-y-auto p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ocean Trends</h1>
          <p className="text-muted-foreground">Long-term patterns and seasonal variations</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="card-shadow border-ocean-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ocean-primary" />
              Temperature Trends (30-Day Change)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingSummary ? (
                <div className="h-12 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : summaryError ? (
                 <div className="text-destructive text-sm p-3">Could not load trend data.</div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Global Average Trend</span>
                  <div className={`flex items-center gap-2 ${trendColor}`}>
                    {tempTrend > 0 && <ArrowUp className="h-4 w-4" />}
                    {tempTrend < 0 && <ArrowDown className="h-4 w-4" />}
                    <span className="text-sm font-medium">{tempTrend.toFixed(2)}°C</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-ocean-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-ocean-primary" />
              Seasonal Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Seasonal trend chart (placeholder)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-ocean-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-ocean-primary" />
            Regional Average Temperatures
          </CardTitle>
        </CardHeader>
        <CardContent>
            {isLoadingRegional ? (
                <div className="h-24 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : regionalError ? (
                <div className="text-destructive text-center p-4">Error loading regional data.</div>
            ) : !regionalData || regionalData.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">No regional data available. Add a 'region' to your floats.</div>
            ) : (
                <div className="grid md:grid-cols-3 gap-4">
                    {regionalData.map((region, index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg text-center">
                            <h4 className="font-medium mb-2">{region.region} Ocean</h4>
                            <div className="text-2xl font-bold text-ocean-primary mb-1">{region.avg_temp.toFixed(1)}°C</div>
                            <div className="text-xs text-muted-foreground">Average Temperature</div>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsView;