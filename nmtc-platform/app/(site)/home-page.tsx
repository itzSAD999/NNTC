import Link from "next/link";

import { ExploreStrip } from "@/components/marketing/explore-strip";
import { HeroSection } from "@/components/marketing/hero-section";
import { HighlightsStrip } from "@/components/marketing/highlights-strip";
import { ImpactStatsStrip } from "@/components/marketing/impact-stats-strip";
import { HomeCtaBand } from "@/components/marketing/home-cta-band";
import { EventsHomeStrip } from "@/components/marketing/events-home-strip";
import { NewsCard } from "@/components/marketing/news-card";
import { Button } from "@/components/ui/button";
import { getAboutContent } from "@/lib/data/about";
import { getUpcomingEvents } from "@/lib/data/events";
import { getLatestPosts } from "@/lib/data/posts";
import { getSettings } from "@/lib/data/settings";

export default async function HomePage() {
  const [settings, posts, about, events] = await Promise.all([
    getSettings(),
    getLatestPosts(3),
    getAboutContent(),
    getUpcomingEvents(3),
  ]);

  const highlights =
    about.core_values.length >= 3
      ? about.core_values.slice(0, 3)
      : [
          "Accredited nursing & midwifery training",
          "Serving the Upper West Region",
          "Clinical excellence & compassion",
        ];

  return (
    <>
      <HeroSection settings={settings} />
      <HighlightsStrip items={highlights} />
      <ImpactStatsStrip />
      <ExploreStrip />
      <EventsHomeStrip events={events} />

      <section aria-labelledby="news-heading" className="section-grid border-b border-line py-16 md:py-20">
        <div className="hairline-b flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow">The NMTC Gazette</p>
            <h2
              id="news-heading"
              className="mt-3 font-serif text-display-md md:text-display-lg"
            >
              Latest announcements
            </h2>
            <p className="mt-2 text-caption">
              News and updates from the college.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/news">View all news</Link>
          </Button>
        </div>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <NewsCard key={post.id} post={post} featured={i === 0} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded border border-line bg-surface p-8 text-center text-caption">
            Announcements will appear here once published.
          </p>
        )}
      </section>

      <HomeCtaBand />
    </>
  );
}
