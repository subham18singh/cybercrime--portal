/**
 * CYBERSHIELD AI - Deterministic Scripted Fallback Conversation Engine
 * Used when LLM API call fails or times out.
 */
import { CRIME_TYPES, CRIME_SCHEMAS, getCrimeSchema, getMissingRequiredFields } from '../../shared/crimeSchemas.js';
import { validateSingleField, parseDateString } from '../../shared/validators.js';
import { parseIndianAmount } from '../../shared/indianNumbers.js';
import { getUITranslation } from '../../shared/translations.js';

/**
 * Heuristically infers crime type from raw free-text message.
 */
export function inferCrimeTypeFromText(text) {
  if (!text || typeof text !== 'string') return null;
  const lower = text.toLowerCase();

  // Sextortion / Harassment (check first for safety)
  if (
    lower.includes('blackmail') || lower.includes('nude') || lower.includes('video call') ||
    lower.includes('morph') || lower.includes('threaten to post') || lower.includes('harass') ||
    lower.includes('अश्लील') || lower.includes('धमकी')
  ) {
    return CRIME_TYPES.SEXTORTION_HARASSMENT;
  }

  // Shopping fraud (OLX, e-commerce, fake seller/delivery even if paid via GPay/UPI)
  if (
    lower.includes('olx') || lower.includes('amazon') || lower.includes('flipkart') ||
    lower.includes('courier') || lower.includes('ordered') || lower.includes('delivery') ||
    lower.includes('seller') || lower.includes('instagram shop') || lower.includes('fake shop')
  ) {
    return CRIME_TYPES.SHOPPING_FRAUD;
  }

  // Identity theft & document forgery
  if (
    lower.includes('fake profile') || lower.includes('impersonat') || lower.includes('aadhaar misuse') ||
    lower.includes('sim swap') || lower.includes('duplicate sim') || lower.includes('on my pan') ||
    lower.includes('on my aadhaar') || lower.includes('pan card')
  ) {
    return CRIME_TYPES.IDENTITY_THEFT;
  }

  // Fake Job / Loan / Investment / Task scam
  if (
    lower.includes('telegram') || lower.includes('ਟੈਲੀਗ੍ਰਾਮ') || lower.includes('टेलीग्राम') ||
    lower.includes('job') || lower.includes('task') || lower.includes('ਕੰਮ') || lower.includes('काम') ||
    lower.includes('like youtube') || lower.includes('investment') || lower.includes('crypto') ||
    lower.includes('trading') || lower.includes('loan app') || lower.includes('कमीशन') ||
    lower.includes('ਮੁਨਾਫਾ') || lower.includes('profit') || lower.includes('మోసం') || lower.includes('மோசடி')
  ) {
    return CRIME_TYPES.FAKE_JOB_INVESTMENT;
  }

  // UPI / Online Payment Fraud (Direct money taken/debited via call or app)
  if (
    lower.includes('upi') || lower.includes('gpay') || lower.includes('phonepe') ||
    lower.includes('paytm') || lower.includes('debited') || lower.includes('qr code') ||
    lower.includes('utr') || lower.includes('lost rs') || lower.includes('lost ₹') ||
    lower.includes('took rs') || lower.includes('took ₹') ||
    (lower.includes('sbi') && (lower.includes('took') || lower.includes('rs') || lower.includes('called'))) ||
    lower.includes('पैसे कट गए')
  ) {
    return CRIME_TYPES.UPI_FRAUD;
  }

  // Phishing / Malicious Links
  if (
    lower.includes('link') || lower.includes('.top') || lower.includes('.xyz') ||
    lower.includes('.apk') || lower.includes('sms') || lower.includes('phishing') ||
    lower.includes('click') || lower.includes('kyc update') || lower.includes('pan update') ||
    lower.includes('एसएमएस') || lower.includes('लिंक')
  ) {
    return CRIME_TYPES.PHISHING;
  }

  // Shopping fraud
  if (
    lower.includes('olx') || lower.includes('amazon') || lower.includes('flipkart') ||
    lower.includes('courier') || lower.includes('ordered') || lower.includes('delivery') ||
    lower.includes('seller') || lower.includes('instagram page')
  ) {
    return CRIME_TYPES.SHOPPING_FRAUD;
  }

  // Hacked account
  if (
    lower.includes('hack') || lower.includes('logged out') || lower.includes('otp received') ||
    lower.includes('compromised') || lower.includes('instagram account') || lower.includes('whatsapp hack')
  ) {
    return CRIME_TYPES.HACKED_ACCOUNT;
  }

  // Identity theft
  if (
    lower.includes('fake profile') || lower.includes('impersonat') || lower.includes('aadhaar misuse') ||
    lower.includes('sim swap') || lower.includes('duplicate sim')
  ) {
    return CRIME_TYPES.IDENTITY_THEFT;
  }

  return null;
}

/**
 * Extracts any potential fields from free text using pattern matching.
 */
