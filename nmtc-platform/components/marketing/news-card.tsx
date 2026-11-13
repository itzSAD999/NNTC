import Image from "next/image";
import Link from "next/link";
import { Pin } from "lucide-react";

import { MEDIA } from "@/lib/media";
import { formatShortDate, getStoragePublicUrl } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/database";

interface NewsCardProps {
  post: Post;
  featured?: boolean;
  compact?: boolean;
}

const LOCAL_FALLBACK = "/images/campus-hero.jpg";

const CATEGORY_IMAGES: Record<string, string> = {
  academics: MEDIA.lecture,
  academic: MEDIA.lecture,
  clinical: MEDIA.clinical,
  admissions: MEDIA.graduation,
  general: MEDIA.team,
  news: MEDIA.campus,
};

function coverFor(post: Post) {
  return (
    getStoragePublicUrl(post.cover_image_url) ??
    CATEGORY_IMAGES[post.category?.toLowerCase() ?? ""] ??
    LOCAL_FALLBACK
  );
}

function Meta({ post, date }: { post: Post; date: string | null }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary">
      <span>{post.category || "News"}</span>
      {date ? (
        <>
          <span className="text-caption" aria-hidden>
            ·
          </span>
          <span className="font-medium tracking-normal text-caption normal-case">
            {date}
          </span>
        </>
      ) : null}
      {post.is_pinned ? (
        <span className="inline-flex items-center gap-1 font-medium normal-case tracking-normal text-caption">
          <Pin className="h-3 w-3" />
          Pinned
        </span>
      ) : null}
    </p>
  );
}

export function NewsCard({
  post,
  featured = false,
  compact = false,
}: NewsCardProps) {
  const coverUrl = coverFor(post);
  const date = post.published_at ? formatShortDate(post.published_at) : null;

  if (compact) {
    return (
      <article className="flex h-full flex-col border border-line bg-white p-6">
        <Meta post={post} date={date} />
        <h3 className="mt-3 font-serif text-xl leading-snug text-ink">
          <Link href={`/news/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-caption">
            {post.excerpt}
          </p>
        ) : null}
        <Link
          href={`/news/${post.slug}`}
          className="mt-5 text-sm font-semibold text-primary hover:underline"
        >
          Read more
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex overflow-hidden rounded-none border border-line bg-white",
        featured
          ? "flex-col md:min-h-[22rem] md:flex-row"
          : "flex-col"
      )}
    >
      <Link
        href={`/news/${post.slug}`}
        className={cn(
          "relative block shrink-0 overflow-hidden bg-[#f3f3f3]",
          featured ? "min-h-[16rem] md:w-[46%] md:min-h-full" : "aspect-[16/10]"
        )}
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={coverUrl}
          alt=""
          fill
          className="object-cover object-center"
          sizes={featured ? "50vw" : "33vw"}
        />
      </Link>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <Meta post={post} date={date} />
        <h3
          className={cn(
            "mt-3 font-serif leading-snug text-ink",
            featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
          )}
        >
          <Link href={`/news/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-caption sm:text-base">
            {post.excerpt}
          </p>
        ) : null}
        <Link
          href={`/news/${post.slug}`}
          className="mt-6 text-sm font-semibold text-primary hover:underline"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}
