import * as XLSX from 'xlsx';

/**
 * 1. Standard Job Requirements Column Definitions
 */
export const JOB_REQUIREMENT_COLUMNS = [
  {
    header: 'Job Title',
    key: 'title',
    required: true,
    aliases: ['job title', 'title', 'role', 'position', 'designation'],
    sample: 'Senior Full Stack Engineer',
  },
  {
    header: 'Client Name',
    key: 'client',
    required: true,
    aliases: ['client name', 'client', 'company', 'organization'],
    sample: 'Acme Global Corp',
  },
  {
    header: 'Industry Sector',
    key: 'industry',
    aliases: ['industry sector', 'industry', 'domain'],
    default: 'Information Technology & Cloud',
    sample: 'Information Technology & Cloud',
  },
  {
    header: 'Employment Mode',
    key: 'jobMode',
    aliases: ['employment mode', 'job mode', 'engagement type', 'type'],
    default: 'Permanent',
    sample: 'Permanent',
  },
  {
    header: 'Work Mode',
    key: 'workMode',
    aliases: ['work mode', 'work arrangement', 'remote status'],
    default: 'Work From Office',
    sample: 'Hybrid',
  },
  {
    header: 'Office Location',
    key: 'officeLocation',
    aliases: ['office location', 'location', 'city'],
    default: 'Bangalore, India',
    sample: 'Bangalore, India',
  },
  {
    header: 'Experience (Years)',
    key: 'experienceRequired',
    type: 'number',
    aliases: ['experience (years)', 'experience', 'min experience', 'exp'],
    default: 3,
    sample: 5,
  },
  {
    header: 'Notice Period',
    key: 'noticePeriod',
    aliases: ['notice period', 'joining', 'availability'],
    default: 'Immediate',
    sample: '15 Days',
  },
  {
    header: 'Required Skills',
    key: 'requiredSkills',
    aliases: ['required skills', 'skills', 'tech stack', 'primary skills'],
    default: '',
    sample: 'React.js, Node.js, TypeScript, AWS',
  },
  {
    header: 'Openings Count',
    key: 'openingsCount',
    type: 'number',
    aliases: ['openings count', 'openings', 'vacancies', 'headcount'],
    default: 1,
    sample: 2,
  },
  {
    header: 'Budget / Salary',
    key: 'budget',
    aliases: ['budget / salary', 'budget', 'salary', 'ctc', 'package'],
    default: '',
    sample: '₹28-35 LPA ($45-55k)',
  },
  {
    header: 'Priority',
    key: 'priority',
    aliases: ['priority', 'urgency', 'sla'],
    default: 'High',
    sample: 'High',
  },
  {
    header: 'Status',
    key: 'status',
    aliases: ['status', 'state'],
    default: 'Open',
    sample: 'Open',
  },
  {
    header: 'Job Description',
    key: 'description',
    aliases: ['job description', 'description', 'summary', 'overview'],
    default: '',
    sample: 'Lead core engineering initiatives and build high-scale microservices.',
  },
  {
    header: 'Key Requirements',
    key: 'requirements',
    aliases: ['key requirements', 'requirements', 'qualifications'],
    default: '',
    sample: 'Solid CS fundamentals; 4+ yrs React and Node in production.',
  },
];

/**
 * 2. Enterprise Candidate ATS Column Definitions (User Specified 17 Columns)
 */
