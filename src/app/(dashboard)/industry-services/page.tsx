"use client";

import React, { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pill } from "@/components/ui/Pill";
import { SideDrawer } from "@/components/ui/SideDrawer";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  Tag,
  Hash,
} from "lucide-react";

// Types
export interface IndustryCategory {
  id: string;
  idNumber: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface ServiceItem {
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
    description: "Services tied to buying, maintaining, and servicing vehicles.",
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
    description: "All healthcare related services",
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

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    idNumber: 29,
    name: "Accessory/Customization",
    category: "Automobile",
    description: "Discussing add-ons or modifications.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-2",
    idNumber: 51,
    name: "AI/ML Strategy/ Model Development",
    category: "IT/Tech",
    description: "Scoping a custom AI or machine learning solution.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-3",
    idNumber: 73,
    name: "App Development",
    category: "IT/Tech",
    description: "Scoping a new mobile or web app build, including features and platform.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-4",
    idNumber: 85,
    name: "Automation/Workflow Consultation",
    category: "IT/Tech",
    description: "Scoping AI-driven automation for repetitive business processes.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-5",
    idNumber: 46,
    name: "Automobile",
    category: "Automobile",
    description: "Vehicle maintenance, diagnostics, and repairs workflow.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-6",
    idNumber: 35,
    name: "Cardiologist",
    category: "Healthcare",
    description: "Select if you are a Cardiologist or Heart Specialist.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-7",
    idNumber: 98,
    name: "Career Coaching",
    category: "Coaching & Advisory",
    description: "Guidance on job search, transitions, or career strategy.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-8",
    idNumber: 490,
    name: "Cataract",
    category: "Healthcare",
    description:
      "Comprehensive workflow for cataract diagnosis, surgical planning, cataract surgery, post-operative recovery, follow-ups, and long-term patient care.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-9",
    idNumber: 82,
    name: "Chatbot/Voice Agent Development",
    category: "IT/Tech",
    description: "Scoping an AI-powered chatbot or voice agent build.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-10",
    idNumber: 14,
    name: "Clinical Psychologist",
    category: "Healthcare",
    description: "Select if you are a Clinical Psychologist",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-11",
    idNumber: 76,
    name: "Cloud Migration Consultation",
    category: "IT/Tech",
    description: "Planning a move from on-prem to cloud infrastructure.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-12",
    idNumber: 45,
    name: "Commercial Real Estates",
    category: "Real Estate",
    description:
      "Services for businesses and investors dealing in office, retail, or industrial property.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-13",
    idNumber: 500,
    name: "Contoura Vision",
    category: "Healthcare",
    description:
      "Workflow for Contoura Vision treatment, covering consultation, corneal mapping, surgery, post-operative care, and patient follow-up.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-14",
    idNumber: 75,
    name: "Cybersecurity Assessment",
    category: "IT/Tech",
    description: "Reviewing a business's security posture and risks.",
    isSystemRecord: true,
    isActive: true,
  },
  {
    id: "srv-15",
    idNumber: 74,
    name: "Data/Infrastructure Audit",
    category: "IT/Tech",
    description: "Reviewing a business's data systems or IT health.",
    isSystemRecord: true,
    isActive: true,
  },
];

