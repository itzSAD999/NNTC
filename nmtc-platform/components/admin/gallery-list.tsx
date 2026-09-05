"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { GalleryAlbumWithMedia } from "@/lib/types/expansion";
import { matchesSearch } from "@/lib/admin/list-filters";
import { AdminListFilterBar } from "@/components/admin/admin-list-filters";
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

export function GalleryList({ albums }: { albums: GalleryAlbumWithMedia[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return albums.filter((album) =>
      matchesSearch(search, [album.title, album.slug])
    );
  }, [albums, search]);

  if (albums.length === 0) {
    return (
      <EmptyState
        title="No albums yet"
        message="Create an album below, then add photos and videos."
      />
    );
  }

  return (
    <div className="space-y-4">
      <AdminListFilterBar
        search={search}
        onSearchChange={setSearch}
        showStatus={false}
        searchPlaceholder="Search albums…"
        total={albums.length}
        filtered={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState message="No albums match your search." />
      ) : (
        <AdminListResults
          table={
            <AdminTable minWidth="640px">
              <AdminTableHead>
                <AdminTableTh>Album</AdminTableTh>
                <AdminTableTh>Media</AdminTableTh>
                <AdminTableTh>Order</AdminTableTh>
                <AdminTableTh>Actions</AdminTableTh>
              </AdminTableHead>
              <tbody>
                {filtered.map((album) => (
                  <tr
                    key={album.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{album.title}</p>
                      <PublicLinkPreview
                        basePath="/gallery"
                        slug={album.slug}
                      />
                    </td>
                    <td className="px-4 py-3 text-caption">
                      {album.media.length} item
                      {album.media.length === 1 ? "" : "s"}
                    </td>
                    <td className="px-4 py-3 ref-mono text-caption">
                      {album.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/admin/gallery/${album.id}`}>
                          Manage album
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          }
          cards={filtered.map((album) => (
            <AdminMobileCard key={album.id}>
              <div className="space-y-3">
                <p className="font-medium text-ink">{album.title}</p>
                <PublicLinkPreview basePath="/gallery" slug={album.slug} />
                <p className="text-xs text-caption">
                  {album.media.length} media · Order {album.sort_order}
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/admin/gallery/${album.id}`}>
                    Manage album
                  </Link>
                </Button>
              </div>
            </AdminMobileCard>
          ))}
        />
      )}
    </div>
  );
}
