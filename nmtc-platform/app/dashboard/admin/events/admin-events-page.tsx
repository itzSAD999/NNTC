import Link from "next/link";

import { EventsList } from "@/components/admin/events-list";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listAllEvents } from "@/lib/data/admin-events";
import { Button } from "@/components/ui/button";

export default async function AdminEventsPage() {
  await requireContentStaff();
  const events = await listAllEvents();

  return (
    <AdminListShell
      section="events"
      action={
        <Button asChild>
          <Link href="/dashboard/admin/events/new">New event</Link>
        </Button>
      }
    >
      <EventsList events={events} />
    </AdminListShell>
  );
}
