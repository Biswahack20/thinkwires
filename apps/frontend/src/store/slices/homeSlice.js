import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5000/api';

export const fetchTechStack = createAsyncThunk(
  'home/fetchTechStack',
  async () => {
    const response = await fetch(`${API_BASE}/tech-stack`);
    return await response.json();
  }
);

export const fetchOpenings = createAsyncThunk(
  'home/fetchOpenings',
  async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append('q', params.q);
    if (params.location && params.location !== 'All') queryParams.append('location', params.location);
    if (params.experience && params.experience !== 'All') queryParams.append('experience', params.experience);
    if (params.workMode && params.workMode !== 'All Modes') queryParams.append('workMode', params.workMode);
    if (params.department && params.department !== 'All Roles' && params.department !== 'All') queryParams.append('department', params.department);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const response = await fetch(`${API_BASE}/openings${queryString ? `?${queryString}` : ''}`);
    return await response.json();
  }
);

export const fetchStats = createAsyncThunk('home/fetchStats', async () => {
  const response = await fetch(`${API_BASE}/stats`);
  return await response.json();
});

export const fetchIndustries = createAsyncThunk(
  'home/fetchIndustries',
  async () => {
    const response = await fetch(`${API_BASE}/industries`);
    return await response.json();
  }
);

export const fetchProcess = createAsyncThunk('home/fetchProcess', async () => {
  const response = await fetch(`${API_BASE}/process`);
  return await response.json();
});

export const fetchCapabilities = createAsyncThunk('home/fetchCapabilities', async () => {
  const response = await fetch(`${API_BASE}/capabilities`);
  return await response.json();
});

export const fetchReports = createAsyncThunk('home/fetchReports', async () => {
  const response = await fetch(`${API_BASE}/reports`);
  return await response.json();
});

export const fetchBenefits = createAsyncThunk('home/fetchBenefits', async () => {
  const response = await fetch(`${API_BASE}/benefits`);
  return await response.json();
});

export const fetchFaqs = createAsyncThunk('home/fetchFaqs', async () => {
  const response = await fetch(`${API_BASE}/faqs`);
  return await response.json();
});

