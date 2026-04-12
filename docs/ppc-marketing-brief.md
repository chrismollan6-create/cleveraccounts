# PPC & Marketing Integration Brief
**Clever Accounts — Website & Google Ads Setup**
**Prepared for: Marketing Team & PPC Manager**
**Date: April 2026**

---

## Overview

The Clever Accounts website has been upgraded with a full first-party data and Google Ads integration layer. The technical work is complete on the website side. This brief explains what has been built, why it matters, and the actions required from the marketing team and PPC manager to activate it.

---

## What Has Been Built (Technical Summary)

### 1. Consent Mode v2
**What it does:** Before any Google tag fires, the site now sets consent defaults to "denied" for advertising cookies. When a visitor accepts cookies via the banner, the site immediately signals "granted" to Google. For visitors who decline, Google models their conversions statistically — recovering an estimated 15–30% of conversions that would otherwise be invisible.

**Why it matters:** This became a legal/contractual requirement for UK/EEA traffic in March 2024. Without it, Google is restricted from using your ad data and your Smart Bidding loses signal accuracy.

**Status:** ✅ Live on site

---

### 2. Value-Based Conversion Tracking
**What it does:** When a visitor completes the sign-up form, the conversion event now fires with the real annual contract value attached — not a flat £0 or arbitrary number.

The values used are:

| Business Type | Annual Value Sent to Google |
|---|---|
| Limited Company | £1,254 (£104.50 × 12) |
| Contractor | £1,254 |
| Startup | £1,254 |
| Sole Trader | £510 (£42.50 × 12) |
| Freelancer | £510 |
| Landlord | £510 |
| CIS / Construction | £510 |

**Why it matters:** Google's Smart Bidding currently treats every lead equally. With conversion values, it learns to bid more aggressively for Limited Company and Contractor leads (worth 2.5× more) and more conservatively for Sole Trader leads. Over 4–6 weeks this significantly shifts the quality mix of leads towards higher-value business types.

**Status:** ✅ Live on site — **requires PPC action to activate (see below)**

---

### 3. Enhanced Conversions
**What it does:** When a visitor signs up, their name, email and phone number are SHA-256 hashed (anonymised) and pushed into the Google Tag Manager data layer as `enhanced_conversion_data`. Google uses these hashed values to match conversions back to Google accounts — including people who were using ad blockers, private browsing, or iOS devices that block standard pixel tracking.

The data layer event fired is `enhanced_conversion` and contains:
- `enhanced_conversion_data.email` (hashed)
- `enhanced_conversion_data.phone_number` (hashed)
- `enhanced_conversion_data.first_name` (hashed)
- `enhanced_conversion_data.last_name` (hashed)
- `conversion_value` (in GBP, based on business type)
- `conversion_currency` ("GBP")
- `business_type` (plain text, e.g. "Limited Company")

**Why it matters:** Expected 15–25% uplift in measurable conversions without any change to campaigns.

**Status:** ✅ Live on site — **requires GTM action to activate (see below)**

---

### 4. GCLID Capture & Persistence
**What it does:** When a visitor arrives from a Google Ad, the GCLID (Google Click ID — the unique identifier in the URL) is now stored in localStorage. It persists across page navigations and tab switches. When the visitor signs up, the GCLID is passed through to Salesforce with the lead record.

**Why it matters:** This is the foundation for **offline conversion import** — the most powerful signal you can send Google. When a lead in Salesforce is marked as a paying client (weeks after the original click), you will be able to send the GCLID + actual contract value back to Google Ads. Smart Bidding then learns which types of clicks actually generate revenue, not just form fills.

**Status:** ✅ GCLID captured and stored. ✅ GCLID passed to Salesforce on lead creation. **Requires Salesforce + Google Ads action to complete the loop (see below)**

---

### 5. UTM Parameter Tracking
**What it does:** UTM parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content) are captured from the URL and passed through to Salesforce with every lead. This means every lead in Salesforce knows exactly which campaign, ad group and keyword generated it.

**Status:** ✅ Live and operational

---

## Actions Required

### GTM (Google Tag Manager) — Priority: HIGH

**Action 1: Enable Enhanced Conversions tag**

In GTM, create a new Google Ads Conversion Tracking tag configured as follows:

- **Tag type:** Google Ads Conversion Tracking
- **Conversion ID:** Your Google Ads conversion ID
- **Conversion label:** Your conversion label
- **Enable Enhanced Conversions:** ✅ Yes
- **Enhanced Conversions method:** Data Layer
- **Data layer variable:** `enhanced_conversion_data`
- **Trigger:** Custom Event → Event name: `enhanced_conversion`

This reads the hashed user data the website is already pushing and sends it to Google Ads.

**Action 2: Confirm GTM container ID is set**

Ensure the environment variable `NEXT_PUBLIC_GTM_ID` is set to your GTM container ID (format: `GTM-XXXXXXX`) in the Netlify environment variables. Without this, no GTM tags fire.

To check: Netlify Dashboard → Site Settings → Environment Variables.

**Action 3: Verify Consent Mode v2 in GTM**

