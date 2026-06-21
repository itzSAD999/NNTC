"use client";

import Link from "next/link";

import { toggleResourcePublishedForm } from "@/lib/actions/resources";
import type { Resource } from "@/lib/types/expansion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function ResourcesList({ resources }: { resources: Resource[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/admin/resources/new">New resource</Link>
        </Button>
      </div>
      {resources.length === 0 ? (
        <EmptyState message="No resources yet." />
      ) : (
        <div className="overflow-x-auto rounded border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-widest text-caption">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/resources/${r.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-caption">{r.category}</td>
                  <td className="px-4 py-3 ref-mono text-caption">{r.sort_order}</td>
                  <td className="px-4 py-3 text-caption">
                    {r.is_published ? "Published" : "Draft"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleResourcePublishedForm}>
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="hidden"
                        name="is_published"
                        value={String(r.is_published)}
                      />
                      <Button type="submit" size="sm" variant="outline">
                        {r.is_published ? "Unpublish" : "Publish"}
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
