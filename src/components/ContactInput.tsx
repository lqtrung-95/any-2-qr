import React from "react";
import { ContactInfo } from "../types";
import { useTranslation } from "../hooks/useTranslation";

interface ContactInputProps {
  contactInfo: ContactInfo;
  onChange: (contactInfo: ContactInfo) => void;
}

export const ContactInput: React.FC<ContactInputProps> = ({
  contactInfo,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof ContactInfo, value: string) => {
    onChange({
      ...contactInfo,
      [field]: value,
    });
  };

  const inputClassName =
    "w-full px-6 py-4 border-2 border-orange-200 rounded-2xl focus:ring-4 focus:ring-orange-300/50 focus:border-orange-400 transition-all duration-300 bg-gradient-to-r from-white to-orange-50/30 text-lg font-medium placeholder-slate-400 shadow-lg focus:shadow-xl transform focus:scale-102";
  const labelClassName =
    "block text-lg font-bold text-slate-700 mb-3 tracking-wide";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClassName}>{t("firstName")}</label>
          <input
            type="text"
            value={contactInfo.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder={t("firstNamePlaceholder")}
            className={inputClassName}
          />
        </div>
        <div>
          <label className={labelClassName}>{t("lastName")}</label>
          <input
            type="text"
            value={contactInfo.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder={t("lastNamePlaceholder")}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className={labelClassName}>{t("phoneNumber")}</label>
        <input
          type="tel"
          value={contactInfo.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder={t("phonePlaceholder")}
          className={inputClassName}
        />
      </div>

      <div>
        <label className={labelClassName}>{t("emailAddress")}</label>
        <input
          type="email"
          value={contactInfo.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder={t("emailPlaceholder")}
          className={inputClassName}
        />
      </div>

      <div>
        <label className={labelClassName}>{t("organization")}</label>
        <input
          type="text"
          value={contactInfo.organization}
          onChange={(e) => handleChange("organization", e.target.value)}
          placeholder={t("organizationPlaceholder")}
          className={inputClassName}
        />
      </div>

      <div>
        <label className={labelClassName}>{t("website")}</label>
        <input
          type="url"
          value={contactInfo.url}
          onChange={(e) => handleChange("url", e.target.value)}
          placeholder={t("websitePlaceholder")}
          className={inputClassName}
        />
      </div>
    </div>
  );
};
