# Super Admin System: Industry Templates, Process Settings, Web Forms & Document Provisioning

> **Role & Purpose**: This document serves as the master prompt and specification for building the **Super Admin Industry Template & Provisioning System** for MantraAssist. It defines the complete architecture, UI/UX workflows, data structures, and onboarding auto-population mechanisms for industry-tailored SaaS configurations.

---

## 1. Executive Summary & Objective

In MantraAssist, when a new business/tenant signs up during onboarding and chooses their **Industry Category** and **Specific Industry** (e.g., *Healthcare & Medical → Dental Clinic*, *Legal Services → Personal Injury Law*, *Real Estate → Residential Brokerage*), the platform must immediately auto-provision a complete **Turnkey Starter Workspace**.

This starter workspace must come preloaded with:
1. **Process & Stage Templates** (Standard operational call journeys with customized AI greetings, pitches, and stage parameters — strictly using **Basic** and **Advanced** configurations).
2. **Web Form Templates** (Industry-tailored lead capture, appointment booking, intake, and feedback forms).
3. **Document & Knowledge Base Templates** (Pre-filled FAQs, operational policies, service preparation guidelines, and pricing references for the AI receptionist).
4. **Default Services & Custom CRM Fields** (Industry-specific service offerings and client metadata fields).

To enable this, the **Super Admin Console** provides an intuitive, high-power management suite where admins can curate, customize, version, test, and publish these Industry Templates.

---

## 2. Core Constraints & Design Directives

### 2.1 Process Settings Scope in Super Admin
- **Included Tabs**:
  - **Basic Tab**: Stage Call Action types, Linked phone behavior, Greeting Phrase script template (with dynamic variable placeholders), Caller Pitch / Agent persona script template, Stage Goal/Objective.
  - **Advanced Tab**: AI Model selection & voice speed overrides, Call duration limits & wrap-up windows, Automated retry rules, Skip day rules (weekends/holidays), Voicemail detection toggle, Recording toggles.
- **Explicitly Excluded Tabs**:
  - ❌ **Automations Tab**: Excluded from Admin template builder to keep starter packs robust, deterministic, and prevent external integration dependencies (e.g., 3rd party webhooks, custom SMS triggers).
  - ❌ **Flow Builder Tab**: Excluded from Admin template builder to maintain clean, linear conversational defaults that tenants can later expand in their tenant-level workspace.

### 2.2 Hierarchical Taxonomy
- **Industry Category** (Level 1): Broad vertical (e.g., `Healthcare & Wellness`, `Home Services & Contracting`, `Legal & Professional`, `Real Estate & Property`, `Financial & Insurance`, `Automotive & Transport`, `Education & Training`, `Hospitality & Leisure`).
- **Specific Industry / Niche** (Level 2): Targeted business model (e.g., under *Healthcare*: `Dental Clinic`, `Mental Health / Psychiatry`, `Physical Therapy`, `MedSpa & Aesthetics`, `Dermatology`, `Veterinary Clinic`, `Urgent Care`).

---

## 3. Detailed Component Architecture

```
                                  SUPER ADMIN CONSOLE
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
│ Industry Engine │               │ Template Studio │               │ Publishing Hub  │
│ ─────────────── │               │ ─────────────── │               │ ─────────────── │
│ • Categories    │ ─────────────►│ • Processes     │ ─────────────►│ • Versioning    │
│ • Sub-industries│               │ • Web Forms     │               │ • Live Deploy   │
│ • Icon & Badges │               │ • Documents/KB  │               │ • Tenant Sync   │
│ • Status Active │               │ • Custom Fields │               │ • Seed Bundles  │
└─────────────────┘               └─────────────────┘               └─────────────────┘
                                           │
                                           ▼
                                 ONBOARDING PROVISIONER
                                           │
                    Tenant selects "Healthcare -> Dental Clinic"
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
│ Process Created │               │ Web Forms Built │               │ KB Loaded       │
│ • Patient Flow  │               │ • New Patient   │               │ • Dental FAQs   │
│ • Basic + Adv   │               │ • Smile Consult │               │ • Post-Op Guide │
└─────────────────┘               └─────────────────┘               └─────────────────┘
```

