import mongoose from 'mongoose';

const techStackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Technology name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        'Cloud & Infrastructure',
        'DevOps & Cloud Native',
        'Modern Fullstack & AI',
        'ERP & Enterprise Core',
        'Data & Analytics',
        'Security & Compliance',
        'Other',
      ],
      default: 'Cloud & Infrastructure',
    },
    icon: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
techStackSchema.index({ slug: 1 });
techStackSchema.index({ category: 1, order: 1 });

const TechStack = mongoose.models.TechStack || mongoose.model('TechStack', techStackSchema);

export default TechStack;
