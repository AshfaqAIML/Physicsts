"use client";

import { CompanionPanel } from "@/components/site/companion-panel";
import type { ResearchArea } from "@/content/research";

/**
 * "ASK ABOUT THIS AREA" — the shared companion panel, configured for each
 * research area's detail dialog. The conversation runs through
 * /api/ask-research, which grounds the model in the area's actual page
 * content (the SDK never reaches this file).
 */

export function ResearchAsk({ area }: { area: ResearchArea }) {
  return (
    <CompanionPanel
      endpoint="/api/ask-research"
      buildPayload={(question, history) => ({
        areaId: area.id,
        question,
        history,
      })}
      collapsedLabel="Ask about this area — AI companion"
      headerLabel="Ask about this area"
      honestyNote="A study companion grounded in this page — ask it anything about the area."
      threadAriaLabel="Conversation with the research area companion"
      loadingText="Consulting this area…"
      inputLabel="Your question about this area"
      placeholder="Ask anything about this area — an equation, a concept, a book on the shelf…"
      sendAriaLabel="Send your question to the study companion"
      suggestedQuestions={[
        "Explain the central equation in plain words.",
        "What should I read first, and why?",
      ]}
      toastFailed="The study companion failed to answer."
      toastUnreachable="The study companion is unreachable."
    />
  );
}
