"use client";

import { Check, Copy, Facebook, Link2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getSiteUrl } from "@/lib/utils/format";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${getSiteUrl()}/news/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Share article">
      <span className="mr-2 text-sm text-caption">Share</span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
        {copied ? "Copied" : "Copy link"}
      </Button>
      <Button asChild variant="outline" size="sm">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
        >
          <Link2 className="h-4 w-4" aria-hidden />
          X
        </a>
      </Button>
      <Button asChild variant="outline" size="sm">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" aria-hidden />
          Facebook
        </a>
      </Button>
    </div>
  );
}
