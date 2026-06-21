"use client";

import { useState } from "react";

import { markContactReadForm } from "@/lib/actions/contact";
import type { ContactMessage } from "@/types/database";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

export function InboxView({ messages }: { messages: ContactMessage[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(
    messages[0]?.id ?? null
  );

  const selected = messages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-caption">
        {unreadCount === 0
          ? "All messages read."
          : `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}.`}
      </p>

      {messages.length === 0 ? (
        <EmptyState message="No contact messages yet." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <ul className="max-h-[70vh] overflow-y-auto rounded border border-line bg-surface">
            {messages.map((msg) => (
              <li key={msg.id} className="border-b border-line last:border-0">
                <button
                  type="button"
                  onClick={() => setSelectedId(msg.id)}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-secondary/50 ${
                    selectedId === msg.id ? "bg-secondary/60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm ${
                        msg.is_read ? "text-caption" : "font-medium text-ink"
                      }`}
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
          ) : null}
        </div>
      )}
    </div>
  );
}
