import { NewsList } from "@/components/admin/news-list";
import { requireContentStaff } from "@/lib/auth/permissions";
import { listAllPosts } from "@/lib/data/admin-posts";

export default async function AdminNewsPage() {
  await requireContentStaff();
  const posts = await listAllPosts();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-display-lg">News CMS</h1>
        <p className="mt-2 text-caption">
          Create and publish news articles for the public site.
        </p>
      </header>

      <NewsList posts={posts} />
    </div>
  );
}
