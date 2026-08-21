"use client";

import React, { useState } from "react";
import {
  FormTemplate,
  FormSectionTemplate,
  FormFieldTemplate,
  FormFieldType,
} from "@/lib/types/industry-templates";
import {
  ArrowLeft,
  Settings,
  Link2,
  Inbox,
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
  Sparkles,
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
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    initialForm.sections[0]?.fields[0]?.id || null
  );
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const [showFormSettingsModal, setShowFormSettingsModal] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  if (!isOpen) return null;

  // Flatten all fields across sections for easy access
  const allFields = form.sections.flatMap((s) => s.fields);
  const selectedField = allFields.find((f) => f.id === selectedFieldId) || null;

  // Helper to generate a unique field key
  const generateFieldKey = (label: string) => {
    const slug = label.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${slug || "field"}_${randomSuffix}`;
  };

  // Add field to form (to the first section by default or create one)
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
    setActiveSidebarTab("field_settings");
  };

  // Drag & Drop Handlers
  const handleDragStartFromPalette = (e: React.DragEvent, type: FormFieldType) => {
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDropOnCanvas = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCanvas(false);
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

  // Share link copy
  const handleShareLink = () => {
    navigator.clipboard?.writeText(window.location.origin + `/forms/preview/${form.id}`);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 60% Width Side Drawer (Right-aligned) */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-6 pointer-events-none">
        <div className="w-screen w-full md:w-[60vw] max-w-[60vw] h-full bg-[#f8fafc] shadow-2xl border-l border-slate-200/90 overflow-hidden flex flex-col pointer-events-auto animate-in slide-in-from-right duration-300">
          {/* TOP BAR */}
          <div className="bg-white px-6 py-4 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
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
            <div className="flex items-center gap-2 flex-wrap">
              {/* View Submissions */}
              <button
                type="button"
                onClick={() => alert("Form submissions viewer opened")}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Inbox className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">View Submissions</span>
              </button>

              {/* Share Link */}
              <button
                type="button"
                onClick={handleShareLink}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Link2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedToast ? "Copied!" : "Share Link"}</span>
              </button>

              {/* Form Settings */}
              <button
                type="button"
                onClick={() => setShowFormSettingsModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Settings</span>
              </button>

              {/* Save Changes Button */}
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 rounded-xl bg-[#181e25] hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5 text-slate-300" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* MAIN BODY: 2-Column Canvas + Side Palette */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* LEFT CANVAS WORKSPACE (8 cols in 60vw drawer) */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverCanvas(true);
                }}
                onDragLeave={() => setIsDragOverCanvas(false)}
                onDrop={handleDropOnCanvas}
                className={`lg:col-span-8 bg-white rounded-3xl p-5 border transition-all min-h-[540px] flex flex-col justify-start space-y-3.5 shadow-xs ${
                  isDragOverCanvas
                    ? "border-blue-500 ring-4 ring-blue-500/10 bg-blue-50/20"
                    : "border-slate-200/90"
                }`}
              >
                {/* If Canvas is Empty: Show Dashed Dropzone */}
                {allFields.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/40 text-center space-y-3 min-h-[420px]">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shadow-2xs">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#181e25]">
                        Canvas is empty
                      </h4>
                      <p className="text-xs text-slate-400">
                        Drag fields from the palette here
                      </p>
                    </div>
                  </div>
                ) : (
                  /* List of Fields on Canvas */
                  <div className="space-y-3">
                    {allFields.map((field) => {
                      const isSelected = field.id === selectedFieldId;

                      return (
                        <div
                          key={field.id}
                          onClick={() => {
                            setSelectedFieldId(field.id);
                            setActiveSidebarTab("field_settings");
                          }}
                          className={`
                            group relative p-3.5 rounded-2xl transition-all cursor-pointer border
                            ${
                              isSelected
                                ? "bg-white border-[#1456f0] ring-2 ring-[#1456f0]/20 shadow-sm"
                                : "bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-2xs"
                            }
                          `}
                        >
                          {/* Top Row: Grip Handle, Label, and Action Icons */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
                              <span className="font-bold text-xs text-[#181e25]">
                                {field.label}
                              </span>
                              {field.isRequired && (
                                <span className="text-rose-500 font-bold text-xs">*</span>
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
              </div>

              {/* RIGHT SIDEBAR: Add Fields & Field Settings Tabs (4 cols in 60vw drawer) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                {/* Top 2 Tabs */}
                <div className="grid grid-cols-2 border-b border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab("add_fields")}
                    className={`py-3.5 text-xs font-bold transition-all border-b-2 ${
                      activeSidebarTab === "add_fields"
                        ? "text-[#1456f0] border-[#1456f0] bg-blue-50/20"
                        : "text-slate-500 border-transparent hover:text-slate-800"
                    }`}
                  >
                    Add Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab("field_settings")}
                    className={`py-3.5 text-xs font-bold transition-all border-b-2 ${
                      activeSidebarTab === "field_settings"
                        ? "text-[#1456f0] border-[#1456f0] bg-blue-50/20"
                        : "text-slate-500 border-transparent hover:text-slate-800"
                    }`}
                  >
                    Field Settings
                  </button>
                </div>

                {/* TAB 1: ADD FIELDS PALETTE */}
                {activeSidebarTab === "add_fields" && (
                  <div className="p-4 space-y-3.5">
                    <p className="text-xs text-slate-500">
                      Drag a field to the left to start building your form.
                    </p>

                    <div className="grid grid-cols-2 gap-2 max-h-[520px] overflow-y-auto custom-scrollbar pr-0.5">
                      {PALETTE_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.type}
                            draggable
                            onDragStart={(e) => handleDragStartFromPalette(e, item.type)}
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
                )}

                {/* TAB 2: FIELD SETTINGS (Matching MantraAssist Reference Screenshot 2) */}
                {activeSidebarTab === "field_settings" && (
                  <div className="p-4 space-y-4 max-h-[580px] overflow-y-auto custom-scrollbar">
                    {!selectedField ? (
                      <div className="py-14 text-center space-y-2">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <Type className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-semibold text-slate-600">
                          No field selected
                        </p>
                        <p className="text-[11px] text-slate-400 max-w-[180px] mx-auto">
                          Click any field on the canvas to configure its properties.
                        </p>
                      </div>
                    ) : (
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
                            DESCRIPTION (OPTIONAL)
                          </label>
                          <input
                            type="text"
                            value={selectedField.helperText || ""}
                            onChange={(e) =>
                              handleUpdateSelectedField({
                                helperText: e.target.value,
                              })
                            }
                            placeholder="Add a description"
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

          {/* FORM SETTINGS MODAL */}
          {showFormSettingsModal && (
            <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-[#181e25]">
                    Form Settings
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowFormSettingsModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Submit Button Text</label>
                    <input
                      type="text"
                      value={form.submitButtonText || "Submit Form"}
                      onChange={(e) => setForm({ ...form, submitButtonText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Success Message</label>
                    <input
                      type="text"
                      value={form.successMessage || "Thank you for your submission!"}
                      onChange={(e) => setForm({ ...form, successMessage: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Redirect URL (Optional)</label>
                    <input
                      type="url"
                      value={form.redirectUrl || ""}
                      onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
                      placeholder="https://yourwebsite.com/thank-you"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFormSettingsModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#181e25] text-white font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
