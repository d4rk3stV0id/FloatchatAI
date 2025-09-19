import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MapComponent from '@/components/MapComponent';
import AIChatPanel from '@/components/AIChatPanel';
import AnalyticsView from '@/components/AnalyticsView';
import TrendsView from '@/components/TrendsView';
import ProfessionalMetricsView from '@/components/ProfessionalMetricsView';
import ReportGeneratorView from '@/components/ReportGeneratorView';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Menu, User, LogOut, BarChart3, TrendingUp, ChevronRight, ChevronLeft, MapPin, LayoutDashboard, FileText } from 'lucide-react';
import { useFloats } from '@/lib/dataHooks';
import { T } from '@/contexts/LanguageContexts'; // Corrected import path

export interface AIAction {
  type: 'MAP_PAN_ZOOM' | 'HIGHLIGHT_FLOAT' | 'SHOW_CHART';
  payload: any;
}

type ActiveView = 'map' | 'analytics' | 'trends' | 'metrics' | 'reports';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [actions, setActions] = useState<AIAction[]>([]);
  const mapRef = useRef<any>(null);

  const { data: floats, isLoading, error } = useFloats();

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
          <Button 
            variant="ghost" 
            onClick={() => setActiveView(view)} 
            className={`w-full justify-start gap-4 px-4 h-12 rounded-xl transition-all duration-300 group
              ${activeView === view 
                ? 'bg-gradient-to-r from-ocean-primary/20 to-ocean-accent/20 text-ocean-primary border border-ocean-primary/30 shadow-lg shadow-ocean-primary/20' 
                : 'hover:bg-ocean-primary/10 hover:shadow-md'
              } 
              ${!isSidebarExpanded ? 'justify-center' : ''}`}>
            <Icon className={`h-5 w-5 transition-all duration-300 ${activeView === view ? 'text-ocean-primary' : 'text-muted-foreground group-hover:text-ocean-primary'}`} />
            {isSidebarExpanded && (
              <span className={`text-sm font-medium transition-all duration-300 ${activeView === view ? 'text-ocean-primary' : 'text-foreground'}`}>
                <T>{label}</T>
              </span>
            )}
          </Button>
        </TooltipTrigger>
        {!isSidebarExpanded && <TooltipContent side="right"><T>{label}</T></TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'analytics': return <AnalyticsView />;
      case 'trends': return <TrendsView />;
      case 'metrics': return <ProfessionalMetricsView />;
      case 'reports': return <ReportGeneratorView />;
      case 'map':
      default:
        if (isLoading) return <div className="h-full flex items-center justify-center"><T>Loading Map...</T></div>;
        if (error) return <div className="h-full flex items-center justify-center text-destructive">Error: {error.message}</div>;
        if (floats) return <MapComponent floats={floats} actions={actions} mapRef={mapRef} />;
        return null;
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
       <div className={`
        fixed inset-y-0 left-0 z-50 bg-card/95 backdrop-blur-xl border-r border-ocean-primary/20 flex flex-col
        transition-all duration-500 ease-out lg:translate-x-0 shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isSidebarExpanded ? 'w-72' : 'w-20'}`}>
        
        {/* Logo Header with Enhanced Styling */}
        <div className={`flex items-center gap-3 p-6 mb-6 border-b border-ocean-primary/10 ${isSidebarExpanded ? 'justify-start' : 'justify-center'}`}>
            <div className="p-3 bg-ocean-gradient rounded-2xl shadow-lg ring-2 ring-ocean-primary/30 animate-ocean-pulse">
              <img src="/floatlogo.png" alt="FloatChat Logo" className="h-7 w-7 object-contain"/>
            </div>
            {isSidebarExpanded && (
              <div className="animate-fade-in">
                <span className="font-bold text-xl bg-gradient-to-r from-ocean-primary to-ocean-accent bg-clip-text text-transparent">
                  FloatChat
                </span>
                <p className="text-xs text-muted-foreground mt-1">Ocean Analytics Platform</p>
              </div>
            )}
        </div>

        {/* Enhanced Navigation */}
        <div className={`flex-1 flex flex-col gap-3 ${isSidebarExpanded ? 'px-6' : 'px-3 items-center'}`}>
          <NavItem icon={MapPin} label="Ocean Map" view="map" />
          <NavItem icon={BarChart3} label="Analytics" view="analytics" />
          <NavItem icon={TrendingUp} label="Trends" view="trends" />
          <NavItem icon={LayoutDashboard} label="Professional Metrics" view="metrics" />
          <NavItem icon={FileText} label="Report Generator" view="reports" />
        </div>

        {/* Enhanced Bottom Section */}
        <div className={`flex flex-col gap-3 border-t border-ocean-primary/10 pt-6 ${isSidebarExpanded ? 'px-6' : 'px-3 items-center'}`}>
          <TooltipProvider delayDuration={0}><Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => navigate('/settings')} 
                className={`w-full justify-start gap-4 px-4 h-12 rounded-xl hover:bg-ocean-primary/10 transition-all duration-300 ${!isSidebarExpanded ? 'justify-center' : ''}`}>
                <Settings className="h-5 w-5 text-ocean-primary" />
                {isSidebarExpanded && <span className="text-sm font-medium"><T>Settings</T></span>}
              </Button>
            </TooltipTrigger>
            {!isSidebarExpanded && <TooltipContent side="right"><T>Settings</T></TooltipContent>}
          </Tooltip></TooltipProvider>

          <DropdownMenu>
            <TooltipProvider delayDuration={0}><Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" 
                    className={`w-full justify-start gap-4 px-4 h-12 rounded-xl hover:bg-ocean-primary/10 transition-all duration-300 ${!isSidebarExpanded ? 'justify-center' : ''}`}>
                    <User className="h-5 w-5 text-ocean-primary" />
                    {isSidebarExpanded && <span className="text-sm font-medium"><T>Profile</T></span>}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {!isSidebarExpanded && <TooltipContent side="right"><T>Profile</T></TooltipContent>}
            </Tooltip></TooltipProvider>
            <DropdownMenuContent side="right" align="start" className="bg-card/95 backdrop-blur-xl border-ocean-primary/20">
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-ocean-primary/10">
                <LogOut className="mr-2 h-4 w-4" /> <T>Logout</T>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Enhanced Collapse Button */}
        <div className={`border-t border-ocean-primary/10 mt-4 p-3 ${isSidebarExpanded ? 'px-6' : 'px-3'}`}>
           <Button variant="ghost" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} 
             className="w-full justify-start gap-4 px-4 h-12 rounded-xl hover:bg-ocean-primary/10 transition-all duration-300">
             {isSidebarExpanded ? <ChevronLeft className="h-5 w-5 text-ocean-primary" /> : <ChevronRight className="h-5 w-5 text-ocean-primary" />}
             {isSidebarExpanded && <span className="text-sm font-medium"><T>Collapse</T></span>}
           </Button>
        </div>
      </div>

      {/* Enhanced Main Content Area */}
      <div className={`relative z-40 flex-1 flex flex-col transition-all duration-500 ease-out ${isSidebarExpanded ? 'lg:pl-72' : 'lg:pl-20'}`}>
        <header className="lg:hidden p-4 bg-card/90 backdrop-blur-xl border-b border-ocean-primary/20">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} 
            className="hover:bg-ocean-primary/10 rounded-xl">
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-background to-ocean-surface/20">
          <div className="flex-1 h-full min-w-0">{renderActiveView()}</div>
          <div className="flex-shrink-0">
            <AIChatPanel onNewResponse={executeActions} visibleFloats={floats || []} />
          </div>
        </div>
      </div>
      {sidebarOpen && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />)}
    </div>
  );
};

export default Dashboard;