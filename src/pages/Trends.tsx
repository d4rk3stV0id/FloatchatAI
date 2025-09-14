import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Globe, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Trends: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <ThemeToggle />
      
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ocean Trends</h1>
            <p className="text-muted-foreground">Long-term patterns and seasonal variations</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="card-shadow border-ocean-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-ocean-primary" />
                Temperature Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Global Average</span>
                  <div className="flex items-center gap-2 text-green-500">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+0.2°C</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Indian Ocean</span>
                  <div className="flex items-center gap-2 text-green-500">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+0.3°C</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Deep Water</span>
                  <div className="flex items-center gap-2 text-red-500">
                    <ArrowDown className="h-4 w-4" />
                    <span className="text-sm font-medium">-0.1°C</span>
                  </div>
                </div>
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
                <span className="text-muted-foreground">Seasonal trend chart</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-shadow border-ocean-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-ocean-primary" />
              Regional Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <h4 className="font-medium mb-2">Pacific Ocean</h4>
                <div className="text-2xl font-bold text-ocean-primary mb-1">18.5°C</div>
                <div className="text-xs text-muted-foreground">Average Temperature</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <h4 className="font-medium mb-2">Atlantic Ocean</h4>
                <div className="text-2xl font-bold text-ocean-primary mb-1">17.2°C</div>
                <div className="text-xs text-muted-foreground">Average Temperature</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <h4 className="font-medium mb-2">Indian Ocean</h4>
                <div className="text-2xl font-bold text-ocean-primary mb-1">19.1°C</div>
                <div className="text-xs text-muted-foreground">Average Temperature</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Trends;