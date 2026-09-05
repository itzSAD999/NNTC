"use client";

import { useMemo, useState } from "react";

import { markContactReadForm } from "@/lib/actions/contact";
import type { ContactMessage } from "@/types/database";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InboxView({ messages }: { messages: ContactMessage[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [readFilter, setReadFilter] = useState<"all" | "unread">("all");

  const filteredMessages = useMemo(() => {
    if (readFilter === "unread") {
      return messages.filter((m) => !m.is_read);
    }
    return messages;
  }, [messages, readFilter]);
  const selected = filteredMessages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-caption">
          {unreadCount === 0
            ? "All messages read."
            : `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}.`}
        </p>
        <select
          value={readFilter}
          onChange={(e) => {
            setReadFilter(e.target.value as "all" | "unread");
            setSelectedId(null);
          }}
          className="flex h-9 rounded border border-line bg-surface px-3 text-sm"
        >
          <option value="all">All messages</option>
          <option value="unread">Unread only</option>
        </select>
      </div>

      {messages.length === 0 ? (
        <EmptyState message="No contact messages yet." />
      ) : filteredMessages.length === 0 ? (
        <EmptyState message="No unread messages." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <ul
            className={cn(
              "max-h-[70vh] overflow-y-auto rounded border border-line bg-surface",
              selected && "hidden lg:block"
            )}
          >
            {filteredMessages.map((msg) => (
              <li key={msg.id} className="border-b border-line last:border-0">
                <button
                  type="button"
                  onClick={() => setSelectedId(msg.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors hover:bg-secondary/50",
                    selectedId === msg.id && "border-l-2 border-l-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm",
                        msg.is_read ? "text-caption" : "font-medium text-ink"
                      )}
                    >
                      {msg.subject}
                    </p>
                    {!msg.is_read ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-caption">{msg.name}</p>
                  <p className="text-xs text-caption">
                    {formatDate(msg.created_at)}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <article className="rounded border border-line bg-surface p-6">
              <button
                type="button"
                className="mb-4 text-sm font-medium text-primary hover:underline lg:hidden"
                onClick={() => setSelectedId(null)}
              >
                ← Back to messages
              </button>
              <header className="border-b border-line pb-4">
                <h2 className="font-serif text-display-sm">{selected.subject}</h2>
                <p className="mt-2 text-sm text-caption">
                  From {selected.name} ·{" "}
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-primary hover:underline"
                  >
                    {selected.email}
                  </a>
                  {selected.phone ? ` · ${selected.phone}` : ""}
                </p>
                <p className="mt-1 text-xs text-caption">
                  Received {formatDate(selected.created_at)}
                </p>
              </header>
              <div className="mt-4 whitespace-pre-wrap text-sm text-ink">
                {selected.message}
              </div>
              {!selected.is_read ? (
                <form action={markContactReadForm} className="mt-6">
                  <input type="hidden" name="id" value={selected.id} />
                  <Button type="submit" size="sm">
                    Mark as read
                  </Button>
                </form>
              ) : (
                <p className="mt-6 text-xs text-caption">Marked as read</p>
              )}
            </article>
          ) : (
            <div className="hidden items-center justify-center rounded border border-dashed border-line bg-bg p-10 text-sm text-caption lg:flex">
              Select a message to read it.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
