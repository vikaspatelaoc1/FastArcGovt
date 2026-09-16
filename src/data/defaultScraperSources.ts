import { ScraperSource, JobCategory } from '../types';
import { STATE_PORTALS, CENTRAL_PORTALS } from '../utils/govtPortals';

export const baseCuratedScraperSources: ScraperSource[] = [
  {
    id: 'src-employment-news',
    name: 'Employment News (Govt of India Official)',
    url: 'https://employmentnews.gov.in',
    type: 'html_scraper',
    defaultCategory: 'latest-jobs',
    state: 'Central',
    enabled: true,
    lastScraped: '15-08-2026 12:00',
    itemCount: 8,
    status: 'idle'
  },
  {
    id: 'src-ssc-portal',
    name: 'SSC (Staff Selection Commission) Central Notifications',
    url: 'https://ssc.gov.in',
    type: 'html_scraper',
    defaultCategory: 'latest-jobs',
    state: 'Central',
    enabled: true,
    lastScraped: '15-08-2026 11:45',
    itemCount: 6,
    status: 'idle'
  },
  {
    id: 'src-rrb-railways',
    name: 'Railway RRB (Indian Railways Recruitment)',
    url: 'https://rrbapply.gov.in',
    type: 'html_scraper',
    defaultCategory: 'admit-cards',
    state: 'Central',
    enabled: true,
    lastScraped: '15-08-2026 11:30',
    itemCount: 5,
    status: 'idle'
  },
  {
    id: 'src-upsc-portal',
    name: 'UPSC (Union Public Service Commission) Active Examinations',
    url: 'https://upsc.gov.in',
    type: 'html_scraper',
    defaultCategory: 'latest-jobs',
    state: 'Central',
    enabled: true,
    lastScraped: '15-08-2026 11:15',
    itemCount: 4,
    status: 'idle'
  },
  {
    id: 'src-pib-jobs',
    name: 'PIB (Press Information Bureau) Central Govt Notices',
    url: 'https://pib.gov.in',
    type: 'html_scraper',
    defaultCategory: 'latest-jobs',
    state: 'Central',
    enabled: true,
    lastScraped: '15-08-2026 10:30',
    itemCount: 7,
    status: 'idle'
  },
  {
    id: 'src-ibps-banking',
    name: 'IBPS (Institute of Banking Personnel Selection)',
    url: 'https://ibps.in',
    type: 'html_scraper',
    defaultCategory: 'results',
    state: 'Central',
    enabled: true,
    lastScraped: '15-08-2026 09:50',
    itemCount: 4,
    status: 'idle'
  },
  {
    id: 'src-upprpb-police',
    name: 'UP Police Recruitment Promotion Board (UPPRPB)',
    url: 'https://uppbpb.gov.in',
    type: 'html_scraper',
    defaultCategory: 'results',
    state: 'UP',
    enabled: true,
    lastScraped: '15-08-2026 09:20',
    itemCount: 3,
    status: 'idle'
  },
  {
    id: 'src-bssc-bihar',
    name: 'Bihar Staff Selection Commission (BSSC / BPSC)',
    url: 'https://bpsc.bih.nic.in',
    type: 'html_scraper',
    defaultCategory: 'latest-jobs',
    state: 'Bihar',
    enabled: true,
    lastScraped: '15-08-2026 08:45',
    itemCount: 4,
    status: 'idle'
  }
];

export const generateAllScraperSources = (): ScraperSource[] => {
  const sources: ScraperSource[] = [...baseCuratedScraperSources];
  const seenUrls = new Set<string>(sources.map(s => s.url.toLowerCase()));
  let extraSourceId = 1;

  // Add all Central Portals as real verified sources
  Object.entries(CENTRAL_PORTALS).forEach(([key, portal]) => {
    if (!seenUrls.has(portal.official.toLowerCase())) {
      seenUrls.add(portal.official.toLowerCase());
      sources.push({
        id: `src-central-${key}`,
        name: portal.name,
        url: portal.official,
        type: 'html_scraper',
        defaultCategory: 'latest-jobs',
        state: 'Central',
        enabled: true,
        lastScraped: '15-08-2026 12:00',
        itemCount: 5,
        status: 'idle'
      });
    }
  });

  // Add all State Portals (PSC, Police, SSC, Education, High Court)
  Object.entries(STATE_PORTALS).forEach(([stateCode, config]) => {
    const orgs = [
      { name: `${config.name} Public Service Commission (PSC)`, url: config.psc, cat: 'latest-jobs' as JobCategory },
      { name: `${config.name} Police Recruitment Department`, url: config.police, cat: 'latest-jobs' as JobCategory },
      { name: `${config.name} Staff Selection Board / Commission`, url: config.ssc, cat: 'latest-jobs' as JobCategory },
      { name: `${config.name} Education Examination Board`, url: config.education, cat: 'results' as JobCategory },
      { name: `${config.name} High Court Recruitment Cell`, url: config.highCourt, cat: 'admit-cards' as JobCategory },
      { name: `${config.name} Official State Portal`, url: config.official, cat: 'important' as JobCategory }
    ];

    orgs.forEach(org => {
      if (org.url && !seenUrls.has(org.url.toLowerCase())) {
        seenUrls.add(org.url.toLowerCase());
        sources.push({
          id: `src-state-${extraSourceId++}`,
          name: org.name,
          url: org.url,
          type: 'html_scraper',
          defaultCategory: org.cat,
          state: stateCode,
          enabled: true,
          lastScraped: 'Pending',
          itemCount: 0,
          status: 'idle'
        });
      }
    });
  });

  return sources;
};

export const defaultScraperSources: ScraperSource[] = generateAllScraperSources();