export const CANDIDATE_ATS_COLUMNS = [
  {
    header: 'Application Date',
    key: 'applicationDate',
    aliases: ['application date', 'app date', 'date of application', 'date'],
    default: () => new Date().toISOString().split('T')[0],
    sample: new Date().toISOString().split('T')[0],
  },
  {
    header: 'Month',
    key: 'month',
    aliases: ['month', 'application month', 'cohort'],
    default: () =>
      new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    sample: 'November 2026',
  },
  {
    header: 'Mode',
    key: 'mode',
    aliases: ['mode', 'employment mode', 'work mode', 'engagement mode'],
    default: 'Permanent',
    sample: 'Permanent',
  },
  {
    header: 'Name',
    key: 'name',
    required: true,
    aliases: ['name', 'full name', 'candidate name', 'candidate'],
    sample: 'Arjun Sharma',
  },
  {
    header: 'Contact No',
    key: 'phone',
    required: true,
    aliases: ['contact no', 'contact', 'mobile', 'mobile no', 'phone', 'phone number'],
    sample: '+91 98765 43210',
  },
  {
    header: 'Email',
    key: 'email',
    required: true,
    isEmail: true,
    aliases: ['email', 'email address', 'email id'],
    sample: 'arjun.sharma@example.com',
  },
  {
    header: 'Client',
    key: 'client',
    aliases: ['client', 'client name', 'target client', 'account'],
    default: 'Enterprise Partner',
    sample: 'Goldman Sachs',
  },
  {
    header: 'Primary Skill',
    key: 'primarySkill',
    aliases: ['primary skill', 'primary skills', 'technical skills', 'skills', 'skillset'],
    default: '',
    sample: 'React.js, Node.js, TypeScript, PostgreSQL',
  },
  {
    header: 'Total Experience',
    key: 'totalExperience',
    type: 'number',
    aliases: ['total experience', 'total exp', 'experience', 'total years'],
    default: 0,
    sample: 6.5,
  },
  {
    header: 'Relevant Experience',
    key: 'relevantExperience',
    type: 'number',
    aliases: ['relevant experience', 'relevant exp', 'rel exp'],
    default: 0,
    sample: 4.5,
  },
  {
    header: 'Current Location',
    key: 'currentLocation',
    aliases: ['current location', 'location', 'city'],
    default: 'Bangalore',
    sample: 'Bangalore, India',
  },
  {
    header: 'Preferred Location',
    key: 'preferredLocation',
    aliases: ['preferred location', 'preference', 'work location preference'],
    default: 'Bangalore / Remote',
    sample: 'Bangalore / Remote',
  },
  {
    header: 'Current Company',
    key: 'currentCompany',
    aliases: ['current company', 'current employer', 'company', 'organization'],
    default: '',
    sample: 'Infosys Ltd',
  },
  {
    header: 'CTC',
    key: 'currentCTC',
    aliases: ['ctc', 'current ctc', 'current salary', 'present ctc'],
    default: '',
    sample: '₹18 LPA',
  },
  {
    header: 'Expected CTC',
    key: 'expectedCTC',
    aliases: ['expected ctc', 'expected salary', 'ectc'],
    default: '',
    sample: '₹24 LPA',
  },
  {
    header: 'Rate Card',
    key: 'rateCard',
    aliases: ['rate card', 'rate', 'hourly rate', 'billing rate', 'monthly rate'],
    default: '',
    sample: '$45/hr',
  },
  {
    header: 'Notice Period',
    key: 'noticePeriod',
    aliases: ['notice period', 'np', 'availability', 'joining'],
    default: 'Immediate',
    sample: '15 Days',
  },
];

/**
 * 3. Export Data to Excel (.xlsx) or CSV (.csv)
 */
export const exportToExcel = ({
  data = [],
  columns = [],
  filename = 'export',
  format = 'xlsx',
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No records available to export.');
  }

  // Format rows according to specified columns
  const formattedRows = data.map((item) => {
    const row = {};
    columns.forEach((col) => {
      let val = item[col.key];

      // Array handling (e.g. skills)
      if (Array.isArray(val)) {
        val = val.join(', ');
      }

      // Fallbacks
      if (val === undefined || val === null) {
        val = typeof col.default === 'function' ? col.default() : col.default || '';
      }

      row[col.header] = val;
    });
    return row;
  });

  // Create sheet
  const ws = XLSX.utils.json_to_sheet(formattedRows);

  // Auto-calculate column widths
  const colWidths = columns.map((col) => {
    let maxLen = col.header.length;
    formattedRows.forEach((row) => {
      const cellValue = String(row[col.header] || '');
      if (cellValue.length > maxLen) {
        maxLen = Math.min(cellValue.length, 60);
      }
    });
    return { wch: Math.max(maxLen + 3, 12) };
  });
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  const fileExt = format.toLowerCase() === 'csv' ? 'csv' : 'xlsx';
  const cleanFilename = `${filename.replace(/\.[^/.]+$/, '')}.${fileExt}`;

  if (fileExt === 'csv') {
    const csvOutput = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, cleanFilename);
  } else {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    triggerDownload(blob, cleanFilename);
  }

  return cleanFilename;
};

