import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path since this is now in src/routes
const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'seeds', 'mockData.json'), 'utf8'));
const {
  initialTechStack,
  initialOpenings,
  industriesData,
  processData,
  capabilitiesData,
  reportsData,
  statsData,
  benefitsData,
  faqsData,
  articlesData = [],
  featuredArticleData = null,
  researchersData = [],
  industriesPageData = null,
  benchData = null,
  payrollData = null,
  eorData = null,
  staffAugmentationData = null,
  permanentStaffingData = null,
  findTalentData = null,
  candidatePortalData = null,
} = mockData;

let currentPayrollData = payrollData ? { ...payrollData } : null;
let currentEorData = eorData ? { ...eorData } : null;
let currentStaffAugmentationData = staffAugmentationData ? { ...staffAugmentationData } : null;
let currentPermanentStaffingData = permanentStaffingData ? { ...permanentStaffingData } : null;
let currentFindTalentData = findTalentData ? { ...findTalentData } : null;
let currentCandidatePortalData = candidatePortalData ? { ...candidatePortalData } : null;

const router = express.Router();

// Mutable in-memory state for mock admin updates
let techStack = [...initialTechStack];
let openings = [...initialOpenings];
let stats = { ...statsData };
let industries = [...industriesData];
let processSteps = [...processData];
let capabilities = [...capabilitiesData];
let reports = [...reportsData];
let benefits = benefitsData ? [...benefitsData] : [];
let faqs = faqsData ? [...faqsData] : [];
let articles = articlesData ? [...articlesData] : [];
let featuredArticle = featuredArticleData ? { ...featuredArticleData } : null;
let researchers = researchersData ? [...researchersData] : [];
let bench = benchData ? { ...benchData } : {
  statsBadges: [],
  specialtyFilters: [],
  talents: [],
  dossierFeatures: [],
  vettingGates: []
};

// --- Benefits ---
router.get('/benefits', (req, res) => {
  res.json(benefits);
});

// --- FAQs ---
router.get('/faqs', (req, res) => {
  res.json(faqs);
});

// --- Tech Stack ---
router.get('/tech-stack', (req, res) => {
  res.json(techStack);
});
router.post('/tech-stack', (req, res) => {
  if (Array.isArray(req.body.newStacks)) {
    techStack = req.body.newStacks;
    res.json({ message: 'Tech stack updated successfully', techStack });
  } else {
    res.status(400).json({ error: 'newStacks must be an array of strings' });
  }
});

// --- Openings ---
router.get('/openings', (req, res) => {
  const { q, location, experience, workMode, department, sort } = req.query;
  let filtered = [...openings];

  // Search keyword (q)
  if (q && q.trim() !== '') {
    const search = q.trim().toLowerCase();
    filtered = filtered.filter((job) => {
      const matchTitle = job.title && job.title.toLowerCase().includes(search);
      const matchCompany = job.company && job.company.toLowerCase().includes(search);
      const matchCategory = job.category && job.category.toLowerCase().includes(search);
      const matchDesc = job.description && job.description.toLowerCase().includes(search);
      const matchSkills = job.skills && job.skills.some((s) => s.toLowerCase().includes(search));
      return matchTitle || matchCompany || matchCategory || matchDesc || matchSkills;
    });
  }

  // Location filter
  if (location && location !== 'All') {
    const loc = location.toLowerCase();
    filtered = filtered.filter((job) => {
      if (!job.location) return false;
      if (loc === 'remote') return job.location.toLowerCase().includes('remote') || job.workMode === 'Remote';
      return job.location.toLowerCase().includes(loc);
    });
  }

  // Experience filter
  if (experience && experience !== 'All') {
    filtered = filtered.filter((job) => {
      if (job.experienceTier && job.experienceTier === experience) return true;
      if (job.experience && job.experience.toLowerCase().includes(experience.toLowerCase())) return true;
      return false;
    });
  }

  // Work Mode filter
  if (workMode && workMode !== 'All Modes') {
    filtered = filtered.filter((job) => job.workMode === workMode || (job.location && job.location.toLowerCase().includes(workMode.toLowerCase())));
  }

  // Department / Category filter
  if (department && department !== 'All Roles' && department !== 'All') {
    filtered = filtered.filter((job) => job.department === department || (job.category && job.category.toLowerCase().includes(department.toLowerCase())));
  }

  // Sort
  if (sort === 'Title A-Z') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'Highest Salary') {
    filtered.sort((a, b) => b.salary.localeCompare(a.salary));
  } else {
    // Default priority/newest sort
    filtered.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(b.postedDate) - new Date(a.postedDate);
    });
  }

  res.json(filtered);
});
router.post('/openings', (req, res) => {
  if (Array.isArray(req.body.openings)) {
    openings = req.body.openings;
    res.json({ message: 'Openings updated successfully', openings });
  } else {
    res.status(400).json({ error: 'openings must be an array of objects' });
  }
});

