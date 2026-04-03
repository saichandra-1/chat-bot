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
    <div className="my-4 overflow-x-auto rounded-2xl border border-[var(--assistant-border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-sm)]">
      <div className="inline-block min-w-full overflow-hidden rounded-2xl">
        <table className="min-w-full divide-y divide-[var(--border-soft)]">
          <thead className="bg-[var(--bg-muted)]/75">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border-r border-[var(--border-soft)] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] last:border-r-0"
                >
                  <TextFormatter text={header} />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-soft)] bg-[var(--bg-surface)]">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition-colors duration-150 hover:bg-[var(--bg-elevated)]">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-r border-[var(--border-soft)] px-5 py-4 text-sm text-[var(--text-primary)] last:border-r-0"
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
