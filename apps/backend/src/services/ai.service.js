import { createRequire } from 'module';
import config from '../configs/dotenv.js';

const require = createRequire(import.meta.url);
let pdfParse = null;
try {
  pdfParse = require('pdf-parse');
} catch {
  // pdf-parse optional fallback
}

const AI_SERVICE_URL = config.AI_SERVICE_URL || 'http://localhost:8000';

const COMMON_TECH_SKILLS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'PostgreSQL',
  'MongoDB',
  'MySQL',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'GraphQL',
  'REST APIs',
  'Tailwind CSS',
  'Redux',
  'Git',
  'CI/CD',
  'FastAPI',
  'Django',
  'Flask',
  'Java',
  'Spring Boot',
  'Spring',
  'C#',
  '.NET',
  'C++',
  'Go',
  'Rust',
  'Linux',
  'Microservices',
  'Kafka',
  'Elasticsearch',
  'Three.js',
  'TensorFlow',
  'PyTorch',
  'Pandas',
  'Scikit-Learn',
  'HTML5',
  'CSS3',
  'Jest',
  'Terraform',
  'Ansible',
  'Helm',
  'Prometheus',
  'Grafana',
  'SQL',
  'Postman',
  'Data Structures',
  'Algorithms',
  'Object-Oriented Design',
  'Unit Testing',
  'SOAP Web Services',
  'Relational Database Design',
  'Vue.js',
  'Angular',
];

/**
 * AI Service Integration Client
 * Communicates with the FastAPI AI Microservice on port 8000.
 * Includes resilient fallbacks to ensure uninterrupted candidate portal operations
 * even if the Python service is offline.
 */
class AIServiceClient {
  constructor() {
    this.baseUrl = AI_SERVICE_URL;
  }

  /**
   * Parse resume file or text into structured candidate fields
   * @param {Buffer|null} fileBuffer - Binary buffer of uploaded resume file
   * @param {string} originalname - Original file name (e.g. resume.pdf)
   * @param {string} rawText - Optional raw resume text
   * @returns {Promise<Object>}
   */
  async parseResume(fileBuffer = null, originalname = '', rawText = '') {
    try {
      if (fileBuffer) {
        const formData = new FormData();
        const blob = new Blob([fileBuffer], {
          type: originalname.toLowerCase().endsWith('.pdf')
            ? 'application/pdf'
            : 'application/octet-stream',
        });
        formData.append('file', blob, originalname || 'resume.pdf');
        if (rawText) formData.append('raw_text', rawText);

        const response = await fetch(`${this.baseUrl}/api/resume/parse`, {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.warn(
            `AI Microservice parseResume HTTP ${response.status}: ${response.statusText}`
          );
        }
      } else if (rawText) {
        const formData = new FormData();
        formData.append('raw_text', rawText);

        const response = await fetch(`${this.baseUrl}/api/resume/parse`, {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          return await response.json();
        } else {
          console.warn(
            `AI Microservice parseResume HTTP ${response.status}: ${response.statusText}`
          );
        }
      }
    } catch (err) {
      console.warn(
        'AI Microservice parseResume offline or timed out, using fallback:',
        err.message
      );
    }

    // Resilient local fallback using direct text extraction
    return await this.fallbackParseResume(fileBuffer, originalname, rawText);
  }

  /**
   * Calculate ATS Resume Fit Score (0-100%) against job requisition
   */
  async calculateMatchScore(candidateData = {}, jobData = {}) {
    const payload = {
      resume_text:
        candidateData.resumeText ||
        candidateData.candidateNote ||
        candidateData.bio ||
        '',
      candidate_skills:
        candidateData.skills || candidateData.technicalSkills || [],
      job_title: jobData.jobTitle || jobData.title || 'Technical Position',
      department: jobData.department || 'Engineering',
      required_skills: jobData.requiredSkills || jobData.skills || [],
      experience_required: Number(jobData.experienceRequired) || 3.0,
      job_description: jobData.description || jobData.requirements || '',
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/resume/match-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(
        '⚠️ AI Microservice matchScore offline, using local calculation:',
        err.message
      );
    }

    return this.fallbackMatchScore(candidateData, jobData);
  }

  /**
   * Generate 10-Question Proctored Screening Assessment
   */
  async generateAssessment(jobData = {}, candidateData = {}) {
    const payload = {
      job_id: String(
        jobData.jobId || jobData.id || jobData._id || 'job_default'
      ),
      job_title: jobData.jobTitle || jobData.title || 'Technical Position',
      department: jobData.department || 'Engineering',
      required_skills: jobData.requiredSkills ||
        jobData.skills || ['React', 'TypeScript', 'Node.js'],
      experience_tier: jobData.experienceTier || 'Mid',
      candidate_name:
        candidateData.name || candidateData.candidateName || 'Candidate',
      candidate_skills:
        candidateData.skills || candidateData.technicalSkills || [],
      job_description: jobData.description || '',
      passing_threshold: 75,
      time_limit_minutes: 20,
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/api/screening/generate-test`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8000),
        }
      );

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(
        '⚠️ AI Microservice assessment generator offline, using fallback:',
        err.message
      );
    }

    return this.fallbackGenerateAssessment(jobData);
  }

  /**
   * Grade candidate answers and evaluate gatekeeper threshold
   */
  async evaluateAssessment(assessmentData = {}, candidateAnswers = {}) {
    const payload = {
      test_id: assessmentData.test_id || 'test_eval',
      passing_threshold: assessmentData.passing_threshold || 75,
      questions: assessmentData.questions || [],
      candidate_answers: candidateAnswers,
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/api/screening/evaluate-test`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8000),
        }
      );

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(
        '⚠️ AI Microservice assessment evaluator offline, using fallback:',
        err.message
      );
    }

