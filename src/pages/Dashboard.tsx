import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

// Import UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; 
import MapComponent from '@/components/MapComponent';
import AnalyticsView from '@/components/Analytics'; // <-- IMPORT NEW VIEW
import TrendsView from '@/components/Trends';       // <-- IMPORT NEW VIEW

// Import Icons
import { 
  Waves, Send, BarChart3, MapPin, Settings, Menu, X, TrendingUp, User, LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Define types
type ActiveView = 'map' | 'analytics' | 'trends';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Float {
  id: number;
  wmo_id: number;
  latitude: number;
  longitude: number;
  last_seen: string;
}

const fetchFloats = async (): Promise<Float[]> => {
  const { data, error } = await supabase.from('floats').select('*').limit(100);
  if (error) throw new Error(error.message);
  return data || [];
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('map'); // <-- STATE FOR ACTIVE VIEW
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', type: 'ai', content: 'Welcome to FloatChat! How can I help you explore ARGO ocean data?', timestamp: new Date() }
  ]);

  const { data: floats, isLoading, error } = useQuery({
    queryKey: ['floats'],
    queryFn: fetchFloats,
  });

  const handleSendMessage = () => { /* ... Mock AI logic ... */ };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'analytics':
        return <AnalyticsView />;
      case 'trends':
        return <TrendsView />;
      case 'map':
      default:
        if (isLoading) return <div className="h-full flex items-center justify-center">Loading Map...</div>;
        if (error) return <div className="h-full flex items-center justify-center text-destructive">Error: {error.message}</div>;
        if (floats) return <MapComponent floats={floats} />;
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 flex flex-col
      `}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2"><Waves className="h-5 w-5 text-ocean-primary" /> <span className="font-semibold">FloatChat</span></div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="h-4 w-4" /></Button>
        </div>

        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-2">
            {/* Main Navigation */}
            <Button variant={activeView === 'map' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => setActiveView('map')}><MapPin className="h-4 w-4" /> Ocean Map</Button>
            <Button variant={activeView === 'analytics' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => setActiveView('analytics')}><BarChart3 className="h-4 w-4" /> Data Analytics</Button>
            <Button variant={activeView === 'trends' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => setActiveView('trends')}><TrendingUp className="h-4 w-4" /> Trends</Button>
          </div>
        </ScrollArea>
        
        {/* Settings button at the bottom */}
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate('/settings')}><Settings className="h-4 w-4" /> Settings</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="h-4 w-4" /></Button>
            <h1 className="text-xl font-semibold">
              {activeView === 'map' && 'Indian Ocean Dashboard'}
              {activeView === 'analytics' && 'Analytics Dashboard'}
              {activeView === 'trends' && 'Trends Dashboard'}
            </h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-sm text-muted-foreground">Status: <span className="text-green-500">Connected</span></div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full"><User className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end"><DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem></DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Center Panel - Dynamic View */}
          <div className="flex-1 overflow-y-auto">
            {renderActiveView()}
          </div>

          {/* Right Sidebar - AI Chat */}
          <div className="w-80 border-l border-border flex flex-col">
            <div className="p-4 border-b border-border bg-card/50"><h2 className="font-semibold">AI Assistant</h2></div>
            <ScrollArea className="flex-1 p-4" id="chat-messages">{/* ... your chat messages map here ... */}</ScrollArea>
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input placeholder="Ask about ocean data..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                <Button variant="ocean" size="icon" onClick={handleSendMessage} disabled={!chatInput.trim()}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />)}
    </div>
  );
};

export default Dashboard;

