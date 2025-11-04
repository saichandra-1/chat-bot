'use client';

import { Message } from '@/app/types/chat';
import { Bot, User } from 'lucide-react';
import CodeBlock from './CodeBlock';
import Table from './Table';
import TextFormatter from './TextFormatter';
import { parseMessageContent } from '@/app/utils/messageParser';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const parsedContent = parseMessageContent(message.content);
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${
          isUser 
            ? 'gradient-bg' 
            : 'bg-[var(--bg-tertiary)] border border-[var(--border-color)]'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-[var(--text-primary)]" />
          )}
        </div>
        <div className={`flex flex-col gap-1 ${
          isUser ? 'items-end' : 'items-start'
        }`}>
          <div className={`rounded-2xl px-5 py-3 shadow-md hover:shadow-lg transition-all duration-200 ${
            isUser 
              ? 'gradient-bg text-white rounded-tr-sm' 
              : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-tl-sm'
          }`}>
            <div className="text-sm leading-relaxed">
              {parsedContent.map((part, index) => (
                <div key={index}>
                  {part.type === 'text' ? (
                    <div className={isUser ? 'text-white' : 'text-[var(--text-primary)]'}>
                      <TextFormatter text={part.content} />
                    </div>
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
          <p className={`text-xs px-2 ${
            isUser 
              ? 'text-[var(--text-tertiary)]' 
              : 'text-[var(--text-tertiary)]'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}
