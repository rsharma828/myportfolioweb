<div align="center">
<img alt="Portfolio" src="https://github.com/dillionverma/portfolio/assets/16860528/57ffca81-3f0a-4425-b31d-094f61725455" width="90%">
</div>


Built with next.js, [shadcn/ui](https://ui.shadcn.com/), and [magic ui](https://magicui.design/), deployed on Vercel.

# Features

- **Neon (PostgreSQL)** for profile, projects, blog posts, resume sections, skills, and services
- **Cloudflare R2** via `s3mini` (`src/lib/storage.ts`) for uploads (admin uses keys/URLs in forms)
- **Admin panel** at `/admin` — email/password + `iron-session` cookie (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`)
- Built using Next.js 14, React, Typescript, Shadcn/UI, TailwindCSS, Framer Motion, Magic UI
- Blog & admin: **Tiptap** WYSIWYG in `/admin` (HTML stored in DB); legacy Markdown posts still render via `src/lib/mdx.ts` + `src/lib/html-content.ts`
- Project pages: rich **case study body** plus Challenge / Solution / Outcome editors; profile has optional **rich bio** (`bioHtml`) for the home hero
- Responsive for different devices
- Optimized for Next.js and Vercel

Copy `.env.example` to `.env.local` and set `DATABASE_URL`, R2 variables, admin hash, and `SESSION_SECRET` (32+ characters). Generate a bcrypt hash for the admin password:

`pnpm exec tsx -e "import bcrypt from 'bcryptjs'; bcrypt.hash('your-password',12).then(console.log)"`

Then: `pnpm db:push` or `pnpm db:migrate`, `pnpm db:seed`, `pnpm dev`. Open `/admin/login` after setting admin env vars.

# Getting Started Locally

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/rsharma828/myPortfolio.git
   ```

2. Move to the cloned directory

   ```bash
   cd portfolio
   ```

3. Install dependencies:

   This project uses **pnpm** only (do not use `npm install` — it creates `package-lock.json` and can conflict with `pnpm-lock.yaml`).

   ```bash
   pnpm install
   ```

4. Start the local Server:

   ```bash
   pnpm dev
   ```

5. Configure `.env` from `.env.example`, run `pnpm db:migrate` (or `pnpm db:push`), then `pnpm db:seed`. Edit content via **`/admin`** (set `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` first).

   **`R2_PUBLIC_URL`:** set to your bucket’s public base URL so uploaded images resolve in the admin editor and on the site.

## Prisma / Postgres in dev

If you see `Error in PostgreSQL connection: Error { kind: Closed, cause: None }` in the terminal:

- Confirm **`DATABASE_URL`** is correct and the database is reachable (Neon/Postgres running, VPN on if required).
- **Idle disconnects:** serverless DBs (Neon, Supabase) may close idle connections. **Restart `pnpm dev`** after the DB wakes up.
- If using **Neon’s pooler**, prefer the pooled connection string from the Neon dashboard; for Prisma + PgBouncer, follow [Prisma’s docs](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prisma-with-pgbouncer) (`?pgbouncer=true` and `directUrl` when needed).
- After schema changes, run **`pnpm exec prisma generate`** (also runs on `pnpm install` via `postinstall`).

   **Admin password hash:** bcrypt strings contain `$`, which many `.env` loaders (including Next’s) mangle. **Recommended:** after generating the hash, run `pnpm admin:hash-b64 -- '$2b$12$...full hash...'` (quote the hash for your shell), then set **`ADMIN_PASSWORD_HASH_B64`** to the printed line. Set **`ADMIN_EMAIL`** to the same address you use on the login form. You can leave `ADMIN_PASSWORD_HASH` empty when using `_B64`.
