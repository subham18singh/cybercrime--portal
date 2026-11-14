/**
 * CYBERSHIELD AI - Universal Zod Schemas & Field Validators
 * Used by both Next.js Server & React Client
 */
import { z } from 'zod';
import { parseIndianAmount, normalizeIndicDigits } from './indianNumbers.js';
import { getCrimeSchema, CRIME_TYPES } from './crimeSchemas.js';

// ---------------------------------------------------------------------------
// 1. Phone Validator (Indian 10-digit mobile, +91 allowed)
// ---------------------------------------------------------------------------
export function cleanIndianPhone(phone) {
  if (!phone) return '';
  const normalized = normalizeIndicDigits(String(phone));
  // Strip all non-digit characters
  const digits = normalized.replace(/\D/g, '');
  // If starts with 91 and has 12 digits, strip country code
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  // If starts with 0 and has 11 digits
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export const phoneSchema = z.string().transform((val, ctx) => {
  const cleaned = cleanIndianPhone(val);
  // Valid Indian mobile numbers start with 6, 7, 8, or 9 and are 10 digits long
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please enter a valid 10-digit Indian mobile number (starting with 6-9).',
    });
    return z.NEVER;
  }
  return cleaned;
});

// ---------------------------------------------------------------------------
// 2. Email Validator
// ---------------------------------------------------------------------------
export const emailSchema = z.string().trim().email('Please enter a valid email address.');
export const optionalEmailSchema = z.string().trim().optional().transform((val, ctx) => {
  if (!val || val.toLowerCase() === 'skip' || val.toLowerCase() === 'none' || val.trim() === '') {
    return '';
  }
  const result = z.string().email().safeParse(val);
  if (!result.success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid email address format (or reply "skip" to pass).',
    });
    return z.NEVER;
  }
  return val.trim();
});

// ---------------------------------------------------------------------------
// 3. Amount Validator (Accepts lakh/crore, Indic numerals, returns Integer >= 0)
// ---------------------------------------------------------------------------
const MAX_SANE_AMOUNT = 500000000; // 50 Crore INR

export const amountSchema = z.union([z.number(), z.string()]).transform((val, ctx) => {
  const parsed = parseIndianAmount(val);
  if (parsed === null || isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please provide a valid amount in rupees (e.g. 5000, 1.5 lakh, or 0).',
    });
    return z.NEVER;
  }
  if (parsed < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Amount cannot be negative.',
    });
    return z.NEVER;
  }
  if (parsed > MAX_SANE_AMOUNT) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Amount exceeds the maximum limit for single cyber incident reporting.',
    });
    return z.NEVER;
  }
  return parsed;
});

// ---------------------------------------------------------------------------
// 4. UPI ID Validator (name@bank)
// ---------------------------------------------------------------------------
export const upiIdSchema = z.string().trim().transform((val, ctx) => {
  const cleaned = val.trim().toLowerCase();
  // Standard UPI VPA pattern: alphanumeric/dots/hyphens @ alphanumeric
  if (!/^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32}$/.test(cleaned)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please provide a valid UPI handle (e.g. username@okhdfcbank or 9876543210@paytm).',
    });
    return z.NEVER;
  }
  return cleaned;
});

// ---------------------------------------------------------------------------
// 5. URL Validator
// ---------------------------------------------------------------------------
export const urlSchema = z.string().trim().transform((val, ctx) => {
  let cleaned = val.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  try {
    const parsed = new URL(cleaned);
    if (!parsed.hostname.includes('.')) {
      throw new Error('Invalid host');
    }
    return cleaned;
  } catch (err) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please provide a valid website address or link (e.g. https://fraud-site.top).',
    });
    return z.NEVER;
  }
});

// ---------------------------------------------------------------------------
// 6. Natural & Strict Date Validator
// - Parses "today", "aaj", "yesterday", "kal", "12 March", "DD/MM/YYYY", "YYYY-MM-DD"
// - Rejects invalid calendar dates (e.g. 31/02/2026)
// - Rejects future dates
// - Returns standardized ISO date: "YYYY-MM-DD"
// ---------------------------------------------------------------------------
export function parseDateString(rawInput) {
  if (!rawInput) return null;
  const input = normalizeIndicDigits(String(rawInput)).trim().toLowerCase();

  const now = new Date();
  // Strip time component for pure date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Relative: today
  if (
    input === 'today' || input === 'aaj' || input === 'आज' ||
    input === 'ajj' || input === 'ਅੱਜ' || input === 'inniku' || input === 'eeroju' ||
    /\b(?:today|aaj|आज|ajj|ਅੱਜ)\b/i.test(input)
  ) {
    return today.toISOString().split('T')[0];
  }

  // Relative: yesterday
  if (
    input === 'yesterday' || input === 'kal' || input === 'कल' ||
    input === 'kall' || input === 'ਕੱਲ' || input === 'netru' || input === 'ninna' ||
    /\b(?:yesterday|kal|कल|kall|ਕੱਲ|netru|ninna)\b/i.test(input)
  ) {
    const yest = new Date(today);
    yest.setDate(yest.getDate() - 1);
    return yest.toISOString().split('T')[0];
  }

  // Relative: day before yesterday
  if (
    input === 'parso' || input === 'day before yesterday' || input === 'परसों' ||
    /\b(?:parso|day before yesterday|परसों)\b/i.test(input)
  ) {
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);
    return dayBefore.toISOString().split('T')[0];
  }

  // Match ISO YYYY-MM-DD
  const isoMatch = input.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    return validateAndFormatDate(year, month, day, today);
  }

  // Match DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = input.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    let year = parseInt(dmyMatch[3], 10);
    if (year < 100) year += 2000;
    return validateAndFormatDate(year, month, day, today);
  }

  // Match "12 March" or "12 March 2026" or "March 12, 2026"
  const monthNames = {
    jan: 0, january: 0, जनवरी: 0,
    feb: 1, february: 1, फ़रवरी: 1, फरवरी: 1,
    mar: 2, march: 2, मार्च: 2,
    apr: 3, april: 3, अप्रैल: 3,
    may: 4, मई: 4,
    jun: 5, june: 5, जून: 5,
    jul: 6, july: 6, जुलाई: 6,
    aug: 7, august: 7, अगस्त: 7,
    sep: 8, sept: 8, september: 8, सितंबर: 8,
    oct: 9, october: 9, अक्टूबर: 9,
    nov: 10, november: 10, नवंबर: 10,
    dec: 11, december: 11, दिसंबर: 11,
  };

  const wordDateMatch = input.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z\u0900-\u097F]+)(?:\s+(\d{4}))?/i);
  if (wordDateMatch) {
    const day = parseInt(wordDateMatch[1], 10);
    const monStr = wordDateMatch[2].toLowerCase();
    const mon = monthNames[monStr] !== undefined ? monthNames[monStr] : null;
    const year = wordDateMatch[3] ? parseInt(wordDateMatch[3], 10) : today.getFullYear();

    if (mon !== null) {
      return validateAndFormatDate(year, mon, day, today);
    }
  }

  // Try standard Date.parse as last attempt
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) {
    return validateAndFormatDate(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), today);
  }

  return null;
}

