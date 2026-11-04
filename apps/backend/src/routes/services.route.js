import express from 'express';
import mongoose from 'mongoose';
import Page from '../models/page.mongo.model.js';
import { loadSeedJson } from '../utils/seedLoader.js';
import rateLimit from 'express-rate-limit';
import requireAuth from '../middlewares/auth.middleware.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

const mockData = loadSeedJson('mockData.json', {}) || {};
const {
  payrollData = null,
  eorData = null,
  staffAugmentationData = null,
  permanentStaffingData = null,
} = mockData;

let currentPayrollData = payrollData ? { ...payrollData } : null;
let currentEorData = eorData ? { ...eorData } : null;
let currentStaffAugmentationData = staffAugmentationData
  ? { ...staffAugmentationData }
  : null;
let currentPermanentStaffingData = permanentStaffingData
  ? { ...permanentStaffingData }
  : null;

const adminAuthGuard = requireAuth(['superadmin', 'admin', 'cms_admin']);

const publicSubmissionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
    forwardedHeader: false,
  },
  message: {
    success: false,
    error: 'Too many requests from this network. Please wait a few minutes before submitting again.',
  },
});

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

const router = express.Router();

// --- Payroll Outsourcing Endpoints ---
router.get('/payroll', async (req, res) => {
  const result = await getPageDataBySlug(
    'services-payroll',
    currentPayrollData
  );
  res.json(result);
});

router.post('/payroll', adminAuthGuard, async (req, res) => {
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
    res.json({
      message: 'Payroll data updated successfully',
      payrollData: currentPayrollData,
    });
  } else {
    res.status(400).json({ error: 'payrollData object is required in body' });
  }
});

router.post('/payroll/consultation', publicSubmissionRateLimiter, (req, res) => {
  const {
    companyName,
    fullName,
    employeeSize,
    serviceReq,
    phoneNumber,
    emailAddress,
  } = req.body;
  if (!companyName || !fullName || !emailAddress) {
    return res
      .status(400)
      .json({ error: 'Company name, full name, and email are required.' });
  }
  console.log('[Payroll] New Consultation Request:', {
    companyName,
    fullName,
    employeeSize,
    serviceReq,
    phoneNumber,
    emailAddress,
  });
  res.json({
    success: true,
    message:
      'Thank you! Your payroll consultation request has been queued. Our compliance lead will call within 120 minutes.',
  });
});

// --- Employer of Record (EOR) Endpoints ---
router.get('/eor', async (req, res) => {
  const result = await getPageDataBySlug('services-eor', currentEorData);
  res.json(result);
});

router.post('/eor', adminAuthGuard, async (req, res) => {
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
    res.json({
      message: 'EOR data updated successfully',
      eorData: currentEorData,
    });
  } else {
    res.status(400).json({ error: 'eorData object is required in body' });
  }
});

router.post('/eor/consultation', publicSubmissionRateLimiter, (req, res) => {
  const {
    fullName,
    workEmail,
    companyName,
    targetGeo,
    headcount,
    projectDetails,
  } = req.body;
  if (!fullName || !workEmail || !companyName) {
    return res
      .status(400)
      .json({ error: 'Full name, work email, and company name are required.' });
  }
  console.log('[EOR] New Consultation Request:', {
    fullName,
    workEmail,
    companyName,
    targetGeo,
    headcount,
    projectDetails,
  });
  res.json({
    success: true,
    message:
      'Thank you! Your EOR workforce consultation request has been received. Our Global Compliance Specialist will reach out within 4 hours.',
  });
});

// --- Staff Augmentation Endpoints ---
router.get('/staff-augmentation', async (req, res) => {
  const result = await getPageDataBySlug(
    'services-staff-augmentation',
    currentStaffAugmentationData
  );
  res.json(result);
});