---

## 4. Super Admin Feature Specifications

### 4.1 Industry Category & Sub-Industry Manager
Admin interface allowing Super Admins to define the industry directory:
- **Category List & Card Grid**: Name, Description, Icon (Lucide icon set), Status (`Active`, `Draft`, `Archived`), and Linked Industries count.
- **Industry Sub-items**:
  - Industry Name (e.g., "Dental Practice")
  - System Slug (e.g., `dental-practice`)
  - Description & Target Audience
  - Recommended AI Persona Tone (e.g., "Empathetic, Clinical, Professional")
  - Badges (e.g., "Popular", "New", "HIPAA Compliant")
  - Template Status indicator (e.g., `Complete (4/4 modules)`, `Incomplete (2/4 modules)`)

---

### 4.2 Module 1: Process & Stage Template Builder
Enables Super Admins to build the default telephony and AI calling roadmap for the industry.

#### A. Process-Level Global Defaults
- **Process Title & Description**: (e.g., "Dental Inbound Intake & Follow-up Journey").
- **Global AI Voice & Model**: Default Model (`Gemini 2.5 Flash`, `GPT-4o Mini`, `Deepseek V4 Flash`), Voice Speed (`0.8x` to `1.4x`), Voice Tone (`Warm Female`, `Calm Male`, etc.).
- **Global Call Duration & Wrap-up**: Max call duration (e.g., `6 mins`) and wrap-up notice (e.g., `60 secs`).
- **Global Retry Rules**: Default retry limit (e.g., `3 attempts`), delay between retries (e.g., `45 mins`).
- **Global Skip Day Rules**: Weekends (`Saturday`, `Sunday`) and national holidays default toggle.
- **Global Voicemail Detection**: Auto-hangup on answering machine detection toggle.
- **Global Recording & Transcription**: Call recording enabled by default.

#### B. Stage-Level Configurations (Linear Stages)
Admins define the multi-stage pipeline (e.g., `Stage 1: New Patient Inbound`, `Stage 2: Consultation Booking`, `Stage 3: Pre-Appointment Intake`, `Stage 4: Post-Op Care Check`).

Each stage contains **strictly two tabs**:

##### 1. Basic Tab
- **Stage Name & Code**: (e.g., "New Patient Inbound", `STG_NEW_PT`).
- **Stage Purpose / Goal**: Short summary of what this stage accomplishes.
- **Call Action Type**:
  - `AI Receives Calls` (Inbound Receptionist)
  - `AI Makes Calls` (Automated Outbound Outreach)
  - `Transfer to Human` (Live warm transfer)
  - `No Call Activity` (Information / Wait stage)
- **Greeting Phrase Script Editor**:
  - The exact opening line spoken by the AI when the call connects.
  - Supports dynamic template variables: `{{client_name}}`, `{{business_name}}`, `{{service_name}}`, `{{appointment_time}}`.
  - *Example*: *"Thank you for calling {{business_name}}. My name is Sarah, your AI care coordinator. Are you calling to book a new appointment or do you have a question about an existing visit?"*
- **Caller Pitch & Prompt Editor**:
  - Comprehensive system instruction guidelines for the AI in this stage.
  - Persona constraints, objection handling guidance, and mandatory data collection requirements (e.g., full name, DOB, insurance carrier, primary concern).

##### 2. Advanced Tab (Stage-Level Overrides)
- **AI Model & Speech Rate Override**: Toggle to override process defaults for this stage if higher reasoning is required.
- **Call Duration Override**: Stage-specific time limits.
- **Retry Logic Override**: Specific retry counts and intervals for this stage.
- **Skip Day Override**: Ability to enable weekend calling for urgent stages (e.g., Emergency triage or Post-Op Follow-up).
- **Voicemail Handling Override**: Option to leave an automated voicemail message script or hang up immediately.

---

### 4.3 Module 2: Web Forms & Form Template Builder
Enables Super Admins to design turnkey web forms tailored to the selected industry.

