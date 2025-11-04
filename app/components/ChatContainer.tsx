'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/app/types/chat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ThemeToggle from './ThemeToggle';
import { Bot, AlertCircle, Sparkles } from 'lucide-react';

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
    <div className="flex flex-col h-screen bg-[var(--bg-primary)] transition-colors duration-200">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-6 py-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              aria-label="Reload"
              title="Reload"
            >
              <Bot className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">AI Chatbot</h1>
              <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Powered by OpenAI
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] animate-fadeIn">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <Bot className="w-20 h-20 text-[var(--text-tertiary)] relative z-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">Welcome to AI Chatbot!</h2>
            <p className="text-center max-w-md text-[var(--text-secondary)] leading-relaxed">
              Start a conversation by typing a message below. I&apos;m here to help answer your questions and have engaging discussions.
            </p>
            <div className="mt-8 flex gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <div key={message.id} className="animate-slideIn" style={{ animationDelay: `${index * 0.05}s` }}>
                <MessageBubble message={message} />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-center space-x-3 bg-[var(--bg-secondary)] rounded-2xl px-5 py-3 shadow-md border border-[var(--border-color)]">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-[var(--text-secondary)] font-medium">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-lg animate-fadeIn">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-800 dark:text-red-200 font-semibold text-sm mb-1">Error</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mb-2">{error}</p>
              {error.includes('quota') && (
                <div className="text-xs text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                  <strong>How to fix:</strong>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Visit <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-800 dark:hover:text-red-200">OpenAI Billing</a> to add credits</li>
                    <li>Check your usage limits in your OpenAI dashboard</li>
                    <li>Consider upgrading your OpenAI plan if needed</li>
                  </ul>
                </div>
              )}
              {error.includes('API key') && (
                <div className="text-xs text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                  <strong>How to fix:</strong>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-800 dark:hover:text-red-200">OpenRouter API Keys</a></li>
                    <li>Ensure your key starts with &quot;sk-or-&quot; (OpenRouter format)</li>
                    <li>Check the API key is correctly set in the code</li>
                    <li>Restart the development server after updating the key</li>
                  </ul>
                </div>
              )}
              {error.includes('credits') && (
                <div className="text-xs text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                  <strong>How to fix:</strong>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Add credits at <a href="https://openrouter.ai/settings/credits" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-800 dark:hover:text-red-200">OpenRouter Credits</a></li>
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
