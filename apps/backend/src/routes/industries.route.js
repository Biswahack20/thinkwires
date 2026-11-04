import express from 'express';
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
        `Error reading home section '${sectionKey}' from MongoDB:`,
        err.message
      );
    }
  }
  return fallbackValue;
};

const router = express.Router();

// --- Industries (Home summary) ---
router.get('/industries', async (req, res) => {
  const result = await getHomeSection('industries', industries);
  res.json(result);
});
router.post('/industries', adminAuthGuard, async (req, res) => {
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
  const fresh = getMockData();
  const data = (currentIndustriesPageData && currentIndustriesPageData.sectors?.length >= 11)
    ? currentIndustriesPageData
    : (fresh.industriesPageData || currentIndustriesPageData);
  res.json(data);
});

router.get('/sector-catalog', async (req, res) => {
  if (isMongoActive()) {
    try {
      const page = await Page.findOne({ slug: 'industries' }).lean();
      if (page?.data?.sectors) return res.json(page.data.sectors);
    } catch (err) {
      console.warn('Error querying sector-catalog from MongoDB:', err.message);
    }
  }
  const fresh = getMockData();
  const sectors = (currentIndustriesPageData && currentIndustriesPageData.sectors?.length >= 11)
    ? currentIndustriesPageData.sectors
    : (fresh.industriesPageData?.sectors || []);
  res.json(sectors);
});

router.post('/industries-page', adminAuthGuard, async (req, res) => {
  if (req.body.industriesPageData) {
    currentIndustriesPageData = {
      ...currentIndustriesPageData,
      ...req.body.industriesPageData,
    };
    if (isMongoActive()) {
      try {
        await Page.findOneAndUpdate(
          { slug: 'industries' },
          { $set: { data: currentIndustriesPageData } },
          { upsert: true }
        );
      } catch (err) {
        console.warn(
          'Could not persist industries page to MongoDB:',
          err.message
        );
      }
    }
    res.json({
      message: 'Industries page data updated successfully',
      industriesPageData: currentIndustriesPageData,
    });
  } else {
    res
      .status(400)
      .json({ error: 'industriesPageData object is required in body' });
  }
});

// --- Individual Industry Subpage (CMS Manageable) ---
router.get('/industries/:slug', async (req, res) => {
  const { slug } = req.params;
  const pageSlug = `industries/${slug}`;
  if (isMongoActive()) {
    try {
      const page = await Page.findOne({
        $or: [{ slug: pageSlug }, { slug }]
      }).lean();
      if (page?.data && Object.keys(page.data).length > 0) {
        return res.json(page.data);
      }
    } catch (err) {
      console.warn(`Error querying industry ${slug} from MongoDB:`, err.message);
    }
  }
  const fresh = getMockData();
  const fallback = (fresh.industriesDetails && fresh.industriesDetails[slug]) || (industriesDetails && industriesDetails[slug]) || null;
  res.json({ dynamic: false, data: fallback });
});

router.post('/industries/:slug', adminAuthGuard, async (req, res) => {
  const { slug } = req.params;
  const pageSlug = `industries/${slug}`;
  const industryData = req.body.industryData || req.body;
  if (!industryData || Object.keys(industryData).length === 0) {
    return res.status(400).json({ error: 'industryData object is required in body' });
  }

  if (isMongoActive()) {
    try {
      await Page.findOneAndUpdate(
        { slug: pageSlug },
        {
          $set: {
            title: industryData.title || slug,
            category: 'Industry Sectors',
            data: industryData,
            metaTitle: industryData.metaTitle || `${industryData.title || slug} | Thinkwires`,
            metaDescription: industryData.metaDescription || industryData.shortDesc || '',
            status: 'published',
          },
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn(`Could not persist industry ${slug} to MongoDB:`, err.message);
    }
  }

  res.json({
    message: `Industry ${slug} updated successfully`,
    industryData,
  });
});


export default router;
