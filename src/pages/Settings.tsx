import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Database, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dataSync, setDataSync] = useState(false);

  return (
    <div className="min-h-screen bg-background p-6">
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
          {/* Appearance Settings */}
          <Card className="card-shadow border-ocean-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-ocean-primary" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Interface Theme</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred light or dark mode.</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

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
                <Input id="email" type="email" defaultValue="researcher@floatchat.com" disabled />
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
                  <p className="text-sm text-muted-foreground">Receive updates about new data and alerts.</p>
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
                  <p className="text-sm text-muted-foreground">Automatically refresh map data every 15 minutes.</p>
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
                  <p className="text-sm text-muted-foreground">Download key data for offline analysis.</p>
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
              <Button variant="outline" className="w-full sm:w-auto">
                Change Password
              </Button>
              <Separator />
              <div className="flex flex-col sm:flex-row items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <div>
                  <h4 className="font-semibold text-destructive">Delete Account</h4>
                  <p className="text-xs text-destructive/80 mt-1">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="mt-4 sm:mt-0">
                  Delete My Account
                </Button>
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

