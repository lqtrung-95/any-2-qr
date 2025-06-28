import { useRef } from "react";
import {
  loadQRiousLibrary,
  createQRCanvas,
  createFallbackQRImage,
} from "../utils/qrUtils";
import { QRCustomization } from "../types";

export const useQRCode = () => {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const generateQRCode = async (
    text: string,
    altText: string = "QR Code",
    customization?: QRCustomization
  ) => {
    if (!text.trim()) {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = "";
      }
      return;
    }

    if (!qrContainerRef.current) return;

    try {
      await loadQRiousLibrary();
      createQRCanvas(
        qrContainerRef.current,
        text,
        customization?.foregroundColor,
        customization?.backgroundColor,
        customization?.logoFile,
        customization?.logoSize
      );
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
      // Download from canvas with high quality
      const link = document.createElement("a");
      link.download = `${filename}.png`;

      // Use higher quality PNG export
      link.href = canvas.toDataURL("image/png", 1.0);
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
