import { InboxView } from "@/components/admin/inbox-view";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireInboxStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { listContactMessages } from "@/lib/data/admin-inbox";

export default async function AdminInboxPage() {
  await requireInboxStaff();
  const messages = await listContactMessages();

  return (
    <AdminListShell section="inbox" preview={listLooksPreviewed(messages)}>
      <InboxView messages={messages} />
    </AdminListShell>
  );
}
