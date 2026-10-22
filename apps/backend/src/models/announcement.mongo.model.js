import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Announcement message is required'],
      trim: true,
    },
    audience: {
      type: String,
      enum: ['All', 'Clients', 'Staff', 'Public'],
      default: 'All',
    },
    priority: {
      type: String,
      enum: ['Normal', 'Important', 'Urgent'],
      default: 'Normal',
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    activeUntil: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    author: {
      type: String,
      default: 'Operations Lead',
    },
  },
  {
    timestamps: true,
  }
);

const Announcement =
  mongoose.models.Announcement ||
  mongoose.model('Announcement', announcementSchema);

export default Announcement;
