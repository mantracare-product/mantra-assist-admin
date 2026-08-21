# MantraAssist Admin Portal - Project Architecture, Layout & File Structure Guide

> **Document Version**: 1.0.0  
> **Last Updated**: August 2026  
> **Framework & Tech Stack**: Next.js 16.3.1 (App Router), React 19.2.8, Tailwind CSS v4, TypeScript 5, Lucide React, Recharts 3.10.1  

---

## 1. Executive Summary & Architectural Overview

The **MantraAssist Admin Portal** is an enterprise-grade administrative dashboard designed to manage and monitor conversational AI operations, voice call automation, telephony usage, multi-tenant organizations, service setups, billing, and system diagnostics.

### Core Architectural Pillars

1. **Next.js 16 App Router Structure**:
   - Modern directory-based routing utilizing Route Groups `(dashboard)` to isolate dashboard modules with shared styling and navigation while keeping clean URLs (e.g., `src/app/(dashboard)/analytics/page.tsx` maps to `/analytics`).
   - Client-side interactive experiences (`"use client"`) for rich data filtering, drawer side-panels, interactive charts, and responsive navigation.

2. **Design System & Visual Language**:
   - **Clinical Glassmorphism**: Translucent white surfaces with frosted glass blur effects (`backdrop-blur-md`, `backdrop-blur-2xl`), subtle borders (`border-white/80`, `border-slate-200/70`), and soft elevation shadows.
   - **Palette**: Clean canvas backdrop (`#fafafa`), deep navy-to-slate contrast gradient (`linear-gradient(to right, #181e25, #2c3e50)`), electric brand blues (`#1456f0`, `#3b82f6`, `#2563eb`), and semantic status colors (Emerald, Amber, Rose).
   - **Typography**: Dual-font typography hierarchy combining **Outfit** (`--font-outfit` for display titles, metric counts, and bold headers) and **DM Sans** (`--font-dm-sans` for body text, data tables, and navigation items).

3. **Multi-Tenant & Modular Architecture**:
   - Organized into 4 core functional domains: **Overview**, **Setup**, **Corporate**, and **Settings**.
   - Built-in Organization Switcher allowing super-admins and managers to toggle between client workspaces.

---

## 2. Complete File Tree & Directory Map