// --- Stats ---
router.get('/stats', (req, res) => {
  res.json(stats);
});
router.post('/stats', (req, res) => {
  if (req.body.stats) {
    stats = { ...stats, ...req.body.stats };
    res.json({ message: 'Stats updated successfully', stats });
  } else {
    res.status(400).json({ error: 'stats object is required in body' });
  }
});

// --- Industries (Home summary) ---
router.get('/industries', (req, res) => {
  res.json(industries);
});
router.post('/industries', (req, res) => {
  if (Array.isArray(req.body.industries)) {
    industries = req.body.industries;
    res.json({ message: 'Industries updated successfully', industries });
  } else {
    res.status(400).json({ error: 'industries must be an array of objects' });
  }
});

// --- Industries Page Full Dynamic Data (Hero, Sector Tabs, Sectors, Comparison, Case Studies, Briefing) ---
let currentIndustriesPageData = industriesPageData ? { ...industriesPageData } : {};

router.get('/industries-page', (req, res) => {
  res.json(currentIndustriesPageData);
});

router.get('/sector-catalog', (req, res) => {
  res.json(currentIndustriesPageData.sectors || []);
});

router.post('/industries-page', (req, res) => {
  if (req.body.industriesPageData) {
    currentIndustriesPageData = { ...currentIndustriesPageData, ...req.body.industriesPageData };
    res.json({ message: 'Industries page data updated successfully', industriesPageData: currentIndustriesPageData });
  } else {
    res.status(400).json({ error: 'industriesPageData object is required in body' });
  }
});

// --- Process ---
router.get('/process', (req, res) => {
  res.json(processSteps);
});
router.post('/process', (req, res) => {
  if (Array.isArray(req.body.processSteps)) {
    processSteps = req.body.processSteps;
    res.json({ message: 'Process steps updated successfully', processSteps });
  } else {
    res.status(400).json({ error: 'processSteps must be an array of objects' });
  }
});

// --- Capabilities ---
router.get('/capabilities', (req, res) => {
  res.json(capabilities);
});
router.post('/capabilities', (req, res) => {
  if (Array.isArray(req.body.capabilities)) {
    capabilities = req.body.capabilities;
    res.json({ message: 'Capabilities updated successfully', capabilities });
  } else {
    res.status(400).json({ error: 'capabilities must be an array of objects' });
  }
});

// --- Reports ---
router.get('/reports', (req, res) => {
  res.json(reports);
});
router.post('/reports', (req, res) => {
  if (Array.isArray(req.body.reports)) {
    reports = req.body.reports;
    res.json({ message: 'Reports updated successfully', reports });
  } else {
    res.status(400).json({ error: 'reports must be an array of objects' });
  }
});

// --- Old Contact Form (kept for backward compat) ---
router.post('/contact', (req, res) => {
  const { email, phone } = req.body;
  if (email && phone) {
    console.log('New Contact Request:', { email, phone });
    res.json({ message: 'Callback requested successfully!' });
  } else {
    res.status(400).json({ error: 'Email and Phone are required' });
  }
});

// --- About Page Data ---
const aboutData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'seeds', 'aboutData.json'), 'utf8'));

router.get('/about', (req, res) => {
  res.json(aboutData);
});

router.post('/about/consultation', (req, res) => {
  const { fullName, workEmail, phone, primaryNeed, techRoles } = req.body;
  if (!fullName || !workEmail) {
    return res.status(400).json({ error: 'Full name and work email are required' });
  }
  console.log('New About Page Talent Consultation Request:', { fullName, workEmail, phone, primaryNeed, techRoles });
  res.json({
    success: true,
    message: 'Your talent strategy consultation request has been received. Our team will contact you within 5 hours.'
  });
});

