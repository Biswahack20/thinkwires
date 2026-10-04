import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path since this is now in src/routes
const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'seeds', 'mockData.json'), 'utf8'));
const { initialTechStack, initialOpenings, industriesData, processData, capabilitiesData, reportsData, statsData } = mockData;

const router = express.Router();

// Mutable in-memory state for mock admin updates
let techStack = [...initialTechStack];
let openings = [...initialOpenings];
let stats = { ...statsData };
let industries = [...industriesData];
let processSteps = [...processData];
let capabilities = [...capabilitiesData];
let reports = [...reportsData];

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
  const sortedOpenings = [...openings].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(b.postedDate) - new Date(a.postedDate);
  });
  res.json(sortedOpenings);
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

// --- Contact Form ---
router.post('/contact', (req, res) => {
  const { email, phone } = req.body;
  if (email && phone) {
    console.log('New Contact Request:', { email, phone });
    res.json({ message: 'Callback requested successfully!' });
  } else {
    res.status(400).json({ error: 'Email and Phone are required' });
  }
});

export default router;
