/**
 * Performance Dashboard — custom Sanity Studio tool.
 *
 * Renders inside the Studio browser context so it can use `useClient` to
 * query Sanity directly. Uses @sanity/ui primitives so it inherits Studio
 * theming without fighting Tailwind.
 */

import { useEffect, useState } from "react";
import { useClient } from "sanity";
import {
  Box,
  Card,
  Text,
  Flex,
  Grid,
  Badge,
  Heading,
  Stack,
  Spinner,
  Button,
} from "@sanity/ui";
import {
  FileText,
  BookOpen,
  Star,
  HelpCircle,
  Tag,
  Layers,
  TrendingUp,
  Megaphone,
  Users,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContentStats {
  blogCount: number;
  caseStudyCount: number;
  testimonialCount: number;
  faqCount: number;
  landingPageCount: number;
  pricingPlanCount: number;
  servicePageCount: number;
  teamMemberCount: number;
  activeBanner: { text: string } | null;
  recentPosts: Array<{ title: string; publishedAt: string; category: string }>;
  landingPages: Array<{ title: string; slug: { current: string }; noIndex: boolean }>;
  recentCaseStudies: Array<{ clientName: string; businessType: string; featured: boolean }>;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  tone,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  href?: string;
  tone?: "positive" | "caution" | "critical" | "default";
}) {
  const borderColor =
    tone === "positive"
      ? "#10b981"
      : tone === "caution"
      ? "#f59e0b"
      : tone === "critical"
      ? "#ef4444"
      : "#e5e7eb";

  return (
    <Card
      padding={4}
      radius={3}
      shadow={1}
      style={{ borderLeft: `4px solid ${borderColor}`, cursor: href ? "pointer" : "default" }}
      onClick={href ? () => window.open(href, "_blank") : undefined}
    >
      <Flex align="center" gap={3}>
        <Box
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} className="text-gray-600" />
        </Box>
        <Box>
          <Text size={3} weight="bold">
            {value}
          </Text>
          <Text size={1} muted>
            {label}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Box marginBottom={3}>
      <Heading size={1}>{children}</Heading>
    </Box>
  );
}