// --- Blog & Articles ---
router.get('/articles', (req, res) => {
  const { q, category } = req.query;
  let filtered = [...articles];

  if (q && q.trim() !== '') {
    const query = q.trim().toLowerCase();
    filtered = filtered.filter(
      (art) =>
        art.title.toLowerCase().includes(query) ||
        art.excerpt.toLowerCase().includes(query) ||
        (art.author && art.author.name.toLowerCase().includes(query)) ||
        (art.badge && art.badge.toLowerCase().includes(query)) ||
        (art.subCategory && art.subCategory.toLowerCase().includes(query))
    );
  }

  if (category && category !== 'All' && category !== 'All Insights (15)') {
    filtered = filtered.filter(
      (art) =>
        art.category === category ||
        art.badge === category ||
        art.subCategory === category
    );
  }

  res.json(filtered);
});

router.get('/articles/featured', (req, res) => {
  res.json(featuredArticle);
});

router.get('/articles/researchers', (req, res) => {
  res.json(researchers);
});

router.get('/articles/:id', (req, res) => {
  const article = articles.find((art) => art.id === req.params.id);
  if (article) {
    res.json(article);
  } else if (featuredArticle && featuredArticle.id === req.params.id) {
    res.json(featuredArticle);
  } else {
    res.status(404).json({ error: 'Article not found' });
  }
});

router.post('/articles/newsletter', (req, res) => {
  const { email, role } = req.body;
  if (email && email.includes('@')) {
    console.log('New Benchmark Dispatch Newsletter Subscription:', { email, role });
    res.json({ success: true, message: 'Subscribed to Benchmark Dispatch successfully!' });
  } else {
    res.status(400).json({ error: 'Valid email is required' });
  }
});

// --- Contact Page Data ---
const contactData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'seeds', 'contactData.json'), 'utf8'));

// In-memory mutable contact page config (allows admin to update office/channel info)
let contactPageData = { ...contactData };

router.get('/contact', (req, res) => {
  res.json(contactPageData);
});

// Update office locations dynamically
router.post('/contact/offices', (req, res) => {
  if (Array.isArray(req.body.officeLocations)) {
    contactPageData.officeLocations = req.body.officeLocations;
    res.json({ message: 'Office locations updated successfully', officeLocations: contactPageData.officeLocations });
  } else {
    res.status(400).json({ error: 'officeLocations must be an array of objects' });
  }
});

// Update contact channels dynamically
router.post('/contact/channels', (req, res) => {
  if (Array.isArray(req.body.channels)) {
    contactPageData.channels = req.body.channels;
    res.json({ message: 'Contact channels updated successfully', channels: contactPageData.channels });
  } else {
    res.status(400).json({ error: 'channels must be an array of objects' });
  }
});

// Update FAQ dynamically
router.post('/contact/faq', (req, res) => {
  if (Array.isArray(req.body.faq)) {
    contactPageData.faq = req.body.faq;
    res.json({ message: 'FAQ updated successfully', faq: contactPageData.faq });
  } else {
    res.status(400).json({ error: 'faq must be an array of objects' });
  }
});

// Handle contact form submission
router.post('/contact/message', (req, res) => {
  const { fullName, workEmail, inquiryType } = req.body;
  if (!fullName || !workEmail || !inquiryType) {
    return res.status(400).json({ error: 'Full name, work email, and inquiry type are required' });
  }
  console.log('📨 New Contact Us Submission:', req.body);
  res.json({
    success: true,
    message: 'Thank you for reaching out! A ThinkWires staffing director will respond within 5 business hours.'
  });
});

