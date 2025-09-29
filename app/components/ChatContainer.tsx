'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/app/types/chat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Bot, AlertCircle } from 'lucide-react';

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 429) {
          setError('API quota exceeded. Please check your OpenRouter usage limits or try again later.');
        } else if (response.status === 401) {
          setError('Invalid OpenRouter API key. Please check your key configuration.');
        } else if (response.status === 402) {
          setError('OpenRouter account needs credits. Please add credits to your account.');
        } else if (response.status === 500) {
          setError(data.error || 'Server error. Please try again.');
        } else {
          setError(data.error || 'Failed to get response. Please try again.');
        }
        return;
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Reload"
            title="Reload"
          >
            <Bot className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Chatbot</h1>
            <p className="text-sm text-gray-500">Powered by OpenAI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bot className="w-16 h-16 mb-4 text-gray-300" />
            <h2 className="text-xl font-medium mb-2">Welcome to AI Chatbot!</h2>
            <p className="text-center max-w-md">
              Start a conversation by typing a message below. I'm here to help answer your questions and have engaging discussions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is typing...</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium text-sm mb-1">Error</h3>
              <p className="text-red-700 text-sm mb-2">{error}</p>
              {error.includes('quota') && (
                <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                  <strong>How to fix:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    <li>Visit <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Billing</a> to add credits</li>
                    <li>Check your usage limits in your OpenAI dashboard</li>
                    <li>Consider upgrading your OpenAI plan if needed</li>
                  </ul>
                </div>
              )}
              {error.includes('API key') && (
                <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                  <strong>How to fix:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    <li>Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">OpenRouter API Keys</a></li>
                    <li>Ensure your key starts with "sk-or-" (OpenRouter format)</li>
                    <li>Check the API key is correctly set in the code</li>
                    <li>Restart the development server after updating the key</li>
                  </ul>
                </div>
              )}
              {error.includes('credits') && (
                <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                  <strong>How to fix:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    <li>Add credits at <a href="https://openrouter.ai/settings/credits" target="_blank" rel="noopener noreferrer" className="underline">OpenRouter Credits</a></li>
                    <li>Minimum $5-10 should be enough for testing</li>
                    <li>Check your account balance and usage</li>
                    <li>Consider upgrading your OpenRouter plan</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
