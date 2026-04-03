'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const canSend = message.trim().length > 0 && !isLoading;

  const send = () => {
    const nextMessage = message.trim();
    if (!nextMessage || isLoading) {
      return;
    }

    onSendMessage(nextMessage);
    setMessage('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    send();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`;
  }, [message]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message your assistant..."
            rows={1}
            maxLength={4000}
            disabled={isLoading}
            className="max-h-[180px] min-h-[52px] flex-1 resize-none rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-4 py-3 text-[15px] leading-relaxed text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-teal-500/30"
          />

          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
            style={{ backgroundImage: 'var(--user-gradient)' }}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-1 text-xs text-[var(--text-muted)]">
          <span className="hidden sm:inline">Enter to send, Shift+Enter for a new line</span>
          <span className="sm:hidden">Enter to send</span>
          <span>{message.length}/4000</span>
        </div>
      </form>
    </div>
  );
}
