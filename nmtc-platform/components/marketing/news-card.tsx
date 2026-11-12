import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Pin } from "lucide-react";

import { formatShortDate, getStoragePublicUrl } from "@/lib/utils/format";
import type { Post } from "@/types/database";

interface NewsCardProps {
  post: Post;
  featured?: boolean;
}

// Category fallback photography
const CATEGORY_IMAGES: Record<string, string> = {
  academics: "/images/lecture-hall.jpg",
  clinical: "/images/clinical-care.jpg",
  admissions: "/images/graduation.jpg",
  general: "/images/healthcare-team.jpg",
};

export function NewsCard({ post, featured = false }: NewsCardProps) {
  const catKey = post.category ? post.category.toLowerCase() : "general";
  const defaultPhoto = CATEGORY_IMAGES[catKey] || "/images/healthcare-team.jpg";
  const coverUrl = getStoragePublicUrl(post.cover_image_url) ?? defaultPhoto;
  const date = post.published_at ? formatShortDate(post.published_at) : null;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-none border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      }`}
    >
      <Link
        href={`/news/${post.slug}`}
        className={`relative block overflow-hidden bg-bg ${
          featured ? "min-h-[260px] md:h-full" : "aspect-[16/10]"
        }`}
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={coverUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? "50vw" : "33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {post.is_pinned ? (
          <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-none bg-accent px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-white shadow-md">
            <Pin className="h-3 w-3" />
            <span>Pinned Bulletin</span>
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-caption">
          <span className="rounded-none bg-primary/10 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-primary border border-primary/20">
            {post.category || "Bulletin"}
          </span>
          {date ? <span className="text-line">•</span> : null}
          {date ? (
            <time dateTime={post.published_at!} className="flex items-center gap-1 text-caption font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{date}</span>
            </time>
          ) : null}
        </div>

        <h3 className="mt-3.5 font-serif text-xl sm:text-2xl font-medium leading-snug tracking-tight text-ink transition-colors group-hover:text-primary">
          <Link href={`/news/${post.slug}`}>{post.title}</Link>
        </h3>

        {post.excerpt ? (
          <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-caption font-light">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
          <span className="text-xs text-caption font-medium">The NMTC Gazette</span>
          <Link
            href={`/news/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover:text-primary-deep"
          >
            <span>Read full article</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
