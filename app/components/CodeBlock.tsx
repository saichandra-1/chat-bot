'use client';

import { useState, useEffect } from 'react';
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

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
    <div className="relative group my-4 overflow-hidden rounded-xl shadow-lg border border-[var(--border-color)]">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-4 py-2.5 border-b border-[var(--border-color)]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-all duration-200 border border-[var(--border-color)] text-[var(--text-primary)] hover:shadow-md transform hover:scale-105 active:scale-95"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code block */}
      <div className="relative overflow-x-auto bg-[var(--bg-tertiary)]">
        <Highlighter
          language={language}
          style={syntaxTheme}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '14px',
            lineHeight: '1.6',
            minWidth: '100%',
            padding: '1rem',
            background: isDarkMode ? '#1e293b' : '#f8fafc',
          }}
          showLineNumbers={true}
          wrapLines={true}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: isDarkMode ? '#64748b' : '#94a3b8',
            userSelect: 'none',
          }}
        >
          {code}
        </Highlighter>
      </div>
    </div>
  );
}