export function extractFieldsFromText(text, currentCrimeType = null) {
  const extracted = {};
  if (!text || typeof text !== 'string') return extracted;

  // 1. Amount extraction
  const amt = parseIndianAmount(text);
  if (amt !== null && amt > 0) {
    extracted.amount = amt;
  }

  // 2. Date extraction
  const parsedDate = parseDateString(text);
  if (parsedDate) {
    extracted.incident_date = parsedDate;
  }

  // 3. Indian Phone extraction
  const phoneMatch = text.match(/(?:\+?91[\s-]?)?([6-9]\d{9})\b/);
  if (phoneMatch) {
    extracted.victim_phone = phoneMatch[1];
  }

  // 4. UPI ID extraction
  const upiMatch = text.match(/([a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32})/);
  if (upiMatch) {
    if (currentCrimeType === CRIME_TYPES.UPI_FRAUD) {
      extracted.scammer_info = upiMatch[1];
    }
  }

  // 5. UTR / Transaction ID extraction
  const utrMatch = text.match(/(?:utr|txn|ref|transaction\s*id)[\s:#-]*([a-zA-Z0-9]{8,22})/i);
  if (utrMatch) {
    extracted.transaction_id = utrMatch[1];
  }

  // 6. Bank / App extraction
  const bankMatch = text.match(/\b(sbi|hdfc|icici|axis|pnb|bob|kotak|gpay|google\s*pay|phonepe|paytm|cred)\b/i);
  if (bankMatch) {
    extracted.bank_app = bankMatch[1].toUpperCase();
  }

  // 7. URL extraction
  const urlMatch = text.match(/https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(?:top|xyz|link|online|cc|in|com)\/[^\s]*/i);
  if (urlMatch) {
    extracted.phishing_link = urlMatch[0];
  }

  // Description is stored from substantive user text
  if (text.trim().length >= 15 && !extracted.description) {
    extracted.description = text.trim();
  }

  return extracted;
}

/**
 * Fallback engine handler
 */
export function processScriptedFallback({
  message,
  currentCrimeType,
  collectedData,
  currentPromptField,
  language = 'en',
}) {
  const ui = getUITranslation(language);
  let crimeType = currentCrimeType || inferCrimeTypeFromText(message);
  const updatedData = { ...collectedData };
  const lowerMsg = message.trim().toLowerCase();

  // 1. Check if user is asking a common question
  if (lowerMsg.includes('1930') || lowerMsg.includes('what is 1930') || lowerMsg.includes('help line')) {
    return {
      reply: 'Helpline 1930 is the National Cybercrime Financial Fraud Helpline operated by the Ministry of Home Affairs (I4C). Calling within the first 2 hours allows banks to freeze illicit transactions.',
      crimeType,
      updatedData,
      currentPromptField,
      fallbackUsed: true,
      pendingQuestion: true,
    };
  }

  if (lowerMsg.includes('safe') || lowerMsg.includes('privacy') || lowerMsg.includes('police')) {
    return {
      reply: 'Your data is encrypted and used only to synthesize your formal complaint document. We do not store unredacted bank records.',
      crimeType,
      updatedData,
      currentPromptField,
      fallbackUsed: true,
      pendingQuestion: true,
    };
  }

  // 2. If crimeType is not known, ask user to choose or describe
  if (!crimeType) {
    return {
      reply: 'I understand you are facing a cyber incident. Could you please specify which type of issue this is? (e.g. UPI/Payment Fraud, Phishing link, Hacked account, or Fake job offer)',
      crimeType: null,
      updatedData,
      currentPromptField: null,
      fallbackUsed: true,
      options: [
        { label: 'UPI / Online Payment Fraud', value: CRIME_TYPES.UPI_FRAUD },
        { label: 'Phishing / Fake Link', value: CRIME_TYPES.PHISHING },
        { label: 'Fake Job / Investment Scam', value: CRIME_TYPES.FAKE_JOB_INVESTMENT },
        { label: 'Hacked Account', value: CRIME_TYPES.HACKED_ACCOUNT },
        { label: 'Sextortion / Harassment', value: CRIME_TYPES.SEXTORTION_HARASSMENT },
        { label: 'Other Cyber Incident', value: CRIME_TYPES.OTHER },
      ],
    };
  }

  // 3. If there is a currentPromptField, validate the user's message against it first
  if (currentPromptField) {
    // Check for explicit skip on optional field
    const schema = getCrimeSchema(crimeType);
    const fieldDef = schema.fieldDefinitions[currentPromptField];

    if (fieldDef && !fieldDef.required && (lowerMsg === 'skip' || lowerMsg === 'none' || lowerMsg === 'na')) {
      updatedData[currentPromptField] = '';
    } else {
      const validation = validateSingleField(currentPromptField, message, crimeType);
      if (validation.success) {
        updatedData[currentPromptField] = validation.data;
      } else {
        // Specific error returned, re-asking ONLY this field
        return {
          reply: `${validation.error}\n\n${fieldDef?.promptQuestion || 'Please re-enter this detail.'}`,
          crimeType,
          updatedData,
          currentPromptField,
          fallbackUsed: true,
        };
      }
    }
  }

  // 4. Also extract all other fields in the message
  const opportunisticExtractions = extractFieldsFromText(message, crimeType);
  for (const [key, val] of Object.entries(opportunisticExtractions)) {
    if (updatedData[key] === undefined || updatedData[key] === null || updatedData[key] === '') {
      const v = validateSingleField(key, val, crimeType);
      if (v.success) {
        updatedData[key] = v.data;
      }
    }
  }

  // 5. Compute missing required fields and ask ONLY for the first pending one
  const missing = getMissingRequiredFields(crimeType, updatedData);

  if (missing.length === 0) {
    return {
      reply: ui.readyToReview,
      crimeType,
      updatedData,
      currentPromptField: null,
      isCompleted: true,
      fallbackUsed: true,
    };
  }

  const nextFieldKey = missing[0];
  const schema = getCrimeSchema(crimeType);
  const nextFieldDef = schema.fieldDefinitions[nextFieldKey];

  let replyText = nextFieldDef?.promptQuestion || `Please provide: ${nextFieldDef?.label}`;

  // If this crime is sensitive (e.g. sextortion), prepend empathetic safety message on first turn
  if (schema.sensitive && Object.keys(updatedData).length <= 2) {
    replyText = `${ui.sensitiveAssurance}\n\n${replyText}`;
  }

  return {
    reply: replyText,
    crimeType,
    updatedData,
    currentPromptField: nextFieldKey,
    isCompleted: false,
    fallbackUsed: true,
  };
}
