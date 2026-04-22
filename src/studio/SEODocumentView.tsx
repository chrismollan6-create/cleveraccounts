// @ts-nocheck
import { useEffect, useState } from "react";
import { Box, Button, Spinner, Heading } from "@sanity/ui";
import {
  CheckCircle2, AlertCircle, XCircle, Copy, Check, RefreshCw,
  Search, FileText, Code2, TrendingUp, Monitor, ChevronDown, ChevronUp,
  Download,
} from "lucide-react";
import { scoreDocument, gradeColor } from "./seoUtils";

interface Finding {
  priority: "high" | "medium" | "low";
  issue: string;
  fix: string;
}
interface AuditCategory { name: string; findings: Finding[] }
interface AuditResult {
  suggestedTitle: string;
  suggestedDescription: string;
  categories: AuditCategory[];
}
interface CacheEntry {
  ts: number;
  data: AuditResult;
  title: string;
}

// No TTL expiry — audits persist until manually refreshed
function getCached(id: string): { data: AuditResult; ts: number; title: string } | null {
  try {
    const raw = localStorage.getItem(`seo-audit-${id}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
function setCache(id: string, data: AuditResult, title: string) {
  try {
    localStorage.setItem(`seo-audit-${id}`, JSON.stringify({ ts: Date.now(), data, title }));
  } catch {}
}

function formatAgo(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function exportReport(title: string, audit: AuditResult, score: number): void {
  const lines: string[] = [
    `SEO HEALTH REPORT — ${title}`,
    `Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
    `Field Score: ${score}/100`,
    "",
    `SUGGESTED META TITLE (${audit.suggestedTitle.length} chars)`,
    audit.suggestedTitle,
    "",
    `SUGGESTED META DESCRIPTION (${audit.suggestedDescription.length} chars)`,
    audit.suggestedDescription,
    "",
  ];

  for (const cat of audit.categories ?? []) {
    lines.push(`${"─".repeat(60)}`);
    lines.push(cat.name.toUpperCase());
    lines.push("");
    for (const f of cat.findings ?? []) {
      lines.push(`[${f.priority.toUpperCase()}] ${f.issue}`);
      lines.push(`→ Fix: ${f.fix}`);
      lines.push("");
    }
  }

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-report-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

const PRIORITY_CONFIG = {
  high:   { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", label: "High" },
  medium: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", label: "Medium" },
  low:    { color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", label: "Low" },
};

const CATEGORY_ICONS: Record<string, any> = {
  "Meta & Search Appearance": Search,
  "Content & Keywords": FileText,
  "Technical SEO": Code2,
  "PPC & Conversion": TrendingUp,
  "User Experience": Monitor,
};

function PriorityBadge({ priority }: { priority: string }) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.low;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
      padding: "3px 9px", borderRadius: 20,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
      flexShrink: 0, whiteSpace: "nowrap",
    }}>
      {priority === "high" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />}
      {cfg.label}
    </span>
  );
}

