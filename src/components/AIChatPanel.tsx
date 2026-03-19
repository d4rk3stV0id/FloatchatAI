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
import { CornerDownLeft, BrainCircuit, Mic } from 'lucide-react';

// --- New Imports for the free translation method ---
import { useTranslate } from '@/contexts/LanguageContexts';

// --- NEW: Voice Recognition Imports ---
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
    visibleFloats?: import('@/lib/dataHooks').Float[];
}

// --- NEW: A dedicated component for each chat bubble ---
// This allows us to use the useTranslate hook on each message individually.
const ChatBubble: React.FC<{ message: ChatMessageData }> = ({ message }) => {
  // Translate the content of the message using our custom hook
  // If the language is English, it will just return the original text instantly.
  // If it's Hindi, it will translate it on the fly.
  const translatedContent = useTranslate(message.content);

  return (
    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[85%] p-4 rounded-2xl shadow-lg transition-all duration-300 ${
        message.type === 'user' 
          ? 'bg-gradient-to-r from-ocean-primary to-ocean-accent text-white font-medium shadow-ocean-primary/20 ml-4' 
          : 'bg-card/90 backdrop-blur-sm text-foreground border border-ocean-primary/10 mr-4'
      }`}>
        {message.type === 'loading' ? (
          <div className="flex items-center justify-center py-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-ocean-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-ocean-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-ocean-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{translatedContent}</p>
        )}
      </div>
    </div>
  );
};


const AIChatPanel: React.FC<AIChatPanelProps> = ({ onNewResponse, visibleFloats }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessageData[]>([
    { id: '1', type: 'ai', content: 'Welcome! Ask me to find the warmest float.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- NEW: Voice recognition hooks ---
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- NEW: Use effect to handle voice input ---
  useEffect(() => {
    // If the browser doesn't support speech recognition, do nothing
    if (!browserSupportsSpeechRecognition) return;

    // When the user stops speaking, if there's a transcript, send the message.
    if (!listening && transcript) {
      handleSendMessage(transcript);
    }
  }, [listening, transcript, browserSupportsSpeechRecognition]);

  // --- MODIFIED: handleSendMessage now accepts an optional parameter for voice input ---
  const handleSendMessage = async (queryContent?: string) => {
    const query = queryContent || chatInput; // Use voice input or text input
    if (!query.trim()) return;

    const userMessage: ChatMessageData = { id: Date.now().toString(), type: 'user', content: query };
    const loadingMessage: ChatMessageData = { id: (Date.now() + 1).toString(), type: 'loading', content: '...' };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setChatInput(''); // Clear the input after sending

    try {
      const { data, error } = await supabase.functions.invoke('process-query', {
        body: { query: query, visible_wmo_ids: (visibleFloats || []).map(f => f.wmo_id) },
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

  const handleVoiceButtonClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: false });
    }
  };

  return (
    <Card className="w-96 h-full flex flex-col bg-card/95 backdrop-blur-xl border-l border-ocean-primary/20 shadow-2xl">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-ocean-primary/10 bg-gradient-to-r from-ocean-primary/5 to-ocean-accent/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ocean-gradient rounded-xl shadow-lg animate-ocean-pulse">
            <BrainCircuit className="h-6 w-6 text-white"/>
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-ocean-primary to-ocean-accent bg-clip-text text-transparent">
              AI Assistant
            </h2>
            <p className="text-xs text-muted-foreground">Powered by Ocean Intelligence</p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Messages Area */}
      <ScrollArea className="flex-1 p-6 min-h-0 bg-gradient-to-b from-transparent to-ocean-surface/5">
        <div className="space-y-6">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Enhanced Input Area */}
      <div className="p-6 border-t border-ocean-primary/10 bg-gradient-to-r from-ocean-primary/5 to-ocean-accent/5">
        <div className="relative">
          <Input 
            placeholder="Ask about ocean data, trends, or insights..." 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="pr-20 h-12 bg-background/90 backdrop-blur-sm border-ocean-primary/20 rounded-xl shadow-lg placeholder:text-muted-foreground/70 focus:border-ocean-primary focus:ring-2 focus:ring-ocean-primary/20"
            disabled={listening}
          />
          
          {/* Voice Input Button */}
          {browserSupportsSpeechRecognition && (
            <Button
              variant="ghost" 
              size="icon" 
              onClick={handleVoiceButtonClick} 
              disabled={!isMicrophoneAvailable}
              className={`absolute top-1/2 right-12 -translate-y-1/2 h-9 w-9 rounded-lg transition-all duration-300 ${
                listening 
                  ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20 animate-pulse' 
                  : 'text-ocean-primary bg-ocean-primary/10 hover:bg-ocean-primary/20'
              }`}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
          
          {/* Send Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleSendMessage()} 
            disabled={!chatInput.trim()}
            className="absolute top-1/2 right-1.5 -translate-y-1/2 h-9 w-9 rounded-lg bg-ocean-primary/10 hover:bg-ocean-primary/20 text-ocean-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CornerDownLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Status Indicator */}
        {listening && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-500 animate-fade-in">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Listening...
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIChatPanel;