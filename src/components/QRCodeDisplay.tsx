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
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {t("generatedQrCode")}
      </h2>

      <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-sm">
        {qrData ? (
          <div className="text-center">
            <div ref={qrContainerRef} className="flex justify-center">
              {/* QR code will be dynamically inserted here */}
            </div>
            <p className="text-sm text-gray-600 mt-4">{t("scanQrCode")}</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t("fillFormPrompt")}</p>
          </div>
        )}
      </div>

      {qrData && (
        <div className="w-full max-w-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {t("qrCodeData")}
          </h3>
          <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap break-words">{qrData}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