function FindingCard({ finding, index }: { finding: Finding; index: number }) {
  const [open, setOpen] = useState(finding.priority === "high");
  const cfg = PRIORITY_CONFIG[finding.priority] ?? PRIORITY_CONFIG.low;
  return (
    <div style={{
      borderRadius: 8, border: `1px solid ${open ? cfg.border : "#e5e7eb"}`,
      overflow: "hidden", transition: "border-color 0.15s",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: open ? cfg.bg : "white",
          border: "none", cursor: "pointer", padding: "10px 14px",
          display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left",
          transition: "background 0.15s",
        }}
      >
        <PriorityBadge priority={finding.priority} />
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>
          {finding.issue}
        </span>
        <span style={{ color: "#9ca3af", flexShrink: 0, marginTop: 2 }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      {open && (
        <div style={{
          padding: "0 14px 12px 14px", background: open ? cfg.bg : "white",
          borderTop: `1px solid ${cfg.border}`,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", paddingTop: 10 }}>
            <span style={{
              fontSize: 10, fontWeight: 800, color: cfg.color, letterSpacing: "0.06em",
              paddingTop: 2, flexShrink: 0, textTransform: "uppercase",
            }}>→ Fix</span>
            <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
              {finding.fix}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({ category }: { category: AuditCategory }) {
  const Icon = CATEGORY_ICONS[category.name] ?? FileText;
  const highCount = category.findings.filter(f => f.priority === "high").length;
  const medCount = category.findings.filter(f => f.priority === "medium").length;

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Category header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 0 8px 0", marginBottom: 8,
        borderBottom: "2px solid #f3f4f6",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6, background: "#f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={14} style={{ color: "#6b7280" }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#111827", flex: 1 }}>
          {category.name}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {highCount > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
              background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca",
            }}>{highCount} high</span>
          )}
          {medCount > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
              background: "#fffbeb", color: "#f59e0b", border: "1px solid #fde68a",
            }}>{medCount} med</span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {category.findings.map((f, i) => (
          <FindingCard key={i} finding={f} index={i} />
        ))}
      </div>
    </div>
  );
}

export function SEODocumentView({ document: docBundle }) {
  const doc = docBundle?.displayed ?? {};
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [auditTs, setAuditTs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [checksOpen, setChecksOpen] = useState(false);

  const { total, checks, grade } = scoreDocument(doc);
  const color = gradeColor(grade);
  const docTitle = doc.title ?? doc.clientName ?? doc.headline ?? doc.heroHeadline ?? "Page";

  async function runAudit(force = false) {
    if (!doc._id) return;
    if (!force) {
      const cached = getCached(doc._id);
      if (cached) { setAudit(cached.data); setAuditTs(cached.ts); return; }
    }
    setLoading(true);
    setError(null);
    setAudit(null);
    setAuditTs(null);
    try {
      const res = await fetch("/api/seo/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: doc._type ?? "page",
          title: docTitle,
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
      const now = Date.now();
      setAudit(data);
      setAuditTs(now);
      setCache(doc._id, data, docTitle);
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

  const totalHigh = audit?.categories.reduce((n, c) => n + c.findings.filter(f => f.priority === "high").length, 0) ?? 0;
  const totalMed  = audit?.categories.reduce((n, c) => n + c.findings.filter(f => f.priority === "medium").length, 0) ?? 0;
  const totalLow  = audit?.categories.reduce((n, c) => n + c.findings.filter(f => f.priority === "low").length, 0) ?? 0;
  const gradeLabel = grade === "good" ? "Good" : grade === "ok" ? "Needs Work" : "Poor";

  return (
    <Box padding={4} style={{ maxWidth: 640, overflowY: "auto" }}>

      {/* ── Header bar ───────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <Heading size={2}>Page Health Report</Heading>
          {auditTs && (
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af" }}>
              Last audited {formatAgo(auditTs)} — results saved locally
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {audit && (
            <Button
              text="Export"
              mode="ghost"
              fontSize={1}
              icon={Download}
              onClick={() => exportReport(docTitle, audit, total)}
            />
          )}
          <Button
            text={loading ? "Running…" : "Refresh"}
            mode="ghost"
            fontSize={1}
            icon={loading ? Spinner : RefreshCw}
            disabled={loading}
            onClick={() => runAudit(true)}
          />
        </div>
      </div>

      {/* ── Score + summary ───────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
        borderRadius: 12, padding: 20, marginBottom: 12,
        display: "flex", alignItems: "center", gap: 20,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: `3px solid ${color}`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "white", lineHeight: 1 }}>{total}</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", marginTop: 2 }}>/ 100</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{gradeLabel}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
              background: color + "33", color: color, border: `1px solid ${color}55`,
            }}>Field Score</span>
          </div>
          {audit && (
            <div style={{ display: "flex", gap: 10 }}>
              {totalHigh > 0 && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#fca5a5" }}>{totalHigh}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>High</div>
                </div>
              )}
              {totalMed > 0 && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#fde68a" }}>{totalMed}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>Medium</div>
                </div>
              )}
              {totalLow > 0 && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#6ee7b7" }}>{totalLow}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>Low / Pass</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Field checks (collapsible) ────────────────────────── */}
      <div style={{
        background: "white", border: "1px solid #e5e7eb", borderRadius: 10,
        marginBottom: 12, overflow: "hidden",
      }}>
        <button
          onClick={() => setChecksOpen(!checksOpen)}
          style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            padding: "10px 14px", display: "flex", alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Field Checks
          </span>
          <span style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{checksOpen ? "Hide" : "Show"}</span>
            {checksOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </button>
        {checksOpen && (
          <div style={{ borderTop: "1px solid #f3f4f6" }}>
            {checks.map((check, i) => (
              <div key={check.key} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 14px",
                borderTop: i === 0 ? "none" : "1px solid #f9fafb",
              }}>
                {statusIcon(check.status)}
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{check.label}</span>
                  <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 6 }}>{check.message}</span>
                </div>
                <span style={{ fontSize: 11, color: "#d1d5db", fontWeight: 600 }}>
                  {check.earned}/{check.weight}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Loading ───────────────────────────────────────────── */}
      {loading && (
        <div style={{
          background: "white", border: "1px solid #e5e7eb", borderRadius: 10,
          padding: 32, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 12,
        }}>
          <Spinner />
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
            Fetching live page and running full audit…
          </p>
        </div>
      )}

      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 14,
        }}>
          <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {!audit && !loading && !error && (
        <div style={{
          background: "white", border: "1px solid #e5e7eb", borderRadius: 10,
          padding: 32, textAlign: "center",
        }}>
          <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>No audit run yet.</p>
        </div>
      )}

      {/* ── Audit results ─────────────────────────────────────── */}
      {audit && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Suggested meta */}
          <div style={{
            background: "white", border: "1px solid #e5e7eb", borderRadius: 10,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "10px 14px", borderBottom: "1px solid #f3f4f6",
              background: "#fafafa",
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Suggested Copy
              </span>
            </div>

            {/* Title */}
            <div style={{ padding: 14, borderBottom: "1px solid #f9fafb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Meta Title</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontSize: 11, color: audit.suggestedTitle.length > 60 ? "#ef4444" : audit.suggestedTitle.length < 30 ? "#f59e0b" : "#10b981",
                    fontWeight: 600,
                  }}>
                    {audit.suggestedTitle.length} chars
                    {audit.suggestedTitle.length > 60 && " ⚠ over"}
                    {audit.suggestedTitle.length < 30 && " ⚠ short"}
                  </span>
                  <button
                    onClick={() => copyText(audit.suggestedTitle, "title")}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                      background: copied === "title" ? "#f0fdf4" : "#f3f4f6",
                      color: copied === "title" ? "#10b981" : "#6b7280",
                      border: "none", cursor: "pointer",
                    }}
                  >
                    {copied === "title" ? <Check size={11} /> : <Copy size={11} />}
                    {copied === "title" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "#111827", lineHeight: 1.5 }}>
                {audit.suggestedTitle}
              </p>
            </div>

            {/* Description */}
            <div style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Meta Description</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontSize: 11, color: audit.suggestedDescription.length > 160 ? "#ef4444" : audit.suggestedDescription.length < 120 ? "#f59e0b" : "#10b981",
                    fontWeight: 600,
                  }}>
                    {audit.suggestedDescription.length} chars
                    {audit.suggestedDescription.length > 160 && " ⚠ over"}
                    {audit.suggestedDescription.length < 120 && " ⚠ short"}
                  </span>
                  <button
                    onClick={() => copyText(audit.suggestedDescription, "desc")}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                      background: copied === "desc" ? "#f0fdf4" : "#f3f4f6",
                      color: copied === "desc" ? "#10b981" : "#6b7280",
                      border: "none", cursor: "pointer",
                    }}
                  >
                    {copied === "desc" ? <Check size={11} /> : <Copy size={11} />}
                    {copied === "desc" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "#111827", lineHeight: 1.5 }}>
                {audit.suggestedDescription}
              </p>
            </div>
          </div>

          {/* Categories */}
          <div style={{
            background: "white", border: "1px solid #e5e7eb", borderRadius: 10,
            overflow: "hidden",
          }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Findings
              </span>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 20 }}>
              {audit.categories?.map((cat) => (
                <CategorySection key={cat.name} category={cat} />
              ))}
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 11, color: "#d1d5db", textAlign: "center" }}>
            Results saved locally in this browser · Click Refresh to re-run · Export saves a .txt file
          </p>
        </div>
      )}
    </Box>
  );
}
