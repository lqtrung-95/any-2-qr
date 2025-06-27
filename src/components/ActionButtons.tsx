import React, { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

interface ActionButtonsProps {
  qrData: string;
  onDownload: () => void;
  onCopy: () => Promise<void>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  qrData,
  onDownload,
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

  if (!qrData) return null;

  return (
    <div className="flex gap-6 w-full max-w-md">
      <button
        onClick={onDownload}
        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-2xl hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-orange-300/50 transform hover:-translate-y-1 hover:scale-105"
      >
        <Download className="w-5 h-5 drop-shadow-sm" />
        {t("download")}
      </button>

      <button
        onClick={handleCopy}
        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 rounded-2xl hover:from-slate-300 hover:to-slate-400 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-slate-300/50 transform hover:-translate-y-1 hover:scale-105"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 text-emerald-600 drop-shadow-sm" />
            <span className="text-emerald-600">{t("copied")}</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5 drop-shadow-sm" />
            {t("copyData")}
          </>
        )}
      </button>
    </div>
  );
};
