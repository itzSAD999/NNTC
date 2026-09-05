import Link from "next/link";

import { NewAlbumForm } from "@/components/admin/gallery-album-editor";
import { GalleryList } from "@/components/admin/gallery-list";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listGalleryAlbums } from "@/lib/data/admin-gallery";
import { Button } from "@/components/ui/button";

export default async function AdminGalleryPage() {
  await requireContentStaff();
  const albums = await listGalleryAlbums();

  return (
    <AdminListShell
      section="gallery"
      action={
        <Button asChild variant="outline">
          <Link href="#new-album">New album</Link>
        </Button>
      }
    >
      <GalleryList albums={albums} />
      <div id="new-album">
        <NewAlbumForm />
      </div>
    </AdminListShell>
  );
}
