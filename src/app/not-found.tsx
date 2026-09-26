import { Compass } from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section className="flex min-h-[60vh] items-center">
      <Container className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-brass bg-brass/10 text-brass-dark dark:text-brass-light">
          <Compass className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-black uppercase text-ink-900 dark:text-parchment-100">
          This page isn&apos;t filed anywhere.
        </h1>
        <p className="mt-3 max-w-md text-ink-600 dark:text-ink-200">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
        </p>
        <Button href="/" className="mt-8">
          Back to home
        </Button>
      </Container>
    </Section>
  );
}
