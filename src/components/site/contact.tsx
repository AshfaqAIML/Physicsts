"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Fingerprint, Github, GraduationCap, Link2, Linkedin, Loader2, Mail, Send, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { contactChannels, subjects } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * CONTACT — channels shown only as they exist (null = an honest
 * "to be added" state), and a form wired to a real backend
 * (/api/contact → validated, honeypotted, persisted).
 */

/** Channel glyphs — one per channel id, a quiet anchor for scanning */
const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
  scholar: GraduationCap,
  orcid: Fingerprint,
};

const formSchema = z.object({
  name: z.string().trim().min(2, "Please tell me your name.").max(80),
  email: z.string().trim().email("Please provide a valid email address.").max(120),
  subject: z.string().min(1, "Please choose a subject."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least a sentence or two.")
    .max(4000, "That message is too long."),
  company: z.string().max(0).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      company: "",
    },
  });

  const subjectValue = watch("subject");
  const messageValue = watch("message");

  const onSubmit = async (values: FormValues) => {
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };

      if (res.ok && data.ok) {
        setStatus("sent");
        toast.success("Message received. Thank you — I will reply thoughtfully.");
        reset();
      } else {
        throw new Error(data.error ?? "Delivery failed.");
      }
    } catch (err) {
      setStatus("error");
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setServerError(message);
      toast.error("The message could not be sent.", {
        description: message,
      });
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative section-pad bg-chart-grid"
    >
      <div className="shell">
        <SectionHeading
          index="07"
          headingId="contact-heading"
          eyebrow="Contact & Collaboration"
          title="Every Answer Opens Another Question."
          lede="Interested in physics, mathematics, scientific computing, or exchanging ideas about the universe? I would be glad to connect."
          meta="Correspondence · open"
        />

        <div className="section-flow grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Channels — only what exists, honestly */}
          <Reveal>
            <div className="space-y-6">
              <div>
                <h3 className="meta-sm text-muted-foreground">
                  Channels
                </h3>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {contactChannels.map((c) => {
                    const Icon = channelIcons[c.id] ?? Link2;
                    return (
                      <li key={c.id} className="flex items-center justify-between gap-4 py-3.5">
                        <span className="flex items-center gap-3 text-sm text-foreground/90">
                          <Icon className="size-4 text-muted-foreground/70" aria-hidden="true" />
                          {c.label}
                        </span>
                        {c.href ? (
                          <a
                            href={c.href}
                            className="font-mono text-xs text-photon underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                          >
                            {c.hint}
                          </a>
                        ) : (
                          <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                            {c.hint}
                            <span className="tag tag--dashed">
                              to be added
                            </span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-xs italic leading-relaxed text-muted-foreground">
                  Accounts and documents appear here only when they actually
                  exist — nothing on this page is invented.
                </p>
              </div>

              <div className="rounded-lg border border-dashed border-border p-5">
                <h4 className="meta-sm text-muted-foreground">
                  Curriculum vitae
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A CV download will appear here once there is a document
                  worth your time. Until then, the About section is the honest
                  summary.
                </p>
              </div>
            </div>
          </Reveal>

          {/* The form — real backend, real states */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="rounded-lg border border-border bg-card p-6 sm:p-8"
              aria-label="Contact form"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className="bg-background"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p id="contact-name-error" role="alert" className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className="bg-background"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p id="contact-email-error" role="alert" className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <input type="hidden" {...register("subject")} />
                <Select
                  value={subjectValue}
                  onValueChange={(v) => setValue("subject", v, { shouldValidate: true })}
                >
                  <SelectTrigger
                    id="contact-subject"
                    aria-invalid={Boolean(errors.subject)}
                    className={cn("w-full bg-background", !subjectValue && "text-muted-foreground")}
                  >
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="contact-message">Message</Label>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "meta-num",
                      (messageValue?.length ?? 0) > 3600
                        ? "text-amber-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {messageValue?.length ?? 0} / 4000
                  </span>
                </div>
                <Textarea
                  id="contact-message"
                  rows={6}
                  maxLength={4000}
                  placeholder="A question, an idea, a correction — all welcome."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className="resize-y bg-background"
                  {...register("message")}
                />
                {errors.message && (
                  <p id="contact-message-error" role="alert" className="text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Honeypot — invisible to humans */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="contact-company">Company</label>
                <Input
                  id="contact-company"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("company")}
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="min-w-40 h-11 px-6"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" aria-hidden="true" />
                      Send message
                    </>
                  )}
                </Button>

                <p aria-live="polite" className="text-sm">
                  {status === "sent" && (
                    <span className="inline-flex items-center gap-2 text-photon">
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                      Delivered. Thank you.
                    </span>
                  )}
                  {status === "error" && (
                    <span className="inline-flex items-center gap-2 text-destructive">
                      <TriangleAlert className="size-4" aria-hidden="true" />
                      {serverError ?? "Delivery failed — please try again."}
                    </span>
                  )}
                </p>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Handled by this site&apos;s own backend: validated, spam-checked,
                and stored privately. No third-party trackers, no newsletter,
                no follow-up you did not ask for.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
