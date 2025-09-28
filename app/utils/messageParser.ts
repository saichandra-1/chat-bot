export interface ParsedContent {
  type: 'text' | 'code' | 'table';
  content: string;
  language?: string;
  headers?: string[];
  rows?: string[][];
}

export function parseMessageContent(content: string): ParsedContent[] {
  const parts: ParsedContent[] = [];
  
  // Regular expression to match code blocks (triple backticks)
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  
  // Regular expression to match markdown tables
  const tableRegex = /(\|.*\|[\r\n]+(?:\|[\s\-\|]*\|[\r\n]+)*\|.*\|)/g;
  
  let lastIndex = 0;
  let match;

  // First, find all code blocks and tables
  const allMatches: Array<{type: 'code' | 'table', match: RegExpExecArray, index: number}> = [];

  // Find code blocks
  while ((match = codeBlockRegex.exec(content)) !== null) {
    allMatches.push({type: 'code', match, index: match.index});
  }

  // Find tables
  while ((match = tableRegex.exec(content)) !== null) {
    allMatches.push({type: 'table', match, index: match.index});
  }

  // Sort by position in content
  allMatches.sort((a, b) => a.index - b.index);

  // Process matches in order
  for (const {type, match, index} of allMatches) {
    // Add text before the match
    if (index > lastIndex) {
      const textContent = content.slice(lastIndex, index).trim();
      if (textContent) {
        parts.push({
          type: 'text',
          content: textContent,
        });
      }
    }

    if (type === 'code') {
      // Add the code block
      const language = match[1] || 'text';
      const code = match[2].trim();
      
      parts.push({
        type: 'code',
        content: code,
        language: language,
      });
    } else if (type === 'table') {
      // Parse the table
      const tableContent = match[0];
      const {headers, rows} = parseMarkdownTable(tableContent);
      
      parts.push({
        type: 'table',
        content: tableContent,
        headers,
        rows,
      });
    }

    lastIndex = index + match[0].length;
  }

  // Add remaining text after the last match
  if (lastIndex < content.length) {
    const textContent = content.slice(lastIndex).trim();
    if (textContent) {
      parts.push({
        type: 'text',
        content: textContent,
      });
    }
  }

  // If no special content found, return the entire content as text
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content: content,
    });
  }

  return parts;
}

function parseMarkdownTable(tableContent: string): {headers: string[], rows: string[][]} {
  const lines = tableContent.trim().split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return {headers: [], rows: []};
  }

  // Parse header row
  const headerLine = lines[0];
  const headers = headerLine.split('|')
    .map(cell => cell.trim())
    .filter(cell => cell !== '');

  // Parse data rows (skip separator line)
  const dataLines = lines.slice(2); // Skip header and separator
  const rows: string[][] = [];

  for (const line of dataLines) {
    const cells = line.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '');
    
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return {headers, rows};
}
