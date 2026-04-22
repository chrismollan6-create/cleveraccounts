// @ts-nocheck
import { useState } from "react";
import {
  Box,
  Card,
  Text,
  Flex,
  Stack,
  Badge,
  Button,
  Spinner,
  Heading,
} from "@sanity/ui";
import { CheckCircle2, AlertCircle, XCircle, Copy, Check, Wand2 } from "lucide-react";
import { scoreDocument, gradeColor } from "./seoUtils";

interface AiSuggestions {
  suggestedTitle: string;
  suggestedDescription: string;
  tips: string[];
}

export function SEODocumentView({ document: docBundle }) {
  const doc = docBundle?.displayed ?? {};
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AiSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const { total, checks, grade } = scoreDocument(doc);
  const color = gradeColor(grade);

  async function fetchSuggestions() {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const res = await fetch("/api/seo/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: doc._type ?? "page",
          title: doc.title ?? doc.clientName ?? doc.headline ?? doc.heroHeadline ?? "",
          metaTitle: doc.metaTitle ?? "",
          metaDescription: doc.metaDescription ?? "",
          excerpt: doc.excerpt ?? doc.summary ?? "",
        }),
      });
      if (!res.ok) {
        let msg = `API error ${res.status}`;
        try { const body = await res.json(); if (body?.error) msg = body.error; } catch {}
        throw new Error(msg);
      }
      setSuggestions(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load AI suggestions.");
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function statusIcon(status: "pass" | "warn" | "fail") {
    if (status === "pass") return <CheckCircle2 size={14} style={{ color: "#10b981", flexShrink: 0 }} />;
    if (status === "warn") return <AlertCircle size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />;
    return <XCircle size={14} style={{ color: "#ef4444", flexShrink: 0 }} />;
  }

  const gradeLabel = grade === "good" ? "Good" : grade === "ok" ? "Needs work" : "Poor";
  const gradeTone = grade === "good" ? "positive" : grade === "ok" ? "caution" : "critical";

  return (
    <Box padding={4} style={{ maxWidth: 580, overflowY: "auto" }}>
      {/* ── Score card ───────────────────────────────────────── */}
      <Card
        padding={4}
        radius={3}
        shadow={1}
        marginBottom={4}
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <Flex align="center" gap={4}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Text size={3} weight="bold" style={{ color: "white" }}>
              {total}
            </Text>
          </div>
          <Box>
            <Heading size={2} style={{ marginBottom: 6 }}>
              SEO Score
            </Heading>
            <Badge tone={gradeTone} style={{ fontSize: 12 }}>
              {gradeLabel}
            </Badge>
          </Box>
        </Flex>
      </Card>

      {/* ── Checks ───────────────────────────────────────────── */}
      <Card padding={3} radius={3} shadow={1} marginBottom={4}>
        <Text size={1} weight="semibold" style={{ marginBottom: 10, display: "block", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Checks
        </Text>
        <Stack space={2}>
          {checks.map((check) => (
            <Flex key={check.key} align="center" gap={2} paddingY={1}>
              {statusIcon(check.status)}
              <Box flex={1}>
                <Text size={1} weight="semibold">
                  {check.label}
                </Text>
                <Text size={1} muted>
                  {check.message}
                </Text>
              </Box>
              <Text size={0} muted style={{ flexShrink: 0 }}>
                {check.earned}/{check.weight}pts
              </Text>
            </Flex>
          ))}
        </Stack>
      </Card>

      {/* ── AI Suggestions ───────────────────────────────────── */}
      <Card padding={3} radius={3} shadow={1}>
        <Flex align="center" justify="space-between" style={{ marginBottom: 14 }}>
          <Heading size={1}>AI Suggestions</Heading>
          <Button
            text={loading ? "Generating…" : "Generate suggestions"}
            tone="primary"
            onClick={fetchSuggestions}
            disabled={loading}
            icon={loading ? Spinner : Wand2}
            fontSize={1}
          />
        </Flex>

        {error && (
          <Card tone="critical" padding={3} radius={2} style={{ marginBottom: 10 }}>
            <Text size={1}>{error}</Text>
          </Card>
        )}

        {!suggestions && !loading && !error && (
          <Text size={1} muted>
            Click &ldquo;Generate suggestions&rdquo; to get Claude AI recommendations for this page&apos;s meta title and description.
          </Text>
        )}

        {suggestions && (
          <Stack space={4}>
            {/* Suggested title */}
            <Box>
              <Flex align="center" justify="space-between" style={{ marginBottom: 6 }}>
                <Text size={1} weight="semibold">
                  Suggested Meta Title
                </Text>
                <Button
                  text={copied === "title" ? "Copied!" : "Copy"}
                  mode="ghost"
                  fontSize={0}
                  icon={copied === "title" ? Check : Copy}
                  onClick={() => copyText(suggestions.suggestedTitle, "title")}
                  tone={copied === "title" ? "positive" : "default"}
                />
              </Flex>
              <Card padding={3} radius={2} style={{ background: "var(--card-bg, #f9fafb)" }}>
                <Text size={2}>{suggestions.suggestedTitle}</Text>
                <Text
                  size={0}
                  muted
                  style={{ marginTop: 4 }}
                >
                  {suggestions.suggestedTitle.length} chars
                  {suggestions.suggestedTitle.length > 60 && " ⚠ over 60"}
                  {suggestions.suggestedTitle.length < 30 && " ⚠ under 30"}
                </Text>
              </Card>
            </Box>

            {/* Suggested description */}
            <Box>
              <Flex align="center" justify="space-between" style={{ marginBottom: 6 }}>
                <Text size={1} weight="semibold">
                  Suggested Meta Description
                </Text>
                <Button
                  text={copied === "desc" ? "Copied!" : "Copy"}
                  mode="ghost"
                  fontSize={0}
                  icon={copied === "desc" ? Check : Copy}
                  onClick={() => copyText(suggestions.suggestedDescription, "desc")}
                  tone={copied === "desc" ? "positive" : "default"}
                />
              </Flex>
              <Card padding={3} radius={2} style={{ background: "var(--card-bg, #f9fafb)" }}>
                <Text size={2}>{suggestions.suggestedDescription}</Text>
                <Text size={0} muted style={{ marginTop: 4 }}>
                  {suggestions.suggestedDescription.length} chars
                  {suggestions.suggestedDescription.length > 160 && " ⚠ over 160"}
                  {suggestions.suggestedDescription.length < 120 && " ⚠ under 120"}
                </Text>
              </Card>
            </Box>

            {/* Tips */}
            {suggestions.tips?.length > 0 && (
              <Box>
                <Text size={1} weight="semibold" style={{ marginBottom: 8, display: "block" }}>
                  Improvement Tips
                </Text>
                <Stack space={2}>
                  {suggestions.tips.map((tip, i) => (
                    <Flex key={i} gap={2} align="flex-start">
                      <Text size={1} style={{ color: "#3b82f6", flexShrink: 0 }}>
                        •
                      </Text>
                      <Text size={1}>{tip}</Text>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Card>
    </Box>
  );
}
