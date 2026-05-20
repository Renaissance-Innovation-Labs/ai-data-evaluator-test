# ValidateAI — Evaluation Dashboard

A standalone web dashboard simulating AI-powered **contract**, **invoice**, and **exception** validation: field checks, citations, exceptions, approval gate, and agent trace. No sign-in or submission flow — open the app and review the data.

## Run

```bash
npm install
npm run dev
```

## Dashboard

- **Validation queue** — filter by contract, invoice, or exception cases
- **Agent insights** — status breakdown, top exception codes, gate recommendations
- **Case detail** — source documents, validation report, citations, exceptions, approval gate, trace

## Hiring rubric (internal)

`http://localhost:5173/#admin` — planted-issue hints per case.

## Customize

Edit `src/data/validationCases.ts` to match your product’s data shape and scenarios.

## Deploy

```bash
npm run build
```

Serve the `dist/` folder on any static host.
