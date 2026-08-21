"use client";

import React, { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pill } from "@/components/ui/Pill";
import { useIndustryTemplateStore } from "@/lib/industry-template-store";
import { DocumentTemplate, DocumentType } from "@/lib/types/industry-templates";
import { DocumentEditorModal } from "@/components/industry-templates/DocumentEditorModal";
import {
  FileCode,
  Search,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Tag,
  BookOpen,
  HelpCircle,
} from "lucide-react";

export default function DocumentTemplatesPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { allDocs, saveDocumentTemplate, deleteDocumentTemplate, bundles } =
    useIndustryTemplateStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");

  // Document Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentTemplate | null>(null);

  // Filtered docs
  const filteredDocs = useMemo(() => {
    return allDocs.filter((d) => {
      const matchType =
        selectedTypeFilter === "All" || d.docType === selectedTypeFilter;
      const matchSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.industryName && d.industryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.markdownContent.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [allDocs, selectedTypeFilter, searchQuery]);

  const handleOpenCreateDoc = () => {
    const newDoc: DocumentTemplate = {
      id: `doc-${Date.now()}`,
      industryId: bundles[0]?.id || "ind-general",
      industryName: bundles[0]?.industryName || "General",
      title: "New Knowledge Base Document & FAQ",
      docType: "faq",
      tags: ["General", "AI Receptionist"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      keyQueryTriggers: ["What are your office hours?"],
      suggestedAnswers: "Our standard office hours are 9:00 AM to 5:00 PM Monday through Friday.",
      markdownContent: `### Office Hours & Contact Policy\n\n- **Operating Hours**: Monday - Friday, 9:00 AM - 5:00 PM\n- **Emergency Inquiries**: Handled 24/7 via automated triage.`,
    };
    setSelectedDoc(newDoc);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <TopBar
        title="Knowledge Base & Document Blueprints"
        subtitle="Manage verified clinical FAQs, office policies, aftercare protocols, and pricing references grounded in tenant AI brains."
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
              placeholder="Search documents by title, keyword trigger, or tags..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl placeholder:text-slate-400 text-[#222222] shadow-xs outline-none focus:ring-2 focus:ring-[#1456f0]/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <Pill
              variant="navy"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreateDoc}
            >
              Add Document
            </Pill>
          </div>
        </div>

        {/* Doc Type Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {["All", "faq", "policy", "guidelines", "aftercare", "pricing"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border ${selectedTypeFilter === t
                  ? "bg-[#1456f0] text-white border-transparent shadow-xs"
                  : "bg-white/80 hover:bg-white text-slate-600 border-slate-200/80"
                }`}
            >
              {t === "All" ? "All Documents" : t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Document Templates Data Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/50 backdrop-blur-md shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-[#181e25] to-[#2c3e50] text-white">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-left w-[36%]">
                    Document Title & Industry
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-left w-[18%]">
                    Doc Type
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-left w-[20%]">
                    Knowledge Tags
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[14%]">
                    Voice Query Triggers
                  </th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-[12%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm">
                      No document templates match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-white/80 transition-colors duration-150 group"
                    >
                      {/* 1. Document Title & Industry */}
                      <td className="px-5 py-4 align-middle">
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setIsEditorOpen(true);
                            }}
                            className="font-bold text-sm text-[#181e25] hover:text-[#1456f0] transition-colors text-left group-hover:underline block truncate"
                          >
                            {doc.title}
                          </button>
                          {doc.industryName && (
                            <span className="text-[11px] text-slate-400 font-semibold block truncate">
                              {doc.industryName}
                            </span>
                          )}
                          <p className="text-xs text-slate-500 italic line-clamp-1">
                            "{doc.keyQueryTriggers[0] || "General intent trigger"}"
                          </p>
                        </div>
                      </td>

                      {/* 2. Doc Type */}
                      <td className="px-4 py-4 align-middle">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/70 font-semibold text-xs shadow-2xs uppercase">
                          {doc.docType}
                        </span>
                      </td>

                      {/* 3. Knowledge Tags */}
                      <td className="px-4 py-4 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                            >
                              #{tag}
                            </span>
                          ))}
                          {doc.tags.length > 3 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                              +{doc.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 4. Query Triggers Count */}
                      <td className="px-4 py-4 align-middle text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-mono text-xs font-bold">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          {doc.keyQueryTriggers.length} Triggers
                        </span>
                      </td>

                      {/* 5. Actions */}
                      <td className="px-4 py-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 bg-white/80 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setIsEditorOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-[#1456f0] hover:bg-blue-50 transition-colors"
                            title="Edit Markdown Document"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete document template "${doc.title}"?`)) {
                                deleteDocumentTemplate(doc.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Document"
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

      {/* Markdown Document Editor Modal */}
      {isEditorOpen && selectedDoc && (
        <DocumentEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          document={selectedDoc}
          onSave={(saved) => saveDocumentTemplate(saved)}
        />
      )}
    </div>
  );
}
