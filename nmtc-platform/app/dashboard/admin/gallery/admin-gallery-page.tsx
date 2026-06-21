import { GalleryEditor } from "@/components/admin/gallery-editor";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listGalleryAlbums } from "@/lib/data/admin-gallery";

export default async function AdminGalleryPage() {
  await requireContentStaff();
  const albums = await listGalleryAlbums();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Gallery CMS</h1>
        <p className="mt-2 text-caption">
          Manage albums and upload images or video links.
        </p>
      </header>
      <GalleryEditor albums={albums} />
    </div>
  );
}
