import React from "react";
import { Tab, TabType } from "../types";

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: TabType;
  onTabChange: (tabId: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b-2 border-orange-100/50 bg-gradient-to-r from-rose-50/50 to-amber-50/50 backdrop-blur-sm">
      <nav className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-6 text-base font-bold transition-all duration-300 transform ${
                activeTab === tab.id
                  ? "text-orange-600 border-b-4 border-orange-500 bg-gradient-to-t from-orange-50 to-white scale-105 shadow-lg"
                  : "text-slate-600 hover:text-orange-600 hover:bg-gradient-to-t hover:from-orange-25 hover:to-white/50 hover:scale-102"
              }`}
            >
              <IconComponent
                className={`w-5 h-5 ${
                  activeTab === tab.id ? "drop-shadow-sm" : ""
                }`}
              />
              <span className="tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
