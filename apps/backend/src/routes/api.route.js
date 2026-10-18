import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import JobRequirement from '../models/job.mongo.model.js';
import Article from '../models/article.mongo.model.js';
import Page from '../models/page.mongo.model.js';
import TechStack from '../models/techStack.mongo.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isMongoActive = () => mongoose.connection.readyState === 1;

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
  aboutData = null,
  contactData = null,
} = mockData;

let currentPayrollData = payrollData ? { ...payrollData } : null;
let currentEorData = eorData ? { ...eorData } : null;
let currentStaffAugmentationData = staffAugmentationData ? { ...staffAugmentationData } : null;
let currentPermanentStaffingData = permanentStaffingData ? { ...permanentStaffingData } : null;
let currentFindTalentData = findTalentData ? { ...findTalentData } : null;
let currentCandidatePortalData = candidatePortalData ? { ...candidatePortalData } : null;

const router = express.Router();

// Mutable in-memory state for fallback & instant local responses
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

// --- Helper to get home page section from Mongo or fallback ---
const getHomeSection = async (sectionKey, fallbackValue) => {
  if (isMongoActive()) {
    try {
      const homePage = await Page.findOne({ slug: 'home' }).lean();
      if (homePage?.data && homePage.data[sectionKey] !== undefined) {
        return homePage.data[sectionKey];
      }
    } catch (err) {
      console.warn(`Error reading home section '${sectionKey}' from MongoDB:`, err.message);
    }
  }
  return fallbackValue;
};

// --- Public CMS Pages API ---
router.get('/pages', async (req, res) => {
  if (isMongoActive()) {
    try {
      const dbPages = await Page.find({ status: 'published' }).select('-__v').sort({ title: 1 }).lean();
      if (dbPages.length > 0) return res.json(dbPages);
    } catch (err) {
      console.warn('Error reading pages from MongoDB:', err.message);
    }
  }
  res.json([]);
});

router.get('/pages/:slug', async (req, res) => {
  const { slug } = req.params;
  const cleanSlug = slug.toLowerCase().trim();
  if (isMongoActive()) {
    try {
      const page = await Page.findOne({ slug: cleanSlug, status: 'published' }).lean();
      if (page) return res.json(page);
    } catch (err) {
      console.warn(`Error reading page '${cleanSlug}' from MongoDB:`, err.message);
    }
  }

  if (cleanSlug === 'industries' && industriesPageData) {
    return res.json({ slug: 'industries', title: 'Industries We Serve', data: industriesPageData });
  }
  if (cleanSlug === 'bench' && benchData) {
    return res.json({ slug: 'bench', title: 'Bench Talent', data: benchData });
  }
  if (cleanSlug === 'about' && aboutData) {
    return res.json({ slug: 'about', title: 'About Us', data: aboutData });
  }
  if (cleanSlug === 'contact' && contactData) {
    return res.json({ slug: 'contact', title: 'Contact Us', data: contactData });
  }

  res.status(404).json({ error: `Page '${cleanSlug}' not found` });
});

// --- Benefits ---
router.get('/benefits', async (req, res) => {
  const result = await getHomeSection('benefits', benefits);
  res.json(result);
});

// --- FAQs ---
router.get('/faqs', async (req, res) => {
  const result = await getHomeSection('faqs', faqs);
  res.json(result);
});

// --- Tech Stack ---
router.get('/tech-stack', async (req, res) => {
  if (isMongoActive()) {
    try {
      const dbStacks = await TechStack.find({ isActive: true }).sort({ order: 1, name: 1 }).lean();
      if (dbStacks.length > 0) {
        if (req.query.details === 'true') {
          return res.json(dbStacks);
        }
        return res.json(dbStacks.map((s) => s.name));
      }
    } catch (err) {
      console.warn('Error reading from TechStack collection:', err.message);
    }
  }
  const result = await getHomeSection('techStack', techStack);
  res.json(result);
});

router.post('/tech-stack', async (req, res) => {
  if (Array.isArray(req.body.newStacks)) {
    techStack = req.body.newStacks;
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'home' },
          { $set: { 'data.techStack': techStack } },
          { upsert: true }
        );

        for (let i = 0; i < techStack.length; i++) {
          const name = techStack[i];
          const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
          await TechStack.findOneAndUpdate(
            { slug },
            { $set: { name, slug, order: i + 1, isActive: true } },
            { upsert: true }
          );
        }
      } catch (err) {
        console.warn('Could not persist techStack to MongoDB:', err.message);
      }
    }
    res.json({ message: 'Tech stack updated successfully', techStack });
  } else {
    res.status(400).json({ error: 'newStacks must be an array of strings' });
  }
});

