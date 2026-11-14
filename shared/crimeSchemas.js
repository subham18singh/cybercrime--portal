/**
 * CYBERSHIELD AI - Shared Crime Schemas
 * Defines per crime type: required & optional fields, field types, labels,
 * urgent warning banners, and sensitive flags.
 */

export const CRIME_TYPES = {
  UPI_FRAUD: 'upi_fraud',
  PHISHING: 'phishing',
  HACKED_ACCOUNT: 'hacked_account',
  SEXTORTION_HARASSMENT: 'sextortion_harassment',
  FAKE_JOB_INVESTMENT: 'fake_job_investment',
  SHOPPING_FRAUD: 'shopping_fraud',
  IDENTITY_THEFT: 'identity_theft',
  OTHER: 'other',
};

export const COMMON_FIELDS = {
  victim_name: {
    key: 'victim_name',
    label: 'Your Full Name',
    type: 'string',
    required: true,
    placeholder: 'e.g. Ramesh Kumar',
    promptQuestion: 'What is your full legal name as per your ID or bank records?',
  },
  victim_phone: {
    key: 'victim_phone',
    label: 'Your Phone Number',
    type: 'phone',
    required: true,
    placeholder: 'e.g. 9876543210',
    promptQuestion: 'What is your 10-digit mobile number for police follow-up?',
  },
  victim_email: {
    key: 'victim_email',
    label: 'Your Email Address (Optional)',
    type: 'email',
    required: false,
    placeholder: 'e.g. ramesh@example.com',
    promptQuestion: 'What is your email address for receiving acknowledgement receipts? (Optional, reply "skip" to pass)',
  },
  incident_date: {
    key: 'incident_date',
    label: 'Incident Date',
    type: 'date',
    required: true,
    placeholder: 'e.g. Yesterday, 12 March, or DD/MM/YYYY',
    promptQuestion: 'On what date did this incident occur? (e.g., today, yesterday, or exact date)',
  },
  description: {
    key: 'description',
    label: 'Incident Narrative / Description',
    type: 'description',
    required: true,
    placeholder: 'Describe in your own words what happened...',
    promptQuestion: 'Please describe the incident in detail: how you were contacted, what they claimed, and what occurred.',
  },
};