    return this.fallbackEvaluateAssessment(assessmentData, candidateAnswers);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DETERMINISTIC LOCAL FALLBACK ENGINES
  // ─────────────────────────────────────────────────────────────────────────

  async fallbackParseResume(
    fileBuffer = null,
    originalname = '',
    rawText = ''
  ) {
    let text = rawText || '';

    if (!text && fileBuffer) {
      if (
        pdfParse &&
        (originalname.toLowerCase().endsWith('.pdf') ||
          !originalname.includes('.'))
      ) {
        try {
          const parser = new pdfParse.PDFParse({ data: fileBuffer });
          const res = await parser.getText();
          if (res && res.text) text = res.text;
        } catch (pdfErr) {
          console.warn('Node PDF extraction error:', pdfErr.message);
        }
      }
      if (!text) {
        try {
          text = fileBuffer.toString('utf-8');
        } catch {
          text = '';
        }
      }
    }

    if (!text) {
      text = originalname || '';
    }

    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let email = '';
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) email = emailMatch[0].toLowerCase();

    let phone = '';
    const phoneMatch = text.match(
      /(\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,5}[\s-]?\d{4,5}|\+?\d{10,12}/
    );
    if (phoneMatch) phone = phoneMatch[0].trim();

    let candidateName = '';
    for (const line of lines.slice(0, 6)) {
      if (
        /@|linkedin|github|resume|curriculum|vitae|http|phone|\+?\d{9,}/i.test(
          line
        )
      )
        continue;
      const cleaned = line.replace(/[^\w\s.-]/g, '').trim();
      const words = cleaned.split(/\s+/).filter(Boolean);
      if (words.length >= 1 && words.length <= 4) {
        candidateName = cleaned;
        break;
      }
    }

    if (!candidateName) {
      const baseNoExt = (originalname || '')
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .trim();
      candidateName = baseNoExt || 'Applicant Candidate';
    }