```text
Mantra_assist_admin/
└── mantra-assist/
    ├── .next/                                # Next.js compilation cache & build output
    ├── node_modules/                         # Node package dependencies
    ├── public/                               # Static media and icons
    │   ├── file.svg                          # Default Next.js vector asset
    │   ├── globe.svg                         # Default Next.js vector asset
    │   ├── ma_logo.png                       # Primary MantraAssist brand logo
    │   ├── next.svg                          # Next.js branding SVG
    │   ├── vercel.svg                        # Vercel branding SVG
    │   └── window.svg                        # Default Next.js vector asset
    ├── src/
    │   ├── app/                              # Next.js App Router Root
    │   │   ├── (dashboard)/                  # Dashboard Route Group (Clean URL mappings)
    │   │   │   ├── analytics/
    │   │   │   │   └── page.tsx              # Analytics dashboard (Funnel, Metrics, Charts)
    │   │   │   ├── call-logs/
    │   │   │   │   └── page.tsx              # Telephony call records & session transcripts
    │   │   │   ├── campaigns/
    │   │   │   │   └── page.tsx              # Voice AI outreach & broadcast campaigns
    │   │   │   ├── credits/
    │   │   │   │   └── page.tsx              # Credit balances, refill packs & transactions
    │   │   │   ├── custom-fields/
    │   │   │   │   └── page.tsx              # Dynamic entity custom fields configuration
    │   │   │   ├── document-templates/
    │   │   │   │   └── page.tsx              # Document & contract template generators
    │   │   │   ├── forms/
    │   │   │   │   └── page.tsx              # Dynamic intake forms and survey builders
    │   │   │   ├── industry/
    │   │   │   │   └── page.tsx              # Industry services alias/redirect page
    │   │   │   ├── industry-category/
    │   │   │   │   └── page.tsx              # Vertical industry categories management
    │   │   │   ├── industry-services/
    │   │   │   │   └── page.tsx              # Industry services master catalogue & drawer
    │   │   │   ├── industry-templates/
    │   │   │   │   └── page.tsx              # Preconfigured industry workflow templates
    │   │   │   ├── integrations/
    │   │   │   │   └── page.tsx              # CRM, Webhook & SIP telephony connectors
    │   │   │   ├── orders/
    │   │   │   │   └── page.tsx              # Subscription & credit purchase order records
    │   │   │   ├── organizations/
    │   │   │   │   └── page.tsx              # Multi-tenant corporate client accounts
    │   │   │   ├── plans/
    │   │   │   │   └── page.tsx              # Pricing plans, credit tiers & feature flags
    │   │   │   ├── subscriptions/
    │   │   │   │   └── page.tsx              # Recurring client subscription management
    │   │   │   ├── system-logs/
    │   │   │   │   └── page.tsx              # System audit trails, error traces & API logs
    │   │   │   ├── usages/
    │   │   │   │   └── page.tsx              # LiveKit, Dogra & Cartesia AI engine usage
    │   │   │   └── user-management/
    │   │   │       └── page.tsx              # Admin user accounts, roles & permissions
    │   │   ├── favicon.ico                   # Browser favicon
    │   │   ├── globals.css                   # Tailwind CSS v4 theme, fonts, custom glass styles
    │   │   ├── layout.tsx                    # Root Layout with Font loaders & DashboardShell wrapper
    │   │   └── page.tsx                      # Root index (Redirects automatically to /analytics)
    │   ├── components/
    │   │   ├── charts/                       # Data visualization components (Recharts)
    │   │   │   ├── DistributionChart.tsx     # Donut / Pie distribution visualization
    │   │   │   └── TrendChart.tsx            # Area / Line volume trend visualization
    │   │   ├── layout/                       # Structural app layout wrappers
    │   │   │   ├── AdminSidebar.tsx          # Slide-out collapsible navigation drawer
    │   │   │   ├── DashboardShell.tsx        # Top navbar header + main responsive content wrapper
    │   │   │   └── TopBar.tsx                # Page header, breadcrumb titles & 4 filter dropdowns
    │   └── ui/                               # Reusable UI component library
    │       ├── CustomSelect.tsx              # Custom glass dropdown selector with search
    │       ├── EmptyState.tsx                # Standard empty data / no-results placeholder
    │       ├── FilterDropdown.tsx            # Glass pill filter with popover menu
    │       ├── GlassCard.tsx                 # Standard frosted-glass container wrapper
    │       ├── Pill.tsx                      # Status tag / badge component with color variants
    │       ├── ProgressRow.tsx               # Call funnel horizontal progress visualizer
    │       ├── SideDrawer.tsx                # Slide-over edit/create modal drawer
    │       └── StatCard.tsx                  # KPI metric display card with icon & badge
    │   └── lib/                              # Core utilities, types, and navigation config
    │       ├── nav-items.ts                  # Master navigation hierarchy and route metadata
    │       └── types.ts                      # Shared TypeScript interfaces and type models
    ├── .gitignore                            # Git ignore rules
    ├── AGENTS.md                             # Agent guidelines & Next.js conventions
    ├── CLAUDE.md                             # Project developer notes
    ├── Design.md                             # Comprehensive Design System specifications
    ├── eslint.config.mjs                     # ESLint v9 configuration
    ├── next.config.ts                        # Next.js framework configuration
    ├── package.json                          # Dependencies and NPM script definitions
    ├── postcss.config.mjs                    # PostCSS configuration with Tailwind v4
    ├── README.md                             # Project overview and getting started guide
    └── tsconfig.json                         # TypeScript compiler configuration
```

---

## 3. Global Layout & Navigation System

