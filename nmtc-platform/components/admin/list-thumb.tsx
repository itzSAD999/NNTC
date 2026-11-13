import Image from "next/image";

export function ListThumb({
  src,
  alt,
}: {
  src?: string | null;
  alt: string;
}) {
  if (!src) {
    return (
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-line bg-[#f7f7f7] text-[0.65rem] text-caption">
        —
      </span>
    );
  }

  return (
    <span className="relative inline-block h-12 w-12 shrink-0 overflow-hidden border border-line bg-[#f7f7f7]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="48px" />
    </span>
  );
}
