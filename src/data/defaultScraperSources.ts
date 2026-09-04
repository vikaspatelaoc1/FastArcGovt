import { ScraperSource, JobCategory } from '../types';

export const baseCuratedScraperSources: ScraperSource[] = [
  {
    id: 'src-employment-news',
    name: 'Employment News (Govt of India Official)',
    url: 'https://employmentnews.gov.in/feed.rss',
    type: 'rss',
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
    url: 'https://ssc.gov.in/notices/rss.xml',
    type: 'rss',
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
    url: 'https://rrbapply.gov.in/updates.rss',
    type: 'rss',
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
    url: 'https://upsc.gov.in/rss-feed',
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
    url: 'https://pib.gov.in/rss/recruitment.xml',
    type: 'rss',
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
    url: 'https://ibps.in/notifications.xml',
    type: 'rss',
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
    url: 'https://uppbpb.gov.in/notices.rss',
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
    url: 'https://bssc.bihar.gov.in/rss.xml',
    type: 'rss',
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

  const indianStates = ['UP', 'MP', 'Bihar', 'Rajasthan', 'Gujarat', 'Maharashtra', 'Punjab', 'Haryana', 'Tamil Nadu', 'Kerala', 'Karnataka', 'Odisha', 'West Bengal', 'Assam', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand', 'Himachal Pradesh', 'Telangana', 'Andhra Pradesh', 'Delhi', 'Jammu & Kashmir'];
  const orgTypes = ['Police', 'PSC', 'SSC', 'High Court', 'Education Board', 'Health Dept', 'Transport', 'Electricity Board', 'Metro', 'University', 'Municipal Corp', 'Panchayat', 'Forest Dept', 'Water Board', 'Housing Board', 'PWD', 'Tourism Dept', 'Social Welfare', 'Rural Development', 'Urban Development', 'Agriculture Dept', 'Revenue Dept', 'Tax Dept', 'State Cooperative Bank'];
  const centralOrgs = ['UPSC', 'SSC', 'RRB', 'IBPS', 'SBI', 'RBI', 'LIC', 'DRDO', 'ISRO', 'BARC', 'ONGC', 'NTPC', 'BHEL', 'GAIL', 'SAIL', 'IOCL', 'BPCL', 'HPCL', 'CIL', 'AAI', 'FCI', 'NHAI', 'BSF', 'CRPF', 'CISF', 'ITBP', 'SSB', 'Indian Army', 'Indian Navy', 'Indian Air Force', 'Coast Guard', 'Post Office', 'NTA', 'CBSE', 'KVS', 'NVS', 'DSSSB'];
  const categories: JobCategory[] = ['latest-jobs', 'admit-cards', 'results', 'syllabus', 'answer-key', 'admission'];

  let extraSourceId = 1;

  // Add State Level Sources (22 * 24 = 528 sources)
  indianStates.forEach(state => {
    orgTypes.forEach(org => {
      sources.push({
        id: `src-auto-${extraSourceId++}`,
        name: `${state} ${org} Official Board`,
        url: `https://${state.toLowerCase().replace(/ & | /g, '')}.${org.toLowerCase().replace(/ /g, '')}.gov.in/rss.xml`,
        type: extraSourceId % 3 === 0 ? 'html_scraper' : 'rss',
        defaultCategory: categories[extraSourceId % categories.length],
        state: state,
        enabled: true,
        lastScraped: 'Pending',
        itemCount: 0,
        status: 'idle'
      });
    });
  });

  // Add Central Level Sources (37 sources)
  centralOrgs.forEach(org => {
    sources.push({
      id: `src-auto-${extraSourceId++}`,
      name: `${org} Central Govt Recruitment`,
      url: `https://${org.toLowerCase()}.gov.in/latest-updates.rss`,
      type: 'rss',
      defaultCategory: 'latest-jobs',
      state: 'Central',
      enabled: true,
      lastScraped: 'Pending',
      itemCount: 0,
      status: 'idle'
    });
  });

  return sources;
};

export const defaultScraperSources: ScraperSource[] = generateAllScraperSources();
