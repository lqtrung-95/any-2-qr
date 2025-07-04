import React, { useState, useRef } from "react";
import {
  Share2,
  X,
  MessageCircle,
  Send,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

interface SocialShareProps {
  qrContainerRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => Promise<void>;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  qrContainerRef,
  isOpen,
  onClose,
  onCopy,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getQRImageDataUrl = (): string | null => {
    const canvas = qrContainerRef.current?.querySelector("canvas");
    if (canvas) {
      return canvas.toDataURL("image/png");
    }
    return null;
  };

  const downloadQRImage = (): string => {
    const canvas = qrContainerRef.current?.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      return link.href;
    }
    return "";
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out this QR code: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(`Check out this QR code: ${window.location.href}`);
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`,
      "_blank"
    );
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent(t("shareQR"));
    const imageDataUrl = getQRImageDataUrl();
    let body = `Check out this QR code: ${window.location.href}\n\n`;

    if (imageDataUrl) {
      body += `QR Code Image: ${imageDataUrl}`;
    }

    window.open(
      `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out this QR code: ${window.location.href}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareViaWebShare = async () => {
    if (navigator.share && navigator.canShare) {
      const canvas = qrContainerRef.current?.querySelector("canvas");
      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "qr-code.png", { type: "image/png" });
            const shareData = {
              title: t("shareQR"),
              text: `${t("shareQR")}: ${window.location.href}`,
              files: [file],
            };

            if (navigator.canShare(shareData)) {
              try {
                await navigator.share(shareData);
              } catch (error: any) {
                if (error.name !== "AbortError") {
                  console.error("Error sharing:", error);
                }
              }
            }
          }
        }, "image/png");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800">{t("shareQR")}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Native Share Button (if supported) */}
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={shareViaWebShare}
            className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
          >
            <Share2 className="w-5 h-5" />
            Share with Image
          </button>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* WhatsApp */}
          <button
            onClick={shareToWhatsApp}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>

          {/* Telegram */}
          <button
            onClick={shareToTelegram}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            <Send className="w-4 h-4" />
            Telegram
          </button>

          {/* Email */}
          <button
            onClick={shareToEmail}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>

          {/* Twitter */}
          <button
            onClick={shareToTwitter}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </button>

          {/* SMS */}
          <button
            onClick={() => {
              const text = encodeURIComponent(
                `Check out this QR code: ${window.location.href}`
              );
              window.open(`sms:?body=${text}`, "_blank");
            }}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            SMS
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => {
              const text = encodeURIComponent(
                `Check out this QR code: ${window.location.href}`
              );
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  window.location.href
                )}`,
                "_blank"
              );
            }}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </button>
        </div>

        {/* Copy to Clipboard */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-xl hover:from-orange-200 hover:to-amber-200 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-600">{t("copied")}</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              {t("copyData")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
