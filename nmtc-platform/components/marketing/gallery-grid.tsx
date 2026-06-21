"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { GalleryAlbumWithMedia, GalleryMedia } from "@/lib/types/expansion";
import { getStoragePublicUrl } from "@/lib/utils/format";

type FlatMedia = GalleryMedia & { albumTitle: string };

function flattenAlbums(albums: GalleryAlbumWithMedia[]): FlatMedia[] {
  return albums.flatMap((a) =>
    a.media.map((m) => ({ ...m, albumTitle: a.title }))
  );
}

export function GalleryGrid({
  albums,
  initialAlbumSlug,
}: {
  albums: GalleryAlbumWithMedia[];
  initialAlbumSlug?: string;
}) {
  const [activeSlug, setActiveSlug] = useState<string>(
    initialAlbumSlug ?? "all"
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeSlug === "all"
      ? albums
      : albums.filter((a) => a.slug === activeSlug);

  const items = flattenAlbums(filtered);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + items.length) % items.length
    );
  }, [items.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % items.length
    );
  }, [items.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, goPrev, goNext]);

  return (
    <div className="section-grid py-12 md:py-16">
      <div className="flex flex-wrap gap-2 border-b border-line pb-6">
        <button
          type="button"
          onClick={() => setActiveSlug("all")}
          className={`rounded px-3 py-1.5 text-sm ${
            activeSlug === "all"
              ? "bg-primary text-white"
              : "border border-line text-caption hover:text-ink"
          }`}
        >
          All
        </button>
        {albums.map((album) => (
          <button
            key={album.id}
            type="button"
            onClick={() => setActiveSlug(album.slug)}
            className={`rounded px-3 py-1.5 text-sm ${
              activeSlug === album.slug
                ? "bg-primary text-white"
                : "border border-line text-caption hover:text-ink"
            }`}
          >
            {album.title}
          </button>
        ))}
      </div>

      {items.length > 0 ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => {
            const url =
              item.type === "image"
                ? getStoragePublicUrl(item.url)
                : item.url.startsWith("http")
                  ? item.url
                  : getStoragePublicUrl(item.url);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openLightbox(index)}
                className="group relative aspect-square overflow-hidden rounded border border-line bg-bg text-left"
              >
                {item.type === "image" && url ? (
                  <Image
                    src={url}
                    alt={item.caption ?? item.albumTitle}
                    fill
                    className="object-cover transition-transform group-hover:scale-[1.03]"
                    sizes="25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-ink/5 text-xs text-caption">
                    Video
                  </div>
                )}
                {item.caption ? (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {item.caption}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 text-center text-caption">
          Gallery images will appear here once uploaded.
        </p>
      )}

      {lightboxIndex !== null && items[lightboxIndex] ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded p-2 text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 rounded p-2 text-white hover:bg-white/10"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-14 rounded p-2 text-white hover:bg-white/10"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <LightboxContent item={items[lightboxIndex]} />
        </div>
      ) : null}
    </div>
  );
}

function LightboxContent({ item }: { item: FlatMedia }) {
  const url =
    item.type === "image"
      ? getStoragePublicUrl(item.url)
      : item.url.startsWith("http")
        ? item.url
        : getStoragePublicUrl(item.url);

  if (item.type === "video" && url) {
    return (
      <div className="max-h-[85vh] max-w-5xl">
        <video src={url} controls className="max-h-[85vh] w-full" />
        {item.caption ? (
          <p className="mt-2 text-center text-sm text-white/80">{item.caption}</p>
        ) : null}
      </div>
    );
  }

  if (!url) return null;

  return (
    <div className="relative max-h-[85vh] w-full max-w-5xl">
      <Image
        src={url}
        alt={item.caption ?? ""}
        width={1200}
        height={800}
        className="mx-auto max-h-[85vh] w-auto object-contain"
      />
      {item.caption ? (
        <p className="mt-2 text-center text-sm text-white/80">{item.caption}</p>
      ) : null}
    </div>
  );
}