router.post('/staff-augmentation', adminAuthGuard, async (req, res) => {
  if (req.body.staffAugmentationData) {
    currentStaffAugmentationData = {
      ...currentStaffAugmentationData,
      ...req.body.staffAugmentationData,
    };
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'services-staff-augmentation' },
          { $set: { data: currentStaffAugmentationData } },
          { upsert: true }
        );
      } catch (err) {
        console.warn(
          'Could not persist staffAugmentationData to MongoDB:',
          err.message
        );
      }
    }
    res.json({
      message: 'Staff augmentation data updated successfully',
      staffAugmentationData: currentStaffAugmentationData,
    });
  } else {
    res
      .status(400)
      .json({ error: 'staffAugmentationData object is required in body' });
  }
});

router.post('/staff-augmentation/consultation', publicSubmissionRateLimiter, (req, res) => {
  const { name, email, phone, company, roleNeeded, preferredTime, details } =
    req.body;
  if (!name || !email || !company) {
    return res
      .status(400)
      .json({ error: 'Name, email, and company name are required.' });
  }
  console.log('[Staff Augmentation] New Strategy Request:', {
    name,
    email,
    phone,
    company,
    roleNeeded,
    preferredTime,
    details,
  });
  res.json({
    success: true,
    message:
      'Thank you! Your workforce consultation request has been received. A Senior Talent Architect will reach out within 5 hours.',
  });
});

// --- Permanent Staffing & Executive Search Endpoints ---
router.get('/permanent-staffing', async (req, res) => {
  const result = await getPageDataBySlug(
    'services-permanent-staffing',
    currentPermanentStaffingData
  );
  res.json(result);
});

router.get('/executive-search', async (req, res) => {
  const result = await getPageDataBySlug(
    'services-permanent-staffing',
    currentPermanentStaffingData
  );
  res.json(result);
});

router.post('/permanent-staffing', adminAuthGuard, async (req, res) => {
  if (req.body.permanentStaffingData) {
    currentPermanentStaffingData = {
      ...currentPermanentStaffingData,
      ...req.body.permanentStaffingData,
    };
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'services-permanent-staffing' },
          { $set: { data: currentPermanentStaffingData } },
          { upsert: true }
        );
      } catch (err) {
        console.warn(
          'Could not persist permanentStaffingData to MongoDB:',
          err.message
        );
      }
    }
    res.json({
      message: 'Permanent staffing data updated successfully',
      permanentStaffingData: currentPermanentStaffingData,
    });
  } else {
    res
      .status(400)
      .json({ error: 'permanentStaffingData object is required in body' });
  }
});

router.post('/permanent-staffing/consultation', publicSubmissionRateLimiter, (req, res) => {
  const {
    fullName,
    workEmail,
    companyName,
    directPhone,
    mandateHierarchy,
    targetTimeline,
    mandateScope,
    isConfidential,
  } = req.body;
  if (!fullName || !workEmail || !companyName) {
    return res
      .status(400)
      .json({ error: 'Full name, work email, and company name are required.' });
  }
  console.log('[Executive Search] New Mandate Request:', {
    fullName,
    workEmail,
    companyName,
    directPhone,
    mandateHierarchy,
    targetTimeline,
    mandateScope,
    isConfidential,
  });
  res.json({
    success: true,
    message:
      'Thank you! Your confidential executive search mandate has been registered. A Managing Partner will connect within 2 hours.',
  });
});

router.post('/executive-search/consultation', publicSubmissionRateLimiter, (req, res) => {
  const {
    fullName,
    workEmail,
    companyName,
    directPhone,
    mandateHierarchy,
    targetTimeline,
    mandateScope,
    isConfidential,
  } = req.body;
  if (!fullName || !workEmail || !companyName) {
    return res
      .status(400)
      .json({ error: 'Full name, work email, and company name are required.' });
  }
  console.log('[Executive Search] New Mandate Request:', {
    fullName,
    workEmail,
    companyName,
    directPhone,
    mandateHierarchy,
    targetTimeline,
    mandateScope,
    isConfidential,
  });
  res.json({
    success: true,
    message:
      'Thank you! Your confidential executive search mandate has been registered. A Managing Partner will connect within 2 hours.',
  });
});


export default router;
