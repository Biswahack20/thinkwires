import fs from 'fs';

const content = fs.readFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/api.route.js', 'utf8');
const lines = content.split('\n');

const getRange = (start, end) => lines.slice(start - 1, end).join('\n');

// 1. bench.route.js (Lines 987 to 1604)
const benchCode = `import express from 'express';
import mongoose from 'mongoose';
import Candidate from '../models/candidate.mongo.model.js';
import JobApplication from '../models/jobApplication.mongo.model.js';
import { loadSeedJson } from '../utils/seedLoader.js';
import rateLimit from 'express-rate-limit';
import { calculateCandidatePricing, parseNoticeDays } from '../utils/pricing.utils.js';
import Page from '../models/page.mongo.model.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

const mockData = loadSeedJson('mockData.json', {}) || {};
const { benchData = null } = mockData;

let bench = benchData
  ? { ...benchData }
  : {
      statsBadges: [],
      specialtyFilters: [],
      talents: [],
      dossierFeatures: [],
      vettingGates: [],
    };

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
      console.warn(\`Error reading page '\${slug}' from MongoDB:\`, err.message);
    }
  }
  return fallback;
};

const router = express.Router();

${getRange(987, 1604)}

export default router;
`;
fs.writeFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/bench.route.js', benchCode);
console.log('Created bench.route.js');

// 2. industries.route.js (Lines 473 to 625)
const industriesCode = `import express from 'express';
import mongoose from 'mongoose';
import Page from '../models/page.mongo.model.js';
import { loadSeedJson } from '../utils/seedLoader.js';
import requireAuth from '../middlewares/auth.middleware.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

const mockData = loadSeedJson('mockData.json', {}) || {};
const {
  industriesData = [],
  industriesPageData = null,
  industriesDetails = null,
} = mockData;

let industries = [...(industriesData || [])];
let currentIndustriesPageData = industriesPageData
  ? { ...industriesPageData }
  : {};

const adminAuthGuard = requireAuth(['superadmin', 'admin', 'cms_admin']);
const getMockData = () => loadSeedJson('mockData.json', mockData);

const getHomeSection = async (sectionKey, fallbackValue) => {
  if (isMongoActive()) {
    try {
      const homePage = await Page.findOne({ slug: 'home' }).lean();
      if (homePage?.data && homePage.data[sectionKey] !== undefined) {
        return homePage.data[sectionKey];
      }
    } catch (err) {
      console.warn(
        \`Error reading home section '\${sectionKey}' from MongoDB:\`,
        err.message
      );
    }
  }
  return fallbackValue;
};

const router = express.Router();

${getRange(473, 625)}

export default router;
`;
fs.writeFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/industries.route.js', industriesCode);
console.log('Created industries.route.js');

// 3. services.route.js (Lines 2002 to 2298)
const servicesCode = `import express from 'express';
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
      console.warn(\`Error reading page '\${slug}' from MongoDB:\`, err.message);
    }
  }
  return fallback;
};

const router = express.Router();

${getRange(2002, 2298)}

export default router;
`;
fs.writeFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/services.route.js', servicesCode);
console.log('Created services.route.js');

// 4. contact.route.js (Lines 704 to 733, 865 to 971, and 1930 to 2001)
const contactCode = `import express from 'express';
import mongoose from 'mongoose';
import Page from '../models/page.mongo.model.js';
import Activity from '../models/activity.mongo.model.js';
import { logger } from '../utils/logger.js';
import { loadSeedJson } from '../utils/seedLoader.js';
import rateLimit from 'express-rate-limit';
import requireAuth from '../middlewares/auth.middleware.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

const mockData = loadSeedJson('mockData.json', {}) || {};
const { contactData = null, aboutData = null } = mockData;

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
      console.warn(\`Error reading page '\${slug}' from MongoDB:\`, err.message);
    }
  }
  return fallback;
};

const router = express.Router();

${getRange(704, 733)}

${getRange(865, 971)}

// Fallback dataset for company/contact
const aboutDataset = {
  contact: {
    headline: 'Ready to Build Your High-Velocity Engineering Squad?',
    description:
      'Book a 20-minute workforce strategy consultation with our staffing directors to audit your technical requirements and receive benchmark rates for India and North America.',
    headquarters: {
      title: 'Global Corporate Headquarters',
      address:
        'Plot No. 20, Block H-1/A, Sector 63, Noida, Uttar Pradesh 201301',
    },
    phones: [],
    email: 'info@thinkwires.com',
    hours: 'Monday - Friday: 9:00 AM - 7:00 PM IST (EST/PST Overlap Supported)',
  },
};

${getRange(1930, 2001)}

export default router;
`;
fs.writeFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/contact.route.js', contactCode);
console.log('Created contact.route.js');

// 5. articles.route.js (Lines 734 to 864)
const articlesCode = `import express from 'express';
import mongoose from 'mongoose';
import Article from '../models/article.mongo.model.js';
import Page from '../models/page.mongo.model.js';
import { loadSeedJson } from '../utils/seedLoader.js';
import rateLimit from 'express-rate-limit';

const isMongoActive = () => mongoose.connection.readyState === 1;

const mockData = loadSeedJson('mockData.json', {}) || {};
const {
  articlesData = [],
  featuredArticleData = null,
  researchersData = [],
} = mockData;

let articles = articlesData ? [...articlesData] : [];
let featuredArticle = featuredArticleData ? { ...featuredArticleData } : null;
let researchers = researchersData ? [...researchersData] : [];

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

const getHomeSection = async (sectionKey, fallbackValue) => {
  if (isMongoActive()) {
    try {
      const homePage = await Page.findOne({ slug: 'home' }).lean();
      if (homePage?.data && homePage.data[sectionKey] !== undefined) {
        return homePage.data[sectionKey];
      }
    } catch (err) {
      console.warn(
        \`Error reading home section '\${sectionKey}' from MongoDB:\`,
        err.message
      );
    }
  }
  return fallbackValue;
};

const router = express.Router();

${getRange(734, 864)}

export default router;
`;
fs.writeFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/articles.route.js', articlesCode);
console.log('Created articles.route.js');

