import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import Employee from '../models/employee.mongo.model.js';
import Candidate from '../models/candidate.mongo.model.js';
import Client from '../models/client.mongo.model.js';
import JobRequirement from '../models/job.mongo.model.js';
import Placement from '../models/placement.mongo.model.js';
import Page from '../models/page.mongo.model.js';
import Article from '../models/article.mongo.model.js';
import Media from '../models/media.mongo.model.js';
import Announcement from '../models/announcement.mongo.model.js';
import Activity from '../models/activity.mongo.model.js';
import UserMongo from '../models/user.mongo.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory store initialized from adminSeedData.json for seamless offline demo resilience
const seedFilePath = path.join(__dirname, '..', 'seeds', 'adminSeedData.json');
let inMemoryData = {
  users: [],
  employees: [],
  candidates: [],
  clients: [],
  jobs: [],
  placements: [],
  pages: [],
  articles: [],
  media: [],
  announcements: [],
  activities: [],
};

try {
  if (fs.existsSync(seedFilePath)) {
    const raw = fs.readFileSync(seedFilePath, 'utf8');
    inMemoryData = JSON.parse(raw);
  }
} catch (e) {
  console.warn('⚠️ Could not load adminSeedData.json into in-memory store:', e.message);
}

const isMongoActive = () => mongoose.connection.readyState === 1;

// Helper to log activities
const logActivity = async (action, entityType, entityId, description, user = { name: 'Admin User', role: 'admin' }, badgeColor = '#008F68') => {
  const newAct = {
    id: `act_${Date.now()}`,
    action,
    entityType,
    entityId: String(entityId),
    description,
    user,
    badgeColor,
    createdAt: new Date().toISOString(),
  };

  inMemoryData.activities.unshift(newAct);
  if (inMemoryData.activities.length > 50) inMemoryData.activities.pop();

  if (isMongoActive()) {
    try {
      await Activity.create({ action, entityType, entityId, description, user, badgeColor });
    } catch (err) {
      console.warn('Failed to persist activity to MongoDB:', err.message);
    }
  }
};

