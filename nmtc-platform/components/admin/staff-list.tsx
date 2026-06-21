"use client";

import Link from "next/link";

import { toggleStaffPublishedForm } from "@/lib/actions/staff";
import type { StaffProfileWithDepartment } from "@/lib/types/expansion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function StaffList({ staff }: { staff: StaffProfileWithDepartment[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/admin/staff/new">New profile</Link>
        </Button>
      </div>
      {staff.length === 0 ? (
        <EmptyState message="No staff profiles yet." />
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
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/staff/${s.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {s.full_name}
                    </Link>
                    <p className="text-xs text-caption">/{s.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-caption">
                    {s.department?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 ref-mono text-caption">{s.sort_order}</td>
                  <td className="px-4 py-3 text-caption">
                    {s.is_published ? "Published" : "Draft"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleStaffPublishedForm}>
                      <input type="hidden" name="id" value={s.id} />
                      <input
                        type="hidden"
                        name="is_published"
                        value={String(s.is_published)}
                      />
                      <Button type="submit" size="sm" variant="outline">
                        {s.is_published ? "Unpublish" : "Publish"}
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
