import { ContactInfo } from "../types";

declare global {
  interface Window {
    QRious: any;
  }
}

export const formatUrl = (url: string): string => {
  if (!url.trim()) return "";

  // Add protocol if missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
};

export const generateVCard = (contact: ContactInfo): string => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;
  return vcard;
};

export const loadQRiousLibrary = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.QRious) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js";
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const createQRCanvas = (
  container: HTMLElement,
  text: string,
  foregroundColor: string = "black",
  backgroundColor: string = "white",
  logoFile?: File | null,
  logoSize: number = 20
): void => {
  try {
    // Clear previous QR code
    container.innerHTML = "";

    // Create canvas element
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    // Generate QR code with higher resolution for better quality
    new window.QRious({
      element: canvas,
      value: text,
      size: 600, // Doubled size for higher resolution
      background: backgroundColor,
      foreground: foregroundColor,
      level: "H", // Higher error correction for logo overlay
    });

    // Set display size to maintain consistency
    canvas.style.width = "300px";
    canvas.style.height = "300px";

    // Add logo if provided
    if (logoFile) {
      addLogoToCanvas(canvas, logoFile, logoSize);
    }

    // Style the canvas
    canvas.className = "w-full h-auto rounded-xl shadow-lg bg-white";
    canvas.style.maxWidth = "300px";
    canvas.style.height = "auto";
  } catch (error) {
    console.error("Error creating QR code:", error);
    throw error;
  }
};

export const addLogoToCanvas = (
  canvas: HTMLCanvasElement,
  logoFile: File,
  logoSize: number
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const img = new Image();
  img.onload = () => {
    const canvasSize = canvas.width;
    const logoSizePx = (canvasSize * logoSize) / 100;
    const x = (canvasSize - logoSizePx) / 2;
    const y = (canvasSize - logoSizePx) / 2;

    // Create a temporary canvas for logo processing
    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = logoSizePx;
    logoCanvas.height = logoSizePx;
    const logoCtx = logoCanvas.getContext("2d");

    if (!logoCtx) return;

    // Enable high quality image processing
    logoCtx.imageSmoothingEnabled = true;
    logoCtx.imageSmoothingQuality = "high";

    // Create circular clipping path for the logo
    logoCtx.beginPath();
    logoCtx.arc(logoSizePx / 2, logoSizePx / 2, logoSizePx / 2, 0, Math.PI * 2);
    logoCtx.closePath();
    logoCtx.clip();

    // Draw the image with proper scaling
    logoCtx.drawImage(img, 0, 0, logoSizePx, logoSizePx);

    // Create a white background circle for the logo
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(
      canvasSize / 2,
      canvasSize / 2,
      logoSizePx / 2 + 10,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Draw the processed logo
    ctx.drawImage(logoCanvas, x, y);
  };

  // Set crossOrigin to anonymous to prevent tainted canvas issues
  img.crossOrigin = "anonymous";
  img.src = URL.createObjectURL(logoFile);
};

export const createFallbackQRImage = (
  container: HTMLElement,
  text: string,
  altText: string
): void => {
  // Clear previous content
  container.innerHTML = "";

  // Create img element for fallback
  const img = document.createElement("img");
  const encodedData = encodeURIComponent(text);
  img.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedData}&choe=UTF-8`;
  img.alt = altText;
  img.className = "w-full h-auto rounded-xl shadow-lg bg-white p-4";
  img.style.maxWidth = "300px";
  img.style.height = "auto";

  // Add error handling for the fallback image
  img.onerror = () => {
    // If Google Charts also fails, try QR Server API
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10`;
  };

  container.appendChild(img);
};
