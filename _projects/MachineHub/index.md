---
layout: post
title: SANY Machine Hub
description: Full-stack web platform built end-to-end during my work term at SANY America — I developed a Total Cost of Ownership model from scratch in Excel, then productionized it as a web app. Customer-facing machine hub with a TCO calculator, market comparisons, maintenance planning, and branded PDF reports, backed by an internal admin system for data entry, roles, and auditing. Next.js + TypeScript + PostgreSQL, deployed on Vercel and in production use.
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
The core of the platform: users build an ownership scenario (years, hours, price, financing, fuel, labor) and get a complete hourly, yearly, and lifetime cost picture, computed live by a pure TypeScript calculation engine. I built and validated the underlying cost model in Excel first, then ported it to the app. Depreciation is modeled from historical resale data, so the projected residual value reflects how these machines actually hold value in the field.
{% include image-gallery.html images="hub-tco-hero.png" height="810" %}
*Some dollar figures are redacted; scenario inputs shown are illustrative examples, not quotes.*

---
## Market Comparisons
Each machine is positioned against its competitive class on operating cost per hour and value retained, built from published industry data and resale history. A tap-to-estimate interaction converts the relative difference into an estimated savings figure for the user's specific scenario. Every chart's numeric detail (dollar values, percentages, or bare shape) is controlled per user role by an admin-configurable permission matrix.
{% include image-gallery.html images="hub-tco-compare.png" height="800" %}
{% include image-gallery.html images="hub-tco-resale.png, hub-tco-breakdown.png" height="325" %}

---
## Attachment Compatibility
An interactive working-range grid derived from each machine's load chart: pick a material and a zone, and it computes the largest bucket the machine can safely lift there, derated to over-the-side ratings and accounting for fitted attachments.
{% include image-gallery.html images="hub-lift.png" height="595" %}

---
## Machine Pages
Every model gets a full profile — narrative overview, spec sheet (CSV-exportable), and downloadable documents (spec sheets, brochures, videos) stored in Supabase Storage with per-role visibility.
{% include image-gallery.html images="hub-about.jpg, hub-documents.png" height="255" %}
{% include image-gallery.html images="hub-specs.png" height="800" %}

---
## SANY Bob — AI Assistant
An embedded Claude-powered assistant available across the app. It answers machine questions from the Hub's own data (specs, maintenance, cost of ownership, warranty, resale) and can pull in marked web sources, deep-linking users to the relevant tab. Conversations persist per user, and the API key is stored encrypted with an admin-configurable model setup.
{% include image-gallery.html images="hub-assistant.png" height="720" %}

---
## Admin Backend
A full internal system that lets non-technical staff run the platform. The model catalog tracks every machine's status and **data health** — flagging models with incomplete data before they can mislead a customer.
{% include image-gallery.html images="hub-admin-models.png" height="765" %}

The rest is sensitive enough to describe rather than show:

- **Model editors** — machine setup, spec templates, maintenance schedules, warranty records, resale/auction data, comparison rows, lifting performance, and per-model documents
- **Excel import pipeline** — migrated my original Excel model into the database, including a server-side curve-refit that replaced Excel Solver
- **Role-based access** — six user roles (owner → customer) with a per-role permission matrix controlling every tab, chart, and figure on the customer side
- **User management & audit log** — account administration with an append-only audit trail of admin actions
- **PDF reports** — any scenario prints to a SANY-branded customer report with figures, charts, and a methodology appendix

### The Assistant Console
SANY Bob gets his own admin area. Setup connects the API key (encrypted at rest, never shown again in full) and picks the Claude model, with plain-language cost/quality tradeoffs for non-technical admins. The avatar gallery rotates SANY Bob's look through the seasons — uploads are resized automatically.
{% include image-gallery.html images="hub-bob-setup.png, hub-bob-avatar.png" height="435" %}

Personality and Priorities let the owner shape how SANY Bob *sounds* and what he *emphasizes* per task type (selling points, machine selection, head-to-head comparisons) via drag-and-drop tiers — while the UI is explicit that these steer tone and emphasis only, and can never change what data a role is allowed to see or override his safety rules.
{% include image-gallery.html images="hub-bob-personality.png" height="700" %}
{% include image-gallery.html images="hub-bob-priorities.png" height="895" %}

---
## Engineering Notes
- **Stack:** Next.js 14 (App Router) + TypeScript, Prisma over PostgreSQL (Supabase), Tailwind CSS, Recharts, NextAuth; deployed on Vercel with push-to-deploy
- The calculation engine is a **pure, dependency-free module** — no UI or database imports — covered by a Vitest regression suite, so finance/depreciation math can be verified independently of the app
- **Depreciation methodology** — retained-value curves grounded in Mike Vorster's *Construction Equipment Economics*, fit to historical auction results
- **Repair-buffer methodology** — the opt-in unplanned-maintenance estimate takes its magnitude from **USACE EP 1110-1-8** (*Construction Equipment Ownership and Operating Expense Schedule*, 2018) equipment-class factors and its age shape from **Vorster §6-2** — built entirely from published, citable sources so a third party can audit every constant
- **EquipmentWatch calibration** — EquipmentWatch's residual-value model is a black box, so I developed a six-calibration-curve method (per-curve nonlinear least-squares fits, originally driven by Excel Solver, later ported to a server-side fitter) that reproduces its outputs and lets the app price residuals without the workbook
- Scenario state is **URL-addressable** (machine, tab, saved scenario), so bookmarks and refreshes restore the exact view
- Server-rendered pages with role-resolved data: the server decides per role what data ships to the browser
- Wrote the full documentation set for handoff: developer/admin manual, three role-specific user guides, and methodology specs
