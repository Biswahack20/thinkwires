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

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
