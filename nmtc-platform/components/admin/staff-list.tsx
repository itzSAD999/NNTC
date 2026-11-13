"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";

import { toggleStaffPublishedForm } from "@/lib/actions/staff";
import type { StaffProfileWithDepartment } from "@/lib/types/expansion";
import { matchesSearch } from "@/lib/admin/list-filters";
import { ListThumb } from "@/components/admin/list-thumb";
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
import { PublicLinkPreview } from "@/components/admin/admin-help";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

function StaffActions({ profile }: { profile: StaffProfileWithDepartment }) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={toggleStaffPublishedForm}>
        <input type="hidden" name="id" value={profile.id} />
        <input
          type="hidden"
          name="is_published"
          value={String(profile.is_published)}
        />
        <Button type="submit" size="sm" variant="outline">
          {profile.is_published ? "Unpublish" : "Publish"}
        </Button>
      </form>
      <Button asChild size="sm" variant="ghost">
        <Link href={`/dashboard/admin/staff/${profile.id}`}>Edit</Link>
      </Button>
    </div>
  );
}

function StaffListContent({
  staff,
}: {
  staff: StaffProfileWithDepartment[];
}) {
  const filters = useAdminListFilters();

  const filtered = useMemo(() => {
    return staff.filter((s) =>
      matchesSearch(filters.search, [
        s.full_name,
        s.slug,
        s.job_title,
        s.department?.name,
      ])
    );
  }, [staff, filters.search]);

  if (staff.length === 0) {
    return <EmptyState message="No staff profiles yet." />;
  }

  return (
    <div className="space-y-4">
      <AdminListFilterBar
        search={filters.search}
        onSearchChange={filters.setSearch}
        showStatus={false}
        searchPlaceholder="Search staff…"
        total={staff.length}
        filtered={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState message="No profiles match your filters." />
      ) : (
        <AdminListResults
          table={
            <AdminTable minWidth="720px">
              <AdminTableHead>
                <AdminTableTh>Photo</AdminTableTh>
                <AdminTableTh>Name</AdminTableTh>
                <AdminTableTh>Department</AdminTableTh>
                <AdminTableTh>Order</AdminTableTh>
                <AdminTableTh>Status</AdminTableTh>
                <AdminTableTh>Actions</AdminTableTh>
              </AdminTableHead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-4 py-3">
                      <ListThumb src={s.photo_url} alt={s.full_name} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/admin/staff/${s.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {s.full_name}
                      </Link>
                      <PublicLinkPreview basePath="/faculty" slug={s.slug} />
                    </td>
                    <td className="px-4 py-3 text-caption">
                      {s.department?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 ref-mono text-caption">
                      {s.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <CmsStatusBadge published={s.is_published} />
                    </td>
                    <td className="px-4 py-3">
                      <StaffActions profile={s} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          }
          cards={filtered.map((s) => (
            <AdminMobileCard key={s.id}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ListThumb src={s.photo_url} alt={s.full_name} />
                  <Link
                    href={`/dashboard/admin/staff/${s.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {s.full_name}
                  </Link>
                  <PublicLinkPreview basePath="/faculty" slug={s.slug} />
                </div>
                <p className="text-xs text-caption">
                  {s.department?.name ?? "—"} · {s.job_title}
                </p>
                <CmsStatusBadge published={s.is_published} />
                <StaffActions profile={s} />
              </div>
            </AdminMobileCard>
          ))}
        />
      )}
    </div>
  );
}

export function StaffList({ staff }: { staff: StaffProfileWithDepartment[] }) {
  return (
    <>
      <Suspense fallback={null}>
        <AdminListToast />
      </Suspense>
      <StaffListContent staff={staff} />
    </>
  );
}