- **Form Template Metadata**:
  - Form Title (e.g., "Dental Patient Intake & Medical History")
  - Category / Intent: `Lead Capture`, `Patient Intake`, `Appointment Booking`, `Quote Request`, `Feedback / Review`
  - Estimated Completion Time (e.g., "3 minutes")
  - Public Slug template (e.g., `/f/{{org_slug}}/new-patient-intake`)
- **Visual Drag-and-Drop Form Canvas**:
  - Form Sections (e.g., *Personal Information*, *Dental History*, *Insurance & Billing*, *Consent & Signature*)
  - Supported Field Types:
    - Text (`Single Line`, `Multi-line Text Area`)
    - Contact (`Email`, `Phone Number` with country code)
    - Date & Time (`Date Picker`, `Time Slot Selector`)
    - Options (`Dropdown`, `Radio Group`, `Multi-select Checkbox`)
    - Numeric & Currency
    - File / Document Upload (e.g., insurance card photo, ID)
    - Electronic Signature pad
  - Field Configuration:
    - Label, Placeholder, Helper Text, Default Value
    - Required Validation toggle
    - Target CRM Field Mapping (e.g., map "Preferred Date" → `appointment_requested_date`)
- **Submission & Success Handling**:
  - Custom Thank You Message / Redirect URL
  - Auto-create Client Profile toggle
  - Notification Email & SMS alert template

---

### 4.4 Module 3: Document & Knowledge Base Template Library
Enables Super Admins to preload verified, industry-standard knowledge documents into the tenant's AI brain.

- **Document Metadata**:
  - Document Title (e.g., "Comprehensive Dental Services, Pricing & Insurance FAQ")
  - Document Type: `FAQ`, `Policy & Terms`, `Clinical / Service Guidelines`, `Preparation & Aftercare`, `Objection Handling Guide`
  - Tags (e.g., `Dental`, `Inbound AI`, `Insurance`, `Emergency`)
- **Rich Document Content Editor**:
  - Pre-written, high-quality markdown content covering:
    - Common customer/patient questions and direct answers
    - Office hours, cancellation policies, late fee guidelines
    - Insurance copay rules and accepted provider networks
    - Emergency protocols (e.g., what to do if severe toothache occurs)
    - Preparation instructions (e.g., fasting before sedation, bringing ID)
- **AI Retrieval Optimization**:
  - Key query triggers (e.g., "Do you take Delta Dental?", "How much is teeth cleaning?", "Can I do same-day crown?")
  - Suggested answers and escalation thresholds for human handoff.

---

### 4.5 Module 4: Services Catalog & Custom Field Templates
- **Default Services List**:
  - Service Name (e.g., "Routine Cleaning & Exam", "Emergency Dental Consultation", "Teeth Whitening")
  - Default Duration (e.g., `45 mins`, `30 mins`, `60 mins`)
  - Estimated Price / Range
  - Service Description & Pre-requisites
- **Custom CRM Fields**:
  - Field Name, Key, Type (`Text`, `Number`, `Date`, `Select`, `Boolean`)
  - Target Entity (`Client`, `Deal / Opportunity`, `Call Log`)
  - Examples for Dental: `insurance_provider`, `policy_id`, `last_dental_cleaning`, `has_dental_anxiety`, `referral_source`.

---

## 5. End-to-End User Onboarding Flow & Auto-Provisioning

```
Step 1: User Signup & Organization Creation
  └── User registers company name, subdomain, admin credentials

Step 2: Industry Vertical Selection
  ├── User selects Industry Category: "Healthcare & Medical"
  └── User selects Specific Industry: "Dental Practice"
  
Step 3: Starter Pack Preview
  └── UI displays:
      ├── 1 Process Workflow ("Dental Patient Journey" with 4 configured stages)
      ├── 2 Web Forms ("Patient Intake Form", "Emergency Booking Form")
      ├── 3 Knowledge Base Docs ("Dental FAQ & Insurance Guide", "Post-Op Care Guidelines")
      └── 5 Pre-configured Services & Custom Fields

Step 4: Atomic Workspace Provisioning (Database Seeding Engine)
  ├── 1. Clones Process Template -> Inserts into `processes` and `stages`
  │      (Applies Basic scripts & Advanced telephony settings)
  ├── 2. Clones Form Templates -> Inserts into `web_forms` and `form_fields`
  ├── 3. Clones Documents -> Inserts into `knowledge_documents` (Vector embeddings generated)
  ├── 4. Clones Services & Custom Fields -> Inserts into `services` & `custom_fields`
  └── 5. Organization status marked `provisioned = true`

Step 5: Dashboard Ready
  └── Tenant lands on Dashboard with live AI receptionist ready to test call!
```

