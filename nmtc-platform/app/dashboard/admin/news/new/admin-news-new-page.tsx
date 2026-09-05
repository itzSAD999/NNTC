import { PostForm } from "@/components/admin/post-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";

export default async function AdminNewsNewPage() {
  await requireContentStaff();

  return (
    <AdminEditShell
      listHref="/dashboard/admin/news"
      listLabel="News"
      title="New post"
      subtitle="Create a news article for the public site."
    >
      <PostForm />
    </AdminEditShell>
  );
}
