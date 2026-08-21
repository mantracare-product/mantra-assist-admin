"use client";

import React, { useState, useMemo } from "react";
import {
  FormTemplate,
  FormFieldTemplate,
  FormFieldType,
} from "@/lib/types/industry-templates";
import {
  ALL_PREDEFINED_FIELDS,
  AVAILABLE_INDUSTRIES_LIST,
  PredefinedFieldItem,
  getPredefinedFieldsForIndustry,
  createFormFieldFromPredefined,
} from "@/lib/system-and-custom-fields";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  Type,
  AlignLeft,
  Mail,
  Hash,
  ChevronsUpDown,
  CheckSquare,
  List,
  Calendar,
  FileText,
  Minus,
  UploadCloud,
  PenTool,
  Code2,
  Phone,
  Check,
  X,
  Search,
  Database,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  ChevronRight,
  Folder,
  Users,
  CalendarDays,
  PhoneCall,
  Activity,
  Building2,
  Package,
  Briefcase,
  Sparkles,
  Stethoscope,
  Cpu,
  Car,
  Home,
  Scale,
  Wrench,
} from "lucide-react";

interface WebFormBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: FormTemplate;
  onSave: (form: FormTemplate) => void;
}

interface PaletteItem {
  type: FormFieldType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultPlaceholder?: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  { type: "text", label: "Single Line Text", icon: Type, defaultPlaceholder: "Enter single line text..." },
  { type: "textarea", label: "Paragraph Text", icon: AlignLeft, defaultPlaceholder: "Enter detailed response..." },
  { type: "email", label: "Email", icon: Mail, defaultPlaceholder: "name@example.com" },
  { type: "number", label: "Number", icon: Hash, defaultPlaceholder: "e.g. 100" },
  { type: "select", label: "Drop Down", icon: ChevronsUpDown },
  { type: "checkbox", label: "Checkboxes", icon: CheckSquare },
  { type: "radio", label: "Radio Buttons", icon: List },
  { type: "date", label: "Date", icon: Calendar },
  { type: "page_break", label: "Page Break", icon: FileText },
  { type: "section_break", label: "Section Break", icon: Minus },
  { type: "file", label: "File Upload", icon: UploadCloud },
  { type: "signature", label: "Signature", icon: PenTool },
  { type: "html", label: "HTML Block", icon: Code2 },
  { type: "phone", label: "Phone", icon: Phone, defaultPlaceholder: "+1 (555) 000-0000" },
];

