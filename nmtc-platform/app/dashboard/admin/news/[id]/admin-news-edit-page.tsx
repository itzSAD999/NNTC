import { notFound } from "next/navigation";

import { PostForm } from "@/components/admin/post-form";
import { requireContentStaff } from "@/lib/auth/permissions";
import { getPostForEdit } from "@/lib/data/admin-posts";

type PageProps = {
  params: { id: string };
};

export default async function AdminNewsEditPage({ params }: PageProps) {
  await requireContentStaff();
  const { id } = params;
  const post = await getPostForEdit(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">Edit post</h1>
        <p className="mt-2 text-caption">{post.title}</p>
      </header>

      <PostForm post={post} />
    </div>
  );
}
