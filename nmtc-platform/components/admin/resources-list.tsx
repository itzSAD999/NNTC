"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";

import { toggleResourcePublishedForm } from "@/lib/actions/resources";
import type { Resource } from "@/lib/types/expansion";
import { RESOURCE_CATEGORIES } from "@/lib/validation/resource";
import {
  matchesPublishFilter,
  matchesSearch,
} from "@/lib/admin/list-filters";
import { CmsStatusBadge } from "@/components/admin/cms-status-badge";
import {
  AdminListFilterBar,
  useAdminListFilters,
} from "@/components/admin/admin-list-filters";
import { AdminListToast } from "@/components/admin/admin-list-toast";
import {
  AdminListResults,
  AdminMobileCard,
} from "@/components/admin/admin-responsive-list";
import {
  AdminTable,
  AdminTableHead,
  AdminTableTh,
} from "@/components/admin/admin-layout";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

function ResourceActions({ resource }: { resource: Resource }) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={toggleResourcePublishedForm}>
        <input type="hidden" name="id" value={resource.id} />
        <input
          type="hidden"
          name="is_published"
          value={String(resource.is_published)}
        />
        <Button type="submit" size="sm" variant="outline">
          {resource.is_published ? "Unpublish" : "Publish"}
        </Button>
      </form>
      <Button asChild size="sm" variant="ghost">
        <Link href={`/dashboard/admin/resources/${resource.id}`}>Edit</Link>
      </Button>
    </div>
  );
}

function ResourcesListContent({ resources }: { resources: Resource[] }) {
  const filters = useAdminListFilters();

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (!matchesSearch(filters.search, [r.title, r.category, r.description])) {
        return false;
      }
      if (!matchesPublishFilter(filters.status, r.is_published)) {
        return false;
      }
      if (filters.category !== "all" && r.category !== filters.category) {
        return false;
      }
      return true;
    });
  }, [resources, filters.search, filters.status, filters.category]);

  if (resources.length === 0) {
    return <EmptyState message="No resources yet." />;
  }

  return (
    <div className="space-y-4">
      <AdminListFilterBar
        search={filters.search}
        onSearchChange={filters.setSearch}
        status={filters.status}
        onStatusChange={filters.setStatus}
        category={filters.category}
        onCategoryChange={filters.setCategory}
        categoryOptions={RESOURCE_CATEGORIES.map((c) => ({
          value: c,
          label: c,
        }))}
        searchPlaceholder="Search resources…"
        total={resources.length}
        filtered={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState message="No resources match your filters." />
      ) : (
        <AdminListResults
          table={
            <AdminTable minWidth="720px">
              <AdminTableHead>
                <AdminTableTh>Title</AdminTableTh>
                <AdminTableTh>Category</AdminTableTh>
                <AdminTableTh>Order</AdminTableTh>
                <AdminTableTh>Status</AdminTableTh>
                <AdminTableTh>Actions</AdminTableTh>
              </AdminTableHead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/admin/resources/${r.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {r.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-caption">{r.category}</td>
                    <td className="px-4 py-3 ref-mono text-caption">
                      {r.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <CmsStatusBadge published={r.is_published} />
                    </td>
                    <td className="px-4 py-3">
                      <ResourceActions resource={r} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          }
          cards={filtered.map((r) => (
            <AdminMobileCard key={r.id}>
              <div className="space-y-3">
                <Link
                  href={`/dashboard/admin/resources/${r.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {r.title}
                </Link>
                <p className="text-xs text-caption">
                  {r.category} · Order {r.sort_order}
                </p>
                <CmsStatusBadge published={r.is_published} />
                <ResourceActions resource={r} />
              </div>
            </AdminMobileCard>
          ))}
        />
      )}
    </div>
  );
}

export function ResourcesList({ resources }: { resources: Resource[] }) {
  return (
    <>
      <Suspense fallback={null}>
        <AdminListToast />
      </Suspense>
      <ResourcesListContent resources={resources} />
    </>
  );
}
