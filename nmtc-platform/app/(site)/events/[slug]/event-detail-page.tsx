import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventDetailView } from "@/components/marketing/event-detail";
import { getEventBySlug } from "@/lib/data/events";
import { getSettings } from "@/lib/data/settings";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  const settings = await getSettings();

  if (!event) {
    return { title: `Event not found — ${settings.college_name}` };
  }

  return {
    title: `${event.title} — ${settings.college_name}`,
    description: event.description.slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventDetailView event={event} />;
}
