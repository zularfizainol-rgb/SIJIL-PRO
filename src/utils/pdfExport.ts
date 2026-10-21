import { jsPDF } from 'jspdf';
import * as jspdfModule from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Helper to safely construct a jsPDF instance across ESM, CJS, and Vite bundlers
 */
export function createJsPdf(options: {
  orientation: 'portrait' | 'landscape';
  unit: 'mm';
  format: 'a4';
}): jsPDF {
  if (typeof jsPDF === 'function') {
    return new jsPDF(options);
  }
  const mod = jspdfModule as any;
  const Constructor = mod.jsPDF || mod.default?.jsPDF || mod.default || mod;
  if (typeof Constructor === 'function') {
    return new Constructor(options);
  }
  throw new Error('Gagal memulakan pustaka jsPDF: Constructor tidak dijumpai.');
}

/**
 * Export a certificate element as a high-quality downloadable PDF file
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

  const isLandscape = orientation === 'landscape';
  const targetWidth = isLandscape ? 1123 : 794;
  const targetHeight = isLandscape ? 794 : 1123;

  // Staging container placed at origin (0,0) behind the view (z-index -9999) with full opacity
  // This guarantees html2canvas captures 100% of the content without viewport cropping or blank canvas
  const stagingContainer = document.createElement('div');
  stagingContainer.id = `pdf-export-staging-${Date.now()}`;
  stagingContainer.style.position = 'fixed';
  stagingContainer.style.top = '0px';
  stagingContainer.style.left = '0px';
  stagingContainer.style.width = `${targetWidth}px`;
  stagingContainer.style.height = `${targetHeight}px`;
  stagingContainer.style.zIndex = '-9999';
  stagingContainer.style.overflow = 'hidden';
  stagingContainer.style.backgroundColor = '#ffffff';
  stagingContainer.style.opacity = '1';
  stagingContainer.style.pointerEvents = 'none';

  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = `${elementId}-export-clone`;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.width = `${targetWidth}px`;
  clone.style.height = `${targetHeight}px`;

  stagingContainer.appendChild(clone);
  document.body.appendChild(stagingContainer);

  try {
    // Wait briefly for all fonts, SVG elements, and images to settle in DOM
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: targetWidth,
      height: targetHeight,
      windowWidth: targetWidth,
      windowHeight: targetHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = createJsPdf({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = isLandscape ? 297 : 210;
    const pdfHeight = isLandscape ? 210 : 297;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  } finally {
    if (document.body.contains(stagingContainer)) {
      document.body.removeChild(stagingContainer);
    }
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

  const isLandscape = orientation === 'landscape';
  const targetWidth = isLandscape ? 1123 : 794;
  const targetHeight = isLandscape ? 794 : 1123;

  const stagingContainer = document.createElement('div');
  stagingContainer.id = `png-export-staging-${Date.now()}`;
  stagingContainer.style.position = 'fixed';
  stagingContainer.style.top = '0px';
  stagingContainer.style.left = '0px';
  stagingContainer.style.width = `${targetWidth}px`;
  stagingContainer.style.height = `${targetHeight}px`;
  stagingContainer.style.zIndex = '-9999';
  stagingContainer.style.overflow = 'hidden';
  stagingContainer.style.backgroundColor = '#ffffff';
  stagingContainer.style.opacity = '1';
  stagingContainer.style.pointerEvents = 'none';

  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = `${elementId}-png-export-clone`;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.width = `${targetWidth}px`;
  clone.style.height = `${targetHeight}px`;

  stagingContainer.appendChild(clone);
  document.body.appendChild(stagingContainer);

  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: targetWidth,
      height: targetHeight,
      windowWidth: targetWidth,
      windowHeight: targetHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  } catch (err) {
    console.error('Error generating image:', err);
    return false;
  } finally {
    if (document.body.contains(stagingContainer)) {
      document.body.removeChild(stagingContainer);
    }
  }
}

/**
 * Trigger standard system print with window focus
 */
export function triggerPrint(): boolean {
  try {
    window.focus();
    window.print();
    return true;
  } catch (err) {
    console.error('Error running window.print():', err);
    return false;
  }
}
