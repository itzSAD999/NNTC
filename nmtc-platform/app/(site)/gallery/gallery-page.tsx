import type { Metadata } from "next";

import { GalleryGrid } from "@/components/marketing/gallery-grid";
import { PageHeader } from "@/components/layout/page-header";
import { getGalleryAlbums } from "@/lib/data/gallery";
import { getSettings } from "@/lib/data/settings";

interface GalleryPageProps {
  searchParams: Promise<{ album?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `Gallery — ${settings.college_name}`,
    description: `Photos and videos from ${settings.college_name}.`,
  };
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const sp = await searchParams;
  const [albums, settings] = await Promise.all([
    getGalleryAlbums(),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Media"
        title="Gallery"
        description={`Campus life, events, and activities at ${settings.college_name}.`}
      />
      <GalleryGrid albums={albums} initialAlbumSlug={sp.album} />
    </>
  );
}