In GTM, go to Admin → Consent Overview and confirm:
- `ad_storage` is marked as consent required
- `ad_user_data` is marked as consent required
- `analytics_storage` is not consent-gated (it's always granted)

---

### Google Ads — Priority: HIGH

**Action 1: Switch conversion tracking to use conversion values**

In Google Ads:
1. Go to Tools → Conversions
2. Find your sign-up/lead conversion action
3. Edit → Change "Value" from a fixed amount to **"Use different values for each conversion"**
4. Set a default value of £510 as a fallback

This activates the value-based bidding data the website is now sending.

**Action 2: Enable Enhanced Conversions in Google Ads**

In Google Ads:
1. Go to Tools → Conversions → Settings
2. Turn on **Enhanced Conversions for web**
3. Select "Google Tag Manager" as the implementation method
4. This pairs with the GTM tag in Action 1 above

**Action 3: Switch bidding strategy to value-based**

Once you have 30+ conversions with values recorded (allow 2–4 weeks of data collection):
1. Switch campaign bidding from "Maximise Conversions / Target CPA" to **"Maximise Conversion Value"**
2. Set a **Target ROAS** of 300–400% (spend £1 to get £3–£4 in annual contract value)
3. Allow 4-week learning period — do not make major changes during this window

**Action 4: Create Customer Match exclusion list**

Export all current active clients from Salesforce (email addresses). Upload to Google Ads:
1. Tools → Audience Manager → Customer Match
2. Upload → Email list
3. Apply to all campaigns as **Exclusion** (bid modifier -100%)

This stops paying for clicks from existing clients.

**Action 5: Set up Offline Conversion Import (medium-term)**

This is the most valuable long-term action. When a Salesforce lead becomes a paying client:
1. The GCLID is already stored on the Lead record
2. A Salesforce flow needs to send the GCLID + contract value to Google Ads Conversion API when the Lead status changes to "Won"
3. In Google Ads, create a new conversion action: "Offline — Client Won" with conversion value = actual contract value

This closes the loop completely — Google learns which ad clicks turned into real revenue.

**Note for developer:** The Apex endpoint and Google Ads API call for offline conversion import has not been built yet. This is the next recommended development task.

---

### Salesforce — Priority: MEDIUM

**Action 1: Confirm GCLID field exists on Lead**

The website passes `gclid` to the `SignupLead` Apex endpoint. Confirm the Lead object has a field to store this (e.g. `GCLID__c`). If not, create a Text field and update the `SignupLeadRestService` class to map it.

**Action 2: Confirm UTM fields exist on Lead**

The website passes: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`. Confirm these are mapped to Lead fields in Salesforce. These populate automatically on every web lead.

**Action 3: Plan offline conversion flow**

When a Lead is converted to a client (or a specific status is set), a Salesforce Flow should:
1. Read the `GCLID__c` field
2. Read the contract value (based on business type)
3. POST to `/api/offline-conversion` on the website (to be built) which calls the Google Ads Conversion API

This is the piece that makes Google's Smart Bidding truly learn from revenue, not just leads.

---

## Performance Baseline — Record Now

Before the new setup takes effect, record your current baselines so you can measure improvement:

| Metric | Record Now | Target (12 weeks) |
|---|---|---|
| Conversion volume (last 30 days) | | +15–25% (Enhanced Conversions) |
| Conversion rate | | Measure trend |
| Average CPA | | -10–20% |
| Ltd Company % of leads | | +10–15% shift |
| Contractor % of leads | | +5–10% shift |
| Target ROAS | n/a (not yet set) | 300–400% |

---

## Timeline

| Week | Action |
|---|---|
| **Now** | Set NEXT_PUBLIC_GTM_ID in Netlify. Create Enhanced Conversions GTM tag. Enable Enhanced Conversions in Google Ads. |
| **Week 1** | Switch conversion value to "use different values". Upload Customer Match exclusion list. |
| **Week 2–4** | Collect conversion value data. Monitor GTM Preview to confirm enhanced_conversion events firing. |
| **Week 4–6** | Switch to Maximise Conversion Value + Target ROAS once 30+ conversions recorded. |
| **Week 6–8** | Build offline conversion import (dev work). |
| **Week 8–12** | Monitor Smart Bidding learning period. Adjust Target ROAS based on actual lead quality. |

---

## Contacts

| Role | Responsibility |
|---|---|
| **PPC Manager** | Google Ads conversion settings, bidding strategy, Customer Match, offline conversion action setup |
| **GTM Manager** | Enhanced Conversions tag, Consent Mode v2 verification, GTM container ID |
| **Salesforce Admin** | GCLID field on Lead, UTM field mapping, offline conversion flow |
| **Developer** | Offline conversion API endpoint (future task) |

---

## Summary

The website is now sending Google significantly richer data than before. The three highest-impact activations — in order — are:

1. **GTM Enhanced Conversions tag** (30 minutes work, 15–25% more measurable conversions)
2. **Switch Google Ads to use conversion values** (30 minutes work, starts shifting lead quality mix)
3. **Offline conversion import** (development + Salesforce work, the most powerful long-term signal)

Everything else (Consent Mode v2, GCLID capture, UTM tracking) is already live and working in the background.