/**
 * 4. Generate Sample Template File
 */
export const generateSampleTemplate = ({
  columns = [],
  filename = 'sample_template',
  format = 'xlsx',
}) => {
  const sampleRow = {};
  columns.forEach((col) => {
    sampleRow[col.header] = col.sample || '';
  });

  const ws = XLSX.utils.json_to_sheet([sampleRow]);

  const colWidths = columns.map((col) => ({
    wch: Math.max(col.header.length + 4, 14),
  }));
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  const fileExt = format.toLowerCase() === 'csv' ? 'csv' : 'xlsx';
  const cleanFilename = `${filename.replace(/\.[^/.]+$/, '')}.${fileExt}`;

  if (fileExt === 'csv') {
    const csvOutput = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, cleanFilename);
  } else {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    triggerDownload(blob, cleanFilename);
  }

  return cleanFilename;
};

/**
 * Helper to download Blob in browser
 */
const triggerDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 5. Parse and Validate Uploaded File (.xlsx, .xls, .csv)
 */
export const parseFile = async (file, columnDefinitions = []) => {
  if (!file) throw new Error('Please select a file to parse.');

  const fileExt = file.name.split('.').pop().toLowerCase();
  if (!['xlsx', 'xls', 'csv'].includes(fileExt)) {
    throw new Error('Unsupported file format. Please upload an Excel (.xlsx, .xls) or CSV file.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('The uploaded spreadsheet contains no sheets.');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (rawRows.length === 0) {
    throw new Error('The uploaded file is empty. Please check the sheet and try again.');
  }

  // Pre-build a map of normalized headers to column definition
  const headerMap = new Map();
  columnDefinitions.forEach((col) => {
    const cleanHeader = normalizeString(col.header);
    headerMap.set(cleanHeader, col);
    if (Array.isArray(col.aliases)) {
      col.aliases.forEach((alias) => headerMap.set(normalizeString(alias), col));
    }
  });

  const validRows = [];
  const invalidRows = [];

  rawRows.forEach((rawRow, rowIndex) => {
    const rowNumber = rowIndex + 2; // Row 1 is header
    const parsedData = {};
    const errors = [];

    // Map properties from incoming row
    Object.keys(rawRow).forEach((rawHeader) => {
      const cleanHeader = normalizeString(rawHeader);
      const colDef = headerMap.get(cleanHeader);
      if (colDef) {
        let value = rawRow[rawHeader];
        if (typeof value === 'string') {
          value = value.trim();
        }
        parsedData[colDef.key] = value;
      }
    });

    // Validate fields against schema
    columnDefinitions.forEach((col) => {
      let val = parsedData[col.key];

      // Populate default if empty
      if (val === undefined || val === null || val === '') {
        val = typeof col.default === 'function' ? col.default() : col.default || '';
        parsedData[col.key] = val;
      }

      // Check required
      if (col.required && (!val || String(val).trim() === '')) {
        errors.push(`${col.header} is required`);
      }

      // Check email format
      if (col.isEmail && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(val).trim())) {
          errors.push(`Invalid email format (${val})`);
        }
      }

      // Coerce number
      if (col.type === 'number') {
        const num = Number(val);
        parsedData[col.key] = isNaN(num) ? 0 : num;
      }
    });

    if (errors.length > 0) {
      invalidRows.push({
        rowNumber,
        data: parsedData,
        errors,
      });
    } else {
      validRows.push({
        rowNumber,
        data: parsedData,
      });
    }
  });

  return {
    fileName: file.name,
    totalCount: rawRows.length,
    validCount: validRows.length,
    errorCount: invalidRows.length,
    validRows: validRows.map((r) => r.data),
    invalidRows,
  };
};

const normalizeString = (str) =>
  String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
