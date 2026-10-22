import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fallbackFindTalentData = {
  hero: {
    badge:
      'Enterprise Requisition Portal • 5-Hour Candidate Dossiers • 7-Day Fulfillment SLA',
    heading:
      'Deploy Pre-Vetted Tech Talent & High-Velocity Engineering Squads.',
    description:
      "Connect directly with ThinkWires' aggregator network of 740+ enterprise-tested recruiters and pre-screened technical benches. Scale across India, the US, and Canada with institutional speed and zero cross-border compliance risk.",
    slaCards: [
      {
        icon: 'timer',
        title: '5-Hour SLA',
        desc: 'First batch of 3 technical dossiers matched',
      },
      {
        icon: 'code_blocks',
        title: 'Live Architecture Vetted',
        desc: 'Evaluated by senior principal engineers',
      },
      {
        icon: 'security',
        title: '100% Indemnified EOR',
        desc: 'Zero legal or statutory co-employment risk',
      },
      {
        icon: 'published_with_changes',
        title: '90-Day Free Replacement',
        desc: 'Guaranteed stability with zero re-hiring cost',
      },
    ],
  },
  intakeForm: {
    tag: 'Dynamic Requisition Desk',
    title: 'Post Your Technical Requirements',
    status: 'Talent Specialists Online • Instant Dispatch Queue',
    engagementModels: [
      {
        id: 'staff_augmentation',
        title: 'Staff Augmentation',
        desc: 'Dedicated pods or embedded contract engineers',
        icon: 'group_add',
      },
      {
        id: 'permanent_staffing',
        title: 'Permanent & Exec Search',
        desc: 'Direct-hire engineering leads, architects & directors',
        icon: 'badge',
      },
      {
        id: 'eor_payroll',
        title: 'Employer of Record (EOR)',
        desc: 'Cross-border hiring with full payroll & tax indemnity',
        icon: 'public',
      },
      {
        id: 'team_reengineering',
        title: 'Project Squad Delivery',
        desc: 'End-to-end outcome-managed tech rebuild squad',
        icon: 'rocket_launch',
      },
    ],
    techTags: [
      'AWS & Kubernetes',
      'SAP HANA / ABAP',
      'GenAI & PyTorch',
      'Adobe AEM Cloud',
      'React / Node.js',
      'Teamcenter PLM',
      'Java OSGi & Spring',
      'Go / Rust Systems',
      'Terraform / SRE',
      'Snowflake & Databricks',
    ],
  },
  activeBench: [
    {
      id: 'TW-ARCH-902',
      role: 'Lead Cloud Architect',
      tech: 'AWS, GCP, Terraform',
      experience: '11+ Years • Ex-Tier 1 Systems',
      location: 'Bengaluru / Remote Global',
      rate: 'Indicative: 32 - 38 LPA',
      tags: ['Kubernetes', 'FinOps', 'Microservices'],
      statusBadge: 'Ready in 48h',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Zs3G1sn5HxRqwy9LxG_k4KO8aW0BzmClBxO3xG3TIFqJD31QWSMJRz1l9pa7yEW_Cr6QcsH3HOnFEDQmNwVyyAMPYInomSdMRJYOrZhyjxMbVaWhwTUD4uBEmS3X96W6BSel_IpjrVFCEswa0Hv5M1RkuLgSsbc3hjRCQG_6_b6VQtylaY-lJ4UCDf7nCR7jLRYBKLp1Igo5R66iICgsPkBke-PFKrfoWqkPtn59d64AqjMbeLQdZQ',
    },
    {
      id: 'TW-SAP-441',
      role: 'SAP ABAP with HANA',
      tech: 'S/4 HANA, CDS, OData',
      experience: '6+ Years Handled 3 Migrations',
      location: 'Noida / Pune / Hybrid',
      rate: 'Indicative: 14 - 18 LPA',
      tags: ['RICEF', 'CDS Views', 'AMDP'],
      statusBadge: 'Immediate Joining',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCkOo8MdEgXwruODLZZnt4vdp2fujk743Sn1QZmrFkva_p168bK0298ZVKFBRuaVBfZH9Ty3TRT5QJXoDQgYbg0qESP511XN8pQN0yibpIZDvtQJMOS9mszI5bwe6v-De7EmTS1ZH5a7NeoEPiwS7PkNGQKHEBYwaNoumMTSoPTxqs5pxacbBl26VdCWJuArwVM4ZLkDyunLdf-D-J5AT19mGXVrWK3JkmO_BRAv9dMVy0VD1fKoJ5PxA',
    },
    {
      id: 'TW-AI-118',
      role: 'Principal GenAI Lead',
      tech: 'RAG, PyTorch, LangChain',
      experience: '9+ Years • 4 LLM Enterprise Deploys',
      location: 'Hyderabad / US Overlap',
      rate: 'Indicative: 36 - 44 LPA',
      tags: ['vLLM', 'Vector DBs', 'Fine-Tuning'],
      statusBadge: 'Available in 7d',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAW2Dptbbqui0eWev6Z91SFe-WEuNxCJ0kv9bHWvltYXOeBV_4s-H2TGFLxKSH9MEuHWlgPUwlE833cMip4WHOgKNNpL_FXtlC5qKjLXb9bBGP55I6FLGw6RGowHoov62hF38QcR1yOHL-6MZdcTRAuJ_2GifMgJRPcc63oMbga08uA-ufqs4mH0Q4Ykeb-DFqTfw4p8E3d-SvEhPNIp2Kon1cj52jTf15gsX65mdGBjxYDyOvLCTDdlw',
    },
    {
      id: 'TW-AEM-655',
      role: 'Adobe AEM Full Stack',
      tech: 'AEM as Cloud, OSGi, React',
      experience: '8+ Years Multi-Brand Omnichannel',
      location: 'Chennai / Bangalore / Remote',
      rate: 'Indicative: 22 - 26 LPA',
      tags: ['Web SDK', 'HTL/Sling', 'Adobe Target'],
      statusBadge: 'Immediate Joining',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDoHAaEEHoITXETBHS02hbJnJZkrfoAYKjMiLZ9szdc9OuQLHTVd7yroGkSkbMRzZ2pa2hvKxiK1IgboRqJlztBX86HjA920UEMJPXfyNm9wTwc6CxH0BgfXca0CkJtntBzWSBECGL83yTFlHDAndKdPlXtAY9CexWTwAmiLccG1I64gp44mJckaGy71yD6qJQzpvqvrwnxUa6qSFKxSLrb0Y69GSzGqFBUeFfBns9bqOSmp18htUDIHw',
    },
  ],
  comparisonMatrix: [
    {
      metric: 'Time to First Qualified Dossiers',
      traditional: '2 – 3 Weeks (Cold InMails & Job Boards)',
      thinkwires: '< 5 Working Hours (Pre-Vetted Live Bench)',
    },
    {
      metric: 'Technical Assessment Quality',
      traditional: 'Keyword matching by non-technical HR screeners',
      thinkwires: 'Architect-led live code, system design & git verification',
    },
    {
      metric: 'Statutory & Cross-Border Compliance',
      traditional:
        'Client assumes localized tax, PF, and co-employment liability',
      thinkwires: '100% Indemnified Global EOR with payroll isolation',
    },
    {
      metric: 'Replacement Guarantee Protection',
      traditional: '30-day partial credit vouchers with lock-in clauses',
      thinkwires: '90-Day Unconditional 100% Free Replacement',
    },
    {
      metric: 'Commercial Pricing Transparency',
      traditional: 'Opaque 25% – 30% markups with upfront retainers',
      thinkwires: 'Transparent flat milestone margins & pod discounts',
    },
  ],
  verifiedMetrics: [
    {
      stat: '93%',
      label: 'User Retention',
      desc: 'Multi-year enterprise client re-engagement rate',
    },
    {
      stat: '48h',
      label: 'Interview Dispatch',
      desc: 'From mandate upload to technical round',
    },
    {
      stat: '740+',
      label: 'Recruiter Network',
      desc: 'Specialized engineering talent scouts across India',
    },
    {
      stat: '125+',
      label: 'Total Placements',
      desc: 'Enterprise scale across US, Canada and India',
    },
  ],
  testimonial: {
    quote:
      'When our core cloud payment engine required 4 Senior Distributed Systems Architects on an emergency 10-day notice, standard consultancies quoted us 4 weeks. ThinkWires dispatched 7 pre-screened technical dossiers within 6 hours. All four passed our internal architecture bar on the first interview.',
    author: 'Siddharth Nambiar',
    designation: 'VP of Engineering • Global FinTech Infrastructure Platform',
  },
  hotline: {
    title: 'Executive Direct Line',
    desc: 'Immediate workforce briefing with our Senior Managing Director:',
    phone: '+91 89205 55626',
  },
};

