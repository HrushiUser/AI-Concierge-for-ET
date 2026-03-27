import { Message } from '../lib/supabase';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, idx) => {
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const withEmoji = boldLine;
      return (
        <div key={idx} className="mb-1">
          <div dangerouslySetInnerHTML={{ __html: withEmoji }} />
        </div>
      );
    });
  };

  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
        isUser
          ? 'bg-gradient-to-br from-blue-600 to-blue-700'
          : 'bg-gradient-to-br from-gray-700 to-gray-800'
      }`}>
        {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
      </div>
      <div className={`flex-1 max-w-2xl ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-5 py-3.5 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm shadow-md'
            : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200 shadow-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {formatMessage(message.content)}
          </p>
        </div>
      </div>
    </div>
  );
}
