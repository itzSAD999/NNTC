import { notFound } from "next/navigation";

import { PostForm } from "@/components/admin/post-form";
import { AdminEditShell } from "@/components/admin/admin-layout";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getPostForEdit } from "@/lib/data/admin-posts";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminNewsEditPage({ params }: PageProps) {
  await requireContentStaff();
  const { id } = await params;
  const post = await getPostForEdit(id);

  if (!post) {
    notFound();
  }

  return (
    <AdminEditShell
      listHref="/dashboard/admin/news"
      listLabel="News"
      title="Edit post"
      subtitle={post.title}
    >
      <PostForm post={post} />
    </AdminEditShell>
  );
}
