import type { PortalStageKey } from "./types";

/**
 * Marketing-focused content per onboarding stage.
 *
 * The stepper uses this to "sell" each step — turning the timeline from a
 * functional checklist into something the client genuinely looks forward to.
 *
 * Tone guide:
 *   - tagline: short benefit headline (5-8 words). Feels like a promise.
 *   - whyMatters: 1-2 sentences. Speaks to the client's perspective.
 *   - whatHappens: practical "here's what we'll cover".
 *   - benefits: 3-4 specific outcomes. Use checkmark mental model.
 *   - duration: rough time so they can plan.
 *   - prep: what to bring (or "Nothing — just turn up").
 *   - completedRecap: single line shown for completed stages.
 *
 * Edit copy here without touching component code. Marketing/sales-team-friendly.
 */

export interface StageContent {
  /** Short benefit-focused headline. */
  tagline: string;
  whyMatters: string;
  whatHappens: string;
  benefits: string[];
  duration: string;
  prep: string;
  /** One-liner for the completed state. */
  completedRecap: string;
  /** Short teaser for the upcoming state. */
  upcomingTeaser: string;
}

export const STAGE_CONTENT: Record<Exclude<PortalStageKey, "complete">, StageContent> = {
  welcome: {
    tagline: "Where the relationship begins",
    whyMatters:
      "Every great working relationship starts with a real conversation. This is where you meet your accountant — a real person who will know your business inside out.",
    whatHappens:
      "A relaxed 15-minute introductory call. No agenda, no homework — just hello.",
    benefits: [
      "Meet your dedicated accountant — a real human, not a call centre",
      "Get a feel for how we'll work together",
      "Ask anything you've been wondering about",
    ],
    duration: "About 15 minutes",
    prep: "Nothing — just turn up.",
    completedRecap: "You met your accountant and got the relationship moving.",
    upcomingTeaser: "A friendly first call to put a face to the name.",
  },
  main: {
    tagline: "We get to know your business",
    whyMatters:
      "We can't tailor great advice without understanding your business properly. This is the call where we get the full picture — your history, your setup, your plans.",
    whatHappens:
      "A deeper conversation about your business, current finances, tax position, and where you want to go.",
    benefits: [
      "An accounting setup tailored to your specific business",
      "Tax-efficient structure advice from day one",
      "A clear plan for the year ahead",
      "A direct line if anything urgent comes up",
    ],
    duration: "Around 45–60 minutes",
    prep: "Last year's accounts handy if you have them. Otherwise nothing.",
    completedRecap: "We mapped out your business and tailored your setup.",
    upcomingTeaser: "A deep dive into your business and a tailored plan.",
  },
  portal: {
    tagline: "Save hours of admin every month",
    whyMatters:
      "Your time is better spent running your business than on bookkeeping. We'll set you up with FreeAgent to automate the boring stuff so you can stop dreading paperwork.",
    whatHappens:
      "We'll walk through FreeAgent together, connect your bank feeds, and show you how to handle expenses and invoices on the go.",
    benefits: [
      "Free FreeAgent — worth £19/month, included with your fee",
      "Bank feeds that auto-pull transactions every day",
      "Snap-and-claim expenses straight from your phone",
      "A reference one-pager so you'll never feel lost",
    ],
    duration: "30–45 minutes",
    prep: "Have your business bank login details ready (you'll enter them yourself — we never see them).",
    completedRecap: "You're set up with FreeAgent and bank feeds running.",
    upcomingTeaser: "A walkthrough of FreeAgent + bank feeds — saves hours every month.",
  },
  checkin30: {
    tagline: "A quick sense check, 30 days in",
    whyMatters:
      "We catch any teething issues before they turn into actual problems. Most people have small questions by now — this is where we sweep them up.",
    whatHappens:
      "A short check-in call to see how things are going, fix any niggles, and make sure FreeAgent is working how you expected.",
    benefits: [
      "Confidence that everything is on track",
      "Quick fixes for anything that isn't quite right",
      "A reminder of what's coming up tax-wise",
    ],
    duration: "15–20 minutes",
    prep: "Note anything that's been niggling you.",
    completedRecap: "We caught up at 30 days and tuned things up.",
    upcomingTeaser: "Quick 15-minute check-in to make sure things are flowing.",
  },
  checkin60: {
    tagline: "Now you're settled — let's optimise",
    whyMatters:
      "By two months in you'll have rhythm. This is the call where we move beyond setup and start finding ways to save you more tax and run things smarter.",
    whatHappens:
      "A working session: review of how things are tracking, deeper questions, tax-efficiency tips you can apply right now.",
    benefits: [
      "Tax-saving tweaks tailored to where you are",
      "Advice on growing the business sustainably",
      "Heads-up on anything you should think about before year-end",
    ],
    duration: "About 30 minutes",
    prep: "Bring any questions that have come up. We'll handle the rest.",
    completedRecap: "We optimised your setup and shared tax-saving tweaks.",
    upcomingTeaser: "A working session to fine-tune your setup and find savings.",
  },
  catchup: {
    tagline: "You're officially settled",
    whyMatters:
      "We celebrate you being fully embedded with us. From here, our relationship is long-term — your accountant has your back through every milestone.",
    whatHappens:
      "A wrap-up call to formally complete your onboarding and hand off to ongoing support. (You don't go anywhere — same accountant, same team.)",
    benefits: [
      "A long-term financial partner you can rely on",
      "Anytime advice, no per-call fees",
      "Year-end accounts handled without you lifting a finger",
      "Proactive nudges so you never miss a deadline",
    ],
    duration: "30 minutes",
    prep: "Nothing.",
    completedRecap: "You're fully settled — we're with you for the long haul.",
    upcomingTeaser: "Wrap-up call to mark the official end of onboarding.",
  },
};
