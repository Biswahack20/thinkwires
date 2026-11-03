import express from 'express';
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
        `Error reading home section '${sectionKey}' from MongoDB:`,
        err.message
      );
    }
  }
  return fallbackValue;
};

const router = express.Router();

// --- Blog & Articles ---
router.get('/articles', async (req, res) => {
  const { q, category } = req.query;
  let sourceArticles = articles;
  if (isMongoActive()) {
    try {
      const dbArticles = await Article.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .lean();
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
        (art.author &&
          (typeof art.author === 'string' ? art.author : art.author.name || '')
            .toLowerCase()
            .includes(query)) ||
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
      const feat = await Article.findOne({
        featured: true,
        status: 'published',
      }).lean();
      if (feat) {
        return res.json({
          ...feat,
          id: feat.articleId || feat.slug || feat._id,
        });
      }
    } catch (dbErr) {
      console.warn(
        'Error reading featured article from MongoDB:',
        dbErr.message
      );
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
        ? {
            $or: [
              { _id: targetId },
              { slug: targetId },
              { articleId: targetId },
            ],
          }
        : { $or: [{ slug: targetId }, { articleId: targetId }] };
      const art = await Article.findOne(query).lean();
      if (art) {
        return res.json({ ...art, id: art.articleId || art.slug || art._id });
      }
    } catch (dbErr) {
      console.warn('Error loading article from MongoDB:', dbErr.message);
    }
  }

  const article = articles.find(
    (art) => art.id === targetId || art.slug === targetId
  );
  if (article) {
    res.json(article);
  } else if (
    featuredArticle &&
    (featuredArticle.id === targetId || featuredArticle.slug === targetId)
  ) {
    res.json(featuredArticle);
  } else {
    res.status(404).json({ error: 'Article not found' });
  }
});

router.post('/articles/newsletter', publicSubmissionRateLimiter, (req, res) => {
  const { email, role } = req.body;
  if (email && email.includes('@')) {
    console.log('New Benchmark Dispatch Newsletter Subscription:', {
      email,
      role,
    });
    res.json({
      success: true,
      message: 'Subscribed to Benchmark Dispatch successfully!',
    });
  } else {
    res.status(400).json({ error: 'Valid email is required' });
  }
});


export default router;
