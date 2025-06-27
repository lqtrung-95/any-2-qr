import React, { useRef } from "react";
import { Upload, X, Palette } from "lucide-react";
import { QRCustomization } from "../types";
import { useTranslation } from "../hooks/useTranslation";

interface QRCustomizationProps {
  customization: QRCustomization;
  onChange: (customization: QRCustomization) => void;
}

export const QRCustomizationComponent: React.FC<QRCustomizationProps> = ({
  customization,
  onChange,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onChange({
        ...customization,
        logoFile: file,
      });
    }
  };

  const removeLogo = () => {
    onChange({
      ...customization,
      logoFile: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleColorChange = (
    field: "foregroundColor" | "backgroundColor",
    color: string
  ) => {
    onChange({
      ...customization,
      [field]: color,
    });
  };

  const handleLogoSizeChange = (size: number) => {
    onChange({
      ...customization,
      logoSize: size,
    });
  };

  return (
    <div className="space-y-6">
      {/* Color Pickers */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3 tracking-wide">
            <Palette className="w-5 h-5 inline mr-2" />
            {t("foregroundColor")}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customization.foregroundColor}
              onChange={(e) =>
                handleColorChange("foregroundColor", e.target.value)
              }
              className="w-16 h-12 rounded-xl border-2 border-orange-200 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            />
            <div
              className="flex-1 h-12 rounded-xl border-2 border-orange-200 shadow-inner"
              style={{ backgroundColor: customization.foregroundColor }}
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3 tracking-wide">
            <Palette className="w-5 h-5 inline mr-2" />
            {t("backgroundColor")}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customization.backgroundColor}
              onChange={(e) =>
                handleColorChange("backgroundColor", e.target.value)
              }
              className="w-16 h-12 rounded-xl border-2 border-orange-200 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            />
            <div
              className="flex-1 h-12 rounded-xl border-2 border-orange-200 shadow-inner"
              style={{ backgroundColor: customization.backgroundColor }}
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-lg font-bold text-slate-700 mb-3 tracking-wide">
          <Upload className="w-5 h-5 inline mr-2" />
          {t("addLogo")}
        </label>

        {!customization.logoFile ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-6 py-4 border-2 border-dashed border-orange-300 rounded-2xl text-slate-600 hover:border-orange-400 hover:text-orange-600 transition-all duration-300 bg-gradient-to-r from-orange-25 to-amber-25 hover:from-orange-50 hover:to-amber-50 transform hover:scale-102 font-semibold"
            >
              <Upload className="w-6 h-6 mx-auto mb-2" />
              {t("uploadLogo")}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg border-2 border-emerald-200 flex items-center justify-center overflow-hidden">
              <img
                src={URL.createObjectURL(customization.logoFile)}
                alt="Logo preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-700">
                {customization.logoFile.name}
              </p>
              <p className="text-sm text-slate-500">
                {Math.round(customization.logoFile.size / 1024)}KB
              </p>
            </div>
            <button
              onClick={removeLogo}
              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Logo Size Slider */}
      {customization.logoFile && (
        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3 tracking-wide">
            {t("logoSize")}: {customization.logoSize}%
          </label>
          <input
            type="range"
            min="10"
            max="30"
            value={customization.logoSize}
            onChange={(e) => handleLogoSizeChange(Number(e.target.value))}
            className="w-full h-3 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #fed7aa 0%, #fde68a ${
                customization.logoSize * 3.33
              }%, #e5e7eb ${customization.logoSize * 3.33}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-sm text-slate-500 mt-1">
            <span>10%</span>
            <span>30%</span>
          </div>
        </div>
      )}
    </div>
  );
};