---

## 6. Super Admin UI Specification & Pages

### 6.1 Admin Navigation Structure
- **Admin Header**: Super Admin indicator, Environment switcher (`Production` / `Staging`), Global Search.
- **Admin Sidebar**:
  - 📂 **Industry Catalog**: Category & Sub-industry hierarchy.
  - ⚙️ **Process Templates**: Library of process templates (Basic + Advanced tabs).
  - 📝 **Form Templates**: Web form library & drag-and-drop designer.
  - 📚 **Knowledge Base Templates**: Curated document repository.
  - 🏷️ **Field & Service Sets**: Reusable attribute bundles.
  - 🚀 **Industry Bundles (Starter Packs)**: Matrix associating Industries with their respective Process, Form, Doc, and Service templates.
  - 🧪 **Sandbox / Onboarding Tester**: Test provisioning simulation.

### 6.2 Industry Bundle Studio (The Master Configurator)
When editing an industry (e.g., `Dental Practice`), the admin sees a unified multi-tab studio:
1. **Overview Tab**: Industry Name, Slug, Category, Icon, Tone of Voice, Status.
2. **Process Setup Tab**: Select or customize the default Process Template. Direct inline editor for **Basic Tab** (Scripts/Greetings) and **Advanced Tab** (Voice/Duration/Retries/Voicemail).
3. **Forms Tab**: Checkbox selector of pre-built web forms to include in this industry's bundle, with preview buttons.
4. **Knowledge Base Tab**: Checkbox selector of documents and FAQs to automatically load into the tenant's AI brain.
5. **Services & Fields Tab**: Toggle default services and custom CRM properties.
6. **Preview & Test Tab**: Live interactive preview of what the tenant will experience on day 1.

---

## 7. Data Models & TypeScript Interfaces