// ============================================================================
// 1. DASHBOARD OVERVIEW & ANALYTICS
// ============================================================================
export const getDashboardOverview = async (req, res) => {
  try {
    const period = (req.query.period || 'month').toLowerCase(); // 'month' | 'quarter' | 'year'

    let employees = [];
    let candidates = [];
    let clients = [];
    let jobs = [];
    let placements = [];
    let announcements = [];
    let activities = [];

    if (isMongoActive()) {
      employees = await Employee.find().lean();
      candidates = await Candidate.find().lean();
      clients = await Client.find().lean();
      jobs = await JobRequirement.find().lean();
      placements = await Placement.find().lean();
      announcements = await Announcement.find({ status: 'published' }).sort({ createdAt: -1 }).limit(5).lean();
      activities = await Activity.find().sort({ createdAt: -1 }).limit(10).lean();

      // If mongo collection is empty, fallback to seeded data
      if (employees.length === 0) employees = inMemoryData.employees;
      if (candidates.length === 0) candidates = inMemoryData.candidates;
      if (clients.length === 0) clients = inMemoryData.clients;
      if (jobs.length === 0) jobs = inMemoryData.jobs;
      if (placements.length === 0) placements = inMemoryData.placements;
      if (announcements.length === 0) announcements = inMemoryData.announcements.filter(a => a.status === 'published');
      if (activities.length === 0) activities = inMemoryData.activities;
    } else {
      employees = inMemoryData.employees;
      candidates = inMemoryData.candidates;
      clients = inMemoryData.clients;
      jobs = inMemoryData.jobs;
      placements = inMemoryData.placements;
      announcements = inMemoryData.announcements.filter(a => a.status === 'published');
      activities = inMemoryData.activities;
    }

    const totalEmployees = employees.length;
    const activePlacements = placements.filter(p => p.assignmentStatus === 'Active').length;
    const totalClients = clients.length;
    const openRequirements = jobs.filter(j => j.status === 'Open' || j.status === 'In Progress').length;
    const candidatePipelineCount = candidates.length;

    // Calculate revenue metrics based on period
    const totalBillingMonthly = placements
      .filter(p => p.assignmentStatus === 'Active')
      .reduce((sum, p) => sum + (Number(p.billingRate) || 5000), 0);

    const periodMultiplier = period === 'year' ? 12 : period === 'quarter' ? 3 : 1;
    const totalRevenue = totalBillingMonthly * periodMultiplier;
    const estimatedCost = totalRevenue * 0.68;
    const grossMargin = totalRevenue - estimatedCost;

    // Period chart datasets
    let revenueVsCosts = [];
    let placementsVsTargets = [];
    let performanceTrends = [];

    if (period === 'month') {
      revenueVsCosts = [
        { name: 'Week 1', revenue: Math.round(totalRevenue * 0.22), costs: Math.round(estimatedCost * 0.21) },
        { name: 'Week 2', revenue: Math.round(totalRevenue * 0.24), costs: Math.round(estimatedCost * 0.23) },
        { name: 'Week 3', revenue: Math.round(totalRevenue * 0.26), costs: Math.round(estimatedCost * 0.25) },
        { name: 'Week 4', revenue: Math.round(totalRevenue * 0.28), costs: Math.round(estimatedCost * 0.27) },
      ];
      placementsVsTargets = [
        { name: 'Week 1', actual: 3, target: 4 },
        { name: 'Week 2', actual: 5, target: 5 },
        { name: 'Week 3', actual: 4, target: 5 },
        { name: 'Week 4', actual: 6, target: 5 },
      ];
      performanceTrends = [
        { name: 'Week 1', velocity: 84, satisfaction: 96 },
        { name: 'Week 2', velocity: 89, satisfaction: 95 },
        { name: 'Week 3', velocity: 92, satisfaction: 98 },
        { name: 'Week 4', velocity: 96, satisfaction: 99 },
      ];
    } else if (period === 'quarter') {
      revenueVsCosts = [
        { name: 'Month 1', revenue: Math.round(totalRevenue * 0.31), costs: Math.round(estimatedCost * 0.30) },
        { name: 'Month 2', revenue: Math.round(totalRevenue * 0.33), costs: Math.round(estimatedCost * 0.33) },
        { name: 'Month 3', revenue: Math.round(totalRevenue * 0.36), costs: Math.round(estimatedCost * 0.35) },
      ];
      placementsVsTargets = [
        { name: 'Month 1', actual: 12, target: 14 },
        { name: 'Month 2', actual: 16, target: 15 },
        { name: 'Month 3', actual: 18, target: 16 },
      ];
      performanceTrends = [
        { name: 'Month 1', velocity: 86, satisfaction: 95 },
        { name: 'Month 2', velocity: 91, satisfaction: 97 },
        { name: 'Month 3', velocity: 95, satisfaction: 98 },
      ];
    } else {
      revenueVsCosts = [
        { name: 'Q1', revenue: Math.round(totalRevenue * 0.21), costs: Math.round(estimatedCost * 0.22) },
        { name: 'Q2', revenue: Math.round(totalRevenue * 0.24), costs: Math.round(estimatedCost * 0.24) },
        { name: 'Q3', revenue: Math.round(totalRevenue * 0.26), costs: Math.round(estimatedCost * 0.26) },
        { name: 'Q4 (Proj)', revenue: Math.round(totalRevenue * 0.29), costs: Math.round(estimatedCost * 0.28) },
      ];
      placementsVsTargets = [
        { name: 'Q1', actual: 38, target: 45 },
        { name: 'Q2', actual: 48, target: 50 },
        { name: 'Q3', actual: 56, target: 55 },
        { name: 'Q4 (Proj)', actual: 64, target: 60 },
      ];
      performanceTrends = [
        { name: 'Q1', velocity: 82, satisfaction: 94 },
        { name: 'Q2', velocity: 88, satisfaction: 96 },
        { name: 'Q3', velocity: 93, satisfaction: 97 },
        { name: 'Q4 (Proj)', velocity: 97, satisfaction: 99 },
      ];
    }

    res.json({
      success: true,
      period,
      databaseMode: isMongoActive() ? 'MongoDB Connected' : 'In-Memory Resilient Demo Mode',
      isMongoActive: isMongoActive(),
      demoNotice: 'DEMO DATA — Numbers and metrics represent simulated enterprise operations for demonstration purposes.',
      kpis: {
        totalEmployees,
        activePlacements,
        totalClients,
        openRequirements,
        totalRevenue,
        estimatedCost,
        grossMargin,
        candidatePipelineCount,
        recruitmentPerformance: 94.6,
        fulfillmentRate: 88.2,
      },
      charts: {
        revenueVsCosts,
        placementsVsTargets,
        performanceTrends,
      },
      recentPlacements: placements.slice(0, 5),
      recentActivity: activities.slice(0, 8),
      announcements: announcements.slice(0, 3),
    });
  } catch (err) {
    console.error('Error fetching dashboard overview:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 2. EMPLOYEES CRUD
// ============================================================================
export const getEmployees = async (req, res) => {
  try {
    const { search, availability, status, page = 1, limit = 20 } = req.query;

    let items = [];
    if (isMongoActive()) {
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { designation: { $regex: search, $options: 'i' } },
          { technicalSkills: { $in: [new RegExp(search, 'i')] } },
        ];
      }
      if (availability && availability !== 'All') query.availability = availability;
      if (status && status !== 'All') query.deploymentStatus = status;

      items = await Employee.find(query).sort({ createdAt: -1 }).lean();
      if (items.length === 0 && !search && (!availability || availability === 'All') && (!status || status === 'All')) {
        items = inMemoryData.employees;
      }
    } else {
      items = inMemoryData.employees.filter((emp) => {
        let match = true;
        if (search) {
          const s = search.toLowerCase();
          match =
            emp.name.toLowerCase().includes(s) ||
            emp.email.toLowerCase().includes(s) ||
            emp.designation.toLowerCase().includes(s) ||
            (emp.technicalSkills && emp.technicalSkills.some((sk) => sk.toLowerCase().includes(s)));
        }
        if (match && availability && availability !== 'All') {
          match = emp.availability === availability;
        }
        if (match && status && status !== 'All') {
          match = emp.deploymentStatus === status;
        }
        return match;
      });
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + Number(limit));

    res.json({
      success: true,
      employees: paginated,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, designation, technicalSkills, experience, availability, deploymentStatus, billingRate, location, notes } = req.body;

    if (!name || !email || !phone || !designation) {
      return res.status(400).json({ success: false, error: 'Name, email, phone, and designation are required.' });
    }

    const skillsArray = Array.isArray(technicalSkills)
      ? technicalSkills
      : typeof technicalSkills === 'string'
      ? technicalSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newEmp = {
      id: `emp_${Date.now()}`,
      name,
      email,
      phone,
      designation,
      technicalSkills: skillsArray,
      experience: Number(experience) || 0,
      availability: availability || 'Immediate',
      deploymentStatus: deploymentStatus || 'Available',
      billingRate: Number(billingRate) || 0,
      location: location || 'Remote',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    inMemoryData.employees.unshift(newEmp);

    if (isMongoActive()) {
      await Employee.create(newEmp);
    }

    await logActivity('Created Employee', 'Employee', newEmp.id, `Added employee ${name} (${designation}) to workforce.`, req.user);

    res.status(201).json({ success: true, message: 'Employee added successfully', employee: newEmp });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.technicalSkills && typeof updates.technicalSkills === 'string') {
      updates.technicalSkills = updates.technicalSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    let found = false;
    const idx = inMemoryData.employees.findIndex((e) => e.id === id || String(e._id) === id);
    if (idx !== -1) {
      inMemoryData.employees[idx] = { ...inMemoryData.employees[idx], ...updates, updatedAt: new Date().toISOString() };
      found = true;
    }

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Employee.findOneAndUpdate(query, updates, { new: true });
    }

    await logActivity('Updated Employee', 'Employee', id, `Updated record for ${updates.name || 'employee'}.`, req.user);

    res.json({ success: true, message: 'Employee updated successfully', employee: inMemoryData.employees[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    inMemoryData.employees = inMemoryData.employees.filter((e) => e.id !== id && String(e._id) !== id);

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Employee.findOneAndDelete(query);
    }

    await logActivity('Deleted Employee', 'Employee', id, `Removed employee ID ${id} from directory.`, req.user, '#DC2626');

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 3. CANDIDATES & RECRUITMENT PIPELINE
// ============================================================================
export const getCandidates = async (req, res) => {
  try {
    const { search, status } = req.query;

    let items = [];
    if (isMongoActive()) {
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { currentRole: { $regex: search, $options: 'i' } },
          { technicalSkills: { $in: [new RegExp(search, 'i')] } },
        ];
      }
      if (status && status !== 'All') query.status = status;

      items = await Candidate.find(query).sort({ createdAt: -1 }).lean();
      if (items.length === 0 && !search && (!status || status === 'All')) {
        items = inMemoryData.candidates;
      }
    } else {
      items = inMemoryData.candidates.filter((cand) => {
        let match = true;
        if (search) {
          const s = search.toLowerCase();
          match =
            cand.name.toLowerCase().includes(s) ||
            cand.email.toLowerCase().includes(s) ||
            cand.currentRole.toLowerCase().includes(s) ||
            (cand.technicalSkills && cand.technicalSkills.some((sk) => sk.toLowerCase().includes(s)));
        }
        if (match && status && status !== 'All') {
          match = cand.status === status;
        }
        return match;
      });
    }

    res.json({ success: true, candidates: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, currentRole, technicalSkills, experience, expectedSalary, status, jobTitle, resumeUrl, notes } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Candidate name, email, and phone are required.' });
    }

    const skillsArray = Array.isArray(technicalSkills)
      ? technicalSkills
      : typeof technicalSkills === 'string'
      ? technicalSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newCand = {
      id: `cand_${Date.now()}`,
      name,
      email,
      phone,
      currentRole: currentRole || 'Software Engineer',
      technicalSkills: skillsArray,
      experience: Number(experience) || 0,
      expectedSalary: expectedSalary || 'Market Standard',
      status: status || 'Applied',
      jobTitle: jobTitle || 'General Technical Talent',
      resumeUrl: resumeUrl || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    inMemoryData.candidates.unshift(newCand);

    if (isMongoActive()) {
      await Candidate.create(newCand);
    }

    await logActivity('New Candidate Application', 'Candidate', newCand.id, `Candidate ${name} applied for ${newCand.jobTitle}.`, req.user, '#3478D4');

    res.status(201).json({ success: true, message: 'Candidate added successfully', candidate: newCand });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStages = ['Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'];
    if (!validStages.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStages.join(', ')}` });
    }

    const idx = inMemoryData.candidates.findIndex((c) => c.id === id || String(c._id) === id);
    let candidateName = 'Candidate';
    if (idx !== -1) {
      candidateName = inMemoryData.candidates[idx].name;
      inMemoryData.candidates[idx].status = status;
      inMemoryData.candidates[idx].updatedAt = new Date().toISOString();
    }

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Candidate.findOneAndUpdate(query, { status }, { new: true });
    }

    await logActivity('Candidate Stage Updated', 'Candidate', id, `${candidateName} moved to stage '${status}'.`, req.user, '#3478D4');

    res.json({ success: true, message: `Candidate stage updated to ${status}`, status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.technicalSkills && typeof updates.technicalSkills === 'string') {
      updates.technicalSkills = updates.technicalSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const idx = inMemoryData.candidates.findIndex((c) => c.id === id || String(c._id) === id);
    if (idx !== -1) {
      inMemoryData.candidates[idx] = { ...inMemoryData.candidates[idx], ...updates, updatedAt: new Date().toISOString() };
    }

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Candidate.findOneAndUpdate(query, updates, { new: true });
    }

    res.json({ success: true, message: 'Candidate updated successfully', candidate: inMemoryData.candidates[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    inMemoryData.candidates = inMemoryData.candidates.filter((c) => c.id !== id && String(c._id) !== id);

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Candidate.findOneAndDelete(query);
    }

    await logActivity('Candidate Deleted', 'Candidate', id, `Candidate ID ${id} removed from ATS pipeline.`, req.user, '#DC2626');

    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 4. CLIENTS CRUD
// ============================================================================
export const getClients = async (req, res) => {
  try {
    const { search, industry, status } = req.query;

    let items = [];
    if (isMongoActive()) {
      let query = {};
      if (search) {
        query.$or = [
          { companyName: { $regex: search, $options: 'i' } },
          { contactPerson: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      if (industry && industry !== 'All') query.industry = industry;
      if (status && status !== 'All') query.status = status;

      items = await Client.find(query).sort({ createdAt: -1 }).lean();
      if (items.length === 0 && !search && (!industry || industry === 'All') && (!status || status === 'All')) {
        items = inMemoryData.clients;
      }
    } else {
      items = inMemoryData.clients.filter((cli) => {
        let match = true;
        if (search) {
          const s = search.toLowerCase();
          match =
            cli.companyName.toLowerCase().includes(s) ||
            cli.contactPerson.toLowerCase().includes(s) ||
            cli.email.toLowerCase().includes(s);
        }
        if (match && industry && industry !== 'All') match = cli.industry === industry;
        if (match && status && status !== 'All') match = cli.status === status;
        return match;
      });
    }

    res.json({ success: true, clients: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, industry, status, location, contractType } = req.body;

    if (!companyName || !contactPerson || !email) {
      return res.status(400).json({ success: false, error: 'Company name, contact person, and email are required.' });
    }

    const newCli = {
      id: `cli_${Date.now()}`,
      companyName,
      contactPerson,
      email,
      phone: phone || '+1 (800) 555-0199',
      industry: industry || 'Technology & Software',
      status: status || 'Active',
      location: location || 'Remote / India',
      contractType: contractType || 'Staff Augmentation',
      activeRequirementsCount: 0,
      createdAt: new Date().toISOString(),
    };

    inMemoryData.clients.unshift(newCli);

    if (isMongoActive()) {
      await Client.create(newCli);
    }

    await logActivity('Client Account Added', 'Client', newCli.id, `Created corporate profile for ${companyName}.`, req.user);

    res.status(201).json({ success: true, message: 'Client created successfully', client: newCli });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const idx = inMemoryData.clients.findIndex((c) => c.id === id || String(c._id) === id);
    if (idx !== -1) {
      inMemoryData.clients[idx] = { ...inMemoryData.clients[idx], ...updates, updatedAt: new Date().toISOString() };
    }

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Client.findOneAndUpdate(query, updates, { new: true });
    }

    await logActivity('Client Updated', 'Client', id, `Updated information for ${updates.companyName || 'client'}.`, req.user);

    res.json({ success: true, message: 'Client updated successfully', client: inMemoryData.clients[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    inMemoryData.clients = inMemoryData.clients.filter((c) => c.id !== id && String(c._id) !== id);

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Client.findOneAndDelete(query);
    }

    await logActivity('Client Removed', 'Client', id, `Archived client account ID ${id}.`, req.user, '#DC2626');

    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 5. JOB REQUIREMENTS CRUD
// ============================================================================
export const getJobs = async (req, res) => {
  try {
    const { search, priority, status } = req.query;

    let items = [];
    if (isMongoActive()) {
      let query = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { client: { $regex: search, $options: 'i' } },
          { requiredSkills: { $in: [new RegExp(search, 'i')] } },
        ];
      }
      if (priority && priority !== 'All') query.priority = priority;
      if (status && status !== 'All') query.status = status;

      items = await JobRequirement.find(query).sort({ createdAt: -1 }).lean();
      if (items.length === 0 && !search && (!priority || priority === 'All') && (!status || status === 'All')) {
        items = inMemoryData.jobs;
      }
    } else {
      items = inMemoryData.jobs.filter((j) => {
        let match = true;
        if (search) {
          const s = search.toLowerCase();
          match =
            j.title.toLowerCase().includes(s) ||
            j.client.toLowerCase().includes(s) ||
            (j.requiredSkills && j.requiredSkills.some((sk) => sk.toLowerCase().includes(s)));
        }
        if (match && priority && priority !== 'All') match = j.priority === priority;
        if (match && status && status !== 'All') match = j.status === status;
        return match;
      });
    }

    res.json({ success: true, jobs: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, client, requiredSkills, experienceRequired, openingsCount, location, workMode, priority, status, budget } = req.body;

    if (!title || !client) {
      return res.status(400).json({ success: false, error: 'Job title and client name are required.' });
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : typeof requiredSkills === 'string'
      ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newJob = {
      id: `job_${Date.now()}`,
      title,
      client,
      requiredSkills: skillsArray,
      experienceRequired: Number(experienceRequired) || 3,
      openingsCount: Number(openingsCount) || 1,
      fulfilledCount: 0,
      location: location || 'Remote',
      workMode: workMode || 'Remote',
      priority: priority || 'Medium',
      status: status || 'Open',
      budget: budget || 'Competitive Market Rate',
      createdAt: new Date().toISOString(),
    };

    inMemoryData.jobs.unshift(newJob);

    if (isMongoActive()) {
      await JobRequirement.create(newJob);
    }

    await logActivity('Staffing Requisition Posted', 'Job', newJob.id, `Requisition created: ${title} for ${client}.`, req.user, '#D97706');

    res.status(201).json({ success: true, message: 'Job requirement posted successfully', job: newJob });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.requiredSkills && typeof updates.requiredSkills === 'string') {
      updates.requiredSkills = updates.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const idx = inMemoryData.jobs.findIndex((j) => j.id === id || String(j._id) === id);
    if (idx !== -1) {
      inMemoryData.jobs[idx] = { ...inMemoryData.jobs[idx], ...updates, updatedAt: new Date().toISOString() };
    }

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await JobRequirement.findOneAndUpdate(query, updates, { new: true });
    }

    res.json({ success: true, message: 'Job requirement updated successfully', job: inMemoryData.jobs[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    inMemoryData.jobs = inMemoryData.jobs.filter((j) => j.id !== id && String(j._id) !== id);

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await JobRequirement.findOneAndDelete(query);
    }

    await logActivity('Job Requirement Closed', 'Job', id, `Closed staffing requisition ID ${id}.`, req.user, '#DC2626');

    res.json({ success: true, message: 'Job requirement deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 6. PLACEMENTS CRUD
// ============================================================================
export const getPlacements = async (req, res) => {
  try {
    let items = [];
    if (isMongoActive()) {
      items = await Placement.find().sort({ createdAt: -1 }).lean();
      if (items.length === 0) items = inMemoryData.placements;
    } else {
      items = inMemoryData.placements;
    }
    res.json({ success: true, placements: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createPlacement = async (req, res) => {
  try {
    const { candidateOrEmployeeName, personType, clientName, jobTitle, deploymentDate, billingRate, durationMonths, assignmentStatus, notes } = req.body;

    if (!candidateOrEmployeeName || !clientName || !jobTitle) {
      return res.status(400).json({ success: false, error: 'Talent name, client name, and job title are required.' });
    }

    // Validation: prevent duplicate active placement for same candidate at same client
    const exists = inMemoryData.placements.some(
      (p) =>
        p.candidateOrEmployeeName.toLowerCase() === candidateOrEmployeeName.toLowerCase() &&
        p.clientName.toLowerCase() === clientName.toLowerCase() &&
        p.assignmentStatus === 'Active'
    );
    if (exists) {
      return res.status(400).json({ success: false, error: `An active placement already exists for ${candidateOrEmployeeName} at ${clientName}.` });
    }

    const newPlc = {
      id: `plc_${Date.now()}`,
      candidateOrEmployeeName,
      personType: personType || 'Employee',
      clientName,
      jobTitle,
      deploymentDate: deploymentDate || new Date().toISOString(),
      billingRate: Number(billingRate) || 6000,
      durationMonths: Number(durationMonths) || 6,
      assignmentStatus: assignmentStatus || 'Active',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    inMemoryData.placements.unshift(newPlc);

    // Update corresponding employee status to 'Deployed' if matches
    const empIdx = inMemoryData.employees.findIndex((e) => e.name.toLowerCase() === candidateOrEmployeeName.toLowerCase());
    if (empIdx !== -1) {
      inMemoryData.employees[empIdx].deploymentStatus = 'Deployed';
    }

    if (isMongoActive()) {
      await Placement.create(newPlc);
      await Employee.findOneAndUpdate({ name: candidateOrEmployeeName }, { deploymentStatus: 'Deployed' });
    }

    await logActivity('Talent Placed', 'Placement', newPlc.id, `Deployed ${candidateOrEmployeeName} to ${clientName} (${jobTitle}).`, req.user, '#008F68');

    res.status(201).json({ success: true, message: 'Placement created successfully', placement: newPlc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const idx = inMemoryData.placements.findIndex((p) => p.id === id || String(p._id) === id);
    if (idx !== -1) {
      inMemoryData.placements[idx] = { ...inMemoryData.placements[idx], ...updates, updatedAt: new Date().toISOString() };
    }

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Placement.findOneAndUpdate(query, updates, { new: true });
    }

    res.json({ success: true, message: 'Placement updated successfully', placement: inMemoryData.placements[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePlacement = async (req, res) => {
  try {
    const { id } = req.params;

    inMemoryData.placements = inMemoryData.placements.filter((p) => p.id !== id && String(p._id) !== id);

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Placement.findOneAndDelete(query);
    }

    await logActivity('Placement Ended', 'Placement', id, `Terminated deployment ID ${id}.`, req.user, '#DC2626');

    res.json({ success: true, message: 'Placement removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 7. CMS - WEBSITE PAGES MANAGEMENT
// ============================================================================
export const getCmsPages = async (req, res) => {
  try {
    let items = [];
    if (isMongoActive()) {
      items = await Page.find().sort({ updatedAt: -1 }).lean();
      if (items.length === 0) items = inMemoryData.pages;
    } else {
      items = inMemoryData.pages;
    }
    res.json({ success: true, pages: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCmsPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let page = null;
    if (isMongoActive()) {
      page = await Page.findOne({ slug }).lean();
    }
    if (!page) {
      page = inMemoryData.pages.find((p) => p.slug === slug);
    }
    if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
    res.json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createCmsPage = async (req, res) => {
  try {
    const { title, slug, category, content, metaTitle, metaDescription, ogImage, isIndexed, status } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ success: false, error: 'Page title, slug, and content are required.' });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');

    const duplicate = inMemoryData.pages.some((p) => p.slug === cleanSlug);
    if (duplicate) {
      return res.status(400).json({ success: false, error: `A page with URL slug '${cleanSlug}' already exists.` });
    }

    const newPg = {
      id: `pg_${Date.now()}`,
      title,
      slug: cleanSlug,
      category: category || 'Website Page',
      content,
      metaTitle: metaTitle || `${title} — ThinkWires`,
      metaDescription: metaDescription || '',
      ogImage: ogImage || '/images/about-hero.jpg',
      isIndexed: isIndexed !== undefined ? Boolean(isIndexed) : true,
      status: status || 'draft',
      lastUpdatedBy: req.user?.name || 'Admin',
      publishedAt: status === 'published' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryData.pages.push(newPg);

    if (isMongoActive()) {
      await Page.create(newPg);
    }

    await logActivity('Created CMS Page', 'CMS', newPg.id, `Created page '${title}' (${cleanSlug}).`, req.user, '#8064D8');

    res.status(201).json({ success: true, message: 'Page created successfully', page: newPg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCmsPage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const idx = inMemoryData.pages.findIndex((p) => p.id === id || String(p._id) === id || p.slug === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    if (updates.slug) {
      updates.slug = updates.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
      const conflict = inMemoryData.pages.some((p) => p.slug === updates.slug && p.id !== inMemoryData.pages[idx].id);
      if (conflict) {
        return res.status(400).json({ success: false, error: `Slug '${updates.slug}' is already taken by another page.` });
      }
    }

    updates.lastUpdatedBy = req.user?.name || 'Admin';
    updates.updatedAt = new Date().toISOString();
    if (updates.status === 'published' && !inMemoryData.pages[idx].publishedAt) {
      updates.publishedAt = new Date().toISOString();
    }

    inMemoryData.pages[idx] = { ...inMemoryData.pages[idx], ...updates };

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Page.findOneAndUpdate(query, updates, { new: true });
    }

    await logActivity('Updated CMS Page', 'CMS', id, `Saved edits for page '${inMemoryData.pages[idx].title}'.`, req.user, '#8064D8');

    res.json({ success: true, message: 'Page updated successfully', page: inMemoryData.pages[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const togglePublishCmsPage = async (req, res) => {
  try {
    const { id } = req.params;
    const idx = inMemoryData.pages.findIndex((p) => p.id === id || String(p._id) === id || p.slug === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Page not found' });

    const newStatus = inMemoryData.pages[idx].status === 'published' ? 'draft' : 'published';
    inMemoryData.pages[idx].status = newStatus;
    inMemoryData.pages[idx].updatedAt = new Date().toISOString();
    if (newStatus === 'published') {
      inMemoryData.pages[idx].publishedAt = new Date().toISOString();
    }

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Page.findOneAndUpdate(query, { status: newStatus, publishedAt: inMemoryData.pages[idx].publishedAt });
    }

    await logActivity('Page Status Changed', 'CMS', id, `Set page '${inMemoryData.pages[idx].title}' to ${newStatus}.`, req.user, '#8064D8');

    res.json({ success: true, message: `Page is now ${newStatus}`, status: newStatus, page: inMemoryData.pages[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteCmsPage = async (req, res) => {
  try {
    const { id } = req.params;
    const idx = inMemoryData.pages.findIndex((p) => p.id === id || String(p._id) === id || p.slug === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Page not found' });

    const title = inMemoryData.pages[idx].title;
    inMemoryData.pages.splice(idx, 1);

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Page.findOneAndDelete(query);
    }

    await logActivity('Deleted CMS Page', 'CMS', id, `Deleted website page '${title}'.`, req.user, '#DC2626');

    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 8. CMS - BLOG & ARTICLES MANAGEMENT
// ============================================================================
export const getCmsArticles = async (req, res) => {
  try {
    const { search, category, status } = req.query;

    let items = [];
    if (isMongoActive()) {
      let query = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { summary: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }
      if (category && category !== 'All') query.category = category;
      if (status && status !== 'All') query.status = status;

      items = await Article.find(query).sort({ createdAt: -1 }).lean();
      if (items.length === 0 && !search && (!category || category === 'All') && (!status || status === 'All')) {
        items = inMemoryData.articles;
      }
    } else {
      items = inMemoryData.articles.filter((art) => {
        let match = true;
        if (search) {
          const s = search.toLowerCase();
          match =
            art.title.toLowerCase().includes(s) ||
            art.summary.toLowerCase().includes(s) ||
            (art.tags && art.tags.some((t) => t.toLowerCase().includes(s)));
        }
        if (match && category && category !== 'All') match = art.category === category;
        if (match && status && status !== 'All') match = art.status === status;
        return match;
      });
    }

    res.json({ success: true, articles: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createCmsArticle = async (req, res) => {
  try {
    const { title, slug, summary, body, author, category, featuredImageUrl, tags, status } = req.body;

    if (!title || !summary || !body) {
      return res.status(400).json({ success: false, error: 'Article title, summary, and body content are required.' });
    }

    const cleanSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');

    const duplicate = inMemoryData.articles.some((a) => a.slug === cleanSlug);
    if (duplicate) {
      return res.status(400).json({ success: false, error: `An article with slug '${cleanSlug}' already exists.` });
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Staffing', 'Tech Insights'];

    const newArt = {
      id: `art_${Date.now()}`,
      title,
      slug: cleanSlug,
      summary,
      body,
      author: typeof author === 'object' ? author : { name: author || req.user?.name || 'ThinkWires Editorial', role: 'Staff Contributor' },
      category: category || 'Industry Insights',
      featuredImageUrl: featuredImageUrl || '/images/about-philosophy.jpg',
      tags: tagsArray,
      readTime: `${Math.max(2, Math.ceil(body.split(' ').length / 150))} min read`,
      viewsCount: 0,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryData.articles.unshift(newArt);

    if (isMongoActive()) {
      await Article.create(newArt);
    }

    await logActivity('Created Blog Article', 'CMS', newArt.id, `Authored article '${title}'.`, req.user, '#8064D8');

    res.status(201).json({ success: true, message: 'Article created successfully', article: newArt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCmsArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const idx = inMemoryData.articles.findIndex((a) => a.id === id || String(a._id) === id || a.slug === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Article not found' });

    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    updates.updatedAt = new Date().toISOString();
    if (updates.status === 'published' && !inMemoryData.articles[idx].publishedAt) {
      updates.publishedAt = new Date().toISOString();
    }

    inMemoryData.articles[idx] = { ...inMemoryData.articles[idx], ...updates };

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Article.findOneAndUpdate(query, updates, { new: true });
    }

    await logActivity('Updated Article', 'CMS', id, `Updated blog post '${inMemoryData.articles[idx].title}'.`, req.user, '#8064D8');

    res.json({ success: true, message: 'Article updated successfully', article: inMemoryData.articles[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const togglePublishCmsArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const idx = inMemoryData.articles.findIndex((a) => a.id === id || String(a._id) === id || a.slug === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Article not found' });

    const newStatus = inMemoryData.articles[idx].status === 'published' ? 'draft' : 'published';
    inMemoryData.articles[idx].status = newStatus;
    inMemoryData.articles[idx].updatedAt = new Date().toISOString();
    if (newStatus === 'published') {
      inMemoryData.articles[idx].publishedAt = new Date().toISOString();
    }

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Article.findOneAndUpdate(query, { status: newStatus, publishedAt: inMemoryData.articles[idx].publishedAt });
    }

    await logActivity('Article Status Toggled', 'CMS', id, `Article '${inMemoryData.articles[idx].title}' marked as ${newStatus}.`, req.user, '#8064D8');

    res.json({ success: true, message: `Article status changed to ${newStatus}`, status: newStatus });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteCmsArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const idx = inMemoryData.articles.findIndex((a) => a.id === id || String(a._id) === id || a.slug === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Article not found' });

    const title = inMemoryData.articles[idx].title;
    inMemoryData.articles.splice(idx, 1);

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Article.findOneAndDelete(query);
    }

    await logActivity('Deleted Article', 'CMS', id, `Removed blog post '${title}'.`, req.user, '#DC2626');

    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 9. CMS - MEDIA LIBRARY
// ============================================================================
export const getCmsMedia = async (req, res) => {
  try {
    let items = [];
    if (isMongoActive()) {
      items = await Media.find().sort({ createdAt: -1 }).lean();
      if (items.length === 0) items = inMemoryData.media;
    } else {
      items = inMemoryData.media;
    }
    res.json({ success: true, media: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createCmsMedia = async (req, res) => {
  try {
    const { title, fileUrl, fileType, fileSizeKb, dimensions, altText } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({ success: false, error: 'Title and file URL are required.' });
    }

    // Modular validation: file type & size sanity check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    const resolvedType = fileType || 'image/jpeg';
    if (!allowedTypes.includes(resolvedType)) {
      return res.status(400).json({ success: false, error: 'Unsupported file type. Must be JPEG, PNG, WEBP, SVG, or PDF.' });
    }

    const newMed = {
      id: `med_${Date.now()}`,
      title,
      fileUrl,
      fileType: resolvedType,
      fileSizeKb: Number(fileSizeKb) || 150,
      dimensions: dimensions || '1200x800',
      altText: altText || title,
      uploadedBy: req.user?.name || 'Admin',
      isDemo: true,
      createdAt: new Date().toISOString(),
    };

    inMemoryData.media.unshift(newMed);

    if (isMongoActive()) {
      await Media.create(newMed);
    }

    await logActivity('Uploaded Media Asset', 'CMS', newMed.id, `Added media asset: '${title}'.`, req.user, '#3478D4');

    res.status(201).json({ success: true, message: 'Media registered successfully (Demo storage workflow)', media: newMed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteCmsMedia = async (req, res) => {
  try {
    const { id } = req.params;

    inMemoryData.media = inMemoryData.media.filter((m) => m.id !== id && String(m._id) !== id);

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Media.findOneAndDelete(query);
    }

    res.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 10. CMS - SEO SETTINGS
// ============================================================================
export const getSeoSettings = async (req, res) => {
  try {
    const pages = isMongoActive() ? await Page.find().lean() : inMemoryData.pages;

    const seoList = (pages.length ? pages : inMemoryData.pages).map((p) => ({
      pageId: p.id || p._id,
      title: p.title,
      slug: p.slug,
      metaTitle: p.metaTitle || p.title,
      metaDescription: p.metaDescription || '',
      ogImage: p.ogImage || '/images/about-hero.jpg',
      isIndexed: p.isIndexed !== undefined ? p.isIndexed : true,
    }));

    res.json({
      success: true,
      globalSeo: {
        siteName: 'ThinkWires — Tech Manpower Supply & Global Staffing Aggregator',
        defaultMetaDescription: 'Enterprise IT manpower supply, specialized tech staffing, and compliant cross-border Employer of Record (EOR) infrastructure.',
        canonicalBaseUrl: 'https://thinkwires.com',
        indexingGlobal: true,
      },
      pageSeo: seoList,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateSeoSettings = async (req, res) => {
  try {
    const { pageId, metaTitle, metaDescription, ogImage, isIndexed } = req.body;

    const idx = inMemoryData.pages.findIndex((p) => p.id === pageId || String(p._id) === pageId);
    if (idx !== -1) {
      if (metaTitle !== undefined) inMemoryData.pages[idx].metaTitle = metaTitle;
      if (metaDescription !== undefined) inMemoryData.pages[idx].metaDescription = metaDescription;
      if (ogImage !== undefined) inMemoryData.pages[idx].ogImage = ogImage;
      if (isIndexed !== undefined) inMemoryData.pages[idx].isIndexed = Boolean(isIndexed);
      inMemoryData.pages[idx].updatedAt = new Date().toISOString();
    }

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(pageId) ? { _id: pageId } : { id: pageId };
      await Page.findOneAndUpdate(query, { metaTitle, metaDescription, ogImage, isIndexed });
    }

    await logActivity('Updated SEO Metadata', 'CMS', pageId, `Saved SEO preferences for page ID ${pageId}.`, req.user, '#8064D8');

    res.json({ success: true, message: 'SEO configuration persisted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 11. CMS - ANNOUNCEMENTS
// ============================================================================
export const getAnnouncements = async (req, res) => {
  try {
    let items = [];
    if (isMongoActive()) {
      items = await Announcement.find().sort({ createdAt: -1 }).lean();
      if (items.length === 0) items = inMemoryData.announcements;
    } else {
      items = inMemoryData.announcements;
    }
    res.json({ success: true, announcements: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, audience, priority, status, activeUntil } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Announcement title and message are required.' });
    }

    const newAnn = {
      id: `ann_${Date.now()}`,
      title,
      message,
      audience: audience || 'All',
      priority: priority || 'Normal',
      status: status || 'published',
      activeUntil: activeUntil || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      author: req.user?.name || 'Operations Lead',
      createdAt: new Date().toISOString(),
    };

    inMemoryData.announcements.unshift(newAnn);

    if (isMongoActive()) {
      await Announcement.create(newAnn);
    }

    await logActivity('Created Announcement', 'CMS', newAnn.id, `Broadcasted: '${title}'.`, req.user, '#D97706');

    res.status(201).json({ success: true, message: 'Announcement created successfully', announcement: newAnn });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const togglePublishAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const idx = inMemoryData.announcements.findIndex((a) => a.id === id || String(a._id) === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Announcement not found' });

    const newStatus = inMemoryData.announcements[idx].status === 'published' ? 'draft' : 'published';
    inMemoryData.announcements[idx].status = newStatus;

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Announcement.findOneAndUpdate(query, { status: newStatus });
    }

    res.json({ success: true, message: `Announcement set to ${newStatus}`, status: newStatus });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    inMemoryData.announcements = inMemoryData.announcements.filter((a) => a.id !== id && String(a._id) !== id);

    if (isMongoActive()) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
      await Announcement.findOneAndDelete(query);
    }

    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 12. CMS DASHBOARD STATS
// ============================================================================
export const getCmsStats = async (req, res) => {
  try {
    let pages = isMongoActive() ? await Page.find().lean() : inMemoryData.pages;
    let articles = isMongoActive() ? await Article.find().lean() : inMemoryData.articles;
    let media = isMongoActive() ? await Media.find().lean() : inMemoryData.media;
    let announcements = isMongoActive() ? await Announcement.find().lean() : inMemoryData.announcements;

    if (!pages.length) pages = inMemoryData.pages;
    if (!articles.length) articles = inMemoryData.articles;
    if (!media.length) media = inMemoryData.media;
    if (!announcements.length) announcements = inMemoryData.announcements;

    const totalPages = pages.length;
    const publishedPages = pages.filter((p) => p.status === 'published').length;
    const draftPages = pages.filter((p) => p.status === 'draft').length;

    const totalArticles = articles.length;
    const publishedArticles = articles.filter((a) => a.status === 'published').length;
    const draftArticles = articles.filter((a) => a.status === 'draft').length;

    const recentUpdates = [...pages, ...articles]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 6)
      .map((item) => ({
        id: item.id || item._id,
        title: item.title,
        type: item.slug && item.body ? 'Blog Article' : 'Website Page',
        slug: item.slug,
        status: item.status,
        lastUpdatedBy: item.lastUpdatedBy || (item.author && item.author.name) || 'Admin',
        updatedAt: item.updatedAt || item.createdAt,
      }));

    res.json({
      success: true,
      stats: {
        totalPages,
        publishedPages,
        draftPages,
        totalArticles,
        publishedArticles,
        draftArticles,
        totalMedia: media.length,
        totalAnnouncements: announcements.length,
      },
      recentUpdates,
      publishingActivity: inMemoryData.activities.filter((a) => a.entityType === 'CMS').slice(0, 5),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================================
// 13. ACTIVITIES & USER AUTH CONTEXT
// ============================================================================
export const getActivities = async (req, res) => {
  try {
    let items = [];
    if (isMongoActive()) {
      items = await Activity.find().sort({ createdAt: -1 }).limit(30).lean();
      if (items.length === 0) items = inMemoryData.activities;
    } else {
      items = inMemoryData.activities;
    }
    res.json({ success: true, activities: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
    availableRoles: [
      { role: 'admin', label: 'Admin (Full Management & System Access)' },
      { role: 'editor', label: 'Editor (Content Management & Requisitions)' },
      { role: 'viewer', label: 'Viewer (Read-Only Auditor Access)' },
    ],
    databaseStatus: isMongoActive() ? 'Connected (MongoDB Atlas / Local)' : 'In-Memory Resilient Storage (Fallback)',
  });
};
