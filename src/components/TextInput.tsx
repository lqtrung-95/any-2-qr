import React from "react";
import { useTranslation } from "../hooks/useTranslation";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-lg font-bold text-slate-700 mb-4 tracking-wide">
        {t("textContent")}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("textPlaceholder")}
        rows={5}
        className="w-full px-6 py-4 border-2 border-orange-200 rounded-2xl focus:ring-4 focus:ring-orange-300/50 focus:border-orange-400 transition-all duration-300 bg-gradient-to-r from-white to-orange-50/30 text-lg font-medium placeholder-slate-400 shadow-lg focus:shadow-xl transform focus:scale-102 resize-none"
      />
    </div>
  );
};
