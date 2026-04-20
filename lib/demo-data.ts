import { subDays, format, startOfToday, subHours, subMinutes } from "date-fns";

export const DEMO_USER = {
  id: "demo-user-123",
  email: "demo@clientflow.com",
  full_name: "Alex Thompson",
  role: "Sales Director",
  isDemo: true,
  plan: "Professional"
};

export const DEMO_STATS = {
  totalLeads: 1248,
  wonLeads: 482,
  conversionRate: 38.6,
};

// Generate last 30 days of lead counts for the chart
const generateLeadsPerDay = () => {
  const data = [];
  const today = startOfToday();
  // Base counts with some random-ish but stable variation
  const baseCounts = [12, 18, 15, 22, 19, 8, 10, 25, 21, 17, 28, 24, 12, 14, 32, 29, 26, 35, 31, 15, 18, 42, 38, 35, 45, 41, 22, 25, 48, 52, 47];
  
  for (let i = 30; i >= 0; i--) {
    data.push({
      date: format(subDays(today, i), "yyyy-MM-dd"),
      count: baseCounts[30 - i] || 10
    });
  }
  return data;
};

export const DEMO_LEADS_PER_DAY = generateLeadsPerDay();

const today = new Date();

export const DEMO_LEADS = [
  {
    id: "demo-1",
    first_name: "Sarah",
    last_name: "Jenkins",
    email: "sarah.j@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions",
    status: "Won",
    source: "Referral",
    value: 12500,
    message: "Interested in our enterprise plan for their 50-person engineering team. Specifically looking for advanced analytics and priority support.",
    created_at: subDays(subHours(today, 4), 2).toISOString(),
    notes: [
      { id: "n1", content: "Initial discovery call completed. Very positive feedback on the dashboard UI.", created_at: subDays(subHours(today, 2), 2).toISOString(), author: { full_name: "Alex Thompson" } },
      { id: "n2", content: "Sent over the custom proposal. They are reviewing it with their CTO.", created_at: subDays(subHours(today, 1), 1).toISOString(), author: { full_name: "Alex Thompson" } }
    ],
    ai_insights: {
      summary: {
        summary: "High-value enterprise lead from TechCorp Solutions looking to migrate a 50-person team. Primary interest lies in analytics and support tiers.",
        keyPoints: [
          "50-person engineering team migration",
          "Enterprise plan focus",
          "Requires advanced analytics",
          "Priority support is a deal-breaker"
        ]
      },
      classification: {
        priority: "hot",
        reasoning: "High seat count (50) and direct interest in Enterprise features from TechCorp. The referral source and CTO involvement mentioned in the message indicate high closing probability."
      },
      reply: {
        subject: "Tailored Enterprise Solutions for TechCorp Engineering",
        body: "Hi Sarah,\n\nI noticed TechCorp is looking to migrate a 50-person engineering team. We've helped similar teams streamline their workflows with our advanced analytics and priority support.\n\nI'd love to discuss how our enterprise plan can specifically address the CTO's requirements. Are you available for a brief follow-up tomorrow?\n\nBest,\nAlex"
      }
    }
  },
  {
    id: "demo-2",
    first_name: "Michael",
    last_name: "Chen",
    email: "m.chen@globalsoft.io",
    phone: "+1 (555) 987-6543",
    company: "GlobalSoft",
    status: "In Progress",
    source: "Direct",
    value: 8400,
    message: "Evaluating CRM alternatives. Current solution is too bloated for their needs. They love the clean interface of ClientFlow.",
    created_at: subDays(subHours(today, 2), 3).toISOString(),
    notes: [
      { id: "n3", content: "Demo session scheduled for next Tuesday.", created_at: subDays(subHours(today, 1), 3).toISOString(), author: { full_name: "Alex Thompson" } }
    ],
    ai_insights: {
      summary: {
        summary: "GlobalSoft is seeking a streamlined CRM alternative to replace a bloated legacy system. They value UI/UX and simplicity.",
        keyPoints: [
          "Replacing bloated legacy CRM",
          "Values clean interface and UX",
          "Mid-market potential",
          "Demo scheduled for next week"
        ]
      },
      classification: {
        priority: "warm",
        reasoning: "Explicit dissatisfaction with 'bloated' current system at GlobalSoft. Active engagement with a scheduled demo next week demonstrates clear intent."
      },
      reply: {
        subject: "Streamlining GlobalSoft's CRM Experience",
        body: "Hi Michael,\n\nI'm glad your team appreciated the clean interface of ClientFlow. Since GlobalSoft is looking to move away from bloated systems, I've prepared a demo that focuses strictly on the high-efficiency essentials.\n\nLooking forward to showing you how we compare next Tuesday.\n\nBest,\nAlex"
      }
    }
  },
  {
    id: "demo-3",
    first_name: "Emma",
    last_name: "Rodriguez",
    email: "emma.r@creativeminds.com",
    phone: "+1 (555) 444-3322",
    company: "Creative Minds Agency",
    status: "New",
    source: "Social Media",
    value: 5000,
    message: "Saw our post on LinkedIn about the new AI features. Wants to see how the automated follow-up drafts work.",
    created_at: subHours(today, 5).toISOString(),
    notes: [],
    ai_insights: {
      summary: {
        summary: "Creative agency lead specifically interested in AI automation features for follow-ups. Came through LinkedIn social proof.",
        keyPoints: [
          "AI feature enthusiast",
          "Creative agency background",
          "Interested in automated follow-ups",
          "Social media acquisition"
        ]
      },
      classification: {
        priority: "warm",
        reasoning: "Specific interest in AI automation from Creative Minds Agency. LinkedIn referral indicates social proof is working; focus should be on demonstrating the 'Draft AI Reply' feature."
      },
      reply: {
        subject: "AI Follow-up Demo for Creative Minds Agency",
        body: "Hi Emma,\n\nThanks for reaching out! Since you're interested in our automated follow-up drafts, I'd love to record a quick Loom showing you exactly how they'd look for Creative Minds Agency.\n\nAre there any specific use cases your team is most excited about?\n\nBest,\nAlex"
      }
    }
  },
  {
    id: "demo-4",
    first_name: "David",
    last_name: "Smith",
    email: "dsmith@manufacturing.co",
    phone: "+1 (555) 222-1111",
    company: "Smith Manufacturing",
    status: "Lost",
    source: "Email",
    value: 15000,
    message: "Traditional manufacturing firm looking to digitize their sales process. Might be a bit too early for them.",
    created_at: subDays(subHours(today, 8), 5).toISOString(),
    notes: [
      { id: "n4", content: "Decided to stick with their current spreadsheet system for now. Budget constraints.", created_at: subDays(subHours(today, 2), 4).toISOString(), author: { full_name: "Alex Thompson" } }
    ],
    ai_insights: {
      summary: {
        summary: "Traditional firm attempting digital transformation. Ultimately chose to remain on spreadsheets due to budget and cultural inertia.",
        keyPoints: [
          "Manufacturing sector",
          "Digital transformation attempt",
          "Budget constraints",
          "Preference for spreadsheets"
        ]
      },
      classification: {
        priority: "cold",
        reasoning: "Lost due to budget and cultural preference for spreadsheets at Smith Manufacturing. Keep on long-term drip for future digital transformation readiness."
      },
      reply: {
        subject: "Resources for Smith Manufacturing's Digital Transition",
        body: "Hi David,\n\nI completely understand the decision to keep things in spreadsheets for now. Transitioning from legacy processes takes time.\n\nI've attached a guide on 'Hybrid CRM Workflows' that helps manufacturing teams bridge the gap. We'll be here if you decide to revisit this next quarter.\n\nBest,\nAlex"
      }
    }
  },
  {
    id: "demo-5",
    first_name: "Lisa",
    last_name: "Wong",
    email: "lisa.wong@retailgiant.com",
    phone: "+1 (555) 777-8888",
    company: "Retail Giant",
    status: "In Progress",
    source: "Other",
    value: 22000,
    message: "Large-scale retail operation. Interested in the multi-user collaboration features and lead assignment logic.",
    created_at: subDays(subHours(today, 1), 6).toISOString(),
    notes: [
      { id: "n5", content: "Technical review of our API documentation in progress.", created_at: subDays(subHours(today, 12), 5).toISOString(), author: { full_name: "Alex Thompson" } }
    ],
    ai_insights: {
      summary: {
        summary: "Large retail lead focused on scalability and collaboration. Currently performing a technical audit of our API capabilities.",
        keyPoints: [
          "Large-scale retail operation",
          "Multi-user collaboration focus",
          "API technical review in progress",
          "High potential contract value"
        ]
      },
      classification: {
        priority: "hot",
        reasoning: "Retail Giant represents a high-value ($22k) scale play. The active API review indicates deep technical evaluation, moving beyond surface-level curiosity."
      },
      reply: {
        subject: "Collaboration Support for Retail Giant's Scale",
        body: "Hi Lisa,\n\nI hope Retail Giant's technical team is finding the API docs useful. Our multi-user collaboration tools are designed exactly for large-scale operations like yours.\n\nWould it be helpful to have our lead engineer join a call to discuss the assignment logic further?\n\nBest,\nAlex"
      }
    }
  }
];

export const DEMO_LEADS_BY_SOURCE = [
  { name: "Direct", value: 450 },
  { name: "Referral", value: 320 },
  { name: "Social Media", value: 210 },
  { name: "Email", value: 180 },
  { name: "Other", value: 88 },
];
