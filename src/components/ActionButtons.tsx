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
    <div className="flex gap-4 w-full max-w-sm">
      <button
        onClick={onDownload}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
      >
        <Download className="w-4 h-4" />
        {t("download")}
      </button>

      <button
        onClick={handleCopy}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            {t("copied")}
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            {t("copyData")}
          </>
        )}
      </button>
    </div>
  );
};