export const fetchFindTalentData = createAsyncThunk(
  'findTalent/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/find-talent');
      if (!response.ok) {
        throw new Error('Failed to fetch Find Talent data');
      }
      return await response.json();
    } catch (error) {
      console.warn('Using fallback Find Talent data:', error.message);
      return fallbackFindTalentData;
    }
  }
);

export const submitTalentRequisition = createAsyncThunk(
  'findTalent/submitRequisition',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/find-talent/requisition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to submit requisition');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const findTalentSlice = createSlice({
  name: 'findTalent',
  initialState: {
    data: fallbackFindTalentData,
    status: 'idle',
    error: null,
    submitStatus: 'idle',
    submitError: null,
    submitSuccess: false,
  },
  reducers: {
    resetRequisitionState: (state) => {
      state.submitStatus = 'idle';
      state.submitError = null;
      state.submitSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFindTalentData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFindTalentData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload || fallbackFindTalentData;
      })
      .addCase(fetchFindTalentData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(submitTalentRequisition.pending, (state) => {
        state.submitStatus = 'loading';
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitTalentRequisition.fulfilled, (state) => {
        state.submitStatus = 'succeeded';
        state.submitSuccess = true;
      })
      .addCase(submitTalentRequisition.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.submitError = action.payload || 'Failed to submit mandate';
      });
  },
});

export const { resetRequisitionState } = findTalentSlice.actions;
export default findTalentSlice.reducer;
