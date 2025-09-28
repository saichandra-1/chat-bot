'use client';

interface TextFormatterProps {
  text: string;
}

export default function TextFormatter({ text }: TextFormatterProps) {
  // Process markdown formatting
  const formatText = (text: string) => {
    let formatted = text;
    
    // Handle all header levels (####, ###, ##, #)
    formatted = formatted.replace(/^#### (.*$)/gm, '<h4 class="text-base font-semibold mt-3 mb-2">$1</h4>');
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
    
    // Handle horizontal rules (---, ***, ___) - more flexible
    formatted = formatted.replace(/^[-*_]{3,}$/gm, '<hr class="my-4 border-gray-300">');
    
    // Handle unordered lists (- item, * item)
    formatted = formatted.replace(/^[-*] (.*$)/gm, '<li class="ml-4">• $1</li>');
    
    // Handle ordered lists (1. item)
    formatted = formatted.replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$1. $2</li>');
    
    // Handle bold text **text** (but not ***text***)
    formatted = formatted.replace(/(?<!\*)\*\*([^*]+)\*\*(?!\*)/g, '<strong>$1</strong>');
    
    // Handle italic text *text* (but not **text** or ***text***)
    formatted = formatted.replace(/(?<!\*)\*([^*\s][^*]*[^*\s])\*(?!\*)/g, '<em>$1</em>');
    
    // Handle inline code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Handle line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  const formattedText = formatText(text);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: formattedText }}
      className="prose prose-sm max-w-none"
    />
  );
}
