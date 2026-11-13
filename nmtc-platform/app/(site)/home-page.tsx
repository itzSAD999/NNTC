import Link from "next/link";

import { ExploreStrip } from "@/components/marketing/explore-strip";
import { HeroSection } from "@/components/marketing/hero-section";
import { HighlightsStrip } from "@/components/marketing/highlights-strip";
import { ImpactStatsStrip } from "@/components/marketing/impact-stats-strip";
import { HomeCtaBand } from "@/components/marketing/home-cta-band";
import { EventsHomeStrip } from "@/components/marketing/events-home-strip";
import { NewsCard } from "@/components/marketing/news-card";
import { NewsMobileCarousel } from "@/components/marketing/news-mobile-carousel";
import { Reveal } from "@/components/motion/reveal";
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
 getUpcomingEvents(6),
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

 <section aria-labelledby="news-heading" data-nav="light" className="bg-white">
 <div className="section-grid py-16 md:py-20">
 <Reveal variant="fade">
 <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <p className="section-eyebrow">News</p>
 <h2
 id="news-heading"
 className="mt-4 font-serif text-display-md md:text-display-lg"
 >
 Latest stories
 </h2>
 </div>
 <Button asChild variant="outline" size="sm" className="rounded-none">
 <Link href="/news">All news</Link>
 </Button>
 </div>
 </Reveal>

        {posts.length > 0 ? (
          <>
            {/* Mobile swipeable carousel (< lg) */}
            <NewsMobileCarousel posts={posts} />

            {/* Desktop editorial grid (>= lg) */}
            <div className="mt-8 hidden items-stretch gap-6 lg:grid lg:grid-cols-12">
              <Reveal className="lg:col-span-8" variant="up">
                <NewsCard post={posts[0]} featured />
              </Reveal>
              {posts.length > 1 ? (
                <div className="flex flex-col gap-6 lg:col-span-4">
                  {posts.slice(1, 3).map((post, i) => (
                    <Reveal key={post.id} variant="up" delay={90 + i * 90} className="flex-1">
                      <NewsCard post={post} compact />
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : (
 <p className="mt-8 rounded-none border border-line bg-surface p-8 text-center text-caption">
 News will appear here soon.
 </p>
 )}
 </div>
 </section>

 <HomeCtaBand />
 </>
 );
}
