"use client";

import React, { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pill } from "@/components/ui/Pill";
import { SideDrawer } from "@/components/ui/SideDrawer";
import {
  SlidersHorizontal,
  Plus,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  List,
  Search,
  Filter,
  Trash2,
  Edit2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Check,
  X,
  FolderPlus,
  Tag,
  Building2,
  PhoneCall,
  Activity,
  Package,
  CalendarDays,
  Users,
} from "lucide-react";

// Predefined Modules
export const MODULES = [
  "Clients",
  "Call Logs",
  "Processes",
  "Products / Services",
  "Organisation",
  "Appointments",
] as const;

export type ModuleType = (typeof MODULES)[number];

export interface CustomField {
  id: string;
  name: string;
  key: string;
  type: "Text" | "Number" | "Boolean (Yes/No)" | "Date" | "Select (Dropdown)";
  module: ModuleType;
  options?: string[];
  isRequired: boolean;
}

export interface CustomSection {
  id: string;
  name: string;
  module: ModuleType;
  description?: string;
  fieldIds: string[]; // Ordered list of CustomField IDs
}

// Initial Sample Data
const INITIAL_FIELDS: CustomField[] = [
  {
    id: "cf-1",
    name: "Hospital Location",
    key: "hospital_location",
    type: "Text",
    module: "Clients",
    isRequired: false,
  },
  {
    id: "cf-2",
    name: "Appointment Date Time",
    key: "appointment_date_time",
    type: "Date",
    module: "Appointments",
    isRequired: true,
  },
  {
    id: "cf-3",
    name: "Doctor Assigned",
    key: "doctor_assigned",
    type: "Select (Dropdown)",
    module: "Appointments",
    options: ["Dr. Sharma (Cardiology)", "Dr. Mehta (Ophthalmology)", "Dr. Patel (General)"],
    isRequired: true,
  },
  {
    id: "cf-4",
    name: "Budget",
    key: "budget",
    type: "Number",
    module: "Processes",
    isRequired: false,
  },
  {
    id: "cf-5",
    name: "Customer Sentiment Score",
    key: "customer_sentiment_score",
    type: "Number",
    module: "Call Logs",
    isRequired: false,
  },
  {
    id: "cf-6",
    name: "Preferred Callback Time",
    key: "preferred_callback_time",
    type: "Text",
    module: "Clients",
    isRequired: true,
  },
  {
    id: "cf-7",
    name: "VIP Account Flag",
    key: "is_vip_account",
    type: "Boolean (Yes/No)",
    module: "Clients",
    isRequired: false,
  },
  {
    id: "cf-8",
    name: "Service Plan Code",
    key: "service_plan_code",
    type: "Text",
    module: "Products / Services",
    isRequired: true,
  },
  {
    id: "cf-9",
    name: "Branch Tax ID",
    key: "branch_tax_id",
    type: "Text",
    module: "Organisation",
    isRequired: false,
  },
];

const INITIAL_SECTIONS: CustomSection[] = [
  {
    id: "sec-1",
    name: "Patient Vitals & Intake",
    module: "Clients",
    description: "Primary client intake details and priority flags",
    fieldIds: ["cf-1", "cf-6", "cf-7"],
  },
  {
    id: "sec-2",
    name: "Consultation Scheduling",
    module: "Appointments",
    description: "Doctor assignment and timing coordinates",
    fieldIds: ["cf-2", "cf-3"],
  },
  {
    id: "sec-3",
    name: "Call Resolution Metrics",
    module: "Call Logs",
    description: "Automated analysis scores and voice sentiment telemetry",
    fieldIds: ["cf-5"],
  },
];

