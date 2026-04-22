import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const BASE_URL = "https://cleveraccounts.com";

function liveUrl(docType: string, slug: string): string | null {
  if (docType === "homePage") return BASE_URL + "/";
  if (docType === "blogPost") return slug ? `${BASE_URL}/blog/${slug}` : null;
  if (docType === "servicePage") return slug ? `${BASE_URL}/${slug}` : null;
  if (docType === "landingPage") return slug ? `${BASE_URL}/lp/${slug}` : null;
  return null;
}

async function fetchPageText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "CleverAccounts-SEO-Bot/1.0" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Page fetch ${res.status}`);
  const html = await res.text();

  // Extract only the body content — ignore head (title, meta, JSON-LD etc)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;

  const stripped = bodyHtml
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s{2,}/g, " ")
    .trim();

  return stripped.slice(0, 8000);
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const { docType, title, metaTitle, metaDescription, excerpt, slug } =
      await request.json();

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    // Fetch live page content if URL can be resolved
    let pageContent = "";
    const url = liveUrl(docType, slug ?? "");
    if (url) {
      try {
        pageContent = await fetchPageText(url);
      } catch {
        // Non-fatal — fall back to Sanity fields only
      }
    }

    const prompt = `You are an SEO specialist for Clever Accounts, a UK online accounting firm serving sole traders, limited companies, contractors, and freelancers.

Document type: ${docType ?? "page"}
Current page title: ${title}
Current meta title: ${metaTitle || "(not set)"}
Current meta description: ${metaDescription || "(not set)"}
Excerpt/summary: ${excerpt || "(not set)"}
${pageContent ? `\nLive page content (stripped HTML):\n${pageContent}` : ""}

Tasks:
1. Write a meta title for this page. Requirements: 30–60 characters total, include the primary keyword naturally, end with "| Clever Accounts" if space allows (it counts toward the 60 chars).
2. Write a meta description for this page. Requirements: exactly 120–160 characters, includes a specific benefit or number (e.g. "from £42.50/month", "20 years experience", "10,000+ businesses"), ends with a call to action.
3. Provide exactly 2–3 specific, actionable improvement tips for this page's SEO. Base these on the actual page content above — be specific, not generic.

Respond ONLY with valid JSON — no markdown, no code fences, no extra text:
{
  "suggestedTitle": "string max 60 chars",
  "suggestedDescription": "string 120-160 chars",
  "tips": ["tip1", "tip2"]
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001" as string,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";

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
