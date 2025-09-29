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
    <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-2 p-4 bg-transparent">
      <div className="w-full max-w-4xl">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="w-full resize-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-auto bg-white"
          style={{ maxHeight: `${MAX_HEIGHT_PX}px` }}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  );
}
