'use client';

import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isDarkMode] = useState(true); // You can make this dynamic later

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const syntaxTheme = isDarkMode ? oneDark : oneLight;
  // react-syntax-highlighter's types can be incompatible with React 18/19 typings in some toolchains.
  // Cast to a generic component type to satisfy TS without affecting runtime behavior.
  const Highlighter = SyntaxHighlighter as unknown as React.ComponentType<SyntaxHighlighterProps>;

  return (
    <div className="relative group my-4 overflow-hidden">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg border-b border-gray-700">
        <span className="text-sm font-medium">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code block */}
      <div className="relative overflow-x-auto">
        <Highlighter
          language={language}
          style={syntaxTheme}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 8px 8px',
            fontSize: '14px',
            lineHeight: '1.5',
            minWidth: '100%',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {code}
        </Highlighter>
      </div>
    </div>
  );
}
