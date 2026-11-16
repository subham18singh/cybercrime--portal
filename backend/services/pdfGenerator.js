import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { buildFormalEnglishComplaint, buildTranslatedComplaint, buildSection65BCertificate } from './complaintTextBuilder.js';

export async function generateComplaintPdfDocument(complaintData) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  let customFont = null;
  const fontPath = path.join(process.cwd(), 'fonts', 'NotoSansDevanagari.ttf');

  if (fs.existsSync(fontPath)) {
    try {
      const fontBytes = fs.readFileSync(fontPath);
      customFont = await pdfDoc.embedFont(fontBytes);
    } catch (fontErr) {
      console.warn('Could not embed NotoSansDevanagari font:', fontErr.message);
    }
  }

  const fallbackFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const activeFont = customFont || fallbackFont;

  // Generate plain legal text
  const legalText = buildFormalEnglishComplaint(complaintData);
  const translatedText = complaintData.language && complaintData.language !== 'en'
    ? buildTranslatedComplaint(complaintData, complaintData.language)
    : null;

  // Split text into lines that fit page width
  const fontSize = 10;
  const lineHeight = 14;
  const margin = 50;
  const pageWidth = 595.28; // A4 standard width
  const pageHeight = 841.89; // A4 standard height
  const maxLineWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Helper to draw text with pagination
  function drawHeading(text, color = rgb(0.03, 0.45, 0.85)) {
    if (y < margin + 60) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    const hasIndic = /[\u0900-\u0D7F]/.test(text);
    const chosenFont = (hasIndic && customFont) ? customFont : boldFont;
    page.drawText(text, {
      x: margin,
      y,
      size: 13,
      font: chosenFont,
      color,
    });
    y -= 22;
  }

  function measureWidth(text, font, size) {
    try {
      return font.widthOfTextAtSize(text, size);
    } catch (e) {
      return text.length * size * 0.55;
    }
  }

  function drawParagraph(text, font = activeFont, size = fontSize, color = rgb(0.1, 0.1, 0.15)) {
    const lines = text.split('\n');

    for (const rawLine of lines) {
      const hasIndic = /[\u0900-\u0D7F]/.test(rawLine);
      const lineFont = (hasIndic && customFont) ? customFont : font;

      // Simple word wrapping
      const words = rawLine.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = measureWidth(testLine, lineFont, size);

        if (testWidth > maxLineWidth && currentLine) {
          if (y < margin + 30) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
          try {
            page.drawText(currentLine, { x: margin, y, size, font: lineFont, color });
          } catch (e) {
            if (customFont) {
              try {
                page.drawText(currentLine, { x: margin, y, size, font: customFont, color });
              } catch (err2) {
                page.drawText(currentLine.replace(/[^\x00-\x7F]/g, ''), { x: margin, y, size, font: fallbackFont, color });
              }
            } else {
              page.drawText(currentLine.replace(/[^\x00-\x7F]/g, ''), { x: margin, y, size, font: fallbackFont, color });
            }
          }
          y -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        if (y < margin + 30) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        try {
          page.drawText(currentLine, { x: margin, y, size, font: lineFont, color });
        } catch (e) {
          if (customFont) {
            try {
              page.drawText(currentLine, { x: margin, y, size, font: customFont, color });
            } catch (err2) {
              page.drawText(currentLine.replace(/[^\x00-\x7F]/g, ''), { x: margin, y, size, font: fallbackFont, color });
            }
          } else {
            page.drawText(currentLine.replace(/[^\x00-\x7F]/g, ''), { x: margin, y, size, font: fallbackFont, color });
          }
        }
        y -= lineHeight;
      }
    }
  }

  // Header banner
  page.drawRectangle({
    x: margin,
    y: y - 10,
    width: maxLineWidth,
    height: 4,
    color: rgb(0, 0.85, 1),
  });
  y -= 25;

  drawHeading('CYBERSHIELD AI - FORMAL CYBERCRIME PETITION');
  drawParagraph(`Generated ID: ${complaintData.complaintId || 'CS-DRAFT'} | Verification: CrPC & IT Act 2000 Compliant Draft`, boldFont, 9, rgb(0.3, 0.3, 0.4));
  y -= 10;

  // Main English petition
  drawParagraph(legalText);

  // If user requested Hindi/Indic translated copy, add section
  if (translatedText && customFont) {
    y -= 20;
    drawHeading('TRANSLATED COPY / क्षेत्रीय भाषा प्रतिलिपि', rgb(0.55, 0.35, 0.95));
    drawParagraph(translatedText, customFont, 9, rgb(0.2, 0.2, 0.25));
  }

  // Annexure: Section 65B(4) Indian Evidence Act Statutory Certificate
  const sec65BText = buildSection65BCertificate(complaintData, complaintData.exhibits || []);
  page = pdfDoc.addPage([pageWidth, pageHeight]);
  y = pageHeight - margin;
  drawHeading('ANNEXURE - CERTIFICATE UNDER SECTION 65B(4) EVIDENCE ACT (SEC 63 BSA)', rgb(0.1, 0.5, 0.3));
  drawParagraph(sec65BText, fallbackFont, 8.5, rgb(0.15, 0.15, 0.15));

  // Official Disclaimer in Footer
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    p.drawText(
      `Page ${i + 1} of ${pages.length} • User-prepared pre-investigation draft. Must be submitted at cybercrime.gov.in or local police station.`,
      {
        x: margin,
        y: 25,
        size: 7.5,
        font: fallbackFont,
        color: rgb(0.5, 0.5, 0.5),
      }
    );
  }

  return await pdfDoc.save();
}
