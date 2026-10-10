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
} = mockData;

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

// --- Industries ---
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
});

export default router;

