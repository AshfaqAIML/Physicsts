"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Prose } from "@/components/site/tex";
import type { ResearchArea } from "@/content/research";
import { cn } from "@/lib/utils";

/**
 * "ASK ABOUT THIS AREA" — an AI study companion mounted in each research
 * area's detail dialog. The conversation runs through /api/ask-research,
 * which grounds the model in the area's actual page content (the SDK
 * never reaches this file). Standalone sibling of the essay companion —
 * deliberately a copy-adapt rather than a shared abstraction.
 */

type Turn = { role: "user" | "assistant"; content: string };

const QUESTION_MIN = 5;
const QUESTION_MAX = 600;
const HISTORY_SENT = 8; // prior turns sent to the API
const TURNS_SHOWN = 12; // prior turns rendered in the thread

const SUGGESTED_QUESTIONS = [
  "Explain the central equation in plain words.",
  "What should I read first, and why?",
] as const;

export function ResearchAsk({ area }: { area: ResearchArea }) {
  const panelId = useId();
  const inputId = `${panelId}-input`;
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [thread, setThread] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Land in the input when the panel opens.
  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  // Keep the newest turn in view.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [thread, loading, open]);

  const trimmed = question.trim();
  const canAsk = !loading && trimmed.length >= QUESTION_MIN;

  async function ask() {
    if (!canAsk) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ask-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaId: area.id,
          question: trimmed,
          history: thread
            .slice(-HISTORY_SENT)
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      let data: { answer?: string; error?: string } | null = null;
      try {
        data = (await res.json()) as { answer?: string; error?: string };
      } catch {
        data = null;
      }

      const answer = data?.answer;
      if (res.ok && answer) {
        setThread((t) => [
          ...t,
          { role: "user", content: trimmed },
          { role: "assistant", content: answer },
        ]);
        setQuestion("");
        return;
      }

      // A well-formed server error (validation, 404, rate limit, 502) is
      // shown inline — no toast for expected refusals.
      if (data?.error) {
        setError(data.error);
        return;
      }

      // Anything else is unexpected: inline note + toast.
      setError("The companion could not answer — please try again.");
      toast.error("The study companion failed to answer.");
    } catch {
      setError("Network error — the companion could not be reached.");
      toast.error("The study companion is unreachable.", {
        description: "Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const shown = thread.slice(-TURNS_SHOWN);
  const hiddenEarlier = thread.length > TURNS_SHOWN;
  const showCounter = question.length > 500;

  return (
    <div>
      {/* Collapsed — one quiet, full-width dashed affordance */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-dashed border-border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-photon/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Ask about this area — AI companion
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div id={panelId} className="mt-3 rounded-lg border border-border bg-card/60">
          {/* Header — instrument label + honesty tag */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Ask about this area
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70">
              AI · can make mistakes
            </p>
          </div>
          <p className="border-b border-border px-4 py-2.5 text-xs leading-relaxed text-muted-foreground/85">
            A study companion grounded in this page — ask it anything about
            the area.
          </p>

          {/* Thread */}
          <div
            ref={listRef}
            aria-live="polite"
            aria-label="Conversation with the research area companion"
            className="max-h-60 overflow-y-auto px-4 py-4"
          >
            {thread.length === 0 && !loading && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuestion(q);
                      textareaRef.current?.focus();
                    }}
                    className="rounded-full border border-dashed border-border px-3 py-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-photon/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {hiddenEarlier && (
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                …earlier turns kept brief
              </p>
            )}

            <div className="space-y-4">
              {shown.map((turn, i) =>
                turn.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[85%] whitespace-pre-wrap rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm leading-relaxed text-foreground/90">
                      {turn.content}
                    </p>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="border-l-2 border-photon/60 pl-3.5 text-sm leading-relaxed text-muted-foreground"
                  >
                    <AssistantMessage text={turn.content} />
                  </div>
                )
              )}

              {loading && (
                <p className="flex items-center gap-2 border-l-2 border-photon/60 pl-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                  Consulting this area…
                </p>
              )}
            </div>
          </div>

          {/* Input row */}
          <div className="border-t border-border px-4 py-3">
            <label htmlFor={inputId} className="sr-only">
              Your question about this area
            </label>
            <Textarea
              ref={textareaRef}
              id={inputId}
              rows={2}
              maxLength={QUESTION_MAX}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  void ask();
                }
              }}
              placeholder="Ask anything about this area — an equation, a concept, a book on the shelf…"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${panelId}-error` : undefined}
              className="resize-none bg-background placeholder:font-mono placeholder:text-[11px]"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <p
                id={`${panelId}-error`}
                aria-live="polite"
                className="min-w-0 flex-1 font-mono text-[10px] leading-relaxed"
              >
                {error ? (
                  <span className="text-destructive">{error}</span>
                ) : showCounter ? (
                  <span
                    className={cn(
                      "tabular-nums",
                      question.length > 560
                        ? "text-amber-500"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {question.length} / {QUESTION_MAX}
                  </span>
                ) : null}
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => void ask()}
                disabled={!canAsk}
                aria-label="Send your question to the study companion"
              >
                <Send className="size-3.5" aria-hidden="true" />
                Ask
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Assistant answers arrive as plain text with $…$ math. Split on blank
 * lines so the model's paragraphing survives, keep single line breaks,
 * and let <Prose> typeset any LaTeX it finds.
 */
function AssistantMessage({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return (
    <span className="block space-y-3">
      {paragraphs.map((paragraph, i) => (
        <span key={i} className="block whitespace-pre-wrap">
          <Prose text={paragraph} />
        </span>
      ))}
    </span>
  );
}