// --- Bench / Talent Cloud Endpoints ---
router.get('/bench', (req, res) => {
  const rawCandidates = bench.candidates || bench.talents || [];
  const normalizedTalents = rawCandidates.map((c) => ({
    id: c.id,
    code: c.id || c.code,
    role: c.title || c.role,
    title: c.title || c.role,
    initials: c.initials || 'TW',
    specialty: c.specialty === 'genai' ? 'GenAI & LLMs' :
               c.specialty === 'cloud' ? 'Cloud & DevOps' :
               c.specialty === 'sap' ? 'SAP & Enterprise' :
               c.specialty === 'systems' ? 'Systems & Distributed' :
               c.specialty === 'data' ? 'Data & Analytics' : (c.specialty || 'Engineering'),
    experienceLevel: c.seniorityTier === 'staff' ? 'Staff/Principal (10+y)' :
                     c.seniorityTier === 'senior' ? 'Senior (6-9y)' : 'Lead (8+y)',
    yearsExp: c.experience || `${c.years || 8}+ Yrs Exp`,
    location: c.location || 'Remote Global',
    score: c.technicalRating || c.score || 96,
    urgency: c.availability || c.urgency || 'Immediate (24-48h)',
    hourlyRate: c.hourlyRate || '$55 - $75',
    proofQuote: c.engineeringProof || c.proofQuote || 'Architected and scaled production enterprise systems with zero downtime.',
    skills: c.skills || [],
    rubric: c.dossier?.rubric ? {
      systemDesign: parseInt(c.dossier.rubric.systemDesign) || 98,
      codeQuality: parseInt(c.dossier.rubric.cleanCode) || 97,
      liveDebugging: 99,
      communication: 96
    } : (c.rubric || { systemDesign: 98, codeQuality: 97, liveDebugging: 99, communication: 96 }),
    bio: c.dossier?.evaluatorNotes || c.bio,
    dossier: c.dossier
  }));

  const specialtyFilters = [
    { label: 'All Engineering', count: 142 },
    { label: 'GenAI & LLMs', count: 38 },
    { label: 'Cloud & DevOps', count: 31 },
    { label: 'SAP & Enterprise', count: 24 },
    { label: 'Systems & Distributed', count: 27 },
    { label: 'Data & Analytics', count: 22 }
  ];

  const filterOptions = {
    urgency: ['All Urgency', 'Immediate (24-48h)', 'Ready in 24h', 'Immediate Availability', 'Immediate Joining', 'Available in 48h', 'Available in 7 Days'],
    experience: ['All Experience', 'Staff/Principal (10+y)', 'Senior (6-9y)', 'Lead (8+y)'],
    locations: ['All Locations', 'Bengaluru (EST Overlap)', 'Hyderabad / Remote Global', 'Pune / Noida / Hybrid', 'Chennai / Remote', 'Pan-India (Full US Shift)', 'Gurugram / Remote'],
    sortOptions: ['Highest Score', 'Fastest Availability', 'Lowest Rate']
  };

  const responsePayload = {
    ...bench,
    hero: bench.hero || {
      liveBadge: "142 PRE-VETTED TALENTS ON ACTIVE BENCH",
      title: "Engineers on the Bench. Available to Deploy in 48 Hours.",
      subtitle: "Bypass the 60-day hiring cycle. Access active ThinkWires senior contractors, fully vetted with verified code commits, system design scores, and instant contract execution.",
      slaCard: {
        tag: "48-HOUR SLA ASSURANCE",
        title: "Instant Pod Matching & Zero-Friction EOR Onboarding",
        description: "Every engineer has cleared multi-stage system architecture audits and is cleared for immediate client sprints."
      }
    },
    specialtyFilters,
    filterOptions,
    talents: normalizedTalents,
    candidates: rawCandidates,
    dossierFeatures: bench.dossierFeatures?.map((f, i) => ({
      step: `0${i + 1}`,
      icon: f.icon === 'code_blocks' ? 'terminal' :
            f.icon === 'architecture' ? 'rule' :
            f.icon === 'play_circle' ? 'videocam' : 'verified',
      title: f.title,
      description: f.description,
      highlight: f.tag || 'Verified Assessment'
    })) || [],
    vettingGates: bench.vettingGates?.map((g) => ({
      gateNumber: `GATE ${g.step}`,
      title: g.title,
      passRate: g.stat || 'Pass Rate Calibrated',
      details: [
        g.description,
        g.badge
      ],
      badge: g.badge
    })) || [],
    requisitionCta: bench.requisitionCTA ? {
      tag: bench.requisitionCTA.eyebrow,
      title: bench.requisitionCTA.title,
      description: bench.requisitionCTA.description,
      primaryBtn: { text: bench.requisitionCTA.ctaLabel, link: '/contact' },
      secondaryBtn: { text: 'Speak with a Director', link: '/contact' }
    } : null
  };

  res.json(responsePayload);
});

