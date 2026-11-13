import type { Metadata } from "next";

import { EventsListing } from "@/components/marketing/events-listing";
import { PageHeader } from "@/components/layout/page-header";
import { getPastEvents, getUpcomingEvents } from "@/lib/data/events";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
 const settings = await getSettings();
 return {
 title: `Events — ${settings.college_name}`,
 description: `Upcoming events and activities at ${settings.college_name}.`,
 };
}

export default async function EventsPage() {
 const [upcoming, past, settings] = await Promise.all([
 getUpcomingEvents(),
 getPastEvents(),
 getSettings(),
 ]);

 return (
 <>
 <PageHeader
 eyebrow="What's on"
 title="Events"
 description="Open days, ceremonies, and campus activities."
 />
 <EventsListing upcoming={upcoming} past={past} />
 </>
 );
}
