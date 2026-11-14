/**
 * CYBERSHIELD AI - Indian Numbers & Indic Numeral Parser
 * Handles:
 * - Devanagari, Gurmukhi, Bengali, Gujarati, Tamil, Telugu digits
 * - Indian number words & abbreviations (lakh, lac, crore, cr, k, thousand)
 * - Indian comma grouping (1,50,000 -> 150000)
 * - Currency prefixes (₹, Rs, Rs., INR, रुपये, etc.)
 */

// Mapping of Indic digits to standard ASCII digits '0'-'9'
const INDIC_DIGIT_MAP = {
  // Devanagari (Hindi, Marathi)
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  // Gurmukhi (Punjabi)
  '੦': '0', '੧': '1', '੨': '2', '੩': '3', '੪': '4',
  '੫': '5', '੬': '6', '੭': '7', '੮': '8', '੯': '9',
  // Bengali
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  // Gujarati
  '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4',
  '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9',
  // Tamil
  '௦': '0', '௧': '1', '௨': '2', '௩': '3', '௪': '4',
  '௫': '5', '௬': '6', '௭': '7', '௮': '8', '௯': '9',
  // Telugu
  '౦': '0', '౧': '1', '౨': '2', '౩': '3', '౪': '4',
  '౫': '5', '౬': '6', '౭': '7', '౮': '8', '౯': '9',
};

/**
 * Replaces any Indic digits in a string with standard ASCII digits 0-9
 */
export function normalizeIndicDigits(input) {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str.replace(/[\u0966-\u096F\u0A66-\u0A6F\u09E6-\u09EF\u0AE6-\u0AEF\u0BE6-\u0BEF\u0C66-\u0C6F]/g, (char) => {
    return INDIC_DIGIT_MAP[char] || char;
  });
}

/**
 * Parses any Indian amount string or number into a standard integer or float.
 * Examples:
 * - "2 lakh" -> 200000
 * - "1.5 lakh" -> 150000
 * - "₹ 1,50,000" -> 150000
 * - "५०००" -> 5000
 * - "3 crore" -> 30000000
 * - "Rs. 25000" -> 25000
 */
export function parseIndianAmount(input) {
  if (typeof input === 'number') {
    return isNaN(input) ? null : Math.round(input);
  }
  if (!input || typeof input !== 'string') return null;

  // Convert Indic digits to standard 0-9
  let text = normalizeIndicDigits(input).trim().toLowerCase();

  // Strip currency prefixes & noise
  text = text
    .replace(/(?:rs\.?|inr|₹|rupaye|rupees|rupee|रुपये|रुपए|ਰੁਪਏ|টাকা|ரூபாய்|రూపాయలు)/gi, ' ')
    .replace(/,/g, '') // Remove comma separators
    .trim();

  // Check for Crore multipliers
  // e.g. "2.5 crore", "1 cr", "२ करोड़"
  const croreMatch = text.match(/^([0-9]+(?:\.[0-9]+)?)\s*(?:crore|crores|cr|करोड़|ਕਰੋੜ|কোটি|கோடி|కోట్లు)/i);
  if (croreMatch) {
    const base = parseFloat(croreMatch[1]);
    return Math.round(base * 10000000);
  }

  // Check for Lakh / Lac multipliers
  // e.g. "2 lakh", "1.5 lac", "लाख", "ਲੱਖ"
  const lakhMatch = text.match(/^([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lakhs|lac|lacs|लाख|ਲੱਖ|লাখ|லட்சம்|లక్ష)/i);
  if (lakhMatch) {
    const base = parseFloat(lakhMatch[1]);
    return Math.round(base * 100000);
  }

  // Check for Thousand / K multipliers
  // e.g. "50k", "50 thousand", "हज़ार", "ਹਜ਼ਾਰ"
  const thousandMatch = text.match(/^([0-9]+(?:\.[0-9]+)?)\s*(?:thousand|thousands|k|हज़ार|हजार|ਹਜ਼ਾਰ|হাজার|ஆயிரம்|వేలు)/i);
  if (thousandMatch) {
    const base = parseFloat(thousandMatch[1]);
    return Math.round(base * 1000);
  }

  // Extract raw digits if standalone or surrounded by simple text
  const rawNumMatch = text.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (rawNumMatch) {
    const val = parseFloat(rawNumMatch[1]);
    return isNaN(val) ? null : Math.round(val);
  }

  return null;
}

/**
 * Formats a number to Indian currency display: e.g. 150000 -> "₹1,50,000"
 */
export function formatIndianCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const num = Math.round(Number(amount));
  return '₹' + num.toLocaleString('en-IN');
}
