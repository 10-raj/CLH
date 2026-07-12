import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, MessageCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAIChat, EnhancedChatMessage } from '../../context/AIChatContext';
import { CONTACT_INFO } from '../../utils/aiMatcher';

const suggestedQuestions = [
  'Show me upcoming hikes',
  'How can I donate?',
  'Tell me about your mission',
  'How do I volunteer?',
  'Show me the gallery',
  'Who are your sponsors?',
];

function MessageBubble({ msg }: { msg: EnhancedChatMessage }) {
  const isAI = msg.sender === 'ai';

  const renderText = (text: string) => {
    const parts = text.split(/(mailto:[^\s]+|tel:[^\s]+|https?:\/\/[^\s]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('mailto:')) {
        return (
          <a key={i} href={part} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors">
            {part.replace('mailto:', '')}
          </a>
        );
      }
      if (part.startsWith('tel:')) {
        return (
          <a key={i} href={part} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors">
            {part.replace('tel:', '')}
          </a>
        );
      }
      if (part.startsWith('http')) return null;
      return <span key={i}>{part}</span>;
    });
  };

  const processedText = (text: string) => {
    return text
      .replace(CONTACT_INFO.email, `mailto:${CONTACT_INFO.email}`)
      .replace(CONTACT_INFO.phone, `tel:+977${CONTACT_INFO.phone}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`max-w-[88%] ${isAI ? '' : ''}`}>
        <div
          className={`
            p-3.5 rounded-2xl text-sm leading-relaxed
            ${isAI
              ? 'bg-white/10 text-gray-200 rounded-bl-sm'
              : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-br-sm'
            }
          `}
        >
          <p className="whitespace-pre-line">{renderText(processedText(msg.content))}</p>
        </div>

        {/* Navigation links */}
        {isAI && msg.navigationLinks && msg.navigationLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {msg.navigationLinks.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AIChatbox() {
  const { messages, isOpen, isLoading, sendMessage, toggleChat } = useAIChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed md:absolute inset-0 md:inset-auto md:bottom-20 md:right-0 w-full md:w-96 h-full md:h-[520px] md:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/95 to-emerald-950/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-500/20 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">CleanHike AI</h3>
                  <p className="text-emerald-400 text-xs">Your adventure guide</p>
                </div>
              </div>
              <button onClick={toggleChat} className="p-2 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <Bot className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                  <h4 className="text-white font-semibold mb-2">Welcome to CleanHike AI</h4>
                  <p className="text-gray-400 text-sm mb-5">
                    Ask me about hikes, donations, events, sponsors, volunteering, or anything about CleanHike Nepal!
                  </p>
                  <div className="space-y-2 w-full">
                    <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                    {suggestedQuestions.map((q, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => sendMessage(q)}
                        className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-sm transition-all border border-white/5 hover:border-emerald-500/30 text-left"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    <MessageBubble key={msg.id} msg={msg} />
                  ))}
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-white/10 p-4 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Contact quick access */}
            <div className="px-4 pb-2 flex gap-2">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex-1 text-center py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-emerald-400 transition-all border border-white/5"
              >
                {CONTACT_INFO.email}
              </a>
              <a
                href={`tel:+977${CONTACT_INFO.phone}`}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-emerald-400 transition-all border border-white/5"
              >
                Call
              </a>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about hikes, donations..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
        style={{ animation: isOpen ? 'none' : 'bounce 2s ease-in-out infinite' }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {!isOpen && messages.length === 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center pointer-events-none"
        >
          <span className="text-xs text-white font-bold">1</span>
        </motion.div>
      )}
    </div>
  );
}
