import { notFound } from "next/navigation";

import { EventForm } from "@/components/admin/event-form";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getEventForEdit } from "@/lib/data/admin-events";

export default async function AdminEventEditPage({
  params,
}: {
  params: { id: string };
}) {
  await requireContentStaff();
  const event = await getEventForEdit(params.id);

  if (!event) notFound();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Edit event</h1>
        <p className="mt-2 text-caption">{event.title}</p>
      </header>
      <EventForm event={event} />
    </div>
  );
}
