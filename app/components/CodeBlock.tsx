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
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[var(--assistant-border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--border-soft)] bg-[var(--bg-muted)]/70 px-4 py-2.5 text-[var(--text-secondary)]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">{language}</span>
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-primary)] hover:-translate-y-0.5 hover:bg-[var(--bg-muted)]"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="font-medium text-green-600 dark:text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="relative overflow-x-auto bg-[var(--bg-elevated)]">
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
            background: isDarkMode ? '#152233' : '#f6f9fc',
          }}
          showLineNumbers={true}
          wrapLines={true}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: isDarkMode ? '#6f839a' : '#8b9ab0',
            userSelect: 'none',
          }}
        >
          {code}
        </Highlighter>
      </div>
    </div>
  );
}