router.get('/bench/talents', (req, res) => {
  const { q, specialty, urgency, experience, location, sort } = req.query;
  let filtered = [...(bench.talents || [])];

  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.role.toLowerCase().includes(query) ||
        t.code.toLowerCase().includes(query) ||
        t.skills.some((s) => s.toLowerCase().includes(query)) ||
        t.proofQuote.toLowerCase().includes(query)
    );
  }

  if (specialty && specialty !== 'All' && specialty !== 'All Engineering') {
    filtered = filtered.filter((t) => t.specialty === specialty);
  }

  if (urgency && urgency !== 'All Urgency' && urgency !== 'All') {
    filtered = filtered.filter((t) => t.urgency === urgency);
  }

  if (experience && experience !== 'All Experience' && experience !== 'All') {
    filtered = filtered.filter((t) => t.experienceLevel === experience);
  }

  if (location && location !== 'All Locations' && location !== 'All') {
    filtered = filtered.filter((t) => t.location === location);
  }

  if (sort === 'Highest Score') {
    filtered.sort((a, b) => b.score - a.score);
  } else if (sort === 'Fastest Availability') {
    const urgencyOrder = { 'Immediate (24-48h)': 1, 'Within 1 Week': 2, 'Within 2 Weeks': 3 };
    filtered.sort((a, b) => (urgencyOrder[a.urgency] || 99) - (urgencyOrder[b.urgency] || 99));
  } else if (sort === 'Lowest Rate') {
    filtered.sort((a, b) => {
      const rateA = parseInt(a.hourlyRate.replace(/[^0-9]/g, '')) || 0;
      const rateB = parseInt(b.hourlyRate.replace(/[^0-9]/g, '')) || 0;
      return rateA - rateB;
    });
  }

  res.json(filtered);
});

router.get('/bench/talents/:id', (req, res) => {
  const talent = (bench.talents || []).find((t) => t.id === req.params.id || t.code === req.params.id);
  if (talent) {
    res.json(talent);
  } else {
    res.status(404).json({ error: 'Talent not found' });
  }
});

router.post('/bench/book-interview', (req, res) => {
  const { talentId, talentCode, workEmail, companyName, hiringManager, timeSlot } = req.body;
  if (!talentCode || !workEmail) {
    return res.status(400).json({ error: 'Talent code and work email are required' });
  }
  console.log('⚡ Bench Interview Booked:', { talentId, talentCode, workEmail, companyName, hiringManager, timeSlot });
  res.json({
    success: true,
    message: `Interview request confirmed for ${talentCode}. Calendar invites sent to ${workEmail}.`,
    bookingRef: `TW-${Date.now().toString(36).toUpperCase()}`
  });
});

// --- Payroll Outsourcing Endpoints ---
router.get('/payroll', (req, res) => {
  res.json(currentPayrollData);
});

router.post('/payroll', (req, res) => {
  if (req.body.payrollData) {
    currentPayrollData = { ...currentPayrollData, ...req.body.payrollData };
    res.json({ message: 'Payroll data updated successfully', payrollData: currentPayrollData });
  } else {
    res.status(400).json({ error: 'payrollData object is required in body' });
  }
});

router.post('/payroll/consultation', (req, res) => {
  const { companyName, fullName, employeeSize, serviceReq, phoneNumber, emailAddress } = req.body;
  if (!companyName || !fullName || !emailAddress) {
    return res.status(400).json({ error: 'Company name, full name, and email are required.' });
  }
  console.log('📋 New Payroll Outsourcing Consultation Request:', { companyName, fullName, employeeSize, serviceReq, phoneNumber, emailAddress });
  res.json({
    success: true,
    message: 'Thank you! Your payroll consultation request has been queued. Our compliance lead will call within 120 minutes.'
  });
});

// --- Employer of Record (EOR) Endpoints ---
router.get('/eor', (req, res) => {
  res.json(currentEorData);
});

router.post('/eor', (req, res) => {
  if (req.body.eorData) {
    currentEorData = { ...currentEorData, ...req.body.eorData };
    res.json({ message: 'EOR data updated successfully', eorData: currentEorData });
  } else {
    res.status(400).json({ error: 'eorData object is required in body' });
  }
});

router.post('/eor/consultation', (req, res) => {
  const { fullName, workEmail, companyName, targetGeo, headcount, projectDetails } = req.body;
  if (!fullName || !workEmail || !companyName) {
    return res.status(400).json({ error: 'Full name, work email, and company name are required.' });
  }
  console.log('🌐 New EOR Consultation Request:', { fullName, workEmail, companyName, targetGeo, headcount, projectDetails });
  res.json({
    success: true,
    message: 'Thank you! Your EOR workforce consultation request has been received. Our Global Compliance Specialist will reach out within 4 hours.'
  });
});

// --- Staff Augmentation Endpoints ---
router.get('/staff-augmentation', (req, res) => {
  res.json(currentStaffAugmentationData);
});

