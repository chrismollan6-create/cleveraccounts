import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const { docType, title, metaTitle, metaDescription, excerpt } =
      await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an SEO specialist for Clever Accounts, a UK online accounting firm serving sole traders, limited companies, contractors, and freelancers.

Document type: ${docType ?? "page"}
Current page title: ${title}
Current meta title: ${metaTitle || "(not set)"}
Current meta description: ${metaDescription || "(not set)"}
Excerpt/summary: ${excerpt || "(not set)"}

Tasks:
1. Write a meta title for this page. Requirements: 30–60 characters total, include the primary keyword naturally, end with "| Clever Accounts" if space allows (it counts toward the 60 chars).
2. Write a meta description for this page. Requirements: exactly 120–160 characters, includes a specific benefit or number (e.g. "from £42.50/month", "20 years experience", "10,000+ businesses"), ends with a call to action.
3. Provide exactly 2–3 specific, actionable improvement tips for this page's SEO. Be specific to the content, not generic advice.

Respond ONLY with valid JSON — no markdown, no code fences, no extra text:
{
  "suggestedTitle": "string max 60 chars",
  "suggestedDescription": "string 120-160 chars",
  "tips": ["tip1", "tip2"]
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001" as string,
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Strip any accidental markdown code fences
    const cleaned = raw
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();

    const json = JSON.parse(cleaned);

    return NextResponse.json(json);
  } catch (err) {
    console.error("[/api/seo/suggestions]", err);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
