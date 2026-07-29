/**
 * UK SIC 2007 descriptions for the codes our client base actually uses.
 * Not the full 730-code list — a curated set covering the common contractor,
 * consultancy, professional-services, construction, retail, hospitality,
 * health and property codes we see, plus the dormant/non-trading/management
 * codes typical of small Ltds. Anything not here falls back to the bare code,
 * so an unknown code never shows a wrong description.
 */
export const SIC_DESCRIPTIONS: Record<string, string> = {
  // IT & software
  '62011': 'Ready-made interactive leisure and entertainment software development',
  '62012': 'Business and domestic software development',
  '62020': 'Information technology consultancy activities',
  '62030': 'Computer facilities management activities',
  '62090': 'Other information technology service activities',
  '63110': 'Data processing, hosting and related activities',
  '63120': 'Web portals',
  '63990': 'Other information service activities n.e.c.',
  '58210': 'Publishing of computer games',
  '58290': 'Other software publishing',
  '95110': 'Repair of computers and peripheral equipment',
  '95120': 'Repair of communication equipment',

  // Management & professional consultancy
  '70100': 'Activities of head offices',
  '70210': 'Public relations and communications activities',
  '70221': 'Financial management',
  '70229': 'Management consultancy activities other than financial management',
  '74100': 'Specialised design activities',
  '74202': 'Other specialist photography',
  '74209': 'Photographic activities not elsewhere classified',
  '74901': 'Environmental consulting activities',
  '74902': 'Quantity surveying activities',
  '74909': 'Other professional, scientific and technical activities n.e.c.',
  '74990': 'Non-trading company',

  // Advertising, media & market research
  '73110': 'Advertising agencies',
  '73120': 'Media representation services',
  '73200': 'Market research and public opinion polling',
  '59111': 'Motion picture production activities',
  '59112': 'Video production activities',
  '59120': 'Motion picture, video and television programme post-production activities',
  '59200': 'Sound recording and music publishing activities',
  '60100': 'Radio broadcasting',
  '60200': 'Television programming and broadcasting activities',
  '90010': 'Performing arts',
  '90020': 'Support activities to performing arts',
  '90030': 'Artistic creation',
  '90040': 'Operation of arts facilities',

  // Engineering & architecture
  '71111': 'Architectural activities',
  '71112': 'Urban planning and landscape architectural activities',
  '71121': 'Engineering design activities for industrial process and production',
  '71122': 'Engineering related scientific and technical consulting activities',
  '71129': 'Other engineering activities',
  '71200': 'Technical testing and analysis',

  // Legal & accountancy
  '69101': 'Barristers at law',
  '69102': 'Solicitors',
  '69109': 'Activities of patent and copyright agents; other legal activities n.e.c.',
  '69201': 'Accounting and auditing activities',
  '69202': 'Bookkeeping activities',
  '69203': 'Tax consultancy',

  // Finance & insurance
  '64209': 'Activities of other holding companies n.e.c.',
  '64301': 'Activities of investment trusts',
  '64303': 'Activities of venture and development capital companies',
  '64999': 'Financial intermediation not elsewhere classified',
  '66190': 'Activities auxiliary to financial intermediation n.e.c.',
  '66210': 'Risk and damage evaluation',
  '66220': 'Activities of insurance agents and brokers',
  '66290': 'Other activities auxiliary to insurance and pension funding',

  // Property & real estate
  '68100': 'Buying and selling of own real estate',
  '68201': 'Renting and operating of Housing Association real estate',
  '68209': 'Other letting and operating of own or leased real estate',
  '68310': 'Real estate agencies',
  '68320': 'Management of real estate on a fee or contract basis',
  '98000': 'Residents property management',

  // Construction & trades
  '41100': 'Development of building projects',
  '41201': 'Construction of commercial buildings',
  '41202': 'Construction of domestic buildings',
  '42110': 'Construction of roads and motorways',
  '43110': 'Demolition',
  '43120': 'Site preparation',
  '43130': 'Test drilling and boring',
  '43210': 'Electrical installation',
  '43220': 'Plumbing, heat and air-conditioning installation',
  '43290': 'Other construction installation',
  '43310': 'Plastering',
  '43320': 'Joinery installation',
  '43330': 'Floor and wall covering',
  '43341': 'Painting',
  '43342': 'Glazing',
  '43390': 'Other building completion and finishing',
  '43910': 'Roofing activities',
  '43991': 'Scaffold erection',
  '43999': 'Other specialised construction activities n.e.c.',

  // Motor & wholesale/retail
  '45111': 'Sale of new cars and light motor vehicles',
  '45200': 'Maintenance and repair of motor vehicles',
  '46900': 'Non-specialised wholesale trade',
  '47110': 'Retail sale in non-specialised stores with food, beverages or tobacco predominating',
  '47190': 'Other retail sale in non-specialised stores',
  '47710': 'Retail sale of clothing in specialised stores',
  '47910': 'Retail sale via mail order houses or via Internet',
  '47990': 'Other retail sale not in stores, stalls or markets',

  // Transport
  '49320': 'Taxi operation',
  '49410': 'Freight transport by road',
  '53202': 'Unlicensed carrier',

  // Hospitality & food
  '55100': 'Hotels and similar accommodation',
  '56101': 'Licensed restaurants',
  '56102': 'Unlicensed restaurants and cafes',
  '56103': 'Take-away food shops and mobile food stands',
  '56210': 'Event catering activities',
  '56290': 'Other food services',
  '56302': 'Public houses and bars',

  // Employment & business support
  '78109': 'Other activities of employment placement agencies',
  '78200': 'Temporary employment agency activities',
  '78300': 'Human resources provision and management of human resources functions',
  '82110': 'Combined office administrative service activities',
  '82190': 'Photocopying, document preparation and other specialised office support activities',
  '82990': 'Other business support service activities n.e.c.',
  '79110': 'Travel agency activities',
  '79120': 'Tour operator activities',

  // Health, care & education
  '85320': 'Technical and vocational secondary education',
  '85410': 'Post-secondary non-tertiary education',
  '85590': 'Other education n.e.c.',
  '85600': 'Educational support services',
  '86101': 'Hospital activities',
  '86210': 'General medical practice activities',
  '86220': 'Specialist medical practice activities',
  '86230': 'Dental practice activities',
  '86900': 'Other human health activities',
  '87300': 'Residential care activities for the elderly and disabled',
  '88100': 'Social work activities without accommodation for the elderly and disabled',
  '88910': 'Child day-care activities',

  // Sport, beauty & other services
  '93110': 'Operation of sports facilities',
  '93120': 'Activities of sport clubs',
  '93130': 'Fitness facilities',
  '93199': 'Other sports activities',
  '96020': 'Hairdressing and other beauty treatment',
  '96040': 'Physical well-being activities',
  '96090': 'Other service activities n.e.c.',

  // Dormant / non-trading
  '99999': 'Dormant Company',
};

/** Returns "code — description" when known, otherwise just the code. */
export function sicLabel(code: string): string {
  const clean = (code || '').trim();
  const desc = SIC_DESCRIPTIONS[clean];
  return desc ? `${clean} — ${desc}` : clean;
}

/** Returns the description alone when known, otherwise null. */
export function sicDescription(code: string): string | null {
  return SIC_DESCRIPTIONS[(code || '').trim()] ?? null;
}
