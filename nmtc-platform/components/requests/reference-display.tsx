import { cn } from "@/lib/utils";

interface ReferenceDisplayProps {
  referenceNo: string;
  className?: string;
  size?: "md" | "lg";
}

/** IBM Plex Mono reference number in a clean bordered treatment. */
export function ReferenceDisplay({
  referenceNo,
  className,
  size = "md",
}: ReferenceDisplayProps) {
  return (
    <div
      className={cn(
        "inline-block rounded border border-line bg-bg px-4 py-3",
        className
      )}
    >
      <p
        className={cn(
          "ref-mono font-medium tracking-wide text-ink",
          size === "lg" ? "text-xl md:text-2xl" : "text-base"
        )}
      >
        {referenceNo}
      </p>
    </div>
  );
}
