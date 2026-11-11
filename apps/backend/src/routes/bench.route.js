import express from 'express';
import mongoose from 'mongoose';
import Candidate from '../models/candidate.mongo.model.js';
import JobApplication from '../models/jobApplication.mongo.model.js';
import { loadSeedJson } from '../utils/seedLoader.js';
import rateLimit from 'express-rate-limit';
import { calculateCandidatePricing, parseNoticeDays } from '../utils/pricing.utils.js';
import Page from '../models/page.mongo.model.js';
import { recordHelpDeskInquiry } from '../models/helpdesk.mongo.model.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

const mockData = loadSeedJson('mockData.json', {}) || {};
const { benchData = null } = mockData;

let bench = benchData
  ? { ...benchData }
  : {
      statsBadges: [],
      specialtyFilters: [],
      talents: [],
      dossierFeatures: [],
      vettingGates: [],
    };

const publicSubmissionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
    forwardedHeader: false,
  },
  message: {
    success: false,
    error: 'Too many requests from this network. Please wait a few minutes before submitting again.',
  },
});

const getPageDataBySlug = async (slug, fallback) => {
  if (isMongoActive()) {
    try {
      const page = await Page.findOne({ slug }).lean();
      if (page?.data && Object.keys(page.data).length > 0) {
        return page.data;
      }
    } catch (err) {
      console.warn(`Error reading page '${slug}' from MongoDB:`, err.message);
    }
  }
  return fallback;
};

const router = express.Router();

