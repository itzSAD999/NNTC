"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

import { toggleProgramPublishedForm } from "@/lib/actions/programs";
import type { ProgramWithDepartment } from "@/lib/types/expansion";
import {
  matchesPublishFilter,
  matchesSearch,
  uniqueSorted,
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
import { ListThumb } from "@/components/admin/list-thumb";
import { PublicLinkPreview } from "@/components/admin/admin-help";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

function getProgramImage(program: ProgramWithDepartment): string {
  const slug = (program.slug || "").toLowerCase();
  const name = (program.name || "").toLowerCase();
  if (slug.includes("midwifer") || name.includes("midwifer")) {
    return "/images/admissions-guide-student.jpg";
  }
  if (slug.includes("community") || name.includes("community")) {
    return "/images/healthcare-team.jpg";
  }
  if (
    slug.includes("general") ||
    name.includes("general") ||
    slug.includes("nurs") ||
    name.includes("nurs")
  ) {
    return "/images/clinical-care.jpg";
  }
  return "/images/clinical-theatre.jpg";
}

function ProgramActions({ program }: { program: ProgramWithDepartment }) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={toggleProgramPublishedForm}>
        <input type="hidden" name="id" value={program.id} />
        <Button type="submit" size="sm" variant="outline">
          {program.is_published ? "Unpublish" : "Publish"}
        </Button>
      </form>
      <Button asChild size="sm" variant="ghost">
        <Link href={`/dashboard/admin/programs/${program.id}`}>Edit</Link>
      </Button>
    </div>
  );
}

function ProgramsListContent({ programs }: { programs: ProgramWithDepartment[] }) {
  const filters = useAdminListFilters();
  const departments = useMemo(
    () =>
      uniqueSorted(
        programs.map((p) => p.department?.name).filter(Boolean) as string[]
      ),
    [programs]
  );

  const filtered = useMemo(() => {
    return programs.filter((program) => {
      if (
        !matchesSearch(filters.search, [
          program.name,
          program.slug,
          program.department?.name,
        ])
      ) {
        return false;
      }
      if (!matchesPublishFilter(filters.status, program.is_published)) {
        return false;
      }
      if (
        filters.category !== "all" &&
        program.department?.name !== filters.category
      ) {
        return false;
      }
      return true;
    });
  }, [programs, filters.search, filters.status, filters.category]);

  if (programs.length === 0) {
    return (
      <EmptyState message="No programmes yet. Create your first programme." />
    );
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
        categoryLabel="Department"
        categoryOptions={departments.map((d) => ({ value: d, label: d }))}
        searchPlaceholder="Search programmes…"
        total={programs.length}
        filtered={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState message="No programmes match your filters." />
      ) : (
        <AdminListResults
          table={
            <AdminTable minWidth="720px">
              <AdminTableHead>
                <AdminTableTh>Cover</AdminTableTh>
                <AdminTableTh>Name</AdminTableTh>
                <AdminTableTh>Department</AdminTableTh>
                <AdminTableTh>Order</AdminTableTh>
                <AdminTableTh>Status</AdminTableTh>
                <AdminTableTh>Actions</AdminTableTh>
              </AdminTableHead>
              <tbody>
                {filtered.map((program) => (
                  <tr
                    key={program.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-4 py-3">
                      <ListThumb
                        src={getProgramImage(program)}
                        alt={program.name}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/admin/programs/${program.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {program.name}
                      </Link>
                      <PublicLinkPreview
                        basePath="/programs"
                        slug={program.slug}
                      />
                    </td>
                    <td className="px-4 py-3 text-caption">
                      {program.department?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 ref-mono text-caption">
                      {program.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <CmsStatusBadge published={program.is_published} />
                    </td>
                    <td className="px-4 py-3">
                      <ProgramActions program={program} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          }
          cards={filtered.map((program) => (
            <AdminMobileCard key={program.id}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ListThumb
                    src={getProgramImage(program)}
                    alt={program.name}
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/admin/programs/${program.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {program.name}
                    </Link>
                    <PublicLinkPreview
                      basePath="/programs"
                      slug={program.slug}
                    />
                  </div>
                </div>
                <p className="text-xs text-caption">
                  {program.department?.name ?? "No department"} · Order{" "}
                  {program.sort_order}
                </p>
                <CmsStatusBadge published={program.is_published} />
                <ProgramActions program={program} />
              </div>
            </AdminMobileCard>
          ))}
        />
      )}
    </div>
  );
}

export function ProgramsList({
  programs,
}: {
  programs: ProgramWithDepartment[];
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AdminListToast />
      </Suspense>
      <ProgramsListContent programs={programs} />
    </>
  );
}
