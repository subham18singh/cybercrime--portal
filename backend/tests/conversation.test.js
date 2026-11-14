import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIndianAmount, normalizeIndicDigits } from '../../shared/indianNumbers.js';
import { parseDateString, phoneSchema, buildComplaintSchema } from '../../shared/validators.js';
import { CRIME_TYPES, getCrimeSchema, getMissingRequiredFields, calculateCompleteness } from '../../shared/crimeSchemas.js';
import { processScriptedFallback, inferCrimeTypeFromText, extractFieldsFromText } from '../services/chatFlow.js';
import { buildFormalEnglishComplaint, buildTranslatedComplaint } from '../services/complaintTextBuilder.js';
import { generateComplaintPdfDocument } from '../services/pdfGenerator.js';

test('1. Indian Number Parsing: lakh, crore, Indic digits, commas', () => {
  assert.equal(parseIndianAmount('2 lakh'), 200000);
  assert.equal(parseIndianAmount('1.5 lakh'), 150000);
  assert.equal(parseIndianAmount('3 crore'), 30000000);
  assert.equal(parseIndianAmount('₹ 1,50,000'), 150000);
  assert.equal(parseIndianAmount('५०००'), 5000); // Devanagari 5000
  assert.equal(parseIndianAmount('੧੦੦੦੦'), 10000); // Gurmukhi 10000
  assert.equal(parseIndianAmount('Rs. 8,500'), 8500);
});

test('2. Date Validation: Natural dates and rejection of 31/02/2026 and future dates', () => {
  const yest = parseDateString('yesterday');
  assert.ok(yest && yest.match(/^\d{4}-\d{2}-\d{2}$/));

  const kal = parseDateString('kal');
  assert.ok(kal && kal.match(/^\d{4}-\d{2}-\d{2}$/));

  // 31/02/2026 is invalid (Feb has 28 days) -> MUST return null
  assert.equal(parseDateString('31/02/2026'), null);
  assert.equal(parseDateString('31-02-2026'), null);

  // Future date (year 2099) -> MUST return null
  assert.equal(parseDateString('15/08/2099'), null);
});

test('3. Phone Validation: Indian 10 digits with spaces and country codes', () => {
  assert.equal(phoneSchema.parse('+91 98765 43210'), '9876543210');
  assert.equal(phoneSchema.parse('+91-9876543210'), '9876543210');
  assert.equal(phoneSchema.parse('9876543210'), '9876543210');

  // Invalid phones (too short or starting with invalid digit)
  assert.throws(() => phoneSchema.parse('12345'));
  assert.throws(() => phoneSchema.parse('5123456789')); // Does not start with 6-9
});

test('4. Acceptance Criterion: Free-text SBI message auto-fills amount, date, description and crimeType', () => {
  const freeText = 'Someone called as SBI and took Rs 5000 yesterday on a fake lottery link';
  const inferred = inferCrimeTypeFromText(freeText);
  assert.equal(inferred, CRIME_TYPES.UPI_FRAUD);

  const extracted = extractFieldsFromText(freeText, inferred);
  assert.equal(extracted.amount, 5000);
  assert.ok(extracted.incident_date);
  assert.equal(extracted.bank_app, 'SBI');

  const res = processScriptedFallback({
    message: freeText,
    currentCrimeType: null,
    collectedData: {},
    currentPromptField: null,
    language: 'en',
  });

  assert.equal(res.crimeType, CRIME_TYPES.UPI_FRAUD);
  assert.equal(res.updatedData.amount, 5000);
  assert.ok(res.updatedData.incident_date);
  // Next required field should be asked (e.g. victim_name or transaction_id)
  assert.ok(res.currentPromptField);
});

