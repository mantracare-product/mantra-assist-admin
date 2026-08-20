"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";
import {
  ChevronsUpDown,
  LogOut,
  Sparkles,
  X,
  Building2,
  Check,
} from "lucide-react";

export interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("Hlmanshu JA");

  const orgs = ["Hlmanshu JA", "Mantra Global Inc", "Apex Enterprise"];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col justify-between
          bg-[#fafafa]/90 backdrop-blur-xl border-r border-slate-200/70
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Branding & Org Switcher */}
        <div className="p-5 flex flex-col gap-4">
          {/* Header Bar with Wordmark and Close Button (Mobile) */}
          <div className="flex items-center justify-between">
            <Link href="/analytics" className="flex items-center py-1">
              <Image
                src="/ma_logo.png"
                alt="Mantra Assist"
                width={170}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-[#222222] hover:bg-slate-100/80 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Org Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className={`
                w-full flex items-center justify-between p-2.5 rounded-2xl
                bg-white/70 hover:bg-white/90 backdrop-blur-md
                border border-white/80 hover:border-white shadow-xs
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#1456f0]/40
                ${isOrgDropdownOpen ? "ring-2 ring-[#1456f0]/40 bg-white" : ""}
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#181e25] text-white flex items-center justify-center font-display font-bold text-xs shadow-xs shrink-0">
                  {selectedOrg.charAt(0)}
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-semibold text-xs text-[#222222] truncate">
                    {selectedOrg}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate">
                    Switch Organization
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Org Dropdown Popover */}
            {isOrgDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white/95 backdrop-blur-xl border border-white/90 rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  Organizations
                </div>
                {orgs.map((org) => (
                  <button
                    key={org}
                    type="button"
                    onClick={() => {
                      setSelectedOrg(org);
                      setIsOrgDropdownOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-xl text-left transition-colors
                      ${
                        selectedOrg === org
                          ? "bg-[#1456f0]/10 text-[#1456f0] font-semibold"
                          : "text-[#45515e] hover:bg-slate-100/80 hover:text-[#222222]"
                      }
                    `}
                  >
                    <span>{org}</span>
                    {selectedOrg === org && <Check className="w-3.5 h-3.5 text-[#1456f0]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle Nav List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8e8e93]">
            Navigation
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/analytics" && pathname === "/");

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#181e25] to-[#2c3e50] text-white shadow-md shadow-slate-900/10 font-semibold"
                        : "text-[#45515e] hover:text-[#222222] hover:bg-white/60 hover:backdrop-blur-sm"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-[#1456f0]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`
                        text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-[#1456f0]"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Pinned Log Out */}
        <div className="p-4 border-t border-slate-200/60">
          <button
            type="button"
            className="
              w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
              text-xs font-semibold text-[#45515e] hover:text-rose-600
              bg-white/60 hover:bg-rose-50/80 backdrop-blur-md
              border border-white/80 hover:border-rose-200/60 shadow-xs
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-rose-500/30
            "
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
