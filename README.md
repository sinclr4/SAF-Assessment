# SAF Assessment

A Next.js application for completing NHS England Solution Architecture Framework (SAF) self-assessments.

## Features

- Create, view and continue SAF assessments
- All 37 requirements across 7 dimensions
- Per-question Evidence, Mitigations and Score (0–5) fields
- Auto-persists answers to Azure Cosmos DB after each question
- NHS service manual design system (nhsuk-frontend)
- Task-list progress view with completion status per requirement

## Requirements

- Node.js 18+
- Azure Cosmos DB account (or the Cosmos DB emulator for local dev)

## Getting started

1. Copy the example env file and fill in your Cosmos details:

   ```bash
   cp .env.local.example .env.local
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Cosmos DB setup

The application will automatically create the database and container on first run using the names in your `.env.local`:

| Variable           | Default          | Description               |
|--------------------|------------------|---------------------------|
| `COSMOS_ENDPOINT`  | –                | Your Cosmos DB endpoint   |
| `COSMOS_KEY`       | –                | Your Cosmos DB primary key|
| `COSMOS_DATABASE`  | `saf-assessment` | Database name             |
| `COSMOS_CONTAINER` | `submissions`    | Container name            |

## Project structure

```
src/
  app/                         Next.js App Router pages & API routes
    api/submissions/           REST API (GET/POST submissions, PUT answers, PATCH status)
    submissions/
      new/                     Create new assessment
      [id]/                    Submission overview (task list)
      [id]/question/[reqId]/   Question form (evidence, mitigations, score)
      [id]/summary/            Review all answers
      [id]/complete/           Completion confirmation
  components/
    QuestionForm.tsx           Client-side form with auto-save
    SummaryView.tsx            Collapsible summary with change links
  data/
    safRequirements.ts         All 37 SAF requirements (SAF v1.1)
  lib/
    cosmosClient.ts            Cosmos DB client singleton
    submissionService.ts       CRUD operations
  types/
    submission.ts              TypeScript types
```

## SAF dimensions covered

1. Strategic Alignment, Vision and Roadmap (S01–S04)
2. Decision Making & Governance (DM01–DM08)
3. Solution Design & Methods (SD01–SD12)
4. Technology Choices (T01–T03)
5. Non-Functional Profile (NF01–NF06)
6. Reuse Principles and Development of Shared Services (RU01–RU03)
7. Documentation (D01–D03)
