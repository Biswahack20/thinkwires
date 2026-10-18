import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Page slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      default: 'Core Website',
    },
    content: {
      type: String,
      default: '',
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    ogImage: {
      type: String,
      default: '/images/about-hero.jpg',
    },
    isIndexed: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    lastUpdatedBy: {
      type: String,
      default: 'Admin',
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

const Page = mongoose.models.Page || mongoose.model('Page', pageSchema);

export default Page;
