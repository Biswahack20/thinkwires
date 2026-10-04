import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let techStack = [
  'SAP HANA',
  'Adobe AEM',
  'Node / Python',
  'Teamcenter PLM',
  'AWS & Azure',
  'Salesforce CRM',
  'Oracle DB',
  'Kubernetes',
  'React / Next.js',
  'Go / Rust',
  'Docker',
  'Snowflake',
];

app.get('/api/tech-stack', (req, res) => {
  res.json(techStack);
});

// Endpoint to update the demo stacks
app.post('/api/tech-stack', (req, res) => {
  const { newStacks } = req.body;
  if (Array.isArray(newStacks)) {
    techStack = newStacks;
    res.json({ message: 'Tech stack updated successfully', techStack });
  } else {
    res.status(400).json({ error: 'newStacks must be an array of strings' });
  }
});

// Mock database for job openings
let openings = [
  {
    id: 1,
    title: 'SAP ABAP with HANA Developer',
    company: 'ThinkWires Enterprise Staffing',
    tag: 'Immediate Hire',
    tagColor: 'green',
    location: 'Bangalore',
    experience: '3 - 5 Years',
    salary: '₹10 - 15 LPA',
    description:
      'Professionals with hands-on experience in ABAP development and HANA-based solutions, along with strong CDS views, OData services, and classic RICEF...',
    skills: ['ABAP', 'SAP HANA', 'RICEF', 'CDS Views'],
    postedDate: '2026-09-15',
    priority: 1, // lower number = higher priority
  },
  {
    id: 2,
    title: 'Senior / Lead Payment Platform Architect',
    company: 'Fintech Solutions Client',
    tag: 'High Priority',
    tagColor: 'blue',
    location: '100% Remote',
    experience: '15+ Years',
    salary: '₹20+ LPA',
    description:
      'Design and build a standalone, high-throughput, fault-tolerant Payment Processing & Greenfield ACH Ledger Platform with deep event-driven...',
    skills: ['Node.js', 'TypeScript', 'Python', 'ACH Systems'],
    postedDate: '2026-09-14',
    priority: 2,
  },
  {
    id: 3,
    title: 'Full Stack Developer – Adobe AEM / Web SDK',
    company: 'Global Digital Commerce',
    tag: 'Immediate Joining',
    tagColor: 'green',
    location: 'Blr / Chen / Hyd',
    experience: '8+ Years',
    salary: 'Competitive Market',
    description:
      'Hands-on architecting of Adobe Experience Manager (AEM 6.5 / Cloud Service), modern frontend component libraries, Sling models, and Adobe Experience...',
    skills: ['Adobe AEM 6.5', 'Web SDK', 'Java OSGi', 'React'],
    postedDate: '2026-09-12',
    priority: 3,
  },
  {
    id: 4,
    title: 'Teamcenter Functional Analyst',
    company: 'Automotive & Aerospace Tier-1',
    tag: 'Notice: < 15 Days',
    tagColor: 'purple',
    location: 'Bangalore',
    experience: '8 - 12 Years',
    salary: 'Top Industry Slab',
    description:
      'Lead Siemens Teamcenter PLM functional workflows, BMIDE schema configuration, ITK customization integration, and multi-CAD data synchronization.',
    skills: ['Teamcenter PLM', 'BMIDE', 'ITK', 'Workflow Engine'],
    postedDate: '2026-09-12',
    priority: 4,
  },
];

app.get('/api/openings', (req, res) => {
  // Sort by priority first (ascending), then by postedDate (descending - most recent first)
  const sortedOpenings = [...openings].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(b.postedDate) - new Date(a.postedDate);
  });
  res.json(sortedOpenings);
});

app.get('/api/stats', (req, res) => {
  res.json({
    jobsFilled: 130,
    corePlacements: 55,
    contingentHired: 125,
    clientRetention: 93,
  });
});

app.get('/api/industries', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Information Tech',
      desc: 'Cloud, DevOps & Full Stack',
      icon: 'monitor',
      color: 'blue',
    },
    {
      id: 2,
      name: 'Banking & Fintech',
      desc: 'Ledger & ACH Systems',
      icon: 'building',
      color: 'blue',
    },
    {
      id: 3,
      name: 'Life Sciences',
      desc: 'HIPAA & Digital Health',
      icon: 'medical',
      color: 'green',
    },
    {
      id: 4,
      name: 'Automation',
      desc: 'Robotics & Industrial IoT',
      icon: 'robot',
      color: 'purple',
    },
    {
      id: 5,
      name: 'Aerospace',
      desc: 'PLM & Embedded Tech',
      icon: 'plane',
      color: 'blue',
    },
    {
      id: 6,
      name: 'Telecom & Infra',
      desc: '5G, Networks & Optical',
      icon: 'antenna',
      color: 'blue',
    },
  ]);
});

