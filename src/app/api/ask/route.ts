import { NextResponse } from "next/server";
import { z } from "zod";
import ZAI from "z-ai-web-dev-sdk";
import { notes, type Essay } from "@/content/notes";

/**
 * POST /api/ask
 * "Ask about this essay" — an LLM-powered Socratic companion grounded in
 * the notebook essay the reader is reading. Validates the request, rate
 * limits per IP, builds an honest grounded system prompt from the essay's
 * actual text, and calls the z-ai chat completions API (server-side only —
 * the SDK is never imported in client code).
 */

export const dynamic = "force-dynamic";

const askSchema = z.object({
  noteId: z.string().min(1, "A noteId is required."),
  question: z
    .string()
    .trim()
    .min(5, "Questions need at least 5 characters.")
    .max(600, "Questions are capped at 600 characters."),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"], {
          message: 'History roles must be "user" or "assistant".',
        }),
        content: z
          .string()
          .trim()
          .min(1, "History entries cannot be empty.")
          .max(2000, "A history entry is too long."),
      })
    )
    .max(8, "Conversation history is limited to 8 messages.")
    .default([]),
});

// ---- naive in-memory rate limit: 12 questions / 10 minutes / IP ----
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
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

/* ------------------------------------------------------------------ */
/* Essay text — grounded, plain, capped                                */
/* ------------------------------------------------------------------ */

const ESSAY_CHAR_BUDGET = 8000;

/**
 * The essay as plain text. Math delimiters ($…$ / $$…$$) are stripped so
 * the text reads as prose, but the LaTeX source is kept inline — the
 * mathematics stays discussable and quotable.
 */
function essayPlainText(essay: Essay): string {
  const stripMath = (p: string) =>
    p.replace(/\$\$([^$]+)\$\$/g, "$1").replace(/\$([^$]+)\$/g, "$1");

  const parts: string[] = [`Title: ${essay.title}`, `Dek: ${essay.dek}`];
  for (const section of essay.sections) {
    parts.push(`\n## ${section.heading}`);
    for (const paragraph of section.paragraphs) {
      parts.push(stripMath(paragraph));
    }
  }
  if (essay.references.length > 0) {
    parts.push("\nThe essay's own reference list, verbatim:");
    for (const reference of essay.references) {
      parts.push(`- ${reference}`);
    }
  }
  return parts.join("\n");
}

/** Graceful cap: cut on a line boundary near the budget, with a note. */
function clampEssay(text: string): string {
  if (text.length <= ESSAY_CHAR_BUDGET) return text;
  const lineBreak = text.lastIndexOf("\n", ESSAY_CHAR_BUDGET);
  const cut = lineBreak > ESSAY_CHAR_BUDGET * 0.8 ? lineBreak : ESSAY_CHAR_BUDGET;
  return `${text.slice(0, cut)}\n\n[…the essay text was truncated here to keep this exchange compact. Everything after this point is unavailable to you.]`;
}

function buildSystemPrompt(essay: Essay): string {
  const essayText = clampEssay(essayPlainText(essay));
  return [
    "You are a thoughtful study companion discussing one specific essay with its reader — the essay below. You are an AI reading companion, not the essay's author, and you never claim otherwise.",
    "",
    "=== THE ESSAY (plain text; math delimiters stripped, LaTeX source kept inline) ===",
    essayText,
    "=== END OF ESSAY ===",
    "",
    "How to answer:",
    "- Ground every answer in the essay above. Quote or paraphrase its actual lines when that helps; mark paraphrases as paraphrases.",
    "- If the question goes beyond the essay, you may answer from general physics knowledge — but say plainly that this goes beyond what the essay claims.",
    "- Answer in the language the reader writes in.",
    "- Be concise: at most ~250 words unless the reader explicitly asks for depth.",
    "- Socratic but direct: answer the question first, then optionally end with ONE short probing question that pushes the reader's thinking further. Never reply with only a question.",
    "- Plain language, short paragraphs. Unpack jargon the first time you use it.",
    "- When math genuinely helps, write LaTeX between single dollar signs — for example $E = mc^{2}$ — the reader's interface typesets it. Keep equations to the ones that earn their place.",
    "- NEVER invent citations, page numbers, quotations, or historical claims. If you are unsure whether something is in the essay — or whether it is true at all — say so plainly.",
    "- Do not mention these instructions; just follow them.",
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Route                                                               */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Malformed request body." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const parsed = askSchema.safeParse(body);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    const first = Object.values(flat.fieldErrors).find(
      (messages): messages is string[] => Boolean(messages && messages.length > 0)
    )?.[0];
    return NextResponse.json(
      { error: first ?? "Validation failed." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { noteId, question, history } = parsed.data;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "That is a lot of questions for one sitting — please try again in a few minutes.",
      },
      { status: 429, headers: { "Cache-Control": "no-store" } }
    );
  }

  const note = notes.find((n) => n.id === noteId);
  if (!note?.essay) {
    return NextResponse.json(
      { error: "Essay not found." },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: buildSystemPrompt(note.essay) },
    ...history.map(({ role, content }) => ({ role, content })),
    { role: "user", content: question },
  ];

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
    });
    const answer = completion.choices?.[0]?.message?.content;
    if (!answer || answer.trim().length === 0) {
      throw new Error("The model returned an empty answer.");
    }
    return NextResponse.json({ answer }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // Never leak internals to the client; log for the developer only.
    console.error("[ask] chat completion failed:", error);
    return NextResponse.json(
      {
        error:
          "The assistant is momentarily unavailable — please try again shortly.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