export default function IndustryServicesPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [activeTab, setActiveTab] = useState<"SERVICES" | "INDUSTRY">("SERVICES");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<IndustryCategory[]>(INITIAL_CATEGORIES);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);

  // Side Drawer States
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isServiceDrawerOpen, setIsServiceDrawerOpen] = useState(false);

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // Service Form State
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "Healthcare",
    description: "",
    isActive: true,
  });

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchSearch =
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [services, searchQuery]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      return (
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [categories, searchQuery]);

  // Handle create category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    const newCat: IndustryCategory = {
      id: `cat-${Date.now()}`,
      idNumber: Math.floor(Math.random() * 900) + 10,
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim() || "No description provided.",
      isActive: categoryForm.isActive,
    };

    setCategories([newCat, ...categories]);
    setCategoryForm({ name: "", description: "", isActive: true });
    setIsCategoryDrawerOpen(false);
  };

  // Handle create service
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    const newSrv: ServiceItem = {
      id: `srv-${Date.now()}`,
      idNumber: Math.floor(Math.random() * 900) + 10,
      name: serviceForm.name.trim(),
      category: serviceForm.category,
      description: serviceForm.description.trim() || "No description provided.",
      isSystemRecord: false,
      isActive: serviceForm.isActive,
    };

    setServices([newSrv, ...services]);
    setServiceForm({ name: "", category: categories[0]?.name || "Healthcare", description: "", isActive: true });
    setIsServiceDrawerOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <TopBar
        title="Industry & Services"
        subtitle="Manage services, categories, and system configurations."
        showFilters={false}
        onMenuToggle={onMenuToggle}
      />

      {/* Main Glass Workspace */}
      <GlassCard variant="default" rounded="3xl" padding="lg" className="space-y-6">
        {/* Tab Switcher Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/70 w-fit shadow-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab("SERVICES");
              setSearchQuery("");
            }}
            className={`
              px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200
              ${
                activeTab === "SERVICES"
                  ? "bg-[#181e25] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#222222] hover:bg-white/40"
              }
            `}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("INDUSTRY");
              setSearchQuery("");
            }}
            className={`
              px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200
              ${
                activeTab === "INDUSTRY"
                  ? "bg-[#181e25] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#222222] hover:bg-white/40"
              }
            `}
          >
            Industry
          </button>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-1">
          <div>
            <h2 className="font-display text-xl font-bold text-[#222222]">
              {activeTab === "SERVICES" ? "Configured Services" : "Service Categories"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === "SERVICES"
                ? "Manage individual conversational service workflows, prompts, and domain rules."
                : "Top-level groupings that link services and plans together."}
            </p>
          </div>

          {/* Action Button: Opens Side Drawer */}
          {activeTab === "SERVICES" ? (
            <Pill
              variant="navy"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsServiceDrawerOpen(true)}
              className="shadow-sm"
            >
              + New Service
            </Pill>
          ) : (
            <Pill
              variant="navy"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="shadow-sm"
            >
              + New Category
            </Pill>
          )}
        </div>

        {/* Search Input Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "SERVICES"
                ? "Search services by name or description..."
                : "Search categories..."
            }
            className="
              w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
              border border-white/80 rounded-2xl placeholder:text-slate-400 text-[#222222]
              shadow-xs transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
            "
          />
        </div>

        {/* DATA TABLE (Replaced Cards with Table as requested) */}
        {activeTab === "SERVICES" ? (
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/40 backdrop-blur-xs shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/60 border-b border-slate-200/60 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Service Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Record Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                        No services match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((srv) => (
                      <tr
                        key={srv.id}
                        className="hover:bg-white/70 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4 font-semibold text-[#222222] whitespace-nowrap">
                          {srv.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#1456f0] border border-blue-100 font-medium text-xs">
                            <Tag className="w-3 h-3" />
                            {srv.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate leading-relaxed">
                          {srv.description}
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                          ID: #{srv.idNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {srv.isSystemRecord ? (
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/50">
                              System Record
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold tracking-wider text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                              Custom Record
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {srv.isActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#1456f0] hover:bg-blue-50 transition-colors"
                              title="Edit Service"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setServices(services.filter((s) => s.id !== srv.id))
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Service"
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
        ) : (
          /* INDUSTRY TABLE */
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/40 backdrop-blur-xs shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/60 border-b border-slate-200/60 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Industry / Category</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Attached Services</th>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                        No industry categories match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => {
                      const attachedCount = services.filter(
                        (s) => s.category === cat.name
                      ).length;
                      return (
                        <tr
                          key={cat.id}
                          className="hover:bg-white/70 transition-colors duration-150 group"
                        >
                          <td className="px-6 py-4 font-semibold text-[#222222] whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1456f0] flex items-center justify-center font-bold text-xs border border-blue-100">
                                {cat.name.charAt(0)}
                              </div>
                              <span>{cat.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 max-w-sm truncate leading-relaxed">
                            {cat.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100/80 text-slate-700 font-medium text-xs border border-slate-200/50">
                              <Layers className="w-3 h-3 text-slate-400" />
                              {attachedCount} services
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                            ID: #{cat.idNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {cat.isActive ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#1456f0] hover:bg-blue-50 transition-colors"
                                title="Edit Category"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setCategories(categories.filter((c) => c.id !== cat.id))
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Category"
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
        )}
      </GlassCard>

      {/* SIDE DRAWER 1: CREATE SERVICE CATEGORY */}
      <SideDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        title="Create Service Category"
        subtitle="Categories group services and plans together."
        footer={
          <>
            <Pill
              variant="ghost"
              size="md"
              type="button"
              onClick={() => setIsCategoryDrawerOpen(false)}
            >
              Cancel
            </Pill>
            <Pill
              variant="navy"
              size="md"
              type="button"
              onClick={handleCreateCategory}
            >
              Create Category
            </Pill>
          </>
        }
      >
        <form onSubmit={handleCreateCategory} className="space-y-5">
          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Category Name
            </label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              placeholder="e.g. Healthcare, Legal, Finance"
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl placeholder:text-slate-400 text-[#222222]
                shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </label>
            <textarea
              rows={4}
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, description: e.target.value })
              }
              placeholder="Brief description of this service category..."
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
                Enable or disable this category across all services
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setCategoryForm({
                  ...categoryForm,
                  isActive: !categoryForm.isActive,
                })
              }
              className={`
                w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40
                ${categoryForm.isActive ? "bg-[#1456f0]" : "bg-slate-300"}
              `}
            >
              <div
                className={`
                  bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200
                  ${categoryForm.isActive ? "translate-x-6" : "translate-x-0"}
                `}
              />
            </button>
          </div>
        </form>
      </SideDrawer>

      {/* SIDE DRAWER 2: CREATE NEW SERVICE */}
      <SideDrawer
        isOpen={isServiceDrawerOpen}
        onClose={() => setIsServiceDrawerOpen(false)}
        title="Create New Service"
        subtitle="Define a new service."
        footer={
          <>
            <Pill
              variant="ghost"
              size="md"
              type="button"
              onClick={() => setIsServiceDrawerOpen(false)}
            >
              Cancel
            </Pill>
            <Pill
              variant="navy"
              size="md"
              type="button"
              onClick={handleCreateService}
            >
              Create
            </Pill>
          </>
        }
      >
        <form onSubmit={handleCreateService} className="space-y-5">
          {/* Service Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Service Name
            </label>
            <input
              type="text"
              required
              value={serviceForm.name}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, name: e.target.value })
              }
              placeholder="e.g. Healthcare, Finance, Logistics"
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl placeholder:text-slate-400 text-[#222222]
                shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            />
          </div>

          {/* Service Category Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Service Category
            </label>
            <select
              value={serviceForm.category}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, category: e.target.value })
              }
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl text-[#222222]
                shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </label>
            <textarea
              rows={4}
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, description: e.target.value })
              }
              placeholder="Describe the secondary characteristics or specific scope..."
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
                Allow voice AI agent flows to select this service
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setServiceForm({
                  ...serviceForm,
                  isActive: !serviceForm.isActive,
                })
              }
              className={`
                w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40
                ${serviceForm.isActive ? "bg-[#1456f0]" : "bg-slate-300"}
              `}
            >
              <div
                className={`
                  bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200
                  ${serviceForm.isActive ? "translate-x-6" : "translate-x-0"}
                `}
              />
            </button>
          </div>
        </form>
      </SideDrawer>
    </div>
  );
}
