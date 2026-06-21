"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section-grid flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-danger">
        Error
      </p>
      <h1 className="mt-3 font-serif text-display-lg">Something went wrong</h1>
      <p className="mt-4 max-w-md text-caption">
        An unexpected error occurred. Please try again.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