```typescript
// ==========================================
// 1. INDUSTRY CATEGORY & SUB-INDUSTRY
// ==========================================
export interface IndustryCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name
  displayOrder: number;
  isActive: boolean;
  industriesCount?: number;
}

export interface Industry {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  recommendedTone: string; // e.g., "Compassionate, Clinical"
  badges: string[]; // ['Popular', 'HIPAA Ready']
  isActive: boolean;
  bundleId?: string; // Reference to IndustryStarterBundle
}

// ==========================================
// 2. PROCESS & STAGE TEMPLATES (BASIC + ADVANCED ONLY)
// ==========================================
export interface ProcessTemplate {
  id: string;
  industryId: string;
  name: string;
  description: string;
  globalSettings: ProcessGlobalSettings;
  stages: StageTemplate[];
  createdAt: string;
  updatedAt: string;
}

export interface ProcessGlobalSettings {
  aiModel: string; // e.g., 'gemini-2.5-flash'
  voiceSpeed: number; // 0.5 - 2.0
  voiceGender: 'male' | 'female' | 'neutral';
  voiceTone: string;
  recordCalls: boolean;
  maxDurationMinutes: number;
  wrapUpWindowSeconds: number;
  retryRules: {
    enabled: boolean;
    maxAttempts: number;
    delayMinutes: number;
  };
  skipDayRules: {
    enabled: boolean;
    skipDaysOfWeek: number[]; // 0 = Sunday, 6 = Saturday
    skipHolidays: boolean;
  };
  voicemailDetection: {
    enabled: boolean;
    action: 'hangup' | 'leave_message';
  };
}

export interface StageTemplate {
  id: string;
  stageOrder: number;
  name: string;
  stageCode: string;
  goal: string;
  
  // BASIC TAB CONFIGURATION
  basic: {
    callAction: 'ai_receives_calls' | 'ai_makes_calls' | 'transfer_to_human' | 'no_call';
    greetingPhrase: string; // Dynamic template script
    callerPitch: string;    // Comprehensive AI persona guidelines
    targetObjective: string;
  };

  // ADVANCED TAB OVERRIDES
  advanced: {
    overrideAiModel: boolean;
    aiModel?: string;
    voiceSpeed?: number;
    overrideDuration: boolean;
    maxDurationMinutes?: number;
    overrideRetryRules: boolean;
    retryAttempts?: number;
    retryDelayMinutes?: number;
    overrideSkipDays: boolean;
    allowWeekendCalling?: boolean;
    overrideVoicemail: boolean;
    detectVoicemail?: boolean;
    recordCall: boolean;
  };
}

// ==========================================
// 3. WEB FORM TEMPLATES
// ==========================================
export interface FormTemplate {
  id: string;
  industryId: string;
  title: string;
  category: 'lead_capture' | 'intake' | 'booking' | 'quote' | 'feedback';
  description: string;
  estimatedMinutes: number;
  sections: FormSectionTemplate[];
  submitButtonText: string;
  successMessage: string;
  autoCreateClient: boolean;
}

export interface FormSectionTemplate {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldTemplate[];
}

export interface FormFieldTemplate {
  id: string;
  label: string;
  name: string; // mapped CRM field
  type: 'text' | 'email' | 'phone' | 'number' | 'date' | 'time' | 'select' | 'checkbox' | 'textarea' | 'file';
  placeholder?: string;
  helperText?: string;
  isRequired: boolean;
  options?: { label: string; value: string }[];
  validationRegex?: string;
}

// ==========================================
// 4. DOCUMENT / KB TEMPLATES
// ==========================================
export interface DocumentTemplate {
  id: string;
  industryId: string;
  title: string;
  docType: 'faq' | 'policy' | 'guidelines' | 'aftercare' | 'pricing';
  tags: string[];
  markdownContent: string;
  keyQueryTriggers: string[];
}

// ==========================================
// 5. MASTER STARTER BUNDLE
// ==========================================
export interface IndustryStarterBundle {
  id: string;
  industryId: string;
  version: string;
  processTemplate: ProcessTemplate;
  formTemplates: FormTemplate[];
  documentTemplates: DocumentTemplate[];
  defaultServices: Array<{
    name: string;
    durationMinutes: number;
    priceEstimate?: number;
    description: string;
  }>;
  customFields: Array<{
    name: string;
    key: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    entity: 'client' | 'deal' | 'call';
    options?: string[];
  }>;
}
```

---

## 8. Concrete Industry Examples for Reference

### Example Vertical 1: Healthcare & Medical → Dental Practice
- **Process Template**: `Dental Patient Inbound & Recall Care`
  - *Stage 1: Inbound New Patient Booking* (Call Action: AI Receives Calls, Greeting: *"Thank you for calling {{business_name}}. I'm Sarah, your dental concierge. Are you looking to schedule an appointment or do you have a dental emergency?"*)
  - *Stage 2: Pre-Appointment Medical Clearance* (Basic: AI Makes Calls, Pitch: Confirm appointment time and ask about penicillin allergies and recent dental X-rays).
  - *Stage 3: 6-Month Hygiene Recall* (Advanced: Weekend calling disabled, 3 retry attempts over 48 hours).
- **Web Forms**:
  - `Dental New Patient & Medical History Intake Form` (Medical conditions, insurance photos, chief dental complaint).
  - `Emergency Dental Consultation Request Form` (Pain level 1-10, swelling location, photos).
- **Knowledge Base Docs**:
  - `Dental Insurance Copay, PPO Networks & Financing FAQs`
  - `Post-Operative Instructions for Extractions, Fillings & Whitening`

### Example Vertical 2: Legal Services → Personal Injury Law
- **Process Template**: `24/7 Accident Intake & Qualification`
  - *Stage 1: Immediate Case Intake* (Basic: Empathetic greeting, asks date of accident, injuries sustained, police report status).
  - *Stage 2: Conflict & Coverage Check* (Basic: Transfer to on-call attorney if high value case).
