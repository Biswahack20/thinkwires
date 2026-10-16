import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Company email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      default: 'Information Technology',
    },
    status: {
      type: String,
      enum: ['Active', 'Onboarding', 'Pending', 'Inactive'],
      default: 'Active',
    },
    location: {
      type: String,
      default: 'Bangalore, India',
    },
    contractType: {
      type: String,
      default: 'Staff Augmentation / Retainer',
    },
    activeRequirementsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

export default Client;
