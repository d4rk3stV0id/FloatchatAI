import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MapComponent from '@/components/MapComponent';
import AIChatPanel from '@/components/AIChatPanel';
import AnalyticsView from '@/components/AnalyticsView';
import TrendsView from '@/components/TrendsView';

// UI Components
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Icons
import { Waves, Settings, Menu, User, LogOut, BarChart3, TrendingUp, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

// Types
export interface Float {
  id: number; wmo_id: number; latitude: number; longitude: number; last_seen: string;
}
export interface AIAction {
  type: 'MAP_PAN_ZOOM' | 'HIGHLIGHT_FLOAT' | 'SHOW_CHART';
  payload: any;
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [actions, setActions] = useState<AIAction[]>([]);
  const mapRef = useRef<any>(null);

  const { data: floats, isLoading, error } = useQuery({ queryKey: ['floats'], queryFn: fetchFloats });

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  }
  
  const executeActions = (newActions: AIAction[]) => {
    setActions(newActions);
    newActions.forEach(action => {
      if (action.type === 'MAP_PAN_ZOOM' && mapRef.current) {
        const { lat, lng, zoom } = action.payload;
        if (typeof lat === 'number' && typeof lng === 'number') {
            mapRef.current.flyTo([lat, lng], zoom || 7);
        }
      }
    });
  };

  const NavItem = ({ icon: Icon, label, view }: { icon: React.ElementType, label: string, view: ActiveView }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" onClick={() => setActiveView(view)} className={`w-full justify-start gap-4 px-4 ${activeView === view ? 'bg-ocean-primary/20 text-ocean-primary' : ''} ${!isSidebarExpanded ? 'justify-center' : ''}`}>
            <Icon className="h-5 w-5" />
            {isSidebarExpanded && <span className="text-sm">{label}</span>}
          </Button>
        </TooltipTrigger>
        {!isSidebarExpanded && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'analytics': return <AnalyticsView />;
      case 'trends': return <TrendsView />;
      case 'map':
      default:
        if (isLoading) return <div className="h-full flex items-center justify-center">Loading Map...</div>;
        if (error) return <div className="h-full flex items-center justify-center text-destructive">Error: {error.message}</div>;
        if (floats) return <MapComponent floats={floats} actions={actions} mapRef={mapRef} />;
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-card/80 backdrop-blur-lg border-r border-border/50 flex flex-col
        transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
        
        <div className={`flex items-center gap-2 p-4 mb-4 ${isSidebarExpanded ? 'justify-start' : 'justify-center'}`}>
            <div className="p-2 bg-ocean-gradient rounded-xl"><Waves className="h-6 w-6 text-primary-foreground" /></div>
            {isSidebarExpanded && <span className="font-semibold text-lg">FloatChat</span>}
        </div>

        <div className={`flex-1 flex flex-col gap-2 ${isSidebarExpanded ? 'px-4' : 'px-2 items-center'}`}>
          <NavItem icon={MapPin} label="Ocean Map" view="map" />
          <NavItem icon={BarChart3} label="Analytics" view="analytics" />
          <NavItem icon={TrendingUp} label="Trends" view="trends" />
        </div>
        
        <div className={`flex flex-col gap-2 ${isSidebarExpanded ? 'px-4' : 'px-2 items-center'}`}>
          <TooltipProvider delayDuration={0}><Tooltip>
            <TooltipTrigger asChild><Button variant="ghost" onClick={() => navigate('/settings')} className={`w-full justify-start gap-4 px-4 ${!isSidebarExpanded ? 'justify-center' : ''}`}><Settings className="h-5 w-5" />{isSidebarExpanded && <span className="text-sm">Settings</span>}</Button></TooltipTrigger>
            {!isSidebarExpanded && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip></TooltipProvider>
          <DropdownMenu>
            <TooltipProvider delayDuration={0}><Tooltip>
              <TooltipTrigger asChild><DropdownMenuTrigger asChild><Button variant="ghost" className={`w-full justify-start gap-4 px-4 ${!isSidebarExpanded ? 'justify-center' : ''}`}><User className="h-5 w-5" />{isSidebarExpanded && <span className="text-sm">Profile</span>}</Button></DropdownMenuTrigger></TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right">Profile</TooltipContent>}
            </Tooltip></TooltipProvider>
            <DropdownMenuContent side="right" align="start"><DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className={`border-t border-border/50 mt-4 p-2 ${isSidebarExpanded ? 'px-4' : 'px-2'}`}>
           <Button variant="ghost" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="w-full justify-start gap-4 px-4">{isSidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}{isSidebarExpanded && <span className="text-sm">Collapse</span>}</Button>
        </div>
      </div>
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'}`}>
        <header className="lg:hidden p-4 bg-card/50 backdrop-blur-sm"><Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button></header>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 h-full">{renderActiveView()}</div>
          <AIChatPanel onNewResponse={executeActions} />
        </div>
      </div>
      {sidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />)}
    </div>
  );
};

export default Dashboard;

