// @ts-nocheck
import { useEffect, useState } from "react";
import { useClient } from "sanity";
import {
  Box,
  Card,
  Text,
  Flex,
  Badge,
  Heading,
  Stack,
  Spinner,
  Button,
  TextInput,
} from "@sanity/ui";
import { Search, ExternalLink, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { scoreDocument, gradeColor } from "./seoUtils";

const GROQ_QUERY = `{
  "homePages": *[_type == "homePage"] {
    _id, _type, "title": "Home Page", "slug": {"current": ""}, metaTitle, metaDescription,
    "excerpt": heroSubheadline
  },
  "blogPosts": *[_type == "blogPost"] | order(publishedAt desc) {
    _id, _type, title, slug, metaTitle, metaDescription, excerpt,
    featuredImage { asset, alt }
  },
  "caseStudies": *[_type == "caseStudy"] | order(publishedAt desc) {
    _id, _type, clientName, slug, metaTitle, metaDescription, summary,
    photo { asset }
  },
  "servicePages": *[_type == "servicePage"] | order(title asc) {
    _id, _type, title, slug, metaTitle, metaDescription
  },
  "landingPages": *[_type == "landingPage" && noIndex != true] | order(title asc) {
    _id, _type, title, slug, metaTitle, metaDescription, excerpt
  }
}`;

type FilterKey = "all" | "missingTitle" | "missingDesc" | "lowScore" | string;

interface PageRow {
  _id: string;
  _type: string;
  displayTitle: string;
  score: number;
  grade: "good" | "ok" | "poor";
  issueCount: number;
  slug: string;
}

const TYPE_LABELS: Record<string, string> = {
  homePage: "Home",
  blogPost: "Blog",
  caseStudy: "Case Study",
  servicePage: "Service",
  landingPage: "Landing",
};

const TYPE_TONES: Record<string, string> = {
  homePage: "positive",
  blogPost: "primary",
  caseStudy: "caution",
  servicePage: "positive",
  landingPage: "default",
};

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <Flex align="center" gap={2}>
      <div
        style={{
          width: 80,
          height: 6,
          background: "#e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.3s",
          }}
        />
      </div>
      <Text size={1} weight="semibold" style={{ color, minWidth: 28 }}>
        {score}
      </Text>
    </Flex>
  );
}

