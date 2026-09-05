import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pin } from "lucide-react";

import { ShareButtons } from "@/components/marketing/share-buttons";
import { getPostBySlug } from "@/lib/data/posts";
import { getSettings } from "@/lib/data/settings";
import { formatDate, getStoragePublicUrl } from "@/lib/utils/format";

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const settings = await getSettings();

  if (!post) {
    return { title: `Article not found — ${settings.college_name}` };
  }

  return {
    title: `${post.title} — ${settings.college_name}`,
    description: post.excerpt || post.title,
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverUrl = getStoragePublicUrl(post.cover_image_url);
  const authorName = post.author?.full_name ?? "NMTC Communications";
  const date = post.published_at ? formatDate(post.published_at) : null;

  return (
    <article>
      <header className="border-b border-line bg-surface">
        <div className="section-grid py-12 md:py-16">
          <Link
            href="/news"
            className="text-sm text-primary hover:text-primary-deep"
          >
            ← Back to news
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-caption">
            <span className="font-medium uppercase tracking-wider text-primary">
              {post.category}
            </span>
            {date && post.published_at ? (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.published_at}>{date}</time>
              </>
            ) : null}
            {post.is_pinned ? (
              <span className="inline-flex items-center gap-1 rounded bg-bg px-2 py-0.5 text-xs">
                <Pin className="h-3 w-3" aria-hidden />
                Pinned
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 max-w-3xl font-serif text-display-lg md:text-display-xl">
            {post.title}
          </h1>

          <p className="mt-4 text-sm text-caption">By {authorName}</p>
        </div>
      </header>

      {coverUrl ? (
        <div className="relative aspect-[21/9] w-full border-b border-line bg-bg">
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      ) : null}

      <div className="section-grid py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div
            className="prose-nmtc text-base leading-relaxed text-ink"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          <footer className="hairline mt-12 pt-8">
            <ShareButtons title={post.title} slug={post.slug} />
          </footer>
        </div>
      </div>
    </article>
  );
}
