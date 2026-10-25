import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entityType: {
      type: String,
      enum: [
        'Employee',
        'Candidate',
        'Client',
        'Job',
        'Placement',
        'CMS',
        'Security',
        'Security RBAC',
        'System',
      ],
      default: 'Employee',
    },
    entityId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      name: { type: String, default: 'Admin User' },
      role: { type: String, default: 'admin' },
    },
    badgeColor: {
      type: String,
      default: '#008F68',
    },
  },
  {
    timestamps: true,
  }
);

const Activity =
  mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;