export const WebFormBuilderModal: React.FC<WebFormBuilderModalProps> = ({
  isOpen,
  onClose,
  form: initialForm,
  onSave,
}) => {
  const [form, setForm] = useState<FormTemplate>(initialForm);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"add_fields" | "field_settings">("add_fields");

  // Select Field Dropdown State (Closed by default)
  const [isSelectFieldDropdownOpen, setIsSelectFieldDropdownOpen] = useState(false);
  const [openModuleDropdowns, setOpenModuleDropdowns] = useState<Record<string, boolean>>({});
  const [fieldSearchQuery, setFieldSearchQuery] = useState("");
  const [industryFilterMode, setIndustryFilterMode] = useState<"assigned" | "all">("assigned");

  // Industry Dropdown State
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);

  // Selection states
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    initialForm.sections[0]?.fields[0]?.id || null
  );
  const [isSubmitButtonSelected, setIsSubmitButtonSelected] = useState(false);

  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);

  // Flatten all fields across sections for easy access
  const allFields = form.sections.flatMap((s) => s.fields);
  const selectedField = allFields.find((f) => f.id === selectedFieldId) || null;

  // Active fields tailored by selected industry
  const availableIndustryFields = useMemo(() => {
    if (industryFilterMode === "all") {
      return ALL_PREDEFINED_FIELDS;
    }
    return getPredefinedFieldsForIndustry(form.industryName || "General / Universal");
  }, [form.industryName, industryFilterMode]);

  // Group fields by module
  const groupedFieldsByModule = useMemo(() => {
    const query = fieldSearchQuery.toLowerCase().trim();
    const groups: Record<string, PredefinedFieldItem[]> = {};

    availableIndustryFields.forEach((f) => {
      const match =
        !query ||
        f.label.toLowerCase().includes(query) ||
        f.name.toLowerCase().includes(query) ||
        f.key.toLowerCase().includes(query) ||
        f.module.toLowerCase().includes(query) ||
        (f.description && f.description.toLowerCase().includes(query));

      if (match) {
        const mod = f.module || "General";
        if (!groups[mod]) {
          groups[mod] = [];
        }
        groups[mod].push(f);
      }
    });

    return groups;
  }, [availableIndustryFields, fieldSearchQuery]);

  const moduleList = useMemo(() => {
    const preferredOrder = [
      "Clients",
      "Appointments",
      "Call Logs",
      "Processes",
      "Products / Services",
      "Organisation",
    ];
    const available = Object.keys(groupedFieldsByModule);
    return [
      ...preferredOrder.filter((m) => available.includes(m)),
      ...available.filter((m) => !preferredOrder.includes(m)),
    ];
  }, [groupedFieldsByModule]);

  if (!isOpen) return null;

  const toggleModuleDropdown = (moduleName: string) => {
    setOpenModuleDropdowns((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  // Helper to generate a unique field key
  const generateFieldKey = (label: string) => {
    const slug = label.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${slug || "field"}_${randomSuffix}`;
  };

  // Add standard field to form
  const handleAddField = (type: FormFieldType, labelOverride?: string) => {
    const item = PALETTE_ITEMS.find((p) => p.type === type);
    const label = labelOverride || item?.label || "New Field";
    const newField: FormFieldTemplate = {
      id: `f-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      label,
      name: generateFieldKey(label),
      type,
      placeholder: item?.defaultPlaceholder || "",
      isRequired: false,
      fieldSource: "standard",
      options:
        type === "select" || type === "radio" || type === "checkbox"
          ? [
            { label: "Option 1", value: "option_1" },
            { label: "Option 2", value: "option_2" },
          ]
          : undefined,
      minCharacters: "",
      maxCharacters: "",
      conditionalLogic: {
        enabled: false,
        dependsOnFieldId: "",
        operator: "equals",
        value: "",
      },
    };

    let updatedSections = [...form.sections];
    if (updatedSections.length === 0) {
      updatedSections = [
        {
          id: `sec-1`,
          title: "Form Details",
          fields: [newField],
        },
      ];
    } else {
      updatedSections[0] = {
        ...updatedSections[0],
        fields: [...updatedSections[0].fields, newField],
      };
    }

    setForm({ ...form, sections: updatedSections });
    setSelectedFieldId(newField.id);
    setIsSubmitButtonSelected(false);
    setActiveSidebarTab("field_settings");
  };

  // Add Predefined Field to form
  const handleAddPredefinedField = (predefined: PredefinedFieldItem) => {
    const newField = createFormFieldFromPredefined(predefined);

    let updatedSections = [...form.sections];
    if (updatedSections.length === 0) {
      updatedSections = [
        {
          id: `sec-1`,
          title: "Form Details",
          fields: [newField],
        },
      ];
    } else {
      updatedSections[0] = {
        ...updatedSections[0],
        fields: [...updatedSections[0].fields, newField],
      };
    }

    setForm({ ...form, sections: updatedSections });
    setSelectedFieldId(newField.id);
    setIsSubmitButtonSelected(false);
    setActiveSidebarTab("field_settings");
  };

  // Update selected field attributes
  const handleUpdateSelectedField = (updates: Partial<FormFieldTemplate>) => {
    if (!selectedFieldId) return;
    const updatedSections = form.sections.map((sec) => ({
      ...sec,
      fields: sec.fields.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f)),
    }));
    setForm({ ...form, sections: updatedSections });
  };

  // Delete a field
  const handleDeleteField = (fieldId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updatedSections = form.sections.map((sec) => ({
      ...sec,
      fields: sec.fields.filter((f) => f.id !== fieldId),
    }));
    setForm({ ...form, sections: updatedSections });
    if (selectedFieldId === fieldId) {
      const remaining = updatedSections.flatMap((s) => s.fields);
      setSelectedFieldId(remaining[0]?.id || null);
      if (remaining.length === 0) {
        setActiveSidebarTab("add_fields");
      }
    }
  };

  // Duplicate a field
  const handleDuplicateField = (fieldId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = allFields.find((f) => f.id === fieldId);
    if (!target) return;

    const clonedField: FormFieldTemplate = {
      ...target,
      id: `f-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      label: `${target.label} (Copy)`,
      name: generateFieldKey(`${target.label}_copy`),
    };

    const updatedSections = form.sections.map((sec) => {
      const index = sec.fields.findIndex((f) => f.id === fieldId);
      if (index !== -1) {
        const nextFields = [...sec.fields];
        nextFields.splice(index + 1, 0, clonedField);
        return { ...sec, fields: nextFields };
      }
      return sec;
    });

    setForm({ ...form, sections: updatedSections });
    setSelectedFieldId(clonedField.id);
    setIsSubmitButtonSelected(false);
    setActiveSidebarTab("field_settings");
  };

  // Drag & Drop Handlers from Palette
  const handleDragStartFromStandardPalette = (e: React.DragEvent, type: FormFieldType) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ kind: "standard", type }));
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragStartFromPredefined = (e: React.DragEvent, item: PredefinedFieldItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ kind: "predefined", item }));
    e.dataTransfer.setData("text/plain", item.type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDropOnCanvas = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCanvas(false);

    try {
      const jsonString = e.dataTransfer.getData("application/json");
      if (jsonString) {
        const payload = JSON.parse(jsonString);
        if (payload.kind === "predefined" && payload.item) {
          handleAddPredefinedField(payload.item);
          return;
        }
        if (payload.kind === "standard" && payload.type) {
          handleAddField(payload.type);
          return;
        }
      }
    } catch {
      // fallback
    }

    const fieldType = e.dataTransfer.getData("text/plain") as FormFieldType;
    if (fieldType) {
      handleAddField(fieldType);
    }
  };

  // Save changes
  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const getFieldTypeIcon = (type: FormFieldType) => {
    switch (type) {
      case "phone":
        return <Phone className="w-3.5 h-3.5" />;
      case "email":
        return <Mail className="w-3.5 h-3.5" />;
      case "date":
      case "time":
        return <Calendar className="w-3.5 h-3.5" />;
      case "number":
      case "currency":
        return <Hash className="w-3.5 h-3.5" />;
      case "select":
        return <ChevronsUpDown className="w-3.5 h-3.5" />;
      case "checkbox":
        return <CheckSquare className="w-3.5 h-3.5" />;
      case "radio":
        return <List className="w-3.5 h-3.5" />;
      case "file":
        return <UploadCloud className="w-3.5 h-3.5" />;
      case "signature":
        return <PenTool className="w-3.5 h-3.5" />;
      case "textarea":
        return <AlignLeft className="w-3.5 h-3.5" />;
      default:
        return <Type className="w-3.5 h-3.5" />;
    }
  };

  const getModuleIcon = (moduleName: string) => {
    switch (moduleName) {
      case "Clients":
        return <Users className="w-3.5 h-3.5 text-blue-500" />;
      case "Appointments":
        return <CalendarDays className="w-3.5 h-3.5 text-rose-500" />;
      case "Call Logs":
        return <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />;
      case "Processes":
        return <Activity className="w-3.5 h-3.5 text-purple-500" />;
      case "Products / Services":
        return <Package className="w-3.5 h-3.5 text-sky-500" />;
      case "Organisation":
        return <Building2 className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Folder className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  const getIndustryIcon = (industryName: string) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 64% Width Side Drawer (Right-aligned) */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-6 pointer-events-none">
        <div className="w-screen w-full md:w-[64vw] max-w-[64vw] h-full bg-[#f8fafc] shadow-2xl border-l border-slate-200/90 overflow-hidden flex flex-col pointer-events-auto animate-in slide-in-from-right duration-300">
          {/* TOP BAR */}
          <div className="bg-white px-6 py-3.5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                title="Close Drawer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="font-bold text-base sm:text-lg text-[#181e25] bg-transparent hover:bg-slate-50 focus:bg-white px-1.5 py-0.5 rounded-lg border border-transparent hover:border-slate-200 focus:border-blue-400 outline-none transition-all"
                    placeholder="Form Title"
                  />
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
                    {`FORM_${(form.slug || form.id).replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12)}`}
                  </span>
                </div>
                <input
                  type="text"
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="text-xs text-slate-500 bg-transparent hover:bg-slate-50 focus:bg-white px-1.5 py-0.5 rounded-lg border border-transparent hover:border-slate-200 focus:border-blue-400 outline-none w-full max-w-sm"
                  placeholder="Add form description..."
                />
              </div>
            </div>

            {/* Action Buttons on Right */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* CUSTOM INDUSTRY DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                  className={`flex items-center gap-2 bg-slate-50 hover:bg-slate-100/90 border px-3 py-1.5 rounded-xl shadow-2xs transition-all text-left cursor-pointer group ${isIndustryDropdownOpen ? "border-[#1456f0] ring-2 ring-[#1456f0]/20 bg-white" : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-white shadow-2xs border border-slate-200/70 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getIndustryIcon(form.industryName || "General / Universal")}
                  </div>
                  <div className="flex flex-col pr-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                      Industry
                    </span>
                    <span className="text-xs font-bold text-[#181e25] max-w-[170px] truncate">
                      {form.industryName || "General / Universal"}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isIndustryDropdownOpen ? "rotate-180 text-[#1456f0]" : ""}`} />
                </button>

                {/* Popover Menu */}
                {isIndustryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsIndustryDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 flex items-center justify-between">
                        <span>Select Form Industry</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          {AVAILABLE_INDUSTRIES_LIST.length} options
                        </span>
                      </div>
                      <div className="max-h-[320px] overflow-y-auto custom-scrollbar space-y-1 pt-0.5">
                        {AVAILABLE_INDUSTRIES_LIST.map((ind) => {
                          const isSelected =
                            (form.industryName || "General / Universal") === ind.name ||
                            form.industryId === ind.id;
                          return (
                            <button
                              key={ind.id}
                              type="button"
                              onClick={() => {
                                setForm({
                                  ...form,
                                  industryName: ind.name,
                                  industryId: ind.id,
                                });
                                setIsIndustryDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isSelected
                                  ? "bg-blue-50/90 text-[#1456f0] font-bold shadow-2xs"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-[#181e25]"
                                }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-6 h-6 rounded-lg bg-slate-100/90 flex items-center justify-center shrink-0">
                                  {getIndustryIcon(ind.name)}
                                </div>
                                <div className="flex flex-col text-left truncate">
                                  <span className="truncate">{ind.name}</span>
                                  <span className="text-[10px] text-slate-400 font-normal truncate">
                                    {ind.category}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#1456f0] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Save Changes Button */}
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#181e25] hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5 text-slate-300" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* MAIN BODY: 2-Column Canvas + Side Palette */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* LEFT CANVAS WORKSPACE (7 cols in 64vw drawer) */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverCanvas(true);
                }}
                onDragLeave={() => setIsDragOverCanvas(false)}
                onDrop={handleDropOnCanvas}
                className={`lg:col-span-7 bg-white rounded-3xl p-5 border transition-all min-h-[560px] flex flex-col justify-start space-y-3.5 shadow-xs ${isDragOverCanvas
                    ? "border-blue-500 ring-4 ring-blue-500/10 bg-blue-50/20"
                    : "border-slate-200/90"
                  }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#1456f0]" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      Form Visual Canvas ({allFields.length} Fields)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Industry: <strong className="text-slate-700">{form.industryName || "General"}</strong>
                  </span>
                </div>

                {/* If Canvas is Empty: Show Dashed Dropzone */}
                {allFields.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/40 text-center space-y-3 min-h-[360px]">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1456f0] flex items-center justify-center shadow-2xs">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#181e25]">
                        Canvas is empty
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        Drag fields from the standard palette or open the <strong>Select Field</strong> dropdown below to drop fields directly into your form.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* List of Fields on Canvas */
                  <div className="space-y-3">
                    {allFields.map((field) => {
                      const isSelected = field.id === selectedFieldId && !isSubmitButtonSelected;

                      return (
                        <div
                          key={field.id}
                          onClick={() => {
                            setSelectedFieldId(field.id);
                            setIsSubmitButtonSelected(false);
                            setActiveSidebarTab("field_settings");
                          }}
                          className={`
                            group relative p-3.5 rounded-2xl transition-all cursor-pointer border
                            ${isSelected
                              ? "bg-white border-[#1456f0] ring-2 ring-[#1456f0]/20 shadow-sm"
                              : "bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-2xs"
                            }
                          `}
                        >
                          {/* Top Row: Grip Handle, Label, and Action Icons */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
                              <span className="font-bold text-xs text-[#181e25]">
                                {field.label}
                              </span>
                              {field.isRequired && (
                                <span className="text-rose-500 font-bold text-xs">*</span>
                              )}
                              {field.name && (
                                <span className="text-[10.5px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {field.name}
                                </span>
                              )}
                            </div>

                            {/* Quick Action Icons */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => handleDuplicateField(field.id, e)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="Duplicate Field"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteField(field.id, e)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Field"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Helper Description if any */}
                          {field.helperText && (
                            <p className="text-[11px] text-slate-400 mb-2">
                              {field.helperText}
                            </p>
                          )}

                          {/* Field Input Preview */}
                          <div className="pointer-events-none opacity-85">
                            {field.type === "textarea" ? (
                              <textarea
                                rows={2}
                                disabled
                                placeholder={field.placeholder || "Enter paragraph text..."}
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none text-slate-500"
                              />
                            ) : field.type === "select" ? (
                              <div className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-slate-500">
                                <span>{field.options?.[0]?.label || "Select an option..."}</span>
                                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                              </div>
                            ) : field.type === "checkbox" ? (
                              <div className="space-y-1.5 pt-1">
                                {(field.options || [{ label: "Option 1", value: "1" }]).map((opt, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                    <input type="checkbox" disabled className="rounded border-slate-300" />
                                    <span>{opt.label}</span>
                                  </div>
                                ))}
                              </div>
                            ) : field.type === "radio" ? (
                              <div className="space-y-1.5 pt-1">
                                {(field.options || [{ label: "Option 1", value: "1" }]).map((opt, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                    <input type="radio" disabled className="border-slate-300" />
                                    <span>{opt.label}</span>
                                  </div>
                                ))}
                              </div>
                            ) : field.type === "signature" ? (
                              <div className="w-full h-14 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                                <PenTool className="w-4 h-4 mr-2" /> Sign here
                              </div>
                            ) : field.type === "file" ? (
                              <div className="w-full py-2.5 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                                <UploadCloud className="w-4 h-4 mr-2" /> Upload file
                              </div>
                            ) : field.type === "section_break" ? (
                              <div className="py-2 flex items-center gap-3">
                                <div className="h-[1px] bg-slate-200 flex-1" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                  Section Break
                                </span>
                                <div className="h-[1px] bg-slate-200 flex-1" />
                              </div>
                            ) : field.type === "page_break" ? (
                              <div className="p-2 bg-blue-50/60 border border-dashed border-blue-200 rounded-xl text-center text-xs font-bold text-blue-600">
                                — PAGE BREAK —
                              </div>
                            ) : field.type === "html" ? (
                              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-500">
                                &lt;div&gt;Custom HTML Block&lt;/div&gt;
                              </div>
                            ) : (
                              <input
                                type="text"
                                disabled
                                placeholder={field.placeholder || `Enter ${field.label}...`}
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* SIMPLE SUBMIT BUTTON ON CANVAS */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFieldId(null);
                      setIsSubmitButtonSelected(true);
                      setActiveSidebarTab("field_settings");
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer ${isSubmitButtonSelected
                        ? "bg-[#1456f0] text-white ring-4 ring-[#1456f0]/25"
                        : "bg-[#1456f0] hover:bg-blue-700 text-white"
                      }`}
                  >
                    {form.submitButtonText || "Submit"}
                  </button>
                </div>
              </div>

              {/* RIGHT SIDEBAR: Add Fields & Field Settings Tabs (5 cols in 64vw drawer) */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col min-h-[560px]">
                {/* Top 2 Primary Tabs */}
                <div className="grid grid-cols-2 border-b border-slate-200/80 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab("add_fields")}
                    className={`py-3.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${activeSidebarTab === "add_fields"
                        ? "text-[#1456f0] border-[#1456f0] bg-blue-50/20"
                        : "text-slate-500 border-transparent hover:text-slate-800"
                      }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab("field_settings")}
                    className={`py-3.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${activeSidebarTab === "field_settings"
                        ? "text-[#1456f0] border-[#1456f0] bg-blue-50/20"
                        : "text-slate-500 border-transparent hover:text-slate-800"
                      }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {isSubmitButtonSelected ? "Button Settings" : "Field Settings"}
                  </button>
                </div>

                {/* TAB 1: ADD FIELDS PALETTE */}
                {activeSidebarTab === "add_fields" && (
                  <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar max-h-[720px]">
                    {/* 1. TOP SECTION: STANDARD INPUT PALETTE */}
                    <div className="space-y-2.5">
                      <p className="text-xs text-slate-500">
                        Drag a field to the left to start building your form.
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {PALETTE_ITEMS.map((item) => {
                          const Icon = item.icon;

                          return (
                            <div
                              key={item.type}
                              draggable
                              onDragStart={(e) => handleDragStartFromStandardPalette(e, item.type)}
                              onClick={() => handleAddField(item.type)}
                              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/80 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-[#1456f0] cursor-grab active:cursor-grabbing transition-all text-center group shadow-2xs hover:shadow-xs"
                            >
                              <Icon className="w-4 h-4 text-slate-500 group-hover:text-[#1456f0] mb-1.5 transition-colors" />
                              <span className="font-semibold text-[11px] leading-tight">
                                {item.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="pt-2 border-t border-slate-200/80" />

                    {/* 2. BOTTOM SECTION: UNIFIED SELECT FIELD DROPDOWN WITH INDUSTRY CUSTOM FIELDS */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition-all">
                      {/* Main Select Field Collapsible Header / Trigger */}
                      <button
                        type="button"
                        onClick={() => setIsSelectFieldDropdownOpen(!isSelectFieldDropdownOpen)}
                        className={`w-full flex items-center justify-between p-3.5 transition-colors font-bold text-xs ${isSelectFieldDropdownOpen
                            ? "bg-slate-100/90 text-[#181e25] border-b border-slate-200"
                            : "bg-slate-50 hover:bg-slate-100/80 text-slate-800"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#1456f0] flex items-center justify-center shadow-2xs">
                            <Database className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold">Select Field</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-mono text-[10px]">
                            {availableIndustryFields.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="text-[11px] font-normal text-slate-500">
                            {isSelectFieldDropdownOpen ? "Collapse" : "Expand"}
                          </span>
                          {isSelectFieldDropdownOpen ? (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                      </button>

                      {/* Dropdown Content seamlessly attached directly inside */}
                      {isSelectFieldDropdownOpen && (
                        <div className="p-3 bg-slate-50/50 space-y-2.5 animate-in fade-in duration-150">
                          {/* Search Input for fast filtering */}
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={fieldSearchQuery}
                              onChange={(e) => setFieldSearchQuery(e.target.value)}
                              placeholder="Search all fields..."
                              className="w-full pl-8 pr-7 py-2 text-xs bg-white border border-slate-200/90 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 placeholder:text-slate-400 text-[#181e25]"
                            />
                            {fieldSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setFieldSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Industry scope filter banner */}
                          <div className="flex items-center justify-between text-[10.5px] bg-white p-1.5 rounded-lg border border-slate-200">
                            <span className="text-slate-500 truncate">
                              Scope: <strong className="text-[#1456f0]">{form.industryName || "General"}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setIndustryFilterMode(
                                  industryFilterMode === "assigned" ? "all" : "assigned"
                                )
                              }
                              className="text-[10px] font-bold text-[#1456f0] hover:underline"
                            >
                              {industryFilterMode === "assigned" ? "Show All Industries" : "Filter to Industry"}
                            </button>
                          </div>

                          {/* Nested Module Dropdowns */}
                          <div className="space-y-2">
                            {moduleList.length === 0 ? (
                              <div className="py-6 text-center text-slate-400 text-xs">
                                No matching fields found for this industry.
                              </div>
                            ) : (
                              moduleList.map((moduleName) => {
                                const fieldsInModule = groupedFieldsByModule[moduleName] || [];
                                const isOpen = !!openModuleDropdowns[moduleName];

                                return (
                                  <div
                                    key={moduleName}
                                    className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs"
                                  >
                                    {/* Sub-dropdown Accordion Header */}
                                    <button
                                      type="button"
                                      onClick={() => toggleModuleDropdown(moduleName)}
                                      className="w-full flex items-center justify-between px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#181e25] transition-colors text-xs font-bold"
                                    >
                                      <div className="flex items-center gap-2">
                                        {getModuleIcon(moduleName)}
                                        <span>{moduleName}</span>
                                        <span className="text-[10px] text-slate-400 font-mono font-normal">
                                          ({fieldsInModule.length})
                                        </span>
                                      </div>
                                      <div className="text-slate-400">
                                        {isOpen ? (
                                          <ChevronDown className="w-3.5 h-3.5" />
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5" />
                                        )}
                                      </div>
                                    </button>

                                    {/* Sub-dropdown Fields List */}
                                    {isOpen && (
                                      <div className="p-2 border-t border-slate-100 bg-slate-50/50 space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {fieldsInModule.map((field) => (
                                          <div
                                            key={field.id}
                                            draggable
                                            onDragStart={(e) => handleDragStartFromPredefined(e, field)}
                                            onClick={() => handleAddPredefinedField(field)}
                                            className="px-2.5 py-2 rounded-lg bg-white hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group shadow-2xs flex items-center justify-between gap-2"
                                            title="Drag to form or click to add"
                                          >
                                            <div className="flex items-center gap-2 min-w-0">
                                              <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-[#1456f0] flex items-center justify-center shrink-0">
                                                {getFieldTypeIcon(field.type)}
                                              </div>
                                              <span className="text-xs font-semibold text-[#181e25] truncate">
                                                {field.label}
                                              </span>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddPredefinedField(field);
                                              }}
                                              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1456f0] transition-colors shrink-0"
                                              title="Add to form"
                                            >
                                              <Plus className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: FIELD SETTINGS / BUTTON SETTINGS */}
                {activeSidebarTab === "field_settings" && (
                  <div className="p-4 space-y-4 max-h-[580px] overflow-y-auto custom-scrollbar flex-1">
                    {/* SUBMIT BUTTON SETTINGS VIEW */}
                    {isSubmitButtonSelected ? (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {/* Submit Button Text (Label) */}
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                            BUTTON LABEL
                          </label>
                          <input
                            type="text"
                            value={form.submitButtonText || "Submit"}
                            onChange={(e) => setForm({ ...form, submitButtonText: e.target.value })}
                            placeholder="e.g. Submit, Book Consultation"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 font-bold text-[#181e25]"
                          />
                        </div>

                        {/* Success Message */}
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                            SUCCESS CONFIRMATION MESSAGE
                          </label>
                          <textarea
                            rows={3}
                            value={form.successMessage || "Thank you for your submission!"}
                            onChange={(e) => setForm({ ...form, successMessage: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 text-[#181e25]"
                          />
                        </div>

                        {/* Redirect URL */}
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                            REDIRECT URL (OPTIONAL)
                          </label>
                          <input
                            type="url"
                            value={form.redirectUrl || ""}
                            onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
                            placeholder="https://yourwebsite.com/thank-you"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 text-[#181e25]"
                          />
                        </div>

                        {/* Auto-create Client */}
                        <label className="flex items-center gap-2 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.autoCreateClient ?? true}
                            onChange={(e) => setForm({ ...form, autoCreateClient: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-300 text-[#1456f0] focus:ring-[#1456f0]"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            Auto-create client profile in CRM upon submission
                          </span>
                        </label>
                      </div>
                    ) : !selectedField ? (
                      <div className="py-14 text-center space-y-2">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <Type className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-semibold text-slate-600">
                          No field selected
                        </p>
                        <p className="text-[11px] text-slate-400 max-w-[180px] mx-auto">
                          Click any field on the canvas or click the Submit Button to configure properties.
                        </p>
                      </div>
                    ) : (
                      /* FIELD SETTINGS VIEW */
                      <div className="space-y-3.5">
                        {/* Field Label */}
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                            FIELD LABEL
                          </label>
                          <input
                            type="text"
                            value={selectedField.label}
                            onChange={(e) =>
                              handleUpdateSelectedField({
                                label: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 font-semibold text-[#181e25]"
                          />
                        </div>

                        {/* Field Key (API Variable) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                              FIELD KEY (API VARIABLE)
                            </label>
                            <span className="text-[10px] text-slate-400">
                              Used in Webhooks
                            </span>
                          </div>
                          <input
                            type="text"
                            value={selectedField.name}
                            onChange={(e) =>
                              handleUpdateSelectedField({
                                name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
                              })
                            }
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 font-mono text-[#181e25]"
                          />
                        </div>

                        {/* Description (Optional) */}
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                            DESCRIPTION / HELPER TEXT
                          </label>
                          <input
                            type="text"
                            value={selectedField.helperText || ""}
                            onChange={(e) =>
                              handleUpdateSelectedField({
                                helperText: e.target.value,
                              })
                            }
                            placeholder="Add a helper description"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 text-[#181e25]"
                          />
                        </div>

                        {/* Placeholder */}
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                            PLACEHOLDER
                          </label>
                          <input
                            type="text"
                            value={selectedField.placeholder || ""}
                            onChange={(e) =>
                              handleUpdateSelectedField({
                                placeholder: e.target.value,
                              })
                            }
                            placeholder="Placeholder text..."
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 text-[#181e25]"
                          />
                        </div>

                        {/* Required Field Checkbox */}
                        <label className="flex items-center gap-2 pt-0.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedField.isRequired}
                            onChange={(e) =>
                              handleUpdateSelectedField({
                                isRequired: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-slate-300 text-[#1456f0] focus:ring-[#1456f0]"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            Required Field
                          </span>
                        </label>

                        {/* Options Editor for Select / Radio / Checkbox */}
                        {(selectedField.type === "select" ||
                          selectedField.type === "radio" ||
                          selectedField.type === "checkbox") && (
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                                OPTIONS
                              </label>
                              <div className="space-y-1.5">
                                {(selectedField.options || []).map((opt, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={opt.label}
                                      onChange={(e) => {
                                        const nextOptions = [...(selectedField.options || [])];
                                        nextOptions[idx] = {
                                          label: e.target.value,
                                          value: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_"),
                                        };
                                        handleUpdateSelectedField({ options: nextOptions });
                                      }}
                                      className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextOptions = (selectedField.options || []).filter(
                                          (_, i) => i !== idx
                                        );
                                        handleUpdateSelectedField({ options: nextOptions });
                                      }}
                                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextOptions = [
                                      ...(selectedField.options || []),
                                      {
                                        label: `Option ${(selectedField.options?.length || 0) + 1}`,
                                        value: `opt_${(selectedField.options?.length || 0) + 1}`,
                                      },
                                    ];
                                    handleUpdateSelectedField({ options: nextOptions });
                                  }}
                                  className="text-xs font-bold text-[#1456f0] hover:underline flex items-center gap-1 pt-1"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Option
                                </button>
                              </div>
                            </div>
                          )}

                        {/* Validation Rules */}
                        <div className="space-y-2.5 pt-2.5 border-t border-slate-100">
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                            VALIDATION RULES
                          </label>
                          <div className="space-y-2">
                            <div>
                              <span className="text-[10.5px] font-semibold text-slate-600 block mb-1">
                                Minimum Characters
                              </span>
                              <input
                                type="text"
                                value={selectedField.minCharacters ?? ""}
                                onChange={(e) =>
                                  handleUpdateSelectedField({
                                    minCharacters: e.target.value,
                                  })
                                }
                                placeholder="No minimum"
                                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 text-[#181e25]"
                              />
                            </div>

                            <div>
                              <span className="text-[10.5px] font-semibold text-slate-600 block mb-1">
                                Maximum Characters
                              </span>
                              <input
                                type="text"
                                value={selectedField.maxCharacters ?? ""}
                                onChange={(e) =>
                                  handleUpdateSelectedField({
                                    maxCharacters: e.target.value,
                                  })
                                }
                                placeholder="No maximum"
                                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-[#1456f0]/40 text-[#181e25]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Conditional Logic */}
                        <div className="space-y-2 pt-2.5 border-t border-slate-100">
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                            CONDITIONAL LOGIC
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedField.conditionalLogic?.enabled ?? false}
                              onChange={(e) =>
                                handleUpdateSelectedField({
                                  conditionalLogic: {
                                    ...(selectedField.conditionalLogic || {}),
                                    enabled: e.target.checked,
                                  },
                                })
                              }
                              className="w-4 h-4 rounded border-slate-300 text-[#1456f0] focus:ring-[#1456f0]"
                            />
                            <span className="text-xs text-slate-600">
                              This field depends on another field's value
                            </span>
                          </label>

                          {selectedField.conditionalLogic?.enabled && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs mt-2">
                              <select
                                value={selectedField.conditionalLogic?.dependsOnFieldId || ""}
                                onChange={(e) =>
                                  handleUpdateSelectedField({
                                    conditionalLogic: {
                                      ...(selectedField.conditionalLogic || {}),
                                      dependsOnFieldId: e.target.value,
                                    },
                                  })
                                }
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                              >
                                <option value="">Select dependent field...</option>
                                {allFields
                                  .filter((f) => f.id !== selectedField.id)
                                  .map((f) => (
                                    <option key={f.id} value={f.id}>
                                      {f.label} ({f.name})
                                    </option>
                                  ))}
                              </select>

                              <input
                                type="text"
                                value={selectedField.conditionalLogic?.value || ""}
                                onChange={(e) =>
                                  handleUpdateSelectedField({
                                    conditionalLogic: {
                                      ...(selectedField.conditionalLogic || {}),
                                      value: e.target.value,
                                    },
                                  })
                                }
                                placeholder="Equals value (e.g. Yes)"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