export default function CustomFieldsPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [activeMainTab, setActiveMainTab] = useState<"FIELDS" | "SECTIONS">("FIELDS");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [fields, setFields] = useState<CustomField[]>(INITIAL_FIELDS);
  const [sections, setSections] = useState<CustomSection[]>(INITIAL_SECTIONS);

  // Drawer States
  const [isFieldDrawerOpen, setIsFieldDrawerOpen] = useState(false);
  const [isSectionDrawerOpen, setIsSectionDrawerOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // Create Field Form State
  const [fieldForm, setFieldForm] = useState<{
    name: string;
    key: string;
    type: CustomField["type"];
    module: ModuleType;
    isRequired: boolean;
    options: string[];
    newOptionInput: string;
  }>({
    name: "",
    key: "",
    type: "Text",
    module: "Clients",
    isRequired: false,
    options: [],
    newOptionInput: "",
  });

  // Create/Edit Section Form State with row-based module & field pairs
  interface SectionFieldRow {
    rowId: string;
    module: ModuleType;
    fieldId: string;
  }

  const [sectionForm, setSectionForm] = useState<{
    name: string;
    module: ModuleType;
    description: string;
    rows: SectionFieldRow[];
  }>({
    name: "",
    module: "Clients",
    description: "",
    rows: [{ rowId: "row-1", module: "Clients", fieldId: "" }],
  });

  // Helper to auto-generate key from label
  const handleLabelChange = (label: string) => {
    const autoKey = label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    setFieldForm((prev) => ({
      ...prev,
      name: label,
      key: autoKey,
    }));
  };

  // Add Option to Select dropdown type
  const handleAddOption = () => {
    if (fieldForm.newOptionInput.trim()) {
      setFieldForm((prev) => ({
        ...prev,
        options: [...prev.options, prev.newOptionInput.trim()],
        newOptionInput: "",
      }));
    }
  };

  const handleRemoveOption = (index: number) => {
    setFieldForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // Create Field Submit
  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldForm.name.trim()) return;

    const newField: CustomField = {
      id: `cf-${Date.now()}`,
      name: fieldForm.name.trim(),
      key: fieldForm.key.trim() || fieldForm.name.toLowerCase().replace(/\s+/g, "_"),
      type: fieldForm.type,
      module: fieldForm.module,
      options: fieldForm.type === "Select (Dropdown)" ? fieldForm.options : undefined,
      isRequired: fieldForm.isRequired,
    };

    setFields([newField, ...fields]);
    setFieldForm({
      name: "",
      key: "",
      type: "Text",
      module: "Clients",
      isRequired: false,
      options: [],
      newOptionInput: "",
    });
    setIsFieldDrawerOpen(false);
  };

  // Open Section Drawer (Create or Edit)
  const handleOpenSectionDrawer = (section?: CustomSection) => {
    if (section) {
      setEditingSectionId(section.id);
      const mappedRows: SectionFieldRow[] = section.fieldIds.map((fId, idx) => {
        const foundField = fields.find((f) => f.id === fId);
        return {
          rowId: `row-${idx}-${Date.now()}`,
          module: foundField ? foundField.module : section.module,
          fieldId: fId,
        };
      });

      setSectionForm({
        name: section.name,
        module: section.module,
        description: section.description || "",
        rows:
          mappedRows.length > 0
            ? mappedRows
            : [{ rowId: `row-1`, module: section.module, fieldId: "" }],
      });
    } else {
      setEditingSectionId(null);
      setSectionForm({
        name: "",
        module: "Clients",
        description: "",
        rows: [{ rowId: `row-${Date.now()}`, module: "Clients", fieldId: "" }],
      });
    }
    setIsSectionDrawerOpen(true);
  };

  // Add a new row of [Module Dropdown, Field Dropdown]
  const handleAddFieldRow = () => {
    setSectionForm((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          rowId: `row-${Date.now()}`,
          module: prev.module,
          fieldId: "",
        },
      ],
    }));
  };

  // Update row module
  const handleRowModuleChange = (rowIndex: number, newModule: ModuleType) => {
    setSectionForm((prev) => {
      const updated = [...prev.rows];
      const availableForMod = fields.filter((f) => f.module === newModule);
      updated[rowIndex] = {
        ...updated[rowIndex],
        module: newModule,
        fieldId: availableForMod[0]?.id || "",
      };
      return { ...prev, rows: updated };
    });
  };

  // Update row field
  const handleRowFieldChange = (rowIndex: number, newFieldId: string) => {
    setSectionForm((prev) => {
      const updated = [...prev.rows];
      updated[rowIndex] = {
        ...updated[rowIndex],
        fieldId: newFieldId,
      };
      return { ...prev, rows: updated };
    });
  };

  // Remove row
  const handleRemoveFieldRow = (rowIndex: number) => {
    setSectionForm((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, idx) => idx !== rowIndex),
    }));
  };

  // Drag and drop reordering state
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [dragOverRowIndex, setDragOverRowIndex] = useState<number | null>(null);

  // Drag reorder handler
  const handleDragReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const updated = [...sectionForm.rows];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setSectionForm((prev) => ({ ...prev, rows: updated }));
  };

  // Save Section Submit
  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.name.trim()) return;

    // Extract valid non-empty unique fieldIds in order
    const orderedFieldIds = sectionForm.rows
      .map((r) => r.fieldId)
      .filter((fId) => fId && fId.trim() !== "");

    if (editingSectionId) {
      setSections(
        sections.map((sec) =>
          sec.id === editingSectionId
            ? {
                ...sec,
                name: sectionForm.name.trim(),
                module: sectionForm.module,
                description: sectionForm.description.trim(),
                fieldIds: orderedFieldIds,
              }
            : sec
        )
      );
    } else {
      const newSec: CustomSection = {
        id: `sec-${Date.now()}`,
        name: sectionForm.name.trim(),
        module: sectionForm.module,
        description: sectionForm.description.trim(),
        fieldIds: orderedFieldIds,
      };
      setSections([newSec, ...sections]);
    }

    setIsSectionDrawerOpen(false);
  };

  // Filtered fields based on module filter and search
  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      const matchModule =
        selectedModuleFilter === "All" || f.module === selectedModuleFilter;
      const matchSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.module.toLowerCase().includes(searchQuery.toLowerCase());
      return matchModule && matchSearch;
    });
  }, [fields, selectedModuleFilter, searchQuery]);

  // Filtered sections based on search
  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      const matchModule =
        selectedModuleFilter === "All" || s.module === selectedModuleFilter;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.module.toLowerCase().includes(searchQuery.toLowerCase());
      return matchModule && matchSearch;
    });
  }, [sections, selectedModuleFilter, searchQuery]);

  // Module filter & search inside the Create Section Drawer field picker
  const [drawerModuleFilter, setDrawerModuleFilter] = useState<string>("All");
  const [drawerFieldSearch, setDrawerFieldSearch] = useState<string>("");

  // Available fields in the section drawer (can choose from ANY module)
  const availableDrawerFields = useMemo(() => {
    return fields.filter((f) => {
      const matchModule =
        drawerModuleFilter === "All" || f.module === drawerModuleFilter;
      const matchSearch =
        f.name.toLowerCase().includes(drawerFieldSearch.toLowerCase()) ||
        f.key.toLowerCase().includes(drawerFieldSearch.toLowerCase()) ||
        f.module.toLowerCase().includes(drawerFieldSearch.toLowerCase());
      return matchModule && matchSearch;
    });
  }, [fields, drawerModuleFilter, drawerFieldSearch]);

  const getTypeIcon = (type: CustomField["type"]) => {
    switch (type) {
      case "Number":
        return <Hash className="w-3.5 h-3.5 text-[#1456f0]" />;
      case "Date":
        return <Calendar className="w-3.5 h-3.5 text-purple-600" />;
      case "Boolean (Yes/No)":
        return <ToggleLeft className="w-3.5 h-3.5 text-emerald-600" />;
      case "Select (Dropdown)":
        return <List className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Type className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getModuleIcon = (mod: ModuleType) => {
    switch (mod) {
      case "Clients":
        return <Users className="w-3.5 h-3.5 text-blue-600" />;
      case "Call Logs":
        return <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />;
      case "Processes":
        return <Activity className="w-3.5 h-3.5 text-purple-600" />;
      case "Products / Services":
        return <Package className="w-3.5 h-3.5 text-sky-600" />;
      case "Organisation":
        return <Building2 className="w-3.5 h-3.5 text-amber-600" />;
      case "Appointments":
        return <CalendarDays className="w-3.5 h-3.5 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <TopBar
        title="Custom Fields & Sections"
        subtitle="Configure dynamic conversation variables, CRM attributes, and modular field sections."
        showFilters={false}
        onMenuToggle={onMenuToggle}
      />

      {/* Main Glass Workspace */}
      <GlassCard variant="default" rounded="3xl" padding="lg" className="space-y-5">
        {/* Top Controls Row: Segmented Tabs on Left, Action Button on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Main Tabs Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/70 w-fit shadow-xs">
            <button
              type="button"
              onClick={() => {
                setActiveMainTab("FIELDS");
                setSearchQuery("");
              }}
              className={`
                px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200
                ${
                  activeMainTab === "FIELDS"
                    ? "bg-[#181e25] text-white shadow-sm"
                    : "text-slate-500 hover:text-[#222222] hover:bg-white/40"
                }
              `}
            >
              Custom Fields
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMainTab("SECTIONS");
                setSearchQuery("");
              }}
              className={`
                px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200
                ${
                  activeMainTab === "SECTIONS"
                    ? "bg-[#181e25] text-white shadow-sm"
                    : "text-slate-500 hover:text-[#222222] hover:bg-white/40"
                }
              `}
            >
              Custom Sections
            </button>
          </div>

          {/* Right-Aligned Action Button (single clean plus icon) */}
          {activeMainTab === "FIELDS" ? (
            <Pill
              variant="navy"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsFieldDrawerOpen(true)}
              className="shadow-sm shrink-0 self-start sm:self-auto"
            >
              Add Custom Field
            </Pill>
          ) : (
            <Pill
              variant="navy"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => handleOpenSectionDrawer()}
              className="shadow-sm shrink-0 self-start sm:self-auto"
            >
              Create Section
            </Pill>
          )}
        </div>

        {/* Search Bar + Module Filter Dropdown in the SAME ROW */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeMainTab === "FIELDS"
                  ? "Search custom fields by label, key, or module..."
                  : "Search custom sections..."
              }
              className="
                w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-white/80 rounded-2xl placeholder:text-slate-400 text-[#222222]
                shadow-xs transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            />
          </div>

          {/* Module Filter Dropdown with Filter Icon */}
          <div className="relative shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
              className="
                pl-9 pr-8 py-2.5 text-xs sm:text-sm font-medium bg-white/70 backdrop-blur-md
                border border-white/80 rounded-2xl text-[#222222] shadow-xs
                focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
                cursor-pointer
              "
            >
              <option value="All">All Modules</option>
              {MODULES.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TAB 1: CUSTOM FIELDS TABLE */}
        {activeMainTab === "FIELDS" ? (
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/40 backdrop-blur-xs shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/60 border-b border-slate-200/60 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Field Label</th>
                    <th className="px-6 py-4">API Key</th>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">Data Type</th>
                    <th className="px-6 py-4">Requirement</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {filteredFields.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                        No custom fields found for this module or query.
                      </td>
                    </tr>
                  ) : (
                    filteredFields.map((field) => (
                      <tr
                        key={field.id}
                        className="hover:bg-white/70 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4 font-semibold text-[#222222] whitespace-nowrap">
                          {field.name}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-[#1456f0] whitespace-nowrap">
                          <span className="bg-blue-50/60 border border-blue-100/80 px-2 py-0.5 rounded-md">
                            {`{{${field.key}}}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/50 text-[#45515e] font-medium text-xs">
                            {field.module}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-white/80 border border-slate-200/60 text-xs font-medium text-[#45515e]">
                            {field.type}
                            {field.options && field.options.length > 0 && (
                              <span className="text-[10px] text-slate-400 ml-1">
                                ({field.options.length})
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {field.isRequired ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                              Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100/70 px-2.5 py-0.5 rounded-full">
                              Optional
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setFieldForm({
                                  name: field.name,
                                  key: field.key,
                                  type: field.type,
                                  module: field.module,
                                  isRequired: field.isRequired,
                                  options: field.options || [],
                                  newOptionInput: "",
                                });
                                setIsFieldDrawerOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#1456f0] hover:bg-blue-50 transition-colors"
                              title="Edit Field"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFields(fields.filter((f) => f.id !== field.id))
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Field"
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
          /* TAB 2: CUSTOM SECTIONS TABLE (Clean single color scheme, name only, no sequence column) */
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/40 backdrop-blur-xs shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/60 border-b border-slate-200/60 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Section Name</th>
                    <th className="px-6 py-4">Target Module</th>
                    <th className="px-6 py-4">Field Count</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {filteredSections.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                        No custom sections created yet for this module.
                      </td>
                    </tr>
                  ) : (
                    filteredSections.map((sec) => (
                      <tr
                        key={sec.id}
                        className="hover:bg-white/70 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4 font-semibold text-[#222222] whitespace-nowrap">
                          {sec.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/50 text-[#45515e] font-medium text-xs">
                            {sec.module}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                          {sec.fieldIds.length} fields
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenSectionDrawer(sec)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#1456f0] hover:bg-blue-50 transition-colors"
                              title="Edit Section"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setSections(sections.filter((s) => s.id !== sec.id))
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Section"
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
        )}
      </GlassCard>

      {/* SIDE DRAWER 1: CREATE CUSTOM FIELD */}
      <SideDrawer
        isOpen={isFieldDrawerOpen}
        onClose={() => setIsFieldDrawerOpen(false)}
        title="Create Custom Field"
        subtitle="Define a new custom field for your organization."
        width="lg"
        footer={
          <>
            <Pill
              variant="ghost"
              size="md"
              type="button"
              onClick={() => setIsFieldDrawerOpen(false)}
            >
              Cancel
            </Pill>
            <Pill
              variant="navy"
              size="md"
              type="button"
              onClick={handleCreateField}
            >
              Create Field
            </Pill>
          </>
        }
      >
        <form onSubmit={handleCreateField} className="space-y-5">
          {/* Section Heading Banner */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <SlidersHorizontal className="w-4 h-4 text-[#1456f0]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Field Configuration
            </span>
          </div>

          {/* Module Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <span>Target Module</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={fieldForm.module}
              onChange={(e) =>
                setFieldForm({ ...fieldForm, module: e.target.value as ModuleType })
              }
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl text-[#222222] shadow-xs
                focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            >
              {MODULES.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          {/* Field Label */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <span>Label</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fieldForm.name}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="e.g. Budget, Hospital Location, Doctor"
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl placeholder:text-slate-400 text-[#222222]
                shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            />
          </div>

          {/* Key and Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <span>Key</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fieldForm.key}
                onChange={(e) => setFieldForm({ ...fieldForm, key: e.target.value })}
                placeholder="e.g. budget"
                className="
                  w-full px-3.5 py-2.5 text-xs font-mono bg-white/70 backdrop-blur-md
                  border border-slate-200/80 rounded-xl text-[#1456f0] placeholder:text-slate-400
                  shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
                "
              />
              <p className="text-[10px] text-slate-400">
                Unique identifier for API usage (auto-generated).
              </p>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <span>Type</span>
                <span className="text-rose-500">*</span>
              </label>
              <select
                value={fieldForm.type}
                onChange={(e) =>
                  setFieldForm({
                    ...fieldForm,
                    type: e.target.value as CustomField["type"],
                  })
                }
                className="
                  w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                  border border-slate-200/80 rounded-xl text-[#222222] shadow-xs
                  focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
                "
              >
                <option value="Text">Text</option>
                <option value="Number">Number</option>
                <option value="Boolean (Yes/No)">Boolean (Yes/No)</option>
                <option value="Date">Date</option>
                <option value="Select (Dropdown)">Select (Dropdown)</option>
              </select>
            </div>
          </div>

          {/* Select Options Sub-Editor if Select (Dropdown) selected */}
          {fieldForm.type === "Select (Dropdown)" && (
            <div className="p-4 rounded-2xl bg-white/60 border border-slate-200/80 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Dropdown Options
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={fieldForm.newOptionInput}
                  onChange={(e) =>
                    setFieldForm({ ...fieldForm, newOptionInput: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                  placeholder="Type an option and press Add..."
                  className="
                    flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl
                    placeholder:text-slate-400 text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40
                  "
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="px-3 py-2 rounded-xl bg-[#1456f0] text-white text-xs font-medium hover:bg-[#2563eb] transition-colors"
                >
                  Add Option
                </button>
              </div>

              {fieldForm.options.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">
                  No options added yet. Click &quot;Add Option&quot; to create dropdown choices.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {fieldForm.options.map((opt, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-[#1456f0] text-xs font-medium border border-blue-100"
                    >
                      <span>{opt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mark as Required Field */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="markRequired"
              checked={fieldForm.isRequired}
              onChange={(e) =>
                setFieldForm({ ...fieldForm, isRequired: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-300 text-[#1456f0] focus:ring-[#1456f0]"
            />
            <label htmlFor="markRequired" className="text-xs font-semibold text-[#222222] cursor-pointer">
              Mark as required field
            </label>
          </div>
        </form>
      </SideDrawer>

      {/* SIDE DRAWER 2: CREATE / EDIT CUSTOM SECTION (WITH FIELD SELECTION & REORDERING) */}
      <SideDrawer
        isOpen={isSectionDrawerOpen}
        onClose={() => setIsSectionDrawerOpen(false)}
        title={editingSectionId ? "Edit Custom Section" : "Create Custom Section"}
        subtitle="Group and order custom fields into logical sections."
        width="lg"
        footer={
          <>
            <Pill
              variant="ghost"
              size="md"
              type="button"
              onClick={() => setIsSectionDrawerOpen(false)}
            >
              Cancel
            </Pill>
            <Pill
              variant="navy"
              size="md"
              type="button"
              onClick={handleSaveSection}
            >
              {editingSectionId ? "Update Section" : "Save Section"}
            </Pill>
          </>
        }
      >
        <form onSubmit={handleSaveSection} className="space-y-5">
          {/* Section Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <span>Section Label</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={sectionForm.name}
              onChange={(e) =>
                setSectionForm({ ...sectionForm, name: e.target.value })
              }
              placeholder="e.g. Patient Vitals, Billing Information"
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl placeholder:text-slate-400 text-[#222222]
                shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            />
          </div>

          {/* Target Module Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <span>Target Module</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={sectionForm.module}
              onChange={(e) => {
                const newMod = e.target.value as ModuleType;
                setSectionForm({
                  ...sectionForm,
                  module: newMod,
                });
              }}
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl text-[#222222] shadow-xs
                focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            >
              {MODULES.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </label>
            <input
              type="text"
              value={sectionForm.description}
              onChange={(e) =>
                setSectionForm({ ...sectionForm, description: e.target.value })
              }
              placeholder="Brief description of this section's purpose..."
              className="
                w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md
                border border-slate-200/80 rounded-xl placeholder:text-slate-400 text-[#222222]
                shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60 focus:bg-white
              "
            />
          </div>

          {/* Paired Dropdown Rows: Module & Field in same row + Add Option */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Section Custom Fields
                </label>
                <span className="text-[11px] text-slate-400">
                  Select module and field for each position. Use arrows to reorder.
                </span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1456f0]">
                {sectionForm.rows.filter((r) => r.fieldId).length} fields configured
              </span>
            </div>

            {sectionForm.rows.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/40 border border-dashed border-slate-200/80 text-center space-y-2">
                <p className="text-xs text-slate-500">No fields added to this section yet.</p>
                <Pill
                  variant="navy"
                  size="sm"
                  type="button"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={handleAddFieldRow}
                >
                  Add First Field
                </Pill>
              </div>
            ) : (
              <div className="space-y-2.5">
                {sectionForm.rows.map((row, index) => {
                  // Get fields available for this specific row's module
                  const availableForThisRow = fields.filter(
                    (f) => f.module === row.module
                  );

                  return (
                    <div
                      key={row.rowId}
                      draggable
                      onDragStart={() => setDraggedRowIndex(index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverRowIndex(index);
                      }}
                      onDragLeave={() => setDragOverRowIndex(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedRowIndex !== null) {
                          handleDragReorder(draggedRowIndex, index);
                        }
                        setDraggedRowIndex(null);
                        setDragOverRowIndex(null);
                      }}
                      onDragEnd={() => {
                        setDraggedRowIndex(null);
                        setDragOverRowIndex(null);
                      }}
                      className={`
                        p-3 rounded-2xl bg-white/90 backdrop-blur-md
                        border shadow-xs transition-all duration-150 space-y-2
                        cursor-grab active:cursor-grabbing select-none
                        ${
                          draggedRowIndex === index
                            ? "opacity-30 border-dashed border-[#1456f0]"
                            : "border-slate-200/80 hover:border-slate-300"
                        }
                        ${
                          dragOverRowIndex === index
                            ? "ring-2 ring-[#1456f0]/50 bg-blue-50/30"
                            : ""
                        }
                      `}
                    >
                      {/* Header line for row position and delete action */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Position #{index + 1}
                          </span>
                        </div>

                        {/* Delete Action Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveFieldRow(index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete field row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Two fields in the SAME ROW: Module Dropdown + Field Dropdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* 1. Module Dropdown */}
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                            Module
                          </label>
                          <select
                            value={row.module}
                            onChange={(e) =>
                              handleRowModuleChange(
                                index,
                                e.target.value as ModuleType
                              )
                            }
                            className="
                              w-full px-3 py-2 text-xs font-medium bg-white/90
                              border border-slate-200/90 rounded-xl text-[#222222] shadow-xs
                              focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60
                            "
                          >
                            {MODULES.map((mod) => (
                              <option key={mod} value={mod}>
                                {mod}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 2. Custom Field Dropdown */}
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                            Custom Field
                          </label>
                          <select
                            value={row.fieldId}
                            onChange={(e) =>
                              handleRowFieldChange(index, e.target.value)
                            }
                            className="
                              w-full px-3 py-2 text-xs font-medium bg-white/90
                              border border-slate-200/90 rounded-xl text-[#222222] shadow-xs
                              focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40 focus:border-[#1456f0]/60
                            "
                          >
                            <option value="">-- Choose Field --</option>
                            {availableForThisRow.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name} ({f.type})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* + Add Field Option Button */}
                <button
                  type="button"
                  onClick={handleAddFieldRow}
                  className="
                    w-full py-2.5 px-4 rounded-2xl border border-dashed border-slate-300 hover:border-[#1456f0]
                    bg-white/50 hover:bg-blue-50/50 text-[#1456f0] text-xs font-semibold
                    flex items-center justify-center gap-2 transition-all duration-200 shadow-xs
                  "
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Field</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </SideDrawer>
    </div>
  );
}
