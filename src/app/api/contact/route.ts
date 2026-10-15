import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * POST /api/contact
 * Validates and persists a contact-form submission. Includes a
 * honeypot (silent discard of bot submissions) and simple in-memory
 * rate limiting — deliberately no accounts, no tracking.
 */

const contactSchema = z.object({
  name: z
    .string({ error: "Please tell me your name." })
    .trim()
    .min(2, "Please tell me your name.")
    .max(80, "That name is too long."),
  email: z
    .email({ error: "Please provide a valid email address." })
    .max(120, "That email address is too long."),
  subject: z
    .string({ error: "Please choose a subject." })
    .trim()
    .min(3, "Please choose a subject.")
    .max(120, "That subject is too long."),
  message: z
    .string({ error: "Please write at least a sentence or two." })
    .trim()
    .min(20, "Please write at least a sentence or two.")
    .max(4000, "That message is too long."),
  company: z.string().max(0).optional().or(z.literal("")), // honeypot
});

// ---- naive in-memory rate limit: 5 messages / 10 minutes / IP ----
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request body." },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        fields: flat.fieldErrors as Record<string, string[] | undefined>,
      },
      { status: 400 }
    );
  }

  const { name, email, subject, message, company } = parsed.data;

  // Honeypot: accept politely, discard quietly
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again a little later." },
      { status: 429 }
    );
  }

  try {
    await db.contactMessage.create({
      data: { name, email, subject, message },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] failed to persist message:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "The message could not be delivered. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