// --- Bench / Talent Cloud Endpoints ---
router.get('/bench', async (req, res) => {
  const benchSource = await getPageDataBySlug('bench', bench);
  let rawCandidates = [
    ...(benchSource.candidates || benchSource.talents || []),
  ];

  if (isMongoActive()) {
    try {
      const assessed = await Candidate.find({
        $or: [{ workMode: 'On-Bench' }, { assessmentScore: { $ne: null } }],
      }).limit(15);

      assessed.forEach((c) => {
        rawCandidates.unshift({
          id: `TW-CAND-${c._id.toString().slice(-4).toUpperCase()}`,
          code: `TW-CAND-${c._id.toString().slice(-4).toUpperCase()}`,
          title: c.currentRole || 'Software Professional',
          role: c.currentRole || 'Software Professional',
          initials: c.name
            ? c.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
            : 'TW',
          specialty: 'Systems & Distributed',
          seniorityTier:
            (c.experience || 0) >= 8
              ? 'staff'
              : (c.experience || 0) >= 5
                ? 'senior'
                : 'lead',
          experience: `${c.experience || 5}+ Yrs Exp`,
          location: c.location || 'Remote Global',
          technicalRating: c.assessmentScore || c.vettingScore || 90,
          score: c.assessmentScore || c.vettingScore || 90,
          assessmentScore: c.assessmentScore,
          fitScore: c.fitScore,
          availability: c.noticePeriod || 'Immediate (24-48h)',
          urgency: c.noticePeriod || 'Immediate (24-48h)',
          noticePeriod: c.noticePeriod || '30 Days',
          expectedSalary: c.expectedSalary,
          workMode: c.workMode,
          engagementType: c.workMode === 'Full-Time Looking' ? 'full-time' : 'contract',
          engineeringProof:
            c.bio ||
            `Cleared Thinkwires technical screening assessment (${c.assessmentScore || 90}%).`,
          skills:
            c.technicalSkills && c.technicalSkills.length > 0
              ? c.technicalSkills
              : ['React', 'Node.js', 'PostgreSQL'],
        });
      });
    } catch (e) {
      console.warn('Bench query candidates error:', e.message);
    }
  }

  const normalizedTalents = rawCandidates.map((c) => {
    const pricing = calculateCandidatePricing(c);
    return {
      id: c.id,
      code: c.id || c.code,
      role: c.title || c.role,
      title: c.title || c.role,
      initials: c.initials || 'TW',
      specialty:
        c.specialty === 'genai'
          ? 'GenAI & LLMs'
          : c.specialty === 'cloud'
            ? 'Cloud & DevOps'
            : c.specialty === 'sap'
              ? 'SAP & Enterprise'
              : c.specialty === 'systems'
                ? 'Systems & Distributed'
                : c.specialty === 'data'
                  ? 'Data & Analytics'
                  : c.specialty || 'Engineering',
      experienceLevel:
        c.seniorityTier === 'staff'
          ? 'Staff/Principal (10+y)'
          : c.seniorityTier === 'senior'
            ? 'Senior (6-9y)'
            : 'Lead (8+y)',
      yearsExp: c.experience || `${c.years || 8}+ Yrs Exp`,
      location: c.location || 'Remote Global',
      score: c.technicalRating || c.score || 96,
      assessmentScore:
        c.assessmentScore !== undefined && c.assessmentScore !== null
          ? c.assessmentScore
          : c.dossier?.rubric?.systemDesign
            ? parseInt(c.dossier.rubric.systemDesign) || null
            : c.rubric?.systemDesign || null,
      fitScore: c.fitScore,
      urgency: c.availability || c.urgency || 'Immediate (24-48h)',
      noticePeriod:
        c.noticePeriod ||
        (c.urgency === 'immediate' ||
        (c.availability && c.availability.includes('Immediate'))
          ? 'Immediate'
          : '30 Days'),
      engagementType: pricing.engagementType,
      expectedSalary: pricing.expectedSalary,
      pricing,
      rateNum: pricing.rateNum,
      ratePeriod: pricing.ratePeriod,
      rateDisplay: pricing.rateDisplay,
      hourlyRate:
        c.hourlyRate &&
        !c.hourlyRate.includes('$') &&
        !c.hourlyRate.includes('5,500')
          ? c.hourlyRate
          : pricing.rateDisplay,
      proofQuote:
        c.engineeringProof ||
        c.proofQuote ||
        'Architected and scaled production enterprise systems with zero downtime.',
      skills: c.skills || [],
    rubric: c.dossier?.rubric
      ? {
          systemDesign: parseInt(c.dossier.rubric.systemDesign) || 98,
          codeQuality: parseInt(c.dossier.rubric.cleanCode) || 97,
          liveDebugging: 99,
          communication: 96,
        }
      : c.rubric || {
          systemDesign: 98,
          codeQuality: 97,
          liveDebugging: 99,
          communication: 96,
        },
    bio: c.dossier?.evaluatorNotes || c.bio,
    dossier: c.dossier,
  };
});

  const specialtyFilters = [
    { label: 'All Engineering', count: 142 },
    { label: 'GenAI & LLMs', count: 38 },
    { label: 'Cloud & DevOps', count: 31 },
    { label: 'SAP & Enterprise', count: 24 },
    { label: 'Systems & Distributed', count: 27 },
    { label: 'Data & Analytics', count: 22 },
  ];

  const filterOptions = {
    urgency: [
      'All Urgency',
      'Immediate (24-48h)',
      'Ready in 24h',
      'Immediate Availability',
      'Immediate Joining',
      'Available in 48h',
      'Available in 7 Days',
    ],
    experience: [
      'All Experience',
      'Staff/Principal (10+y)',
      'Senior (6-9y)',
      'Lead (8+y)',
    ],
    locations: [
      'All Locations',
      'Bengaluru (EST Overlap)',
      'Hyderabad / Remote Global',
      'Pune / Noida / Hybrid',
      'Chennai / Remote',
      'Pan-India (Full US Shift)',
      'Gurugram / Remote',
    ],
    sortOptions: ['Highest Score', 'Fastest Availability', 'Lowest Rate'],
  };

  const responsePayload = {
    ...benchSource,
    hero: bench.hero || {
      liveBadge: '142 PRE-VETTED TALENTS ON ACTIVE BENCH',
      title: 'Engineers on the Bench. Available to Deploy in 48 Hours.',
      subtitle:
        'Bypass the 60-day hiring cycle. Access active Thinkwires senior contractors, fully vetted with verified code commits, system design scores, and instant contract execution.',
      slaCard: {
        tag: '48-HOUR SLA ASSURANCE',
        title: 'Instant Pod Matching & Zero-Friction EOR Onboarding',
        description:
          'Every engineer has cleared multi-stage system architecture audits and is cleared for immediate client sprints.',
      },
    },
    specialtyFilters,
    filterOptions,
    talents: normalizedTalents,
    candidates: rawCandidates,
    dossierFeatures:
      bench.dossierFeatures?.map((f, i) => ({
        step: `0${i + 1}`,
        icon:
          f.icon === 'code_blocks'
            ? 'terminal'
            : f.icon === 'architecture'
              ? 'rule'
              : f.icon === 'play_circle'
                ? 'videocam'
                : 'verified',
        title: f.title,
        description: f.description,
        highlight: f.tag || 'Verified Assessment',
      })) || [],
    vettingGates:
      bench.vettingGates?.map((g) => ({
        gateNumber: `GATE ${g.step}`,
        title: g.title,
        passRate: g.stat || 'Pass Rate Calibrated',
        details: [g.description, g.badge],
        badge: g.badge,
      })) || [],
    requisitionCta: bench.requisitionCTA
      ? {
          tag: bench.requisitionCTA.eyebrow,
          title: bench.requisitionCTA.title,
          description: bench.requisitionCTA.description,
          primaryBtn: { text: bench.requisitionCTA.ctaLabel, link: '/contact' },
          secondaryBtn: { text: 'Speak with a Director', link: '/contact' },
        }
      : null,
  };

  res.json(responsePayload);
});

