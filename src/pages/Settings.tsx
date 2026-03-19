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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useLanguage, T } from '@/contexts/LanguageContexts';

type Section = 'profile' | 'appearance' | 'language' | 'notifications' | 'data' | 'security';

interface SettingsState {
  language: string;
  notifications: boolean;
  autoRefresh: boolean;
  dataSync: boolean;
  firstName: string;
  lastName: string;
  organization: string;
  defaultRegion: string;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const [draftSettings, setDraftSettings] = useState<SettingsState>({
    language: language,
    notifications: true,
    autoRefresh: true,
    dataSync: false,
    firstName: "Ocean",
    lastName: "Researcher",
    organization: "Marine Research Institute",
    defaultRegion: "Indian Ocean"
  });

  const handleSettingChange = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setDraftSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    setLanguage(draftSettings.language as any);
    console.log("Saving settings:", draftSettings);
    setHasUnsavedChanges(false);
  };
  
  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      setShowExitWarning(true);
    } else {
      navigate('/dashboard');
    }
  };

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
            <CardHeader><CardTitle><T>Profile Settings</T></CardTitle><CardDescription><T>Update your personal information.</T></CardDescription></CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label htmlFor="firstName"><T>First Name</T></Label><Input id="firstName" value={draftSettings.firstName} onChange={e => handleSettingChange('firstName', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="lastName"><T>Last Name</T></Label><Input id="lastName" value={draftSettings.lastName} onChange={e => handleSettingChange('lastName', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="email"><T>Email</T></Label><Input id="email" type="email" defaultValue="researcher@floatchat.com" disabled /></div>
              <div className="space-y-2"><Label htmlFor="organization"><T>Organization</T></Label><Input id="organization" value={draftSettings.organization} onChange={e => handleSettingChange('organization', e.target.value)} /></div>
            </CardContent>
          </Card>
        );
      case 'appearance':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle><T>Appearance</T></CardTitle><CardDescription><T>Customize the look and feel of the application.</T></CardDescription></CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><Label className="font-semibold"><T>Interface Theme</T></Label><p className="text-sm text-muted-foreground"><T>Select your preferred light or dark mode.</T></p></div>
                {/* --- UI TWEAK: Wrapped the toggle for better visibility --- */}
                <div className="p-1 border rounded-md"><ThemeToggle /></div>
              </div>
            </CardContent>
          </Card>
        );
      case 'language':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle><T>Language & Region</T></CardTitle><CardDescription><T>Choose the language and region for your interface.</T></CardDescription></CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div><Label className="font-semibold"><T>Interface Language</T></Label><p className="text-sm text-muted-foreground"><T>All text will be translated instantly.</T></p></div>
                <Select value={draftSettings.language} onValueChange={(lang) => handleSettingChange('language', lang)}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Language" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem><SelectItem value="hi">हिन्दी (Hindi)</SelectItem><SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem><SelectItem value="te">తెలుగు (Telugu)</SelectItem><SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem><SelectItem value="bn">বাংলা (Bengali)</SelectItem><SelectItem value="ur">اردو (Urdu)</SelectItem>
                    <SelectItem value="fr">Français (French)</SelectItem><SelectItem value="de">Deutsch (German)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator/>
              <div className="space-y-2"><Label htmlFor="region" className="font-semibold"><T>Default Region</T></Label><p className="text-sm text-muted-foreground"><T>Set the default region for map and data views.</T></p><Input id="region" value={draftSettings.defaultRegion} onChange={e => handleSettingChange('defaultRegion', e.target.value)} /></div>
            </CardContent>
          </Card>
        );
      case 'notifications':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle><T>Notification Settings</T></CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div><Label htmlFor="notifications" className="font-semibold"><T>Email Notifications</T></Label><p className="text-sm text-muted-foreground"><T>Receive updates about new data and alerts.</T></p></div>
                <Switch id="notifications" checked={draftSettings.notifications} onCheckedChange={(checked) => handleSettingChange('notifications', checked)} className="data-[state=checked]:bg-primary" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div><Label htmlFor="autoRefresh" className="font-semibold"><T>Auto Refresh Data</T></Label><p className="text-sm text-muted-foreground"><T>Automatically refresh map data every 15 minutes.</T></p></div>
                <Switch id="autoRefresh" checked={draftSettings.autoRefresh} onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)} className="data-[state=checked]:bg-primary" />
              </div>
            </CardContent>
          </Card>
        );
      case 'data':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle><T>Data Preferences</T></CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div><Label htmlFor="dataSync" className="font-semibold"><T>Offline Data Sync</T></Label><p className="text-sm text-muted-foreground"><T>Download key data for offline analysis.</T></p></div>
                <Switch id="dataSync" checked={draftSettings.dataSync} onCheckedChange={(checked) => handleSettingChange('dataSync', checked)} className="data-[state=checked]:bg-primary" />
              </div>
            </CardContent>
          </Card>
        );
      case 'security':
        return (
          <Card className="card-shadow border-border/20">
            <CardHeader><CardTitle><T>Security</T></CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2"><Label><T>Password</T></Label><Button variant="outline" className="w-full sm:w-auto"><T>Change Password</T></Button></div>
              <Separator />
              <div className="space-y-2 rounded-lg border border-destructive/50 p-4">
                <h4 className="font-semibold text-destructive"><T>Delete Account</T></h4>
                <p className="text-sm text-destructive/80"><T>This action is permanent and cannot be undone.</T></p>
                <div className="pt-2"><Button variant="destructive" size="sm"><T>Delete My Account</T></Button></div>
              </div>
            </CardContent>
          </Card>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center mb-8">
            <Button onClick={handleBackNavigation} variant="outline" size="icon" className="mr-4"><ArrowLeft className="h-4 w-4" /></Button>
            <div><h1 className="text-3xl font-bold"><T>Settings</T></h1><p className="text-muted-foreground"><T>Manage your account and application preferences</T></p></div>
        </div>
        <div className="grid lg:grid-cols-[250px_1fr] gap-8">
          <nav className="flex flex-col gap-2">
            {navItems.map(item => (
              <Button key={item.id} 
                // --- UI TWEAK: Removed orange 'secondary' variant for a cleaner look ---
                variant={'ghost'} 
                onClick={() => setActiveSection(item.id as Section)} 
                className={`w-full justify-start gap-3 h-10 ${activeSection === item.id ? 'bg-muted text-primary font-semibold' : ''}`}
              >
                <item.icon className="h-4 w-4" />
                <T>{item.label}</T>
              </Button>
            ))}
          </nav>
          <div className="space-y-6">
            {renderSection()}
            <div className="flex justify-end pt-4">
                <Button size="lg" onClick={handleSaveChanges} disabled={!hasUnsavedChanges} className="bg-primary hover:bg-primary/90">
                    <T>Save Changes</T>
                </Button>
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle><T>Unsaved Changes</T></AlertDialogTitle><AlertDialogDescription><T>You have unsaved changes. Are you sure you want to leave?</T></AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel><T>Cancel</T></AlertDialogCancel><AlertDialogAction onClick={() => navigate('/dashboard')}><T>Leave</T></AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;