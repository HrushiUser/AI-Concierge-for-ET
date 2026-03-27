export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  link: string;
  icon: string;
  badge?: string;
  forProfile?: string[];
}

export const ET_SERVICES: Service[] = [
  {
    id: 'et-prime',
    name: 'ET Prime',
    category: 'Content & News',
    description: 'Premium business news, analysis, and market insights delivered daily',
    link: 'https://economictimes.indiatimes.com/prime',
    icon: '📰',
    badge: 'Popular',
    forProfile: ['student', 'investor', 'professional']
  },
  {
    id: 'et-markets',
    name: 'ET Markets',
    category: 'Trading & Markets',
    description: 'Real-time stock market data, portfolio tracking, and technical analysis',
    link: 'https://economictimes.indiatimes.com/markets',
    icon: '📈',
    badge: 'Essential',
    forProfile: ['investor', 'professional']
  },
  {
    id: 'et-wealth',
    name: 'ET Wealth',
    category: 'Financial Planning',
    description: 'Personalized wealth management, investment advisory, and financial planning',
    link: 'https://economictimes.indiatimes.com/wealth',
    icon: '💎',
    forProfile: ['investor', 'professional']
  },
  {
    id: 'et-investing',
    name: 'ET Investing',
    category: 'Investment Education',
    description: 'Learn investing basics, market strategies, and portfolio management',
    link: 'https://economictimes.indiatimes.com/investing',
    icon: '📚',
    forProfile: ['student', 'investor']
  },
  {
    id: 'mutual-funds',
    name: 'Mutual Funds',
    category: 'Investment Products',
    description: 'Browse, compare, and invest in mutual funds with expert recommendations',
    link: 'https://economictimes.indiatimes.com/mutual-funds',
    icon: '🎯',
    forProfile: ['investor', 'professional']
  },
  {
    id: 'credit-cards',
    name: 'Credit Cards',
    category: 'Financial Services',
    description: 'Premium credit card options with exclusive benefits and rewards',
    link: 'https://economictimes.indiatimes.com/credit-cards',
    icon: '💳',
    forProfile: ['professional']
  },
  {
    id: 'loans',
    name: 'Personal Loans',
    category: 'Lending',
    description: 'Quick personal loans with competitive rates and easy approval',
    link: 'https://economictimes.indiatimes.com/personal-loans',
    icon: '💰',
    forProfile: ['professional']
  },
  {
    id: 'insurance',
    name: 'Insurance',
    category: 'Protection',
    description: 'Life, health, and general insurance plans tailored to your needs',
    link: 'https://economictimes.indiatimes.com/insurance',
    icon: '🛡️',
    forProfile: ['student', 'investor', 'professional']
  },
  {
    id: 'et-startup',
    name: 'ET Startup',
    category: 'Entrepreneurship',
    description: 'Resources, news, and funding opportunities for startups and entrepreneurs',
    link: 'https://economictimes.indiatimes.com/startups',
    icon: '🚀',
    forProfile: ['entrepreneur']
  },
  {
    id: 'et-jobs',
    name: 'ET Jobs',
    category: 'Career',
    description: 'Top job opportunities in finance, tech, and business sectors',
    link: 'https://economictimes.indiatimes.com/jobs',
    icon: '💼',
    forProfile: ['student', 'professional']
  },
  {
    id: 'et-masterclass',
    name: 'Masterclasses',
    category: 'Education',
    description: 'Expert-led online courses on finance, investing, and business',
    link: 'https://economictimes.indiatimes.com/masterclasses',
    icon: '🎓',
    forProfile: ['student', 'professional']
  },
  {
    id: 'et-events',
    name: 'ET Events',
    category: 'Networking',
    description: 'Wealth summits, corporate events, and networking conferences',
    link: 'https://economictimes.indiatimes.com/events',
    icon: '🎪',
    forProfile: ['investor', 'professional']
  }
];

export function getServicesForProfile(profile: string): Service[] {
  return ET_SERVICES.filter(service => {
    if (!service.forProfile) return true;
    return service.forProfile.includes(profile);
  });
}

export function getServicesByCategory(category: string): Service[] {
  return ET_SERVICES.filter(service => service.category === category);
}
