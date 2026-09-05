import Image from "next/image";
import Link from "next/link";
import { Pin } from "lucide-react";

import { formatShortDate, getStoragePublicUrl } from "@/lib/utils/format";
import type { Post } from "@/types/database";

interface NewsCardProps {
  post: Post;
  featured?: boolean;
}

export function NewsCard({ post, featured = false }: NewsCardProps) {
  const coverUrl = getStoragePublicUrl(post.cover_image_url);
  const date = post.published_at
    ? formatShortDate(post.published_at)
    : null;

  return (
    <article
      className={`institutional-card group flex flex-col overflow-hidden ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      }`}
    >
      <Link
        href={`/news/${post.slug}`}
        className={`relative block bg-bg ${featured ? "min-h-[200px]" : "aspect-[16/10]"}`}
        tabIndex={-1}
        aria-hidden
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes={featured ? "50vw" : "33vw"}
          />
        ) : (
          <div className="flex h-full min-h-[160px] items-end bg-gradient-to-br from-bg to-line/60 p-4">
            <span className="text-xs uppercase tracking-widest text-caption">
              {post.category}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-caption">
          <span className="font-medium uppercase tracking-wider text-primary">
            {post.category}
          </span>
          {date ? <span aria-hidden>·</span> : null}
          {date ? <time dateTime={post.published_at!}>{date}</time> : null}
          {post.is_pinned ? (
            <span className="inline-flex items-center gap-1 rounded bg-bg px-1.5 py-0.5 text-caption">
              <Pin className="h-3 w-3" aria-hidden />
              Pinned
            </span>
          ) : null}
        </div>

        <h2 className="mt-3 font-serif text-lg leading-snug md:text-xl">
          <Link
            href={`/news/${post.slug}`}
            className="text-ink hover:text-primary"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-caption">
            {post.excerpt}
          </p>
        ) : null}

        <Link
          href={`/news/${post.slug}`}
          className="mt-4 text-sm font-medium text-primary hover:text-primary-deep"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}
