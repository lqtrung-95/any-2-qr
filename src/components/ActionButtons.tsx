import React, { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { SocialShare } from "./SocialShare";

interface ActionButtonsProps {
  qrData: string;
  qrContainerRef: React.RefObject<HTMLDivElement>;
  onDownload: () => void;
  onCopy: () => Promise<void>;
  onNativeShare: () => Promise<void>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  qrData,
  qrContainerRef,
  onDownload,
  onCopy,
  onNativeShare,
}) => {
  const { t } = useTranslation();
  const [showSocialShare, setShowSocialShare] = useState(false);

  if (!qrData) return null;

  return (
    <>
      <SocialShare
        qrData={qrData}
        qrContainerRef={qrContainerRef}
        isOpen={showSocialShare}
        onClose={() => setShowSocialShare(false)}
        onCopy={onCopy}
      />
      <div className="flex gap-4 w-full max-w-sm">
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center p-4 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-2xl hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 transition-all duration-300 font-bold shadow-2xl hover:shadow-orange-300/50 transform hover:-translate-y-1 hover:scale-105"
          title={t("download")}
        >
          <Download className="w-6 h-6 drop-shadow-sm" />
        </button>

        <button
          onClick={() => setShowSocialShare(true)}
          className="flex-1 flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-blue-300/50 transform hover:-translate-y-1 hover:scale-105"
          title={t("share")}
        >
          <Share2 className="w-6 h-6 drop-shadow-sm" />
        </button>
      </div>
    </>
  );
};
