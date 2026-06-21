import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="section-grid flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="mt-3 font-serif text-display-lg">Page not found</h1>
      <p className="mt-4 max-w-md text-caption">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
