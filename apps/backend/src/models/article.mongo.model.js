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
    summary: {
      type: String,
      required: [true, 'Article summary is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Article body is required'],
    },
    author: {
      name: {
        type: String,
        default: 'ThinkWires Research Team',
      },
      role: {
        type: String,
        default: 'Editorial Director',
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
      enum: ['published', 'draft'],
      default: 'published',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);

export default Article;
