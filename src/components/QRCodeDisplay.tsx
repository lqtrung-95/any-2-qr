import React from "react";
import { QrCode } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

interface QRCodeDisplayProps {
  qrData: string;
  qrContainerRef: React.RefObject<HTMLDivElement>;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrData,
  qrContainerRef,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
        {t("generatedQrCode")}
      </h2>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-10 w-full max-w-sm shadow-xl shadow-orange-100/50 border-2 border-white/50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-rose-200/30 to-orange-200/30 rounded-full translate-y-6 -translate-x-6"></div>

        {qrData ? (
          <div className="text-center relative z-10">
            <div ref={qrContainerRef} className="flex justify-center mb-6">
              {/* QR code will be dynamically inserted here */}
            </div>
            <p className="text-base text-slate-700 font-semibold drop-shadow-sm">
              {t("scanQrCode")}
            </p>
          </div>
        ) : (
          <div className="text-center py-20 relative z-10">
            <QrCode className="w-20 h-20 text-slate-300 mx-auto mb-6 drop-shadow-sm" />
            <p className="text-slate-500 font-medium text-lg">
              {t("fillFormPrompt")}
            </p>
          </div>
        )}
      </div>

      {qrData && (
        <div className="w-full max-w-sm">
          <h3 className="text-lg font-bold text-slate-700 mb-4 tracking-wide">
            {t("qrCodeData")}
          </h3>
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-4 text-sm text-slate-700 max-h-40 overflow-y-auto shadow-inner border-2 border-white/50">
            <pre className="whitespace-pre-wrap break-words font-mono leading-relaxed">
              {qrData}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
