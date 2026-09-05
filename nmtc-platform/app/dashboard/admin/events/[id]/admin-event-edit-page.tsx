import { notFound } from "next/navigation";

import { EventForm } from "@/components/admin/event-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getEventForEdit } from "@/lib/data/admin-events";

export default async function AdminEventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireContentStaff();
  const { id } = await params;
  const event = await getEventForEdit(id);

  if (!event) notFound();

  return (
    <AdminEditShell
      listHref="/dashboard/admin/events"
      listLabel="Events"
      title="Edit event"
      subtitle={event.title}
    >
      <EventForm event={event} />
    </AdminEditShell>
  );
}
