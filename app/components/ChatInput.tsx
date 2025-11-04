'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MAX_HEIGHT_PX = 200; // ~10-12 lines depending on line-height

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // allow newline insertion
        return;
      }
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(message.trim());
        setMessage('');
      }
    }
  };

  // Auto-resize the textarea up to a max height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const nextHeight = Math.min(el.scrollHeight, MAX_HEIGHT_PX);
    el.style.height = `${nextHeight}px`;
  }, [message]);

  return (
    <div className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] backdrop-blur-sm sticky bottom-0">
      <div className="flex items-end justify-center px-4 sm:px-6 md:px-8 py-4">
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything"
                rows={1}
                className="w-full resize-none px-5 py-3.5 pr-14 border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] shadow-sm hover:shadow-md transition-all duration-200"
                style={{ maxHeight: `${MAX_HEIGHT_PX}px` }}
                disabled={isLoading}
              />
              
            </div>
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="w-12 h-12 gradient-bg text-white rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg disabled:transform-none flex-shrink-0 self-end"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
