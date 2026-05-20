# ValidateAI — Data Evaluator Skills Test

A web dashboard that simulates **contract and invoice validation** with AI-generated field checks, **citations**, and an **approval gate**. Candidates review agent output like in production, then submit findings in **their own format** (sheet, markdown, doc, etc.) — no structured template.

## Quick start

```bash
npm install
npm run dev
```

## Candidate flow

1. Open the **validation queue** (4 cases: vendors, invoices, agent status, gate recommendation).
2. **Review** each case: source documents, validation report, citations, approval gate, agent trace.
3. Produce an evaluation report offline in whatever format they prefer.
4. **Submit** via paste and/or file upload → downloads JSON for the recruiter.

Requirements to submit: open ≥3 cases, and either 100+ characters pasted or at least one attachment.

## Hiring team

- **Rubric & planted issues:** `http://localhost:5173/#admin`
- **Score on:** issue quality, report clarity, attention to detail, balanced feedback (issues + what’s good).
- **Customize cases:** `src/data/validationCases.ts`

## Deploy

```bash
npm run build
```

Serve `dist/` on any static host.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4
