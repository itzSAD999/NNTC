import { EventForm } from "@/components/admin/event-form";
import { requireContentStaff } from "@/lib/auth/permissions";

export default async function AdminEventNewPage() {
  await requireContentStaff();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">New event</h1>
      </header>
      <EventForm />
    </div>
  );
}
