import { Skeleton, PageHeaderSkeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <div className="min-h-screen bg-surface/30">
      {/* Top Banner / PageHeader Skeleton */}
      <PageHeaderSkeleton />

      {/* Main Content Skeleton Grid */}
      <div className="section-grid py-12 md:py-16 space-y-12">
        {/* Section title & subtitle skeleton */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-4 border-b border-line">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>

        {/* 3-column card skeletons */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Two-column content / info skeleton */}
        <div className="grid gap-8 lg:grid-cols-12 pt-6">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="pt-4 grid sm:grid-cols-2 gap-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
