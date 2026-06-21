"use client";

import Link from "next/link";

import { toggleProgramPublishedForm } from "@/lib/actions/programs";
import type { ProgramWithDepartment } from "@/lib/types/expansion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function ProgramsList({ programs }: { programs: ProgramWithDepartment[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/admin/programs/new">New programme</Link>
        </Button>
      </div>

      {programs.length === 0 ? (
        <EmptyState message="No programmes yet. Create your first programme." />
      ) : (
        <div className="overflow-x-auto rounded border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-widest text-caption">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/programs/${program.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {program.name}
                    </Link>
                    <p className="text-xs text-caption">/{program.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-caption">
                    {program.department?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 ref-mono text-caption">
                    {program.sort_order}
                  </td>
                  <td className="px-4 py-3 text-caption">
                    {program.is_published ? "Published" : "Draft"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleProgramPublishedForm}>
                      <input type="hidden" name="id" value={program.id} />
                      <Button type="submit" size="sm" variant="outline">
                        {program.is_published ? "Unpublish" : "Publish"}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
