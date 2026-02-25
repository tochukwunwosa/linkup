export type CategoryColorSet = {
  solid: string;   // primary color
  light: string;   // lighter companion for gradients
  overlay: string; // translucent bg for pills/icons
  text: string;    // text color on solid bg
};

const COLOR_MAP: Array<{ keywords: string[]; colors: CategoryColorSet }> = [
  {
    keywords: [
      'technology', 'tech', 'dev', 'development', 'web', 'ai', 'data',
      'software', 'cloud', 'coding', 'programming', 'javascript', 'python',
      'open source', 'devsummit', 'devfest', 'cybersecurity', 'security',
      'mobile', 'frontend', 'backend', 'fullstack',
    ],
    colors: {
      solid: '#0066cc',
      light: '#3b82f6',
      overlay: 'rgba(0,102,204,0.09)',
      text: '#ffffff',
    },
  },
  {
    keywords: ['design', 'ux', 'ui', 'creative', 'graphic', 'visual', 'product design', 'figma'],
    colors: {
      solid: '#6b46c1',
      light: '#8b5cf6',
      overlay: 'rgba(107,70,193,0.09)',
      text: '#ffffff',
    },
  },
  {
    keywords: [
      'business', 'startup', 'finance', 'entrepreneurship', 'investment',
      'fintech', 'founders', 'leadership', 'enterprise', 'management',
    ],
    colors: {
      solid: '#059669',
      light: '#10b981',
      overlay: 'rgba(5,150,105,0.09)',
      text: '#ffffff',
    },
  },
  {
    keywords: ['marketing', 'product', 'career', 'growth', 'sales', 'content', 'social media'],
    colors: {
      solid: '#d97706',
      light: '#f59e0b',
      overlay: 'rgba(217,119,6,0.09)',
      text: '#ffffff',
    },
  },
  {
    keywords: [
      'community', 'networking', 'workshop', 'hackathon', 'meetup',
      'conference', 'summit', 'bootcamp', 'training',
    ],
    colors: {
      solid: '#0891b2',
      light: '#06b6d4',
      overlay: 'rgba(8,145,178,0.09)',
      text: '#ffffff',
    },
  },
];

const DEFAULT_COLORS: CategoryColorSet = {
  solid: '#0066cc',
  light: '#3b82f6',
  overlay: 'rgba(0,102,204,0.09)',
  text: '#ffffff',
};

export function getCategoryColors(categories: string[]): CategoryColorSet {
  for (const cat of categories) {
    const lower = cat.toLowerCase();
    for (const { keywords, colors } of COLOR_MAP) {
      if (keywords.some((k) => lower.includes(k))) {
        return colors;
      }
    }
  }
  return DEFAULT_COLORS;
}
