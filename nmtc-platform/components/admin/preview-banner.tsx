export function PreviewBanner({ label = "Sample records" }: { label?: string }) {
  return (
    <p
      role="status"
      className="border border-line bg-[#f7f7f7] px-3 py-2 text-xs text-caption"
    >
      {label} are shown so you can see a populated desk. Live records replace them when they exist.
    </p>
  );
}
