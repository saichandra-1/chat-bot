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
    <div className="my-4 overflow-x-auto">
      <div className="inline-block min-w-full shadow-sm rounded-lg border border-gray-300 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                >
                  <TextFormatter text={header} />
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 last:border-r-0"
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
