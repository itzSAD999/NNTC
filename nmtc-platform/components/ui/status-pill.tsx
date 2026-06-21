import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  submitted: { dot: "bg-warning", text: "text-warning" },
  returned: { dot: "bg-danger", text: "text-danger" },
  academic_approved: { dot: "bg-primary", text: "text-primary" },
  payment_confirmed: { dot: "bg-primary", text: "text-primary-deep" },
  approved: { dot: "bg-success", text: "text-success" },
  collected: { dot: "bg-caption/40", text: "text-caption" },
} as const;

type StatusKey = keyof typeof STATUS_STYLES;

interface StatusPillProps {
  status: StatusKey;
  label: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  const styles = STATUS_STYLES[status];

  return (
    <span className={cn("status-pill", styles.text, className)}>
      <span className={cn("status-pill-dot", styles.dot)} aria-hidden="true" />
      {label}
    </span>
  );
}
