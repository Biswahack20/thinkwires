/**
 * Structured FAQ Data Source for Thinkwires Knowledge Hub
 * Migrated and categorized from https://thinkwires.com/faq
 */

export const FAQ_CATEGORIES = [
  {
    id: 'all',
    name: 'All Questions',
    description: 'Comprehensive guide to Thinkwires talent and staffing solutions',
    icon: 'apps',
  },
  {
    id: 'recruitment-transformation',
    name: 'Recruitment Transformation',
    description: 'Modernizing hiring workflows from manual to agile, tech-driven models',
    icon: 'transform',
  },
  {
    id: 'ai-recruitment',
    name: 'AI-Powered Recruitment',
    description: 'How AI accelerates screening, reduces bias, and powers predictive hiring',
    icon: 'smart_toy',
  },
  {
    id: 'it-staffing',
    name: 'IT Staffing & Recruitment',
    description: 'Industry-specific technology hiring, domain expertise, and executive track record',
    icon: 'terminal',
  },
  {
    id: 'candidate-sourcing',
    name: 'Candidate Sourcing & Evaluation',
    description: 'Technical vetting, coding assessments, and cultural alignment methodologies',
    icon: 'person_search',
  },
  {
    id: 'staffing-solutions',
    name: 'Staffing Solutions',
    description: 'Permanent placement, C2H transitions, and Employer of Record (EOR) options',
    icon: 'business_center',
  },
  {
    id: 'staff-augmentation',
    name: 'Staff Augmentation',
    description: 'Flexible technical capacity, dedicated engineering pods, and cost advantages',
    icon: 'group_add',
  },
  {
    id: 'hiring-process',
    name: 'Hiring Process & Support',
    description: 'Turnaround SLAs, interview workflows, communication, and post-placement guarantees',
    icon: 'schedule',
  },
];

