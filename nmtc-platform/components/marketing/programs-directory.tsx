"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ProgramCard } from "@/components/marketing/program-card";
import { Reveal } from "@/components/motion/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import type { ProgramWithDepartment } from "@/lib/types/expansion";

export function ProgramsDirectory({
  programs,
}: {
  programs: ProgramWithDepartment[];
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return programs;
    return programs.filter((p) =>
      [p.name, p.department?.name, p.qualification, p.duration]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [programs, q]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-caption" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search programmes…"
          className="pl-9"
          aria-label="Search programmes"
        />
      </div>
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((program, i) => (
            <Reveal key={program.id} delay={i * 80}>
              <ProgramCard program={program} />
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState message="No programmes match that search." />
      )}
    </div>
  );
}
