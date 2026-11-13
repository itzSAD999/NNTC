"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pin } from "lucide-react";

import { MEDIA } from "@/lib/media";
import { formatShortDate, getStoragePublicUrl } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/database";

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

interface NewsMobileCarouselProps {
  posts: Post[];
}

export function NewsMobileCarousel({ posts }: NewsMobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalCards = posts.length + 1;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 300;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(index, totalCards - 1)));
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    scrollToIndex(Math.max(0, activeIndex - 1));
  };

  const handleNext = () => {
    scrollToIndex(Math.min(totalCards - 1, activeIndex + 1));
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div className="lg:hidden mt-6">
      {/* Swipeable track with CSS snap & smooth vertical pass-through */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 overscroll-x-contain"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {posts.map((post, idx) => {
          const coverUrl = coverFor(post);
          const date = post.published_at ? formatShortDate(post.published_at) : null;

          return (
            <article
              key={post.id}
              className={cn(
                "group snap-start shrink-0 w-[84vw] max-w-[340px] flex flex-col overflow-hidden rounded-none border bg-white shadow-sm transition-all duration-300 hover:border-primary hover:bg-primary/[0.015] hover:shadow-md",
                activeIndex === idx ? "border-primary/60 shadow-md" : "border-line"
              )}
            >
              <Link
                href={`/news/${post.slug}`}
                className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#f3f3f3]"
                tabIndex={-1}
                aria-hidden
              >
                <Image
                  src={coverUrl}
                  alt=""
                  fill
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 85vw, 340px"
                />
              </Link>

              <div className="flex flex-1 flex-col p-5">
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

                <h3 className="mt-2.5 font-serif text-lg leading-snug text-ink line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                  <Link href={`/news/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h3>

                {post.excerpt ? (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-caption line-clamp-3">
                    {post.excerpt}
                  </p>
                ) : null}

                <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
                  <Link
                    href={`/news/${post.slug}`}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Read story
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <span className="text-[11px] font-medium text-caption">
                    {idx + 1} of {posts.length}
                  </span>
                </div>
              </div>
            </article>
          );
        })}

        {/* Final Slide: "See More Stories" Dedicated Action Card */}
        <article
          className={cn(
            "group snap-start shrink-0 w-[84vw] max-w-[340px] flex flex-col justify-between overflow-hidden rounded-none border p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-primary hover:bg-primary/[0.04] hover:shadow-md",
            activeIndex === posts.length
              ? "border-primary bg-primary/[0.03] shadow-md"
              : "border-primary/20 bg-primary/[0.015]"
          )}
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-none border border-primary/30 bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
              <ArrowRight className="h-6 w-6" />
            </div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary">
              Official Archive
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
              See More Stories
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-caption">
              Browse the complete archive of student activities, clinical postings, matriculation ceremonies, and public advisories from Nandom NMTC.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-primary/20">
            <Link
              href="/news"
              className="inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
            >
              <span>Explore All News &amp; Bulletins</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>

      {/* Swipe navigation & indicator dots */}
      <div className="mt-2 flex items-center justify-between px-1">
        {/* Visual swipe hint */}
        <span className="text-xs font-medium text-caption flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5 text-primary animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Swipe stories
        </span>

        {/* Carousel indicator dots */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Stories navigation">
          {Array.from({ length: totalCards }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={i === posts.length ? "Go to see more stories" : `Go to story ${i + 1}`}
              aria-selected={activeIndex === i}
              role="tab"
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                activeIndex === i
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-line hover:bg-caption"
              )}
            />
          ))}
        </div>

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous story"
            className="flex h-7 w-7 items-center justify-center rounded-none border border-line bg-white text-ink transition hover:bg-surface disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={activeIndex === totalCards - 1}
            aria-label="Next story"
            className="flex h-7 w-7 items-center justify-center rounded-none border border-line bg-white text-ink transition hover:bg-surface disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
