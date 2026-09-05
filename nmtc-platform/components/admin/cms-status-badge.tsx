import { cn } from "@/lib/utils";

export function CmsStatusBadge({
  published,
  className,
}: {
  published: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "status-pill",
        published ? "text-success" : "text-caption",
        className
      )}
    >
      <span
        className={cn(
          "status-pill-dot",
          published ? "bg-success" : "bg-caption/40"
        )}
        aria-hidden="true"
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}
