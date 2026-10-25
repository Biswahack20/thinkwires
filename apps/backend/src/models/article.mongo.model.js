import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Article slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    articleId: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
      trim: true,
    },
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    body: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: '',
    },
    badgeBg: {
      type: String,
      default: '',
    },
    badgeColor: {
      type: String,
      default: '',
    },
    subCategory: {
      type: String,
      default: '',
    },
    telemetry: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    categories: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    primaryFinding: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        name: 'Thinkwires Research Team',
        role: 'Editorial Director',
      },
    },
    category: {
      type: String,
      default: 'Talent Engineering',
    },
    featuredImageUrl: {
      type: String,
      default: '/images/about-philosophy.jpg',
    },
    tags: {
      type: [String],
      default: ['Staffing', 'Tech Trends', 'Global Delivery'],
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'published',
    },
    publishedAt: {
      type: mongoose.Schema.Types.Mixed,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Article =
  mongoose.models.Article || mongoose.model('Article', articleSchema);

export default Article;
