import mongoose from 'mongoose';

const jobRequirementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    client: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      default: null,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    experienceRequired: {
      type: Number,
      required: true,
      min: 0,
    },
    openingsCount: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    fulfilledCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: 'Remote (India/US)',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'Onsite'],
      default: 'Remote',
    },
    priority: {
      type: String,
      enum: ['Urgent', 'High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Fulfilled', 'Closed'],
      default: 'Open',
    },
    budget: {
      type: String,
      default: 'Competitive CTC',
    },
    targetCloseDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

const JobRequirement =
  mongoose.models.JobRequirement || mongoose.model('JobRequirement', jobRequirementSchema);

export default JobRequirement;
