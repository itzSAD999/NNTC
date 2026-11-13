import { GalleryList } from "@/components/admin/gallery-list";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { listGalleryAlbums } from "@/lib/data/admin-gallery";

export default async function AdminGalleryPage() {
  await requireContentStaff();
  const albums = await listGalleryAlbums();

  return (
    <AdminListShell section="gallery" preview={listLooksPreviewed(albums)}>
      <GalleryList albums={albums} />
    </AdminListShell>
  );
}
