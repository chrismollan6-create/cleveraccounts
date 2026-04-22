// @ts-nocheck
import { useEffect, useState } from "react";
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
import { CheckCircle2, AlertCircle, XCircle, Copy, Check, RefreshCw } from "lucide-react";
import { scoreDocument, gradeColor } from "./seoUtils";

interface Finding {
  priority: "high" | "medium" | "low";
  issue: string;
  fix: string;
}

interface AuditCategory {
  name: string;
  findings: Finding[];
}

interface AuditResult {
  suggestedTitle: string;
  suggestedDescription: string;
  categories: AuditCategory[];
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCached(id: string): AuditResult | null {
  try {
    const raw = localStorage.getItem(`seo-audit-${id}`);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(id: string, data: AuditResult) {
  try {
    localStorage.setItem(`seo-audit-${id}`, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

function priorityColor(p: string) {
  if (p === "high") return "#ef4444";
  if (p === "medium") return "#f59e0b";
  return "#10b981";
}

function priorityLabel(p: string) {
  return p.charAt(0).toUpperCase() + p.slice(1);
}

export function SEODocumentView({ document: docBundle }) {
  const doc = docBundle?.displayed ?? {};
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [checksOpen, setChecksOpen] = useState(false);

  const { total, checks, grade } = scoreDocument(doc);
  const color = gradeColor(grade);

  async function runAudit(force = false) {
    if (!doc._id) return;
    if (!force) {
      const cached = getCached(doc._id);
      if (cached) { setAudit(cached); return; }
    }
    setLoading(true);
    setError(null);
    setAudit(null);
    try {
      const res = await fetch("/api/seo/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: doc._type ?? "page",
          title: doc.title ?? doc.clientName ?? doc.headline ?? doc.heroHeadline ?? "",
          metaTitle: doc.metaTitle ?? "",
          metaDescription: doc.metaDescription ?? "",
          excerpt: doc.excerpt ?? doc.summary ?? doc.heroSubheadline ?? "",
          slug: doc.slug?.current ?? "",
        }),
      });
      if (!res.ok) {
        let msg = `API error ${res.status}`;
        try { const b = await res.json(); if (b?.error) msg = b.error; } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      setAudit(data);
      setCache(doc._id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { runAudit(); }, [doc._id]);

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

  const issueCount = audit?.categories.reduce((n, c) => n + c.findings.filter(f => f.priority === "high").length, 0) ?? 0;
  const gradeLabel = grade === "good" ? "Good" : grade === "ok" ? "Needs work" : "Poor";
  const gradeTone = grade === "good" ? "positive" : grade === "ok" ? "caution" : "critical";

  return (
    <Box padding={4} style={{ maxWidth: 620, overflowY: "auto" }}>

      {/* ── Score + refresh ──────────────────────────────────── */}
      <Card padding={4} radius={3} shadow={1} marginBottom={3} style={{ borderLeft: `4px solid ${color}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: color,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Text size={3} weight="bold" style={{ color: "white" }}>{total}</Text>
            </div>
            <div>
              <Heading size={2} style={{ marginBottom: 6 }}>Page Health</Heading>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge tone={gradeTone}>{gradeLabel}</Badge>
                {audit && issueCount > 0 && (
                  <Badge tone="critical">{issueCount} high priority</Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            text={loading ? "Analysing…" : "Refresh"}
            mode="ghost"
            fontSize={1}
            icon={loading ? Spinner : RefreshCw}
            disabled={loading}
            onClick={() => runAudit(true)}
          />
        </div>
      </Card>

      {/* ── Static checks (collapsible) ──────────────────────── */}
      <Card padding={3} radius={3} shadow={1} marginBottom={3}>
        <button
          onClick={() => setChecksOpen(!checksOpen)}
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text size={1} weight="semibold" style={{ opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Field Checks
            </Text>
            <Text size={0} muted>{checksOpen ? "▲ Hide" : "▼ Show"}</Text>
          </div>
        </button>
        {checksOpen && (
          <Stack space={2} style={{ marginTop: 12 }}>
            {checks.map((check) => (
              <div key={check.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                {statusIcon(check.status)}
                <div style={{ flex: 1 }}>
                  <Text size={1} weight="semibold">{check.label}</Text>
                  <Text size={1} muted>{check.message}</Text>
                </div>
                <Text size={0} muted style={{ flexShrink: 0 }}>{check.earned}/{check.weight}pts</Text>
              </div>
            ))}
          </Stack>
        )}
      </Card>

      {/* ── AI Audit ─────────────────────────────────────────── */}
      {loading && (
        <Card padding={5} radius={3} shadow={1}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Spinner />
            <Text size={1} muted>Fetching live page and running full audit…</Text>
          </div>
        </Card>
      )}

      {error && (
        <Card tone="critical" padding={3} radius={3} shadow={1}>
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {!audit && !loading && !error && (
        <Card padding={4} radius={3} shadow={1} style={{ textAlign: "center" }}>
          <Text size={1} muted>No audit run yet.</Text>
        </Card>
      )}

      {audit && !loading && (
        <Stack space={3}>
          {/* Suggested meta title */}
          <Card padding={3} radius={3} shadow={1}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text size={1} weight="semibold">Suggested Meta Title</Text>
              <Button
                text={copied === "title" ? "Copied!" : "Copy"}
                mode="ghost" fontSize={0}
                icon={copied === "title" ? Check : Copy}
                onClick={() => copyText(audit.suggestedTitle, "title")}
                tone={copied === "title" ? "positive" : "default"}
              />
            </div>
            <Card padding={3} radius={2} style={{ background: "var(--card-bg, #f9fafb)" }}>
              <Text size={2}>{audit.suggestedTitle}</Text>
              <Text size={0} muted style={{ marginTop: 4 }}>
                {audit.suggestedTitle.length} chars
                {audit.suggestedTitle.length > 60 && " ⚠ over 60"}
                {audit.suggestedTitle.length < 30 && " ⚠ under 30"}
              </Text>
            </Card>
          </Card>

          {/* Suggested meta description */}
          <Card padding={3} radius={3} shadow={1}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text size={1} weight="semibold">Suggested Meta Description</Text>
              <Button
                text={copied === "desc" ? "Copied!" : "Copy"}
                mode="ghost" fontSize={0}
                icon={copied === "desc" ? Check : Copy}
                onClick={() => copyText(audit.suggestedDescription, "desc")}
                tone={copied === "desc" ? "positive" : "default"}
              />
            </div>
            <Card padding={3} radius={2} style={{ background: "var(--card-bg, #f9fafb)" }}>
              <Text size={2}>{audit.suggestedDescription}</Text>
              <Text size={0} muted style={{ marginTop: 4 }}>
                {audit.suggestedDescription.length} chars
                {audit.suggestedDescription.length > 160 && " ⚠ over 160"}
                {audit.suggestedDescription.length < 120 && " ⚠ under 120"}
              </Text>
            </Card>
          </Card>

          {/* Categorised findings */}
          {audit.categories?.map((cat) => (
            <Card key={cat.name} padding={3} radius={3} shadow={1}>
              <Text size={1} weight="semibold" style={{
                display: "block", marginBottom: 12,
                textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.6,
              }}>
                {cat.name}
              </Text>
              <Stack space={3}>
                {cat.findings?.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{
                      flexShrink: 0, fontSize: 10, fontWeight: 700,
                      padding: "2px 7px", borderRadius: 4, marginTop: 2,
                      background: priorityColor(f.priority) + "22",
                      color: priorityColor(f.priority),
                    }}>
                      {priorityLabel(f.priority)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <Text size={1} weight="semibold" style={{ display: "block", marginBottom: 2 }}>
                        {f.issue}
                      </Text>
                      <Text size={1} muted>{f.fix}</Text>
                    </div>
                  </div>
                ))}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