// --- Openings ---
router.get('/openings', async (req, res) => {
  const { q, location, experience, workMode, jobMode, noticePeriod, department, sort } = req.query;
  
  let sourceOpenings = openings;

  // 1. Fetch freshest openings from MongoDB if connected
  if (isMongoActive()) {
    try {
      const dbJobs = await JobRequirement.find({ status: { $ne: 'Closed' } }).sort({ createdAt: -1 }).lean();
      if (dbJobs && dbJobs.length > 0) {
        sourceOpenings = dbJobs.map((j) => ({
          id: j.jobId || j._id,
          _id: j._id,
          title: j.title,
          // STRICT CLIENT CONFIDENTIALITY ON PUBLIC WEBSITE
          company: 'Enterprise Client (Confidential)',
          client: 'Enterprise Client (Confidential)',
          category: j.category || 'Technology',
          badge: j.badge || '',
          badgeColor: j.badgeColor || 'blue',
          logo: j.logo || 'TW',
          location: j.location || 'Remote',
          officeLocation: j.officeLocation || '',
          experience: j.experience || `${j.experienceRequired || 3}+ Years`,
          experienceTier: j.experienceTier || 'Mid-Senior',
          experienceRequired: j.experienceRequired || 3,
          salary: j.salary || j.budget || 'Competitive CTC',
          budget: j.budget || j.salary || 'Competitive CTC',
          joining: j.joining || 'Immediate',
          jobMode: j.jobMode || 'Permanent',
          workMode: j.workMode || 'Remote',
          noticePeriod: j.noticePeriod || 'Immediate',
          description: j.description || '',
          requirements: j.requirements || '',
          industry: j.industry || 'Information Technology & Cloud',
          skills: (j.skills && j.skills.length > 0) ? j.skills : (j.requiredSkills || []),
          department: j.department || 'Technology',
          postedDate: j.postedDate || (j.createdAt ? new Date(j.createdAt).toISOString().split('T')[0] : '2026-10-15'),
          priority: j.priority || 1,
        }));
      }
    } catch (dbErr) {
      console.warn('Fallback to memory openings due to MongoDB error:', dbErr.message);
    }
  } else {
    // Fallback to fresh mockData.json read if Mongo not active
    try {
      const rawData = fs.readFileSync(path.join(__dirname, '..', 'seeds', 'mockData.json'), 'utf8');
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed.initialOpenings) && parsed.initialOpenings.length > 0) {
        sourceOpenings = parsed.initialOpenings;
        openings = [...sourceOpenings];
      }
    } catch (readErr) {
      console.warn('Fallback to memory openings:', readErr.message);
    }
  }

  // Ensure ALL public openings mask client details
  let filtered = sourceOpenings.map((job) => ({
    ...job,
    company: 'Enterprise Client (Confidential)',
    client: 'Enterprise Client (Confidential)',
    requirements: job.requirements || '',
    industry: job.industry || 'Information Technology & Cloud',
  }));

  // Search keyword (q) - search title, skills, description, requirements without exposing client names
  if (q && q.trim() !== '') {
    const search = q.trim().toLowerCase();
    filtered = filtered.filter((job) => {
      const matchTitle = job.title && job.title.toLowerCase().includes(search);
      const matchCategory = job.category && job.category.toLowerCase().includes(search);
      const matchDesc = job.description && job.description.toLowerCase().includes(search);
      const matchReq = job.requirements && job.requirements.toLowerCase().includes(search);
      const matchSkills = job.skills && job.skills.some((s) => s.toLowerCase().includes(search));
      const matchJobMode = job.jobMode && job.jobMode.toLowerCase().includes(search);
      const matchWorkMode = job.workMode && job.workMode.toLowerCase().includes(search);
      const matchNotice = job.noticePeriod && job.noticePeriod.toLowerCase().includes(search);
      return matchTitle || matchCategory || matchDesc || matchReq || matchSkills || matchJobMode || matchWorkMode || matchNotice;
    });
  }

  // Location filter
  if (location && location !== 'All') {
    const loc = location.toLowerCase();
    filtered = filtered.filter((job) => {
      if (!job.location) return false;
      if (loc === 'remote') {
        return (
          job.location.toLowerCase().includes('remote') ||
          job.workMode === 'Work From Home' ||
          job.workMode === 'Remote'
        );
      }
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

  // Work Mode filter (supports Work From Home, Work From Office, Hybrid, and legacy Remote / On-site)
  if (workMode && workMode !== 'All Modes' && workMode !== 'All') {
    const targetMode = workMode.toLowerCase();
    filtered = filtered.filter((job) => {
      const jw = (job.workMode || '').toLowerCase();
      const jl = (job.location || '').toLowerCase();
      if (targetMode === 'work from home' || targetMode === 'remote') {
        return jw === 'work from home' || jw === 'remote' || jl.includes('remote');
      }
      if (targetMode === 'work from office' || targetMode === 'on-site') {
        return jw === 'work from office' || jw === 'on-site' || jw.includes('office');
      }
      if (targetMode === 'hybrid') {
        return jw === 'hybrid' || jl.includes('hybrid');
      }
      return jw === targetMode;
    });
  }

  // Job Mode filter (Permanent, Contract, Contract to Hire)
  if (jobMode && jobMode !== 'All Modes' && jobMode !== 'All Types' && jobMode !== 'All') {
    const targetJobMode = jobMode.toLowerCase();
    filtered = filtered.filter((job) => {
      const jm = (job.jobMode || '').toLowerCase();
      return jm === targetJobMode;
    });
  }

  // Notice Period filter (Immediate, On Notice Period, < 30 Days, > 30 Days)
  if (noticePeriod && noticePeriod !== 'All Notice' && noticePeriod !== 'All') {
    const targetNotice = noticePeriod.toLowerCase();
    filtered = filtered.filter((job) => {
      const jn = (job.noticePeriod || '').toLowerCase();
      return jn === targetNotice;
    });
  }

  // Department / Category filter
  if (department && department !== 'All Roles' && department !== 'All') {
    filtered = filtered.filter((job) => job.department === department || (job.category && job.category.toLowerCase().includes(department.toLowerCase())));
  }

  // Sort
  if (sort === 'Title A-Z') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'Highest Salary') {
    filtered.sort((a, b) => (b.salary || '').localeCompare(a.salary || ''));
  } else {
    // Default priority/newest sort
    filtered.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
    });
  }

  res.json(filtered);
});

