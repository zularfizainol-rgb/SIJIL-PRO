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
 * Converts modern CSS oklch(...) colors to standard hex / rgba using browser canvas
 */
function sanitizeOklchColors(str: string): string {
  if (!str || !str.includes('oklch')) return str;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return str.replace(/oklch\([^)]+\)/g, '#1e293b');

    return str.replace(/oklch\([^)]+\)/g, (match) => {
      try {
        ctx.fillStyle = '#1e293b';
        ctx.fillStyle = match;
        return ctx.fillStyle;
      } catch {
        return '#1e293b';
      }
    });
  } catch {
    return str.replace(/oklch\([^)]+\)/g, '#1e293b');
  }
}

/**
 * Pre-cleans a cloned document for html2canvas so that it never encounters oklch
 */
function cleanClonedDocForCapture(clonedDoc: Document, clonedEl: HTMLElement) {
  try {
    // 1. Sanitize all <style> tags
    const styleTags = clonedDoc.querySelectorAll('style');
    styleTags.forEach((styleTag) => {
      if (styleTag.textContent && styleTag.textContent.includes('oklch')) {
        styleTag.textContent = sanitizeOklchColors(styleTag.textContent);
      }
    });

    // 2. Sanitize inline style attributes on cloned elements
    clonedEl.querySelectorAll('*').forEach((el) => {
      const inlineStyle = el.getAttribute('style');
      if (inlineStyle && inlineStyle.includes('oklch')) {
        el.setAttribute('style', sanitizeOklchColors(inlineStyle));
      }
    });

    // 3. Ensure transform is reset on the cloned certificate container
    clonedEl.style.transform = 'none';
    clonedEl.style.transformOrigin = 'top left';
    clonedEl.style.margin = '0';
    clonedEl.style.boxShadow = 'none';
  } catch (e) {
    console.warn('cleanClonedDocForCapture warning:', e);
  }
}

/**
 * High-fidelity DOM capture to DataURL
 * Uses dual-engine: html2canvas with oklch sanitizer + html-to-image fallback
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

  // 1. Primary Engine: html2canvas with oklch sanitization
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution (300 DPI equivalent)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: options.width,
      height: options.height,
      onclone: (clonedDoc, clonedEl) => {
        cleanClonedDocForCapture(clonedDoc, clonedEl);
      },
    });

    return isJpeg ? canvas.toDataURL('image/jpeg', 0.95) : canvas.toDataURL('image/png');
  } catch (html2canvasErr) {
    console.warn('html2canvas capture failed, trying html-to-image engine:', html2canvasErr);

    // 2. Secondary Engine: html-to-image with skipFonts
    try {
      const captureConfig = {
        width: options.width,
        height: options.height,
        pixelRatio: 2,
        quality: 0.95,
        skipFonts: true,
        backgroundColor: '#ffffff',
        filter: (node: Node) => {
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

      if (isJpeg) {
        return await toJpeg(element, captureConfig);
      } else {
        return await toPng(element, captureConfig);
      }
    } catch (htmlToImageErr) {
      console.error('Both capture engines failed:', htmlToImageErr);
      throw htmlToImageErr;
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
