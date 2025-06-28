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
    <div className="w-full flex-1 bg-gradient-to-b from-rose-50/50 to-amber-50/50 backdrop-blur-sm border-r-2 border-orange-100/50">
      <nav className="flex flex-col h-full">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`flex items-center gap-4 px-6 py-8 text-left font-bold transition-all duration-300 transform ${
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
              <span className="tracking-wide text-lg">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
