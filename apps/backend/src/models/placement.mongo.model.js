import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
  {
    candidateOrEmployeeName: {
      type: String,
      required: [true, 'Candidate or employee name is required'],
      trim: true,
    },
    personType: {
      type: String,
      enum: ['Employee', 'Candidate'],
      default: 'Employee',
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobRequirement',
      default: null,
    },
    deploymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    billingRate: {
      type: Number,
      required: true,
      default: 4500, // Monthly or hourly rate
    },
    durationMonths: {
      type: Number,
      default: 6,
    },
    assignmentStatus: {
      type: String,
      enum: ['Active', 'Completed', 'Terminated', 'Extended'],
      default: 'Active',
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

const Placement = mongoose.models.Placement || mongoose.model('Placement', placementSchema);

export default Placement;
