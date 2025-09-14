import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dataSync, setDataSync] = useState(false);

  return (
    <div className="min-h-screen bg-background p-6">
      <ThemeToggle />
      
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and application preferences</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="card-shadow border-ocean-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-ocean-primary" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Ocean" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Researcher" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="researcher@floatchat.com" />
              </div>
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" defaultValue="Marine Research Institute" />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="card-shadow border-ocean-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-ocean-primary" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new data and alerts</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoRefresh">Auto Refresh Data</Label>
                  <p className="text-sm text-muted-foreground">Automatically refresh ocean data every 15 minutes</p>
                </div>
                <Switch
                  id="autoRefresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Settings */}
          <Card className="card-shadow border-ocean-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-ocean-primary" />
                Data Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataSync">Offline Data Sync</Label>
                  <p className="text-sm text-muted-foreground">Download data for offline analysis</p>
                </div>
                <Switch
                  id="dataSync"
                  checked={dataSync}
                  onCheckedChange={setDataSync}
                />
              </div>
              <Separator />
              <div>
                <Label htmlFor="region">Default Region</Label>
                <Input id="region" defaultValue="Indian Ocean" />
              </div>
              <div>
                <Label htmlFor="dateRange">Default Date Range (days)</Label>
                <Input id="dateRange" type="number" defaultValue="30" />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="card-shadow border-ocean-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-ocean-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Enable Two-Factor Authentication
              </Button>
              <Separator />
              <div className="text-center">
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This action cannot be undone
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="ocean" size="lg">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;