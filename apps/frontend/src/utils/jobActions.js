/**
 * Utility functions for Job Actions:
 * 1. Generating direct canonical application links
 * 2. WhatsApp opportunity sharing
 * 3. Client-side branded Job Description PDF generation & download
 */

/**
 * Returns the canonical direct application URL for a job.
 */
export const getJobApplicationUrl = (job) => {
  if (!job) return (typeof window !== 'undefined' ? window.location.origin : 'https://thinkwires.com') + '/hot-jobs';

  const jobIdentifier =
    job.id ||
    job._id ||
    'job-' + encodeURIComponent((job.title || 'specialist').toLowerCase().replace(/[^a-z0-9]+/g, '-'));

  const empType = job.jobMode || job.employmentType || job.type || 'Permanent';
  const postDate = job.postedDate
    ? new Date(job.postedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : job.postingDate || 'Active Mandate';

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://thinkwires.com';
  const targetApplyUrl = `/jobs/${jobIdentifier}/apply?title=${encodeURIComponent(job.title || '')}&department=${encodeURIComponent(job.department || 'Engineering')}&location=${encodeURIComponent(job.location || 'Remote')}&employmentType=${encodeURIComponent(empType)}&postingDate=${encodeURIComponent(postDate)}`;

  return `${origin}${targetApplyUrl}`;
};

/**
 * Triggers WhatsApp share with a properly encoded prefilled message.
 */
export const shareJobOnWhatsApp = (job) => {
  if (!job) return;

  const jobTitle = job.title || 'Technical Specialist Opening';
  const compensation = job.salary ? job.salary : 'Not disclosed';
  const applyUrl = getJobApplicationUrl(job);

  const message = `Check out this opportunity: ${jobTitle}
Compensation: ${compensation}
Apply here: ${applyUrl}
Shared via ThinkWires`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Escapes characters for PDF text streams.
 */
const escapePdfText = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
};

/**
 * Wraps long string into lines of max characters without breaking words.
 */
const wrapText = (text, maxChars = 75) => {
  if (!text) return [];
  const words = String(text).split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

/**
 * Generates and triggers download of a clean, standardized ThinkWires-branded PDF.
 * Uses a pure client-side PDF binary generator without external runtime dependencies.
 */
export const downloadJobDescriptionPdf = (job) => {
  if (!job) return;

  const title = job.title || 'Technical Role';
  const company = job.company || 'ThinkWires Client Partner';
  const location = `${job.location || 'Remote'} (${job.workMode || 'Hybrid'})`;
  const experience = `${job.experience || 'Not specified'} • ${job.jobMode || 'Permanent'}`;
  const compensation = job.salary || 'Not disclosed';
  const noticePeriod = job.noticePeriod || job.joining || 'Immediate';
  const department = job.department || job.category || 'Engineering';
  const applyUrl = getJobApplicationUrl(job);

  const descriptionLines = wrapText(
    job.description || 'Join our high-velocity enterprise engineering squads delivering critical technology solutions.',
    75
  );

  let skillsList = [];
  if (Array.isArray(job.skills)) {
    skillsList = job.skills;
  } else if (typeof job.skills === 'string') {
    skillsList = job.skills.split(',').map((s) => s.trim());
  }

  // Build PDF text blocks with coordinates (page 1)
  const streamCommands = [];

  // ThinkWires Brand Header Bar
  streamCommands.push('0.07 0.22 0.69 rg'); // #1237b0 Brand Blue
  streamCommands.push('40 760 532 52 re f');

  // Header Title
  streamCommands.push('1 1 1 rg'); // White
  streamCommands.push('BT /F2 20 Tf 55 782 Td (THINKWIRES - GLOBAL TALENT CLOUD) Tj ET');
  streamCommands.push('BT /F1 9 Tf 55 768 Td (OFFICIAL JOB SPECIFICATION & CANDIDATE BRIEF) Tj ET');

  // Job Title
  streamCommands.push('0.06 0.09 0.16 rg'); // Slate 900
  streamCommands.push(`BT /F2 16 Tf 40 730 Td (${escapePdfText(title)}) Tj ET`);

  // Subtitle
  streamCommands.push('0.39 0.45 0.55 rg'); // Slate 600
  streamCommands.push(`BT /F1 10 Tf 40 714 Td (Organization: ${escapePdfText(company)}  |  Practice: ${escapePdfText(department)}) Tj ET`);

  // Divider line
  streamCommands.push('0.85 0.88 0.92 rg');
  streamCommands.push('40 702 532 1 re f');

  // Specification Grid Box
  streamCommands.push('0.96 0.97 0.98 rg'); // Light slate bg
  streamCommands.push('40 610 532 80 re f');
  streamCommands.push('0.85 0.88 0.92 RG'); // Stroke
  streamCommands.push('40 610 532 80 re S');

  // Specs Rows
  streamCommands.push('0.06 0.09 0.16 rg');
  streamCommands.push(`BT /F2 9 Tf 52 672 Td (Location & Mode:) Tj /F1 9 Tf 135 672 Td (${escapePdfText(location)}) Tj ET`);
  streamCommands.push(`BT /F2 9 Tf 320 672 Td (Experience & Type:) Tj /F1 9 Tf 410 672 Td (${escapePdfText(experience)}) Tj ET`);

  streamCommands.push(`BT /F2 9 Tf 52 648 Td (Compensation:) Tj /F1 9 Tf 135 648 Td (${escapePdfText(compensation)}) Tj ET`);
  streamCommands.push(`BT /F2 9 Tf 320 648 Td (Notice Period:) Tj /F1 9 Tf 410 648 Td (${escapePdfText(noticePeriod)}) Tj ET`);

  streamCommands.push(`BT /F2 9 Tf 52 624 Td (Direct Client SLA:) Tj /F1 9 Tf 135 624 Td (48-Hour Interview Guarantee) Tj ET`);
  streamCommands.push(`BT /F2 9 Tf 320 624 Td (Placement Fee:) Tj /F1 9 Tf 410 624 Td (Zero Candidate Deductions) Tj ET`);

  // Overview Header
  streamCommands.push('0.07 0.22 0.69 rg');
  streamCommands.push('BT /F2 12 Tf 40 575 Td (Role Overview & Scope) Tj ET');

  let currentY = 555;
  streamCommands.push('0.2 0.25 0.33 rg');
  for (const line of descriptionLines) {
    streamCommands.push(`BT /F1 9.5 Tf 40 ${currentY} Td (${escapePdfText(line)}) Tj ET`);
    currentY -= 14;
  }

  currentY -= 12;

  // Required Tech Stack & Core Competencies
  if (skillsList.length > 0) {
    streamCommands.push('0.07 0.22 0.69 rg');
    streamCommands.push(`BT /F2 12 Tf 40 ${currentY} Td (Primary Tech Stack & Core Skills) Tj ET`);
    currentY -= 18;

    streamCommands.push('0.2 0.25 0.33 rg');
    const skillsChunked = [];
    for (let i = 0; i < skillsList.length; i += 3) {
      skillsChunked.push(skillsList.slice(i, i + 3).join('   *   '));
    }

    for (const skillRow of skillsChunked) {
      streamCommands.push(`BT /F1 9 Tf 45 ${currentY} Td (*   ${escapePdfText(skillRow)}) Tj ET`);
      currentY -= 14;
    }
  }

  currentY -= 12;

  // Benefits & Working Standards
  streamCommands.push('0.07 0.22 0.69 rg');
  streamCommands.push(`BT /F2 12 Tf 40 ${currentY} Td (Workplace Standards & Candidate Benefits) Tj ET`);
  currentY -= 18;

  const benefits = [
    'Direct client engagement with global product enterprises & tier-1 unicorns.',
    'Statutory cross-border EOR compliance across India, US, and Canada.',
    'Fast-track ATS resume scoring and direct technical panel interviews.',
    'Comprehensive healthcare, equipment stipend, and transparent payouts.',
  ];

  streamCommands.push('0.2 0.25 0.33 rg');
  for (const b of benefits) {
    streamCommands.push(`BT /F1 9 Tf 45 ${currentY} Td (-  ${escapePdfText(b)}) Tj ET`);
    currentY -= 14;
  }

  // Application Box Footer
  streamCommands.push('0.92 0.95 1 rg'); // Soft blue highlight box
  streamCommands.push('40 60 532 65 re f');
  streamCommands.push('0.15 0.39 0.92 RG');
  streamCommands.push('40 60 532 65 re S');

  streamCommands.push('0.07 0.22 0.69 rg');
  streamCommands.push('BT /F2 10 Tf 52 104 Td (HOW TO APPLY DIRECTLY:) Tj ET');

  streamCommands.push('0.2 0.25 0.33 rg');
  streamCommands.push('BT /F1 8.5 Tf 52 90 Td (Apply online with your resume via the ThinkWires ATS portal at:) Tj ET');
  streamCommands.push(`BT /F2 8.5 Tf 52 75 Td (${escapePdfText(applyUrl.substring(0, 85))}) Tj ET`);

  // Footer Disclaimer
  streamCommands.push('0.55 0.6 0.68 rg');
  streamCommands.push('BT /F1 8 Tf 40 40 Td (Copyright 2026 ThinkWires Global Corp. Confidential and proprietary talent specification.) Tj ET');

  const contentStream = streamCommands.join('\n');
  const streamLength = contentStream.length;

  // Build PDF document objects
  const pdfBody = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Resources <<
    /Font <<
      /F1 4 0 R
      /F2 5 0 R
    >>
  >>
  /Contents 6 0 R
>>
endobj
4 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj
5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj
6 0 obj
<<
  /Length ${streamLength}
>>
stream
${contentStream}
endstream
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000337 00000 n 
0000000413 00000 n 
trailer
<<
  /Size 7
  /Root 1 0 R
>>
startxref
${470 + streamLength}
%%EOF`;

  // Trigger browser download via Blob
  const blob = new Blob([pdfBody], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeFilename = `ThinkWires-${(job.title || 'Job')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}-JD.pdf`;

  a.href = url;
  a.download = safeFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};