export function SEODashboard() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [rawCounts, setRawCounts] = useState<Record<string, number> | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "title">("score");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    client
      .fetch(GROQ_QUERY)
      .then((data) => {
        setRawCounts({
          homePages: data.homePages?.length ?? 0,
          blogPosts: data.blogPosts?.length ?? 0,
          caseStudies: data.caseStudies?.length ?? 0,
          servicePages: data.servicePages?.length ?? 0,
          landingPages: data.landingPages?.length ?? 0,
        });

        const all: PageRow[] = [];

        function addRows(docs: unknown[], titleKey: string) {
          for (const doc of docs ?? []) {
            const displayTitle =
              doc[titleKey] || doc.title || doc.clientName || doc.headline || "(Untitled)";
            const { total, checks, grade } = scoreDocument(doc);
            const issueCount = checks.filter((c) => c.status !== "pass").length;
            all.push({
              _id: doc._id,
              _type: doc._type,
              displayTitle,
              score: total,
              grade,
              issueCount,
              slug: doc.slug?.current ?? "",
            });
          }
        }

        addRows(data.homePages, "title");
        addRows(data.blogPosts, "title");
        addRows(data.caseStudies, "clientName");
        addRows(data.servicePages, "title");
        addRows(data.landingPages, "title");

        setRows(all);
      })
      .catch((err) => {
        console.error("[SEO Dashboard]", err);
        setFetchError(String(err?.message ?? err));
      })
      .finally(() => setLoading(false));
  }, [client]);

  function openDocument(id: string, type: string) {
    window.location.href = `/studio/structure/${type};${id}`;
  }

  const filtered = rows
    .filter((r) => {
      if (filter === "missingTitle") return !r.score || r.issueCount > 3;
      if (filter === "missingDesc") return r.score < 50;
      if (filter === "lowScore") return r.score < 50;
      return true;
    })
    .filter((r) => typeFilter === "all" || r._type === typeFilter)
    .filter((r) => !search || r.displayTitle.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortAsc ? 1 : -1;
      if (sortBy === "score") return (a.score - b.score) * mul;
      return a.displayTitle.localeCompare(b.displayTitle) * mul;
    });

  const avgScore =
    rows.length > 0 ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;
  const goodCount = rows.filter((r) => r.grade === "good").length;
  const poorCount = rows.filter((r) => r.grade === "poor").length;

  return (
    <Box padding={4} style={{ maxWidth: 960, margin: "0 auto" }}>
      <Heading size={3} style={{ marginBottom: 6 }}>
        SEO Audit
      </Heading>
      <Text size={1} muted style={{ marginBottom: 24, display: "block" }}>
        Live health scores for all CMS-managed pages. Click a row to open in the editor.
      </Text>

      {loading ? (
        <Flex align="center" justify="center" padding={6}>
          <Spinner />
          <Text size={1} muted style={{ marginLeft: 10 }}>
            Loading pages…
          </Text>
        </Flex>
      ) : fetchError ? (
        <Card tone="critical" padding={4} radius={2}>
          <Heading size={1} style={{ marginBottom: 8 }}>Query error</Heading>
          <Text size={1}>{fetchError}</Text>
        </Card>
      ) : rawCounts && Object.values(rawCounts).every((n) => n === 0) ? (
        <Card padding={5} radius={2} shadow={1}>
          <Heading size={2} style={{ marginBottom: 12 }}>No CMS content found</Heading>
          <Text size={2} style={{ marginBottom: 16, display: "block" }}>
            The SEO dashboard scores <strong>Sanity-managed</strong> pages. Your Sanity dataset currently has no documents of these types:
          </Text>
          <Stack space={2} style={{ marginBottom: 20 }}>
            {Object.entries(rawCounts).map(([key, count]) => (
              <Flex key={key} align="center" gap={2}>
                <XCircle size={14} style={{ color: "#ef4444", flexShrink: 0 }} />
                <Text size={1}>{key}: {count} documents</Text>
              </Flex>
            ))}
          </Stack>
          <Text size={1} muted style={{ display: "block", marginBottom: 8 }}>
            <strong>Blog posts</strong> — the site currently uses hardcoded blog posts in Next.js. To track them here, migrate them to Sanity via Structure → Blog Posts → New.
          </Text>
          <Text size={1} muted style={{ display: "block", marginBottom: 8 }}>
            <strong>Service pages</strong> — the site uses hardcoded service page data. Create matching documents in Structure → Service Pages to track SEO scores here.
          </Text>
          <Text size={1} muted style={{ display: "block" }}>
            <strong>Landing pages</strong> — any CMS landing pages (Structure → Landing Pages) will appear automatically once created.
          </Text>
        </Card>
      ) : (
        <>
          {/* ── Summary stats ─────────────────────────────────── */}
          <Flex gap={3} style={{ marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { label: "Total pages", value: rows.length, color: "#6b7280" },
              { label: "Avg score", value: avgScore, color: gradeColor(avgScore >= 80 ? "good" : avgScore >= 50 ? "ok" : "poor") },
              { label: "Good (80+)", value: goodCount, color: "#10b981" },
              { label: "Poor (<50)", value: poorCount, color: "#ef4444" },
            ].map(({ label, value, color }) => (
              <Card key={label} padding={3} radius={2} shadow={1} style={{ minWidth: 110, flex: 1 }}>
                <Text size={0} muted style={{ textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, display: "block" }}>
                  {label}
                </Text>
                <Text size={3} weight="bold" style={{ color }}>
                  {value}
                </Text>
              </Card>
            ))}
          </Flex>

          {/* ── Filters ───────────────────────────────────────── */}
          <Flex gap={2} style={{ marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            {[
              { key: "all", label: "All" },
              { key: "lowScore", label: "Score < 50" },
            ].map(({ key, label }) => (
              <Button
                key={key}
                text={label}
                mode={filter === key ? "default" : "ghost"}
                tone={filter === key ? "primary" : "default"}
                fontSize={1}
                onClick={() => setFilter(key)}
              />
            ))}
            <div style={{ width: 1, height: 24, background: "#e5e7eb", margin: "0 4px" }} />
            {["all", "blogPost", "caseStudy", "servicePage", "landingPage"].map((t) => (
              <Button
                key={t}
                text={t === "all" ? "All types" : (TYPE_LABELS[t] ?? t)}
                mode={typeFilter === t ? "default" : "ghost"}
                tone={typeFilter === t ? "primary" : "default"}
                fontSize={1}
                onClick={() => setTypeFilter(t)}
              />
            ))}
            <Box flex={1} style={{ minWidth: 180 }}>
              <TextInput
                placeholder="Search pages…"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                icon={Search}
                fontSize={1}
              />
            </Box>
          </Flex>

          {/* ── Sort controls ─────────────────────────────────── */}
          <Flex gap={2} style={{ marginBottom: 8 }} align="center">
            <Text size={0} muted>Sort by:</Text>
            <Button
              text={`Score ${sortBy === "score" ? (sortAsc ? "↑" : "↓") : ""}`}
              mode={sortBy === "score" ? "default" : "ghost"}
              fontSize={0}
              onClick={() => {
                if (sortBy === "score") setSortAsc(!sortAsc);
                else { setSortBy("score"); setSortAsc(true); }
              }}
            />
            <Button
              text={`Title ${sortBy === "title" ? (sortAsc ? "↑" : "↓") : ""}`}
              mode={sortBy === "title" ? "default" : "ghost"}
              fontSize={0}
              onClick={() => {
                if (sortBy === "title") setSortAsc(!sortAsc);
                else { setSortBy("title"); setSortAsc(true); }
              }}
            />
            <Text size={0} muted style={{ marginLeft: "auto" }}>
              {filtered.length} of {rows.length} pages
            </Text>
          </Flex>

          {/* ── Table ─────────────────────────────────────────── */}
          <Stack space={1}>
            {filtered.length === 0 ? (
              <Card padding={4} radius={2} style={{ textAlign: "center" }}>
                <Text size={1} muted>No pages match the current filters.</Text>
              </Card>
            ) : (
              filtered.map((row) => {
                const color = gradeColor(row.grade);
                return (
                  <Card
                    key={row._id}
                    padding={3}
                    radius={2}
                    shadow={1}
                    style={{ cursor: "pointer", borderLeft: `3px solid ${color}` }}
                    onClick={() => openDocument(row._id, row._type)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{
                        flexShrink: 0,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: row._type === "homePage" ? "#d1fae5"
                          : row._type === "blogPost" ? "#dbeafe"
                          : row._type === "caseStudy" ? "#fef3c7"
                          : row._type === "landingPage" ? "#f3f4f6"
                          : "#d1fae5",
                        color: row._type === "homePage" ? "#065f46"
                          : row._type === "blogPost" ? "#1e40af"
                          : row._type === "caseStudy" ? "#92400e"
                          : row._type === "landingPage" ? "#374151"
                          : "#065f46",
                      }}>
                        {TYPE_LABELS[row._type] ?? row._type}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {row.displayTitle}
                        </div>
                        {row.slug && (
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>/{row.slug}</div>
                        )}
                      </div>
                      <ScoreBar score={row.score} color={color} />
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, minWidth: 80 }}>
                        {row.issueCount > 0 ? (
                          <>
                            <AlertCircle size={13} style={{ color: "#f59e0b" }} />
                            <span style={{ fontSize: 12, color: "#6b7280" }}>
                              {row.issueCount} issue{row.issueCount !== 1 ? "s" : ""}
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={13} style={{ color: "#10b981" }} />
                            <span style={{ fontSize: 12, color: "#6b7280" }}>All good</span>
                          </>
                        )}
                      </div>
                      <ExternalLink size={14} style={{ color: "#9ca3af", flexShrink: 0 }} />
                    </div>
                  </Card>
                );
              })
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}
