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

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;

  return bodyHtml
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
    .trim()
    .slice(0, 8000);
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

    let pageContent = "";
    const url = liveUrl(docType ?? "", slug ?? "");
    if (url) {
      try {
        pageContent = await fetchPageText(url);
      } catch {
        // Non-fatal — fall back to Sanity fields only
      }
    }

    const prompt = `You are a senior digital marketing consultant auditing a page for Clever Accounts — a UK online accounting firm serving sole traders, limited companies, contractors, and freelancers. Prices start from £42.50/month.

PAGE DETAILS
Type: ${docType ?? "page"}
Title: ${title}
Current meta title: ${metaTitle || "(not set)"}
Current meta description: ${metaDescription || "(not set)"}
Excerpt: ${excerpt || "(not set)"}
Live URL: ${url ?? "(no public URL)"}
${pageContent ? `\nLIVE PAGE CONTENT:\n${pageContent}` : ""}

ALREADY IMPLEMENTED — do not suggest these:
- LocalBusiness, ProfessionalService, Organization, AccountingService JSON-LD
- BreadcrumbList JSON-LD on all service and blog pages
- BlogPosting JSON-LD on all blog posts
- FAQPage JSON-LD on homepage
- Product/Offer pricing JSON-LD on homepage
- WebApplication JSON-LD on the calculator
- Open Graph and Twitter Card images sitewide

YOUR TASK
Perform a full page health audit across 5 areas. For each finding include the priority, a specific issue, and an exact actionable fix. Be specific to THIS page's content — no generic advice.

Respond ONLY with this exact JSON structure — no markdown, no code fences:
{
  "suggestedTitle": "30-60 char meta title including primary keyword, ending with | Clever Accounts",
  "suggestedDescription": "120-160 char meta description with a specific benefit or number, ending with a CTA",
  "categories": [
    {
      "name": "Meta & Search Appearance",
      "findings": [
        { "priority": "high|medium|low", "issue": "specific problem", "fix": "exact action to take" }
      ]
    },
    {
      "name": "Content & Keywords",
      "findings": [
        { "priority": "high|medium|low", "issue": "specific problem", "fix": "exact action to take" }
      ]
    },
    {
      "name": "Technical SEO",
      "findings": [
        { "priority": "high|medium|low", "issue": "specific problem", "fix": "exact action to take" }
      ]
    },
    {
      "name": "PPC & Conversion",
      "findings": [
        { "priority": "high|medium|low", "issue": "specific problem", "fix": "exact action to take" }
      ]
    },
    {
      "name": "User Experience",
      "findings": [
        { "priority": "high|medium|low", "issue": "specific problem", "fix": "exact action to take" }
      ]
    }
  ]
}

Rules:
- 2-4 findings per category
- If something is genuinely good, say so as a low priority "pass" finding — do not invent problems
- PPC findings should cover ad relevance, Quality Score factors, above-the-fold value prop, CTA strength
- UX findings should assess the page from a first-time visitor's perspective: trust signals, clarity, bounce risk, conversion barriers
- Be brutally honest and specific`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001" as string,
      max_tokens: 2048,
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
      { error: String(err instanceof Error ? err.message : err) },
      { status: 500 }
    );
  }
}
