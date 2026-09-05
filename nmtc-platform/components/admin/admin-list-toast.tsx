"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

const NOTICE_MESSAGES: Record<string, string> = {
  published: "Published on the public site.",
  unpublished: "Moved to draft — hidden from visitors.",
  pinned: "Pinned to top of the list.",
  unpinned: "Unpinned from the list.",
  updated: "Changes saved.",
  deactivated: "Account deactivated.",
};

export function AdminListToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const notice = searchParams.get("notice");
  const [visible, setVisible] = useState(Boolean(notice));

  useEffect(() => {
    if (!notice) return;
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      const url = new URL(window.location.href);
      url.searchParams.delete("notice");
      router.replace(url.pathname + url.search, { scroll: false });
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [notice, router]);

  if (!notice || !visible) return null;

  const message = NOTICE_MESSAGES[notice] ?? "Updated successfully.";

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm rounded border border-line bg-ink px-4 py-3 text-sm text-white shadow-lg"
      )}
    >
      {message}
    </div>
  );
}
