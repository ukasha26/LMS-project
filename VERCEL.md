Quick Vercel setup for this frontend

1) In Vercel dashboard -> "Import Project" -> choose your repo.
2) Set "Root Directory" to `frontend`.
3) Build settings:
   - Framework Preset: "Other"
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4) Environment variables (important):
   - `VITE_API_BASE_URL` = `https://your-backend.example.com/api` (set to your production backend URL)
5) SPA routing: `vercel.json` in the `frontend` folder rewrites all routes to `index.html`.
6) After import, trigger a deploy. For quick local test before pushing, run:

```bash
cd frontend
npm install
npm run build
npx serve dist # or `vite preview`
```

Notes:
- The frontend reads `import.meta.env.VITE_API_BASE_URL` in `src/lib/api.ts`. Ensure the Vercel env var matches the backend endpoint.
- If you want automatic preview deployments for every push to branches, leave defaults in the Vercel import.
- If your repo is monorepo and you prefer configuring Vercel via the project settings instead of `vercel.json`, set the Root Directory to `frontend` and the same build/output settings above.
