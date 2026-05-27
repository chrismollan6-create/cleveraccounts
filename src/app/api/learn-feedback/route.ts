import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { sanityConfig } from "@/sanity/config";

export const runtime = "nodejs";

type Body = {
  articleId?: unknown;
  helpful?: unknown;
  comment?: unknown;
};

export async function POST(req: Request) {
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Feedback unavailable — server misconfigured" }, { status: 500 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const articleId = typeof body.articleId === "string" ? body.articleId.trim() : "";
  const helpful = typeof body.helpful === "boolean" ? body.helpful : null;
  const comment =
    typeof body.comment === "string" && body.comment.trim().length > 0
      ? body.comment.trim().slice(0, 2000)
      : undefined;

  if (!articleId || !articleId.startsWith("knowledgeArticle-") && !articleId.startsWith("drafts.knowledgeArticle-")) {
    return NextResponse.json({ error: "Missing or invalid articleId" }, { status: 400 });
  }
  if (helpful === null) {
    return NextResponse.json({ error: "Missing helpful flag" }, { status: 400 });
  }

  const client = createClient({ ...sanityConfig, useCdn: false, token });

  // Verify the article actually exists (use the published id, not the draft)
  const publishedId = articleId.replace(/^drafts\./, "");
  const exists = await client.getDocument(publishedId).catch(() => null);
  if (!exists) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const userAgent = req.headers.get("user-agent")?.slice(0, 200) || undefined;

  try {
    await client.create({
      _type: "knowledgeArticleFeedback",
      article: { _type: "reference", _ref: publishedId },
      helpful,
      comment,
      submittedAt: new Date().toISOString(),
      userAgent,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to save: ${message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
