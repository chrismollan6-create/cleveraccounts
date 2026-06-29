import { and, desc, eq, isNull } from "drizzle-orm";
import {
  tryWithPortalScope,
  type PortalScopeResult,
} from "./withAccountScope";
import { logPortalEventScoped } from "./audit";
import { schema } from "./db/client";
import type {
  PortalDetailsBundle,
  PortalOfficer,
  PortalPersonalDetails,
  PortalCompanyDetails,
} from "./types";

/**
 * "Your details" page data — personal (Contact), company (Account +
 * CH_Company__c) and Companies House officers (CH_Officer__c).
 *
 * Reads entirely from the Postgres cache (portal.contacts / portal.accounts /
 * portal.companies / portal.officers), scoped to the signed-in user's Account
 * via withPortalScope — same IDOR chokepoint as every other portal read.
 *
 * The CH_Company / CH_Officer rows are populated by the SF→cache sync (TODO:
 * extend the sync pipeline for these objects; currently seeded for the demo).
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDob(month: string | null, year: string | null): string | null {
  if (!year) return null;
  const m = month ? parseInt(month, 10) : NaN;
  const name = m >= 1 && m <= 12 ? MONTHS[m - 1] : null;
  return name ? `${name} ${year}` : year;
}

function joinAddress(parts: (string | null)[]): string | null {
  const clean = parts.map((p) => (p ?? "").trim()).filter((p) => p.length > 0);
  return clean.length ? clean.join(", ") : null;
}

export async function getDetailsForCurrentUser(): Promise<
  PortalScopeResult<PortalDetailsBundle>
> {
  return tryWithPortalScope(
    async ({ accountSfId, contactSfId, db, clerkUserId }) => {
      const [contactRows, accountRows, companyRows, officerRows] =
        await Promise.all([
          db
            .select()
            .from(schema.contacts)
            .where(eq(schema.contacts.sfId, contactSfId))
            .limit(1),
          db
            .select()
            .from(schema.accounts)
            .where(eq(schema.accounts.sfId, accountSfId))
            .limit(1),
          db
            .select()
            .from(schema.companies)
            .where(eq(schema.companies.accountSfId, accountSfId))
            .limit(1),
          db
            .select()
            .from(schema.officers)
            .where(
              and(
                eq(schema.officers.accountSfId, accountSfId),
                isNull(schema.officers.resignedOn)
              )
            )
            .orderBy(desc(schema.officers.appointedOn)),
        ]);

      const contact = contactRows[0] ?? null;
      const account = accountRows[0] ?? null;
      const company = companyRows[0] ?? null;

      const officers: PortalOfficer[] = officerRows.map((o) => ({
        id: o.sfId,
        name: o.name,
        role: o.officerRole,
        appointedOn: o.appointedOn,
        resignedOn: o.resignedOn,
        dateOfBirth: formatDob(o.monthOfBirth, o.yearOfBirth),
        nationality: o.nationality,
        countryOfResidence: o.countryOfResidence,
        occupation: o.occupation,
        idvVerified: Boolean(o.idvVerifiedOn),
      }));

      // Personal details: Contact basics, enriched from the matching officer
      // record (CH only carries DOB/nationality on the officer, not Contact).
      const contactName =
        contact &&
        [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim();
      const matchedOfficer = contactName
        ? officerRows.find(
            (o) => (o.name ?? "").trim().toLowerCase() === contactName.toLowerCase()
          )
        : undefined;

      const personal: PortalPersonalDetails = {
        contactSfId,
        name: contactName || contact?.firstName || null,
        email: contact?.email ?? null,
        phone: contact?.phone ?? null,
        role: matchedOfficer?.officerRole ?? null,
        dateOfBirth: matchedOfficer
          ? formatDob(matchedOfficer.monthOfBirth, matchedOfficer.yearOfBirth)
          : null,
        nationality: matchedOfficer?.nationality ?? null,
        appointedOn: matchedOfficer?.appointedOn ?? null,
        idvVerifiedOn: matchedOfficer?.idvVerifiedOn ?? null,
      };

      const companyDetails: PortalCompanyDetails = {
        accountSfId,
        accountName: account?.name ?? null,
        hasCompaniesHouse: Boolean(company),
        companyNumber: company?.companyNumber ?? null,
        companyName: company?.companyName ?? null,
        status: company?.status ?? null,
        statusDetail: company?.statusDetail ?? null,
        companyType: company?.companyType ?? null,
        dateOfCreation: company?.dateOfCreation ?? null,
        registeredAddress: company
          ? joinAddress([
              [company.regPremises, company.regLine1]
                .filter(Boolean)
                .join(" ")
                .trim() || null,
              company.regLine2,
              company.regLocality,
              company.regRegion,
              company.regPostalCode,
              company.regCountry,
            ])
          : null,
        sicCodes: company?.sicCodes
          ? company.sicCodes
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        accountsNextDue: company?.accountsNextDue ?? null,
        accountsOverdue: company?.accountsOverdue ?? false,
        csNextDue: company?.csNextDue ?? null,
        csOverdue: company?.csOverdue ?? false,
        lastSynced:
          company?.lastSynced instanceof Date
            ? company.lastSynced.toISOString()
            : (company?.lastSynced ?? null),
      };

      await logPortalEventScoped(db, {
        action: "view_details",
        clerkUserId,
        accountSfId,
        target: accountSfId,
        metadata: {
          hasCompaniesHouse: companyDetails.hasCompaniesHouse,
          officerCount: officers.length,
          source: "cache",
        },
      });

      return { personal, company: companyDetails, officers };
    }
  );
}
