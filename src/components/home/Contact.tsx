"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconLink } from "@/components/ui/IconLink";
import { contactHrefs } from "@/constants/site";

const contactChannels = [
  { label: "Instagram", href: contactHrefs.instagram, icon: Instagram, external: true },
  { label: "LinkedIn", href: contactHrefs.linkedin, icon: Linkedin, external: true },
  { label: "Email", href: contactHrefs.email, icon: Mail, external: false },
  { label: "WhatsApp", href: contactHrefs.whatsapp, icon: MessageCircle, external: true },
  { label: "Call Us", href: contactHrefs.phone, icon: Phone, external: false },
];

export function Contact() {
  return (
    <Section id="contact">
      <Container>
        <SectionHeading
          eyebrow="Get in touch"
          title="Questions, partnerships, or feedback — we're listening."
          description="Reach us directly, or join the community for updates as new case decks and simulator features ship."
          align="center"
          className="mx-auto"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          {contactChannels.map((channel) => (
            <div key={channel.label} className="flex w-20 flex-col items-center gap-2">
              <IconLink
                href={channel.href}
                label={channel.label}
                icon={channel.icon}
                external={channel.external}
                variant="solid"
                className="h-14 w-14"
              />
              <span className="text-center text-xs font-medium leading-tight text-ink-600 dark:text-ink-300">
                {channel.label}
              </span>
            </div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