export const FAQ_ITEMS = [
  // 1. Recruitment Transformation
  {
    id: 'what-is-recruitment-transformation',
    categoryId: 'recruitment-transformation',
    categoryName: 'Recruitment Transformation',
    question: 'What is recruitment transformation?',
    answer:
      'Recruitment transformation is the strategic shift from traditional, manual hiring processes to technology-driven, AI-enabled recruitment models that improve speed, accuracy, scalability, and candidate experience across modern enterprise organizations.',
    tags: ['transformation', 'automation', 'strategy', 'modernization'],
  },
  {
    id: 'why-manual-recruitment-insufficient',
    categoryId: 'recruitment-transformation',
    categoryName: 'Recruitment Transformation',
    question: 'Why is manual recruitment no longer sufficient?',
    answer:
      'Manual recruitment is time-intensive, difficult to scale, prone to unconscious bias, and heavily dependent on recruiter availability. In high-volume or competitive tech hiring environments, it significantly slows down decision-making, extends time-to-fill, and negatively impacts candidate engagement.',
    tags: ['manual hiring', 'scalability', 'efficiency', 'turnaround'],
  },
  {
    id: 'how-thinkwires-supports-transformation',
    categoryId: 'recruitment-transformation',
    categoryName: 'Recruitment Transformation',
    question: 'How can Thinkwires support recruitment transformation?',
    answer:
      'Thinkwires helps organizations transition from manual workflows to AI-driven recruitment by combining proprietary candidate aggregation tools, vetted talent benches, deep recruitment expertise, and a people-first consultative approach—ensuring faster hiring without compromising quality or ethics.',
    tags: ['support', 'bench pool', 'consulting', 'partnership'],
  },

  // 2. AI-Powered Recruitment
  {
    id: 'what-defines-ai-powered-recruitment',
    categoryId: 'ai-recruitment',
    categoryName: 'AI-Powered Recruitment',
    question: 'What defines AI-powered recruitment?',
    answer:
      'AI-powered recruitment uses technologies like machine learning, algorithmic skill assessment, predictive analytics, and workflow automation to screen resumes, match candidate proficiencies, schedule interviews, engage talent, and provide predictive hiring insights—while keeping human leaders in full control of final hiring decisions.',
    tags: ['ai', 'machine learning', 'skills match', 'automation'],
  },
  {
    id: 'how-ai-improves-hiring-speed',
    categoryId: 'ai-recruitment',
    categoryName: 'AI-Powered Recruitment',
    question: 'How does AI improve hiring speed?',
    answer:
      'AI automates repetitive, time-consuming tasks such as resume screening, candidate shortlisting, interview scheduling, and automated candidate follow-ups. By eliminating administrative bottlenecks, it reduces typical hiring cycles from several weeks to just a few business days.',
    tags: ['speed', 'time to hire', 'automation', 'productivity'],
  },
  {
    id: 'how-ai-reduces-bias-in-recruitment',
    categoryId: 'ai-recruitment',
    categoryName: 'AI-Powered Recruitment',
    question: 'How does AI reduce bias in recruitment?',
    answer:
      'AI evaluates candidates objectively based on demonstrable skills, proven experience, project history, and role-specific performance metrics rather than subjective demographic factors. When properly configured and audited, it minimizes unconscious bias inherent in manual screening processes.',
    tags: ['diversity', 'bias reduction', 'objective evaluation'],
  },
  {
    id: 'how-candidate-experience-improves-with-ai',
    categoryId: 'ai-recruitment',
    categoryName: 'AI-Powered Recruitment',
    question: 'How does candidate experience improve with AI?',
    answer:
      'AI ensures rapid 24/7 responsiveness, personalized status updates, automated scheduling without email back-and-forth, and transparent pipeline progression—delivering a respectful, modern, and engaging journey for prospective talent.',
    tags: ['candidate experience', 'engagement', 'transparency'],
  },
  {
    id: 'is-ai-recruitment-suitable-all-industries',
    categoryId: 'ai-recruitment',
    categoryName: 'AI-Powered Recruitment',
    question: 'Is AI recruitment suitable for all industries?',
    answer:
      'AI recruitment is adaptable across industries including Information Technology, Global Capability Centers (GCCs), BFSI, Healthcare & Life Sciences, Manufacturing, and Professional Services. It can be customized based on hiring volume, role complexity, and compliance requirements.',
    tags: ['industries', 'adaptability', 'compliance', 'enterprise'],
  },
  {
    id: 'ai-recruitment-strategic-workforce-planning',
    categoryId: 'ai-recruitment',
    categoryName: 'AI-Powered Recruitment',
    question: 'How does AI recruitment support strategic workforce planning?',
    answer:
      'AI provides insights into talent availability, future skill gaps, hiring trends, and workforce demand—enabling proactive and strategic talent planning rather than reactive replacement hiring.',
    tags: ['workforce planning', 'analytics', 'forecasting', 'talent mapping'],
  },

  // 3. IT Staffing & Recruitment
  {
    id: 'experience-delivering-it-staffing',
    categoryId: 'it-staffing',
    categoryName: 'IT Staffing & Recruitment',
    question: 'What experience do you have delivering IT staffing services for the IT industry?',
    answer:
      'Understanding an agency’s direct technology experience is paramount. Thinkwires’ leadership team brings over 100 combined years of direct expertise in the information technology and talent supply chain sectors. Our recruiters work closely with engineering VPs and CTOs to translate technical roadmaps into high-impact hires across India, the US, and Canada.',
    tags: ['experience', 'leadership', 'track record', 'it industry'],
  },
  {
    id: 'expertise-specific-it-roles-industries',
    categoryId: 'it-staffing',
    categoryName: 'IT Staffing & Recruitment',
    question: 'Does your IT staffing agency have expertise in specific IT roles or industries?',
    answer:
      'With vast experience in the IT staffing world, we firmly believe specialization leads to more effective placements. Thinkwires is recognized for recruiting and placing top talent across cloud architecture, AI/ML, cybersecurity, enterprise ERP (SAP/Salesforce), semiconductor design, and high-growth SaaS engineering.',
    tags: ['specialization', 'niche tech', 'roles', 'engineering'],
  },
  {
    id: 'client-references-testimonials',
    categoryId: 'it-staffing',
    categoryName: 'IT Staffing & Recruitment',
    question: 'Can you share client references or testimonials?',
    answer:
      'Client testimonials offer meaningful insight into our execution reliability and partnership strength. Software leaders consistently highlight our technical precision; one long-term enterprise client noted: "With few exceptions, the majority of our top engineering and data talent was hired through Thinkwires. They have a deep understanding of modern engineering and operate with complete integrity—truly a first-rate partner."',
    tags: ['references', 'testimonials', 'reputation', 'integrity'],
  },

  // 4. Candidate Sourcing & Evaluation
  {
    id: 'how-do-you-source-and-vet-candidates',
    categoryId: 'candidate-sourcing',
    categoryName: 'Candidate Sourcing & Evaluation',
    question: 'How do you source and vet candidates?',
    answer:
      'A thorough sourcing and vetting process is done from our recruiting agency to ensure quality candidates. Thinkwires’ Ten-Step Process for Technology Staffing organizes and streamlines open position requirements, candidate search, interview process, offer, negotiations, and acceptance—creating a seamless method for identifying top-tier talent.',
    tags: ['sourcing', 'vetting', 'ten-step process', 'quality'],
  },
  {
    id: 'evaluating-technical-expertise-cultural-fit',
    categoryId: 'candidate-sourcing',
    categoryName: 'Candidate Sourcing & Evaluation',
    question: 'How do you evaluate a candidate’s technical expertise and alignment with company culture?',
    answer:
      'We conduct domain-specific technical screenings, code evaluations, and problem-solving reviews led by senior engineering advisors. Cultural alignment is evaluated using structured behavioral interviews assessing collaboration, communication, accountability, and adaptability to distributed team environments.',
    tags: ['technical screening', 'cultural fit', 'coding assessments', 'interviews'],
  },
  {
    id: 'fees-commission-deductions-candidates',
    categoryId: 'candidate-sourcing',
    categoryName: 'Candidate Sourcing & Evaluation',
    question: 'Does Thinkwires deduct any commission or placement fees from candidate salaries?',
    answer:
      'No, our services are 100% free for candidates. All recruitment, technical vetting, and placement advisory costs are funded entirely by enterprise client partners.',
    tags: ['candidate fee', 'free for candidates', 'zero deductions', 'compensation'],
  },

  // 5. Staffing Solutions
  {
    id: 'types-of-it-staffing-solutions-offered',
    categoryId: 'staffing-solutions',
    categoryName: 'Staffing Solutions',
    question: 'What types of IT staffing solutions do you offer?',
    answer:
      'Understanding the full range of staffing solutions an agency offers is essential when choosing a partner. Thinkwires provides comprehensive flexible workforce options including Contract Staffing, Permanent/Direct Hire, Contract-to-Hire (C2H), IT Staff Augmentation, and global Employer of Record (EOR) services.',
    tags: ['solutions', 'contract', 'permanent', 'c2h', 'eor'],
  },
  {
    id: 'transition-contract-c2h-to-fulltime',
    categoryId: 'staffing-solutions',
    categoryName: 'Staffing Solutions',
    question: 'Can a candidate transition from a contract or C2H role to a full-time position?',
    answer:
      'Yes! Over 80% of our contract and Contract-to-Hire (C2H) placements convert to permanent full-time employment within 6 to 12 months based on mutual performance evaluations and organizational fit.',
    tags: ['contract to hire', 'full time conversion', 'career progression'],
  },
  {
    id: 'cross-border-payments-remote-eor',
    categoryId: 'staffing-solutions',
    categoryName: 'Staffing Solutions',
    question: 'How does Thinkwires handle cross-border payments and compliance for remote roles?',
    answer:
      'We manage end-to-end Employer of Record (EOR) operations, handling multi-currency salary disbursements, local tax compliance, health insurance, and statutory benefits with zero administrative friction for clients.',
    tags: ['cross border', 'eor', 'compliance', 'payroll', 'global talent'],
  },

  // 6. Staff Augmentation
  {
    id: 'how-staff-augmentation-works-vs-outsourcing',
    categoryId: 'staff-augmentation',
    categoryName: 'Staff Augmentation',
    question: 'How does IT staff augmentation work, and how does it compare to traditional outsourcing?',
    answer:
      'In a traditional outsourcing setup, an external vendor manages the entire project from planning to final delivery. With IT staff augmentation, you add skilled temporary professionals directly to your existing team while keeping full control over the project, architecture, and execution.',
    tags: ['staff augmentation', 'outsourcing', 'control', 'flexibility'],
  },
  {
    id: 'benefits-of-it-staff-augmentation',
    categoryId: 'staff-augmentation',
    categoryName: 'Staff Augmentation',
    question: 'What are the primary benefits of IT staff augmentation for businesses?',
    answer:
      'Staff augmentation provides a simple and cost-effective way to scale your team based on project needs. You select skilled and experienced professionals and integrate them into your development team. These resources work remotely, follow your engineering processes, and help ensure timely project delivery without the overhead of permanent in-house hiring.',
    tags: ['benefits', 'scalability', 'cost savings', 'productivity'],
  },
  {
    id: 'types-of-positions-filled-staff-augmentation',
    categoryId: 'staff-augmentation',
    categoryName: 'Staff Augmentation',
    question: 'What types of IT positions can be filled through staff augmentation?',
    answer:
      'A wide range of IT roles can be efficiently filled through staff augmentation, including Web & Full-Stack Developers, Mobile App Engineers, Cloud & DevOps Specialists, Data Scientists, QA Automation Engineers, UI/UX Designers, and Enterprise Solutions Architects.',
    tags: ['positions', 'engineering roles', 'developers', 'cloud'],
  },
  {
    id: 'choosing-it-staff-augmentation-provider',
    categoryId: 'staff-augmentation',
    categoryName: 'Staff Augmentation',
    question: 'What key factors should be considered when choosing an IT staff augmentation provider?',
    answer:
      'When evaluating an IT staff augmentation provider, consider the team’s technical expertise, proven track record, client testimonials, communication approach, and transparent pricing structure. It is also essential to verify data security and intellectual property protection policies.',
    tags: ['evaluation', 'selection criteria', 'ip security', 'transparency'],
  },
  {
    id: 'staff-augmentation-short-term-project-needs',
    categoryId: 'staff-augmentation',
    categoryName: 'Staff Augmentation',
    question: 'Is staff augmentation suitable for short-term or project-specific needs?',
    answer:
      'Yes. IT staff augmentation gives organizations high flexibility for workforce planning. Businesses can engage dedicated specialists for short-term initiatives, seasonal sprints, or extend them for long-term roadmaps as project needs evolve.',
    tags: ['short term', 'flexibility', 'sprints', 'workforce planning'],
  },
  {
    id: 'minimize-recruitment-onboarding-expenses',
    categoryId: 'staff-augmentation',
    categoryName: 'Staff Augmentation',
    question: 'How can IT staff augmentation minimize recruitment and onboarding expenses?',
    answer:
      'By adding remote resources through staff augmentation, businesses significantly reduce costs associated with sourcing, interviewing, hiring, and employee training. Organizations avoid infrastructure, office space, and compliance overhead, allowing saved funds to be reallocated toward core business growth.',
    tags: ['cost reduction', 'budget optimization', 'overhead savings'],
  },

  // 7. Hiring Process & Support
  {
    id: 'typical-time-to-fill-it-positions',
    categoryId: 'hiring-process',
    categoryName: 'Hiring Process & Support',
    question: 'What is your typical time-to-fill for IT positions?',
    answer:
      'For pre-screened bench talent and staff augmentation roles, qualified profiles are delivered within 24 to 72 hours. For direct-hire permanent roles, positions can often be shortlisted within 5 to 10 business days and fully closed within 30 days.',
    tags: ['time to fill', 'sla', 'turnaround', 'hiring timeline'],
  },
  {
    id: 'keeping-clients-updated-during-hiring',
    categoryId: 'hiring-process',
    categoryName: 'Hiring Process & Support',
    question: 'How will you keep us updated throughout the hiring process?',
    answer:
      'Open and consistent communication plays a vital role in ensuring a seamless hiring experience. Thinkwires provides regular candidate progress reports, pipeline status calls, and hands-on executive involvement throughout every active talent search.',
    tags: ['communication', 'updates', 'transparency', 'account manager'],
  },
  {
    id: 'post-placement-support-guarantee',
    categoryId: 'hiring-process',
    categoryName: 'Hiring Process & Support',
    question: 'What post-placement support do you provide?',
    answer:
      'While we consistently aim to place top-tier candidates, we understand unexpected performance variances can occur. If a placement does not work out during the initial engagement window, Thinkwires provides a reliable, no-cost candidate replacement guarantee.',
    tags: ['guarantee', 'replacement', 'post placement', 'support'],
  },
  {
    id: 'turnaround-time-application-to-interview',
    categoryId: 'hiring-process',
    categoryName: 'Hiring Process & Support',
    question: 'What is the average turnaround time between applying and client interviews?',
    answer:
      'Our talent acquisition directors review incoming candidate profiles within 24 to 48 hours. Pre-screened candidates typically receive direct interview routing with client VPs of Engineering within 3 to 5 business days.',
    tags: ['candidate turnaround', 'interviews', 'application process'],
  },
];

/**
 * Filter FAQs by Category ID and search query string
 */
export const filterFaqs = (items = FAQ_ITEMS, categoryId = 'all', searchQuery = '') => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCategory = categoryId === 'all' || item.categoryId === categoryId;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const inQuestion = item.question.toLowerCase().includes(normalizedQuery);
    const inAnswer = item.answer.toLowerCase().includes(normalizedQuery);
    const inTags = item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
    const inCat = item.categoryName.toLowerCase().includes(normalizedQuery);

    return inQuestion || inAnswer || inTags || inCat;
  });
};

/**
 * Get count of questions in each category
 */
export const getCategoryCounts = (items = FAQ_ITEMS) => {
  const counts = { all: items.length };
  items.forEach((item) => {
    counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
  });
  return counts;
};

