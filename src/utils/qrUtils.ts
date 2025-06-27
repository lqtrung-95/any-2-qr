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

export const createQRCanvas = (container: HTMLElement, text: string): void => {
  try {
    // Clear previous QR code
    container.innerHTML = "";

    // Create canvas element
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    // Generate QR code
    const qr = new window.QRious({
      element: canvas,
      value: text,
      size: 300,
      background: "white",
      foreground: "black",
      level: "M",
    });

    // Style the canvas
    canvas.className = "w-full h-auto rounded-xl shadow-lg bg-white";
    canvas.style.maxWidth = "300px";
    canvas.style.height = "auto";
  } catch (error) {
    console.error("Error creating QR code:", error);
    throw error;
  }
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
