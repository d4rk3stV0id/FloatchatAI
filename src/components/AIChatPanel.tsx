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

// --- New Imports for the free translation method ---
import { useTranslate } from '@/contexts/LanguageContexts';

// Types
interface ChatMessageData {
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

// --- NEW: A dedicated component for each chat bubble ---
// This allows us to use the useTranslate hook on each message individually.
const ChatBubble: React.FC<{ message: ChatMessageData }> = ({ message }) => {
  // Translate the content of the message using our custom hook
  // If the language is English, it will just return the original text instantly.
  // If it's Hindi, it will translate it on the fly.
  const translatedContent = useTranslate(message.content);

  return (
    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] p-3 rounded-lg ${
        message.type === 'user' 
          ? 'bg-blue-600 text-white font-semibold' 
          : 'bg-slate-800 text-slate-100'
      }`}>
        {message.type === 'loading' ? (
          <div className="flex items-center justify-center p-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{translatedContent}</p>
        )}
      </div>
    </div>
  );
};


const AIChatPanel: React.FC<AIChatPanelProps> = ({ onNewResponse }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessageData[]>([
    { id: '1', type: 'ai', content: 'Welcome! Ask me to find the warmest float.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessageData = { id: Date.now().toString(), type: 'user', content: chatInput };
    const loadingMessage: ChatMessageData = { id: (Date.now() + 1).toString(), type: 'loading', content: '...' };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    const currentQuery = chatInput;
    setChatInput('');

    try {
      const { data, error } = await supabase.functions.invoke('process-query', {
        body: { query: currentQuery },
      });

      if (error) throw new Error(error.message);
      
      const response: AIResponse = data;
      const aiMessage: ChatMessageData = { id: (Date.now() + 2).toString(), type: 'ai', content: response.reply };
      setMessages(prev => [...prev.filter(m => m.type !== 'loading'), aiMessage]);

      if (response.actions && Array.isArray(response.actions)) {
        onNewResponse(response.actions);
      }

    } catch (err: any) {
      const errorMessage: ChatMessageData = { id: (Date.now() + 2).toString(), type: 'ai', content: `Sorry, I encountered an error: ${err.message}` };
      setMessages(prev => [...prev.filter(m => m.type !== 'loading'), errorMessage]);
    }
  };

  return (
    <Card className="w-96 h-full flex flex-col bg-card/80 backdrop-blur-lg border-l border-border/50 shadow-2xl">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-blue-400"/>
        <h2 className="font-semibold">AI Assistant</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4 min-h-0">
        <div className="space-y-4">
          {messages.map((message) => (
            // We now use the new ChatBubble component here.
            <ChatBubble key={message.id} message={message} />
          ))}
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