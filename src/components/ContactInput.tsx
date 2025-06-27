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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("firstName")}
          </label>
          <input
            type="text"
            value={contactInfo.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder={t("firstNamePlaceholder")}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("lastName")}
          </label>
          <input
            type="text"
            value={contactInfo.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder={t("lastNamePlaceholder")}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("phoneNumber")}
        </label>
        <input
          type="tel"
          value={contactInfo.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder={t("phonePlaceholder")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("emailAddress")}
        </label>
        <input
          type="email"
          value={contactInfo.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder={t("emailPlaceholder")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("organization")}
        </label>
        <input
          type="text"
          value={contactInfo.organization}
          onChange={(e) => handleChange("organization", e.target.value)}
          placeholder={t("organizationPlaceholder")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("website")}
        </label>
        <input
          type="url"
          value={contactInfo.url}
          onChange={(e) => handleChange("url", e.target.value)}
          placeholder={t("websitePlaceholder")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  );
};
