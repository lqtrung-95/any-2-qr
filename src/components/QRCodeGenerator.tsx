import React, { useState, useEffect } from "react";
import { QrCode, Link, MessageSquare, User } from "lucide-react";
import { TabNavigation } from "./TabNavigation";
import { URLInput } from "./URLInput";
import { TextInput } from "./TextInput";
import { ContactInput } from "./ContactInput";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { ActionButtons } from "./ActionButtons";
import { useTranslation } from "../hooks/useTranslation";
import { useQRCode } from "../hooks/useQRCode";
import { formatUrl, generateVCard } from "../utils/qrUtils";
import { ContactInfo, Tab, TabType } from "../types";

const QRCodeGenerator: React.FC = () => {
  const { t } = useTranslation();
  const { qrContainerRef, generateQRCode, downloadQRCode, clearQRCode } =
    useQRCode();

  const [activeTab, setActiveTab] = useState<TabType>("url");
  const [qrData, setQrData] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    organization: "",
    url: "",
  });

  const tabs: Tab[] = [
    { id: "url", label: t("urlTab"), icon: Link },
    { id: "text", label: t("textTab"), icon: MessageSquare },
    { id: "contact", label: t("contactTab"), icon: User },
  ];

  useEffect(() => {
    let data = "";

    switch (activeTab) {
      case "url":
        data = formatUrl(urlInput);
        break;
      case "text":
        data = textInput;
        break;
      case "contact":
        if (
          contactInfo.firstName ||
          contactInfo.lastName ||
          contactInfo.phone ||
          contactInfo.email
        ) {
          data = generateVCard(contactInfo);
        }
        break;
      default:
        data = "";
    }

    setQrData(data);
    generateQRCode(data, t("qrCodeAlt"));
  }, [activeTab, urlInput, textInput, contactInfo, generateQRCode, t]);

  const handleDownload = () => {
    downloadQRCode(`qr-code-${activeTab}`);
  };

  const handleCopy = async (): Promise<void> => {
    if (qrData) {
      await navigator.clipboard.writeText(qrData);
    }
  };

  const resetForm = () => {
    setUrlInput("");
    setTextInput("");
    setContactInfo({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      organization: "",
      url: "",
    });
    setQrData("");
    clearQRCode();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "url":
        return <URLInput value={urlInput} onChange={setUrlInput} />;
      case "text":
        return <TextInput value={textInput} onChange={setTextInput} />;
      case "contact":
        return (
          <ContactInput contactInfo={contactInfo} onChange={setContactInfo} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {t("appTitle")}
          </h1>
          <p className="text-gray-600 text-lg">{t("appDescription")}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {activeTab === "url" && t("enterUrl")}
                  {activeTab === "text" && t("enterText")}
                  {activeTab === "contact" && t("contactInformation")}
                </h2>

                {renderTabContent()}

                <button
                  onClick={resetForm}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  {t("clearAllFields")}
                </button>
              </div>

              {/* QR Code Display Section */}
              <div>
                <QRCodeDisplay
                  qrData={qrData}
                  qrContainerRef={qrContainerRef}
                />
                <div className="flex justify-center mt-6">
                  <ActionButtons
                    qrData={qrData}
                    onDownload={handleDownload}
                    onCopy={handleCopy}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>{t("footerText")}</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
