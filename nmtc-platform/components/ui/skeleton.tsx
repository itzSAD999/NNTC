import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "skeleton-shimmer bg-neutral-200/80 rounded-none",
        className
      )}
      {...props}
    />
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="border-b border-line bg-white py-12 md:py-16">
      <div className="section-grid max-w-3xl space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-3/4 max-w-md" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col border border-line bg-white p-6 space-y-4">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <Skeleton className="h-4 w-20 pt-2" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="border border-line bg-white p-4 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
