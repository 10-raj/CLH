import { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage } from '../types';
import { processUserQueryAdvanced, AIResponse } from '../utils/aiMatcher';

export interface EnhancedChatMessage extends ChatMessage {
  navigationLinks?: { label: string; path: string }[];
}

interface AIChatContextType {
  messages: EnhancedChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  clearChat: () => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: EnhancedChatMessage = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));

    const response: AIResponse = processUserQueryAdvanced(content);

    const aiMessage: EnhancedChatMessage = {
      id: crypto.randomUUID(),
      content: response.text,
      sender: 'ai',
      timestamp: new Date(),
      navigationLinks: response.navigationLinks,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const toggleChat = () => setIsOpen(prev => !prev);
  const clearChat = () => setMessages([]);

  return (
    <AIChatContext.Provider value={{ messages, isOpen, isLoading, sendMessage, toggleChat, clearChat }}>
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
}
