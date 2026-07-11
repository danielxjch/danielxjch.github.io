---
layout: post
title: SANY Machine Hub
description: Full-stack web platform built end-to-end during my work term at SANY America — replacing the company's Excel-based Total Cost of Ownership workflow with a production web app. Customer-facing machine hub with a TCO calculator, market comparisons, maintenance planning, and branded PDF reports, backed by an internal admin system for data entry, roles, and auditing. Next.js + TypeScript + PostgreSQL, deployed on Vercel and in production use.
skills:
  - TypeScript
  - React / Next.js
  - Node.js
  - PostgreSQL / Prisma
  - Data Modeling
  - Recharts
  - Tailwind CSS
  - Vercel

main-image: /hub-home.jpg
---

---
## Total Cost of Ownership Calculator
The core of the platform: users build an ownership scenario (years, hours, price, financing, fuel, labor) and get a complete hourly, yearly, and lifetime cost picture, computed live by a pure TypeScript calculation engine that replaced a suite of legacy Excel workbooks. Depreciation is modeled from historical resale data, so the projected residual value reflects how these machines actually hold value in the field.
{% include image-gallery.html images="hub-tco-hero.png" height="700" %}
*Some dollar figures are redacted; scenario inputs shown are illustrative examples, not quotes.*

---
## Market Comparisons
Each machine is positioned against its competitive class on operating cost per hour and value retained, built from published industry data and resale history. A tap-to-estimate interaction converts the relative difference into an estimated savings figure for the user's specific scenario. Every chart's numeric detail (dollar values, percentages, or bare shape) is controlled per user role by an admin-configurable permission matrix.
{% include image-gallery.html images="hub-tco-compare.png" height="640" %}
{% include image-gallery.html images="hub-tco-breakdown.png" height="380" %}

---
## Maintenance Planning
The planned-maintenance schedule is priced against the user's scenario — every service interval expands into its parts, fluids, and labor lines, and totals roll up into the cost model. Internal users get part numbers and CSV export.
{% include image-gallery.html images="hub-maintenance.png" height="700" %}

---
## Attachment Compatibility
An interactive working-range grid derived from each machine's load chart: pick a material and a zone, and it computes the largest bucket the machine can safely lift there, derated to over-the-side ratings and accounting for fitted attachments.
{% include image-gallery.html images="hub-lift.png" height="620" %}

---
## Machine Pages
Every model gets a full profile — narrative overview, spec sheet (CSV-exportable), and downloadable documents (spec sheets, brochures, videos) stored in Supabase Storage with per-role visibility.
{% include image-gallery.html images="hub-about.jpg" height="540" %}
{% include image-gallery.html images="hub-specs.png" height="600" %}
{% include image-gallery.html images="hub-documents.png" height="420" %}

---
## Admin Backend
The half you can't screenshot publicly: a full internal system that lets non-technical staff run the platform.

- **Model editors** — machine setup, spec templates, maintenance schedules, warranty records, resale/auction data, comparison rows, lifting performance, and per-model documents
- **Excel import pipeline** — migrated the legacy workbooks into the database, including a server-side curve-refit that replaced Excel Solver
- **Role-based access** — six user roles (owner → customer) with a per-role permission matrix controlling every tab, chart, and figure on the customer side
- **User management & audit log** — account administration with an append-only audit trail of admin actions
- **PDF reports** — any scenario prints to a SANY-branded customer report with figures, charts, and a methodology appendix
- **AI assistant** — an embedded Claude-powered chatbot that answers machine questions with web-lookup support

---
## Engineering Notes
- **Stack:** Next.js 14 (App Router) + TypeScript, Prisma over PostgreSQL (Supabase), Tailwind CSS, Recharts, NextAuth; deployed on Vercel with push-to-deploy
- The calculation engine is a **pure, dependency-free module** — no UI or database imports — covered by a Vitest regression suite, so finance/depreciation math can be verified independently of the app
- Scenario state is **URL-addressable** (machine, tab, saved scenario), so bookmarks and refreshes restore the exact view
- Server-rendered pages with role-resolved data: the server decides per role what data ships to the browser
- Wrote the full documentation set for handoff: developer/admin manual, three role-specific user guides, and methodology specs
