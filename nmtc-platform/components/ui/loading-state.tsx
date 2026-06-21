import { cn } from "@/lib/utils";

type LoadingStateProps = {
  label?: string;
  className?: string;
  fullPage?: boolean;
};

export function LoadingState({
  label = "Loading…",
  className,
  fullPage = false,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-caption",
        fullPage ? "min-h-[40vh]" : "py-12",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none motion-reduce:border-t-primary/40"
        aria-hidden="true"
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}
