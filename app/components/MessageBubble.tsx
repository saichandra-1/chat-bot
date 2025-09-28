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
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-gray-500'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        <div className={`rounded-lg px-4 py-2 ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="text-sm">
            {parsedContent.map((part, index) => (
              <div key={index}>
                {part.type === 'text' ? (
                  <div>
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
          <p className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
