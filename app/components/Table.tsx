'use client';

import TextFormatter from './TextFormatter';

interface TableProps {
  headers: string[];
  rows: string[][];
}

export default function Table({ headers, rows }: TableProps) {
  if (headers.length === 0 || rows.length === 0) {
    return null;
  }

  return (
    <div className="my-4 overflow-x-auto rounded-xl shadow-lg border border-[var(--border-color)]">
      <div className="inline-block min-w-full bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-[var(--border-color)]">
          {/* Table Header */}
          <thead className="bg-[var(--bg-tertiary)]">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-5 py-4 text-left text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider border-r border-[var(--border-color)] last:border-r-0"
                >
                  <TextFormatter text={header} />
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-[var(--bg-secondary)] divide-y divide-[var(--border-color)]">
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-[var(--bg-tertiary)] transition-colors duration-150"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-5 py-4 text-sm text-[var(--text-primary)] border-r border-[var(--border-color)] last:border-r-0"
                  >
                    <div className="max-w-xs break-words">
                      <TextFormatter text={cell} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