```
+-----------------------------------------------------------------------------------+
|  [☰]  MantraAssist Logo                        (Sticky Top Bar - 56px / h-14)    |
+-----------------------------------------------------------------------------------+
| +-------------------------+ +---------------------------------------------------+ |
| | [Org Switcher ▾]        | | TopBar: [Page Title]   [Process▾] [Stage▾] [Date▾]| |
| |                         | |                                                   | |
| | ▼ OVERVIEW              | | +-----------------------------------------------+ | |
| |   • Orders              | | | Stat Cards (4-Column Grid)                    | | |
| |   • Subscriptions       | | +-----------------------------------------------+ | |
| |   • Call logs           | |                                                   | |
| |   • Credits             | | +-----------------------+ +---------------------+ | |
| |   • Usages              | | | Progress Funnel /     | | Charts / Data Table | | |
| |                         | | | Master Form           | | Visualizations      | | |
| | ▼ SETUP                 | | +-----------------------+ +---------------------+ | |
| |   • Industry Category   | |                                                   | |
| |   • Industry            | |                                                   | |
| |   • Process Templates   | |                                                   | |
| |   • Forms               | |                                                   | |
| |   • Document Templates  | |                                                   | |
| |   • Custom Fields       | |                                                   | |
| |                         | |                                                   | |
| | ▼ CORPORATE             | |                                                   | |
| |   • Organizations       | |                                                   | |
| |   • Analytics           | |                                                   | |
| |                         | |                                                   | |
| | ▼ SETTINGS              | |                                                   | |
| |   • Plans               | |                                                   | |
| |   • Integration         | |                                                   | |
| |   • User Management     | |                                                   | |
| |   • Logs                | |                                                   | |
| |   • Campaigns           | |                                                   | |
| |                         | |                                                   | |
| | [⎋ Log out]             | |                                                   | |
| +-------------------------+ +---------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Layout Components Breakdown

#### 1. `src/app/layout.tsx` (Root Layout)
- Loads Google Fonts via `next/font/google`:
  - **DM Sans** (`--font-dm-sans`) for standard text, UI controls, navigation, and tables.
  - **Outfit** (`--font-outfit`) for display headings, statistics numbers, and brand accents.
- Wraps all dashboard children inside the `<DashboardShell>`.
- Applies global canvas background `#fafafa` and base font styling.

#### 2. `src/components/layout/DashboardShell.tsx` (Master Application Shell)
- **Top Header Bar (`<header>`)**: Fixed at `h-14` (56px) with a frosted backdrop (`bg-white/85 backdrop-blur-md border-b border-slate-200/70`). Features:
  - Hamburger toggle button (`Menu` icon) that toggles the slide-out navigation sidebar.
  - Brand Logo image (`/ma_logo.png`) linking directly to the analytics overview.
- **Collapsible Sidebar Trigger**: Manages `isSidebarOpen` state across mobile and desktop.
- **Main Viewport Wrapper (`<main>`)**: Max-width container (`max-w-[1600px] mx-auto`) with responsive padding (`p-4 sm:p-6 md:p-8`).

#### 3. `src/components/layout/AdminSidebar.tsx` (Navigation Drawer)
- **Slide-out Drawer Animation**: Positioned below the top header (`top-14 bottom-0 left-0 w-72`), smoothly translating on and off-screen. Includes a frosted backdrop overlay (`bg-slate-900/30 backdrop-blur-xs`).
- **Organization Switcher Pill**: Top popover selector allowing administrators to quickly switch between enterprise client accounts (`Hlmanshu JA`, `Mantra Global Inc`, `Apex Enterprise`).
- **Accordion Groups**: Features 4 collapsible navigation categories with chevron toggles, keeping active sections prominent.
- **Active Navigation Highlighting**: Active route items are styled with a gradient pill (`bg-gradient-to-r from-[#181e25] to-[#2c3e50] text-white shadow-sm font-semibold`), while inactive items have subtle hover effects.
- **Bottom Fixed Action**: Pinned **Log Out** button with rose-colored hover effects.