router.post('/staff-augmentation', (req, res) => {
  if (req.body.staffAugmentationData) {
    currentStaffAugmentationData = { ...currentStaffAugmentationData, ...req.body.staffAugmentationData };
    res.json({ message: 'Staff augmentation data updated successfully', staffAugmentationData: currentStaffAugmentationData });
  } else {
    res.status(400).json({ error: 'staffAugmentationData object is required in body' });
  }
});

router.post('/staff-augmentation/consultation', (req, res) => {
  const { name, email, phone, company, roleNeeded, preferredTime, details } = req.body;
  if (!name || !email || !company) {
    return res.status(400).json({ error: 'Name, email, and company name are required.' });
  }
  console.log('🚀 New Staff Augmentation Workforce Strategy Request:', { name, email, phone, company, roleNeeded, preferredTime, details });
  res.json({
    success: true,
    message: 'Thank you! Your workforce consultation request has been received. A Senior Talent Architect will reach out within 5 hours.'
  });
});

// --- Permanent Staffing & Executive Search Endpoints ---
router.get('/permanent-staffing', (req, res) => {
  res.json(currentPermanentStaffingData);
});

router.get('/executive-search', (req, res) => {
  res.json(currentPermanentStaffingData);
});

router.post('/permanent-staffing', (req, res) => {
  if (req.body.permanentStaffingData) {
    currentPermanentStaffingData = { ...currentPermanentStaffingData, ...req.body.permanentStaffingData };
    res.json({ message: 'Permanent staffing data updated successfully', permanentStaffingData: currentPermanentStaffingData });
  } else {
    res.status(400).json({ error: 'permanentStaffingData object is required in body' });
  }
});

router.post('/permanent-staffing/consultation', (req, res) => {
  const { fullName, workEmail, companyName, directPhone, mandateHierarchy, targetTimeline, mandateScope, isConfidential } = req.body;
  if (!fullName || !workEmail || !companyName) {
    return res.status(400).json({ error: 'Full name, work email, and company name are required.' });
  }
  console.log('🏛️ New Executive Search Mandate Request:', { fullName, workEmail, companyName, directPhone, mandateHierarchy, targetTimeline, mandateScope, isConfidential });
  res.json({
    success: true,
    message: 'Thank you! Your confidential executive search mandate has been registered. A Managing Partner will connect within 2 hours.'
  });
});

router.post('/executive-search/consultation', (req, res) => {
  const { fullName, workEmail, companyName, directPhone, mandateHierarchy, targetTimeline, mandateScope, isConfidential } = req.body;
  if (!fullName || !workEmail || !companyName) {
    return res.status(400).json({ error: 'Full name, work email, and company name are required.' });
  }
  console.log('🏛️ New Executive Search Mandate Request:', { fullName, workEmail, companyName, directPhone, mandateHierarchy, targetTimeline, mandateScope, isConfidential });
  res.json({
    success: true,
    message: 'Thank you! Your confidential executive search mandate has been registered. A Managing Partner will connect within 2 hours.'
  });
});

// --- Find Talent & Enterprise Requisition Endpoints ---
router.get('/find-talent', (req, res) => {
  res.json(currentFindTalentData);
});

router.post('/find-talent/requisition', (req, res) => {
  const {
    engagementModel,
    targetRole,
    headcount,
    seniority,
    techStack,
    deploymentUrgency,
    workArrangement,
    budgetEnvelope,
    fullName,
    corporateEmail,
    company,
    phone,
    jobDescription
  } = req.body;

  if (!fullName || !corporateEmail || !company || !targetRole) {
    return res.status(400).json({ error: 'Full name, corporate email, company, and target role are required.' });
  }

  console.log('⚡ New Enterprise Talent Requisition Logged:', {
    engagementModel,
    targetRole,
    headcount,
    seniority,
    techStack,
    deploymentUrgency,
    workArrangement,
    budgetEnvelope,
    fullName,
    corporateEmail,
    company,
    phone,
    jobDescription
  });

  res.json({
    success: true,
    message: 'Requisition logged with Enterprise Queue. 3 candidate dossiers will be delivered within 5 hours.'
  });
});

// --- Candidate Portal Endpoints ---
router.get('/candidate-portal', (req, res) => {
  res.json(currentCandidatePortalData);
});

router.post('/candidate-portal/timesheet', (req, res) => {
  const { hours, weekEnding, comments } = req.body;
  console.log('⏱️ Candidate Weekly Timesheet Submitted:', { hours, weekEnding, comments });
  res.json({
    success: true,
    message: 'Weekly timesheet submitted successfully and forwarded to client approval desk.'
  });
});

export default router;