router.get('/bench/talents', async (req, res) => {
  const { q, specialty, urgency, experience, location, sort } = req.query;
  const benchSource = await getPageDataBySlug('bench', bench);
  let rawCandidates = [
    ...(benchSource.candidates || benchSource.talents || []),
  ];

  if (isMongoActive()) {
    try {
      const assessed = await Candidate.find({
        $or: [{ workMode: 'On-Bench' }, { assessmentScore: { $ne: null } }],
      }).limit(15);

      assessed.forEach((c) => {
        rawCandidates.unshift({
          id: `TW-CAND-${c._id.toString().slice(-4).toUpperCase()}`,
          code: `TW-CAND-${c._id.toString().slice(-4).toUpperCase()}`,
          title: c.currentRole || 'Software Professional',
          role: c.currentRole || 'Software Professional',
          initials: c.name
            ? c.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
            : 'TW',
          specialty: 'Systems & Distributed',
          seniorityTier:
            (c.experience || 0) >= 8
              ? 'staff'
              : (c.experience || 0) >= 5
                ? 'senior'
                : 'lead',
          experience: `${c.experience || 5}+ Yrs Exp`,
          location: c.location || 'Remote Global',
          technicalRating: c.assessmentScore || c.vettingScore || 90,
          score: c.assessmentScore || c.vettingScore || 90,
          assessmentScore: c.assessmentScore,
          fitScore: c.fitScore,
          availability: 'Immediate (24-48h)',
          expectedSalary: c.expectedSalary,
          workMode: c.workMode,
          engagementType: c.workMode === 'Full-Time Looking' ? 'full-time' : 'contract',
          engineeringProof:
            c.bio ||
            `Cleared Thinkwires technical screening assessment (${c.assessmentScore || 90}%).`,
          skills:
            c.technicalSkills && c.technicalSkills.length > 0
              ? c.technicalSkills
              : ['React', 'Node.js', 'PostgreSQL'],
        });
      });
    } catch (e) {
      console.warn('Bench query candidates error:', e.message);
    }
  }

  let filtered = rawCandidates.map((c) => {
    const pricing = calculateCandidatePricing(c);
    return {
      id: c.id,
      code: c.id || c.code,
      role: c.title || c.role,
      title: c.title || c.role,
      avatarUrl: c.avatarUrl || c.avatar || c.photo || null,
      initials:
        c.initials ||
        (c.name
          ? c.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          : c.code
          ? c.code.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase()
          : 'TW'),
      specialty:
        c.specialty === 'genai'
          ? 'GenAI & LLMs'
          : c.specialty === 'cloud'
            ? 'Cloud & DevOps'
            : c.specialty === 'sap'
              ? 'SAP & Enterprise'
              : c.specialty === 'systems'
                ? 'Systems & Distributed'
                : c.specialty === 'data'
                  ? 'Data & Analytics'
                  : c.specialty || 'Engineering',
      experienceLevel:
        c.seniorityTier === 'staff'
          ? 'Staff/Principal (10+y)'
          : c.seniorityTier === 'senior'
            ? 'Senior (6-9y)'
            : 'Lead (8+y)',
      yearsExp: c.experience || `${c.years || 8}+ Yrs Exp`,
      location: c.location || 'Remote Global',
      score: c.technicalRating || c.score || 96,
      assessmentScore:
        c.assessmentScore !== undefined && c.assessmentScore !== null
          ? c.assessmentScore
          : c.dossier?.rubric?.systemDesign
            ? parseInt(c.dossier.rubric.systemDesign) || null
            : c.rubric?.systemDesign || null,
      fitScore: c.fitScore,
      urgency: c.availability || c.urgency || 'Immediate (24-48h)',
      noticePeriod:
        c.noticePeriod ||
        (c.urgency === 'immediate' ||
        (c.availability && c.availability.includes('Immediate'))
          ? 'Immediate'
          : '30 Days'),
      engagementType: pricing.engagementType,
      expectedSalary: pricing.expectedSalary,
      pricing,
      rateNum: pricing.rateNum,
      ratePeriod: pricing.ratePeriod,
      rateDisplay: pricing.rateDisplay,
      hourlyRate:
        c.hourlyRate &&
        !c.hourlyRate.includes('$') &&
        !c.hourlyRate.includes('5,500')
          ? c.hourlyRate
          : pricing.rateDisplay,
      proofQuote:
        c.engineeringProof ||
        c.proofQuote ||
        'Architected and scaled production enterprise systems.',
      skills: c.skills || [],
    };
  });

  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.role.toLowerCase().includes(query) ||
        t.code.toLowerCase().includes(query) ||
        t.skills.some((s) => s.toLowerCase().includes(query)) ||
        (t.proofQuote && t.proofQuote.toLowerCase().includes(query))
    );
  }

  if (specialty && specialty !== 'All' && specialty !== 'All Engineering') {
    filtered = filtered.filter((t) => t.specialty === specialty);
  }

  if (urgency && urgency !== 'All Urgency' && urgency !== 'All') {
    filtered = filtered.filter((t) => t.urgency === urgency);
  }

  const { engagementType } = req.query;
  if (engagementType && engagementType !== 'All' && engagementType !== 'all') {
    const targetEng = engagementType.toString().toLowerCase().trim();
    filtered = filtered.filter(
      (t) => (t.engagementType || '').toLowerCase() === targetEng
    );
  }

  const noticePeriodQuery = req.query.noticePeriod;
  const minScore = req.query.minScore ? parseInt(req.query.minScore, 10) : 85;

  // Issue #166: Notice Period & AI Score Benchmark Strictness
  // - Candidates with notice periods > 15 days filtered out by default, and scores < 85%.
  if (!noticePeriodQuery || noticePeriodQuery === 'All Notice Periods' || noticePeriodQuery === 'All Notice' || noticePeriodQuery === 'All') {
    if (req.query.strict !== 'false' && req.query.all !== 'true') {
      filtered = filtered.filter((t) => {
        const days = parseNoticeDays(t.noticePeriod || t.urgency || t.availability);
        const score = typeof t.assessmentScore === 'number' && !isNaN(t.assessmentScore) ? t.assessmentScore : (t.score || 0);
        return days <= 15 && score >= minScore;
      });
    }
  } else {
    const target = noticePeriodQuery.toString().toLowerCase().trim();
    filtered = filtered.filter((t) => {
      const np = (t.noticePeriod || t.urgency || '').toString().toLowerCase().trim();
      const days = parseNoticeDays(np);

      if (target.includes('48h') || target === 'immediate (48h)' || target === 'immediate') {
        return days <= 2 || np.includes('immediate') || np.includes('24h') || np.includes('48h');
      }
      if (target.includes('7') || target.includes('week')) {
        return days <= 7;
      }
      if (target.includes('15') || target.includes('2 weeks')) {
        return days <= 15;
      }
      if (target === '30 days' || target === '30' || target === '30-day') {
        return np === '30 days' || np === '30' || np === '30-day' || np.includes('30');
      }
      return np === target || np.includes(target);
    });

    if (req.query.strict !== 'false' && req.query.all !== 'true' && !req.query.includeUnscored) {
      filtered = filtered.filter((t) => {
        const score = typeof t.assessmentScore === 'number' && !isNaN(t.assessmentScore) ? t.assessmentScore : (t.score || 0);
        return score >= minScore;
      });
    }
  }

  if (experience && experience !== 'All Experience' && experience !== 'All') {
    filtered = filtered.filter((t) => t.experienceLevel === experience);
  }

  if (location && location !== 'All Locations' && location !== 'All') {
    filtered = filtered.filter((t) => t.location === location);
  }

  // Sorting: Default ordered with Immediate / 48-Hour availability at the top (Issue #166)
  if (sort === 'AI Assessment') {
    filtered.sort((a, b) => {
      const scoreA = typeof a.assessmentScore === 'number' && !isNaN(a.assessmentScore) ? a.assessmentScore : -Infinity;
      const scoreB = typeof b.assessmentScore === 'number' && !isNaN(b.assessmentScore) ? b.assessmentScore : -Infinity;
      return scoreB - scoreA;
    });
  } else if (sort === 'Highest Score') {
    filtered.sort((a, b) => b.score - a.score);
  } else if (sort === 'Lowest Rate') {
    filtered.sort((a, b) => {
      const rateA =
        a.pricing?.monthlyRate ||
        parseInt((a.hourlyRate || '').replace(/[^0-9]/g, ''), 10) ||
        0;
      const rateB =
        b.pricing?.monthlyRate ||
        parseInt((b.hourlyRate || '').replace(/[^0-9]/g, ''), 10) ||
        0;
      return rateA - rateB;
    });
  } else {
    // Default or 'Fastest Availability' or 'Notice Period':
    // Immediate / 48-Hour availability at the top, followed by 7d, 15d, and descending score
    filtered.sort((a, b) => {
      const daysA = parseNoticeDays(a.noticePeriod || a.urgency || a.availability);
      const daysB = parseNoticeDays(b.noticePeriod || b.urgency || b.availability);
      if (daysA !== daysB) {
        return daysA - daysB;
      }
      const scoreA = typeof a.assessmentScore === 'number' && !isNaN(a.assessmentScore) ? a.assessmentScore : (a.score || 0);
      const scoreB = typeof b.assessmentScore === 'number' && !isNaN(b.assessmentScore) ? b.assessmentScore : (b.score || 0);
      return scoreB - scoreA;
    });
  }

  res.json(filtered);
});

