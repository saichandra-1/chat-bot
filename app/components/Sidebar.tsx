'use client';

import { Clock3, MessageSquare, PanelLeftClose, Plus, Sparkles, Trash2, UserRound } from 'lucide-react';
import type { ChatSession } from '@/app/types/chat';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onToggleSidebar: () => void;
}

function formatSessionTime(value: Date) {
  const timestamp = new Date(value);
  const now = new Date();

  if (timestamp.toDateString() === now.toDateString()) {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function Sidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onToggleSidebar,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-[var(--bg-surface)]">
      <div className="border-b border-[var(--border-soft)] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Sessions</p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">Chat History</h2>
          </div>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-soft)] text-[var(--text-secondary)] hover:-translate-y-0.5 hover:bg-[var(--bg-muted)]"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="mt-5 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-white shadow-[var(--shadow-sm)] hover:-translate-y-0.5"
          style={{ backgroundImage: 'var(--user-gradient)' }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            New chat
          </span>
          <Sparkles className="h-4 w-4 opacity-85" />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-6 text-center text-sm text-[var(--text-muted)]">
            No conversations yet.
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = currentSessionId === session.id;

            return (
              <div
                key={session.id}
                className={`group relative rounded-2xl border transition-all ${
                  isActive
                    ? 'border-teal-500/50 bg-teal-500/10 dark:border-teal-400/50 dark:bg-teal-300/10'
                    : 'border-transparent bg-[var(--bg-elevated)] hover:border-[var(--border-soft)]'
                }`}
              >
                <button type="button" onClick={() => onSelectSession(session.id)} className="w-full px-3 py-3 pr-11 text-left">
                  <div className="flex items-start gap-2">
                    <MessageSquare
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        isActive ? 'text-teal-700 dark:text-teal-300' : 'text-[var(--text-muted)]'
                      }`}
                    />
                    <p className="line-clamp-2 flex-1 text-sm font-medium text-[var(--text-primary)]">{session.title}</p>
                  </div>

                  <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                    <Clock3 className="h-3 w-3" />
                    {formatSessionTime(session.updatedAt)}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSession(session.id)}
                  className={`absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] transition ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  } hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300`}
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-[var(--border-soft)] p-4">
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="brand-chip flex h-9 w-9 items-center justify-center rounded-xl">
              <UserRound className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">Local User</p>
              <p className="truncate text-xs text-[var(--text-muted)]">OpenRouter Chat Mode</p>
            </div>
            <span className="rounded-full border border-[var(--border-soft)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
              Free
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
