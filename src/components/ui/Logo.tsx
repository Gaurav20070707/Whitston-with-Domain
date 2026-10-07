import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  withTagline = false,
}: {
  className?: string;
  withTagline?: boolean;
}) {
  const src = withTagline
    ? "/images/whitston-wordmark-tagline.png"
    : "/images/whitston-wordmark.png";

  return (
    <Image
      src={src}
      width={580}
      height={withTagline ? 190 : 115}
      alt="Whitston"
      priority
      className={cn("h-7 w-auto dark:invert", className)}
    />
  );
}