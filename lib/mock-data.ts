import { Lead } from "@/types/leads"

export const MOCK_LEADS: Lead[] = [
  {
    id: "demo-1",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.j@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions",
    status: "qualified",
    stage_id: "qualified",
    source: "Website",
    value: 15000,
    owner_id: "demo-user",
    message: "Interested in enterprise licensing for our sales team of 50.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    notes: [
      {
        id: "n1",
        lead_id: "demo-1",
        author_id: "demo-user",
        content: "Followed up via email. They are looking for a Q3 implementation.",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        author: { full_name: "Demo User" }
      }
    ]
  },
  {
    id: "demo-2",
    first_name: "Michael",
    last_name: "Chen",
    email: "m.chen@innovate.io",
    phone: "+1 (555) 987-6543",
    company: "Innovate.io",
    status: "contacted",
    stage_id: "contacted",
    source: "LinkedIn",
    value: 8500,
    owner_id: "demo-user",
    message: "Saw your demo on Product Hunt. Would like to discuss integration options.",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    notes: []
  },
  {
    id: "demo-3",
    first_name: "Elena",
    last_name: "Rodriguez",
    email: "elena@globalretail.com",
    phone: "+1 (555) 444-3333",
    company: "Global Retail Group",
    status: "won",
    stage_id: "won",
    source: "Referral",
    value: 45000,
    owner_id: "demo-user",
    message: "Requesting a quote for the full platform suite.",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: [
      {
        id: "n2",
        lead_id: "demo-3",
        author_id: "demo-user",
        content: "Contract signed! Onboarding starts next week.",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        author: { full_name: "Demo User" }
      }
    ]
  },
  {
    id: "demo-4",
    first_name: "David",
    last_name: "Smith",
    email: "david@startup.co",
    phone: "+1 (555) 222-1111",
    company: "Startup Co",
    status: "new",
    stage_id: "new",
    source: "Website",
    value: 2500,
    owner_id: "demo-user",
    message: "Just checking out the tool.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: []
  },
  {
    id: "demo-5",
    first_name: "Jessica",
    last_name: "Lee",
    email: "jlee@marketingpro.com",
    phone: "+1 (555) 888-9999",
    company: "Marketing Pro",
    status: "lost",
    stage_id: "lost",
    source: "Cold Email",
    value: 5000,
    owner_id: "demo-user",
    message: "Comparing with other CRMs.",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: []
  }
]

export const MOCK_STAGES = [
  { id: "new", name: "New" },
  { id: "contacted", name: "Contacted" },
  { id: "qualified", name: "Qualified" },
  { id: "proposal", name: "Proposal" },
  { id: "negotiation", name: "Negotiation" },
  { id: "won", name: "Won" },
  { id: "lost", name: "Lost" }
]

export const MOCK_ANALYTICS = {
  stats: {
    totalLeads: 156,
    wonLeads: 42,
    conversionRate: 27,
    pipelineValue: 450000
  },
  leadsPerDay: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 10) + 2
  })),
  leadsBySource: [
    { source: "Website", count: 65 },
    { source: "Referral", count: 34 },
    { source: "LinkedIn", count: 28 },
    { source: "Cold Email", count: 19 },
    { source: "Other", count: 10 }
  ]
}

export const DEMO_USER = {
  id: "demo-user",
  full_name: "Demo User",
  email: "demo@clientflow.com",
  role: "admin",
  plan: "professional",
  isDemo: true
}
