Minimal Node + Express + Prisma backend scaffold for the Astro project.

Quick start (Windows cmd.exe):

1. Open a terminal in this folder: `d:\Astro-main\Astro-main\server`
2. Copy env example:

```cmd
copy .env.example .env
```

3. Install dependencies:

```cmd
npm install
```

4. Set up a Postgres database and set `DATABASE_URL` in `.env`.

5. Initialize Prisma and run migrations (example):

```cmd
npx prisma migrate dev --name init
```

6. Start dev server:

```cmd
npm run dev
```

This scaffold provides basic auth, profile, assignments, counseling endpoints and a payments webhook stub. See `src/` for source.
