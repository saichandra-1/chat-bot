'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Bot, Menu, Sparkles, Wifi } from 'lucide-react';
import type { ChatSession, Message } from '@/app/types/chat';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

const QUICK_PROMPTS = [
  'Summarize today\'s important tech updates in 5 bullets.',
  'Help me plan a focused 2-hour study routine.',
  'Write a clean README template for my project.',
  'Explain this bug like I am a junior developer.',
];

const createSessionId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const createSession = (): ChatSession => ({
  id: createSessionId(),
  title: 'New Chat',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export default function ChatContainer() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncLayout = () => {
      const desktop = mediaQuery.matches;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };

    syncLayout();
    mediaQuery.addEventListener('change', syncLayout);
    return () => mediaQuery.removeEventListener('change', syncLayout);
  }, []);

  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (!savedSessions) {
      return;
    }

    try {
      const parsed = JSON.parse(savedSessions) as ChatSession[];
      const hydrated = parsed.map((session) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        })),
      }));

      setSessions(hydrated);
    } catch (storageError) {
      console.error('Failed to restore chat sessions from localStorage:', storageError);
      localStorage.removeItem('chatSessions');
    }
  }, []);

  useEffect(() => {
    if (sessions.length === 0) {
      localStorage.removeItem('chatSessions');
      return;
    }

    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === currentSessionId) ?? null,
    [sessions, currentSessionId],
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const createNewChat = () => {
    const existingEmptySession = sessions.find((session) => session.messages.length === 0);
    if (existingEmptySession) {
      selectSession(existingEmptySession.id);
      return;
    }

    const hasConversationHistory = sessions.some((session) => session.messages.length > 0);
    if (!hasConversationHistory) {
      setCurrentSessionId(null);
      setMessages([]);
      setError(null);
      if (!isDesktop) {
        setSidebarOpen(false);
      }
      return;
    }

    const session = createSession();
    setSessions((prev) => [session, ...prev]);
    setCurrentSessionId(session.id);
    setMessages([]);
    setError(null);

    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  const selectSession = (id: string) => {
    const selectedSession = sessions.find((session) => session.id === id);
    if (!selectedSession) {
      return;
    }

    setCurrentSessionId(id);
    setMessages(selectedSession.messages);
    setError(null);

    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));

    if (currentSessionId === id) {
      setCurrentSessionId(null);
      setMessages([]);
      setError(null);
    }
  };

  const updateSession = (sessionId: string, newMessages: Message[]) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) {
          return session;
        }

        const titleSource =
          newMessages.find((message) => message.role === 'user')?.content ||
          newMessages[0]?.content ||
          'New Chat';
        const title = titleSource.length > 38 ? `${titleSource.slice(0, 38)}...` : titleSource;

        return {
          ...session,
          title,
          messages: newMessages,
          updatedAt: new Date(),
        };
      }),
    );
  };

  const sendMessage = async (rawMessage: string) => {
    const content = rawMessage.trim();
    if (!content || isLoading) {
      return;
    }

    let activeSessionId = currentSessionId;
    let baseMessages = messages;

    if (!activeSessionId) {
      const existingEmptySession = sessions.find((session) => session.messages.length === 0);

      if (existingEmptySession) {
        activeSessionId = existingEmptySession.id;
        baseMessages = existingEmptySession.messages;
        setCurrentSessionId(existingEmptySession.id);
        setMessages(existingEmptySession.messages);
        setError(null);
      } else {
        const newSession = createSession();
        activeSessionId = newSession.id;
        baseMessages = [];

        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setMessages([]);
        setError(null);
      }
    }

    const userMessage: Message = {
      id: createSessionId(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const nextMessages = [...baseMessages, userMessage];
    setMessages(nextMessages);
    updateSession(activeSessionId, nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      let data: { message?: string; error?: string } = {};
      try {
        data = (await response.json()) as { message?: string; error?: string };
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 429) {
          setError('API quota exceeded. Please check your OpenRouter usage limits or try again later.');
        } else if (response.status === 401) {
          setError('Invalid OpenRouter API key. Please check your key configuration.');
        } else if (response.status === 402) {
          setError('OpenRouter account needs credits. Please add credits to your account.');
        } else if (response.status === 500) {
          setError(data.error || 'Server error. Please try again.');
        } else {
          setError(data.error || 'Failed to get response. Please try again.');
        }
        return;
      }

      if (!data.message) {
        setError('Received an empty response. Please try again.');
        return;
      }

      const assistantMessage: Message = {
        id: createSessionId(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      const updatedMessages = [...nextMessages, assistantMessage];
      setMessages(updatedMessages);
      updateSession(activeSessionId, updatedMessages);
    } catch (requestError) {
      console.error('Error sending message:', requestError);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-dvh overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)]">
      <div className="h-full">
        <div className="relative flex h-full overflow-hidden bg-[var(--bg-panel)]">
          {!isDesktop && sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 z-20 bg-black/45"
              aria-label="Close sidebar"
            />
          )}

          {isDesktop ? (
            <aside
              className={`relative z-10 shrink-0 overflow-hidden bg-[var(--bg-surface)] transition-[width] duration-300 ${
                sidebarOpen ? 'w-[300px] border-r border-[var(--border-hard)]' : 'w-0'
              }`}
            >
              {sidebarOpen && (
                <Sidebar
                  sessions={sessions}
                  currentSessionId={currentSessionId}
                  onNewChat={createNewChat}
                  onSelectSession={selectSession}
                  onDeleteSession={deleteSession}
                  onToggleSidebar={() => setSidebarOpen(false)}
                />
              )}
            </aside>
          ) : (
            <aside
              className={`absolute inset-y-0 left-0 z-30 w-[280px] shrink-0 border-r border-[var(--border-hard)] bg-[var(--bg-surface)] transition-transform duration-300 sm:w-[300px] ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <Sidebar
                sessions={sessions}
                currentSessionId={currentSessionId}
                onNewChat={createNewChat}
                onSelectSession={selectSession}
                onDeleteSession={deleteSession}
                onToggleSidebar={() => setSidebarOpen(false)}
              />
            </aside>
          )}

          <section className="relative flex min-w-0 flex-1 flex-col">
            <header className="relative border-b border-[var(--border-soft)] bg-[var(--bg-surface)]/90 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4">
              {!sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="absolute left-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:-translate-y-[55%] hover:bg-[var(--bg-muted)] sm:left-6"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-4 w-4" />
                </button>
              )}

              <div className={`flex w-full items-center justify-between gap-3 ${!sidebarOpen ? 'pl-12 sm:pl-14' : ''}`}>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="brand-chip flex h-10 w-10 items-center justify-center rounded-xl">
                    <Bot className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Neural Workspace
                    </p>
                    <p className="truncate text-base font-semibold text-[var(--text-primary)]">
                      {activeSession?.title || 'New Conversation'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden items-center gap-1.5 rounded-full border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] sm:inline-flex">
                    <Wifi className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                    Connected
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
                {messages.length === 0 ? (
                  <div className="flex min-h-[52vh] flex-col items-center justify-center rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-surface)]/80 px-6 py-10 text-center shadow-[var(--shadow-md)]">
                    <div className="relative mb-6">
                      <div className="absolute -inset-5 rounded-full bg-teal-400/20 blur-2xl dark:bg-teal-300/15" />
                      <div className="brand-chip relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl">
                        <Sparkles className="h-8 w-8" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                      Ask, build, and iterate faster
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-[var(--text-secondary)] sm:text-base">
                      Start with a prompt below or type your own request to begin a new thread.
                    </p>

                    <div className="mt-7 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendMessage(prompt)}
                          className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-3 text-left text-sm text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:text-[var(--text-primary)]"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}

                    {isLoading && (
                      <div className="message-enter flex justify-start">
                        <div className="flex items-center gap-3 rounded-2xl border border-[var(--assistant-border)] bg-[var(--assistant-bg)] px-4 py-3 text-sm text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
                          <div className="flex items-center gap-1.5">
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                          </div>
                          Thinking
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {error && (
              <div className="mx-auto w-full max-w-5xl px-4 pb-3 sm:px-6">
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="px-4 py-4 sm:px-6">
              <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