export const CRIME_SCHEMAS = {
  [CRIME_TYPES.UPI_FRAUD]: {
    id: CRIME_TYPES.UPI_FRAUD,
    displayName: 'UPI / Online Payment Fraud',
    sensitive: false,
    urgentBanner: 'Call 1930 now. The first hour matters. Your bank can freeze fraudulent transactions immediately.',
    officialPortalUrl: 'https://cybercrime.gov.in',
    requiredFields: [
      'victim_name',
      'victim_phone',
      'incident_date',
      'amount',
      'transaction_id',
      'bank_app',
      'description',
    ],
    optionalFields: [
      'victim_email',
      'scammer_info',
    ],
    fieldDefinitions: {
      ...COMMON_FIELDS,
      amount: {
        key: 'amount',
        label: 'Amount Lost (₹)',
        type: 'amount',
        required: true,
        placeholder: 'e.g. 5000 or 1.5 lakh',
        promptQuestion: 'What was the exact or approximate amount lost in rupees (₹)?',
      },
      transaction_id: {
        key: 'transaction_id',
        label: 'Transaction ID / UTR Number',
        type: 'string',
        required: true,
        placeholder: 'e.g. UTR 412345678901',
        promptQuestion: 'What is the Transaction ID or UTR number from your bank SMS or payment app receipt?',
      },
      bank_app: {
        key: 'bank_app',
        label: 'Bank / Payment App Used',
        type: 'string',
        required: true,
        placeholder: 'e.g. SBI / GPay / PhonePe / Paytm',
        promptQuestion: 'Which bank or payment app did you use? (e.g. HDFC, Google Pay, PhonePe, Paytm)',
      },
      scammer_info: {
        key: 'scammer_info',
        label: 'Scammer UPI / Phone / Details',
        type: 'string',
        required: false,
        placeholder: 'e.g. fakehelp@upi or 98765xxxxx',
        promptQuestion: 'Do you have the fraudster’s UPI ID, phone number, or payment link? (Optional, reply "skip" to pass)',
      },
    },
  },

  [CRIME_TYPES.PHISHING]: {
    id: CRIME_TYPES.PHISHING,
    displayName: 'Phishing / Fake Link / Smishing',
    sensitive: false,
    urgentBanner: 'If you entered banking passwords, OTPs or PINs, block your net-banking and cards immediately.',
    officialPortalUrl: 'https://cybercrime.gov.in',
    requiredFields: [
      'victim_name',
      'victim_phone',
      'incident_date',
      'phishing_link',
      'channel',
      'data_shared',
      'description',
    ],
    optionalFields: [
      'victim_email',
      'amount',
    ],
    fieldDefinitions: {
      ...COMMON_FIELDS,
      phishing_link: {
        key: 'phishing_link',
        label: 'Suspicious / Phishing Link or Domain',
        type: 'url',
        required: true,
        placeholder: 'e.g. http://sbi-kyc-update.top',
        promptQuestion: 'What was the suspicious website link or URL you received or clicked?',
      },
      channel: {
        key: 'channel',
        label: 'Communication Channel',
        type: 'string',
        required: true,
        placeholder: 'e.g. SMS, WhatsApp, Email, Phone Call',
        promptQuestion: 'How did you receive the deceptive message? (e.g., SMS, WhatsApp, Email, or phone call)',
      },
      data_shared: {
        key: 'data_shared',
        label: 'Credentials / Data Shared',
        type: 'string',
        required: true,
        placeholder: 'e.g. Net banking OTP, Password, PAN, Aadhaar',
        promptQuestion: 'What details did you submit or disclose? (e.g. OTP, net banking password, card number, or PAN/Aadhaar)',
      },
      amount: {
        key: 'amount',
        label: 'Financial Loss (₹) If Any',
        type: 'amount',
        required: false,
        placeholder: 'e.g. 0 or 25000',
        promptQuestion: 'Was any money debited from your account? If so, how much? (Reply "0" or "none" if no money was lost)',
      },
    },
  },

  [CRIME_TYPES.HACKED_ACCOUNT]: {
    id: CRIME_TYPES.HACKED_ACCOUNT,
    displayName: 'Hacked Account / Unauthorized Takeover',
    sensitive: false,
    urgentBanner: 'Notify close contacts immediately not to send money if they receive requests from your account.',
    officialPortalUrl: 'https://cybercrime.gov.in',
    requiredFields: [
      'victim_name',
      'victim_phone',
      'incident_date',
      'platform',
      'account_identifier',
      'compromised_at',
      'description',
    ],
    optionalFields: [
      'victim_email',
      'scammer_activity',
    ],
    fieldDefinitions: {
      ...COMMON_FIELDS,
      platform: {
        key: 'platform',
        label: 'Compromised Platform / Service',
        type: 'string',
        required: true,
        placeholder: 'e.g. Instagram, WhatsApp, Gmail, Facebook',
        promptQuestion: 'Which platform or social account was compromised? (e.g. WhatsApp, Instagram, Gmail, Facebook)',
      },
      account_identifier: {
        key: 'account_identifier',
        label: 'Account Username / Registered ID',
        type: 'string',
        required: true,
        placeholder: 'e.g. @username or user@gmail.com',
        promptQuestion: 'What is your username, profile handle, or registered email for the hacked account?',
      },
      compromised_at: {
        key: 'compromised_at',
        label: 'Approximate Time Access Was Lost',
        type: 'string',
        required: true,
        placeholder: 'e.g. Yesterday 4:00 PM',
        promptQuestion: 'When did you first notice that you were logged out or lost access?',
      },
      scammer_activity: {
        key: 'scammer_activity',
        label: 'Hacker Activity / Demands',
        type: 'string',
        required: false,
        placeholder: 'e.g. Demanded money from contacts, changed recovery number',
        promptQuestion: 'Has the hacker posted anything or demanded money from your friends/contacts? (Optional, reply "skip")',
      },
    },
  },

  [CRIME_TYPES.SEXTORTION_HARASSMENT]: {
    id: CRIME_TYPES.SEXTORTION_HARASSMENT,
    displayName: 'Sextortion / Cyber Harassment & Blackmail',
    sensitive: true, // SENSITIVE FLAG
    urgentBanner: 'You are not at fault. Do not pay any money or delete conversation history. National Cyber Helpline: 1930 | Women Helpline: 1091.',
    officialPortalUrl: 'https://cybercrime.gov.in',
    requiredFields: [
      'victim_name',
      'victim_phone',
      'incident_date',
      'platform',
      'description',
    ],
    optionalFields: [
      'victim_email',
      'scammer_handle',
      'demands',
      'media_involved',
    ],
    fieldDefinitions: {
      ...COMMON_FIELDS,
      platform: {
        key: 'platform',
        label: 'Platform of Contact',
        type: 'string',
        required: true,
        placeholder: 'e.g. WhatsApp, Instagram, Video Call',
        promptQuestion: 'Where did the blackmailer contact you? (e.g. WhatsApp video call, Instagram DM)',
      },
      scammer_handle: {
        key: 'scammer_handle',
        label: 'Blackmailer Phone / Handle (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g. +91 98xxxxxxxx or @fake_id',
        promptQuestion: 'What is the perpetrator’s phone number or username? (Optional, reply "skip" to pass)',
      },
      demands: {
        key: 'demands',
        label: 'Demands or Extortion Amount (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g. Demanded ₹50,000 to delete video',
        promptQuestion: 'What is the perpetrator demanding? (Optional, reply "skip" to pass)',
      },
      media_involved: {
        key: 'media_involved',
        label: 'Type of Media Involved (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g. Screen recording, morphed photos',
        promptQuestion: 'What type of media or threat is involved? (Optional, reply "skip" to pass)',
      },
    },
  },

  [CRIME_TYPES.FAKE_JOB_INVESTMENT]: {
    id: CRIME_TYPES.FAKE_JOB_INVESTMENT,
    displayName: 'Fake Job / Loan / Investment / Task Scam',
    sensitive: false,
    urgentBanner: 'Stop transferring further money to "unfreeze profits". Legitimate companies never charge withdrawal fees.',
    officialPortalUrl: 'https://cybercrime.gov.in',
    requiredFields: [
      'victim_name',
      'victim_phone',
      'incident_date',
      'scam_medium',
      'promised_returns',
      'amount',
      'description',
    ],
    optionalFields: [
      'victim_email',
      'scammer_account_upi',
    ],
    fieldDefinitions: {
      ...COMMON_FIELDS,
      scam_medium: {
        key: 'scam_medium',
        label: 'Medium of Contact / Platform',
        type: 'string',
        required: true,
        placeholder: 'e.g. Telegram group, WhatsApp job offer, Part-time YouTube task',
        promptQuestion: 'Where were you offered this job or investment? (e.g. Telegram group, WhatsApp message, Instagram ad)',
      },
      promised_returns: {
        key: 'promised_returns',
        label: 'Promised Role / Return',
        type: 'string',
        required: true,
        placeholder: 'e.g. ₹3000/day for liking videos, 30% daily crypto profit',
        promptQuestion: 'What job role or profit return was promised to you?',
      },
      amount: {
        key: 'amount',
        label: 'Total Money Invested / Lost (₹)',
        type: 'amount',
        required: true,
        placeholder: 'e.g. 75000 or 2 lakh',
        promptQuestion: 'What was the total amount you transferred in rupees (₹)?',
      },
      scammer_account_upi: {
        key: 'scammer_account_upi',
        label: 'Scammer Beneficiary Details (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g. UPI IDs, bank accounts, or crypto wallet addresses',
        promptQuestion: 'Do you have the scammer’s bank account numbers or UPI handles you sent money to? (Optional, reply "skip")',
      },
    },
  },

  [CRIME_TYPES.SHOPPING_FRAUD]: {
    id: CRIME_TYPES.SHOPPING_FRAUD,
    displayName: 'Online Shopping / Fake Delivery Fraud',
    sensitive: false,
    urgentBanner: 'Contact your bank or card network to raise an immediate chargeback dispute for unauthorized purchases.',
    officialPortalUrl: 'https://cybercrime.gov.in',
    requiredFields: [
      'victim_name',
      'victim_phone',
      'incident_date',
      'website_or_seller',
      'product_name',
      'amount',
      'payment_method',
      'description',
    ],
    optionalFields: [
      'victim_email',
      'scammer_contact',
    ],
    fieldDefinitions: {
      ...COMMON_FIELDS,
      website_or_seller: {
        key: 'website_or_seller',
        label: 'Website URL / Social Shop / Seller Name',
        type: 'string',
        required: true,
        placeholder: 'e.g. fake-shoes-shop.in or @trendy_deals_ig',
        promptQuestion: 'What was the website link or seller profile where you placed the order?',
      },
      product_name: {
        key: 'product_name',
        label: 'Product / Item Ordered',
        type: 'string',
        required: true,
        placeholder: 'e.g. Mobile phone, jacket, electronic gadget',
        promptQuestion: 'What item or product did you order that was never delivered or turned out fake?',
      },
      amount: {
        key: 'amount',
        label: 'Amount Paid (₹)',
        type: 'amount',
        required: true,
        placeholder: 'e.g. 4500',
        promptQuestion: 'How much money did you pay for this purchase in rupees (₹)?',
      },
      payment_method: {
        key: 'payment_method',
        label: 'Payment Method Used',
        type: 'string',
        required: true,
        placeholder: 'e.g. UPI, Debit Card, Credit Card, Net Banking',
        promptQuestion: 'How did you pay? (e.g., UPI, Debit Card, Credit Card, or Net Banking)',
      },
      scammer_contact: {
        key: 'scammer_contact',
        label: 'Seller Phone / Email / UPI (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g. 9876543210 or seller@upi',
        promptQuestion: 'Do you have any phone number or email of the fake seller? (Optional, reply "skip")',
      },
    },
  },

  [CRIME_TYPES.IDENTITY_THEFT]: {
    id: CRIME_TYPES.IDENTITY_THEFT,
    displayName: 'Identity Theft / Impersonation / Forgery',
    sensitive: false,
    urgentBanner: 'Check your CIBIL score for unauthorized loans and notify your bank to place a fraud alert on your identity.',
    officialPortalUrl: 'https://cybercrime.gov.in',
    requiredFields: [
      'victim_name',
      'victim_phone',
      'incident_date',
      'impersonation_type',
      'description',
    ],
    optionalFields: [
      'victim_email',
      'fake_profile_url',
      'target_audience',
    ],
    fieldDefinitions: {
      ...COMMON_FIELDS,
      impersonation_type: {
        key: 'impersonation_type',
        label: 'Type of Identity Theft',
        type: 'string',
        required: true,
        placeholder: 'e.g. Fake profile created in my name, loan taken on my PAN, SIM swap',
        promptQuestion: 'How is your identity being misused? (e.g. fake profile on Facebook/Instagram, loan app using your PAN/Aadhaar, or SIM swap)',
      },
      fake_profile_url: {
        key: 'fake_profile_url',
        label: 'Impersonating Profile Link / Phone (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g. https://instagram.com/fake_ramesh',
        promptQuestion: 'Do you have the link or handle of the fake account or impersonator? (Optional, reply "skip")',
      },
      target_audience: {
        key: 'target_audience',
        label: 'People Contacted by Impersonator (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g. Contacted family members asking for urgent money',
        promptQuestion: 'Has the impersonator approached your friends, family, or colleagues? (Optional, reply "skip")',
      },
    },
  },

  [CRIME_TYPES.OTHER]: {
    id: CRIME_TYPES.OTHER,
    displayName: 'Other Cyber Incident',
    sensitive: false,
    urgentBanner: 'Keep all screenshots, call logs, and transaction receipts saved for formal police reporting.',
    officialPortalUrl: 'https://cybercrime.gov.in',
    requiredFields: [
      'victim_name',
      'victim_phone',
      'incident_date',
      'description',
    ],
    optionalFields: [
      'victim_email',
      'suspect_details',
      'loss_details',
    ],
    fieldDefinitions: {
      ...COMMON_FIELDS,
      suspect_details: {
        key: 'suspect_details',
        label: 'Suspect Contact / Identification (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g. Phone number, email, website link',
        promptQuestion: 'Do you have any phone number, email, or website of the suspected perpetrator? (Optional, reply "skip")',
      },
      loss_details: {
        key: 'loss_details',
        label: 'Loss or Impact Incurred (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g. Financial loss, data leak, reputation damage',
        promptQuestion: 'What loss or harm was caused? (Optional, reply "skip")',
      },
    },
  },
};

/**
 * Returns schema definition for a given crime type, defaulting to 'other'
 */
export function getCrimeSchema(crimeType) {
  if (!crimeType || !CRIME_SCHEMAS[crimeType]) {
    return CRIME_SCHEMAS[CRIME_TYPES.OTHER];
  }
  return CRIME_SCHEMAS[crimeType];
}

/**
 * Given a crime type and current filled data, returns an array of missing required field keys.
 */
export function getMissingRequiredFields(crimeType, collectedData = {}) {
  const schema = getCrimeSchema(crimeType);
  return schema.requiredFields.filter((key) => {
    const val = collectedData[key];
    if (val === undefined || val === null) return true;
    if (typeof val === 'string' && val.trim().length === 0) return true;
    if (typeof val === 'number' && isNaN(val)) return true;
    return false;
  });
}

/**
 * Calculates completeness percentage (0 - 100)
 */
export function calculateCompleteness(crimeType, collectedData = {}) {
  const schema = getCrimeSchema(crimeType);
  const totalRequired = schema.requiredFields.length;
  if (totalRequired === 0) return 100;
  const missing = getMissingRequiredFields(crimeType, collectedData);
  const filledCount = totalRequired - missing.length;
  return Math.round((filledCount / totalRequired) * 100);
}
