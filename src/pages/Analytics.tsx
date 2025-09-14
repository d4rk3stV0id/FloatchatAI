import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Activity, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Analytics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <ThemeToggle />
      
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Data Analytics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of ARGO float data</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="card-shadow border-ocean-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-ocean-primary" />
                Temperature Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Chart placeholder</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-ocean-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-ocean-primary" />
                Salinity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-r from-ocean-deep/20 to-ocean-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Chart placeholder</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-ocean-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-ocean-primary" />
                Float Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-r from-ocean-secondary/20 to-ocean-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Chart placeholder</span>
              </div>
            </CardContent>
          </Card>
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
                <p className="text-muted-foreground">Interactive charts and detailed data analysis tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;