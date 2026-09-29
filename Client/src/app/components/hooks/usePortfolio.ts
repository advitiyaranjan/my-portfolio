import { useEffect, useState } from 'react';
import { portfolioAPI } from '@/utils/api';

export interface Portfolio {
  fullName: string;
  title: string;
  bio: string;
  aboutDescription?: string;
  profileImage: string;
  resumeLink?: string;
  email?: string;
  phone?: string;
  location?: string;
  education?: { institution: string; shortName?: string; degree: string; period: string; cgpa?: string };
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    leetcode?: string;
    website?: string;
    email_link?: string;
  };
  stats?: { projectsCompleted?: number; yearsExperience?: number; usersImpacted?: number; technologiesCount?: number };
  heroHighlights?: { value: string; label: string }[];
  aboutHighlights?: { icon: string; title: string; description: string }[];
}

// Shown immediately and used if the API is unreachable, so the page never renders blank.
export const DEFAULT_PORTFOLIO: Portfolio = {
  fullName: 'Advitiya Ranjan',
  title: 'Full Stack Developer & AI/ML Engineer',
  bio: 'I build scalable full-stack products with React, Node.js and TypeScript, and bring machine learning into them with PyTorch. Integrated B.Tech (IT) + MBA at IIITM Gwalior, GATE 2026 qualified and a Google Student Ambassador.',
  profileImage: '/images/profile.jpg',
  resumeLink: '/Advitiya_Ranjan_Resume.pdf',
  email: 'ranjanadvitiya@gmail.com',
  phone: '+91 9430435643',
  location: 'IIITM Gwalior, Madhya Pradesh, India',
  education: {
    institution: 'Indian Institute of Information Technology and Management, Gwalior',
    shortName: 'IIITM Gwalior',
    degree: 'Integrated B.Tech (IT) + M.B.A.',
    period: '2023 – 2028',
    cgpa: '7.96',
  },
  socialLinks: {
    github: 'https://github.com/advitiyaranjan',
    linkedin: 'https://www.linkedin.com/in/advitiya-ranjan',
    twitter: 'https://x.com/advitiyaranjan',
    leetcode: 'https://leetcode.com/advitiyaranjan',
    website: 'https://advitiyaranjan.in',
  },
  heroHighlights: [
    { value: 'AIR 3460', label: 'GATE 2026 · CS' },
    { value: '500+', label: 'DSA problems' },
    { value: '1K+', label: 'Students reached' },
  ],
};

let portfolioRequest: Promise<Partial<Portfolio>> | null = null;

function fetchPortfolio() {
  if (!portfolioRequest) {
    portfolioRequest = portfolioAPI
      .getPortfolio()
      .then((response: any) => (response?.data ?? response ?? {}) as Partial<Portfolio>)
      .catch((error: unknown) => {
        portfolioRequest = null; // allow a retry on the next mount
        throw error;
      });
  }
  return portfolioRequest;
}

const pick = <T,>(value: T | '' | null | undefined, fallback: T): T =>
  value === undefined || value === null || value === '' ? fallback : value;

function withDefaults(data: Partial<Portfolio>): Portfolio {
  return {
    ...DEFAULT_PORTFOLIO,
    ...data,
    fullName: pick(data.fullName, DEFAULT_PORTFOLIO.fullName),
    title: pick(data.title, DEFAULT_PORTFOLIO.title),
    bio: pick(data.bio, DEFAULT_PORTFOLIO.bio),
    profileImage: pick(data.profileImage, DEFAULT_PORTFOLIO.profileImage),
    email: pick(data.email, DEFAULT_PORTFOLIO.email),
    phone: pick(data.phone, DEFAULT_PORTFOLIO.phone),
    location: pick(data.location, DEFAULT_PORTFOLIO.location),
    resumeLink: pick(data.resumeLink, DEFAULT_PORTFOLIO.resumeLink),
    socialLinks: { ...DEFAULT_PORTFOLIO.socialLinks, ...(data.socialLinks || {}) },
    heroHighlights: data.heroHighlights?.length ? data.heroHighlights : DEFAULT_PORTFOLIO.heroHighlights,
  };
}

/** Portfolio profile shared by every section; fetched once per page load. */
export function usePortfolio() {
  const [data, setData] = useState<Partial<Portfolio>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPortfolio()
      .then((result) => active && setData(result))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { portfolio: withDefaults(data), loading };
}
