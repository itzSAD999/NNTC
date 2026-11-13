import Link from "next/link";

import { NewsList } from "@/components/admin/news-list";
import { AdminListShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listLooksPreviewed } from "@/lib/data/admin-preview";
import { listAllPosts } from "@/lib/data/admin-posts";
import { Button } from "@/components/ui/button";

export default async function AdminNewsPage() {
  await requireContentStaff();
  const posts = await listAllPosts();

  return (
    <AdminListShell
      section="news"
      preview={listLooksPreviewed(posts)}
      action={
        <Button asChild>
          <Link href="/dashboard/admin/news/new">New post</Link>
        </Button>
      }
    >
      <NewsList posts={posts} />
    </AdminListShell>
  );
}
