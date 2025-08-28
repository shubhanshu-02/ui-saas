'use client';
import type { ChatMessage } from '@/types';

interface ChatHistoryProps {
  messages: ChatMessage[];
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="flex space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
            message.type === 'user' 
              ? 'bg-blue-600 text-white' 
              : message.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
          }`}>
            {message.type === 'user' ? '👤' : message.type === 'error' ? '⚠️' : '🤖'}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`p-4 rounded-xl ${
              message.type === 'user' 
                ? 'bg-blue-900/30 text-blue-100 border border-blue-800/50' 
                : message.type === 'error'
                ? 'bg-red-900/30 text-red-100 border border-red-800/50'
                : 'bg-gray-800 text-gray-100 border border-gray-700'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.component && (
                <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Component generated: {message.component.name}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