function validateAndFormatDate(year, month, day, today) {
  // Calendar check: date object must have identical year, month, day
  const dt = new Date(year, month, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month || dt.getDate() !== day) {
    // e.g. 31/02/2026 rolls over to March -> Invalid!
    return null;
  }

  // Future check: cannot be in the future
  if (dt > today) {
    return null;
  }

  // Year sanity check: not before 2000
  if (year < 2000) {
    return null;
  }

  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const dateSchema = z.string().transform((val, ctx) => {
  const parsed = parseDateString(val);
  if (!parsed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please provide a valid incident date (e.g. "yesterday", "12 March", or DD/MM/YYYY). Future or impossible dates (like 31/02) are not permitted.',
    });
    return z.NEVER;
  }
  return parsed;
});

// ---------------------------------------------------------------------------
// 7. Description Validator (Min length, not gibberish)
// ---------------------------------------------------------------------------
export const descriptionSchema = z.string().transform((val, ctx) => {
  const trimmed = val.trim();
  if (trimmed.length < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please describe the incident in at least 10 characters so officers have adequate context.',
    });
    return z.NEVER;
  }
  // Check for repeated character gibberish e.g. "aaaaaaa", "asdfasdfasdf"
  const isRepeated = /(.)\1{6,}/.test(trimmed);
  if (isRepeated) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please provide a meaningful description of what transpired rather than repetitive characters.',
    });
    return z.NEVER;
  }
  return trimmed;
});

// ---------------------------------------------------------------------------
// 8. Dynamic Complaint Schema Builder for Review Page & Server Validation
// ---------------------------------------------------------------------------
export function buildComplaintSchema(crimeType) {
  const schemaDef = getCrimeSchema(crimeType);
  const shape = {};

  // Build validators for each field in definition
  Object.entries(schemaDef.fieldDefinitions).forEach(([key, field]) => {
    let fieldValidator;

    switch (field.type) {
      case 'phone':
        fieldValidator = phoneSchema;
        break;
      case 'email':
        fieldValidator = field.required ? emailSchema : optionalEmailSchema;
        break;
      case 'amount':
        fieldValidator = field.required ? amountSchema : amountSchema.optional();
        break;
      case 'date':
        fieldValidator = dateSchema;
        break;
      case 'url':
        fieldValidator = urlSchema;
        break;
      case 'description':
        fieldValidator = descriptionSchema;
        break;
      default:
        fieldValidator = field.required
          ? z.string().trim().min(2, `${field.label} must be at least 2 characters.`)
          : z.string().trim().optional();
        break;
    }

    shape[key] = fieldValidator;
  });

  return z.object(shape);
}

/**
 * Validates a single extracted field value against its schema
 */
export function validateSingleField(fieldKey, rawValue, crimeType) {
  const schemaDef = getCrimeSchema(crimeType);
  const fieldDef = schemaDef.fieldDefinitions[fieldKey];

  if (!fieldDef) {
    // If not a recognized schema field, treat as safe trimmed string
    return { success: true, data: typeof rawValue === 'string' ? rawValue.trim() : rawValue };
  }

  // Handle explicit skip on optional field
  if (!fieldDef.required && typeof rawValue === 'string') {
    const lower = rawValue.trim().toLowerCase();
    if (lower === 'skip' || lower === 'none' || lower === 'pass' || lower === 'na') {
      return { success: true, data: '' };
    }
  }

  let validator;
  switch (fieldDef.type) {
    case 'phone':
      validator = phoneSchema;
      break;
    case 'email':
      validator = fieldDef.required ? emailSchema : optionalEmailSchema;
      break;
    case 'amount':
      validator = amountSchema;
      break;
    case 'date':
      validator = dateSchema;
      break;
    case 'url':
      validator = urlSchema;
      break;
    case 'description':
      validator = descriptionSchema;
      break;
    default:
      validator = fieldDef.required
        ? z.string().trim().min(2, `${fieldDef.label} must be at least 2 characters.`)
        : z.string().trim().optional();
      break;
  }

  const result = validator.safeParse(rawValue);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errorMsg = result.error.issues?.[0]?.message || 'Invalid value.';
    return { success: false, error: errorMsg };
  }
}
