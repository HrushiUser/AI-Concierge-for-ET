import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { RecommendationCard } from './RecommendationCard';
import { AIConcierge } from '../lib/aiConcierge';
import { supabase, Message } from '../lib/supabase';
import { Service } from '../lib/services';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Service[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conciergeRef = useRef<AIConcierge>(new AIConcierge());

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showRecommendations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    const tempUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(tempUserId);

    const { data: conversation } = await supabase
      .from('conversations')
      .insert({
        user_id: tempUserId,
        messages: [],
        profiling_data: {}
      })
      .select()
      .single();

    if (conversation) {
      setConversationId(conversation.id);
    }

    const greeting = conciergeRef.current.getGreeting();
    const greetingMessage: Message = {
      role: 'assistant',
      content: greeting,
      timestamp: Date.now(),
    };
    setMessages([greetingMessage]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(async () => {
      const response = await conciergeRef.current.processMessage(input.trim());

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      const conversationState = conciergeRef.current.getConversationState();

      if (conversationState === 'profiling-complete') {
        const recs = conciergeRef.current.getProfilingData().recommendations || [];
        setRecommendations(recs);
        setShowRecommendations(true);

        for (const rec of recs) {
          await supabase
            .from('recommendations')
            .insert({
              user_id: userId,
              product_type: rec.category,
              product_name: rec.name,
              reason: rec.description,
              priority: 1,
              accepted: false
            });
        }

        await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: `${userId}@et-concierge.local`,
            name: 'User',
            profession: conciergeRef.current.getProfilingData().profession || '',
            financial_goals: conciergeRef.current.getProfilingData().goals || [],
            risk_profile: conciergeRef.current.getProfilingData().riskProfile || '',
            onboarding_complete: true
          })
          .select();
      }

      await supabase
        .from('conversations')
        .update({
          messages: [...messages, userMessage, assistantMessage],
          profiling_data: conciergeRef.current.getProfilingData()
        })
        .eq('id', conversationId);

      setLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRecommendationReason = (service: Service): string => {
    if (service.id === 'et-prime') {
      return 'Premium daily news and expert analysis';
    } else if (service.id === 'et-markets') {
      return 'Real-time market tracking and insights';
    } else if (service.id === 'et-wealth') {
      return 'Personalized wealth management guidance';
    } else if (service.id === 'mutual-funds') {
      return 'Diversified investment opportunities';
    } else if (service.id === 'et-investing') {
      return 'Learn investing from industry experts';
    } else if (service.id === 'insurance') {
      return 'Comprehensive financial protection';
    } else if (service.id === 'credit-cards') {
      return 'Premium benefits and rewards';
    } else if (service.id === 'loans') {
      return 'Quick approval, competitive rates';
    } else if (service.id === 'et-jobs') {
      return 'Curated opportunities in finance & tech';
    } else if (service.id === 'et-masterclass') {
      return 'Expert-led courses on your goals';
    } else if (service.id === 'et-events') {
      return 'Network with industry leaders';
    } else if (service.id === 'et-startup') {
      return 'Resources and funding for entrepreneurs';
    }
    return service.description;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              ET AI Concierge
            </h1>
            <p className="text-xs text-gray-600">Discover your perfect Economic Times journey</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {showRecommendations && recommendations.length > 0 && (
            <div className="mt-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Your Recommended Services</h2>
                <p className="text-sm text-gray-600">Explore these tailored options to get started</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((service) => (
                  <RecommendationCard
                    key={service.id}
                    service={service}
                    reason={getRecommendationReason(service)}
                  />
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block px-4 py-3 rounded-2xl bg-gray-100 rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 sticky bottom-0 shadow-xl">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response or ask a question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Send size={18} />
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Enter to send • Your data is secure and private</p>
        </div>
      </div>
    </div>
  );
}
