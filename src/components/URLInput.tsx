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
      <label className="block text-lg font-bold text-slate-700 mb-4 tracking-wide">
        {t("websiteUrl")}
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("urlPlaceholder")}
        className="w-full px-6 py-4 border-2 border-orange-200 rounded-2xl focus:ring-4 focus:ring-orange-300/50 focus:border-orange-400 transition-all duration-300 bg-gradient-to-r from-white to-orange-50/30 text-lg font-medium placeholder-slate-400 shadow-lg focus:shadow-xl transform focus:scale-102"
      />
      <p className="text-sm text-slate-600 mt-3 font-medium">{t("urlHelp")}</p>
    </div>
  );
};
