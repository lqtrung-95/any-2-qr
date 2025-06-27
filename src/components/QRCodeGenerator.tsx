import React, { useState, useEffect } from "react";
import {
  QrCode,
  Link,
  MessageSquare,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TabNavigation } from "./TabNavigation";
import { URLInput } from "./URLInput";
import { TextInput } from "./TextInput";
import { ContactInput } from "./ContactInput";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { ActionButtons } from "./ActionButtons";
import { QRCustomizationComponent } from "./QRCustomization";
import { useTranslation } from "../hooks/useTranslation";
import { useQRCode } from "../hooks/useQRCode";
import { formatUrl, generateVCard } from "../utils/qrUtils";
import { ContactInfo, Tab, TabType, QRCustomization } from "../types";

const QRCodeGenerator: React.FC = () => {
  const { t } = useTranslation();
  const { qrContainerRef, generateQRCode, downloadQRCode, clearQRCode } =
    useQRCode();

  const [activeTab, setActiveTab] = useState<TabType>("url");
  const [qrData, setQrData] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(true);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    organization: "",
    url: "",
  });
  const [customization, setCustomization] = useState<QRCustomization>({
    foregroundColor: "#000000",
    backgroundColor: "#ffffff",
    logoFile: null,
    logoSize: 20,
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
    generateQRCode(data, t("qrCodeAlt"), customization);
  }, [
    activeTab,
    urlInput,
    textInput,
    contactInfo,
    customization,
    generateQRCode,
    t,
  ]);

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
    setCustomization({
      foregroundColor: "#000000",
      backgroundColor: "#ffffff",
      logoFile: null,
      logoSize: 20,
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-100 p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/30 to-amber-100/30"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-4 h-4 bg-rose-300/20 rounded-full absolute top-20 left-20 animate-pulse"></div>
          <div className="w-6 h-6 bg-orange-300/20 rounded-full absolute top-40 right-32 animate-pulse delay-1000"></div>
          <div className="w-3 h-3 bg-amber-300/20 rounded-full absolute bottom-32 left-40 animate-pulse delay-2000"></div>
          <div className="w-5 h-5 bg-rose-300/20 rounded-full absolute bottom-20 right-20 animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 rounded-[1.5rem] mb-8 shadow-2xl shadow-orange-200/50 transform hover:scale-110 hover:rotate-3 transition-all duration-500">
            <QrCode className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-7xl lg:text-8xl font-black bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-6 tracking-tighter leading-none">
            {t("appTitle")}
          </h1>
          <p className="text-slate-700 text-2xl font-semibold max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            {t("appDescription")}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-orange-200/30 overflow-hidden border-2 border-white/50 relative">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>

          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-10 lg:p-12">
            <div className="flex gap-8">
              {/* Main Content Area */}
              <div
                className={`flex-1 transition-all duration-300 ${
                  isCustomizationOpen ? "lg:mr-80" : ""
                }`}
              >
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Input Section */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">
                        {activeTab === "url" && t("enterUrl")}
                        {activeTab === "text" && t("enterText")}
                        {activeTab === "contact" && t("contactInformation")}
                      </h2>

                      {/* Customization Toggle */}
                      <button
                        onClick={() =>
                          setIsCustomizationOpen(!isCustomizationOpen)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-xl hover:from-orange-200 hover:to-amber-200 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">{t("customizeQR")}</span>
                        {isCustomizationOpen ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronLeft className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {renderTabContent()}

                    <button
                      onClick={resetForm}
                      className="w-full px-8 py-4 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-2xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                    <div className="flex justify-center mt-8">
                      <ActionButtons
                        qrData={qrData}
                        onDownload={handleDownload}
                        onCopy={handleCopy}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Customization Panel */}
              <div
                className={`fixed right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-lg border-l-2 border-orange-100/50 shadow-2xl transform transition-all duration-300 z-50 ${
                  isCustomizationOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="p-6 h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                      {t("customization")}
                    </h3>
                    <button
                      onClick={() => setIsCustomizationOpen(false)}
                      className="p-2 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  <QRCustomizationComponent
                    customization={customization}
                    onChange={setCustomization}
                  />
                </div>
              </div>

              {/* Overlay when panel is open on mobile */}
              {isCustomizationOpen && (
                <div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setIsCustomizationOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-16 text-slate-600 text-lg">
          <p className="font-semibold drop-shadow-sm">{t("footerText")}</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
