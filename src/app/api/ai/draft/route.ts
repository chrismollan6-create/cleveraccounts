import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  prompt?: unknown;
  instruction?: unknown;
};

const SYSTEM_PREAMBLE =
  "You are a UK accountancy marketing copywriter. Write clear, benefit-led, on-brand British English. No markdown, no preamble — return only the copy requested.";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const instruction =
    typeof body.instruction === "string" ? body.instruction.trim() : "";

  if (!prompt && !instruction) {
    return NextResponse.json(
      { error: "Provide an instruction describing the copy you want." },
      { status: 400 }
    );
  }

  const fullPrompt = [
    SYSTEM_PREAMBLE,
    instruction ? `Task: ${instruction}` : "",
    prompt ? `Context (page / client name): ${prompt}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Gemini request failed (${res.status})${detail ? `: ${detail.slice(0, 500)}` : ""}` },
        { status: 500 }
      );
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned no text." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error calling Gemini" },
      { status: 500 }
    );
  }
}
