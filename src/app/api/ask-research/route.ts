import { NextResponse } from "next/server";
import { z } from "zod";
import ZAI from "z-ai-web-dev-sdk";
import { researchAreas, type ResearchArea } from "@/content/research";

/**
 * POST /api/ask-research
 * "Ask about this area" — an LLM-powered study companion grounded in the
 * research-interest page the reader has open. Validates the request, rate
 * limits per IP, builds an honest grounded system prompt from the area's
 * actual page content, and calls the z-ai chat completions API
 * (server-side only — the SDK is never imported in client code).
 *
 * Honesty is the point of this feature: the site presents these areas as
 * "directions of study and fascination — not claimed specialisations", and
 * the companion speaks from that same position.
 */

export const dynamic = "force-dynamic";

const askResearchSchema = z.object({
  areaId: z.string().min(1, "An areaId is required."),
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
/* Area text — grounded, plain, capped                                 */
/* ------------------------------------------------------------------ */

const AREA_CHAR_BUDGET = 4000;

/**
 * The area's page as plain text. The equation's LaTeX source is kept
 * inline — the mathematics stays discussable and quotable.
 */
function areaPlainText(area: ResearchArea): string {
  const parts: string[] = [
    `Title: ${area.title}`,
    `Tagline: ${area.tagline}`,
    `Equation (LaTeX source, typeset at the top of the page): $${area.equation}$`,
    `Equation label: ${area.equationLabel}`,
    `Summary: ${area.summary}`,
    `Detail: ${area.detail}`,
    `What is settled (the page's own statement of established science): ${area.established}`,
    "\nOpen questions listed on the page (the honest frontier):",
    ...area.openQuestions.map((q) => `- ${q}`),
    "\nRelated concepts listed on the page:",
    ...area.concepts.map((concept) => `- ${concept}`),
    '\nReading list ("On the shelf"), verbatim:',
    ...area.reading.map(
      (item) => `- "${item.title}" — ${item.author}. ${item.note}`
    ),
  ];
  return parts.join("\n");
}

/** Graceful cap: cut on a line boundary near the budget, with a note. */
function clampArea(text: string): string {
  if (text.length <= AREA_CHAR_BUDGET) return text;
  const lineBreak = text.lastIndexOf("\n", AREA_CHAR_BUDGET);
  const cut = lineBreak > AREA_CHAR_BUDGET * 0.8 ? lineBreak : AREA_CHAR_BUDGET;
  return `${text.slice(0, cut)}\n\n[…the area's page text was truncated here to keep this exchange compact. Everything after this point is unavailable to you.]`;
}

function buildSystemPrompt(area: ResearchArea): string {
  const areaText = clampArea(areaPlainText(area));
  return [
    "You are a thoughtful AI study companion discussing one specific research-interest page with its reader — the page below. You are an AI, not the page's author or the portfolio's owner, and you never claim otherwise.",
    "",
    "=== THE RESEARCH AREA PAGE (plain text; the equation's LaTeX source is kept inline) ===",
    areaText,
    "=== END OF PAGE ===",
    "",
    "How to answer:",
    "- Ground every answer in the page above — its summary, detail, equation, concepts, and reading list. Quote or paraphrase its actual lines when that helps; mark paraphrases as paraphrases.",
    "- The page separates what is settled science from its open questions. Respect that distinction: never present an open question as resolved, and never blur established results with speculation — flag which you are speaking from.",
    "- This page presents the area as a direction of study and fascination — not a claimed specialisation. The portfolio's owner is a learner working toward these subjects, not an established expert. Keep that honesty: if asked about the owner's credentials or expertise, answer plainly that this portfolio describes interests being earned, not credentials claimed.",
    "- If the question goes beyond what the page says, you may answer from general physics knowledge — but say plainly that this goes beyond what the page claims.",
    "- Answer in the language the reader writes in.",
    "- Be concise: at most ~250 words unless the reader explicitly asks for depth.",
    "- Answer the question first, then optionally end with ONE short probing question that pushes the reader's thinking further. Never reply with only a question.",
    "- Plain language, short paragraphs. Unpack jargon the first time you use it.",
    "- When math genuinely helps, write LaTeX between single dollar signs — for example $E = mc^{2}$ — the reader's interface typesets it. Keep equations to the ones that earn their place.",
    "- NEVER invent citations, quotations, or claims about the owner. If you are unsure whether something is on the page — or whether it is true at all — say so plainly.",
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

  const parsed = askResearchSchema.safeParse(body);
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

  const { areaId, question, history } = parsed.data;

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

  const area = researchAreas.find((a) => a.id === areaId);
  if (!area) {
    return NextResponse.json(
      { error: "Research area not found." },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: buildSystemPrompt(area) },
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
    console.error("[ask-research] chat completion failed:", error);
    return NextResponse.json(
      {
        error:
          "The assistant is momentarily unavailable — please try again shortly.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
