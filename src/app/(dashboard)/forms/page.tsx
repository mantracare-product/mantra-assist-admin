"use client";

import React, { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pill } from "@/components/ui/Pill";
import { useIndustryTemplateStore } from "@/lib/industry-template-store";
import { FormTemplate } from "@/lib/types/industry-templates";
import { WebFormBuilderModal } from "@/components/industry-templates/WebFormBuilderModal";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  Stethoscope,
  Activity,
  Scale,
  Home,
  Wrench,
  Car,
  Cpu,
  Briefcase,
  Menu,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function FormsPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { allForms, saveFormTemplate, deleteFormTemplate, bundles } = useIndustryTemplateStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuFormId, setActiveMenuFormId] = useState<string | null>(null);

  // Form Builder Modal State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);

  const getIndustryIcon = (industryName?: string) => {
    switch (industryName) {
      case "Dental Practice":
        return <Stethoscope className="w-3.5 h-3.5 text-rose-500" />;
      case "Cardiology Specialist":
        return <Activity className="w-3.5 h-3.5 text-red-500" />;
      case "Personal Injury Law":
        return <Scale className="w-3.5 h-3.5 text-purple-500" />;
      case "Residential Real Estate":
        return <Home className="w-3.5 h-3.5 text-emerald-500" />;
      case "HVAC & Home Services":
        return <Wrench className="w-3.5 h-3.5 text-orange-500" />;
      case "Auto Dealership & Service":
        return <Car className="w-3.5 h-3.5 text-amber-500" />;
      case "SaaS / IT Consulting":
        return <Cpu className="w-3.5 h-3.5 text-blue-500" />;
      case "Executive Coaching":
        return <Sparkles className="w-3.5 h-3.5 text-pink-500" />;
      default:
        return <Briefcase className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  // Filtered forms
  const filteredForms = useMemo(() => {
    return allForms.filter((f) => {
      const matchSearch =
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.industryName && f.industryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [allForms, searchQuery]);

  const handleOpenCreateForm = () => {
    const newForm: FormTemplate = {
      id: `form-${Date.now()}`,
      industryId: bundles[0]?.id || "ind-general",
      industryName: bundles[0]?.industryName || "General / Universal",
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

        {/* Form Templates Data Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/50 backdrop-blur-md shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-[#181e25] to-[#2c3e50] text-white">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-left w-[42%]">
                    Form Title
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-left w-[25%]">
                    Assigned Industry
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[13%]">
                    Sections
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[10%]">
                    Total Fields
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[10%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredForms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm">
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
                        {/* 1. Form Title (Clean title only, no description) */}
                        <td className="px-5 py-4 align-middle">
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
                        </td>

                        {/* 2. Assigned Industry (Styled badge component) */}
                        <td className="px-4 py-4 align-middle">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50/90 text-[#1456f0] border border-blue-200/60 shadow-2xs">
                            {getIndustryIcon(form.industryName)}
                            <span className="truncate">{form.industryName || "General / Universal"}</span>
                          </span>
                        </td>

                        {/* 3. Sections */}
                        <td className="px-4 py-4 align-middle text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 text-[#181e25] border border-slate-200/80 font-semibold text-xs">
                            <Layers className="w-3.5 h-3.5 text-[#1456f0]" />
                            {form.sections.length} Sections
                          </span>
                        </td>

                        {/* 4. Total Fields */}
                        <td className="px-4 py-4 align-middle text-center">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200/60">
                            {totalFields} Fields
                          </span>
                        </td>

                        {/* 5. Actions (Hamburger Dropdown) */}
                        <td className="px-4 py-4 align-middle text-center">
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuFormId(
                                  activeMenuFormId === form.id ? null : form.id
                                )
                              }
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                activeMenuFormId === form.id
                                  ? "bg-[#1456f0] text-white shadow-xs"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#181e25]"
                              }`}
                              title="Form Actions"
                            >
                              <Menu className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuFormId === form.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setActiveMenuFormId(null)}
                                />
                                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5 text-left">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedForm(form);
                                      setIsBuilderOpen(true);
                                      setActiveMenuFormId(null);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#1456f0] hover:bg-blue-50/80 rounded-xl transition-all text-left cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-[#1456f0]" />
                                    <span>Edit Form</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const duplicated: FormTemplate = {
                                        ...form,
                                        id: `form-${Date.now()}`,
                                        title: `${form.title} (Copy)`,
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString(),
                                      };
                                      saveFormTemplate(duplicated);
                                      setActiveMenuFormId(null);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#1456f0] hover:bg-blue-50/80 rounded-xl transition-all text-left cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Duplicate</span>
                                  </button>

                                  <div className="h-[1px] bg-slate-100 my-1" />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuFormId(null);
                                      if (confirm(`Delete form template "${form.title}"?`)) {
                                        deleteFormTemplate(form.id);
                                      }
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-left cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Delete Form</span>
                                  </button>
                                </div>
                              </>
                            )}
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