function FunnelStep({
  step,
  label,
  description,
  status,
}: {
  step: number;
  label: string;
  description: string;
  status: "live" | "tracked" | "needs-setup";
}) {
  const statusConfig = {
    live: { color: "#10b981", icon: CheckCircle2, text: "Live" },
    tracked: { color: "#3b82f6", icon: CheckCircle2, text: "Tracked" },
    "needs-setup": { color: "#f59e0b", icon: AlertCircle, text: "Needs setup" },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <Flex align="flex-start" gap={3} paddingY={2}>
      <Box
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#1d4ed8",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {step}
      </Box>
      <Box flex={1}>
        <Flex align="center" gap={2} marginBottom={1}>
          <Text size={2} weight="semibold">
            {label}
          </Text>
          <Flex
            align="center"
            gap={1}
            style={{
              background: `${statusConfig.color}20`,
              borderRadius: 6,
              padding: "2px 8px",
            }}
          >
            <StatusIcon size={12} style={{ color: statusConfig.color }} />
            <Text size={1} style={{ color: statusConfig.color }}>
              {statusConfig.text}
            </Text>
          </Flex>
        </Flex>
        <Text size={1} muted>
          {description}
        </Text>
      </Box>
    </Flex>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PerformanceDashboard() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  async function fetchStats() {
    setLoading(true);
    setError(null);
    try {
      const now = new Date().toISOString();
      const result = await client.fetch<ContentStats>(`{
        "blogCount":        count(*[_type == "blogPost"]),
        "caseStudyCount":   count(*[_type == "caseStudy"]),
        "testimonialCount": count(*[_type == "testimonial"]),
        "faqCount":         count(*[_type == "faq"]),
        "landingPageCount": count(*[_type == "landingPage"]),
        "pricingPlanCount": count(*[_type == "pricingPlan"]),
        "servicePageCount": count(*[_type == "servicePage"]),
        "teamMemberCount":  count(*[_type == "teamMember"]),
        "activeBanner": *[_type == "promoBanner" && active == true &&
          (startDate == null || startDate <= $now) &&
          (endDate == null || endDate >= $now)
        ] | order(_createdAt desc)[0] { text },
        "recentPosts": *[_type == "blogPost"] | order(publishedAt desc)[0...5] {
          title, publishedAt, category
        },
        "landingPages": *[_type == "landingPage"] | order(_createdAt desc) {
          title, slug, noIndex
        },
        "recentCaseStudies": *[_type == "caseStudy"] | order(_createdAt desc)[0...4] {
          clientName, businessType, featured
        }
      }`, { now });
      setStats(result);
      setLastRefreshed(new Date());
    } catch (err) {
      setError("Failed to load dashboard data. Check your Sanity credentials.");
      console.error("[PerformanceDashboard]", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box padding={5} style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <Flex align="center" justify="space-between" marginBottom={5}>
        <Box>
          <Heading size={3}>Performance Dashboard</Heading>
          <Text size={1} muted style={{ marginTop: 4 }}>
            Content inventory, funnel overview, and quick links for marketing, sales & owners.
          </Text>
        </Box>
        <Flex align="center" gap={3}>
          {!loading && (
            <Text size={1} muted>
              Refreshed {lastRefreshed.toLocaleTimeString()}
            </Text>
          )}
          <Button
            text="Refresh"
            tone="default"
            mode="ghost"
            onClick={fetchStats}
            disabled={loading}
          />
        </Flex>
      </Flex>

      {/* Active banner callout */}
      {stats?.activeBanner && (
        <Card
          padding={3}
          radius={3}
          marginBottom={4}
          style={{ background: "#fef3c7", borderLeft: "4px solid #f59e0b" }}
        >
          <Flex align="center" gap={2}>
            <Megaphone size={16} style={{ color: "#92400e", flexShrink: 0 }} />
            <Text size={2} style={{ color: "#92400e" }}>
              <strong>Active promo banner:</strong> &ldquo;{stats.activeBanner.text}&rdquo;
            </Text>
          </Flex>
        </Card>
      )}

      {error && (
        <Card padding={4} tone="critical" radius={3} marginBottom={4}>
          <Text>{error}</Text>
        </Card>
      )}

      {loading ? (
        <Flex align="center" justify="center" style={{ height: 300 }}>
          <Stack align="center" space={3}>
            <Spinner muted />
            <Text muted>Loading dashboard…</Text>
          </Stack>
        </Flex>
      ) : stats ? (
        <Stack space={6}>
          {/* ── Content Inventory ─────────────────────────────────────────── */}
          <Box>
            <SectionHeading>Content Inventory</SectionHeading>
            <Grid columns={[2, 2, 4]} gap={3}>
              <StatCard
                icon={FileText}
                label="Blog Posts"
                value={stats.blogCount}
                tone={stats.blogCount > 0 ? "positive" : "caution"}
              />
              <StatCard
                icon={BookOpen}
                label="Case Studies"
                value={stats.caseStudyCount}
                tone={stats.caseStudyCount > 0 ? "positive" : "caution"}
              />
              <StatCard
                icon={Star}
                label="Testimonials"
                value={stats.testimonialCount}
                tone={stats.testimonialCount >= 3 ? "positive" : "caution"}
              />
              <StatCard
                icon={HelpCircle}
                label="FAQs"
                value={stats.faqCount}
                tone={stats.faqCount > 0 ? "positive" : "caution"}
              />
              <StatCard
                icon={Tag}
                label="Pricing Plans"
                value={stats.pricingPlanCount}
                tone={stats.pricingPlanCount > 0 ? "positive" : "critical"}
              />
              <StatCard
                icon={Layers}
                label="Service Pages"
                value={stats.servicePageCount}
              />
              <StatCard
                icon={TrendingUp}
                label="CMS Landing Pages"
                value={stats.landingPageCount}
                tone={stats.landingPageCount > 0 ? "positive" : "default"}
              />
              <StatCard
                icon={Users}
                label="Team Members"
                value={stats.teamMemberCount}
              />
            </Grid>
          </Box>

          {/* ── Two-column: Recent Posts + Landing Pages ───────────────────── */}
          <Grid columns={[1, 1, 2]} gap={4}>
            {/* Recent Blog Posts */}
            <Box>
              <SectionHeading>Recent Blog Posts</SectionHeading>
              <Card padding={0} radius={3} shadow={1}>
                {stats.recentPosts.length === 0 ? (
                  <Box padding={4}>
                    <Text muted size={2}>No blog posts published yet.</Text>
                  </Box>
                ) : (
                  <Stack>
                    {stats.recentPosts.map((post, i) => (
                      <Box
                        key={i}
                        padding={4}
                        style={{
                          borderBottom: i < stats.recentPosts.length - 1 ? "1px solid #f3f4f6" : "none",
                        }}
                      >
                        <Flex justify="space-between" align="flex-start" gap={2}>
                          <Text size={2} weight="semibold" style={{ flex: 1 }}>
                            {post.title}
                          </Text>
                          <Badge
                            tone="primary"
                            fontSize={0}
                            style={{ flexShrink: 0, textTransform: "capitalize" }}
                          >
                            {post.category?.replace(/-/g, " ") ?? "uncategorised"}
                          </Badge>
                        </Flex>
                        <Text size={1} muted style={{ marginTop: 4 }}>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "No date"}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Card>
            </Box>

            {/* CMS Landing Pages */}
            <Box>
              <SectionHeading>CMS Landing Pages</SectionHeading>
              <Card padding={0} radius={3} shadow={1}>
                {stats.landingPages.length === 0 ? (
                  <Box padding={4}>
                    <Stack space={2}>
                      <Text muted size={2}>No CMS landing pages created yet.</Text>
                      <Text muted size={1}>
                        Create your first via <strong>Landing Pages</strong> in the left sidebar.
                        New pages appear at /lp/[slug].
                      </Text>
                    </Stack>
                  </Box>
                ) : (
                  <Stack>
                    {stats.landingPages.map((lp, i) => (
                      <Box
                        key={i}
                        padding={4}
                        style={{
                          borderBottom:
                            i < stats.landingPages.length - 1 ? "1px solid #f3f4f6" : "none",
                        }}
                      >
                        <Flex justify="space-between" align="center" gap={2}>
                          <Box>
                            <Text size={2} weight="semibold">
                              {lp.title}
                            </Text>
                            <Text size={1} muted>
                              /lp/{lp.slug?.current}
                            </Text>
                          </Box>
                          <Flex align="center" gap={2}>
                            <Badge
                              tone={lp.noIndex ? "caution" : "positive"}
                              fontSize={0}
                            >
                              {lp.noIndex ? "noindex" : "indexed"}
                            </Badge>
                            <ExternalLink
                              size={14}
                              style={{ color: "#6b7280", cursor: "pointer" }}
                              onClick={() =>
                                window.open(
                                  `https://cleveraccounts.com/lp/${lp.slug?.current}`,
                                  "_blank"
                                )
                              }
                            />
                          </Flex>
                        </Flex>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Card>
            </Box>
          </Grid>

          {/* ── Signup Funnel Overview ─────────────────────────────────────── */}
          <Box>
            <SectionHeading>Signup Funnel Overview</SectionHeading>
            <Card padding={4} radius={3} shadow={1}>
              <Grid columns={[1, 1, 2]} gap={0}>
                <Box paddingRight={[0, 0, 4]} style={{ borderRight: "1px solid #f3f4f6" }}>
                  <Stack space={1} divider={<Box style={{ height: 1, background: "#f3f4f6" }} />}>
                    <FunnelStep
                      step={1}
                      label="Landing / Marketing Page"
                      description="46+ pages incl. /lp/* PPC pages. UTM params captured automatically."
                      status="live"
                    />
                    <FunnelStep
                      step={2}
                      label="Stage 1 Sign-Up Form"
                      description="Name, email, phone, business type → creates Salesforce Lead. Events: signup_stage1_view, signup_stage1_submit, signup_lead_created."
                      status="tracked"
                    />
                    <FunnelStep
                      step={3}
                      label="Stage 2 Details Form"
                      description="50+ fields across 10 steps. Abandonment beacon fires on page unload to /api/analytics/abandon."
                      status="tracked"
                    />
                    <FunnelStep
                      step={4}
                      label="Stripe Checkout"
                      description="Payment intent created via Salesforce. Status tracked via /api/signup/stripe/status."
                      status="live"
                    />
                    <FunnelStep
                      step={5}
                      label="Post-Signup Analytics"
                      description="Connect GA4 or Segment to /api/analytics/abandon to aggregate step-level drop-off data."
                      status="needs-setup"
                    />
                  </Stack>
                </Box>
                <Box paddingLeft={[0, 0, 4]} paddingTop={[4, 4, 0]}>
                  <Stack space={3}>
                    <Text size={2} weight="semibold">
                      Where to find conversion data
                    </Text>
                    <Stack space={2}>
                      {[
                        {
                          label: "GA4 — page views & goal completions",
                          href: "https://analytics.google.com",
                        },
                        {
                          label: "GTM — tag & trigger audit",
                          href: "https://tagmanager.google.com",
                        },
                        {
                          label: "Google Search Console — organic performance",
                          href: "https://search.google.com/search-console",
                        },
                        {
                          label: "Salesforce — lead pipeline & conversion rates",
                          href: "https://cleveraccounts--skuidtest.sandbox.my.salesforce.com",
                        },
                      ].map((link) => (
                        <Flex
                          key={link.label}
                          align="center"
                          gap={2}
                          style={{ cursor: "pointer" }}
                          onClick={() => window.open(link.href, "_blank")}
                        >
                          <ExternalLink size={13} style={{ color: "#3b82f6", flexShrink: 0 }} />
                          <Text size={2} style={{ color: "#3b82f6" }}>
                            {link.label}
                          </Text>
                        </Flex>
                      ))}
                    </Stack>
                    <Box
                      padding={3}
                      radius={2}
                      style={{ background: "#eff6ff", marginTop: 8 }}
                    >
                      <Text size={1} style={{ color: "#1d4ed8" }}>
                        <strong>Tip:</strong> Wire up the <code>/api/analytics/abandon</code> endpoint
                        to GA4 Measurement Protocol or Salesforce to see step-level drop-off rates
                        directly in this dashboard.
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Card>
          </Box>

          {/* ── Recent Case Studies ────────────────────────────────────────── */}
          {stats.recentCaseStudies.length > 0 && (
            <Box>
              <SectionHeading>Recent Case Studies</SectionHeading>
              <Grid columns={[2, 2, 4]} gap={3}>
                {stats.recentCaseStudies.map((cs, i) => (
                  <Card key={i} padding={3} radius={3} shadow={1}>
                    <Flex justify="space-between" align="flex-start">
                      <Text size={2} weight="semibold">
                        {cs.clientName}
                      </Text>
                      {cs.featured && (
                        <Badge tone="positive" fontSize={0}>
                          Featured
                        </Badge>
                      )}
                    </Flex>
                    <Text size={1} muted style={{ textTransform: "capitalize", marginTop: 4 }}>
                      {cs.businessType?.replace(/-/g, " ")}
                    </Text>
                  </Card>
                ))}
              </Grid>
            </Box>
          )}

          {/* ── Quick Actions ──────────────────────────────────────────────── */}
          <Box>
            <SectionHeading>Quick Actions</SectionHeading>
            <Grid columns={[2, 3, 4]} gap={3}>
              {[
                { label: "New Blog Post", href: "/studio/desk/blogPost;new" },
                { label: "New Landing Page", href: "/studio/desk/landingPage;new" },
                { label: "New Case Study", href: "/studio/desk/caseStudy;new" },
                { label: "New Testimonial", href: "/studio/desk/testimonial;new" },
                { label: "Edit Pricing", href: "/studio/desk/pricingPlan" },
                { label: "Edit Site Settings", href: "/studio/desk/siteSettings;siteSettings" },
                { label: "Manage Promo Banner", href: "/studio/desk/promoBanner" },
                { label: "View Live Site", href: "https://cleveraccounts.com" },
              ].map((action) => (
                <Button
                  key={action.label}
                  text={action.label}
                  mode="ghost"
                  tone="default"
                  fontSize={1}
                  onClick={() =>
                    action.href.startsWith("http")
                      ? window.open(action.href, "_blank")
                      : (window.location.href = action.href)
                  }
                  style={{ justifyContent: "flex-start" }}
                />
              ))}
            </Grid>
          </Box>
        </Stack>
      ) : null}
    </Box>
  );
}