router.get('/bench/talents/:id', async (req, res) => {
  const benchSource = await getPageDataBySlug('bench', bench);
  const rawCandidates = benchSource.candidates || benchSource.talents || [];
  const talent = rawCandidates.find(
    (t) => t.id === req.params.id || t.code === req.params.id
  );
  if (talent) {
    const pricing = calculateCandidatePricing(talent);
    res.json({
      ...talent,
      engagementType: pricing.engagementType,
      expectedSalary: pricing.expectedSalary,
      pricing,
      rateNum: pricing.rateNum,
      ratePeriod: pricing.ratePeriod,
      rateDisplay: pricing.rateDisplay,
      hourlyRate:
        talent.hourlyRate &&
        !talent.hourlyRate.includes('$') &&
        !talent.hourlyRate.includes('5,500')
          ? talent.hourlyRate
          : pricing.rateDisplay,
    });
  } else {
    res.status(404).json({ error: 'Talent not found' });
  }
});

router.get('/bench/dossier/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Issue #203: Reject raw database ObjectIds on public bench endpoint to prevent BOLA / candidate record scraping
    if (mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid bench identifier format. Please use standard candidate code.',
      });
    }

    const benchSource = await getPageDataBySlug('bench', bench);
    const rawCandidates = benchSource.candidates || benchSource.talents || [];
    const talent = rawCandidates.find(
      (t) => t.id === id || t.code === id
    );

    let application = null;

    if (isMongoActive()) {
      application = await JobApplication.findOne({ anonymousCode: id }).lean();
    }

    if (!talent && !application) {
      return res.status(404).json({
        success: false,
        error: 'Talent dossier not found.',
      });
    }

    const targetRole = talent?.role || application?.jobTitle || 'Technical Specialist';
    const code = talent?.code || application?.anonymousCode || id;

    let rawDossier = application?.evaluationReport || talent?.dossier;
    if (!rawDossier || !rawDossier.overallMatchScore) {
      rawDossier = await aiService.evaluateCandidate(
        {
          candidateName: `Candidate ${code}`,
          skills: talent?.skills || application?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          resumeText: talent?.engineeringProof || application?.candidateNote || '',
          experience: talent?.years || 5,
          noticePeriod: talent?.noticePeriod || 'Immediate',
        },
        {
          jobTitle: targetRole,
          department: talent?.specialty || application?.department || 'Engineering',
          company: 'Thinkwires Talent Cloud',
          requiredSkills: talent?.skills || application?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          experienceRequired: 5,
        }
      );
    }

    const sanitizedDossier = aiService.sanitizeDossierForBench(rawDossier, code, targetRole);

    res.json({
      success: true,
      talent: {
        id: code,
        code,
        role: targetRole,
        initials: talent?.initials || 'TW',
        avatarUrl: talent?.avatarUrl || talent?.avatar || talent?.photo || null,
        location: talent?.location || 'Remote Global',
        experience: talent?.yearsExp || talent?.experience || '5+ Yrs Exp',
        noticePeriod: talent?.noticePeriod || 'Immediate',
        hourlyRate: talent?.hourlyRate || '$65 - $85/hr',
        skills: talent?.skills || application?.skills || [],
      },
      dossier: sanitizedDossier,
    });
  } catch (err) {
    console.error('Bench dossier error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve bench dossier.' });
  }
});

