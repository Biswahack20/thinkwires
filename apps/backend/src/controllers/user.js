import User from '../models/user.model.js';
import UserMongo from '../models/user.mongo.model.js';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

/**
 * User Controller
 * Provides standardized user profile and directory operations with dual-persistence support.
 */

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const userEmail = req.user?.email;

    if (!userId && !userEmail) {
      return res
        .status(401)
        .json({
          success: false,
          error: 'Unauthorized: No active user session.',
        });
    }

    let user = null;

    // 1. Query Canonical Primary Store (MongoDB) (Issue #186)
    if (isMongoActive()) {
      user = userId
        ? await UserMongo.findById(userId).select('-password').lean()
        : await UserMongo.findOne({ email: userEmail.toLowerCase() })
          .select('-password')
          .lean();
    }

    // 2. Query Secondary Relational Store (PostgreSQL) if absent or offline
    if (!user) {
      try {
        const pgUser = userId
          ? await User.findByPk(userId)
          : await User.findOne({ where: { email: userEmail.toLowerCase() } });
        if (pgUser) {
          user = typeof pgUser.toJSON === 'function' ? pgUser.toJSON() : pgUser;
          // Opportunistic sync to MongoDB if active
          if (isMongoActive() && user.email) {
            UserMongo.findOneAndUpdate(
              { email: user.email.toLowerCase() },
              { $setOnInsert: user },
              { upsert: true }
            ).catch(() => { });
          }
        }
      } catch (pgErr) {
        logger.warn('[DualDB] PostgreSQL lookup non-blocking notice:', pgErr.message);
      }
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: 'User profile not found.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    logger.error('Error fetching user profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const userEmail = req.user?.email;
    const { name, phone, designation } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (designation) updates.designation = designation.trim();

    let updatedUser = null;

    // 1. Update Canonical Primary Store (MongoDB) (Issue #186)
    if (isMongoActive()) {
      const query = userId
        ? { _id: userId }
        : { email: userEmail.toLowerCase() };
      updatedUser = await UserMongo.findOneAndUpdate(query, updates, {
        new: true,
      })
        .select('-password')
        .lean();
    }

    // 2. Bidirectional Dual-Sync to Secondary Relational Store (PostgreSQL / Sequelize) (Issue #186)
    try {
      const pgUser = userId
        ? await User.findByPk(userId)
        : await User.findOne({ where: { email: userEmail.toLowerCase() } });

      if (pgUser) {
        await pgUser.update(updates);
        if (!updatedUser) {
          updatedUser = typeof pgUser.toJSON === 'function' ? pgUser.toJSON() : pgUser;
        }
      }
    } catch (pgErr) {
      logger.warn('[DualDB] PostgreSQL user synchronization notice:', pgErr.message);
    }

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, error: 'User record not found.' });
    }

    logger.info(`Profile updated for user: ${updatedUser.email}`);
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (err) {
    logger.error('Error updating user profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export default {
  getProfile,
  updateProfile,
};