router.post('/openings', async (req, res) => {
  if (Array.isArray(req.body.openings)) {
    openings = req.body.openings;
    if (isMongoActive()) {
      try {
        for (const j of req.body.openings) {
          await JobRequirement.findOneAndUpdate(
            { title: j.title, client: j.company || 'ThinkWires Client' },
            { ...j, client: j.company || 'ThinkWires Client' },
            { upsert: true }
          );
        }
      } catch (err) {
        console.warn('Could not sync openings to MongoDB:', err.message);
      }
    }
    res.json({ message: 'Openings updated successfully', openings });
  } else {
    res.status(400).json({ error: 'openings must be an array of objects' });
  }
});

// --- Stats ---
router.get('/stats', async (req, res) => {
  const result = await getHomeSection('stats', stats);
  res.json(result);
});
router.post('/stats', async (req, res) => {
  if (req.body.stats) {
    stats = { ...stats, ...req.body.stats };
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'home' },
          { $set: { 'data.stats': stats } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist stats to MongoDB:', err.message);
      }
    }
    res.json({ message: 'Stats updated successfully', stats });
  } else {
    res.status(400).json({ error: 'stats object is required in body' });
  }
});

// --- Industries (Home summary) ---
router.get('/industries', async (req, res) => {
  const result = await getHomeSection('industries', industries);
  res.json(result);
});
router.post('/industries', async (req, res) => {
  if (Array.isArray(req.body.industries)) {
    industries = req.body.industries;
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'home' },
          { $set: { 'data.industries': industries } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist industries to MongoDB:', err.message);
      }
    }
    res.json({ message: 'Industries updated successfully', industries });
  } else {
    res.status(400).json({ error: 'industries must be an array of objects' });
  }
});

// --- Industries Page Full Dynamic Data (Hero, Sector Tabs, Sectors, Comparison, Case Studies, Briefing) ---
let currentIndustriesPageData = industriesPageData ? { ...industriesPageData } : {};

router.get('/industries-page', async (req, res) => {
  if (isMongoActive()) {
    try {
      const page = await Page.findOne({ slug: 'industries' }).lean();
      if (page?.data && Object.keys(page.data).length > 0) {
        return res.json(page.data);
      }
    } catch (err) {
      console.warn('Error fetching industries page from MongoDB:', err.message);
    }
  }
  res.json(currentIndustriesPageData);
});

router.get('/sector-catalog', async (req, res) => {
  let data = currentIndustriesPageData;
  if (isMongoActive()) {
    try {
      const page = await Page.findOne({ slug: 'industries' }).lean();
      if (page?.data?.sectors) data = page.data;
    } catch (err) {
      console.warn('Error querying sector-catalog from MongoDB:', err.message);
    }
  }
  res.json(data.sectors || []);
});

router.post('/industries-page', async (req, res) => {
  if (req.body.industriesPageData) {
    currentIndustriesPageData = { ...currentIndustriesPageData, ...req.body.industriesPageData };
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'industries' },
          { $set: { data: currentIndustriesPageData } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist industries page to MongoDB:', err.message);
      }
    }
    res.json({ message: 'Industries page data updated successfully', industriesPageData: currentIndustriesPageData });
  } else {
    res.status(400).json({ error: 'industriesPageData object is required in body' });
  }
});

