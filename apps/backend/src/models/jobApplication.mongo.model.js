import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: [true, 'Candidate ID is required'],
      index: true,
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    candidateEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    candidatePhone: {
      type: String,
      default: '',
      trim: true,
    },
    jobId: {
      type: String, // Accepts both string ID (from mock/seed jobs) and ObjectId
      required: [true, 'Job identifier is required'],
      index: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    department: {
      type: String,
      default: 'Engineering',
    },
    location: {
      type: String,
      default: 'Remote',
    },
    experience: {
      type: String,
      default: '3 - 5 Years',
    },
    skills: {
      type: [String],
      default: [],
    },
    coverLetter: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'],
      default: 'Applied',
    },
    stage: {
      type: String,
      default: 'Resume Review',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index so a candidate cannot accidentally apply twice for the exact same job
jobApplicationSchema.index({ candidate: 1, jobId: 1 }, { unique: true });

const JobApplication =
  mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
