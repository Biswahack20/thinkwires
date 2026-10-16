import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Media title is required'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true,
    },
    fileType: {
      type: String,
      enum: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'],
      default: 'image/jpeg',
    },
    fileSizeKb: {
      type: Number,
      default: 120,
    },
    dimensions: {
      type: String,
      default: '1200x800',
    },
    altText: {
      type: String,
      default: 'ThinkWires Media Asset',
    },
    uploadedBy: {
      type: String,
      default: 'Admin',
    },
    isDemo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

export default Media;