app.post('/api/contact', (req, res) => {
  const { email, phone } = req.body;
  if (email && phone) {
    console.log('New Contact Request:', { email, phone });
    res.json({ message: 'Callback requested successfully!' });
  } else {
    res.status(400).json({ error: 'Email and Phone are required' });
  }
});

const processData = [
  {
    number: '01',
    numberColor: '#bfdbfe',
    title: 'Discovery & Scoping Call',
    description: 'Share technical job descriptions and business constraints. Together we define tech stack nuances, seniorities, sprint cadences, and budget boundaries.',
    delivery: 'Delivery: Tailored Talent Blueprint',
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    icon: 'search'
  },
  {
    number: '02',
    numberColor: '#cbd5e1',
    title: 'Precision Pre-Vetted Match',
    description: 'In just 48 to 72 hours, we source from our active bench and verified candidate pipelines. You receive curated dossiers with coding evaluations and notice verification.',
    delivery: 'Delivery: Shortlist of Top 3 Contenders',
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    icon: 'users'
  },
  {
    number: '03',
    numberColor: '#bbf7d0',
    title: 'Seamless Onboarding & Scale',
    description: 'Our talent integrates immediately into your Slack, Jira, and Git repositories. ThinkWires oversees performance continuity, payroll, and scaling adjustments.',
    delivery: 'Delivery: Instant Sprint Participation',
    iconBg: '#22c55e',
    iconColor: '#ffffff',
    icon: 'check'
  }
];

const capabilitiesData = [
  {
    id: 1,
    eyebrow: '48-72 HR TURNAROUND',
    eyebrowColor: '#4f46e5',
    title: 'Staff Augmentation',
    description: 'Scale your engineering and enterprise squads on-demand with senior pre-screened individual contributors or cohesive development pods.',
    features: ['Flexible month-to-month contracts', 'Zero internal sourcing overhead', 'Instant replacement guarantee'],
    iconBg: '#eef2ff',
    iconColor: '#4f46e5',
    icon: 'users',
    linkColor: '#4f46e5',
    linkText: 'Explore Staffing'
  },
  {
    id: 2,
    eyebrow: 'GLOBAL COMPLIANCE',
    eyebrowColor: '#64748b',
    title: 'Employer of Record (EOR)',
    description: 'Hire anywhere in India, the US, and Canada without establishing foreign legal entities. We manage compliance, taxes, and local benefits seamlessly.',
    features: ['Full statutory Indian & US compliance', 'Cross-currency automated payroll', 'IP & NDA contract protection'],
    iconBg: '#e0f2fe',
    iconColor: '#0ea5e9',
    icon: 'globe',
    linkColor: '#64748b',
    linkText: 'Explore EOR Solutions'
  },
  {
    id: 3,
    eyebrow: 'EXECUTIVE PLACEMENT',
    eyebrowColor: '#10b981',
    title: 'Permanent & Search',
    description: 'Precision headhunting for pivotal VP Engineering, Lead Architects, Product Directors, and niche domain specialists who drive longevity.',
    features: ['Confidential executive sourcing', '90-day retention warranty', 'Behavioral & leadership appraisal'],
    iconBg: '#dcfce7',
    iconColor: '#10b981',
    icon: 'star',
    linkColor: '#10b981',
    linkText: 'Explore Executive Search'
  },
  {
    id: 4,
    eyebrow: 'AUTOMATED OPERATIONS',
    eyebrowColor: '#3b82f6',
    title: 'Payroll Outsourcing',
    description: 'End-to-end automated payroll execution, provident fund (PF) administration, ESIC compliance, tax withholdings, and employee self-service.',
    features: ['100% statutory error-free record', 'Digital payslip dispatch portal', 'Direct tax authority remittances'],
    iconBg: '#eef2ff',
    iconColor: '#4f46e5',
    icon: 'document',
    linkColor: '#3b82f6',
    linkText: 'Explore Payroll Systems'
  }
];

const reportsData = [
  {
    id: 1,
    tag: 'AI & Data Science',
    date: 'September 16, 2026',
    title: 'Beyond the Code: How Data Science and AI...',
    desc: "India's AI ecosystem is rapidly evolving. We explore how leading organizations are structuring their data teams and the back-end architectures driving them.",
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    tag: 'Hiring Trends',
    date: 'August 24, 2026',
    title: "India's IT Job Market in 2026: Hiring Is...",
    desc: 'Despite global headwinds, specialized engineering roles remain in high demand. See our comprehensive analysis on salary trends and retention strategies.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    tag: 'HR Technology',
    date: 'August 01, 2026',
    title: 'AI Recruitment in 2026: Smarter Matches, Longer Wait Times?',
    desc: 'While automated screening and technical code evaluations have increased efficiency, average time-to-hire has shifted by 11 days due to multi-stage vetting.',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

app.get('/api/process', (req, res) => res.json(processData));
app.get('/api/capabilities', (req, res) => res.json(capabilitiesData));
app.get('/api/reports', (req, res) => res.json(reportsData));

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
