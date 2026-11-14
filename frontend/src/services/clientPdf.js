import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Sanitizes input text so pdf-lib's standard fonts (Times-Roman / Helvetica)
 * will never crash with WinAnsi character encoding errors.
 * Specifically converts Indian Rupee (₹) to 'Rs.', smart quotes to ASCII, etc.
 */
function sanitizeForStandardPdf(text) {
  if (!text) return '';
  return text
    .replace(/₹/g, 'Rs. ')
    .replace(/[\u2018\u2019]/g, "'") // Single smart quotes
    .replace(/[\u201C\u201D]/g, '"') // Double smart quotes
    .replace(/[\u2013\u2014]/g, '-') // En-dash & Em-dash
    .replace(/\u2022/g, '-')         // Bullet
    .replace(/\u2026/g, '...')       // Ellipsis
    .replace(/[^\x20-\x7E\r\n\t]/g, ''); // Safely drop any non-ASCII glyphs
}

/**
 * Generate a professional, authentic Police / National Cyber Crime Reporting Portal
 * complaint petition PDF with a crisp white background and black text
 * strictly following standard legal document color coding.
 */
export async function generateClientComplaintPDF({
  complaintId = 'CS-DRAFT',
  crimeType,
  collectedData = {},
  complaintText = '',
  language = 'en',
}) {
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595.28; // Standard A4 width in points
  const PAGE_HEIGHT = 841.89; // Standard A4 height in points
  const MARGIN_LEFT = 48;
  const MARGIN_RIGHT = 48;
  const MARGIN_TOP = 48;
  const MARGIN_BOTTOM = 48;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  let pageNumber = 1;
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN_TOP;

  function addNewPage() {
    pageNumber++;
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN_TOP;
    drawRunningHeaderFooter();
  }

  function drawRunningHeaderFooter() {
    // Standard formal running header
    page.drawText('CYBERSHIELD AI - FORMAL CYBERCRIME COMPLAINT DOSSIER', {
      x: MARGIN_LEFT,
      y: PAGE_HEIGHT - 28,
      size: 8,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText(`DOSSIER ID: ${complaintId} | OFFICIAL RECORD`, {
      x: PAGE_WIDTH - MARGIN_RIGHT - 180,
      y: PAGE_HEIGHT - 28,
      size: 8,
      font: helvetica,
      color: rgb(0.35, 0.35, 0.35),
    });
    page.drawLine({
      start: { x: MARGIN_LEFT, y: PAGE_HEIGHT - 32 },
      end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: PAGE_HEIGHT - 32 },
      thickness: 0.5,
      color: rgb(0.6, 0.6, 0.6),
    });

    // Running footer with page numbering
    page.drawLine({
      start: { x: MARGIN_LEFT, y: MARGIN_BOTTOM - 15 },
      end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: MARGIN_BOTTOM - 15 },
      thickness: 0.5,
      color: rgb(0.6, 0.6, 0.6),
    });
    page.drawText('National Cyber Crime Reporting Portal (cybercrime.gov.in) & Jurisdictional Police Station', {
      x: MARGIN_LEFT,
      y: MARGIN_BOTTOM - 26,
      size: 7.5,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });
    page.drawText(`Page ${pageNumber}`, {
      x: PAGE_WIDTH - MARGIN_RIGHT - 40,
      y: MARGIN_BOTTOM - 26,
      size: 8,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  // Draw header & footer on Page 1
  drawRunningHeaderFooter();

  // Official Letterhead Box (White background, black border & black text)
  page.drawRectangle({
    x: MARGIN_LEFT,
    y: y - 56,
    width: CONTENT_WIDTH,
    height: 56,
    color: rgb(1, 1, 1), // Standard White Background
    borderColor: rgb(0, 0, 0), // Standard Black Border
    borderWidth: 1.25,
  });

  page.drawText('FORMAL POLICE COMPLAINT & INVESTIGATION PETITION', {
    x: MARGIN_LEFT + 14,
    y: y - 20,
    size: 12.5,
    font: timesBold,
    color: rgb(0, 0, 0), // Black text
  });

  page.drawText('NATIONAL CYBER CRIME REPORTING PORTAL (cybercrime.gov.in) & CYBER CRIME POLICE STATION', {
    x: MARGIN_LEFT + 14,
    y: y - 35,
    size: 8,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  const nowFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  page.drawText(`Date of Drafting: ${nowFormatted} | National Cyber Helpline: 1930 | Statutory Filing: IT Act 2000 & BNS`, {
    x: MARGIN_LEFT + 14,
    y: y - 48,
    size: 7.5,
    font: helvetica,
    color: rgb(0.25, 0.25, 0.25),
  });

  y -= 74;

  // Sanitize text to standard ASCII
  const cleanFullText = sanitizeForStandardPdf(complaintText);
  const rawLines = cleanFullText.split('\n');

  for (const rawLine of rawLines) {
    if (y < MARGIN_BOTTOM + 35) {
      addNewPage();
    }

    const trimmed = rawLine.trim();

    // Skip redundant separator banners if present in text
    if (/^={5,}/.test(trimmed)) {
      page.drawLine({
        start: { x: MARGIN_LEFT, y: y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: y },
        thickness: 0.75,
        color: rgb(0, 0, 0),
      });
      y -= 10;
      continue;
    }

    if (/^-{5,}/.test(trimmed)) {
      page.drawLine({
        start: { x: MARGIN_LEFT, y: y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: y },
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5),
      });
      y -= 8;
      continue;
    }

    // Identify standard document section headers
    const isSectionHeader = (
      /^[0-9]\.\s+[A-Za-z\s&/()]+:?$/.test(trimmed) || 
      trimmed.startsWith('Prayer / Request:') || 
      trimmed.startsWith('Enclosures / Attached Documents:') || 
      trimmed.startsWith('To,') ||
      trimmed.startsWith('Subject:') ||
      trimmed.startsWith('Respected Sir/Madam,') ||
      trimmed.startsWith('Yours faithfully,')
    );

    if (isSectionHeader) {
      y -= 4;
      if (y < MARGIN_BOTTOM + 35) addNewPage();

      page.drawText(trimmed, {
        x: MARGIN_LEFT,
        y: y,
        size: 10,
        font: timesBold,
        color: rgb(0, 0, 0), // Pure Black text
      });

      if (/^[0-9]\./.test(trimmed) || trimmed.startsWith('Prayer') || trimmed.startsWith('Enclosures')) {
        page.drawLine({
          start: { x: MARGIN_LEFT, y: y - 2 },
          end: { x: MARGIN_LEFT + 280, y: y - 2 },
          thickness: 0.6,
          color: rgb(0, 0, 0),
        });
      }

      y -= 15;
      continue;
    }

    if (!trimmed) {
      y -= 7;
      continue;
    }

    // Word wrap paragraph text
    const words = trimmed.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      let width = 0;
      try {
        width = timesRoman.widthOfTextAtSize(testLine, 9.5);
      } catch (e) {
        width = testLine.length * 5;
      }

      if (width < CONTENT_WIDTH) {
        currentLine = testLine;
      } else {
        if (y < MARGIN_BOTTOM + 30) {
          addNewPage();
        }
        page.drawText(currentLine, {
          x: MARGIN_LEFT,
          y: y,
          size: 9.5,
          font: timesRoman,
          color: rgb(0, 0, 0), // Standard Black Text
        });
        y -= 13;
        currentLine = word;
      }
    }

    if (currentLine) {
      if (y < MARGIN_BOTTOM + 30) {
        addNewPage();
      }
      page.drawText(currentLine, {
        x: MARGIN_LEFT,
        y: y,
        size: 9.5,
        font: timesRoman,
        color: rgb(0, 0, 0), // Standard Black Text
      });
      y -= 13;
    }
  }

  // Standard Signature Block
  if (y < MARGIN_BOTTOM + 80) {
    addNewPage();
  }

  y -= 15;
  page.drawLine({
    start: { x: MARGIN_LEFT, y: y },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: y },
    thickness: 0.5,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 16;

  page.drawText('VERIFICATION & SOLEMN DECLARATION', {
    x: MARGIN_LEFT,
    y: y,
    size: 9,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  y -= 12;

  page.drawText('I verify that the contents of this complaint petition are true and correct to the best of my knowledge.', {
    x: MARGIN_LEFT,
    y: y,
    size: 8.5,
    font: timesRoman,
    color: rgb(0.15, 0.15, 0.15),
  });
  y -= 32;

  page.drawText('____________________________________________', {
    x: MARGIN_LEFT,
    y: y,
    size: 9,
    font: timesRoman,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText('____________________________________________', {
    x: PAGE_WIDTH - MARGIN_RIGHT - 190,
    y: y,
    size: 9,
    font: timesRoman,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 12;

  const complainantName = sanitizeForStandardPdf(collectedData.victim_name || 'Complainant / Victim');
  page.drawText(`Signature of Complainant: ${complainantName}`, {
    x: MARGIN_LEFT,
    y: y,
    size: 8.5,
    font: timesBold,
    color: rgb(0, 0, 0),
  });
  page.drawText('Signature of Receiving Officer / Station Seal', {
    x: PAGE_WIDTH - MARGIN_RIGHT - 190,
    y: y,
    size: 8.5,
    font: timesRoman,
    color: rgb(0.1, 0.1, 0.1),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
