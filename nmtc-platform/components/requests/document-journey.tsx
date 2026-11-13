"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Search, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = [
  { href: "/request", label: "Request", hint: "Choose documents", icon: FileText },
  { href: "/request/track", label: "Track", hint: "Check status", icon: Search },
  { href: "/verify", label: "Verify", hint: "QR / reference", icon: ShieldCheck },
] as const;

export function DocumentJourney() {
  const pathname = usePathname();

  return (
    <nav aria-label="Document services" className="border border-line bg-white">
      <ol className="grid grid-cols-1 sm:grid-cols-3">
        {STEPS.map((step, i) => {
          const active =
            pathname === step.href ||
            (step.href !== "/request" && pathname.startsWith(step.href));
          const Icon = step.icon;
          return (
            <li key={step.href} className={cn(i > 0 && "border-t border-line sm:border-t-0 sm:border-l")}>
              <Link
                href={step.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 hover:bg-[#fafafa]",
                  active && "bg-primary text-white hover:bg-primary-deep"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>
                  <span className="block text-sm font-semibold">{step.label}</span>
                  <span className={cn("block text-xs", active ? "text-white/80" : "text-caption")}>
                    {step.hint}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
