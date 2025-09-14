import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MapComponent from '@/components/MapComponent';
import AnalyticsView from '@/components/AnalyticsView';
import TrendsView from '@/components/TrendsView';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Icons
import { Waves, Send, BarChart3, MapPin, Settings, Menu, X, TrendingUp, User, LogOut } from 'lucide-react';

// Types
interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'loading';
  content: string;
}
interface Float {
  id: number; wmo_id: number; latitude: number; longitude: number; last_seen: string;
}
type ActiveView = 'map' | 'analytics' | 'trends';

// Data fetching function
const fetchFloats = async (): Promise<Float[]> => {
  const { data, error } = await supabase.from('floats').select('*').limit(100);
  if (error) throw new Error(error.message);
  return data || [];
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', type: 'ai', content: 'Welcome to FloatChat! Ask me anything about the ARGO float data.' }
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const { data: floats, isLoading, error } = useQuery({ queryKey: ['floats'], queryFn: fetchFloats });

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), type: 'user', content: chatInput };
    const loadingMessage: ChatMessage = { id: (Date.now() + 1).toString(), type: 'loading', content: '...' };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    const currentQuery = chatInput;
    setChatInput('');

    try {
      const { data, error } = await supabase.functions.invoke('process-query', {
        body: { query: currentQuery },
      });

      if (error) throw new Error(error.message);
      
      const aiMessage: ChatMessage = { id: (Date.now() + 2).toString(), type: 'ai', content: data.reply };
      setMessages(prev => [...prev.filter(m => m.type !== 'loading'), aiMessage]);

    } catch (err: any) {
      const errorMessage: ChatMessage = { id: (Date.now() + 2).toString(), type: 'ai', content: `Error: ${err.message}` };
      setMessages(prev => [...prev.filter(m => m.type !== 'loading'), errorMessage]);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'analytics': return <AnalyticsView />;
      case 'trends': return <TrendsView />;
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
      {/* --- Sidebar --- */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-border"><div className="flex items-center gap-2"><div className="p-1.5 bg-ocean-gradient rounded-lg"><Waves className="h-5 w-5 text-primary-foreground" /></div><span className="font-semibold">FloatChat</span></div><Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="h-4 w-4" /></Button></div>
        
        <div className="flex-1 flex flex-col justify-between">
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-2">
              <div className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${activeView === 'map' ? 'bg-ocean-primary/10 text-ocean-primary' : 'hover:bg-muted'}`} onClick={() => setActiveView('map')}><div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <span className="text-sm font-medium">Ocean Map</span></div></div>
              <div className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${activeView === 'analytics' ? 'bg-ocean-primary/10 text-ocean-primary' : 'hover:bg-muted'}`} onClick={() => setActiveView('analytics')}><div className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> <span className="text-sm">Data Analytics</span></div></div>
              <div className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${activeView === 'trends' ? 'bg-ocean-primary/10 text-ocean-primary' : 'hover:bg-muted'}`} onClick={() => setActiveView('trends')}><div className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> <span className="text-sm">Trends</span></div></div>
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-border">
            <div className="px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => navigate('/settings')}><div className="flex items-center gap-2"><Settings className="h-4 w-4" /> <span className="text-sm">Settings</span></div></div>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="border-b border-border p-4 bg-card/50 backdrop-blur-sm"><div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="h-4 w-4" /></Button><h1 className="text-xl font-semibold">Indian Ocean Dashboard</h1><div className="ml-auto flex items-center gap-4"><div className="text-sm text-muted-foreground">Status: <span className="text-green-500">Connected</span></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full"><User className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></div></header>
        {/* --- FIX: The parent of the chat panel must have overflow-hidden --- */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">{renderActiveView()}</div>
          {/* --- This container needs to be a flex-col to manage its children's heights --- */}
          <div className="w-96 border-l border-border flex flex-col">
            <div className="p-4 border-b border-border bg-card/50"><h2 className="font-semibold">AI Assistant</h2></div>
            {/* --- The min-h-0 class is crucial here to make the scroll area work --- */}
            <ScrollArea className="flex-1 p-4 min-h-0" ref={chatScrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user' ? 'bg-ocean-gradient text-primary-foreground' : 'bg-muted'}`}>
                      {message.type === 'loading' ? (<div className="flex items-center justify-center space-x-1"><div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-150" /><div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-300" /></div>) : (<p className="text-sm whitespace-pre-wrap">{message.content}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border"><div className="flex gap-2"><Input placeholder="Ask about ocean data..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} /><Button variant="ocean" size="icon" onClick={handleSendMessage} disabled={!chatInput.trim()}><Send className="h-4 w-4" /></Button></div></div>
          </div>
        </div>
      </div>
      {sidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />)}
    </div>
  );
};

export default Dashboard;

