"use client";

import Link from "next/link";

import {
  togglePostPinnedForm,
  togglePostPublishedForm,
} from "@/lib/actions/posts";
import type { Post } from "@/types/database";
import { formatShortDate } from "@/lib/utils/format";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export function NewsList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/admin/news/new">New post</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          message="Create your first news article for the public site."
        />
      ) : (
        <div className="overflow-x-auto rounded border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-widest text-caption">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Pinned</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/news/${post.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-caption">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-caption">{post.category}</td>
                  <td className="px-4 py-3 text-caption">
                    {post.published_at
                      ? formatShortDate(post.published_at)
                      : "Draft"}
                  </td>
                  <td className="px-4 py-3 text-caption">
                    {post.is_pinned ? "Yes" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <form action={togglePostPublishedForm}>
                        <input type="hidden" name="id" value={post.id} />
                        <Button type="submit" size="sm" variant="outline">
                          {post.published_at ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
                      <form action={togglePostPinnedForm}>
                        <input type="hidden" name="id" value={post.id} />
                        <Button type="submit" size="sm" variant="ghost">
                          {post.is_pinned ? "Unpin" : "Pin"}
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
