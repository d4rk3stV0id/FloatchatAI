import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  Waves, 
  Send, 
  BarChart3, 
  MapPin, 
  Settings, 
  Menu,
  X,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to FloatChat! I can help you analyze ARGO ocean data. Try asking me to "compare temperature profiles" or "show salinity trends in the Indian Ocean".',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you want to "${chatInput}". Here's what I found in the ARGO data...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <ThemeToggle />
      
      {/* Left Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-ocean-gradient rounded-lg">
              <Waves className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">FloatChat</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-2">
            <div className="px-3 py-2 rounded-lg bg-ocean-primary/10 text-ocean-primary border border-ocean-primary/20">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Ocean Map</span>
              </div>
            </div>
            
            <div className="px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Data Analytics</span>
              </div>
            </div>
            
            <div className="px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Trends</span>
              </div>
            </div>
            
            <div className="px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground px-3">Recent Queries</h4>
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors cursor-pointer">
                Temperature profiles comparison
              </div>
              <div className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors cursor-pointer">
                Indian Ocean salinity data
              </div>
              <div className="px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors cursor-pointer">
                Float trajectory analysis
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="border-b border-border p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Indian Ocean Dashboard</h1>
            <div className="ml-auto flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Last updated: Just now
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Center Panel - Map */}
          <div className="flex-1 p-6">
            <Card className="h-full card-shadow border-ocean-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-ocean-primary" />
                  Interactive Ocean Map
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="h-full bg-gradient-to-br from-ocean-deep/20 to-ocean-primary/20 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto animate-ocean-pulse">
                      <Waves className="h-12 w-12 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Indian Ocean Region</h3>
                      <p className="text-muted-foreground text-sm">
                        Interactive map with ARGO float positions and data visualizations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - AI Chat */}
          <div className="w-80 border-l border-border flex flex-col">
            <div className="p-4 border-b border-border bg-card/50">
              <h2 className="font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-ocean-primary rounded-full animate-pulse" />
                AI Assistant
              </h2>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-ocean-gradient text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about ocean data..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="border-ocean-primary/20 focus:border-ocean-primary"
                />
                <Button 
                  variant="ocean" 
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Data Display Area */}
            <div className="border-t border-border">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-medium">Data Visualization</h3>
              </div>
              <div className="p-4 h-48">
                <div className="h-full bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Charts will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;