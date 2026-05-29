import { Country } from './types';

export const COUNTRY_CONFIG: Record<Country, { name: string; brandName: string; subdomain: string; currency: string; languages: string[] }> = {
  [Country.NIGERIA]: { name: 'Nigeria', brandName: 'ReportNaija', subdomain: 'ng', currency: 'NGN', languages: ['en', 'yo', 'ha', 'ig'] },
  [Country.GHANA]: { name: 'Ghana', brandName: 'ReportGhana', subdomain: 'gh', currency: 'GHS', languages: ['en', 'tw', 'ga'] },
  [Country.KENYA]: { name: 'Kenya', brandName: 'ReportKenya', subdomain: 'ke', currency: 'KES', languages: ['en', 'sw'] },
  [Country.SOUTH_AFRICA]: { name: 'South Africa', brandName: 'ReportSA', subdomain: 'za', currency: 'ZAR', languages: ['en', 'zu', 'af'] },
  [Country.UGANDA]: { name: 'Uganda', brandName: 'ReportUganda', subdomain: 'ug', currency: 'UGX', languages: ['en', 'sw', 'lg'] },
  [Country.RWANDA]: { name: 'Rwanda', brandName: 'ReportRwanda', subdomain: 'rw', currency: 'RWF', languages: ['en', 'rw', 'fr'] },
};

export const REPORT_CATEGORY_LABELS: Record<string, string> = {
  traffic: 'Traffic Report',
  police_security: 'Police & Security',
  government: 'Government Accountability',
  construction: 'Construction & Infrastructure',
  election: 'Election & Voting',
  emergency: 'Community Emergency',
  environmental: 'Environmental',
  market_consumer: 'Market & Consumer',
};

export const COLORS = {
  primary: '#0F7B6C',
  secondary: '#F4B400',
  emergency: '#D92D20',
  humanitarian: '#F97316',
  info: '#2563EB',
  lightBg: '#F8FAFC',
  darkBg: '#0F172A',
  cardLight: '#FFFFFF',
  cardDark: '#1E293B',
  border: '#E5E7EB',
} as const;

// Tip Packs: { cost: what tipper pays, value: what gets credited to balance }
export const TIP_PACKS: Record<string, { cost: number; value: number }[]> = {
  NGN: [
    { cost: 2000, value: 1500 },
    { cost: 5000, value: 4000 },
    { cost: 10000, value: 8500 },
    { cost: 25000, value: 22000 },
  ],
  GHS: [
    { cost: 20, value: 15 },
    { cost: 50, value: 40 },
    { cost: 100, value: 85 },
    { cost: 250, value: 220 },
  ],
  KES: [
    { cost: 200, value: 150 },
    { cost: 500, value: 400 },
    { cost: 1000, value: 850 },
    { cost: 2500, value: 2200 },
  ],
  ZAR: [
    { cost: 30, value: 20 },
    { cost: 60, value: 50 },
    { cost: 120, value: 100 },
    { cost: 250, value: 220 },
  ],
  UGX: [
    { cost: 7000, value: 5000 },
    { cost: 15000, value: 12000 },
    { cost: 25000, value: 20000 },
    { cost: 60000, value: 50000 },
  ],
  RWF: [
    { cost: 2000, value: 1500 },
    { cost: 5000, value: 4000 },
    { cost: 10000, value: 8500 },
    { cost: 25000, value: 22000 },
  ],
};

// Preset tip amounts per currency (what tipper spends from balance)
export const TIP_PRESETS: Record<string, number[]> = {
  NGN: [1500, 3000, 5000, 10000],
  GHS: [15, 30, 50, 100],
  KES: [150, 300, 500, 1000],
  ZAR: [20, 50, 100, 200],
  UGX: [5000, 10000, 20000, 50000],
  RWF: [1500, 3000, 5000, 10000],
};

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  GHS: 'GH₵',
  KES: 'KSh',
  ZAR: 'R',
  UGX: 'USh',
  RWF: 'RWF',
};
