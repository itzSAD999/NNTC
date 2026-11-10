"use client";

import { useMemo, useState } from "react";
import { Search, X, Mail, MailOpen } from "lucide-react";

import { markContactReadForm } from "@/lib/actions/contact";
import type { ContactMessage } from "@/types/database";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function InboxView({ messages }: { messages: ContactMessage[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");

  const filteredMessages = useMemo(() => {
    const q = search.trim().toLowerCase();

    return messages.filter((m) => {
      // Read status filter
      if (readFilter === "unread" && m.is_read) return false;
      if (readFilter === "read" && !m.is_read) return false;

      // Search query
      if (q) {
        const matchName = m.name.toLowerCase().includes(q);
        const matchEmail = m.email.toLowerCase().includes(q);
        const matchSubject = m.subject.toLowerCase().includes(q);
        const matchMessage = m.message.toLowerCase().includes(q);
        const matchPhone = m.phone ? m.phone.toLowerCase().includes(q) : false;
        if (!matchName && !matchEmail && !matchSubject && !matchMessage && !matchPhone) {
          return false;
        }
      }

      return true;
    });
  }, [messages, readFilter, search]);

  const selected = filteredMessages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="rounded-xl border border-line bg-surface p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-caption" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inquiries by sender, email, subject, or message content..."
              className="pl-9 text-xs sm:text-sm bg-bg/50 focus:bg-surface"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-ink text-xs"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <select
              value={readFilter}
              onChange={(e) => {
                setReadFilter(e.target.value as "all" | "unread" | "read");
                setSelectedId(null);
              }}
              className="flex h-9 w-full rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
            >
              <option value="all">All Messages ({messages.length})</option>
              <option value="unread">Unread Only ({unreadCount})</option>
              <option value="read">Read ({messages.length - unreadCount})</option>
            </select>
          </div>
        </div>

        {/* Counter and clear */}
        <div className="flex items-center justify-between text-xs text-caption pt-1 border-t border-line/50">
          <p>
            Showing <strong className="text-ink">{filteredMessages.length}</strong> of{" "}
            <strong>{messages.length}</strong> total inquiries
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-accent font-semibold">
                · {unreadCount} unread
              </span>
            )}
          </p>

          {(search || readFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setReadFilter("all");
              }}
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              <X className="h-3 w-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <EmptyState message="No contact messages yet." />
      ) : filteredMessages.length === 0 ? (
        <EmptyState message="No messages match your search or filters." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <ul
            className={cn(
              "max-h-[70vh] overflow-y-auto rounded-xl border border-line bg-surface shadow-2xs divide-y divide-line",
              selected && "hidden lg:block"
            )}
          >
            {filteredMessages.map((msg) => (
              <li key={msg.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(msg.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors hover:bg-bg/60",
                    selectedId === msg.id &&
                      "border-l-[3px] border-l-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-xs truncate",
                        msg.is_read ? "text-caption" : "font-semibold text-ink"
                      )}
                    >
                      {msg.subject}
                    </p>
                    {!msg.is_read ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-caption truncate">{msg.name}</p>
                  <p className="text-[0.65rem] text-caption font-mono mt-0.5">
                    {formatDate(msg.created_at)}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <article className="rounded-xl border border-line bg-surface p-6 shadow-2xs">
              <button
                type="button"
                className="mb-4 text-xs font-semibold text-primary hover:underline lg:hidden"
                onClick={() => setSelectedId(null)}
              >
                ← Back to message list
              </button>
              <header className="border-b border-line pb-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-lg font-bold text-ink">
                    {selected.subject}
                  </h2>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider",
                      selected.is_read
                        ? "bg-bg text-caption"
                        : "bg-accent/10 text-accent"
                    )}
                  >
                    {selected.is_read ? "Read" : "Unread"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-caption space-y-0.5">
                  <p>
                    From <strong className="text-ink">{selected.name}</strong> ·{" "}
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-primary hover:underline font-mono"
                    >
                      {selected.email}
                    </a>
                    {selected.phone ? ` · ${selected.phone}` : ""}
                  </p>
                  <p className="font-mono text-[0.7rem]">
                    Received {formatDate(selected.created_at)}
                  </p>
                </div>
              </header>
              <div className="mt-5 whitespace-pre-wrap text-sm text-ink leading-relaxed bg-bg/40 rounded-lg p-4 border border-line/40">
                {selected.message}
              </div>
              <div className="mt-6 flex items-center justify-between">
                {!selected.is_read ? (
                  <form action={markContactReadForm}>
                    <input type="hidden" name="id" value={selected.id} />
                    <Button type="submit" size="sm">
                      Mark as read
                    </Button>
                  </form>
                ) : (
                  <p className="text-xs text-caption font-medium">
                    ✓ Marked as read
                  </p>
                )}
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:border-primary hover:text-primary transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>Reply by Email</span>
                </a>
              </div>
            </article>
          ) : (
            <div className="hidden items-center justify-center rounded-xl border border-dashed border-line bg-bg/40 p-12 text-xs text-caption lg:flex flex-col gap-2">
              <MailOpen className="h-8 w-8 text-caption/40" />
              <span>Select an inquiry from the list to read details and reply.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
