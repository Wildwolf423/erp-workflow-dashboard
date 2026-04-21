# ERP Workflow Dashboard

## Overview

ERP Workflow Dashboard is a portfolio-quality React + TypeScript application that simulates the frontend of an ERP-style purchase request workflow. It is designed as a realistic internal business tool for employees, approvers, and operations users who need to create requests, review approval queues, inspect request history, and complete workflow actions.

The project is intentionally structured to complement a backend project such as **Business Process Approval & Posting Simulator**. It uses a mock API today, but the data-access boundary is designed so the mock implementation can later be replaced with a real ASP.NET Core Web API with minimal refactoring.

## Business Use Case

In ERP and Business Central style environments, purchase workflows are not just CRUD screens. Teams need visibility into current workload, clear request status, enforceable workflow actions, and an audit trail of decisions. This project simulates that operational workflow in a recruiter-friendly frontend that focuses on:

- purchase request visibility
- approval and posting actions
- auditability
- maintainable frontend structure
- enterprise-style UX instead of tutorial-style screens

## Why This Project Is Relevant For ERP And Full-Stack Roles

- It models a real business workflow with states such as Draft, Pending Approval, Approved, Rejected, and Posted.
- It shows how to separate UI, feature logic, and data access so a frontend can later plug into a real .NET backend.
- It reflects the kind of internal dashboard and workflow tooling commonly used in ERP, finance, procurement, and operations contexts.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS

## Folder Structure

```text
erp-workflow-dashboard/
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── src/
    ├── main.tsx
    ├── index.css
    ├── app/
    │   ├── App.tsx
    │   ├── providers.tsx
    │   ├── queryClient.ts
    │   ├── router.tsx
    │   ├── session-context.tsx
    │   ├── toast-context.tsx
    │   └── layout/
    │       └── AppShell.tsx
    ├── components/
    │   └── ui/
    ├── features/
    │   └── purchaseRequests/
    │       ├── api/
    │       ├── components/
    │       ├── hooks/
    │       ├── pages/
    │       └── schemas/
    ├── lib/
    ├── mocks/
    └── types/
```

## Architecture Overview

- `src/app`
  Application shell, router, providers, session switching, and toast notifications.
- `src/components/ui`
  Reusable presentation components such as buttons, cards, badges, tables, loading states, empty states, and dialogs.
- `src/features/purchaseRequests`
  Feature-level pages, request components, form schema, hooks, and the API client boundary.
- `src/mocks`
  Mock data store and mock API implementation with latency and workflow rules.
- `src/types`
  Explicit domain models for purchase requests, workflow status, audit entries, and actors.
- `src/lib`
  Shared helpers for formatting, query keys, and utility functions.

## Main Pages And Features

### Dashboard

- summary cards for total requests and workflow status counts
- recent purchase request list for quick navigation
- workflow posture panel for business users
- status overview for operational scanning
- recent request items are directly clickable and open dedicated details pages

### Purchase Requests

- searchable request table
- filter by workflow status
- sort by request date or total amount
- enterprise-style loading, empty, and error states
- each request row is directly clickable and also exposes a dedicated `View details` action

### Purchase Request Details

- route-driven details page using `/requests/:id`
- request metadata, supplier, department, and requestor context
- line items with calculated totals
- current status and workflow action panel
- audit trail / request history
- submit, approve, reject, and post actions with confirmation UI where appropriate

### Create Purchase Request

- React Hook Form + Zod validation
- dynamic line items
- calculated request total
- requestor fields prefilled from the active session persona
- professional validation and submission feedback

## Example User Workflow

1. Open the dashboard to review the current workload and recent requests.
2. Click a recent request item to navigate directly to `/requests/:id`.
3. Open the request details page and inspect metadata, line items, and audit history.
4. Switch the active persona in the header to simulate a requestor, approver, or operations user.
5. Run an approval or posting action and show how the status and audit trail update.
6. Open the request list and demonstrate search, status filters, sorting, and clickable rows.
7. Create a new purchase request draft and return to the list to show the updated state.

## Local Setup

```bash
npm install
npm run dev
```

The Vite development server will start locally, typically at:

```text
http://localhost:5173
```

## Run Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## How to Demo This Project

1. Start on `/dashboard` and explain the KPI cards, recent requests, and workflow posture.
2. Click a recent request to show direct navigation to the dedicated details page.
3. Open `/requests` and demonstrate search, status filtering, sorting, and clickable table rows.
4. Open a `PendingApproval` request and switch the active persona to an approver.
5. Approve or reject the request and show the audit trail update immediately.
6. Open `/requests/new`, add line items, and show the validation feedback on the create form.
7. Save the request as a draft and return to the list or dashboard to show consistent mock state updates.

## Future Improvements

- connect the feature API client to a real ASP.NET Core backend
- add authentication and route-level authorization
- add automated component and page-level tests
- support persisted filters and richer operational reporting
- introduce export or print-oriented request views

## CV Project Description

Built a portfolio-quality React + TypeScript ERP workflow dashboard that simulates a realistic purchase request lifecycle for internal business users. Implemented route-based request details, dynamic forms, audit-trail views, and workflow actions such as submit, approve, reject, and post. Structured the frontend with reusable UI components, TanStack Query, and a replaceable API boundary to reflect maintainable full-stack engineering practices.

## LinkedIn-Ready Summary

Created a modern React + TypeScript frontend called **ERP Workflow Dashboard** to simulate an enterprise purchase request workflow. The application includes dashboards, searchable request lists, route-driven details pages, dynamic request creation, audit history, and realistic workflow actions using a mock API structure that can later connect to a .NET backend.

## Interview Talking Points

- It shows how to design a frontend around a real ERP workflow with state transitions, auditability, and role-sensitive actions.
- It demonstrates maintainable frontend architecture by separating screens, feature logic, and the data-access boundary that can later target a real API.
- It reflects enterprise UI thinking through operational dashboards, clickable request worklists, confirmation flows, and business-friendly validation feedback.