#### 4. `src/components/layout/TopBar.tsx` (Page Context Header)
- **Header Titles**: Left section displaying the dynamic `title` (H1 font-display) and `subtitle`.
- **4 Standard Filter Dropdowns**: Right-aligned quick filters used across analytics and data views:
  1. **Process**: (`All Processes`, `Lead Qualification`, `Order Confirmation`, `Customer Support`, `Appointment Booking`)
  2. **Stage**: (`All Stages`, `Initiated`, `Connected`, `Completed`, `Transferred`)
  3. **Date**: (`Last 7 Days`, `Today`, `Yesterday`, `Last 30 Days`, `This Month`)
  4. **Call Type**: (`All Call Types`, `Inbound AI`, `Outbound Lead`, `Escalated`)
- **Refresh Action**: Optional refresh icon button to trigger dynamic dataset updates.

---

## 4. Master Navigation Structure & Route Definitions

Defined in `src/lib/nav-items.ts`:

| Group | Route Item | Route Path | Icon Component | Purpose & Description |
| :--- | :--- | :--- | :--- | :--- |
| **Overview** | **Orders** | `/orders` | `ShoppingCart` | Purchase history of credits and plan packages |
| | **Subscriptions** | `/subscriptions` | `CreditCard` | Recurring organization subscriptions and billing terms |
| | **Calls logs** | `/call-logs` | `PhoneCall` | Inbound/outbound telephony call traces and recordings |
| | **Credits/ transactions** | `/credits` | `Coins` | Credit wallet ledger, consumption, and balance top-ups |
| | **Usages (LiveKit / Dogra, Cartesia)** | `/usages` | `Cpu` | Model telemetry (LiveKit audio streaming, TTS, STT) |
| **Setup** | **Industry Category** | `/industry-category` | `FolderTree` | High-level business vertical classification |
| | **Industry** | `/industry-services` | `Briefcase` | Specific industries and associated voice workflow templates |
| | **Process templates** | `/industry-templates`| `LayoutTemplate` | Automated telephony dialogue trees and workflows |
| | **Forms** | `/forms` | `CheckSquare` | Dynamic lead collection questionnaires |
| | **Document Templates** | `/document-templates`| `FileCode` | Document generation templates and placeholders |
| | **Custom Fields** | `/custom-fields` | `SlidersHorizontal`| Custom metadata attributes for organizations |
| **Corporate**| **Organizations** | `/organizations` | `Building2` | Multi-tenant client organizations and settings |
| | **Analytics** | `/analytics` | `BarChart3` | Executive dashboard KPI metrics, funnels, and charts |
| **Settings** | **Plans** | `/plans` | `CreditCard` | Platform subscription tiers, limits, and pricing |
| | **Integration** | `/integrations` | `Network` | Webhook endpoints, CRMs, and SIP gateway connections |
| | **User Management** | `/user-management` | `Users` | Admin staff, access permissions, and role assignment |
| | **Logs** | `/system-logs` | `ScrollText` | Security event logs, API request traces, and errors |
| | **Campaigns** | `/campaigns` | `Megaphone` | Outbound voice blast campaigns and agent broadcasts |

---

## 5. UI Component Library & Charting System

Located under `src/components/ui/` and `src/components/charts/`:

### 1. UI Components (`src/components/ui/`)

