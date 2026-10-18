import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export a certificate element as a downloadable PDF file
 */
export async function exportCertificateToPDF(
  elementId: string,
  filename: string = 'Sijil-Penghargaan.pdf',
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  try {
    // Render element into canvas at scale 2 for crisp vector-like rendering
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: orientation === 'landscape' ? 1123 : 794,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Create A4 PDF
    const pdf = new jsPDF({
      orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = orientation === 'landscape' ? 297 : 210;
    const pdfHeight = orientation === 'landscape' ? 210 : 297;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

/**
 * Export certificate as high-resolution PNG image
 */
export async function exportCertificateToImage(
  elementId: string,
  filename: string = 'Sijil-Penghargaan.png',
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: orientation === 'landscape' ? 1123 : 794,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  } catch (err) {
    console.error('Error generating image:', err);
    return false;
  }
}

/**
 * Trigger standard system print
 */
export function triggerPrint() {
  window.print();
}
