import React, { useState, useEffect } from "react";
import {
  QrCode,
  Link,
  MessageSquare,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
// import { TabNavigation } from "./TabNavigation"; // No longer needed - integrated directly
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
import LanguageSelector from "./LanguageSelector";

const QRCodeGenerator: React.FC = () => {
  const { t } = useTranslation();
  const { qrContainerRef, generateQRCode, downloadQRCode, clearQRCode } =
    useQRCode();

  const [activeTab, setActiveTab] = useState<TabType>("url");
  const [qrData, setQrData] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

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

  // Device detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen));
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Decode URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");

    if (q) {
      try {
        const decodedParam = atob(q);
        const { type, data } = JSON.parse(decodedParam);

        if (type && data) {
          setActiveTab(type);

          if (type === "url") {
            setUrlInput(data);
          } else if (type === "text") {
            setTextInput(data);
          } else if (type === "contact") {
            // Simplistic vCard parsing - assumes specific order/format
            const lines = data.split("\n");
            const contact: ContactInfo = {
              firstName: "",
              lastName: "",
              phone: "",
              email: "",
              organization: "",
              url: "",
            };
            lines.forEach((line: string) => {
              if (line.startsWith("FN:")) contact.firstName = line.substring(3);
              if (line.startsWith("TEL:")) contact.phone = line.substring(4);
              if (line.startsWith("EMAIL:")) contact.email = line.substring(6);
              if (line.startsWith("ORG:"))
                contact.organization = line.substring(4);
              if (line.startsWith("URL:")) contact.url = line.substring(4);
            });
            setContactInfo(contact);
          }
        }
      } catch (error) {
        console.error("Failed to parse q:", error);
      }
    }
  }, []);

  // Encode data to URL params
  useEffect(() => {
    const newUrl = new URL(window.location.href);
    if (qrData) {
      const dataToEncode = JSON.stringify({ type: activeTab, data: qrData });
      const encodedData = btoa(dataToEncode);
      newUrl.searchParams.set("q", encodedData);
    } else {
      newUrl.searchParams.delete("q");
    }
    window.history.pushState({}, "", newUrl);
  }, [qrData, activeTab]);

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
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleShare = async (): Promise<void> => {
    if (!qrData) return;

    const shareUrl = window.location.href;

    // On mobile devices, use native share with image
    if (isMobile && navigator.share) {
      try {
        const canvas = qrContainerRef.current?.querySelector("canvas");
        if (canvas) {
          canvas.toBlob(async (blob) => {
            try {
              if (blob && navigator.canShare) {
                const file = new File([blob], `qr-code-${activeTab}.png`, {
                  type: "image/png",
                });

                // only share image if it supports sharing files
                const shareData = {
                  title: t("shareQR"),
                  text: t("shareQR"),
                  files: [file],
                };

                // Check if we can share files
                if (navigator.canShare(shareData)) {
                  await navigator.share(shareData);
                  return;
                }
              }

              // Fallback to sharing just text if file sharing isn't supported
              await navigator.share({
                title: t("shareQR"),
                text: t("shareQR"),
                url: shareUrl,
              });
            } catch (shareError: any) {
              // Don't throw error if user just canceled the share
              if (shareError.name === "AbortError") {
                return; // User canceled, this is normal
              }
              // For other errors, fallback to clipboard
              await navigator.clipboard.writeText(shareUrl);
            }
          }, "image/png");
        } else {
          // No canvas, share text only
          await navigator.share({
            title: t("shareQR"),
            text: t("shareQR"),
            url: shareUrl,
          });
        }
      } catch (error: any) {
        // Don't show error if user just canceled
        if (error.name === "AbortError") {
          return;
        }
        // Final fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
      }
    } else {
      // On desktop, just copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
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
        <div className="absolute top-4 right-4 z-20 md:top-6 md:right-6">
          <LanguageSelector />
        </div>
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 rounded-[1rem] sm:rounded-[1.25rem] md:rounded-[1.5rem] mb-4 sm:mb-6 md:mb-8 shadow-xl sm:shadow-2xl shadow-orange-200/50 transform hover:scale-110 hover:rotate-3 transition-all duration-500">
            <QrCode className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6 tracking-tighter leading-none">
            {t("appTitle")}
          </h1>
          <p className="text-slate-700 text-lg sm:text-xl md:text-2xl font-semibold max-w-3xl mx-auto leading-relaxed drop-shadow-sm px-4">
            {t("appDescription")}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-orange-200/30 overflow-hidden border-2 border-white/50 relative min-h-[700px]">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>

          <div className="flex h-full">
            {/* Vertical Sidebar with Tabs */}
            <div className="w-16 lg:w-64 h-full transition-all duration-300">
              <div className="h-full bg-gradient-to-b from-rose-50/50 to-amber-50/50 backdrop-blur-sm border-r-2 border-orange-100/50">
                <nav className="flex flex-col pt-8">
                  {/* Content Tabs */}
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center justify-center lg:justify-start px-4 py-6 lg:px-6 lg:py-6 transition-all duration-300 transform font-bold ${
                          activeTab === tab.id
                            ? "text-orange-600 border-r-4 border-orange-500 bg-gradient-to-r from-orange-50 to-white scale-105 shadow-lg"
                            : "text-slate-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-25 hover:to-white/50 hover:scale-102"
                        }`}
                      >
                        <IconComponent
                          className={`w-6 h-6 ${
                            activeTab === tab.id ? "drop-shadow-sm" : ""
                          }`}
                        />
                        <span className="hidden lg:block ml-4 tracking-wide text-lg">
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}

                  {/* Divider */}
                  <div className="my-4 border-t border-orange-200/50 mx-4 lg:mx-6"></div>

                  {/* Customization Toggle - Special styling */}
                  <button
                    onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
                    className={`relative flex items-center justify-center lg:justify-start px-4 py-6 lg:px-6 lg:py-6 font-bold transition-all duration-300 transform overflow-hidden ${
                      isCustomizationOpen
                        ? "text-white border-r-4 border-orange-500 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 scale-105 shadow-xl"
                        : "text-orange-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-400 hover:via-orange-500 hover:to-amber-500 hover:scale-102 bg-gradient-to-r from-orange-100/80 to-amber-100/80 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {/* Subtle pattern overlay for extra flair */}
                    <div
                      className={`absolute inset-0 opacity-10 ${
                        isCustomizationOpen ? "bg-white" : "bg-orange-200"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                    </div>

                    <Settings
                      className={`w-6 h-6 relative z-10 ${
                        isCustomizationOpen
                          ? "drop-shadow-sm animate-pulse"
                          : ""
                      }`}
                    />
                    <span className="hidden lg:block ml-4 tracking-wide text-lg relative z-10">
                      {t("customization")}
                    </span>
                    <div className="hidden lg:block ml-auto relative z-10">
                      {isCustomizationOpen ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronLeft className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 transition-all duration-300">
              <div
                className={`p-4 sm:p-6 md:p-8 lg:p-12 transition-all duration-300 ${
                  isCustomizationOpen ? "lg:pr-[21rem]" : ""
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                  {/* Input Section */}
                  <div className="space-y-6 md:space-y-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6 tracking-tight">
                      {activeTab === "url" && t("enterUrl")}
                      {activeTab === "text" && t("enterText")}
                      {activeTab === "contact" && t("contactInformation")}
                    </h2>

                    {renderTabContent()}

                    <button
                      onClick={resetForm}
                      className="w-full px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-xl sm:rounded-2xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {t("clearAllFields")}
                    </button>
                  </div>

                  {/* QR Code Display Section */}
                  <div className="flex flex-col items-center">
                    <QRCodeDisplay
                      qrData={qrData}
                      qrContainerRef={qrContainerRef}
                    />
                    {/* Action Buttons - Back inside QR section for proper positioning */}
                    <div className="flex justify-center w-full mt-6 sm:mt-8">
                      <ActionButtons
                        qrData={qrData}
                        qrContainerRef={qrContainerRef}
                        onDownload={handleDownload}
                        onCopy={handleCopy}
                        onNativeShare={handleShare}
                        isMobile={isMobile}
                      />
                    </div>
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

        <div className="text-center mt-16 text-slate-600 text-lg">
          <p className="font-semibold drop-shadow-sm">{t("footerText")}</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
