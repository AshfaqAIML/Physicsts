/**
 * PROFILE — About section content
 * ------------------------------------------------------------------
 * Written to be honest: curious, ambitious, and clearly at the
 * beginning of the journey. Anything between [brackets] is a
 * placeholder you should replace with your own truth.
 */

export const profile = {
  headline: "Curiosity Is Where Understanding Begins.",
  paragraphs: [
    "I am a student of the universe in the broadest sense — someone who finds it difficult to look at the night sky, a falling apple, or an equation and simply move on. Physics, to me, is not a subject but a way of being honest with the world: it asks you to trade intuition for evidence, and wonder for understanding, without ever losing either.",
    "My fascination began with questions that refused small answers. What is spacetime? Why does mathematics — a thing invented or discovered inside human heads — describe the universe with such unreasonable precision? What remains of causality when quantum mechanics is done with it? Those questions are still my compass.",
    "I am still early in this journey — and I think it is more honest to say so. What I lack in credentials I try to make up for in discipline: reading primary sources, rebuilding derivations from scratch, writing simulations until the mathematics becomes intuition, and changing my mind when the evidence demands it.",
  ],
  /** PLACEHOLDERS — replace each with your real, current details */
  facts: [
    {
      label: "Current focus",
      value: "[Your current programme, role, or field of study — replace me]",
      placeholder: true,
    },
    {
      label: "Education",
      value: "[Your institution & degree — replace me]",
      placeholder: true,
    },
    {
      label: "Location",
      value: "[City, Country — replace me]",
      placeholder: true,
    },
    {
      label: "Languages",
      value: "[e.g. English, … — replace me]",
      placeholder: true,
    },
  ],
  drivingQuestions: [
    "Why is there something rather than nothing?",
    "Can gravity and quantum mechanics be reconciled — and what does the answer require of us?",
    "What is spacetime made of, if it can bend, ripple, and tear?",
    "Is mathematics discovered or invented?",
    "How does complexity emerge from simple physical law?",
  ],
  approach: [
    {
      title: "First principles",
      body: "Retrace every result to its assumptions. A formula you cannot rebuild is a formula you do not yet own.",
    },
    {
      title: "Mathematics as language",
      body: "Equations are not decoration — they are the most compressed, honest description of an idea we have.",
    },
    {
      title: "Computation as instrument",
      body: "When equations resist paper, I build simulations: numerical experiments that turn intuition into something testable.",
    },
    {
      title: "Honest uncertainty",
      body: "I would rather say “I don't know yet” than pretend otherwise. Uncertainty is the raw material of discovery.",
    },
  ],
} as const;
