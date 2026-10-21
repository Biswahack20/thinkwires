import fs from 'fs';
import mongoose from 'mongoose';
import Candidate from '../models/candidate.mongo.model.js';
import JobApplication from '../models/jobApplication.mongo.model.js';
import JobRequirement from '../models/job.mongo.model.js';
import { sendRecruitmentNotificationEmail } from '../utils/recruitmentEmail.util.js';
import aiService from '../services/ai.service.js';

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
/**
 * Submit Job Application
 * POST /api/candidate/apply
 * Supports both application/json and multipart/form-data (with resume file upload)
 */
export const applyForJob = async (req, res) => {
  try {
    const candidate = req.candidate;
    const candidateId = candidate._id || candidate.id;

    // Extract all fields from req.body (works for JSON and multipart)
    const {
      jobId,
      jobTitle,
      department,
      location,
      employmentType,
      postingDate,

      // Basic Information
      lastName,
      firstName,
      mobileNumber,
      email,
      applicationType,
      noticePeriod,
      city,
      state,

      // Professional Details
      totalExperienceYears,
      relevantExperienceYears,
      currentEmployer,
      currentCTC,
      expectedCTC,
      skillSet,
      linkedInLink,
      facebookLink,
      candidateNote,

      // Legacy fallbacks if submitted
      experience,
      skills,
      coverLetter,
      resumeUrl: clientResumeUrl,
    } = req.body;

    if (!jobId || !jobTitle) {
      return res.status(400).json({
        success: false,
        error: 'Job ID and Job Title are required.',
      });
    }

    // Required fields check
    const resolvedLastName = (lastName || '').trim();
    const resolvedFirstName = (firstName || '').trim();
    const resolvedMobile = (mobileNumber || candidate.phone || '').trim();
    const resolvedEmail = (email || candidate.email || '').trim().toLowerCase();

    if (!resolvedLastName || !resolvedFirstName || !resolvedEmail || !resolvedMobile) {
      return res.status(400).json({
        success: false,
        error: 'First Name, Last Name, Email, and Mobile Number are required.',
      });
    }

    // Handle uploaded file if present
    const uploadedFile = req.file;
    const resumeOriginalName = uploadedFile ? uploadedFile.originalname : (req.body.resumeOriginalName || '');
    const resumeFileName = uploadedFile ? uploadedFile.filename : (req.body.resumeFileName || resumeOriginalName || '');
    const resumePath = uploadedFile ? uploadedFile.path : '';
    const finalResumeUrl = uploadedFile ? `/uploads/resumes/${uploadedFile.filename}` : (clientResumeUrl || candidate.resumeUrl || '');

    // Parse skills array
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === 'string' && skills.trim()) {
      parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (skillSet) {
      parsedSkills = skillSet.split(',').map((s) => s.trim()).filter(Boolean);
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

      // ── AI ATS Resume Match Scoring & Assessment Generation ─────────────
      let matchScoreResult = {
        fit_score: 85,
        fit_badge: 'Top Match',
        skills_match_score: 85,
        experience_match_score: 90,
        matched_skills: parsedSkills,
        missing_skills: [],
        strengths: ['Verified engineering proficiency in core mandate stack'],
        growth_areas: [],
        recommendation: 'Recommended for technical evaluation',
      };

      try {
        matchScoreResult = await aiService.calculateMatchScore(
          {
            skills: parsedSkills,
            resumeText: candidateNote || coverLetter || `${skillSet} ${currentEmployer} ${totalExperienceYears} years`,
          },
          {
            jobTitle,
            department,
            requiredSkills: parsedSkills,
            experienceRequired: Number(totalExperienceYears) || 3,
          }
        );
      } catch (aiErr) {
        console.warn('AI Match score non-blocking warning:', aiErr.message);
      }

      let assessmentResult = null;
      try {
        assessmentResult = await aiService.generateAssessment(
          {
            jobId,
            jobTitle,
            department,
            requiredSkills: parsedSkills,
          },
          {
            name: `${resolvedFirstName} ${resolvedLastName}`,
            skills: parsedSkills,
          }
        );
      } catch (aiErr) {
        console.warn('AI Assessment generator non-blocking warning:', aiErr.message);
      }

      const application = await JobApplication.create({
        candidate: candidateId,
        jobId: String(jobId),
        jobTitle,
        department: department || 'Engineering',
        location: location || 'Remote',
        employmentType: employmentType || 'Permanent',
        postingDate: postingDate || '',

        // Resume info
        resumeOriginalName,
        resumeFileName,
        resumePath,
        resumeUrl: finalResumeUrl,

        // Basic Info
        lastName: resolvedLastName,
        firstName: resolvedFirstName,
        mobileNumber: resolvedMobile,
        email: resolvedEmail,
        applicationType: applicationType || 'Permanent',
        noticePeriod: noticePeriod || 'Immediate',
        city: (city || '').trim(),
        state: (state || '').trim(),

        // Professional Details
        totalExperienceYears: totalExperienceYears || experience || '',
        relevantExperienceYears: relevantExperienceYears || '',
        currentEmployer: (currentEmployer || '').trim(),
        currentCTC: (currentCTC || '').trim(),
        expectedCTC: (expectedCTC || '').trim(),
        skillSet: skillSet || parsedSkills.join(', '),
        skills: parsedSkills,
        linkedInLink: (linkedInLink || '').trim(),
        facebookLink: (facebookLink || '').trim(),
        candidateNote: (candidateNote || coverLetter || '').trim(),

        // Legacy compatibility fields
        candidateName: `${resolvedFirstName} ${resolvedLastName}`.trim(),
        candidateEmail: resolvedEmail,
        candidatePhone: resolvedMobile,
        experience: totalExperienceYears ? `${totalExperienceYears} Years` : (experience || '3 - 5 Years'),
        coverLetter: candidateNote || coverLetter || '',

        // AI ATS Scoring & Assessment Fields
        fitScore: matchScoreResult.fit_score,
        fitBadge: matchScoreResult.fit_badge,
        aiAnalysis: {
          skillsMatch: matchScoreResult.skills_match_score || 0,
          experienceMatch: matchScoreResult.experience_match_score || 0,
          matchedSkills: matchScoreResult.matched_skills || [],
          missingSkills: matchScoreResult.missing_skills || [],
          strengths: matchScoreResult.strengths || [],
          growthAreas: matchScoreResult.growth_areas || [],
          recommendation: matchScoreResult.recommendation || '',
        },
        assessment: assessmentResult || {},
        assessmentStatus: 'Not Started',

        status: 'Applied',
        stage: 'Application Received',
        emailNotificationStatus: 'Pending',
      });

      // Update candidate profile with ATS fit score
      if (mongoose.connection.readyState === 1) {
        Candidate.findByIdAndUpdate(candidateId, {
          fitScore: matchScoreResult.fit_score,
        }).catch((err) => console.warn('Candidate fitScore update error:', err.message));
      }

      // Dispatch automated recruitment email asynchronously
      sendRecruitmentNotificationEmail(
        {
          jobTitle,
          location,
          employmentType,
          postingDate,
          resumeFileName: resumeOriginalName || resumeFileName || 'Resume Attached',
          lastName: resolvedLastName,
          firstName: resolvedFirstName,
          mobileNumber: resolvedMobile,
          email: resolvedEmail,
          applicationType: applicationType || 'Permanent',
          noticePeriod: noticePeriod || 'Immediate',
          city,
          state,
          totalExperienceYears: totalExperienceYears || experience || '0',
          relevantExperienceYears: relevantExperienceYears || '0',
          currentEmployer: currentEmployer || 'Confidential / Self',
          currentCTC: currentCTC || 'Confidential',
          expectedCTC: expectedCTC || 'Negotiable',
          skillSet: skillSet || parsedSkills.join(', '),
          linkedInLink,
          facebookLink,
          candidateNote,
        },
        uploadedFile ? { filename: uploadedFile.originalname, path: uploadedFile.path } : null
      )
        .then(async (emailResult) => {
          if (emailResult.success) {
            await JobApplication.findByIdAndUpdate(application._id, {
              emailNotificationStatus: emailResult.mode === 'smtp_delivered' ? 'Sent' : 'Disabled',
            });
          } else {
            await JobApplication.findByIdAndUpdate(application._id, {
              emailNotificationStatus: 'Failed',
            });
          }
        })
        .catch((err) => {
          console.error('Async email error:', err.message);
        });

      return res.status(201).json({
        success: true,
        message: `Application submitted successfully for ${jobTitle}!`,
        application,
        fitScore: matchScoreResult.fit_score,
        fitBadge: matchScoreResult.fit_badge,
        assessment: assessmentResult,
      });
    } else {
      // In-memory fallback for local dev without MongoDB connection
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

      const matchScoreResult = await aiService.calculateMatchScore(
        { skills: parsedSkills },
        { jobTitle, department, requiredSkills: parsedSkills }
      );
      const assessmentResult = await aiService.generateAssessment(
        { jobId, jobTitle, department, requiredSkills: parsedSkills },
        { name: `${resolvedFirstName} ${resolvedLastName}`, skills: parsedSkills }
      );

      const application = {
        _id: 'app_' + Date.now(),
        candidate: candidateId,
        jobId: String(jobId),
        jobTitle,
        department: department || 'Engineering',
        location: location || 'Remote',
        employmentType: employmentType || 'Permanent',
        postingDate: postingDate || '',
        resumeOriginalName,
        resumeFileName,
        resumePath,
        resumeUrl: finalResumeUrl,
        lastName: resolvedLastName,
        firstName: resolvedFirstName,
        mobileNumber: resolvedMobile,
        email: resolvedEmail,
        applicationType: applicationType || 'Permanent',
        noticePeriod: noticePeriod || 'Immediate',
        city,
        state,
        totalExperienceYears: totalExperienceYears || experience || '',
        relevantExperienceYears: relevantExperienceYears || '',
        currentEmployer,
        currentCTC,
        expectedCTC,
        skillSet: skillSet || parsedSkills.join(', '),
        skills: parsedSkills,
        linkedInLink,
        facebookLink,
        candidateNote: candidateNote || coverLetter || '',
        candidateName: `${resolvedFirstName} ${resolvedLastName}`.trim(),
        candidateEmail: resolvedEmail,
        candidatePhone: resolvedMobile,
        experience: totalExperienceYears ? `${totalExperienceYears} Years` : (experience || '3 - 5 Years'),
        coverLetter: candidateNote || coverLetter || '',
        fitScore: matchScoreResult.fit_score,
        fitBadge: matchScoreResult.fit_badge,
        assessment: assessmentResult,
        assessmentStatus: 'Not Started',
        status: 'Applied',
        stage: 'Application Received',
        emailNotificationStatus: 'Sent',
        createdAt: new Date(),
      };

      localDevApplications.unshift(application);

      // Trigger notification email in dev mode
      sendRecruitmentNotificationEmail(
        application,
        uploadedFile ? { filename: uploadedFile.originalname, path: uploadedFile.path } : null
      ).catch((err) => console.error('Dev email error:', err.message));

      return res.status(201).json({
        success: true,
        message: `Application submitted successfully for ${jobTitle}!`,
        application,
        fitScore: matchScoreResult.fit_score,
        fitBadge: matchScoreResult.fit_badge,
        assessment: assessmentResult,
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

/**
 * Parse Resume to Auto-Fill Application Form
 * POST /api/candidate/parse-resume
 */
export const parseResumeForAutoFill = async (req, res) => {
  try {
    let parsed;
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      parsed = await aiService.parseResume(fileBuffer, req.file.originalname);
    } else if (req.body && (req.body.resumeText || req.body.text)) {
      const text = req.body.resumeText || req.body.text;
      parsed = await aiService.parseResume(Buffer.from(text, 'utf-8'), 'resume.txt');
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please upload a resume file (PDF, DOC, or DOCX) or provide resume text.',
      });
    }

    const locationStr = parsed.location || '';
    const city = locationStr.includes(',') ? locationStr.split(',')[0].trim() : locationStr;
    const state = locationStr.includes(',') ? locationStr.split(',')[1].trim() : '';

    return res.status(200).json({
      success: true,
      message: 'Resume parsed and details extracted successfully.',
      parsed: {
        firstName: parsed.first_name || '',
        lastName: parsed.last_name || '',
        email: parsed.email || '',
        mobileNumber: parsed.phone || '',
        location: locationStr,
        city,
        state,
        totalExperienceYears: parsed.total_experience_years ? String(parsed.total_experience_years) : '',
        currentRole: parsed.current_role || '',
        headline: parsed.headline || '',
        skillSet: parsed.skill_set || (parsed.skills ? parsed.skills.join(', ') : ''),
        skills: parsed.skills || [],
        linkedInLink: parsed.linkedin_url || '',
        githubLink: parsed.github_url || '',
        candidateNote: parsed.summary || '',
      },
    });
  } catch (error) {
    console.error('Resume auto-fill parse error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to extract resume details for auto-fill.',
    });
  }
};

/**
 * Retrieve Screening Assessment for a Specific Application
 * GET /api/candidate/applications/:applicationId/assessment
 */
export const getApplicationAssessment = async (req, res) => {
  try {
    const candidateId = req.candidate._id || req.candidate.id;
    const { applicationId } = req.params;

    let app;
    if (mongoose.connection.readyState === 1) {
      app = await JobApplication.findOne({
        _id: applicationId,
        candidate: candidateId,
      });
    } else {
      app = localDevApplications.find(
        (a) => String(a._id) === String(applicationId) && String(a.candidate) === String(candidateId)
      );
    }

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'Application not found.',
      });
    }

    let assessment = app.assessment;
    if (!assessment || !assessment.questions || assessment.questions.length === 0) {
      assessment = await aiService.generateAssessment(
        {
          jobId: app.jobId,
          jobTitle: app.jobTitle,
          department: app.department,
          requiredSkills: app.skills || [],
        },
        {
          name: app.candidateName,
          skills: app.skills || [],
        }
      );

      if (mongoose.connection.readyState === 1) {
        await JobApplication.findByIdAndUpdate(app._id, { assessment });
      } else {
        app.assessment = assessment;
      }
    }

    return res.status(200).json({
      success: true,
      assessment,
      application: {
        id: app._id,
        jobTitle: app.jobTitle,
        department: app.department,
        assessmentStatus: app.assessmentStatus || 'Not Started',
        assessmentScore: app.assessmentScore,
        screeningPassed: app.screeningPassed,
        fitScore: app.fitScore,
        fitBadge: app.fitBadge,
      },
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve assessment.',
    });
  }
};

