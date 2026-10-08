import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const fallbackAboutData = {
  hero: {
    badge: 'About ThinkWires • Transforming Global IT Talent Delivery',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Who We Are', href: '/about' }
    ],
    heading: 'Bridging Enterprise Innovation with',
    headingHighlight: 'Borderless Tech Talent.',
    description: 'Founded in 2022 as a premier workforce advisor and staffing aggregator, ThinkWires connects high-growth enterprises with specialized engineering talent and compliant Employer of Record (EOR) infrastructure across India, the US, and Canada.',
    heroImage: '/images/about-hero.jpg',
    heroImageAlt: 'Global Talent Grid - India, USA, Canada',
    ctaButtons: [
      { label: 'Meet Our Leadership', href: '#leadership', variant: 'primary', icon: 'arrowDown' },
      { label: 'The Aggregator Model', href: '#aggregator', variant: 'outline', icon: 'settings' }
    ]
  },
  statsStrip: [
    {
      id: 'stat-1',
      value: '5h',
      label: 'First Curated Profiles',
      subLabel: 'Proprietary AI matching engine',
      indicator: 'dot',
      accentColor: 'blue'
    },
    {
      id: 'stat-2',
      value: '7d',
      label: 'Time-to-Hire Target',
      subLabel: 'End-to-end interview to contract',
      indicator: 'check',
      accentColor: 'green'
    },
    {
      id: 'stat-3',
      value: '100+',
      unit: 'Yrs',
      label: 'Combined Executive Exp.',
      subLabel: 'Ex-Microsoft, IBM, BlackRock',
      indicator: 'none',
      accentColor: 'blue'
    },
    {
      id: 'stat-4',
      value: '100%',
      label: 'Statutory Compliance',
      subLabel: 'Zero cross-border legal friction',
      indicator: 'shield',
      accentColor: 'green'
    }
  ],
  aggregatorModel: {
    eyebrow: 'STRATEGIC ADVANTAGE',
    heading: 'The ThinkWires Aggregator Model',
    description: 'Traditional recruitment agencies bottleneck on internal databases. ThinkWires functions as an enterprise staffing aggregator orchestrating a high-velocity ecosystem of verified agencies, independent specialists, and automated compliance pipelines.',
    statusBadge: {
      icon: 'settings',
      text: 'Aggregator Architecture 3.2 Active'
    },
    cards: [
      {
        id: 'agg-1',
        icon: 'clock',
        iconBgColor: 'blue',
        title: 'Rapid Profile Delivery (5 Hours)',
        description: 'Proprietary matching algorithms search verified repositories to deliver pre-screened, job-fit candidate dossiers within 5 working hours of intake.',
        ctaLabel: 'SLA Guarantee',
        ctaHref: '#sla'
      },
      {
        id: 'agg-2',
        icon: 'grid',
        iconBgColor: 'dark',
        title: 'Full-Stack Tech & Enterprise ERP',
        description: 'Specialized domain depth spanning SAP ABAP/HANA, Adobe Experience Manager (AEM), Teamcenter PLM, Kubernetes/DevOps, and Generative AI frameworks.',
        ctaLabel: 'Deep Tech Benches',
        ctaHref: '#tech'
      },
      {
        id: 'agg-3',
        icon: 'shield',
        iconBgColor: 'green',
        title: 'Zero Compliance Risk',
        description: 'Complete Employer of Record (EOR) indemnification. We manage local statutory payroll, benefits, strict IP NDA assignments, and multi-jurisdiction tax withholding.',
        ctaLabel: 'Full Statutory Shield',
        ctaHref: '#compliance'
      },
      {
        id: 'agg-4',
        icon: 'share',
        iconBgColor: 'indigo',
        title: 'Agile Subcontractor Network',
        description: 'A curated network of certified boutique recruitment partners providing instant surge capacity without inflating fixed operational overhead.',
        ctaLabel: 'Marketplace Scalability',
        ctaHref: '#network'
      }
    ]
  },
  philosophy: {
    eyebrow: 'OUR PHILOSOPHY',
    heading: '"Recruitment is Not Transactional; It is Architectural."',
    description: 'At ThinkWires, we reject the legacy headhunter pattern of resume-dumping. We treat every client intake as an engineering brief. From understanding the nuances of microservices architectures to navigating localized tax laws in Ontario or California, our teams engineer frictionless, compliant talent conduits.',
    image: '/images/about-philosophy.jpg',
    imageAlt: 'ThinkWires team in boardroom meeting',
    metrics: [
      {
        id: 'metric-1',
        value: '98.4%',
        label: 'Contract Retention Rate',
        color: 'green'
      },
      {
        id: 'metric-2',
        value: '< 48 hrs',
        label: 'Candidate Interview Turnaround',
        color: 'blue'
      }
    ]
  },
  leadershipTeam: {
    eyebrow: 'EXECUTIVE GOVERNANCE',
    heading: 'Meet Our Leadership Team',
    subheading: 'Driving cross-border vision, recruitment architecture, and operational integrity across global tech corridors.',
    members: [
      {
        id: 'member-1',
        name: 'Naziya Husain',
        designation: 'Founder Member',
        bio: 'With over 14 years in recruitment, headhunting, talent mapping, and end-to-end manpower solutions, Naziya has successfully steered complex mandates across KPOs, top-tier management consulting firms, and fast-scaling digital startups.',
        avatar: { type: 'initials', value: 'NH', bgColor: '#2563EB', textColor: '#FFFFFF' },
        badge: { text: '14+ Yrs Exp', dotColor: '#2563EB' },
        footerTag: 'Talent Mapping & Manpower',
        linkedinUrl: 'https://linkedin.com',
        layout: 'default'
      },
      {
        id: 'member-2',
        name: 'Anju Balyan',
        designation: 'Co-Founder & Associate Executive Director',
        bio: 'Enthusiastic enterprise HR leader with 17 years aligning HR initiatives with tier-one business priorities. Specialist in shared services environments, transitions, legal frameworks, ERP rollouts, and HR automation systems.',
        avatar: { type: 'initials', value: 'AB', bgColor: '#2563EB', textColor: '#FFFFFF' },
        badge: { text: '17+ Yrs Exp', dotColor: '#2563EB' },
        footerTag: 'ERP Implementations & Ops',
        linkedinUrl: 'https://linkedin.com',
        layout: 'default'
      },
      {
        id: 'member-3',
        name: 'Ananya Mehta',
        designation: 'Chief Executive Officer (CEO)',
        bio: 'Dedicated to building teams that drive real business velocity. Expert in strategic talent research, executive search, deep candidate evaluation beyond CVs, and structuring high-trust leadership placements for global scale.',
        avatar: { type: 'initials', value: 'AM', bgColor: '#22C55E', textColor: '#FFFFFF' },
        badge: { text: 'Executive Search', dotColor: '#22C55E' },
        footerTag: 'Strategic Sourcing & Growth',
        linkedinUrl: 'https://linkedin.com',
        layout: 'default'
      },
      {
        id: 'member-4',
        name: 'Arjun Verma',
        designation: 'Chief People & Marketing Officer (CPO & CMO)',
        bio: 'A 20+-year veteran at the intersection of talent acquisition, organizational culture, and brand positioning. Focused on solving why high-growth enterprises struggle to hire and how elite culture transforms product velocity.',
        avatar: { type: 'initials', value: 'AV', bgColor: '#0F172A', textColor: '#FFFFFF' },
        badge: { text: '20+ Yrs Exp', dotColor: '#22C55E' },
        footerTag: 'People Strategy & Brand',
        linkedinUrl: 'https://linkedin.com',
        layout: 'default'
      },
      {
        id: 'member-5',
        name: 'Meera Iyer',
        designation: 'Senior Director - Global Head of TA Operations & HR Services',
        bio: 'Strategic Talent Acquisition and HR Operations executive who has built scalable, technology-driven recruitment frameworks across enterprise leaders including BlackRock, Microsoft, IBM, Ameriprise, and Infosys. Ensures institutional governance, risk mitigation, compliance, and flawless multi-region operations.',
        avatar: { type: 'initials', value: 'MI', bgColor: '#22C55E', textColor: '#FFFFFF' },
        companies: ['BlackRock', 'Microsoft', 'IBM', 'Infosys'],
        footerTag: 'Global Delivery Operations & Risk Governance',
        linkedinUrl: 'https://linkedin.com',
        layout: 'wide'
      }
    ]
  },
  growthTimeline: {
    eyebrow: 'CHRONICLE OF EXECUTION',
    heading: 'Our Growth Evolution',
    description: 'From an agile aggregator in Sector 63, Noida to a cross-continental staffing architecture powering Fortune 500 engineering initiatives.',
    milestones: [
      {
        id: 'milestone-1',
        year: '2022',
        tag: 'Founding',
        title: 'The Inception',
        description: 'Founded in Noida with a core team dedicated to borderless recruitment, pioneering an agency aggregator network that delivers verified profiles in under 5 hours.',
        variant: 'default'
      },
      {
        id: 'milestone-2',
        year: '2023',
        tag: 'Market Fit',
        title: 'Growth & Practice Alignment',
        description: 'Unit economics break-even achieved. Launched specialized talent practices across SAP ABAP/HANA, Cloud/DevOps, and Enterprise Salesforce consulting.',
        variant: 'default'
      },
      {
        id: 'milestone-3',
        year: '2024',
        tag: 'International',
        title: 'Cross-Border Expansion',
        description: 'Inaugurated dedicated talent corridors into the United States and Canada. Rolled out comprehensive Employer of Record (EOR) and global payroll management.',
        variant: 'active'
      },
      {
        id: 'milestone-4',
        year: '2026+',
        tag: 'Next Era',
        title: 'AI-Powered Delivery',
        description: 'Automated code telemetry vetting, generative talent search matching, and sub-48-hour global deployment pipelines across AI and PLM systems.',
        variant: 'future'
      }
    ]
  },
  methodology: {
    eyebrow: 'METHODOLOGY',
    heading: 'How We Work: From Spec to Squad',
    description: 'Our three-step framework eliminates recruitment friction and guarantees rapid technical alignment.',
    steps: [
      {
        id: 'step-1',
        number: '01',
        icon: 'eye',
        title: 'Discovery & Technical Scoping',
        description: 'We initiate with an executive discovery session. We evaluate tech stack nuances, project deadlines, budgetary constraints, and candidate seniority to draft exact success metrics.'
      },
      {
        id: 'step-2',
        number: '02',
        icon: 'bolt',
        title: 'Precision Pre-Vetted Match (<5 Hours)',
        description: 'Our aggregator engine coordinates across our specialized subcontractor network to deliver tested, pre-interviewed candidate dossiers within five working hours.'
      },
      {
        id: 'step-3',
        number: '03',
        icon: 'checkCircle',
        title: 'Frictionless Onboarding & Governance',
        description: 'Seamless offer negotiation, local statutory contract issuance via EOR, compliant equipment provisioning, and ongoing governance tracking ensure long-term retention.'
      }
    ]
  },
  ctaSection: {
    statusBadge: 'IMMEDIATE ADVISORY AVAILABILITY',
    heading: 'Ready to Build Your High-Velocity Engineering Squad?',
    description: 'Book a 20-minute workforce strategy consultation with our staffing directors to audit your technical requirements and receive benchmark rates for India and North America.',
    address: {
      title: 'ThinkWires Global Headquarters',
      line: 'Plot No. 20, Block H-1/A, Sector 63, Noida, Uttar Pradesh 201301'
    },
    phones: ['+91 (120) 450-8800', '+91 89205 55626'],
    email: 'connect@thinkwires.com',
    form: {
      title: 'Request a 20-Min Strategy Call',
      subtitle: 'Receive matched engineering profiles in under 5 hours.',
      fields: [
        { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. Sarah Jenkins', required: true },
        { name: 'workEmail', label: 'Work Email', type: 'email', placeholder: 'sarah@enterprise.com', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 019-2834', required: false },
        { name: 'primaryNeed', label: 'Primary Need', type: 'select', placeholder: 'Staff Augmentation', required: false, options: ['Staff Augmentation', 'Permanent Hiring', 'EOR/Payroll', 'Executive Search'] },
        { name: 'techRoles', label: 'Tech Roles & Team Size', type: 'textarea', placeholder: 'e.g. 3x Senior SAP ABAP developers, 2x Cloud DevOps engineers starting next month', required: false }
      ],
      submitLabel: 'Schedule Talent Consultation',
      footerNote: 'Zero commitments. Non-disclosure agreement guaranteed.'
    }
  }
};

export const fetchAboutData = createAsyncThunk(
  'about/fetchAboutData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/about`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('API fetch failed, falling back to local seed data:', err.message);
      return fallbackAboutData;
    }
  }
);

export const submitConsultation = createAsyncThunk(
  'about/submitConsultation',
  async (formData) => {
    const response = await fetch(`${API_BASE}/about/consultation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to submit consultation');
    }

    return response.json();
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    data: fallbackAboutData,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    consultationStatus: 'idle', // 'idle' | 'submitting' | 'succeeded' | 'failed'
    consultationMessage: null
  },
  reducers: {
    resetConsultationStatus: (state) => {
      state.consultationStatus = 'idle';
      state.consultationMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(submitConsultation.pending, (state) => {
        state.consultationStatus = 'submitting';
        state.consultationMessage = null;
      })
      .addCase(submitConsultation.fulfilled, (state, action) => {
        state.consultationStatus = 'succeeded';
        state.consultationMessage = action.payload.message || 'Consultation scheduled successfully!';
      })
      .addCase(submitConsultation.rejected, (state, action) => {
        state.consultationStatus = 'failed';
        state.consultationMessage = action.error.message || 'Failed to schedule consultation.';
      });
  }
});

export const { resetConsultationStatus } = aboutSlice.actions;
export default aboutSlice.reducer;