const initialSeedOpenings = [
  {
    id: 1,
    category: "ENTERPRISE SYSTEMS • CONTRACT",
    badge: "Immediate Joining",
    badgeColor: "green",
    logo: "SAP",
    title: "SAP ABAP with HANA Developer",
    company: "Enterprise Systems Client",
    location: "Bangalore",
    experience: "3 - 5 Years",
    experienceTier: "Mid",
    salary: "₹10 - 15 LPA",
    joining: "< 15 Days",
    description: "Professionals with hands-on experience in ABAP development and HANA-based solutions...",
    skills: ["SAP ABAP", "HANA Database", "CDS views", "RICEF", "AMDP"],
    workMode: "On-site",
    department: "SAP & Enterprise",
    postedDate: "2026-10-04",
    priority: 1
  },
  {
    id: 2,
    category: "FINTECH CORRIDOR • US REMOTE",
    badge: "Greenfield",
    badgeColor: "blue",
    logo: "ACH",
    title: "Senior / Lead Payment Platform Architect",
    company: "FinTech Corridor",
    location: "Remote (US/IND)",
    experience: "15+ Years",
    experienceTier: "Lead",
    salary: "₹20+ LPA / Direct",
    joining: "Principal Tier",
    description: "Design and build a standalone, high-throughput, fault-tolerant Payment Processing Platform...",
    skills: ["node.js", "TypeScript", "ACH Systems", "Distributed Ledger", "Python"],
    workMode: "Remote",
    department: "Full Stack & Frontend",
    postedDate: "2026-10-03",
    priority: 2
  },
  {
    id: 3,
    category: "DIGITAL EXPERIENCE • HYBRID",
    badge: "Immediate (15 Days)",
    badgeColor: "green",
    logo: "AEM",
    title: "Full Stack Developer – Adobe AEM / Web SDK",
    company: "Global Digital Commerce",
    location: "Bangalore / Hyd",
    experience: "8+ Years",
    experienceTier: "Senior",
    salary: "Market Premium",
    joining: "Contract / C2H",
    description: "Implement scalable AEM Cloud Service micro-sites with modern Web SDK integration...",
    skills: ["Adobe AEM 6.5", "Cloud Services", "Web SDK", "Java OSGi", "React.js"],
    workMode: "Hybrid",
    department: "Full Stack & Frontend",
    postedDate: "2026-10-02",
    priority: 3
  },
  {
    id: 4,
    category: "AI & COGNITIVE LABS • HIGH PRIORITY",
    badge: "Hot Job",
    badgeColor: "blue",
    logo: "AI",
    title: "Senior Data Scientist – GenAI / Computer Vision",
    company: "AI & Cognitive Labs",
    location: "Bangalore / Hyd",
    experience: "8+ Years",
    experienceTier: "Senior",
    salary: "₹30 - 40 LPA",
    joining: "15–30 Days",
    description: "Design, develop, and deploy production-scale LLMs and vision transformers...",
    skills: ["LLMs", "PyTorch", "LangChain", "Vision Transformers", "Vector DBs"],
    workMode: "Remote",
    department: "AI & Data Engineering",
    postedDate: "2026-10-01",
    priority: 4
  },
  {
    id: 5,
    category: "CLOUD ENGINEERING • FULL-TIME",
    badge: "Full-Time",
    badgeColor: "blue",
    logo: "AWS",
    title: "Cloud Architect – AI Platform",
    company: "Enterprise AI Platform",
    location: "Bangalore",
    experience: "10+ Years",
    experienceTier: "Lead",
    salary: "Premium CTC",
    joining: "Multi-Cloud",
    description: "Architect multi-region Kubernetes clusters on AWS/Azure with MLOps pipelines...",
    skills: ["AWS & Azure", "MLOps", "Kubernetes", "Terraform", "CI/CD"],
    workMode: "On-site",
    department: "Cloud & DevOps",
    postedDate: "2026-09-30",
    priority: 5
  },
  {
    id: 6,
    category: "CORE SYSTEMS • HIGH CONCURRENCY",
    badge: "Pan-India Remote",
    badgeColor: "blue",
    logo: "C++",
    title: "Software Development Engineer 3 (C++)",
    company: "High Performance Systems",
    location: "Remote / India",
    experience: "5 - 8 Years",
    experienceTier: "Senior",
    salary: "Open CTC",
    joining: "Low-Latency",
    description: "Design high-performance low-latency enterprise software solutions in Modern C++...",
    skills: ["Modern C++", "Multi-threading", "Linux Kernel", "Low Latency", "IPC / Socket"],
    workMode: "Remote",
    department: "Full Stack & Frontend",
    postedDate: "2026-09-29",
    priority: 6
  }
];

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    techStack: [],
    openings: initialSeedOpenings,
    stats: {
      vacancies: 125,
      companies: 740,
      hired: 999,
      satisfaction: 95,
      jobsFilled: 130,
      corePlacements: 55,
      contingentHired: 125,
      clientRetention: 95,
    },
    industries: [],
    process: [],
    capabilities: [],
    reports: [],
    benefits: [],
    faqs: [],
    status: {
      techStack: 'idle',
      openings: 'idle',
      stats: 'idle',
      industries: 'idle',
      process: 'idle',
      capabilities: 'idle',
      reports: 'idle',
      benefits: 'idle',
      faqs: 'idle',
    },
    errors: {
      techStack: null,
      openings: null,
      stats: null,
      industries: null,
      process: null,
      capabilities: null,
      reports: null,
      benefits: null,
      faqs: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tech Stack
      .addCase(fetchTechStack.pending, (state) => {
        state.status.techStack = 'loading';
      })
      .addCase(fetchTechStack.fulfilled, (state, action) => {
        state.status.techStack = 'succeeded';
        state.techStack = action.payload;
      })
      .addCase(fetchTechStack.rejected, (state, action) => {
        state.status.techStack = 'failed';
        state.errors.techStack = action.error.message;
      })
      // Openings
      .addCase(fetchOpenings.pending, (state) => {
        state.status.openings = 'loading';
      })
      .addCase(fetchOpenings.fulfilled, (state, action) => {
        state.status.openings = 'succeeded';
        state.openings = action.payload;
      })
      .addCase(fetchOpenings.rejected, (state, action) => {
        state.status.openings = 'failed';
        state.errors.openings = action.error.message;
      })
      // Stats
      .addCase(fetchStats.pending, (state) => {
        state.status.stats = 'loading';
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status.stats = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status.stats = 'failed';
        state.errors.stats = action.error.message;
      })
      // Industries
      .addCase(fetchIndustries.pending, (state) => {
        state.status.industries = 'loading';
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.status.industries = 'succeeded';
        state.industries = action.payload;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.status.industries = 'failed';
        state.errors.industries = action.error.message;
      })
      // Process
      .addCase(fetchProcess.pending, (state) => { state.status.process = 'loading'; })
      .addCase(fetchProcess.fulfilled, (state, action) => { state.status.process = 'succeeded'; state.process = action.payload; })
      .addCase(fetchProcess.rejected, (state, action) => { state.status.process = 'failed'; state.errors.process = action.error.message; })
      // Capabilities
      .addCase(fetchCapabilities.pending, (state) => { state.status.capabilities = 'loading'; })
      .addCase(fetchCapabilities.fulfilled, (state, action) => { state.status.capabilities = 'succeeded'; state.capabilities = action.payload; })
      .addCase(fetchCapabilities.rejected, (state, action) => { state.status.capabilities = 'failed'; state.errors.capabilities = action.error.message; })
      // Reports
      .addCase(fetchReports.pending, (state) => { state.status.reports = 'loading'; })
      .addCase(fetchReports.fulfilled, (state, action) => { state.status.reports = 'succeeded'; state.reports = action.payload; })
      .addCase(fetchReports.rejected, (state, action) => { state.status.reports = 'failed'; state.errors.reports = action.error.message; })
      // Benefits
      .addCase(fetchBenefits.pending, (state) => { state.status.benefits = 'loading'; })
      .addCase(fetchBenefits.fulfilled, (state, action) => { state.status.benefits = 'succeeded'; state.benefits = action.payload; })
      .addCase(fetchBenefits.rejected, (state, action) => { state.status.benefits = 'failed'; state.errors.benefits = action.error.message; })
      // FAQs
      .addCase(fetchFaqs.pending, (state) => { state.status.faqs = 'loading'; })
      .addCase(fetchFaqs.fulfilled, (state, action) => { state.status.faqs = 'succeeded'; state.faqs = action.payload; })
      .addCase(fetchFaqs.rejected, (state, action) => { state.status.faqs = 'failed'; state.errors.faqs = action.error.message; });
  },
});

export default homeSlice.reducer;
