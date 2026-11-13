import type { Metadata } from "next";
import Link from "next/link";

import { NewsCard } from "@/components/marketing/news-card";
import { PageHeader, PageSection } from "@/components/layout";
import { Reveal } from "@/components/motion/reveal";
import { getPublishedPosts } from "@/lib/data/posts";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
 const settings = await getSettings();
 return {
 title: `News & Announcements — ${settings.college_name}`,
 description: `Latest news and announcements from ${settings.college_name}.`,
 };
}

export default async function NewsPage() {
 const posts = await getPublishedPosts();

 return (
 <>
 <PageHeader
 eyebrow="News"
 title="News"
 description="Updates from campus."
 />

 <PageSection bordered={false} reveal={false}>
 {posts.length > 0 ? (
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {posts.map((post, i) => (
 <Reveal key={post.id} delay={i * 80}>
 <NewsCard post={post} featured={i === 0 && post.is_pinned} />
 </Reveal>
 ))}
 </div>
 ) : (
 <p className="rounded border border-line bg-surface p-12 text-center text-caption">
 No announcements have been published yet.{" "}
 <Link href="/contact" className="text-primary hover:underline">
 Contact us
 </Link>{" "}
 for enquiries.
 </p>
 )}
 </PageSection>
 </>
 );
}
