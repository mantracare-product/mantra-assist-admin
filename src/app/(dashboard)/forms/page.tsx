"use client";

import React, { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pill } from "@/components/ui/Pill";
import { useIndustryTemplateStore } from "@/lib/industry-template-store";
import { FormTemplate } from "@/lib/types/industry-templates";
import { WebFormBuilderModal } from "@/components/industry-templates/WebFormBuilderModal";
import {
  CheckSquare,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Layers,
  Sparkles,
  Tag,
  Clock,
} from "lucide-react";

export default function FormsPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { allForms, saveFormTemplate, deleteFormTemplate, bundles } = useIndustryTemplateStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  // Form Builder Modal State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);

  // Filtered forms
  const filteredForms = useMemo(() => {
    return allForms.filter((f) => {
      const matchCat =
        selectedCategoryFilter === "All" || f.category === selectedCategoryFilter;
      const matchSearch =
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.industryName && f.industryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allForms, selectedCategoryFilter, searchQuery]);

  const handleOpenCreateForm = () => {
    const newForm: FormTemplate = {
      id: `form-${Date.now()}`,
      industryId: bundles[0]?.id || "ind-general",
      industryName: bundles[0]?.industryName || "General",
      title: "New Client Intake Form",
      category: "intake",
      description: "Capture client information and schedule consultation.",
      estimatedMinutes: 3,
      submitButtonText: "Submit Registration",
      successMessage: "Thank you for submitting your intake form!",
      autoCreateClient: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: `sec-1`,
          title: "Personal Information",
          fields: [
            {
              id: `f-1`,
              label: "Full Name",
              name: "full_name",
              type: "text",
              isRequired: true,
            },
            {
              id: `f-2`,
              label: "Phone Number",
              name: "phone",
              type: "phone",
              isRequired: true,
            },
            {
              id: `f-3`,
              label: "Email Address",
              name: "email",
              type: "email",
              isRequired: true,
            },
          ],
        },
      ],
    };
    setSelectedForm(newForm);
    setIsBuilderOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <TopBar
        title="Web Form Blueprints"
        subtitle="Design dynamic customer intake questionnaires, booking forms, and qualification surveys mapped to industry starter packs."
        showFilters={false}
        onMenuToggle={onMenuToggle}
      />

      {/* Main Glass Workspace */}
      <GlassCard variant="default" rounded="3xl" padding="lg" className="space-y-6">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search web forms by title or industry..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl placeholder:text-slate-400 text-[#222222] shadow-xs outline-none focus:ring-2 focus:ring-[#1456f0]/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <Pill
              variant="navy"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreateForm}
            >
              Build New Form
            </Pill>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {["All", "intake", "lead_capture", "booking", "quote", "feedback"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border ${
                selectedCategoryFilter === cat
                  ? "bg-[#1456f0] text-white border-transparent shadow-xs"
                  : "bg-white/80 hover:bg-white text-slate-600 border-slate-200/80"
              }`}
            >
              {cat === "All" ? "All Categories" : cat.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Form Templates Data Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/50 backdrop-blur-md shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-[#181e25] to-[#2c3e50] text-white">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-left w-[32%]">
                    Form Title & Industry
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-left w-[18%]">
                    Category / Intent
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[14%]">
                    Sections
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[12%]">
                    Est. Time
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[12%]">
                    Total Fields
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[12%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredForms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">
                      No form templates match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredForms.map((form) => {
                    const totalFields = form.sections.reduce((acc, s) => acc + s.fields.length, 0);

                    return (
                      <tr
                        key={form.id}
                        className="hover:bg-white/80 transition-colors duration-150 group"
                      >
                        {/* 1. Form Title & Industry */}
                        <td className="px-5 py-4 align-middle">
                          <div className="space-y-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedForm(form);
                                setIsBuilderOpen(true);
                              }}
                              className="font-bold text-sm text-[#181e25] hover:text-[#1456f0] transition-colors text-left group-hover:underline block truncate"
                            >
                              {form.title}
                            </button>
                            {form.industryName && (
                              <span className="text-[11px] text-slate-400 font-semibold block truncate">
                                {form.industryName}
                              </span>
                            )}
                            <p className="text-xs text-slate-500 line-clamp-1">{form.description}</p>
                          </div>
                        </td>

                        {/* 2. Category / Intent */}
                        <td className="px-4 py-4 align-middle">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50/90 text-[#1456f0] border border-blue-200/70 font-semibold text-xs shadow-2xs uppercase">
                            {form.category.replace(/_/g, " ")}
                          </span>
                        </td>

                        {/* 3. Sections */}
                        <td className="px-4 py-4 align-middle text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 text-[#181e25] border border-slate-200/80 font-semibold text-xs">
                            <Layers className="w-3.5 h-3.5 text-[#1456f0]" />
                            {form.sections.length} Sections
                          </span>
                        </td>

                        {/* 4. Est. Time */}
                        <td className="px-4 py-4 align-middle text-center">
                          <span className="text-xs text-slate-600 font-mono font-semibold">
                            ~{form.estimatedMinutes} mins
                          </span>
                        </td>

                        {/* 5. Total Fields */}
                        <td className="px-4 py-4 align-middle text-center">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200/60">
                            {totalFields} Fields
                          </span>
                        </td>

                        {/* 6. Actions */}
                        <td className="px-4 py-4 align-middle text-center">
                          <div className="inline-flex items-center justify-center gap-1.5 bg-white/80 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedForm(form);
                                setIsBuilderOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-[#1456f0] hover:bg-blue-50 transition-colors"
                              title="Open Visual Form Canvas"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete form template "${form.title}"?`)) {
                                  deleteFormTemplate(form.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Form"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

      {/* Visual Form Builder Modal */}
      {isBuilderOpen && selectedForm && (
        <WebFormBuilderModal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          form={selectedForm}
          onSave={(saved) => saveFormTemplate(saved)}
        />
      )}
    </div>
  );
}