/**
 * Submit and Grade Candidate Assessment Answers
 * POST /api/candidate/applications/:applicationId/assessment/submit
 */
export const submitApplicationAssessment = async (req, res) => {
  try {
    const candidateId = req.candidate._id || req.candidate.id;
    const { applicationId } = req.params;
    const { answers } = req.body;

    let app;
    if (mongoose.connection.readyState === 1) {
      app = await JobApplication.findOne({
        _id: applicationId,
        candidate: candidateId,
      });
    } else {
      app = localDevApplications.find(
        (a) => String(a._id) === String(applicationId) && String(a.candidate) === String(candidateId)
      );
    }

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'Application not found.',
      });
    }

    const assessment = app.assessment || {};
    const evalResult = await aiService.evaluateAssessment(assessment, answers || {});

    const updateData = {
      assessmentScore: evalResult.total_score,
      assessmentStatus: evalResult.passed ? 'Passed' : 'Failed',
      screeningPassed: evalResult.passed,
      stage: evalResult.gatekeeper_status,
      status: evalResult.passed ? 'Screening' : 'Screening',
    };

    if (mongoose.connection.readyState === 1) {
      await JobApplication.findByIdAndUpdate(applicationId, updateData);
      await Candidate.findByIdAndUpdate(candidateId, {
        assessmentScore: evalResult.total_score,
        vettingScore: Math.max(evalResult.total_score, 80),
      });
    } else {
      Object.assign(app, updateData);
    }

    return res.status(200).json({
      success: true,
      message: evalResult.passed
        ? 'Congratulations! You passed the screening assessment.'
        : 'Assessment submitted. Your score has been recorded.',
      evaluation: evalResult,
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to evaluate assessment submission.',
    });
  }
};
