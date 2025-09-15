// components/AIChatPanel.tsx

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AIAction } from '@/pages/Dashboard';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

// Icons
import { CornerDownLeft, BrainCircuit } from 'lucide-react';

// Types
interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'loading';
  content: string;
}
interface AIResponse {
    reply: string;
    actions: AIAction[];
}
interface AIChatPanelProps {
    onNewResponse: (actions: AIAction[]) => void;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ onNewResponse }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', type: 'ai', content: 'Welcome! Ask me to find the warmest float.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // This effect handles the auto-scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      
      const response: AIResponse = data;
      const aiMessage: ChatMessage = { id: (Date.now() + 2).toString(), type: 'ai', content: response.reply };
      setMessages(prev => [...prev.filter(m => m.type !== 'loading'), aiMessage]);

      if (response.actions && Array.isArray(response.actions)) {
        onNewResponse(response.actions);
      }

    } catch (err: any) {
      const errorMessage: ChatMessage = { id: (Date.now() + 2).toString(), type: 'ai', content: `Sorry, I encountered an error: ${err.message}` };
      setMessages(prev => [...prev.filter(m => m.type !== 'loading'), errorMessage]);
    }
  };

  return (
    // This flex-col layout is key. Header and footer have fixed height, ScrollArea fills the rest.
    <Card className="w-96 h-full flex flex-col bg-card/80 backdrop-blur-lg border-l border-border/50 shadow-2xl">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-blue-400"/>
        <h2 className="font-semibold">AI Assistant</h2>
      </div>
      
      {/* flex-1 and min-h-0 are crucial for making this area scrollable within a flex container */}
      <ScrollArea className="flex-1 p-4 min-h-0">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* --- UI COLOR FIX IS HERE --- */}
              <div className={`max-w-[85%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white font-semibold' 
                  // Reverted to your original color scheme
                  : 'bg-slate-800 text-slate-100'
              }`}>
                {message.type === 'loading' ? (
                  <div className="flex items-center justify-center p-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {/* This empty div is the target for our auto-scroll */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border/50">
        <div className="relative">
          <Input 
            placeholder="Ask a question..." 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="pr-12"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSendMessage} 
            disabled={!chatInput.trim()}
            className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 hover:bg-blue-600/20"
          >
            <CornerDownLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChatPanel;