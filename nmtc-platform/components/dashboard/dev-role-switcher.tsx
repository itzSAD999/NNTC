"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setDevPreviewRole } from "@/lib/auth/dev-preview-actions";
import type { Role } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DevRoleSwitcherProps {
  currentRole: Role;
  options: { role: Role; label: string }[];
}

export function DevRoleSwitcher({ currentRole, options }: DevRoleSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchRole(role: Role) {
    startTransition(async () => {
      await setDevPreviewRole(role);
      router.refresh();
    });
  }

  return (
    <div className="border-b border-warning/40 bg-warning/10 px-4 py-3 lg:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-warning">
        Dev preview mode
      </p>
      <p className="mt-1 text-xs text-caption">
        Auth is bypassed locally. Switch role to preview each dashboard — remove{" "}
        <code className="ref-mono">DEV_AUTH_BYPASS</code> before production.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map(({ role, label }) => (
          <button
            key={role}
            type="button"
            disabled={pending}
            onClick={() => switchRole(role)}
            className={cn(
              "rounded border px-3 py-1.5 text-xs font-medium transition-colors",
              currentRole === role
                ? "border-primary bg-primary text-white"
                : "border-line bg-surface text-ink hover:bg-bg"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
