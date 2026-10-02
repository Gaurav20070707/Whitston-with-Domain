"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

/**
 * Thumbnail for a case deck. Uses a plain <img> (not next/image) on purpose:
 * admins can paste a link from any site, and next/image only allows hosts
 * listed in next.config.js. If the link isn't a real image (or is empty or
 * broken), a neutral placeholder is shown instead of a broken picture.
 */
export function DeckThumbnail({ src }: { src?: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center text-ink-500 dark:text-ink-300" aria-hidden="true">
        <FileText className="h-10 w-10" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}