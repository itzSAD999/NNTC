import { notFound } from "next/navigation";

import { GalleryAlbumEditor } from "@/components/admin/gallery-album-editor";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getGalleryAlbum } from "@/lib/data/admin-gallery";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminGalleryAlbumPage({ params }: PageProps) {
  await requireContentStaff();
  const { id } = await params;
  const album = await getGalleryAlbum(id);

  if (!album) {
    notFound();
  }

  return (
    <AdminEditShell
      listHref="/dashboard/admin/gallery"
      listLabel="Gallery"
      title={album.title}
      subtitle="Manage album details and media items."
      maxWidth="full"
    >
      <GalleryAlbumEditor album={album} />
    </AdminEditShell>
  );
}
