"use client";

import React, { useState } from "react";
import { DocumentTemplate, DocumentType } from "@/lib/types/industry-templates";
import { Pill } from "@/components/ui/Pill";
import {
  X,
  Plus,
  Trash2,
  FileCode,
  Sparkles,
  Tag,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Code2,
} from "lucide-react";

interface DocumentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentTemplate;
  onSave: (doc: DocumentTemplate) => void;
}

export const DocumentEditorModal: React.FC<DocumentEditorModalProps> = ({
  isOpen,
  onClose,
  document: initialDoc,
  onSave,
}) => {
  const [doc, setDoc] = useState<DocumentTemplate>(initialDoc);
  const [newTrigger, setNewTrigger] = useState("");
  const [newTag, setNewTag] = useState("");
  const [previewMode, setPreviewMode] = useState<"split" | "edit" | "preview">("split");

  if (!isOpen) return null;

  const handleAddTrigger = () => {
    if (newTrigger.trim()) {
      setDoc({
        ...doc,
        keyQueryTriggers: [...doc.keyQueryTriggers, newTrigger.trim()],
      });
      setNewTrigger("");
    }
  };

  const handleRemoveTrigger = (index: number) => {
    setDoc({
      ...doc,
      keyQueryTriggers: doc.keyQueryTriggers.filter((_, i) => i !== index),
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !doc.tags.includes(newTag.trim())) {
      setDoc({
        ...doc,
        tags: [...doc.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setDoc({
      ...doc,
      tags: doc.tags.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fafafa] w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#181e25] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <FileCode className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[#181e25]">
                  {doc.title}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                  {doc.docType}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Industry Knowledge Base & AI Receptionist Grounding Blueprint
              </p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setPreviewMode("edit")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${previewMode === "edit" ? "bg-white text-[#181e25] shadow-xs" : "text-slate-500"
                  }`}
              >
                Markdown Editor
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("split")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${previewMode === "split" ? "bg-white text-[#181e25] shadow-xs" : "text-slate-500"
                  }`}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("preview")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${previewMode === "preview" ? "bg-white text-[#181e25] shadow-xs" : "text-slate-500"
                  }`}
              >
                Rendered Preview
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          {/* Metadata & Tagging Row */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Document Title
                </label>
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1456f0]/40 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Document Category
                </label>
                <select
                  value={doc.docType}
                  onChange={(e) => setDoc({ ...doc, docType: e.target.value as DocumentType })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1456f0]/40 outline-none"
                >
                  <option value="faq">FAQ (Frequently Asked Questions)</option>
                  <option value="policy">Policy & Office Terms</option>
                  <option value="guidelines">Clinical / Service Guidelines</option>
                  <option value="aftercare">Preparation & Aftercare Instructions</option>
                  <option value="pricing">Pricing & Insurance Coverage</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-600" />
                Knowledge Tags
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag..."
                    className="px-2.5 py-1 text-xs bg-slate-50 border rounded-lg w-28"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Semantic Query Triggers Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#181e25] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI Voice Semantic Query Triggers ({doc.keyQueryTriggers.length})
              </span>
            </div>
            <p className="text-xs text-slate-500">
              When a caller asks questions matching these conversational intents, the AI will ground its response in this document.
            </p>

            <div className="space-y-1.5">
              {doc.keyQueryTriggers.map((trig, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
                >
                  <span className="italic font-medium">"{trig}"</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrigger(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTrigger())}
                  placeholder="e.g. Do you accept emergency walk-in patients?"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <Pill variant="ghost" size="sm" onClick={handleAddTrigger} className="font-semibold">
                  Add Trigger
                </Pill>
              </div>
            </div>
          </div>

          {/* Markdown Editor & Render Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Document Markdown Content & Knowledge Rules
            </label>

            <div
              className={`grid gap-4 ${previewMode === "split"
                  ? "grid-cols-1 lg:grid-cols-2"
                  : previewMode === "edit"
                    ? "grid-cols-1"
                    : "grid-cols-1"
                }`}
            >
              {(previewMode === "split" || previewMode === "edit") && (
                <textarea
                  rows={14}
                  value={doc.markdownContent}
                  onChange={(e) => setDoc({ ...doc, markdownContent: e.target.value })}
                  placeholder="# Markdown Content..."
                  className="w-full p-4 text-xs font-mono bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1456f0]/40 outline-none leading-relaxed"
                />
              )}

              {(previewMode === "split" || previewMode === "preview") && (
                <div className="p-5 bg-white border border-slate-200 rounded-2xl overflow-y-auto max-h-[350px] prose prose-sm prose-slate max-w-none text-xs leading-relaxed">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b pb-2 mb-3">
                    Rendered AI Knowledge Preview
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: doc.markdownContent
                        .replace(/^### (.*$)/gim, '<h3 class="font-bold text-sm text-[#181e25] mt-2 mb-1">$1</h3>')
                        .replace(/^#### (.*$)/gim, '<h4 class="font-semibold text-xs text-slate-700 mt-2 mb-1">$1</h4>')
                        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-[#181e25]">$1</strong>')
                        .replace(/\n/gim, '<br/>'),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <Pill variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Pill>
          <Pill
            variant="navy"
            size="md"
            onClick={() => {
              onSave(doc);
              onClose();
            }}
          >
            Save Document Blueprint
          </Pill>
        </div>
      </div>
    </div>
  );
};
