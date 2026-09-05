import { EventForm } from "@/components/admin/event-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";

export default async function AdminEventNewPage() {
  await requireContentStaff();

  return (
    <AdminEditShell
      listHref="/dashboard/admin/events"
      listLabel="Events"
      title="New event"
      subtitle="Add a college event for the public Events page."
    >
      <EventForm />
    </AdminEditShell>
  );
}
