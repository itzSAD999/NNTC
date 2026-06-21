import { EventsList } from "@/components/admin/events-list";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listAllEvents } from "@/lib/data/admin-events";

export default async function AdminEventsPage() {
  await requireContentStaff();
  const events = await listAllEvents();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Events CMS</h1>
        <p className="mt-2 text-caption">
          Create and publish college events and mark past events for the archive.
        </p>
      </header>
      <EventsList events={events} />
    </div>
  );
}
