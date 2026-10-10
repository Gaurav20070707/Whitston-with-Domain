import Image from "next/image";
import { cn } from "@/lib/utils";

<<<<<<< HEAD
=======
/**
 * The Whitston logo: the "whitston." wordmark (with the bold "its").
 * The PNG is black-on-transparent, so in dark mode we invert it to white.
 * Pass `withTagline` to show "build judgment early" underneath.
 */
>>>>>>> d7401ca (Updating stock game link)
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
<<<<<<< HEAD
=======
  const width = 580;
  const height = withTagline ? 190 : 115;
>>>>>>> d7401ca (Updating stock game link)

  return (
    <Image
      src={src}
<<<<<<< HEAD
      width={580}
      height={withTagline ? 190 : 115}
=======
      width={width}
      height={height}
>>>>>>> d7401ca (Updating stock game link)
      alt="Whitston"
      priority
      className={cn("h-7 w-auto dark:invert", className)}
    />
  );
}