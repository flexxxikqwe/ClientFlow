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

export const DEMO_LEADS_PER_DAY = [
  { date: "2026-03-09", count: 12 },
  { date: "2026-03-10", count: 18 },
  { date: "2026-03-11", count: 15 },
  { date: "2026-03-12", count: 22 },
  { date: "2026-03-13", count: 19 },
  { date: "2026-03-14", count: 8 },
  { date: "2026-03-15", count: 10 },
  { date: "2026-03-16", count: 25 },
  { date: "2026-03-17", count: 21 },
  { date: "2026-03-18", count: 17 },
  { date: "2026-03-19", count: 28 },
  { date: "2026-03-20", count: 24 },
  { date: "2026-03-21", count: 12 },
  { date: "2026-03-22", count: 14 },
  { date: "2026-03-23", count: 32 },
  { date: "2026-03-24", count: 29 },
  { date: "2026-03-25", count: 26 },
  { date: "2026-03-26", count: 35 },
  { date: "2026-03-27", count: 31 },
  { date: "2026-03-28", count: 15 },
  { date: "2026-03-29", count: 18 },
  { date: "2026-03-30", count: 42 },
  { date: "2026-03-31", count: 38 },
  { date: "2026-04-01", count: 35 },
  { date: "2026-04-02", count: 45 },
  { date: "2026-04-03", count: 41 },
  { date: "2026-04-04", count: 22 },
  { date: "2026-04-05", count: 25 },
  { date: "2026-04-06", count: 48 },
  { date: "2026-04-07", count: 52 },
  { date: "2026-04-08", count: 47 },
];

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
    created_at: "2026-04-07T10:00:00Z",
    notes: [
      { id: "n1", content: "Initial discovery call completed. Very positive feedback on the dashboard UI.", created_at: "2026-04-07T11:00:00Z", author: { full_name: "Alex Thompson" } },
      { id: "n2", content: "Sent over the custom proposal. They are reviewing it with their CTO.", created_at: "2026-04-08T09:30:00Z", author: { full_name: "Alex Thompson" } }
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
        reasoning: "High seat count (50) and direct interest in Enterprise features. Referral source increases trust and closing probability."
      },
      reply: {
        subject: "Enterprise Solutions for TechCorp Engineering Team",
        body: "Hi Sarah,\n\nIt was great speaking with you about TechCorp's engineering team. Based on our conversation, I've tailored a proposal that highlights our advanced analytics engine and our Platinum support tier, which I believe perfectly aligns with your 50-person team's requirements.\n\nI've attached the detailed breakdown. Looking forward to discussing this with you and your CTO.\n\nBest regards,\nAlex"
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
    created_at: "2026-04-07T14:30:00Z",
    notes: [
      { id: "n3", content: "Demo session scheduled for next Tuesday.", created_at: "2026-04-07T15:00:00Z", author: { full_name: "Alex Thompson" } }
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
        reasoning: "Clear pain point identified (bloated current system). Active engagement with a scheduled demo."
      },
      reply: {
        subject: "Streamlining GlobalSoft's Sales Workflow",
        body: "Hi Michael,\n\nI'm glad you enjoyed the clean interface of ClientFlow. We built it specifically for teams like yours that are tired of the 'bloat' in traditional CRMs.\n\nI've prepared a focused demo for next Tuesday that highlights our core efficiency tools without the clutter. See you then!\n\nBest,\nAlex"
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
    created_at: "2026-04-08T09:15:00Z",
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
        reasoning: "Specific feature interest (AI) indicates a modern tech stack and willingness to adopt new tools quickly."
      },
      reply: {
        subject: "AI-Powered Follow-ups for Creative Minds",
        body: "Hi Emma,\n\nThanks for reaching out after seeing our LinkedIn post! I'd love to show you how our AI follow-up engine can save your agency hours of manual work.\n\nWould you be open to a quick 15-minute walkthrough of the AI Insights tab this week?\n\nBest,\nAlex"
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
    created_at: "2026-04-06T11:45:00Z",
    notes: [
      { id: "n4", content: "Decided to stick with their current spreadsheet system for now. Budget constraints.", created_at: "2026-04-09T10:00:00Z", author: { full_name: "Alex Thompson" } }
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
        reasoning: "Lead is officially lost. High friction for digital adoption in this specific firm's culture."
      },
      reply: {
        subject: "Resources for Smith Manufacturing's Digital Journey",
        body: "Hi David,\n\nI completely understand the decision to stick with your current process for now. Digital transformation is a journey, not a sprint.\n\nI've attached a whitepaper on 'Gradual CRM Adoption for Manufacturing' that might be useful for your team in the future. We're here whenever you're ready to take the next step.\n\nBest regards,\nAlex"
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
    created_at: "2026-04-05T16:20:00Z",
    notes: [
      { id: "n5", content: "Technical review of our API documentation in progress.", created_at: "2026-04-06T09:00:00Z", author: { full_name: "Alex Thompson" } }
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
        reasoning: "High contract value ($22k) and deep technical engagement (API review) suggest a serious intent to purchase."
      },
      reply: {
        subject: "API Support and Collaboration Features for Retail Giant",
        body: "Hi Lisa,\n\nI hope your technical team is finding the API documentation clear. I've cc'd our lead engineer to this thread in case they have any specific questions regarding our multi-user assignment logic.\n\nWe're excited about the possibility of supporting Retail Giant's scale.\n\nBest,\nAlex"
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
