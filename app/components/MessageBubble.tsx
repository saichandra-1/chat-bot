'use client';

import { useState } from 'react';
import { Bot, Check, Copy, User } from 'lucide-react';
import type { Message } from '@/app/types/chat';
import { parseMessageContent } from '@/app/utils/messageParser';
import CodeBlock from './CodeBlock';
import Table from './Table';
import TextFormatter from './TextFormatter';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const parsedContent = parseMessageContent(message.content);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (copyError) {
      console.error('Failed to copy message:', copyError);
    }
  };

  return (
    <div className={`message-enter flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[min(92%,58rem)] items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm shadow-[var(--shadow-sm)] ${
            isUser
              ? 'border-transparent bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'border-transparent text-white'
          }`}
          style={!isUser ? { backgroundImage: 'var(--user-gradient)' } : undefined}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        <div className={`flex min-w-0 flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`group relative w-full overflow-hidden rounded-2xl border px-4 py-3 shadow-[var(--shadow-sm)] ${
              isUser
                ? 'border-transparent text-white'
                : 'border-[var(--assistant-border)] bg-[var(--assistant-bg)] text-[var(--text-primary)]'
            }`}
            style={isUser ? { backgroundImage: 'var(--user-gradient)' } : undefined}
          >
            <button
              type="button"
              onClick={copyToClipboard}
              className={`absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg opacity-0 transition group-hover:opacity-100 ${
                isUser
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
              }`}
              title="Copy message"
              aria-label="Copy message"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            <div className={`pr-9 text-sm leading-7 ${isUser ? 'text-white' : 'text-[var(--text-primary)]'}`}>
              {parsedContent.map((part, index) => (
                <div key={`${message.id}-${index}`}>
                  {part.type === 'text' ? (
                    <TextFormatter text={part.content} />
                  ) : part.type === 'code' ? (
                    <div className="my-2">
                      <CodeBlock code={part.content} language={part.language || 'text'} />
                    </div>
                  ) : part.type === 'table' ? (
                    <div className="my-2">
                      <Table headers={part.headers || []} rows={part.rows || []} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-1 px-1 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            {isUser ? 'You' : 'Assistant'} •{' '}
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}
