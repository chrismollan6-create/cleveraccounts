import {
  User,
  Building2,
  Users,
  BadgeCheck,
  MapPin,
  Hash,
  CalendarDays,
  Briefcase,
  Globe,
  ShieldCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import { headers } from "next/headers";
import { isNativeAppUA } from "@/lib/portal/native";
import { getBrand } from "@/lib/brand";
import { getCurrentPortalUser } from "@/lib/portal/auth";
import { getDetailsForCurrentUser } from "@/lib/portal/details";
import AccessGate from "@/components/portal/AccessGate";
import type {
  PortalCompanyDetails,
  PortalOfficer,
  PortalPersonalDetails,
} from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/**
 * "Your details" — personal, company and Companies House officer details.
 * Cache-backed (portal.contacts / accounts / companies / officers), Aurora
 * style to match the dashboard.
 */
export default async function DetailsPage() {
  const [brand, portalUser, result, hdrs] = await Promise.all([
    getBrand(),
    getCurrentPortalUser(),
    getDetailsForCurrentUser(),
    headers(),
  ]);
  const isNativeApp = isNativeAppUA(hdrs.get("user-agent"));

  const firstName =
    portalUser?.firstName ?? portalUser?.email?.split("@")[0] ?? null;

  if (
    portalUser &&
    (portalUser.status === "disabled" || portalUser.status === "pending")
  ) {
    return (
      <Wrap>
        <AccessGate
          brand={brand}
          state={portalUser.status}
          firstName={firstName}
          email={portalUser.email}
        />
      </Wrap>
    );
  }

  if (result.ok === false) {
    return (
      <Wrap>
        <div className="max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} />
            <div>
              <h2 className="text-lg font-semibold text-amber-900">
                We couldn&apos;t load your details
              </h2>
              <p className="mt-1 text-sm text-amber-800">
                Try refreshing — if it keeps happening, drop us a line and
                we&apos;ll sort it.
              </p>
            </div>
          </div>
        </div>
      </Wrap>
    );
  }

  const { personal, company, officers } = result.data;

  return (
    <Wrap>
      {!isNativeApp && (
        <div className="mb-7 flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1A7A9B]/10 text-[#1A7A9B]">
            <Building2 size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Your details
            </h1>
            <p className="mt-0.5 text-sm text-text-light">
              Your personal, company and Companies House records — kept in sync so
              you always know what&apos;s on file.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Left: who you are + the people on the company */}
        <div className="space-y-5">
          <PersonalCard personal={personal} />
          <OfficersCard officers={officers} />
        </div>
        {/* Right: the company record (denser, so it earns its own column) */}
        <div className="space-y-5">
          <CompanyCard company={company} />
        </div>
      </div>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

// ─── PERSONAL ───────────────────────────────────────────────────────────────
function PersonalCard({ personal }: { personal: PortalPersonalDetails }) {
  return (
    <Card
      icon={<User size={15} />}
      title="Personal details"
      subtitle="The person we deal with on this account"
    >
      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <Field label="Name" value={personal.name} icon={<User size={13} />} />
        <Field label="Role" value={titleCase(personal.role)} icon={<Briefcase size={13} />} />
        <Field label="Email" value={personal.email} />
        <Field label="Phone" value={personal.phone} />
        <Field
          label="Date of birth"
          value={personal.dateOfBirth}
          icon={<CalendarDays size={13} />}
        />
        <Field
          label="Nationality"
          value={personal.nationality}
          icon={<Globe size={13} />}
        />
        {personal.appointedOn && (
          <Field
            label="Director since"
            value={formatDate(personal.appointedOn)}
            icon={<CalendarDays size={13} />}
          />
        )}
        {personal.idvVerifiedOn && (
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium uppercase tracking-wider text-text-light">
              Identity verified
            </dt>
            <dd className="inline-flex w-fit items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">
              <ShieldCheck size={13} /> {formatDate(personal.idvVerifiedOn)}
            </dd>
          </div>
        )}
      </dl>
    </Card>
  );
}

// ─── COMPANY ──────────────────────────────────────────────────────────────
function CompanyCard({ company }: { company: PortalCompanyDetails }) {
  if (!company.hasCompaniesHouse) {
    return (
      <Card
        icon={<Building2 size={15} />}
        title="Company details"
        subtitle={company.accountName ?? undefined}
      >
        <div className="flex items-start gap-2.5 rounded-xl bg-neutral-50 px-4 py-3.5 text-sm text-text-light">
          <Info size={15} className="mt-0.5 shrink-0 text-text-light" />
          <span>
            We haven&apos;t linked this account to a Companies House record yet.
            Once we do, your company number, registered office, directors and
            filing deadlines will appear here automatically.
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      icon={<Building2 size={15} />}
      title="Company details"
      subtitle="From Companies House"
      action={<StatusBadge status={company.status} />}
    >
      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <Field label="Registered name" value={company.companyName} />
        <Field
          label="Company number"
          value={company.companyNumber}
          icon={<Hash size={13} />}
        />
        <Field label="Type" value={titleCase(company.companyType?.replace(/-/g, " "))} />
        <Field
          label="Incorporated"
          value={formatDate(company.dateOfCreation)}
          icon={<CalendarDays size={13} />}
        />
        <div className="sm:col-span-2">
          <Field
            label="Registered office"
            value={company.registeredAddress}
            icon={<MapPin size={13} />}
          />
        </div>
        {company.sicCodes.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="mb-1 text-xs font-medium uppercase tracking-wider text-text-light">
              Nature of business (SIC)
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {company.sicCodes.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-text"
                >
                  {c}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {/* Filing deadlines */}
      <div className="mt-5 grid gap-3 border-t border-neutral-100 pt-5 sm:grid-cols-2">
        <Deadline
          label="Next accounts due"
          date={company.accountsNextDue}
          overdue={company.accountsOverdue}
        />
        <Deadline
          label="Confirmation statement due"
          date={company.csNextDue}
          overdue={company.csOverdue}
        />
      </div>

      {company.lastSynced && (
        <p className="mt-4 text-xs text-text-light">
          Synced from Companies House {formatDateTime(company.lastSynced)}.
        </p>
      )}
    </Card>
  );
}

// ─── OFFICERS ───────────────────────────────────────────────────────────────
function OfficersCard({ officers }: { officers: PortalOfficer[] }) {
  return (
    <Card
      icon={<Users size={15} />}
      title="Directors & officers"
      subtitle={
        officers.length
          ? `${officers.length} active`
          : "No active officers on record"
      }
    >
      {officers.length === 0 ? (
        <p className="text-sm text-text-light">
          We don&apos;t have any Companies House officers cached for this
          company yet.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {officers.map((o) => (
            <li key={o.id} className="flex items-start gap-3 py-4 first:pt-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1A7A9B] to-[#136280] text-xs font-bold text-white">
                {initials(o.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-text">
                    {o.name ?? "—"}
                  </span>
                  {o.role && (
                    <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[11px] font-medium text-orange-700">
                      {titleCase(o.role)}
                    </span>
                  )}
                  {o.idvVerified && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                      <BadgeCheck size={11} /> ID verified
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-text-light">
                  {o.appointedOn && (
                    <span>Appointed {formatDate(o.appointedOn)}</span>
                  )}
                  {o.dateOfBirth && <span>Born {o.dateOfBirth}</span>}
                  {o.nationality && <span>{o.nationality}</span>}
                  {o.occupation && <span>{o.occupation}</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ─── SHARED ───────────────────────────────────────────────────────────────
function Card({
  icon,
  title,
  subtitle,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A7A9B]/10 text-[#1A7A9B]">
            {icon}
          </span>
          <div>
            <h2 className="text-sm font-semibold text-text">{title}</h2>
            {subtitle && (
              <p className="text-xs text-text-light">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium uppercase tracking-wider text-text-light">
        {label}
      </dt>
      <dd className="flex items-center gap-1.5 text-sm text-text">
        {icon && <span className="text-text-light">{icon}</span>}
        <span>{value ?? <span className="text-text-light">—</span>}</span>
      </dd>
    </div>
  );
}

function Deadline({
  label,
  date,
  overdue,
}: {
  label: string;
  date: string | null;
  overdue: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wider text-text-light">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-semibold text-text">
          {date ? formatDate(date) : "—"}
        </span>
        {overdue ? (
          <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-700">
            Overdue
          </span>
        ) : date ? (
          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
            On track
          </span>
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const active = status.toLowerCase() === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {titleCase(status)}
    </span>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────
function initials(name: string | null): string {
  if (!name) return "··";
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "··"
  );
}

function titleCase(s: string | null | undefined): string | null {
  if (!s) return null;
  return s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
