"use client";

import React from "react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LayoutTemplate } from "lucide-react";

export default function IndustryTemplatesPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <TopBar
        title="Industry Templates"
        subtitle="Pre-configured conversation blueprints, prompt trees, and call journey templates"
        showFilters={false}
        onMenuToggle={onMenuToggle}
      />

      <GlassCard variant="default" rounded="3xl" padding="xl">
        <EmptyState
          icon={LayoutTemplate}
          title="No data yet for Industry Templates"
          description="Browse and deploy pre-built conversation workflows designed for real estate, healthcare, logistics, and retail."
          actionText="Browse Template Library"
          onAction={() => alert("Browse Template Library clicked")}
        />
      </GlassCard>
    </div>
  );
}