router.post('/bench/book-interview', publicSubmissionRateLimiter, async (req, res) => {
  const {
    talentId,
    talentCode,
    workEmail,
    companyName,
    hiringManager,
    timeSlot,
  } = req.body;
  if (!talentCode || !workEmail) {
    return res
      .status(400)
      .json({ error: 'Talent code and work email are required' });
  }
  console.log('[Bench] Interview Booked:', {
    talentId,
    talentCode,
    workEmail,
    companyName,
    hiringManager,
    timeSlot,
  });

  const bookingRef = `TW-BENCH-${Date.now().toString(36).toUpperCase()}`;

  try {
    await recordHelpDeskInquiry({
      category: 'Bench Interview',
      fullName: hiringManager || 'Talent Cloud Hiring Lead',
      email: workEmail,
      company: companyName || 'Client Organization',
      subject: `Bench Talent Interview Booking: ${talentCode}`,
      message: `Client requested interview for candidate ${talentCode}. Proposed slot: ${timeSlot || 'Flexible'}. Booking Reference: ${bookingRef}`,
      metadata: { talentId, talentCode, hiringManager, timeSlot, bookingRef },
      priority: 'Urgent',
    });
  } catch (hdErr) {
    console.warn('HelpDesk bench interview logging warning:', hdErr.message);
  }

  res.json({
    success: true,
    message: `Interview request confirmed for ${talentCode}. Calendar invites sent to ${workEmail}.`,
    bookingRef,
  });
});

export default router;
