"use client";

import React, { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pill } from "@/components/ui/Pill";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Tag,
} from "lucide-react";

// Types
export interface IndustryCategory {
  id: string;
  idNumber: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface IndustryItem {
  id: string;
  idNumber: number;
  name: string;
  category: string;
  description: string;
  isSystemRecord: boolean;
  isActive: boolean;
}

// Initial Data matching reference screenshots
const INITIAL_CATEGORIES: IndustryCategory[] = [
  {
    id: "cat-1",
    idNumber: 8,
    name: "Automobile",
    description: "Services and workflows tied to buying, maintaining, and servicing vehicles.",
    isActive: true,
  },
  {
    id: "cat-2",
    idNumber: 6,
    name: "Coaching & Advisory",
    description:
      "Professional coaches and advisors guiding clients on personal, financial, or legal matters outside clinical care.",
    isActive: true,
  },
  {
    id: "cat-3",
    idNumber: 1,
    name: "Healthcare",
    description: "All healthcare related clinical workflows and patient care specialties.",
    isActive: true,
  },
  {
    id: "cat-4",
    idNumber: 7,
    name: "Household Care",
    description:
      "On-demand visits where a professional comes to the client's home to fix, install, clean or improve something",
    isActive: true,
  },
  {
    id: "cat-5",
    idNumber: 9,
    name: "IT/Tech",
    description: "Technical software, cloud architecture, automation, and cybersecurity consulting.",
    isActive: true,
  },
  {
    id: "cat-6",
    idNumber: 10,
    name: "Real Estate",
    description:
      "Services covering property buying, selling, renting, and the advisory work around a deal",
    isActive: true,
  },
  {
    id: "cat-7",
    idNumber: 5,
    name: "Wellness & Lifestyle",
    description:
      "Non-clinical practitioners supporting physical and lifestyle health through nutrition, fitness, yoga, and mindfulness.",
    isActive: true,
  },
];

const INITIAL_INDUSTRIES: IndustryItem[] = [
  {
    id: "ind-1",
    idNumber: 29,
    name: "Accessory/Customization",
    category: "Automobile",
    description: "Discussing add-ons or modifications.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-2",
    idNumber: 51,
    name: "AI/ML Strategy/ Model Development",
    category: "IT/Tech",
    description: "Scoping a custom AI or machine learning solution.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-3",
    idNumber: 73,
    name: "App Development",
    category: "IT/Tech",
    description: "Scoping a new mobile or web app build, including features and platform.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-4",
    idNumber: 85,
    name: "Automation/Workflow Consultation",
    category: "IT/Tech",
    description: "Scoping AI-driven automation for repetitive business processes.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-5",
    idNumber: 46,
    name: "Automobile",
    category: "Automobile",
    description: "Vehicle maintenance, diagnostics, and repairs workflow.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-6",
    idNumber: 35,
    name: "Cardiologist",
    category: "Healthcare",
    description: "Select if you are a Cardiologist or Heart Specialist.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-7",
    idNumber: 98,
    name: "Career Coaching",
    category: "Coaching & Advisory",
    description: "Guidance on job search, transitions, or career strategy.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-8",
    idNumber: 490,
    name: "Cataract",
    category: "Healthcare",
    description:
      "Comprehensive workflow for cataract diagnosis, surgical planning, cataract surgery, post-operative recovery, follow-ups, and long-term patient care.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-9",
    idNumber: 82,
    name: "Chatbot/Voice Agent Development",
    category: "IT/Tech",
    description: "Scoping an AI-powered chatbot or voice agent build.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-10",
    idNumber: 14,
    name: "Clinical Psychologist",
    category: "Healthcare",
    description: "Select if you are a Clinical Psychologist",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-11",
    idNumber: 76,
    name: "Cloud Migration Consultation",
    category: "IT/Tech",
    description: "Planning a move from on-prem to cloud infrastructure.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-12",
    idNumber: 45,
    name: "Commercial Real Estates",
    category: "Real Estate",
    description:
      "Services for businesses and investors dealing in office, retail, or industrial property.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-13",
    idNumber: 500,
    name: "Contoura Vision",
    category: "Healthcare",
    description:
      "Workflow for Contoura Vision treatment, covering consultation, corneal mapping, surgery, post-operative care, and patient follow-up.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-14",
    idNumber: 75,
    name: "Cybersecurity Assessment",
    category: "IT/Tech",
    description: "Reviewing a business's security posture and risks.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "ind-15",
    idNumber: 74,
    name: "Data/Infrastructure Audit",
    category: "IT/Tech",
    description: "Reviewing a business's data systems or IT health.",
    isSystemRecord: true,
    isActive: true,
  },
];

export default function IndustryServicesPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories] = useState<IndustryCategory[]>(INITIAL_CATEGORIES);
  const [industries, setIndustries] = useState<IndustryItem[]>(INITIAL_INDUSTRIES);

  // Side Drawer States
  const [isIndustryDrawerOpen, setIsIndustryDrawerOpen] = useState(false);
  const [editingIndustryId, setEditingIndustryId] = useState<string | null>(null);

  // Industry Form State
  const [industryForm, setIndustryForm] = useState({
    name: "",
    category: "Healthcare",
    description: "",
    isActive: true,
  });

  // Filtered Industries
  const filteredIndustries = useMemo(() => {
    return industries.filter((ind) => {
      const matchSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [industries, searchQuery]);

  // Handle open industry drawer
  const handleOpenIndustryDrawer = (item?: IndustryItem) => {
    if (item) {
      setEditingIndustryId(item.id);
      setIndustryForm({
        name: item.name,
        category: item.category,
        description: item.description,
        isActive: item.isActive,
      });
    } else {
      setEditingIndustryId(null);
      setIndustryForm({
        name: "",
        category: categories[0]?.name || "Healthcare",
        description: "",
        isActive: true,
      });
    }
    setIsIndustryDrawerOpen(true);
  };

  // Handle save industry
  const handleSaveIndustry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!industryForm.name.trim()) return;

    if (editingIndustryId) {
      setIndustries(
        industries.map((ind) =>
          ind.id === editingIndustryId
            ? {
                ...ind,
                name: industryForm.name.trim(),
                category: industryForm.category,
                description: industryForm.description.trim() || "No description provided.",
                isActive: industryForm.isActive,
              }
            : ind
        )
      );
    } else {
      const newInd: IndustryItem = {
        id: `ind-${Date.now()}`,
        idNumber: Math.floor(Math.random() * 900) + 10,
        name: industryForm.name.trim(),
        category: industryForm.category,
        description: industryForm.description.trim() || "No description provided.",
        isSystemRecord: false,
        isActive: industryForm.isActive,
      };
      setIndustries([newInd, ...industries]);
    }

    setIndustryForm({ name: "", category: categories[0]?.name || "Healthcare", description: "", isActive: true });
    setEditingIndustryId(null);
    setIsIndustryDrawerOpen(false);
  };

  const handleDeleteIndustry = (indId: string) => {
    setIndustries(industries.filter((s) => s.id !== indId));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <TopBar
        title="Industries"
        subtitle="Manage industries, domain workflows, and associate them with industry categories."
        showFilters={false}
        onMenuToggle={onMenuToggle}
      />

      {/* Main Glass Workspace */}
      <GlassCard variant="default" rounded="3xl" padding="lg" className="space-y-5">
        {/* Action Header: Search Bar & Add Button in one clean row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search industries by name, category, or description..."
              className="
                w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-white/80 rounded-2xl placeholder:text-slate-400 text-[#222222]
                shadow-xs transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            />
          </div>

          <Pill
            variant="navy"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenIndustryDrawer()}
            className="shadow-sm shrink-0 self-start sm:self-auto"
          >
            New Industry
          </Pill>
        </div>

        {/* INDUSTRIES DATA TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/50 backdrop-blur-md shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-[#181e25] to-[#2c3e50] text-white">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-left w-[32%]">
                    Industry Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-left w-[28%]">
                    Industry Category
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[10%]">
                    ID
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[12%]">
                    Record Type
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[10%]">
                    Status
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[8%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIndustries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">
                      No industries match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredIndustries.map((ind) => (
                    <tr
                      key={ind.id}
                      className="hover:bg-white/80 transition-colors duration-150 group"
                    >
                      {/* 1. Industry Name */}
                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenIndustryDrawer(ind)}
                          className="font-bold text-sm text-[#181e25] hover:text-[#1456f0] transition-colors text-left group-hover:underline inline-flex items-center gap-1.5"
                        >
                          <span>{ind.name}</span>
                        </button>
                      </td>

                      {/* 2. Industry Category */}
                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50/90 text-[#1456f0] border border-blue-200/70 font-semibold text-xs shadow-2xs">
                          <Tag className="w-3 h-3 opacity-60" />
                          {ind.category}
                        </span>
                      </td>

                      {/* 3. ID */}
                      <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100/80 border border-slate-200/60 font-mono text-xs text-slate-600 font-semibold shadow-2xs">
                          #{ind.idNumber}
                        </span>
                      </td>

                      {/* 4. Record Type */}
                      <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                        {ind.isSystemRecord ? (
                          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200/60 shadow-2xs">
                            System
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold tracking-wider text-purple-700 uppercase bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/70 shadow-2xs">
                            Custom
                          </span>
                        )}
                      </td>

                      {/* 5. Status */}
                      <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                        {ind.isActive ? (
                          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 text-emerald-700 border border-emerald-200/70 text-xs font-semibold shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 border border-slate-200 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* 6. Actions */}
                      <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1 bg-white/70 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleOpenIndustryDrawer(ind)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#1456f0] hover:bg-blue-50 transition-colors"
                            title="Edit Industry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteIndustry(ind.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Industry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

      {/* SIDE DRAWER: CREATE / EDIT INDUSTRY */}
      <SideDrawer
        isOpen={isIndustryDrawerOpen}
        onClose={() => setIsIndustryDrawerOpen(false)}
        title={editingIndustryId ? "Edit Industry" : "Create New Industry"}
        subtitle="Define an industry domain workflow."
        footer={
          <>
            <Pill
              variant="ghost"
              size="md"
              type="button"
              onClick={() => setIsIndustryDrawerOpen(false)}
            >
              Cancel
            </Pill>
            <Pill
              variant="navy"
              size="md"
              type="button"
              onClick={handleSaveIndustry}
            >
              {editingIndustryId ? "Update Industry" : "Create Industry"}
            </Pill>
          </>
        }
      >
        <form onSubmit={handleSaveIndustry} className="space-y-5">
          {/* Industry Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Industry Name
            </label>
            <input
              type="text"
              required
              value={industryForm.name}
              onChange={(e) =>
                setIndustryForm({ ...industryForm, name: e.target.value })
              }
              placeholder="e.g. Cardiologist, App Development, Commercial Real Estate"
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl placeholder:text-slate-400 text-[#222222]
                shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            />
          </div>

          {/* Industry Category Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Industry Category
            </label>
            <CustomSelect
              value={industryForm.category}
              onChange={(val) =>
                setIndustryForm({ ...industryForm, category: val })
              }
              options={categories.map((cat) => ({ value: cat.name, label: cat.name }))}
              label="Select Industry Category"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </label>
            <textarea
              rows={4}
              value={industryForm.description}
              onChange={(e) =>
                setIndustryForm({ ...industryForm, description: e.target.value })
              }
              placeholder="Describe the specific scope, conversational rules, or specialty..."
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl placeholder:text-slate-400 text-[#222222]
                shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white resize-none
              "
            />
          </div>

          {/* Is Active Toggle Switch */}
          <div className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-white/80">
            <div>
              <span className="text-xs font-semibold text-[#222222] block">
                Is Active?
              </span>
              <span className="text-[11px] text-slate-400">
                Allow voice AI agent flows to select this industry
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setIndustryForm({
                  ...industryForm,
                  isActive: !industryForm.isActive,
                })
              }
              className={`
                w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40
                ${industryForm.isActive ? "bg-[#1456f0]" : "bg-slate-300"}
              `}
            >
              <div
                className={`
                  bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200
                  ${industryForm.isActive ? "translate-x-6" : "translate-x-0"}
                `}
              />
            </button>
          </div>
        </form>
      </SideDrawer>
    </div>
  );
}