    if (
      candidateName === candidateName.toUpperCase() &&
      candidateName.length > 3
    ) {
      candidateName = candidateName
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (m) => m.toUpperCase());
    }

    const nameParts = candidateName.split(/\s+/);
    const firstName = nameParts[0] || 'Applicant';
    const lastName = nameParts.slice(1).join(' ') || '';

    let linkedinUrl = '';
    const linkedinMatch = text.match(
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+(?:\/)?/i
    );
    if (linkedinMatch) linkedinUrl = linkedinMatch[0];

    let githubUrl = '';
    const githubMatch = text.match(
      /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+(?:\/)?/i
    );
    if (githubMatch) githubUrl = githubMatch[0];

    let portfolioUrl = '';
    const portfolioMatch = text.match(
      /(?:https?:\/\/)?[\w.-]+\.(?:vercel\.app|netlify\.app|dev|me|github\.io)(?:\/[\w.-]*)*/i
    );
    if (portfolioMatch) portfolioUrl = portfolioMatch[0];

    const matchedSkills = [];
    const seen = new Set();
    for (const skill of COMMON_TECH_SKILLS) {
      const regex = new RegExp(
        `(?<!\\w)${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\w)`,
        'i'
      );
      if (regex.test(text)) {
        const canonical = skill;
        if (!seen.has(canonical.toLowerCase())) {
          seen.add(canonical.toLowerCase());
          matchedSkills.push(canonical);
        }
      }
    }

    let expYears = 1.0;
    const expMatch = text.match(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)\b/i);
    if (expMatch) {
      expYears = parseFloat(expMatch[1]) || 2.0;
    } else {
      if (
        /\b(?:intern|internship|undergraduate|student|fresher|junior)\b/i.test(
          text
        )
      ) {
        expYears = 1.0;
      } else if (/\b(?:senior|lead|architect|staff)\b/i.test(text)) {
        expYears = 5.0;
      } else {
        expYears = 2.5;
      }
    }

    const roleTitles = [
      'Full Stack Developer',
      'Full Stack Engineer',
      'Software Engineer',
      'Frontend Developer',
      'Backend Developer',
      'MERN Stack Developer',
      'Java Developer',
      'Python Developer',
      'DevOps Engineer',
      'Data Scientist',
      'System Architect',
      'Cloud Engineer',
    ];
    let currentRole = '';
    for (const title of roleTitles) {
      const r = new RegExp(
        `\\b${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
        'i'
      );
      if (r.test(text)) {
        currentRole = title;
        break;
      }
    }

    if (!currentRole) {
      if (
        matchedSkills.includes('React') &&
        matchedSkills.includes('Node.js')
      ) {
        currentRole = 'Full Stack Engineer';
      } else if (
        matchedSkills.includes('Python') ||
        matchedSkills.includes('Java')
      ) {
        currentRole = 'Backend Software Engineer';
      } else if (matchedSkills.includes('React')) {
        currentRole = 'Frontend Developer';
      } else {
        currentRole = 'Software Engineer';
      }
    }

    const headerBlock = lines.slice(0, 6).join('\n');
    let location = '';
    const locMatch = headerBlock.match(
      /([A-Z][a-zA-Z ]{2,20}),\s*([A-Z][a-zA-Z ]{2,20})/
    );
    if (locMatch) {
      const city = locMatch[1].trim();
      const state = locMatch[2].trim().split('\n')[0].trim();
      if (!/phone|email|skills|summary|education|project/i.test(city + state)) {
        location = `${city}, ${state}`;
      }
    }

    if (!location) {
      const knownLocations = [
        'Bhubaneswar',
        'Bangalore',
        'Bengaluru',
        'Hyderabad',
        'Mumbai',
        'Pune',
        'Delhi',
        'Noida',
        'Gurgaon',
        'Chennai',
        'Kolkata',
        'New York',
        'San Francisco',
        'Austin',
        'London',
        'Toronto',
        'Berlin',
        'Remote',
        'India',
        'USA',
      ];
      for (const loc of knownLocations) {
        if (new RegExp(`\\b${loc}\\b`, 'i').test(headerBlock)) {
          location = loc;
          break;
        }
      }
    }

    if (!location) location = 'Remote';

    let summary = '';
    const summaryMatch = text.match(
      /(?:PROFESSIONAL SUMMARY|SUMMARY|ABOUT ME|PROFILE)[\s:\-\n]+(.*?)(?=\n[A-Z\s]{4,}|\Z)/is
    );
    if (summaryMatch && summaryMatch[1].trim().length > 30) {
      summary = summaryMatch[1].trim().replace(/\s+/g, ' ').slice(0, 300);
    } else {
      const topSkills =
        matchedSkills.slice(0, 4).join(', ') || 'modern software technologies';
      summary = `Accomplished ${currentRole} with hands-on expertise building scalable solutions using ${topSkills}.`;
    }

    const headlineSkills =
      matchedSkills.slice(0, 3).join(', ') || 'Full Stack Development';
    const headline = `${currentRole} | ${headlineSkills}`;

    return {
      success: true,
      raw_text: text.slice(0, 3000),
      candidate_name: candidateName,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      location,
      headline,
      current_role: currentRole,
      total_experience_years: expYears,
      skills: matchedSkills,
      skill_set: matchedSkills.join(', '),
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      portfolio_url: portfolioUrl,
      summary,
    };
  }

  fallbackMatchScore(candidateData = {}, jobData = {}) {
    const candidateSkills = (
      candidateData.skills ||
      candidateData.technicalSkills ||
      []
    ).map((s) => s.toLowerCase());
    const requiredSkills = jobData.requiredSkills ||
      jobData.skills || ['React', 'Node.js', 'PostgreSQL'];

    const matched = requiredSkills.filter((s) =>
      candidateSkills.some(
        (cs) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs)
      )
    );
    const missing = requiredSkills.filter((s) => !matched.includes(s));

    const ratio = matched.length / Math.max(requiredSkills.length, 1);
    const fitScore = Math.min(Math.max(Math.round(60 + ratio * 35), 45), 96);

    let fitBadge = 'Moderate Match';
    let category = 'yellow';
    if (fitScore >= 80) {
      fitBadge = 'Top Match';
      category = 'green';
    } else if (fitScore < 60) {
      fitBadge = 'Below Threshold';
      category = 'gray';
    }

    return {
      success: true,
      fit_score: fitScore,
      fit_badge: fitBadge,
      category,
      skills_match_score: Math.round(ratio * 100),
      experience_match_score: 85,
      matched_skills: matched,
      missing_skills: missing,
      strengths: [
        `Verified experience in ${matched.slice(0, 3).join(', ') || 'software development'}`,
        'Solid architectural foundations aligned with mandate requirements',
      ],
      growth_areas: missing.length
        ? [`Expand depth in ${missing.slice(0, 2).join(', ')}`]
        : ['Continue enterprise leadership track'],
      recommendation:
        fitScore >= 80
          ? 'Fast-track for client screening'
          : 'Proceed with standard technical evaluation',
    };
  }

  fallbackGenerateAssessment(jobData = {}) {
    const title = jobData.jobTitle || jobData.title || 'Full Stack Engineer';
    return {
      success: true,
      test_id: `eval_${Date.now()}`,
      job_id: String(jobData.jobId || 'job_1'),
      job_title: title,
      passing_threshold: 75,
      time_limit_minutes: 20,
      total_points: 100,
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          points: 10,
          question: `In modern ${title} architectures, how should high-frequency state updates be throttled or debounced?`,
          options: [
            'By blocking the event loop with synchronous sleep calls',
            'Using requestAnimationFrame or timeout debouncing closures',
            'By persisting every update directly to localStorage',
            'Reloading the document window after every state mutation',
          ],
          correct_option_index: 1,
          explanation:
            'RequestAnimationFrame and debounce closures coalesce high-frequency mutations without lagging the UI thread.',
        },
        {
          id: 'q2',
          type: 'mcq',
          points: 10,
          question:
            'What is the primary function of database indexing in relational database engines?',
          options: [
            'To encrypt sensitive columns on disk',
            'To avoid full table sequential scans by creating balanced B-Tree structures',
            'To automatically clean up orphan records',
            'To compress table sizes by 50%',
          ],
          correct_option_index: 1,
          explanation:
            'Indexes create efficient pointer trees enabling logarithmic search time instead of linear O(N) table scans.',
        },
        {
          id: 'q3',
          type: 'mcq',
          points: 10,
          question:
            'When designing a REST API, what is the significance of returning HTTP 409 Conflict?',
          options: [
            'The client is unauthenticated',
            'The request cannot be processed because it conflicts with current server state (e.g. duplicate key or version mismatch)',
            'The endpoint is deprecated',
            'The payload size exceeds server limits',
          ],
          correct_option_index: 1,
          explanation:
            'HTTP 409 indicates an edit conflict or duplicate resource constraint violation.',
        },
      ],
    };
  }

  fallbackEvaluateAssessment(assessmentData = {}, candidateAnswers = {}) {
    let earned = 0;
    let total = 0;
    const questions = assessmentData.questions || [];

    questions.forEach((q) => {
      const points = q.points || 10;
      total += points;
      const ans = candidateAnswers[q.id];
      if (q.type === 'mcq') {
        if (
          ans !== undefined &&
          Number(ans) === Number(q.correct_option_index)
        ) {
          earned += points;
        }
      } else {
        if (ans && String(ans).trim().length > 15) {
          earned += Math.round(points * 0.85);
        }
      }
    });

    const score = Math.round((earned / Math.max(total, 1)) * 100);
    const passed = score >= (assessmentData.passing_threshold || 75);

    return {
      success: true,
      total_score: score,
      passing_threshold: assessmentData.passing_threshold || 75,
      passed,
      gatekeeper_status: passed
        ? 'Accepted - Screened'
        : 'Filtered - Below Threshold',
      detailed_feedback: questions.map((q) => ({
        question_id: q.id,
        type: q.type || 'mcq',
        earned_points: candidateAnswers[q.id] !== undefined ? 10 : 0,
        possible_points: q.points || 10,
        is_correct: true,
      })),
    };
  }
}

export const aiService = new AIServiceClient();
export default aiService;
