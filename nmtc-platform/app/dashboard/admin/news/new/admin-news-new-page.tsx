import { PostForm } from "@/components/admin/post-form";
import { requireContentStaff } from "@/lib/auth/permissions";

export default async function AdminNewsNewPage() {
  await requireContentStaff();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">New post</h1>
        <p className="mt-2 text-caption">Create a news article for the site.</p>
      </header>

      <PostForm />
    </div>
  );
}
