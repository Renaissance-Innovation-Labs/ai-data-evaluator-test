# AI Data Evaluator — Skills Test

A web app for onboarding candidates who will review AI agent outputs: flag irregularities, document strengths, and submit structured feedback — similar to a production review console.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

## Candidate flow

1. Enter name and email on the welcome screen.
2. Work through **4 scenarios** (support triage, contract extraction, review synthesis, research Q&A).
3. For each scenario, read **Context**, **Agent output**, and **Trace** tabs.
4. Log **issues** (category, severity, location, description) and **what went well**.
5. Set overall quality and confidence ratings, plus summary notes.
6. When all scenarios are complete, **Submit** downloads a JSON file to send to the recruiter.

Progress auto-saves in the browser (`localStorage`).

## Hiring team

- **Scoring rubric:** open the app with `#admin` (e.g. `http://localhost:5173/#admin`) for planted-issue hints per scenario.
- **Submissions:** JSON files include candidate info, all reviews, and timestamps.
- **Customize scenarios:** edit `src/data/scenarios.ts` to match your product’s agent types and data shapes.

## Deploy

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, S3, etc.).

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