- **Web Forms**:
  - `Free Case Evaluation & Accident Incident Form` (Accident date, vehicles involved, insurance policy details).
- **Knowledge Base Docs**:
  - `Personal Injury Retainer & Contingency Fee FAQs (No Fee Unless We Win)`
  - `What To Do Immediately Following an Auto Accident Guide`

### Example Vertical 3: Real Estate → Residential Brokerage
- **Process Template**: `Buyer & Seller Lead Fast-Response Pipeline`
  - *Stage 1: Inbound Property Inquirer* (Basic: Asks property address of interest, pre-approval status, timeline to buy).
  - *Stage 2: Private Showing Scheduling* (Outbound AI confirmation call).
- **Web Forms**:
  - `Home Valuation & Seller Market Analysis Request Form`
  - `Homebuyer Wishlist & Pre-Approval Intake Form`
- **Knowledge Base Docs**:
  - `Home Buying Timeline, Escrow Process & Closing Cost Guidelines`
  - `Neighborhood Amenities, School Districts & Showing Hours Policy`

---

## 9. Implementation Checklist for Development Team

- [ ] **Admin Database Schemas**: Create tables for `industry_categories`, `industries`, `process_templates`, `stage_templates`, `form_templates`, `form_fields_templates`, `document_templates`, and `industry_starter_bundles`.
- [ ] **Super Admin Navigation**: Implement Admin route `/admin/industry-templates` and sub-screens.
- [ ] **Category & Industry CRUD UI**: Build clean table/card management views with status indicators.
- [ ] **Process Template Editor**:
  - [ ] Implement Global Process Settings editor (AI Model, voice speed, duration, retries, skip days, voicemail).
  - [ ] Implement Stage List reordering and stage creation.
  - [ ] Implement Stage **Basic Tab** (Call Actions, dynamic Greeting Phrases, Caller Pitch prompts).
  - [ ] Implement Stage **Advanced Tab** (Overrides for voice, duration, retries, skip days, voicemail).
  - [ ] Verify **Automations** and **Flow Builder** are omitted.
- [ ] **Web Form Template Designer**:
  - [ ] Drag-and-drop form canvas with reorderable sections and fields.
  - [ ] Field settings modal (Labels, placeholders, validation, CRM field binding).
  - [ ] Live form sandbox preview.
- [ ] **Document & Knowledge Base Editor**:
  - [ ] Markdown editor with instant preview.
  - [ ] Tagging and AI query trigger keywords manager.
- [ ] **Onboarding Provisioning Service**:
  - [ ] Create atomic database seeder that clones templates into tenant tables upon signup selection.
  - [ ] Add rollback safety if any step in provisioning encounters an error.
- [ ] **Industry Seed Data**: Populate default starter templates for at least 8 major industry verticals.

---

## 10. Summary Prompt for AI Implementation Agent

When implementing or extending this admin module, follow this execution prompt:

```markdown
You are tasked with building the Super Admin Industry Template & Provisioning System for MantraAssist. 

Key Requirements:
1. Provide full administrative capabilities to manage Industry Categories and Sub-industries.
2. For each industry, create a master starter bundle comprising:
   - Process Template: Configured with linear stages where each stage strictly features ONLY the 'Basic Tab' (Call Actions, Greetings with variables, Caller Pitch) and the 'Advanced Tab' (AI voice overrides, Duration limits, Retry rules, Skip days, Voicemail detection). Exclude Automations and Flow Builder tabs.
   - Web Form Templates: Multi-section intake and booking forms with mapped CRM fields.
   - Knowledge Base Document Templates: Markdown FAQs, service policies, and aftercare guides with search query triggers.
   - Default Services & Custom CRM Fields.
3. Build the Onboarding Auto-Provisioning engine that detects tenant industry selection and clones all templates into the new tenant's live workspace seamlessly.
4. Ensure a clean, modern, responsive UI following the MantraAssist design system (Calming SaaS, soft shadows, 12px radius, responsive tables and preview drawers).
```