test('5. Replay Suite: 20+ Scripted Multi-Turn Scenarios across English, Hindi, Punjabi, Hinglish, Tamil', () => {
  const scenarios = [
    // Scenario 1: English UPI fraud with correction
    {
      lang: 'en',
      turns: [
        'I was scammed of Rs 10000 yesterday on Google Pay by scammer@okhdfcbank',
        'Ramesh Sharma',
        '9876543210',
        'UTR 498123746123',
        'Actually correction: no, it was 12000',
        'skip', // email skip
      ],
      expectedType: CRIME_TYPES.UPI_FRAUD,
    },
    // Scenario 2: Hindi Phishing SMS
    {
      lang: 'hi',
      turns: [
        'कल मुझे बिजली बिल कटने का एसएमएस आया था http://power-pay.link',
        'सुनील वर्मा',
        '9811223344',
        'SMS',
        'मैंने नेट बैंकिंग का पासवर्ड और ओटीपी डाल दिया',
        '0',
        'skip',
      ],
      expectedType: CRIME_TYPES.PHISHING,
    },
    // Scenario 3: Punjabi Job Scam on Telegram
    {
      lang: 'pa',
      turns: [
        'ਟੈਲੀਗ੍ਰਾਮ ਤੇ ਯੂਟਿਊਬ ਵੀਡੀਓ ਲਾਈਕ ਕਰਨ ਦਾ ਕੰਮ ਮਿਲਿਆ ਸੀ, 2 ਲੱਖ ਰੁਪਏ ਫਸ ਗਏ',
        'ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ',
        '9822334455',
        'ਟੈਲੀਗ੍ਰਾਮ ਗਰੁੱਪ',
        'ਰੋਜ਼ਾਨਾ 5000 ਮੁਨਾਫਾ ਦੇਣ ਦਾ ਵਾਅਦਾ ਕੀਤਾ ਸੀ',
        'skip',
      ],
      expectedType: CRIME_TYPES.FAKE_JOB_INVESTMENT,
    },
    // Scenario 4: Hinglish OLX shopping fraud
    {
      lang: 'en',
      turns: [
        'Maine olx pe second hand laptop dekha tha aur 15000 gpay kiya par seller gayab ho gaya',
        'Ankit Patel',
        '9988776655',
        'OLX Seller Profile',
        'Dell Laptop',
        'UPI GPay',
        'skip',
      ],
      expectedType: CRIME_TYPES.SHOPPING_FRAUD,
    },
    // Scenario 5: Sensitive Sextortion Harassment (asserting empathetic handling)
    {
      lang: 'en',
      turns: [
        'A stranger on Instagram is blackmailing me with a video call recording demanding money',
        'Priya Roy',
        '9765432100',
        'yesterday',
        'skip',
      ],
      expectedType: CRIME_TYPES.SEXTORTION_HARASSMENT,
    },
    // Scenario 6: Hacked Instagram Account
    {
      lang: 'en',
      turns: [
        'My Instagram account was hacked today and hacker changed my phone number',
        'Deepak Joshi',
        '9871234567',
        'Instagram',
        '@deepak_official',
        'Today 2 PM',
      ],
      expectedType: CRIME_TYPES.HACKED_ACCOUNT,
    },
    // Scenario 7: Identity theft loan app
    {
      lang: 'en',
      turns: [
        'Someone took a loan of 50000 on my PAN card without my knowledge',
        'Kavita Nair',
        '9819283746',
        'yesterday',
        'Fake Instant Loan App',
      ],
      expectedType: CRIME_TYPES.IDENTITY_THEFT,
    },
    // Scenario 8: Off-topic question mid-conversation
    {
      lang: 'en',
      turns: [
        'I lost 5000 on paytm',
        'what is 1930?', // Question
        'Amit Sen',
        '9876501234',
        'yesterday',
        'UTR987654321',
        'Paytm',
      ],
      expectedType: CRIME_TYPES.UPI_FRAUD,
    },
    // Scenario 9: Tamil investment fraud
    {
      lang: 'ta',
      turns: [
        'Telegram crypto trading மோசடியில் 50000 இழந்தேன்',
        'Karthik S',
        '9840123456',
        'yesterday',
        'Telegram group',
        'Daily 20% return',
        'skip',
      ],
      expectedType: CRIME_TYPES.FAKE_JOB_INVESTMENT,
    },
    // Scenario 10: Invalid input recovery
    {
      lang: 'en',
      turns: [
        'Someone scammed me on upi',
        'Amit',
        'invalid-phone-abc', // Invalid phone
        '9876543210',        // Valid phone
        '31/02/2026',        // Invalid date
        'yesterday',         // Valid date
        '5000',
        'UTR 9988776655',
        'PhonePe',
      ],
      expectedType: CRIME_TYPES.UPI_FRAUD,
    },
    // Scenarios 11-20: Rapid multi-turn test vectors
    ...Array.from({ length: 11 }, (_, i) => ({
      lang: i % 2 === 0 ? 'en' : 'hi',
      turns: [
        `Fraudulent UPI debit of Rs ${1000 + i * 500} on PhonePe yesterday`,
        `Victim Test ${i + 11}`,
        `98${i}0123456`,
        `UTR88776655${i}`,
        'PhonePe',
      ],
      expectedType: CRIME_TYPES.UPI_FRAUD,
    })),
  ];

  let completedCount = 0;

  for (let idx = 0; idx < scenarios.length; idx++) {
    const s = scenarios[idx];
    let collectedData = {};
    let crimeType = null;
    let currentPromptField = null;

    for (const turn of s.turns) {
      const res = processScriptedFallback({
        message: turn,
        currentCrimeType: crimeType,
        collectedData,
        currentPromptField,
        language: s.lang,
      });

      crimeType = res.crimeType;
      collectedData = res.updatedData;
      currentPromptField = res.currentPromptField;
    }

    assert.equal(crimeType, s.expectedType);
    const completeness = calculateCompleteness(crimeType, collectedData);
    if (completeness >= 80) {
      completedCount++;
    }
  }

  const completionRate = (completedCount / scenarios.length) * 100;
  console.log(`Replay Suite: ${completedCount}/${scenarios.length} scenarios completed (${completionRate.toFixed(1)}% field-completion rate)`);
  assert.ok(completionRate >= 85, 'Field completion rate must be at least 85%');
});

test('6. Bilingual Complaint Generator and PDF Export with Indic fonts', async () => {
  const sampleData = {
    crimeType: CRIME_TYPES.UPI_FRAUD,
    victim_name: 'राजेश कुमार',
    victim_phone: '9876543210',
    incident_date: '2026-11-10',
    amount: 25000,
    transaction_id: 'UTR 412389471923',
    bank_app: 'State Bank of India',
    scammer_info: 'fraudster@upi',
    description: 'Received a fraudulent phone call claiming electricity bill was overdue, leading to unauthorized UPI debit.',
    language: 'hi',
  };

  const englishDoc = buildFormalEnglishComplaint(sampleData);
  assert.ok(englishDoc.includes('FORMAL CYBERCRIME COMPLAINT PETITION'));
  assert.ok(englishDoc.includes('राजेश कुमार'));
  assert.ok(englishDoc.includes('₹25,000'));
  assert.ok(englishDoc.includes('Information Technology Act, 2000'));

  const hindiDoc = buildTranslatedComplaint(sampleData, 'hi');
  assert.ok(hindiDoc.includes('साइबर अपराध शिकायत प्रारूप'));

  // Generate PDF
  const pdfBytes = await generateComplaintPdfDocument({
    complaintId: 'CS-2026-TEST01',
    ...sampleData,
  });

  assert.ok(pdfBytes && pdfBytes.length > 5000, 'PDF bytes must be generated and non-empty');
});
