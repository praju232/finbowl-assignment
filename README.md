# FinBowl Disbursement UI

Production-ready React + Vite + TypeScript dashboard implementation based on the provided screens:

- Disbursement list page
- Loan details page
- Activity log drawer
- Save view filter panel and create view modal
- Reusable component system

## Tech Stack

- React + Vite
- TypeScript
- Tailwind CSS v4
- React Router
- Axios
- Lucide React

## Features

- Pixel-focused layout and color system
- Fully responsive sidebar/content (mobile, tablet, laptop, desktop)
- Reusable components (`Button`, `Card`, `Table`, `Drawer`, `Modal`, `Badge`, `Pagination`, etc.)
- Working interactions:
  - summary tiles toggle
  - activity drawer open/close
  - save view filter panel with checkboxes
  - create custom view modal
  - archive and edit loan actions
  - clickable document cards
- Loading, skeleton cards/table, empty state, retry error state

## Routes

- `/disbursement` - Disbursement list
- `/disbursement/:id` - Loan details

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Deploy to Vercel

### Option 1: Vercel UI

1. Import this project in Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

`vercel.json` is included with SPA rewrite support so all app routes resolve correctly.
