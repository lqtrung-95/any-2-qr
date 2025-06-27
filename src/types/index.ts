export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  url: string;
}

import { ComponentType } from "react";

export interface Tab {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export type TabType = "url" | "text" | "contact";

export interface Translation {
  appTitle: string;
  appDescription: string;
  urlTab: string;
  textTab: string;
  contactTab: string;
  enterUrl: string;
  enterText: string;
  contactInformation: string;
  websiteUrl: string;
  urlPlaceholder: string;
  urlHelp: string;
  textContent: string;
  textPlaceholder: string;
  firstName: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNamePlaceholder: string;
  phoneNumber: string;
  phonePlaceholder: string;
  emailAddress: string;
  emailPlaceholder: string;
  organization: string;
  organizationPlaceholder: string;
  website: string;
  websitePlaceholder: string;
  clearAllFields: string;
  generatedQrCode: string;
  scanQrCode: string;
  fillFormPrompt: string;
  download: string;
  copyData: string;
  copied: string;
  qrCodeData: string;
  footerText: string;
  qrCodeAlt: string;
  customization: string;
  foregroundColor: string;
  backgroundColor: string;
  addLogo: string;
  logoSize: string;
  uploadLogo: string;
  removeLogo: string;
  colorAndLogo: string;
  customizeQR: string;
  hideCustomization: string;
  showCustomization: string;
}

export type Locale = "en-US" | "es-ES";

export interface Translations {
  [key: string]: Translation;
}

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  logoFile: File | null;
  logoSize: number; // percentage of QR code size
}
