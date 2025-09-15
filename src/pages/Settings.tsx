import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Database, Palette, Languages, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

// --- New Imports for the free translation method ---
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContexts';

type Section = 'profile' | 'appearance' | 'language' | 'notifications' | 'data' | 'security';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  // --- This hook now controls the global language state ---
  const { language, setLanguage } = useLanguage();
  
  const [activeSection, setActiveSection] = useState<Section>('profile');
  
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dataSync, setDataSync] = useState(false);

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language & Region', icon: Languages },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle>Profile Settings</CardTitle><CardDescription>Update your personal information.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" defaultValue="Ocean" /></div>
                <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" defaultValue="Researcher" /></div>
              </div>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="researcher@floatchat.com" disabled /></div>
              <div><Label htmlFor="organization">Organization</Label><Input id="organization" defaultValue="Marine Research Institute" /></div>
            </CardContent>
          </Card>
        );
      case 'appearance':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Customize the look and feel of the application.</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div><Label htmlFor="theme">Interface Theme</Label><p className="text-sm text-muted-foreground">Select your preferred light or dark mode.</p></div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        );
      case 'language':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle>Language & Region</CardTitle><CardDescription>Choose the language and region for your interface.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div><Label>Interface Language</Label><p className="text-sm text-muted-foreground">All text will be translated instantly.</p></div>
                {/* --- This is the new, working language selector --- */}
                <Select value={language} onValueChange={(lang) => setLanguage(lang as 'en' | 'hi')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator/>
              <div><Label htmlFor="region">Default Region</Label><p className="text-sm text-muted-foreground mb-2">Set the default region for map and data views.</p><Input id="region" defaultValue="Indian Ocean" /></div>
            </CardContent>
          </Card>
        );
      case 'notifications':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div><Label htmlFor="notifications">Email Notifications</Label><p className="text-sm text-muted-foreground">Receive updates about new data and alerts.</p></div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div><Label htmlFor="autoRefresh">Auto Refresh Data</Label><p className="text-sm text-muted-foreground">Automatically refresh map data every 15 minutes.</p></div>
                <Switch id="autoRefresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
            </CardContent>
          </Card>
        );
      case 'data':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle>Data Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div><Label htmlFor="dataSync">Offline Data Sync</Label><p className="text-sm text-muted-foreground">Download key data for offline analysis.</p></div>
                <Switch id="dataSync" checked={dataSync} onCheckedChange={setDataSync} />
              </div>
            </CardContent>
          </Card>
        );
      case 'security':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle>Security</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
              <Separator />
              <div className="flex flex-col sm:flex-row items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <div><h4 className="font-semibold text-destructive">Delete Account</h4><p className="text-xs text-destructive/80 mt-1">This action is permanent and cannot be undone.</p></div>
                <Button variant="destructive" size="sm" className="mt-4 sm:mt-0">Delete My Account</Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center mb-8">
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="icon" className="mr-4">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and application preferences</p>
            </div>
        </div>
        <div className="grid lg:grid-cols-[250px_1fr] gap-8">
          <nav className="flex flex-col gap-2">
            {navItems.map(item => (
              <Button key={item.id} variant={activeSection === item.id ? 'secondary' : 'ghost'} onClick={() => setActiveSection(item.id as Section)} className="w-full justify-start gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="space-y-6">
            {renderSection()}
            <div className="flex justify-end pt-4">
                <Button size="lg">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;