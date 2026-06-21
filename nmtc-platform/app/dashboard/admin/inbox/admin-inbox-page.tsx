import { InboxView } from "@/components/admin/inbox-view";
import { requireInboxStaff } from "@/lib/auth/permissions";
import { listContactMessages } from "@/lib/data/admin-inbox";

export default async function AdminInboxPage() {
  await requireInboxStaff();
  const messages = await listContactMessages();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Contact inbox</h1>
        <p className="mt-2 text-caption">
          Messages submitted through the public contact form.
        </p>
      </header>

      <InboxView messages={messages} />
    </div>
  );
}
