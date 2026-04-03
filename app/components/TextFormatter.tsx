'use client';

interface TextFormatterProps {
  text: string;
}

export default function TextFormatter({ text }: TextFormatterProps) {
  // Process markdown formatting
  const formatText = (text: string) => {
    let formatted = text;
    
    // Handle all header levels (####, ###, ##, #)
    formatted = formatted.replace(/^#### (.*$)/gm, '<h4 class="mb-2 mt-4 text-base font-bold text-[var(--text-primary)]">$1</h4>');
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="mb-3 mt-5 text-lg font-bold text-[var(--text-primary)]">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="mb-3 mt-6 text-xl font-bold text-[var(--text-primary)]">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="gradient-text mb-4 mt-6 text-2xl font-bold">$1</h1>');
    
    // Handle horizontal rules (---, ***, ___) - more flexible
    formatted = formatted.replace(/^[-*_]{3,}$/gm, '<hr class="my-6 border-[var(--border-soft)]">');
    
    // Handle unordered lists (- item, * item)
    formatted = formatted.replace(/^[-*] (.*$)/gm, '<li class="mb-1.5 ml-6 list-disc text-[var(--text-primary)]">$1</li>');
    
    // Handle ordered lists (1. item)
    formatted = formatted.replace(/^(\d+)\. (.*$)/gm, '<li class="mb-1.5 ml-6 list-decimal text-[var(--text-primary)]">$2</li>');
    
    // Handle bold text **text** (but not ***text***)
    formatted = formatted.replace(/(?<!\*)\*\*([^*]+)\*\*(?!\*)/g, '<strong class="font-bold text-[var(--text-primary)]">$1</strong>');
    
    // Handle italic text *text* (but not **text** or ***text***)
    formatted = formatted.replace(/(?<!\*)\*([^*\s][^*]*[^*\s])\*(?!\*)/g, '<em class="italic text-[var(--text-secondary)]">$1</em>');
    
    // Handle inline code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="rounded-md border border-[var(--border-soft)] bg-[var(--bg-muted)] px-2 py-0.5 font-mono text-sm text-[var(--text-primary)]">$1</code>');
    
    // Handle links [text](url)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="font-medium text-[var(--brand-primary)] underline-offset-2 hover:underline">$1</a>');
    
    // Handle line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  const formattedText = formatText(text);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: formattedText }}
      className="prose prose-sm max-w-none leading-relaxed prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-a:text-[var(--brand-primary)]"
    />
  );
}
