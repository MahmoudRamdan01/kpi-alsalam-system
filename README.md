# Alsalam Hospital KPI Dashboard

React + TypeScript + Vite app for **Alsalam Hospital** performance KPIs (live Google Sheets / Excel pipeline).

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Live Excel Sync to Dashboard

- ضع بياناتك في `data/kpi-data.xlsx`
- لتشغيل التطوير مع التحديث التلقائي عند أي تعديل في Excel:
  - `npm run dev:live-data`

What happens automatically:
- Any change in `data/kpi-data.xlsx` triggers `scripts/excel-to-ts.mjs`
- Generated file `src/data/hospitalData.ts` is updated
- Vite HMR refreshes dashboard data مباشرة

## Live Google Sheets on Vercel (No Redeploy)

1. Upload your Excel to Google Sheets.
2. Make the sheet public for viewing.
3. Copy the Sheet ID from URL:
   - `https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`
4. Either add in Vercel **Settings → Environment Variables** `VITE_GOOGLE_SHEET_ID=<SHEET_ID>`, **or** rely on the committed `.env.production` in this repo (already set for the live sheet).
5. Redeploy once (or push to `main` if Git auto-deploy is on).

After that, dashboard fetches live data every 60 seconds directly from Google Sheets.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
