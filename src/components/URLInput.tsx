import React from "react";
import { useTranslation } from "../hooks/useTranslation";

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const URLInput: React.FC<URLInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("websiteUrl")}
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("urlPlaceholder")}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
      />
      <p className="text-xs text-gray-500 mt-1">{t("urlHelp")}</p>
    </div>
  );
};
