import { getCrimeSchema } from './crimeSchemas.js';
import { formatIndianCurrency } from './indianNumbers.js';

/**
 * Builds an authentic, realistic Cybercrime Complaint & FIR Assistance Petition
 * conforming to Ministry of Home Affairs (MHA) National Cyber Crime Reporting Portal (cybercrime.gov.in)
 * and Police Cyber Crime Stations under Information Technology Act, 2000 & IPC / Bharatiya Nyaya Sanhita (BNS).
 */
export function buildFormalEnglishComplaint(data) {
  const schema = getCrimeSchema(data.crimeType);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const collected = data.collectedData || data;
  const complaintId = data.complaintId || `CS-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const name = collected.victim_name || data.complainant?.name || '[Your Full Name]';
  const guardianName = collected.guardian_name || "[Father's/Spouse's Name]";
  const address = collected.victim_address || '[Your Complete Residential Address]';
  const phone = collected.victim_phone || data.complainant?.phone || '[Your Mobile Number]';
  const email = collected.victim_email || data.complainant?.email || '[Your Email ID]';
  const idProof = collected.id_proof || '[Aadhaar No. / PAN No. / Voter ID]';

  const incidentDate = collected.incident_date || data.incident?.date || dateFormatted;
  const incidentTime = collected.incident_time || '[HH:MM AM/PM]';
  const platform = collected.platform || collected.channel || collected.scam_medium || '[e.g., WhatsApp, Telegram, Fake Website, SMS, Call, Instagram]';
  const suspectDetails = collected.scammer_info || collected.scammer_contact || collected.scammer_account_upi || '[Name, Phone number, UPI ID, Profile link, or Bank account used by the fraudster]';

  const rawAmt = collected.amount !== undefined ? collected.amount : data.financialLoss?.amount;
  const amount = rawAmt !== undefined && rawAmt !== null && !isNaN(Number(rawAmt)) ? Number(rawAmt) : 0;
  const amountFormatted = amount > 0 ? `₹${formatIndianCurrency(amount)} (${amount} Rupees)` : '₹ [Amount in Rupees]';

  const txnId = collected.transaction_id || data.financialLoss?.transactionId || '[12-digit / 16-digit UTR or Transaction ID]';
  const myBank = collected.bank_app || collected.payment_method || data.financialLoss?.bankApp || '[Name of your bank & Account No.]';
  const beneficiaryDetails = collected.scammer_account_upi || collected.scammer_info || '[Fraudulent account number/IFSC/UPI ID]';

  const policeStation = collected.police_station || '[Name of Local Police Station]';
  const location = collected.city_district_state || '[City, District, State]';
  const city = collected.city || '[City]';

  let description = collected.description || data.incident?.description;
  if (!description) {
    description = `On ${incidentDate}, I received a [call / message / link] from [mention details of what happened step-by-step]. The accused posed as [who they claimed to be, e.g., bank official, customer care, trading advisor] and manipulated me into [transferring money / sharing credentials / clicking a malicious link].`;
  }

  const bankRefNo = collected.bank_ref_no || '[Number]';
  const helplineAckNo = collected.helpline_ack_no || `1930 / ${complaintId}`;
  const portalAckNo = collected.portal_ack_no || complaintId;

  return `================================================================================
FORMAL CYBERCRIME COMPLAINT PETITION & POLICE ASSISTANCE DOSSIER
National Cyber Crime Reporting Portal (cybercrime.gov.in) & Jurisdictional Police Station
Prepared in compliance with Information Technology Act, 2000 & Bharatiya Nyaya Sanhita (BNS)
================================================================================

To,  
The Station House Officer (SHO) / Officer-in-Charge,  
Cyber Crime Cell / Police Station: ${policeStation}  
${location}  

Subject: Complaint regarding online cybercrime / financial fraud / identity theft.  

Respected Sir/Madam,  

I, ${name}, son/daughter/wife of ${guardianName}, residing at ${address}, would like to formally report a cybercrime incident wherein I have been targeted.  

1. Complainant & Victim Details:  
   - Name: ${name}  
   - Contact Number: ${phone}  
   - Email Address: ${email}  
   - Identification Proof: ${idProof}  

2. Incident Details:  
   - Date of Incident: ${incidentDate}  
   - Time of Incident: ${incidentTime}  
   - Platform/Medium Used: ${platform}  
   - Suspect/Accused Details (if known): ${suspectDetails}  

3. Chronological Description of the Event:  
   ${description}  

4. Financial / Loss Details (if applicable):  
   - Amount Defrauded: ${amountFormatted}  
   - Transaction Date(s): ${incidentDate}  
   - Transaction ID / UTR Number: ${txnId}  
   - My Bank Name & Account No.: ${myBank}  
   - Beneficiary / Fraudster Bank Details (if known): ${beneficiaryDetails}  

5. Immediate Action Already Taken:  
   - Informed Bank / Blocked Card/Account on: ${incidentDate} (Bank Complaint / Reference No: ${bankRefNo})  
   - Called 1930 Cyber Helpline on: ${incidentDate} (Acknowledgement No: ${helplineAckNo})  
   - Logged complaint on cybercrime.gov.in (Acknowledgment No: ${portalAckNo})  

Prayer / Request:  
I kindly request you to register an FIR under the relevant provisions of the Bharatiya Nyaya Sanhita (BNS) / Information Technology Act, trace the culprits, freeze the disputed funds, and assist me in recovering my lost money.  

Enclosures / Attached Documents:  
1. Bank account statement showing the fraudulent debit.  
2. Clear screenshots of chats, WhatsApp messages, SMS, or emails.  
3. Transaction receipts / UTR payment slips.  
4. Copy of my ID proof (Aadhaar/PAN).  

Yours faithfully,  

[Your Signature]  
${name}  
Date: ${dateFormatted}  
Place: ${city}
`.trim();
}

/**
 * Builds translated representation in user's chosen language (Hindi / Punjabi / etc.)
 */
export function buildTranslatedComplaint(data, language = 'hi') {
  if (language === 'en' || !language) {
    return buildFormalEnglishComplaint(data);
  }

  const collected = data.collectedData || data;
  const name = collected.victim_name || data.complainant?.name || '[आपका पूरा नाम]';
  const guardianName = collected.guardian_name || '[पिता/पति का नाम]';
  const address = collected.victim_address || '[आपका पूरा आवासीय पता]';
  const phone = collected.victim_phone || data.complainant?.phone || '[मोबाइल नंबर]';
  const email = collected.victim_email || data.complainant?.email || '[ईमेल आईडी]';
  const incidentDate = collected.incident_date || data.incident?.date || '[दिनांक]';
  const description = collected.description || data.incident?.description || '[घटना का कालानुक्रमिक विवरण]';
  const rawAmt = collected.amount !== undefined ? collected.amount : data.financialLoss?.amount;
  const amount = rawAmt !== undefined && rawAmt !== null && !isNaN(Number(rawAmt)) ? Number(rawAmt) : 0;
  const txnId = collected.transaction_id || data.financialLoss?.transactionId || '[यूटीआर / ट्रांजेक्शन आईडी]';
  const myBank = collected.bank_app || collected.payment_method || '[बैंक का नाम व खाता संख्या]';

  if (language === 'pa') {
    return `ਰਾਸ਼ਟਰੀ ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਰਿਪੋਰਟਿੰਗ ਪੋਰਟਲ - ਸਾਈਬਰ ਅਪਰਾਧ ਸ਼ਿਕਾਇਤ ਫਾਰਮੈਟ (ਪੰਜਾਬੀ ਅਨੁਵਾਦ)
--------------------------------------------------------------------------------
ਸੇਵਾ ਵਿੱਚ,
ਥਾਣਾ ਮੁਖੀ (SHO) / ਸਾਈਬਰ ਕ੍ਰਾਈਮ ਸੈੱਲ / ਪੁਲਿਸ ਸਟੇਸ਼ਨ: [ਸਥਾਨਕ ਪੁਲਿਸ ਸਟੇਸ਼ਨ]
[ਸ਼ਹਿਰ, ਜ਼ਿਲ੍ਹਾ, ਰਾਜ]

ਵਿਸ਼ਾ: ਆਨਲਾਈਨ ਸਾਈਬਰ ਅਪਰਾਧ / ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਬਾਰੇ ਸ਼ਿਕਾਇਤ।

ਮੈਂ, ${name}, ਪੁੱਤਰ/ਪੁੱਤਰੀ/ਪਤਨੀ ${guardianName}, ਵਾਸੀ ${address}, ਸਾਈਬਰ ਧੋਖਾਧੜੀ ਦੀ ਰਿਪੋਰਟ ਦਰਜ ਕਰਵਾ ਰਿਹਾ/ਰਹੀ ਹਾਂ।

1. ਸ਼ਿਕਾਇਤਕਰਤਾ ਦਾ ਵੇਰਵਾ:
   - ਨਾਮ: ${name}
   - ਮੋਬਾਈਲ: +91-${phone}
   - ਈਮੇਲ: ${email}

2. ਘਟਨਾ ਦਾ ਵੇਰਵਾ:
   - ਮਿਤੀ: ${incidentDate}
   - ਕੁੱਲ ਨੁਕਸਾਨ: ₹${formatIndianCurrency(amount)}
   - ਟ੍ਰਾਂਜੈਕਸ਼ਨ ਆਈਡੀ / UTR: ${txnId}
   - ਬੈਂਕ: ${myBank}

3. ਘਟਨਾ ਦਾ ਕ੍ਰਮਵਾਰ ਵੇਰਵਾ:
${description}

ਬੇਨਤੀ: ਕਿਰਪਾ ਕਰਕੇ BNS ਅਤੇ IT ਐਕਟ ਤਹਿਤ FIR ਦਰਜ ਕੀਤੀ ਜਾਵੇ ਅਤੇ ਪੈਸੇ ਫਰੀਜ਼ ਕੀਤੇ ਜਾਣ।

ਆਪ ਜੀ ਦਾ/ਦੀ ਵਿਸ਼ਵਾਸਪਾਤਰ,
[ਦਸਤਖਤ]
${name}`;
  }

  return `राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल - साइबर अपराध शिकायत प्रारूप (हिंदी प्रतिलिपि)
--------------------------------------------------------------------------------
सेवा में,  
थाना प्रभारी (SHO) / अधिकारी-इन-चार्ज,  
साइबर क्राइम सेल / पुलिस स्टेशन: [स्थानीय पुलिस स्टेशन का नाम]  
[शहर, ज़िला, राज्य]  

विषय: ऑनलाइन साइबर अपराध / वित्तीय धोखाधड़ी / पहचान चोरी के संबंध में शिकायत।  

महोदय/महोदया,  

मैं, ${name}, पुत्र/पुत्री/पत्नी ${guardianName}, निवासी ${address}, औपचारिक रूप से साइबर अपराध की सूचना दर्ज कराना चाहता/चाहती हूँ जिसमें मुझे निशाना बनाया गया है।  

1. शिकायतकर्ता और पीड़ित का विवरण:  
   - नाम: ${name}  
   - संपर्क नंबर: +91-${phone}  
   - ईमेल पता: ${email}  
   - पहचान प्रमाण: [आधार नं. / पैन नं. / वोटर आईडी]  

2. घटना का विवरण:  
   - घटना की तिथि: ${incidentDate}  
   - घटना का समय: [समय AM/PM]  
   - उपयोग किया गया माध्यम: [उदा. WhatsApp, Telegram, फर्जी वेबसाइट, SMS, कॉल]  
   - संदिग्ध/आरोपी का विवरण (यदि ज्ञात हो): [संदिग्ध का फोन, UPI आईडी या बैंक खाता]  

3. घटना का कालानुक्रमिक विवरण:  
   ${description}  

4. वित्तीय नुकसान का विवरण:  
   - धोखाधड़ी की राशि: ₹${formatIndianCurrency(amount)}  
   - लेनदेन की तिथि: ${incidentDate}  
   - यूटीआर / ट्रांजेक्शन आईडी: ${txnId}  
   - बैंक का नाम व खाता संख्या: ${myBank}  
   - लाभार्थी/धोखेबाज का बैंक विवरण: [संदिग्ध का बैंक खाता/UPI]  

5. की गई त्वरित कार्रवाई:  
   - बैंक को सूचित किया / खाता ब्लॉक कराया (शिकायत संदर्भ संख्या: [संख्या])  
   - 1930 साइबर हेल्पलाइन पर कॉल किया (पावती संख्या: 1930 / [संख्या])  
   - cybercrime.gov.in पर शिकायत दर्ज की  

प्रार्थना / निवेदन:  
मैं आपसे सादर निवेदन करता/करती हूँ कि भारतीय न्याय संहिता (BNS) और सूचना प्रौद्योगिकी (IT) अधिनियम के प्रासंगिक प्रावधानों के तहत प्राथमिकी (FIR) दर्ज करें, अपराधियों का पता लगाएं, विवादित धनराशि को फ्रीज करें और मेरा धन वापस दिलाने में सहायता करें।  

संलग्न दस्तावेज:  
1. बैंक खाता विवरण (स्टेटमेंट) जिसमें अनधिकृत डेबिट दर्ज हो।  
2. चैट, मैसेज, एसएमएस या कॉल रिकॉर्ड के स्पष्ट स्क्रीनशॉट।  
3. लेनदेन रसीद / यूटीआर भुगतान पर्ची।  
4. पहचान प्रमाण पत्र (आधार/पैन) की प्रतिलिपि।  

भवदीय/भवदीया,  

[हस्ताक्षर]  
${name}  
स्थान: [शहर]
`.trim();
}
