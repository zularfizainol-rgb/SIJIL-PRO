import { jsPDF } from 'jspdf';
import * as jspdfModule from 'jspdf';
import { toJpeg, toPng } from 'html-to-image';
import html2canvas from 'html2canvas';

/**
 * Safely construct a jsPDF instance across ESM, CJS, and Vite bundlers
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
 * Trigger file download from a Blob or DataURL across any browser
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.target = '_self';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 500);
  } catch (err) {
    console.error('Download link error:', err);
    // Fallback: window.location
    window.location.href = dataUrl;
  }
}

/**
 * High-fidelity DOM capture to DataURL
 * Uses browser-native SVG ForeignObject (html-to-image) to guarantee 100% support
 * for Tailwind v4 modern CSS (oklch, CSS variables, transforms, SVG filters)
 */
export async function captureElementToDataUrl(
  element: HTMLElement,
  options: {
    width: number;
    height: number;
    format?: 'jpeg' | 'png';
  }
): Promise<string> {
  const isJpeg = options.format !== 'png';

  const baseConfig = {
    width: options.width,
    height: options.height,
    pixelRatio: 2, // High resolution (300 DPI equivalent on A4)
    quality: 0.95,
    skipFonts: true, // Prevents CORS blocks on external Google font fetches inside foreignObject
    backgroundColor: '#ffffff',
    filter: (node: Node) => {
      // Skip script or interactive UI elements if any
      if (node.nodeName === 'SCRIPT' || node.nodeName === 'NOSCRIPT') {
        return false;
      }
      return true;
    },
    style: {
      transform: 'none',
      transformOrigin: 'top left',
      margin: '0',
      boxShadow: 'none',
    },
  };

  // 1. Primary Engine: html-to-image with skipFonts (fast, native SVG foreignObject, supports oklch)
  try {
    if (isJpeg) {
      return await toJpeg(element, baseConfig);
    } else {
      return await toPng(element, baseConfig);
    }
  } catch (firstErr) {
    console.warn('html-to-image skipFonts primary attempt failed, retrying with full font embed', firstErr);

    // 2. Secondary Engine: Retry with font embed enabled
    try {
      const fullFontConfig = { ...baseConfig, skipFonts: false };
      if (isJpeg) {
        return await toJpeg(element, fullFontConfig);
      } else {
        return await toPng(element, fullFontConfig);
      }
    } catch (secondErr) {
      console.warn('html-to-image full font embed failed, falling back to html2canvas', secondErr);

      // 3. Fallback Engine: html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: options.width,
        height: options.height,
      });

      return isJpeg ? canvas.toDataURL('image/jpeg', 0.95) : canvas.toDataURL('image/png');
    }
  }
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
    console.error(`Element #${elementId} not found in DOM`);
    return false;
  }

  const isLandscape = orientation === 'landscape';
  const targetWidth = isLandscape ? 1123 : 794;
  const targetHeight = isLandscape ? 794 : 1123;
  const pdfWidth = isLandscape ? 297 : 210;
  const pdfHeight = isLandscape ? 210 : 297;

  try {
    // Capture high-res image data
    const imgData = await captureElementToDataUrl(element, {
      width: targetWidth,
      height: targetHeight,
      format: 'jpeg',
    });

    // Create jsPDF document
    const pdf = createJsPdf({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    // Trigger download using Blob URL first (most reliable across iframes and sandboxes)
    try {
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      downloadDataUrl(blobUrl, filename);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch (blobErr) {
      console.warn('Blob URL download failed, trying pdf.save', blobErr);
      pdf.save(filename);
    }

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
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  const isLandscape = orientation === 'landscape';
  const targetWidth = isLandscape ? 1123 : 794;
  const targetHeight = isLandscape ? 794 : 1123;

  try {
    const dataUrl = await captureElementToDataUrl(element, {
      width: targetWidth,
      height: targetHeight,
      format: 'png',
    });

    downloadDataUrl(dataUrl, filename);
    return true;
  } catch (err) {
    console.error('Error exporting image:', err);
    return false;
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
