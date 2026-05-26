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
