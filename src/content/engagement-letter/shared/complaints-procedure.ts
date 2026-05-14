/**
 * Complaints Procedure.
 * Source: only attached to the Limited Company PDF in the original; per agreement
 * with Chris on 2026-05-08 this is now appended to BOTH variants.
 */

import type { Section } from '../types';

export const COMPLAINTS_PROCEDURE: Section[] = [
  {
    id: 'complaints-01-overview',
    number: 'C1',
    title: 'Complaints Procedure',
    body:
      'We undertake to look into any complaint carefully and promptly and to do all we can to resolve any issues or explain the position to you. If we have given you a less than satisfactory service, we undertake to do everything reasonable to put it right.\n\n' +
      'The following is the standard complaints procedure for {{brandLegalName}}. If you are unhappy with any aspect of the service you receive from {{brandLegalName}} you should do the following:\n\n' +
      '1. Firstly, please speak with your accountant who will try to help you resolve the problem.\n' +
      '2. If you are still unhappy, or if you feel the matter needs to be escalated to a senior member of staff, please request the case be escalated to their Team Manager who will contact you within 4 hours of receiving your complaint.\n' +
      '3. Should you prefer to detail your complaint in writing you can send this through to us by email or by post:\n\n' +
      '    Email: {{supportEmail}}\n\n' +
      '    Post: {{brandPostalAddress}}\n\n' +
      '4. Upon receipt of your complaint, the Team Manager will perform a full and detailed investigation and will contact you to advise of an expected resolution date or provide ongoing updates.\n' +
      '5. Subject to any communications issued regarding your specific complaint, we aim to have a full reply to you within 7 working days of receiving the complaint. Please note that some issues may require longer periods to investigate; if so we will advise you of an expected timeframe.\n' +
      '6. After management has dealt with your complaint, if you feel the issue needs to be escalated further, you can write to our Directors at the above address.',
  },
];