// --- Process ---
router.get('/process', async (req, res) => {
  const result = await getHomeSection('process', processSteps);
  res.json(result);
});
router.post('/process', async (req, res) => {
  if (Array.isArray(req.body.processSteps)) {
    processSteps = req.body.processSteps;
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'home' },
          { $set: { 'data.process': processSteps } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist process steps to MongoDB:', err.message);
      }
    }
    res.json({ message: 'Process steps updated successfully', processSteps });
  } else {
    res.status(400).json({ error: 'processSteps must be an array of objects' });
  }
});

// --- Capabilities ---
router.get('/capabilities', async (req, res) => {
  const result = await getHomeSection('capabilities', capabilities);
  res.json(result);
});
router.post('/capabilities', async (req, res) => {
  if (Array.isArray(req.body.capabilities)) {
    capabilities = req.body.capabilities;
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'home' },
          { $set: { 'data.capabilities': capabilities } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist capabilities to MongoDB:', err.message);
      }
    }
    res.json({ message: 'Capabilities updated successfully', capabilities });
  } else {
    res.status(400).json({ error: 'capabilities must be an array of objects' });
  }
});

// --- Reports ---
router.get('/reports', async (req, res) => {
  const result = await getHomeSection('reports', reports);
  res.json(result);
});
router.post('/reports', async (req, res) => {
  if (Array.isArray(req.body.reports)) {
    reports = req.body.reports;
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'home' },
          { $set: { 'data.reports': reports } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist reports to MongoDB:', err.message);
      }
    }
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
let currentAboutData = aboutData ? { ...aboutData } : {};

router.get('/about', async (req, res) => {
  if (isMongoActive()) {
    try {
      const page = await Page.findOne({ slug: 'about' }).lean();
      if (page?.data && Object.keys(page.data).length > 0) {
        return res.json(page.data);
      }
    } catch (dbErr) {
      console.warn('Error loading about page from MongoDB:', dbErr.message);
    }
  }
  res.json(currentAboutData);
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
router.get('/articles', async (req, res) => {
  const { q, category } = req.query;
  let sourceArticles = articles;
  if (isMongoActive()) {
    try {
      const dbArticles = await Article.find({ status: 'published' }).sort({ publishedAt: -1 }).lean();
      if (dbArticles && dbArticles.length > 0) {
        sourceArticles = dbArticles.map((a) => ({
          ...a,
          id: a.articleId || a.slug || a._id,
        }));
      }
    } catch (dbErr) {
      console.warn('Error reading articles from MongoDB:', dbErr.message);
    }
  }

  let filtered = [...sourceArticles];

  if (q && q.trim() !== '') {
    const query = q.trim().toLowerCase();
    filtered = filtered.filter(
      (art) =>
        (art.title && art.title.toLowerCase().includes(query)) ||
        (art.excerpt && art.excerpt.toLowerCase().includes(query)) ||
        (art.summary && art.summary.toLowerCase().includes(query)) ||
        (art.author && (typeof art.author === 'string' ? art.author : art.author.name || '').toLowerCase().includes(query)) ||
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

router.get('/articles/featured', async (req, res) => {
  if (isMongoActive()) {
    try {
      const feat = await Article.findOne({ featured: true, status: 'published' }).lean();
      if (feat) {
        return res.json({ ...feat, id: feat.articleId || feat.slug || feat._id });
      }
    } catch (dbErr) {
      console.warn('Error reading featured article from MongoDB:', dbErr.message);
    }
  }
  res.json(featuredArticle);
});

router.get('/articles/researchers', async (req, res) => {
  const result = await getHomeSection('researchers', researchers);
  res.json(result);
});

router.get('/articles/:id', async (req, res) => {
  const targetId = req.params.id;
  if (isMongoActive()) {
    try {
      const query = mongoose.isValidObjectId(targetId)
        ? { $or: [{ _id: targetId }, { slug: targetId }, { articleId: targetId }] }
        : { $or: [{ slug: targetId }, { articleId: targetId }] };
      const art = await Article.findOne(query).lean();
      if (art) {
        return res.json({ ...art, id: art.articleId || art.slug || art._id });
      }
    } catch (dbErr) {
      console.warn('Error loading article from MongoDB:', dbErr.message);
    }
  }

  const article = articles.find((art) => art.id === targetId || art.slug === targetId);
  if (article) {
    res.json(article);
  } else if (featuredArticle && (featuredArticle.id === targetId || featuredArticle.slug === targetId)) {
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
let contactPageData = contactData ? { ...contactData } : {};

router.get('/contact', async (req, res) => {
  if (isMongoActive()) {
    try {
      const page = await Page.findOne({ slug: 'contact' }).lean();
      if (page?.data && Object.keys(page.data).length > 0) {
        return res.json(page.data);
      }
    } catch (dbErr) {
      console.warn('Error reading contact page from MongoDB:', dbErr.message);
    }
  }
  res.json(contactPageData);
});

// Update office locations dynamically
router.post('/contact/offices', async (req, res) => {
  if (Array.isArray(req.body.officeLocations)) {
    contactPageData.officeLocations = req.body.officeLocations;
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'contact' },
          { $set: { 'data.officeLocations': contactPageData.officeLocations } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist officeLocations to MongoDB:', err.message);
      }
    }
    res.json({ message: 'Office locations updated successfully', officeLocations: contactPageData.officeLocations });
  } else {
    res.status(400).json({ error: 'officeLocations must be an array of objects' });
  }
});

// Update contact channels dynamically
router.post('/contact/channels', async (req, res) => {
  if (Array.isArray(req.body.channels)) {
    contactPageData.channels = req.body.channels;
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'contact' },
          { $set: { 'data.channels': contactPageData.channels } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist channels to MongoDB:', err.message);
      }
    }
    res.json({ message: 'Contact channels updated successfully', channels: contactPageData.channels });
  } else {
    res.status(400).json({ error: 'channels must be an array of objects' });
  }
});

// Update FAQ dynamically
router.post('/contact/faq', async (req, res) => {
  if (Array.isArray(req.body.faq)) {
    contactPageData.faq = req.body.faq;
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'contact' },
          { $set: { 'data.faq': contactPageData.faq } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist FAQ to MongoDB:', err.message);
      }
    }
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

// --- Helper to get Page data by slug ---
const getPageDataBySlug = async (slug, fallback) => {
  if (isMongoActive()) {
    try {
      const page = await Page.findOne({ slug }).lean();
      if (page?.data && Object.keys(page.data).length > 0) {
        return page.data;
      }
    } catch (err) {
      console.warn(`Error reading page '${slug}' from MongoDB:`, err.message);
    }
  }
  return fallback;
};

// --- Bench / Talent Cloud Endpoints ---
router.get('/bench', async (req, res) => {
  const benchSource = await getPageDataBySlug('bench', bench);
  const rawCandidates = benchSource.candidates || benchSource.talents || [];
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
    ...benchSource,
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

router.get('/bench/talents', async (req, res) => {
  const { q, specialty, urgency, experience, location, sort } = req.query;
  const benchSource = await getPageDataBySlug('bench', bench);
  const rawCandidates = benchSource.candidates || benchSource.talents || [];
  let filtered = rawCandidates.map((c) => ({
    id: c.id,
    code: c.id || c.code,
    role: c.title || c.role,
    title: c.title || c.role,
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
    proofQuote: c.engineeringProof || c.proofQuote || 'Architected and scaled production enterprise systems.',
    skills: c.skills || [],
  }));

  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.role.toLowerCase().includes(query) ||
        t.code.toLowerCase().includes(query) ||
        t.skills.some((s) => s.toLowerCase().includes(query)) ||
        (t.proofQuote && t.proofQuote.toLowerCase().includes(query))
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
      const rateA = parseInt((a.hourlyRate || '').replace(/[^0-9]/g, ''), 10) || 0;
      const rateB = parseInt((b.hourlyRate || '').replace(/[^0-9]/g, ''), 10) || 0;
      return rateA - rateB;
    });
  }

  res.json(filtered);
});

router.get('/bench/talents/:id', async (req, res) => {
  const benchSource = await getPageDataBySlug('bench', bench);
  const rawCandidates = benchSource.candidates || benchSource.talents || [];
  const talent = rawCandidates.find((t) => t.id === req.params.id || t.code === req.params.id);
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


// ==============================================================================
// ABOUT PAGE & CORPORATE ADVISORY ROUTES
// ==============================================================================

const aboutDataset = {
  company: {
    name: "ThinkWires",
    founded: 2022,
    headquarters: "Plot No. 20, Block H-1/A, Sector 63, Noida, Uttar Pradesh 201301",
    locations: ["India", "USA", "Canada"],
    eyebrow: "ABOUT THINKWIRES",
    headline: "Connecting Global Ambition with Exceptional Tech Talent.",
    subheading: "Founded in 2022 as a premier workforce advisor and staffing aggregator, ThinkWires connects high-growth enterprises with specialized engineering talent and compliant Employer of Record (EOR) infrastructure across India, the US, and Canada.",
    heroImage: "/images/about-hero.jpg",
    heroImageAlt: "ThinkWires Global Technology Talent Delivery Network",
    overview: {
      eyebrow: "COMPANY OVERVIEW",
      title: "Architecting High-Velocity Engineering Squads for Global Scale",
      summary: "ThinkWires was established in 2022 to dismantle the structural bottlenecks of traditional IT staffing. Operating across high-demand tech corridors in India, the United States, and Canada, we combine the domain depth of an executive search firm with the rapid scalability of an aggregator ecosystem.",
      mission: "To engineer frictionless, compliant, and hyper-targeted talent pipelines that enable technology leaders to build and scale world-class software teams without borders.",
      pillars: [
        {
          title: "Architectural Vetting",
          description: "Every engineering profile is evaluated beyond the CV through deep system design benchmarks, code telemetry, and domain-specific delivery audits."
        },
        {
          title: "SLA-Driven Velocity",
          description: "Our aggregator engine delivers verified, interview-ready candidate dossiers within 5 business hours of intake, drastically reducing time-to-hire."
        },
        {
          title: "Zero-Risk Compliance",
          description: "Full Employer of Record (EOR) indemnification, cross-border payroll, IP assignments, and multi-jurisdictional labor law compliance from day one."
        }
      ]
    }
  },
  stats: [
    {
      id: "profile-delivery",
      value: "5h",
      numericValue: 5,
      unit: "h",
      label: "First Curated Profiles",
      subLabel: "Proprietary intake & matching SLA",
      accent: "blue"
    },
    {
      id: "time-to-hire",
      value: "7d",
      numericValue: 7,
      unit: "d",
      label: "Time-to-Hire Target",
      subLabel: "End-to-end interview to contract",
      accent: "green"
    },
    {
      id: "executive-experience",
      value: "100+",
      numericValue: 100,
      unit: "Yrs",
      label: "Combined Executive Experience",
      subLabel: "Cross-border enterprise leadership depth",
      accent: "blue"
    },
    {
      id: "statutory-compliance",
      value: "100%",
      numericValue: 100,
      unit: "%",
      label: "Statutory Compliance",
      subLabel: "EOR & cross-border governance assurance",
      accent: "green"
    }
  ],
  aggregatorModel: {
    eyebrow: "STRATEGIC ADVANTAGE",
    heading: "The ThinkWires Aggregator Model",
    description: "Traditional recruitment agencies bottleneck on internal databases. ThinkWires functions as an enterprise staffing aggregator orchestrating a high-velocity ecosystem of verified partner agencies, independent specialists, and automated compliance pipelines.",
    cards: [
      {
        id: "agg-1",
        icon: "clock",
        title: "Rapid Profile Delivery (5 Hours)",
        description: "Proprietary matching algorithms search verified repositories to deliver pre-screened, job-fit candidate dossiers within 5 working hours of intake.",
        detail: "Guaranteed sub-5-hour SLA response with benchmarked technical scorecards."
      },
      {
        id: "agg-2",
        icon: "layers",
        title: "Full-Stack Tech & Enterprise ERP",
        description: "Specialized domain depth spanning SAP ABAP/HANA, Adobe Experience Manager (AEM), Teamcenter PLM, Kubernetes/DevOps, and Generative AI frameworks.",
        detail: "Pre-vetted engineering squads ready for immediate deployment into enterprise stacks."
      },
      {
        id: "agg-3",
        icon: "shield",
        title: "Compliance and EOR Infrastructure",
        description: "Complete Employer of Record (EOR) indemnification. We manage local statutory payroll, benefits, strict IP NDA assignments, and multi-jurisdiction tax withholding.",
        detail: "Bulletproof legal governance covering Indian statutory mandates, US W2/1099, and Canadian labor regulations."
      },
      {
        id: "agg-4",
        icon: "network",
        title: "Agile Subcontractor Network",
        description: "A curated network of certified boutique recruitment partners providing instant surge capacity without inflating fixed operational overhead.",
        detail: "Elastic scaling framework enabling enterprises to mobilize specialized benches on demand."
      }
    ]
  },
  philosophy: {
    eyebrow: "OUR PHILOSOPHY",
    heading: "\"Recruitment is Not Transactional; It is Architectural.\"",
    description: "At ThinkWires, we reject the legacy headhunter pattern of resume-dumping. We treat every client intake as an engineering brief. From understanding the nuances of microservices architectures to navigating localized tax laws in Ontario or California, our teams engineer frictionless, compliant talent conduits.",
    image: "/images/about-philosophy.jpg",
    imageAlt: "ThinkWires executive strategic advisory session",
    metrics: [
      {
        id: "metric-1",
        value: "98.4%",
        label: "Contract Retention Rate"
      },
      {
        id: "metric-2",
        value: "< 48 hrs",
        label: "Candidate Interview Turnaround"
      }
    ]
  },
  leadership: [
    {
      id: "leader-001",
      name: "Naziya Husain",
      designation: "Founder Member",
      experience: "14+ Years",
      initials: "NH",
      bio: "With over 14 years in recruitment, headhunting, talent mapping, and end-to-end manpower solutions, Naziya has successfully steered complex mandates across KPOs, top-tier management consulting firms, and fast-scaling digital startups.",
      expertise: ["Talent Mapping", "Executive Headhunting", "Manpower Solutions", "KPO Mandates"],
      image: null,
      linkedin: null
    },
    {
      id: "leader-002",
      name: "Anju Balyan",
      designation: "Co-Founder & Associate Executive Director",
      experience: "17+ Years",
      initials: "AB",
      bio: "Enthusiastic enterprise HR leader with 17 years aligning HR initiatives with tier-one business priorities. Specialist in shared services environments, transitions, legal frameworks, ERP rollouts, and HR automation systems.",
      expertise: ["Enterprise HR Architecture", "Shared Services", "ERP Transitions", "Labor Frameworks"],
      image: null,
      linkedin: null
    },
    {
      id: "leader-003",
      name: "Ananya Mehta",
      designation: "Chief Executive Officer (CEO)",
      experience: "15+ Years",
      initials: "AM",
      bio: "Dedicated to building teams that drive real business velocity. Expert in strategic talent research, executive search, deep candidate evaluation beyond CVs, and structuring high-trust leadership placements for global scale.",
      expertise: ["Executive Search", "Organizational Scaling", "Strategic Sourcing", "Talent Evaluation"],
      image: null,
      linkedin: null
    },
    {
      id: "leader-004",
      name: "Arjun Verma",
      designation: "Chief People & Marketing Officer (CPO & CMO)",
      experience: "20+ Years",
      initials: "AV",
      bio: "A 20+-year veteran at the intersection of talent acquisition, organizational culture, and brand positioning. Focused on solving why high-growth enterprises struggle to hire and how elite culture transforms product velocity.",
      expertise: ["People Strategy", "Employer Branding", "Talent Acquisition", "Culture Architecture"],
      image: null,
      linkedin: null
    },
    {
      id: "leader-005",
      name: "Meera Iyer",
      designation: "Senior Director - Global Head of TA Operations & HR Services",
      experience: "18+ Years",
      initials: "MI",
      bio: "Strategic Talent Acquisition and HR Operations executive who has built scalable, technology-driven recruitment frameworks across enterprise leaders including BlackRock, Microsoft, IBM, Ameriprise, and Infosys. Ensures institutional governance, risk mitigation, compliance, and flawless multi-region operations.",
      expertise: ["Global Delivery Operations", "Risk Mitigation", "EOR Compliance", "Operational Integrity"],
      priorEnterprises: ["BlackRock", "Microsoft", "IBM", "Infosys", "Ameriprise"],
      image: null,
      linkedin: null
    }
  ],
  milestones: [
    {
      id: "milestone-2022",
      year: "2022",
      tag: "Foundation",
      title: "Foundation",
      description: "Founded in Noida with a core team dedicated to borderless recruitment, pioneering an agency aggregator network that delivers verified profiles in under 5 hours.",
      status: "completed"
    },
    {
      id: "milestone-2023",
      year: "2023",
      tag: "Practice Alignment",
      title: "Growth and Practice Alignment",
      description: "Unit economics break-even achieved. Launched specialized talent practices across SAP ABAP/HANA, Cloud/DevOps, and Enterprise Salesforce consulting.",
      status: "completed"
    },
    {
      id: "milestone-2024",
      year: "2024",
      tag: "Cross-Border Expansion",
      title: "Cross-Border Expansion",
      description: "Inaugurated dedicated talent corridors into the United States and Canada. Rolled out comprehensive Employer of Record (EOR) and global payroll management.",
      status: "completed"
    }
  ],
  roadmap: [
    {
      id: "roadmap-2026",
      timeframe: "2026+",
      tag: "Planned Roadmap",
      title: "AI-Powered Delivery & Telemetry Vetting",
      description: "Automated code telemetry vetting, generative talent search matching, and sub-48-hour global deployment pipelines across AI and PLM systems.",
      status: "planned"
    }
  ],
  methodology: [
    {
      step: "01",
      title: "Discovery & Technical Scoping",
      description: "We initiate with an executive discovery session. We evaluate tech stack nuances, project deadlines, budgetary constraints, and candidate seniority to draft exact success metrics.",
      deliverable: "Technical Requirement Specification & Delivery Scope"
    },
    {
      step: "02",
      title: "Precision Pre-Vetted Matching (<5 Hours)",
      description: "Our aggregator engine coordinates across our specialized subcontractor network to deliver tested, pre-interviewed candidate dossiers within five working hours.",
      deliverable: "Pre-Screened Candidate Dossiers & Technical Rubrics"
    },
    {
      step: "03",
      title: "Onboarding & Governance",
      description: "Seamless offer negotiation, local statutory contract issuance via EOR, compliant equipment provisioning, and ongoing governance tracking ensure long-term retention.",
      deliverable: "Full EOR Indemnification & Ongoing Performance Governance"
    }
  ],
  contact: {
    headline: "Ready to Build Your High-Velocity Engineering Squad?",
    description: "Book a 20-minute workforce strategy consultation with our staffing directors to audit your technical requirements and receive benchmark rates for India and North America.",
    headquarters: {
      title: "Global Corporate Headquarters",
      address: "Plot No. 20, Block H-1/A, Sector 63, Noida, Uttar Pradesh 201301"
    },
    phones: [
      "+91 (120) 450-8800",
      "+91 89205 55626"
    ],
    email: "connect@thinkwires.com",
    hours: "Monday - Friday: 9:00 AM - 7:00 PM IST (EST/PST Overlap Supported)"
  }
};

// GET /api/about/stats
router.get('/about/stats', async (req, res) => {
  const data = await getPageDataBySlug('about', aboutDataset);
  res.json(data.statsStrip || data.stats || aboutDataset.stats);
});

// GET /api/leadership
router.get('/leadership', async (req, res) => {
  const data = await getPageDataBySlug('about', aboutDataset);
  res.json(data.leadershipTeam || data.leadership || aboutDataset.leadership);
});

// GET /api/milestones
router.get('/milestones', async (req, res) => {
  const data = await getPageDataBySlug('about', aboutDataset);
  res.json({
    milestones: data.growthTimeline?.milestones || aboutDataset.milestones,
    roadmap: data.growthTimeline?.roadmap || aboutDataset.roadmap
  });
});

// GET /api/company/contact
router.get('/company/contact', async (req, res) => {
  const data = await getPageDataBySlug('about', aboutDataset);
  res.json(data.contact || aboutDataset.contact);
});

// In-memory consultations log
const consultationSubmissions = [];

const handleConsultationSubmission = (req, res) => {
  const { fullName, workEmail, phone, primaryNeed, techRoles } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: 'Full Name is required.' });
  }

  if (!workEmail || !workEmail.trim()) {
    return res.status(400).json({ error: 'Work Email is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(workEmail.trim())) {
    return res.status(400).json({ error: 'Please provide a valid work email address.' });
  }

  const bookingRef = `TW-${Date.now().toString(36).toUpperCase()}`;
  const submission = {
    id: consultationSubmissions.length + 1,
    bookingRef,
    fullName: fullName.trim(),
    workEmail: workEmail.trim(),
    phone: phone ? phone.trim() : null,
    primaryNeed: primaryNeed || 'Staff Augmentation',
    techRoles: techRoles ? techRoles.trim() : null,
    createdAt: new Date().toISOString()
  };

  consultationSubmissions.push(submission);
  console.log('⚡ Strategy Consultation Scheduled:', submission);

  res.status(201).json({
    success: true,
    message: 'Workforce strategy consultation scheduled successfully! Our staffing directors will review your brief and connect within 5 hours.',
    bookingRef,
    submission
  });
};

// POST /api/about/consultation and POST /api/consultations
router.post('/about/consultation', handleConsultationSubmission);
router.post('/consultations', handleConsultationSubmission);
// --- Payroll Outsourcing Endpoints ---
router.get('/payroll', async (req, res) => {
  const result = await getPageDataBySlug('services-payroll', currentPayrollData);
  res.json(result);
});

router.post('/payroll', async (req, res) => {
  if (req.body.payrollData) {
    currentPayrollData = { ...currentPayrollData, ...req.body.payrollData };
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'services-payroll' },
          { $set: { data: currentPayrollData } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist payrollData to MongoDB:', err.message);
      }
    }
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
router.get('/eor', async (req, res) => {
  const result = await getPageDataBySlug('services-eor', currentEorData);
  res.json(result);
});

router.post('/eor', async (req, res) => {
  if (req.body.eorData) {
    currentEorData = { ...currentEorData, ...req.body.eorData };
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'services-eor' },
          { $set: { data: currentEorData } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist eorData to MongoDB:', err.message);
      }
    }
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
router.get('/staff-augmentation', async (req, res) => {
  const result = await getPageDataBySlug('services-staff-augmentation', currentStaffAugmentationData);
  res.json(result);
});

router.post('/staff-augmentation', async (req, res) => {
  if (req.body.staffAugmentationData) {
    currentStaffAugmentationData = { ...currentStaffAugmentationData, ...req.body.staffAugmentationData };
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'services-staff-augmentation' },
          { $set: { data: currentStaffAugmentationData } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist staffAugmentationData to MongoDB:', err.message);
      }
    }
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
router.get('/permanent-staffing', async (req, res) => {
  const result = await getPageDataBySlug('services-permanent-staffing', currentPermanentStaffingData);
  res.json(result);
});

router.get('/executive-search', async (req, res) => {
  const result = await getPageDataBySlug('services-permanent-staffing', currentPermanentStaffingData);
  res.json(result);
});

router.post('/permanent-staffing', async (req, res) => {
  if (req.body.permanentStaffingData) {
    currentPermanentStaffingData = { ...currentPermanentStaffingData, ...req.body.permanentStaffingData };
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'services-permanent-staffing' },
          { $set: { data: currentPermanentStaffingData } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('Could not persist permanentStaffingData to MongoDB:', err.message);
      }
    }
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
router.get('/find-talent', async (req, res) => {
  const result = await getPageDataBySlug('find-talent', currentFindTalentData);
  res.json(result);
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
router.get('/candidate-portal', async (req, res) => {
  const result = await getPageDataBySlug('candidate-portal', currentCandidatePortalData);
  res.json(result);
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

