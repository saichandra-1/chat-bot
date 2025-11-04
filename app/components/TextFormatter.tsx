'use client';

interface TextFormatterProps {
  text: string;
}

export default function TextFormatter({ text }: TextFormatterProps) {
  // Process markdown formatting
  const formatText = (text: string) => {
    let formatted = text;
    
    // Handle all header levels (####, ###, ##, #)
    formatted = formatted.replace(/^#### (.*$)/gm, '<h4 class="text-base font-bold mt-4 mb-2 text-[var(--text-primary)]">$1</h4>');
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-5 mb-3 text-[var(--text-primary)]">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-[var(--text-primary)]">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 gradient-text">$1</h1>');
    
    // Handle horizontal rules (---, ***, ___) - more flexible
    formatted = formatted.replace(/^[-*_]{3,}$/gm, '<hr class="my-6 border-[var(--border-color)]">');
    
    // Handle unordered lists (- item, * item)
    formatted = formatted.replace(/^[-*] (.*$)/gm, '<li class="ml-6 mb-1.5 text-[var(--text-primary)] list-disc">$1</li>');
    
    // Handle ordered lists (1. item)
    formatted = formatted.replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6 mb-1.5 text-[var(--text-primary)] list-decimal">$2</li>');
    
    // Handle bold text **text** (but not ***text***)
    formatted = formatted.replace(/(?<!\*)\*\*([^*]+)\*\*(?!\*)/g, '<strong class="font-bold text-[var(--text-primary)]">$1</strong>');
    
    // Handle italic text *text* (but not **text** or ***text***)
    formatted = formatted.replace(/(?<!\*)\*([^*\s][^*]*[^*\s])\*(?!\*)/g, '<em class="italic text-[var(--text-secondary)]">$1</em>');
    
    // Handle inline code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-2 py-0.5 rounded-md text-sm font-mono border border-[var(--border-color)]">$1</code>');
    
    // Handle links [text](url)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-blue-400 hover:underline font-medium">$1</a>');
    
    // Handle line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  const formattedText = formatText(text);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: formattedText }}
      className="prose prose-sm max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-a:text-blue-500 dark:prose-a:text-blue-400"
    />
  );
}