- **`GlassCard.tsx`**: The foundational container for all dashboard panels. Provides frosted glass blur (`bg-white/60 backdrop-blur-md`), light borders (`border-white/60`), and rounded geometry (`rounded-[28px]`). Offers regular, subtle, and elevated variants.
- **`StatCard.tsx`**: KPI metric card featuring an icon badge, title label, bold value formatted in Outfit font, subtext, and percentage growth pill.
- **`ProgressRow.tsx`**: Visual funnel bar displaying call conversion drop-offs with custom linear gradients and percentage badges.
- **`Pill.tsx`**: Standard status badge with semantic variants (`brand`, `success`, `warning`, `danger`, `neutral`, `purple`).
- **`SideDrawer.tsx`**: Full-height slide-over drawer modal with frosted backdrop, body scroll locking, escape-key listener, and sticky header/footer actions. Used for creating and editing records.
- **`CustomSelect.tsx`**: Glass-styled dropdown input supporting search filtering, custom icons, option badges, and clear selections.
- **`FilterDropdown.tsx`**: Compact glass dropdown button with popover options menu used in top filter bars.
- **`EmptyState.tsx`**: Standardized placeholder displayed when search filters return zero records.

### 2. Chart Components (`src/components/charts/`)

- **`TrendChart.tsx`**: Responsive Recharts Area/Line visualization showcasing call volume trends over time (Completed vs Total Calls) with custom SVG linear gradient fills and interactive tooltips.
- **`DistributionChart.tsx`**: Recharts Donut/Pie visualization illustrating call outcome breakdowns (e.g., Completed, Incomplete, Failed, Transferred) with center metric labels and an interactive legend.

---

## 6. Design System Tokens & Styling Specifications

Defined in `src/app/globals.css` and `Design.md`:

### 1. Color Palette Tokens

```css
/* Canvas & Surfaces */
--canvas-bg: #fafafa;
--glass-base: rgba(255, 255, 255, 0.6);
--glass-subtle: rgba(255, 255, 255, 0.3);
--glass-toolbar: rgba(255, 255, 255, 0.45);
--glass-border: rgba(255, 255, 255, 0.5);

/* Typography & Text */
--text-primary: #222222;       /* H1, H2, Key Metrics */
--text-body: #45515e;          /* Body text, table rows */
--text-muted: #64748b;         /* Subtitles, secondary descriptions */
--text-subtle: #94a3b8;        /* Placeholder text, table column headers */
--text-ultra-muted: #8e8e93;   /* Sidebar group titles */

/* Brand & Accents */
--brand-primary: #1456f0;      /* Primary interactive blue */
--brand-accent: #3b82f6;       /* Light blue accent */
--brand-deep: #2563eb;         /* Deep blue headers */
--brand-light: #60a5fa;        /* Subtle sky blue highlights */

/* Contrast Focal Gradients */
--navy-dark: #181e25;          /* Start of dark gradient */
--navy-slate: #2c3e50;         /* End of dark gradient */

/* Status Colors */
--status-success: #10b981;     /* Emerald green */
--status-warning: #f59e0b;     /* Amber */
--status-danger: #ef4444;      /* Rose red */
```

### 2. Table Header Standardization

All data tables throughout the administrative portal utilize a unified dark-slate theme matching the active sidebar navigation pill:

```css
thead,
.table-header-theme {
  background: linear-gradient(to right, #181e25, #2c3e50) !important;
  color: #ffffff !important;
}

thead th,
.table-header-theme th {
  color: #ffffff !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  font-size: 11px !important;
  letter-spacing: 0.05em !important;
}
```

---

## 7. Development & Runtime Guidelines

### Running the Application Locally
```bash
# Navigate to the project directory
cd mantra-assist

# Install dependencies (if not already installed)
npm install

# Start Next.js development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Key Conventions
1. **Never use pure `#000000`**: Always use `#222222` for high-contrast dark text and `#181e25` for dark solid or gradient surfaces.
2. **Font Family Rules**: Always ensure headings and metric counts use `font-display` (`Outfit`), while body text, table cells, form inputs, and navigation use `font-sans` (`DM Sans`).
3. **Pill Buttons & Rounded Corners**: Action buttons must use pill shapes (`rounded-full`), while data cards use smooth glass rounding (`rounded-2xl` to `rounded-[28px]`).
4. **Interactive Drawers**: Use the `SideDrawer` component for any record creation or edit modal workflows to ensure consistent animations and keyboard accessibility.
