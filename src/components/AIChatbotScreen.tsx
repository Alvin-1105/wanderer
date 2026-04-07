import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Sparkles, User, Loader2, X } from 'lucide-react';
import * as api from '../api';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

import { Trip } from '../types';

interface AIChatbotScreenProps {
  onBack: () => void;
  onTripGenerated: (tripId: string) => void;
  contextTrip?: Trip;
}

const ChatInputArea: React.FC<{
  onSend: (text: string) => void;
  disabled: boolean;
}> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="bg-white p-4 border-t border-border shrink-0">
      <div className="max-w-4xl mx-auto relative">
        <textarea 
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { 
              e.preventDefault(); 
              handleSend(); 
            }
          }}
          placeholder="Type your reply here... (Shift+Enter for a new line)"
          className="w-full bg-surface border border-border rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors pr-16 resize-none text-base"
          disabled={disabled}
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="absolute right-3 bottom-3 p-3 bg-accent hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const AIChatbotScreen: React.FC<AIChatbotScreenProps> = ({ onBack, onTripGenerated, contextTrip }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'ai',
      content: contextTrip 
        ? `Hello! I'm your Copilot for your trip to ${contextTrip.title}. I can read your entire itinerary. Tell me what you'd like to add, change, or improve! (e.g. "Add a coffee shop to day 2 in Paris")`
        : "Hello! I'm your professional AI travel assistant. Where are you dreaming of going, and what kind of experience are you looking for?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTrip, setIsGeneratingTrip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isGeneratingTrip]);

  const handleSend = async (text: string) => {
    if (isLoading || isGeneratingTrip) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Filter out local error/system messages so we don't poison the LLM history
      const apiMessages = newMessages.filter(m => !m.id.endsWith('err') && !m.id.endsWith('sys'));
      
      const response = await api.chatWithAI(apiMessages, contextTrip);
      
      const aiContent = response.message;
      const isReadyToGenerate = aiContent.includes('[ACTION: GENERATE_TRIP]');
      
      // Clean up the magic string from the visible response
      const cleanContent = aiContent.replace('[ACTION: GENERATE_TRIP]', '').trim();
      
      if (cleanContent) {
        setMessages(prev => [...prev, { id: Date.now().toString() + 'ai', role: 'ai', content: cleanContent }]);
      }

      const isReadyToModify = aiContent.includes('[ACTION: UPDATE_TRIP]');

      if (isReadyToGenerate) {
        setIsGeneratingTrip(true);
        try {
          const generatedTrip = await api.generateAITrip(apiMessages);
          onTripGenerated(generatedTrip.id);
        } catch (genError) {
          console.error("Trip Generation Error:", genError);
          const isRateLimit = genError instanceof Error && genError.message.includes('RATE_LIMIT');
          setMessages(prev => [...prev, { 
            id: Date.now().toString() + 'sys', 
            role: 'ai', 
            content: isRateLimit ? "Whoa, slow down! We've hit Google's free tier speed limit. Please wait 15 seconds before trying again." : "I'm sorry, I ran into an error while building the trip database. Please try answering the last question again." 
          }]);
          setIsGeneratingTrip(false);
        }
      } else if (isReadyToModify && contextTrip) {
        setIsGeneratingTrip(true);
        try {
          // The AI generated an update command!
          await api.updateTripViaAI(apiMessages, contextTrip.id);
          onTripGenerated(contextTrip.id); // Reload
        } catch (updateError) {
          console.error("Trip Update Error:", updateError);
          const isRateLimit = updateError instanceof Error && updateError.message.includes('RATE_LIMIT');
          setMessages(prev => [...prev, { 
            id: Date.now().toString() + 'sys', 
            role: 'ai', 
            content: isRateLimit ? "Whoa, slow down! We've hit Google's free tier speed limit. Please wait 15 seconds before trying again." : "I'm sorry, I ran into an error while modifying your trip database." 
          }]);
          setIsGeneratingTrip(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      const isRateLimit = error instanceof Error && error.message.includes('RATE_LIMIT');
      setMessages(prev => [...prev, { 
        id: Date.now().toString() + 'err', 
        role: 'ai', 
        content: isRateLimit ? "Whoa, slow down! We've hit Google's AI speed limit. Please wait about 15 seconds before sending another message." : 'Oops! I had trouble connecting to the AI database. Could you try sending that again?' 
      }]);
      setIsLoading(false);
    }
  };

  if (isGeneratingTrip) {
    return (
      <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center text-white z-50 animate-in fade-in duration-500">
        <Sparkles className="w-16 h-16 text-accent animate-pulse mb-6" />
        <h2 className="text-3xl font-display font-bold mb-4 text-center px-4">Crafting Your Dream Journey...</h2>
        <p className="text-white/70 max-w-md text-center px-6">
          I am compiling your preferences into a structured day-by-day itinerary. Hang tight! This might take 10-15 seconds.
        </p>
        <Loader2 className="w-8 h-8 animate-spin mt-12 text-accent" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-surface flex flex-col z-40">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-border shadow-sm shrink-0">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-surface rounded-full transition-colors mr-4"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mr-3">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-primary">{contextTrip ? 'Trip Copilot' : 'Travel Assistant'}</h1>
          <p className="text-xs text-secondary">{contextTrip ? `Editing ${contextTrip.title}` : 'Expert Trip Planner'}</p>
        </div>
        <div className="flex-1" />
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-red-50 text-secondary hover:text-red-500 rounded-lg transition-colors border border-border text-sm font-medium"
        >
          <X className="w-4 h-4" />
          <span>Exit</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent/20 text-accent'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-border text-primary rounded-tl-sm shadow-sm'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && !isGeneratingTrip && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-border rounded-tl-sm shadow-sm flex items-center gap-2 text-secondary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInputArea 
        onSend={handleSend} 
        disabled={isLoading || isGeneratingTrip} 
      />
    </div>
  );
};
