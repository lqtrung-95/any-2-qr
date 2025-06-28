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
    <div className="flex flex-col items-center space-y-6 sm:space-y-8 w-full max-w-sm mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
        {t("generatedQrCode")}
      </h2>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 w-full shadow-xl shadow-orange-100/50 border-2 border-white/50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-rose-200/30 to-orange-200/30 rounded-full translate-y-5 -translate-x-5 sm:translate-y-6 sm:-translate-x-6"></div>

        {qrData ? (
          <div className="text-center relative z-10">
            <div
              ref={qrContainerRef}
              className="flex justify-center mb-4 sm:mb-6 max-w-full overflow-hidden"
            >
              {/* QR code will be dynamically inserted here */}
            </div>
            <p className="text-sm sm:text-base text-slate-700 font-semibold drop-shadow-sm">
              {t("scanQrCode")}
            </p>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 md:py-20 relative z-10">
            <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 mx-auto mb-4 sm:mb-6 drop-shadow-sm" />
            <p className="text-slate-500 font-medium text-base sm:text-lg">
              {t("fillFormPrompt")}
            </p>
          </div>
        )}
      </div>

      {qrData && (
        <div className="w-full">
          <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-2 sm:mb-4 tracking-wide">
            {t("qrCodeData")}
          </h3>
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-slate-700 max-h-32 sm:max-h-40 overflow-y-auto shadow-inner border-2 border-white/50">
            <pre className="whitespace-pre-wrap break-words font-mono leading-relaxed">
              {qrData}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
