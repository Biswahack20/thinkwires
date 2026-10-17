import mongoose from 'mongoose';
import Candidate from '../models/candidate.mongo.model.js';
import JobApplication from '../models/jobApplication.mongo.model.js';
import JobRequirement from '../models/job.mongo.model.js';

// Fallback in-memory application store for local development if MongoDB is absent
const localDevApplications = [];

/**
 * Get Candidate Dashboard Data
 * GET /api/candidate/dashboard
 */
export const getCandidateDashboard = async (req, res) => {
  try {
    const candidateId = req.candidate._id || req.candidate.id;

    let applications = [];
    let candidateData = req.candidate;

    if (mongoose.connection.readyState === 1) {
      applications = await JobApplication.find({ candidate: candidateId })
        .sort({ createdAt: -1 })
        .lean();

      const freshCandidate = await Candidate.findById(candidateId).select('-password');
      if (freshCandidate) candidateData = freshCandidate;
    } else {
      applications = localDevApplications.filter(
        (app) => String(app.candidate) === String(candidateId)
      );
    }

    return res.status(200).json({
      success: true,
      profile: candidateData,
      metrics: {
        totalApplications: applications.length,
        inReview: applications.filter((a) => a.status === 'Applied' || a.status === 'Screening').length,
        interviewing: applications.filter((a) => a.status === 'Interview').length,
        offers: applications.filter((a) => a.status === 'Offered').length,
      },
      recentApplications: applications.slice(0, 5),
    });
  } catch (error) {
    console.error('Candidate dashboard fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load candidate dashboard data.',
    });
  }
};

/**
 * Update Candidate Profile
 * PUT /api/candidate/profile
 */
export const updateCandidateProfile = async (req, res) => {
  try {
    const candidateId = req.candidate._id || req.candidate.id;
    const {
      name,
      phone,
      headline,
      location,
      currentRole,
      technicalSkills,
      experience,
      expectedSalary,
      bio,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (headline !== undefined) updateFields.headline = headline;
    if (location !== undefined) updateFields.location = location;
    if (currentRole !== undefined) updateFields.currentRole = currentRole;
    if (technicalSkills !== undefined) {
      updateFields.technicalSkills = Array.isArray(technicalSkills)
        ? technicalSkills
        : technicalSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (experience !== undefined) updateFields.experience = Number(experience) || 0;
    if (expectedSalary !== undefined) updateFields.expectedSalary = expectedSalary;
    if (bio !== undefined) updateFields.bio = bio;
    if (githubUrl !== undefined) updateFields.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updateFields.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) updateFields.portfolioUrl = portfolioUrl;

    let updatedCandidate;
    if (mongoose.connection.readyState === 1) {
      updatedCandidate = await Candidate.findByIdAndUpdate(
        candidateId,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).select('-password -resetPasswordToken -resetPasswordExpire');
    } else {
      updatedCandidate = {
        ...req.candidate,
        ...updateFields,
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update candidate profile.',
    });
  }
};

/**
 * Get Candidate's Applications
 * GET /api/candidate/applications
 */
export const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.candidate._id || req.candidate.id;

    let applications = [];
    if (mongoose.connection.readyState === 1) {
      applications = await JobApplication.find({ candidate: candidateId })
        .sort({ createdAt: -1 })
        .lean();
    } else {
      applications = localDevApplications.filter(
        (app) => String(app.candidate) === String(candidateId)
      );
    }

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve your job applications.',
    });
  }
};

/**
 * Submit Job Application
 * POST /api/candidate/apply
 */
export const applyForJob = async (req, res) => {
  try {
    const candidate = req.candidate;
    const candidateId = candidate._id || candidate.id;
    const { jobId, jobTitle, department, location, experience, skills, coverLetter, resumeUrl } = req.body;

    if (!jobId || !jobTitle) {
      return res.status(400).json({
        success: false,
        error: 'Job ID and Job Title are required.',
      });
    }

    // 1. Prevent duplicate applications for the same candidate and job
    if (mongoose.connection.readyState === 1) {
      const existingApplication = await JobApplication.findOne({
        candidate: candidateId,
        jobId: String(jobId),
      });

      if (existingApplication) {
        return res.status(409).json({
          success: false,
          error: `You have already applied for "${jobTitle}". Your application is currently under review.`,
          existingApplication,
        });
      }

      const application = await JobApplication.create({
        candidate: candidateId,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        candidatePhone: candidate.phone || '',
        jobId: String(jobId),
        jobTitle,
        department: department || 'Engineering',
        location: location || 'Remote',
        experience: experience || `${candidate.experience || 3} Years`,
        skills: Array.isArray(skills) ? skills : candidate.technicalSkills || [],
        coverLetter: coverLetter || '',
        resumeUrl: resumeUrl || candidate.resumeUrl || '',
        status: 'Applied',
        stage: 'Application Received',
      });

      return res.status(201).json({
        success: true,
        message: `Application submitted successfully for ${jobTitle}!`,
        application,
      });
    } else {
      const existing = localDevApplications.find(
        (a) => String(a.candidate) === String(candidateId) && String(a.jobId) === String(jobId)
      );

      if (existing) {
        return res.status(409).json({
          success: false,
          error: `You have already applied for "${jobTitle}".`,
          existingApplication: existing,
        });
      }

      const application = {
        _id: 'app_' + Date.now(),
        candidate: candidateId,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        candidatePhone: candidate.phone || '',
        jobId: String(jobId),
        jobTitle,
        department: department || 'Engineering',
        location: location || 'Remote',
        experience: experience || `${candidate.experience || 3} Years`,
        skills: Array.isArray(skills) ? skills : candidate.technicalSkills || [],
        coverLetter: coverLetter || '',
        resumeUrl: resumeUrl || candidate.resumeUrl || '',
        status: 'Applied',
        stage: 'Application Received',
        createdAt: new Date(),
      };

      localDevApplications.unshift(application);

      return res.status(201).json({
        success: true,
        message: `Application submitted successfully for ${jobTitle}!`,
        application,
      });
    }
  } catch (error) {
    console.error('Job application error:', error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'You have already applied for this position.',
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message || 'Unable to submit job application.',
    });
  }
};
