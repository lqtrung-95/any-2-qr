import { useRef } from "react";
import {
  loadQRiousLibrary,
  createQRCanvas,
  createFallbackQRImage,
} from "../utils/qrUtils";

export const useQRCode = () => {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const generateQRCode = async (text: string, altText: string = "QR Code") => {
    if (!text.trim()) {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = "";
      }
      return;
    }

    if (!qrContainerRef.current) return;

    try {
      await loadQRiousLibrary();
      createQRCanvas(qrContainerRef.current, text);
    } catch (error) {
      console.error("Error loading QR library:", error);
      // Fallback to external APIs
      createFallbackQRImage(qrContainerRef.current, text, altText);
    }
  };

  const downloadQRCode = (filename: string = "qr-code") => {
    if (!qrContainerRef.current) return;

    const canvas = qrContainerRef.current.querySelector("canvas");
    const img = qrContainerRef.current.querySelector("img");

    if (canvas) {
      // Download from canvas
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else if (img) {
      // Download from image
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = img.src;
      link.click();
    }
  };

  const clearQRCode = () => {
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = "";
    }
  };

  return {
    qrContainerRef,
    generateQRCode,
    downloadQRCode,
    clearQRCode,
  };
};
