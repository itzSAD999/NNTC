"use client";

import { useMemo, useState } from "react";

import { FacultyCard } from "@/components/marketing/faculty-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Department, StaffProfileWithDepartment } from "@/lib/types/expansion";

export function FacultyDirectory({
  staff,
  departments,
}: {
  staff: StaffProfileWithDepartment[];
  departments: Department[];
}) {
  const [departmentId, setDepartmentId] = useState<string>("all");

  const filtered = useMemo(() => {
    if (departmentId === "all") return staff;
    return staff.filter((s) => s.department_id === departmentId);
  }, [staff, departmentId]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <label htmlFor="dept-filter" className="text-sm font-medium text-ink">
          Department
        </label>
        <select
          id="dept-filter"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="h-10 rounded border border-line bg-bg px-3 text-sm"
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((profile) => (
            <FacultyCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <EmptyState message="No staff profiles match this filter." />
      )}
    </div>
  );
}
