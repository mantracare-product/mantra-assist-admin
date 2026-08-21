"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  IndustryStarterBundle,
  ProcessTemplate,
  StageTemplate,
} from "@/lib/types/industry-templates";
import { useIndustryTemplateStore } from "@/lib/industry-template-store";
import { ProcessTemplateEditor } from "./ProcessTemplateEditor";
import {
  X,
  Save,
  Building2,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";

interface MasterBundleStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bundle: IndustryStarterBundle;
  onSave: (bundle: IndustryStarterBundle) => void;
}

export const MasterBundleStudioDrawer: React.FC<MasterBundleStudioDrawerProps> = ({
  isOpen,
  onClose,
  bundle: initialBundle,
  onSave,
}) => {
  const { bundles } = useIndustryTemplateStore();
  const [bundle, setBundle] = useState<IndustryStarterBundle>(() => {
    const existing = initialBundle.industries || (initialBundle.industryName ? [initialBundle.industryName] : []);
    return {
      ...initialBundle,
      industries: existing,
    };
  });

  // Custom Multi-Select Dropdown state
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [industrySearch, setIndustrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // All available unique industries from all bundles
  const allIndustries = useMemo(() => {
    const list = bundles.map((b) => b.industryName).filter(Boolean);
    return Array.from(new Set(list));
  }, [bundles]);

  const filteredIndustries = useMemo(() => {
    return allIndustries.filter((ind) =>
      ind.toLowerCase().includes(industrySearch.toLowerCase())
    );
  }, [allIndustries, industrySearch]);

  const selectedIndustries = bundle.industries || [bundle.industryName || "Dental Practice"];

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsIndustryDropdownOpen(false);
      }
    };
    if (isIndustryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isIndustryDropdownOpen]);

  if (!isOpen) return null;

  const handleToggleIndustry = (ind: string) => {
    const current = [...selectedIndustries];
    const exists = current.includes(ind);
    let updated: string[];

    if (exists) {
      if (current.length === 1) return; // Keep at least one
      updated = current.filter((item) => item !== ind);
    } else {
      updated = [...current, ind];
    }

    setBundle({
      ...bundle,
      industryName: updated[0] || "",
      industries: updated,
    });
  };

  const handleSave = () => {
    onSave({
      ...bundle,
      industryName: selectedIndustries.join(", "),
      industries: selectedIndustries,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Studio Drawer Canvas (75% screen width) */}
      <div className="w-full md:w-[75vw] max-w-[75vw] h-full bg-[#fafafa] shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* TOP BAR: Clean single row with Name, Description, Multi-Industry Dropdown & Actions */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0 shadow-xs">
          {/* Left: Template Name & Subtitle */}
          <div className="flex-1 min-w-0 pr-4">
            <input
              type="text"
              value={bundle.processTemplate.name}
              onChange={(e) =>
                setBundle({
                  ...bundle,
                  processTemplate: {
                    ...bundle.processTemplate,
                    name: e.target.value,
                  },
                })
              }
              placeholder="Template Name (e.g. General Template for DERMA)"
              className="font-display font-bold text-base sm:text-lg text-[#181e25] bg-transparent outline-none placeholder:text-slate-300 w-full truncate"
            />
            <input
              type="text"
              value={bundle.processTemplate.description}
              onChange={(e) =>
                setBundle({
                  ...bundle,
                  processTemplate: {
                    ...bundle.processTemplate,
                    description: e.target.value,
                  },
                })
              }
              placeholder="Brief description of this process template..."
              className="text-xs text-slate-400 bg-transparent outline-none placeholder:text-slate-300 w-full truncate"
            />
          </div>

          {/* Right: Custom Multi-Industry Dropdown & Save/Close */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Custom Multi-Select Industry Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50/90 hover:bg-blue-100/80 border border-blue-200/80 text-[#1456f0] text-xs font-bold transition-all shadow-2xs"
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[180px] truncate text-left">
                  {selectedIndustries.length === 1
                    ? selectedIndustries[0]
                    : `${selectedIndustries.length} Industries Selected`}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                    isIndustryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Floating Dropdown Menu */}
              {isIndustryDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                  <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Select Industries</span>
                    <span className="text-[#1456f0] font-mono">
                      {selectedIndustries.length} selected
                    </span>
                  </div>

                  {/* Search filter in dropdown */}
                  <div className="relative">
                    <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={industrySearch}
                      onChange={(e) => setIndustrySearch(e.target.value)}
                      placeholder="Search industries..."
                      className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-lg outline-none focus:ring-2 focus:ring-[#1456f0]/40 text-[#181e25]"
                    />
                  </div>

                  {/* Industry Options List */}
                  <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                    {filteredIndustries.map((ind) => {
                      const isChecked = selectedIndustries.includes(ind);
                      return (
                        <div
                          key={ind}
                          onClick={() => handleToggleIndustry(ind)}
                          className={`
                            flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer text-xs transition-colors
                            ${
                              isChecked
                                ? "bg-blue-50 text-[#1456f0] font-bold"
                                : "hover:bg-slate-50 text-slate-700"
                            }
                          `}
                        >
                          <span className="truncate pr-2">{ind}</span>
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              isChecked
                                ? "bg-[#1456f0] border-[#1456f0] text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181e25] hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all duration-150"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span>Save & Publish Template</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WORKSPACE BODY: Stage Configuration Manager */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <ProcessTemplateEditor
            process={bundle.processTemplate}
            onChange={(updatedProcess) =>
              setBundle({
                ...bundle,
                processTemplate: updatedProcess,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
