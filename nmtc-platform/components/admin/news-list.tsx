"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";

import {
  togglePostPinnedForm,
  togglePostPublishedForm,
} from "@/lib/actions/posts";
import { POST_CATEGORIES } from "@/lib/validation/post";
import type { Post } from "@/types/database";
import { formatShortDate } from "@/lib/utils/format";
import {
  matchesPublishFilter,
  matchesSearch,
} from "@/lib/admin/list-filters";
import { CmsStatusBadge } from "@/components/admin/cms-status-badge";
import {
  AdminListFilterBar,
  useAdminListFilters,
} from "@/components/admin/admin-list-filters";
import { AdminListToast } from "@/components/admin/admin-list-toast";
import {
  AdminMobileCard,
  AdminListResults,
} from "@/components/admin/admin-responsive-list";
import {
  AdminTable,
  AdminTableHead,
  AdminTableTh,
} from "@/components/admin/admin-layout";
import { PublicLinkPreview } from "@/components/admin/admin-help";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

function NewsRowActions({ post }: { post: Post }) {
  return (
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
      <Button asChild size="sm" variant="ghost">
        <Link href={`/dashboard/admin/news/${post.id}`}>Edit</Link>
      </Button>
    </div>
  );
}

function NewsListContent({ posts }: { posts: Post[] }) {
  const filters = useAdminListFilters();

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      if (
        !matchesSearch(filters.search, [
          post.title,
          post.slug,
          post.category,
          post.excerpt,
        ])
      ) {
        return false;
      }
      if (
        !matchesPublishFilter(
          filters.status,
          Boolean(post.published_at)
        )
      ) {
        return false;
      }
      if (
        filters.category !== "all" &&
        post.category !== filters.category
      ) {
        return false;
      }
      return true;
    });
  }, [posts, filters.search, filters.status, filters.category]);

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        message="Create your first news article for the public site."
      />
    );
  }

  return (
    <div className="space-y-4">
      <AdminListFilterBar
        search={filters.search}
        onSearchChange={filters.setSearch}
        status={filters.status}
        onStatusChange={filters.setStatus}
        category={filters.category}
        onCategoryChange={filters.setCategory}
        categoryOptions={POST_CATEGORIES.map((c) => ({ value: c, label: c }))}
        searchPlaceholder="Search by title, category, or summary…"
        total={posts.length}
        filtered={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState message="No posts match your filters." />
      ) : (
        <AdminListResults
          table={
            <AdminTable minWidth="720px">
              <AdminTableHead>
                <AdminTableTh>Title</AdminTableTh>
                <AdminTableTh>Category</AdminTableTh>
                <AdminTableTh>Status</AdminTableTh>
                <AdminTableTh>Published</AdminTableTh>
                <AdminTableTh>Pinned</AdminTableTh>
                <AdminTableTh>Actions</AdminTableTh>
              </AdminTableHead>
              <tbody>
                {filtered.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/admin/news/${post.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {post.title}
                      </Link>
                      <PublicLinkPreview basePath="/news" slug={post.slug} />
                    </td>
                    <td className="px-4 py-3 text-caption">{post.category}</td>
                    <td className="px-4 py-3">
                      <CmsStatusBadge published={Boolean(post.published_at)} />
                    </td>
                    <td className="px-4 py-3 ref-mono text-caption">
                      {post.published_at
                        ? formatShortDate(post.published_at)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-caption">
                      {post.is_pinned ? "Yes" : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <NewsRowActions post={post} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          }
          cards={filtered.map((post) => (
            <AdminMobileCard key={post.id}>
              <div className="space-y-3">
                <div>
                  <Link
                    href={`/dashboard/admin/news/${post.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {post.title}
                  </Link>
                  <PublicLinkPreview basePath="/news" slug={post.slug} />
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-caption">
                  <span>{post.category}</span>
                  <CmsStatusBadge published={Boolean(post.published_at)} />
                  {post.is_pinned ? <span>Pinned</span> : null}
                </div>
                <NewsRowActions post={post} />
              </div>
            </AdminMobileCard>
          ))}
        />
      )}
    </div>
  );
}

export function NewsList({ posts }: { posts: Post[] }) {
  return (
    <>
      <Suspense fallback={null}>
        <AdminListToast />
      </Suspense>
      <NewsListContent posts={posts} />
    </>
  );
}
