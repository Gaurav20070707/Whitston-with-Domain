# Whitston

A student-first platform combining a live-style stock market simulator with
case-based learning decks. Built with Next.js 14 (App Router), TypeScript,
Tailwind CSS, and Firebase Authentication (Google Sign-In).

## Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in your Firebase config (see below)
npm run dev
```

Visit `http://localhost:3000`.

## Firebase setup (Google Sign-In)

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a project (or use an existing one).
2. **Authentication → Sign-in method** → enable **Google**.
3. **Authentication → Settings → Authorized domains** → add `localhost` (already there by default) and your production domain once you deploy.
4. **Project settings → General → Your apps** → add a **Web app** and copy the config values.
5. Paste those values into `.env.local` (copy `.env.local.example` first):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

That's it — Google Sign-In, sign-out, profile picture/name/email display, and
persisted sessions (via Firebase's default `localStorage` persistence) all
work out of the box once these are set.

> **Note on `npm run build`:** the site uses `next/font/google` to self-host
> Fraunces, Inter, and IBM Plex Mono. This requires internet access *at build
> time* to fetch the font files (a one-time step Next.js caches). This is
> normal for `next/font` and works on any machine or CI/hosting provider
> (Vercel, Netlify, etc.) with standard outbound internet access.

## One file to edit for all your links

Everything you'll want to update later — the Stock Market Game URL, your
Instagram/LinkedIn/WhatsApp/phone/email, and the nav — lives in a single file:

```
src/constants/site.ts
```

Look for the `TODO` comments. For example, once your game is live:

```ts
export const stockGameConfig = {
  ...
  launchUrl: "https://your-real-game-url.com", // <-- update this line
};
```

Every "Launch Game" button across the site reads from that one value.

## Managing Case Decks

The deck library is database-backed now, not a static file — see the "Case
Decks setup" section further down for the full Firestore + Appwrite picture.
In short: browse and manage decks from the UI itself at `/case-decks`
(everyone) and `/admin/case-decks` (admins only, once you're signed in as
one) — there's no file to hand-edit for this anymore.

## Project structure

```
src/
 ├── app/                 # Next.js App Router pages (/, /stock-game, /case-decks)
 ├── components/
 │   ├── layout/           # Navbar, Footer
 │   ├── home/              # Hero, About, FeatureCards, StockGameTeaser, Contact
 │   ├── case-decks/        # CaseDeckGrid, CaseDeckCard, SearchBar, CategoryFilter
 │   ├── auth/               # AuthButton (Google sign-in / user menu)
 │   └── ui/                  # Button, Container, SectionHeading, IconLink, ThemeToggle, Logo
 ├── context/              # AuthContext, ThemeContext, Providers
 ├── firebase/             # Firebase app + auth service functions
 ├── hooks/                # useAuth, useTheme re-exports
 ├── constants/            # site.ts — the single config file described above
 ├── data/                 # caseDecks.ts — dummy content, swap for real data later
 ├── lib/                  # small utilities (cn, formatDate)
 ├── types/                # shared TypeScript types
 └── styles/               # globals.css (Tailwind entry)
```

## Built for future expansion

The structure intentionally leaves room for the features you listed as
"later": blogs, leaderboards, events, a student dashboard, an admin
dashboard, a resource library, competitions, and notifications. A natural
next step for each:

- **New pages** → add a folder under `src/app/`.
- **New nav items** → add a line to `navLinks` in `src/constants/site.ts`.
- **New data-backed sections** (leaderboards, events, etc.) → follow the
  `case-decks` pattern: a typed data shape in `src/types`, a data source in
  `src/data` (or a fetch call once you have a backend), and presentational
  components in `src/components/<feature>/`.
- **Student/Admin dashboards** → `AuthContext` already exposes the signed-in
  user everywhere; gate a new `/dashboard` route on `useAuth().user` and
  build from there.

## Case Competition setup

The case competition feature (Parts 7–11 of the build) uses Firestore (Auth
was already here) plus Appwrite for file storage. One-time setup:

1. **Enable Firestore** for your Firebase project in the console
   (Build → Firestore Database → Create database). You do **not** need to
   enable Firebase Storage — file uploads use Appwrite instead, specifically
   because Firebase Storage requires a billing account even on its free
   tier and Appwrite Cloud doesn't.
2. **Set up Appwrite** — create a free project at
   [cloud.appwrite.io](https://cloud.appwrite.io) (or self-host, if you'd
   rather), then **one** Storage bucket with permissions **"Read: Any"**
   and nothing else (every write goes through this app's own API routes
   using an API key, which bypasses bucket permissions entirely, so the
   bucket itself only ever needs to allow public reads). The free plan
   caps you at one bucket — that's fine, case decks and competition
   submissions share it safely since every file gets its own random,
   globally-unique id; which Firestore doc a file belongs to is tracked in
   Firestore, not by which bucket it sits in.

   Then create an API key (Settings → API keys) with the `files.read`,
   `files.write`, and `files.delete` scopes. Fill in all the
   `NEXT_PUBLIC_APPWRITE_*` / `APPWRITE_*` variables in `.env.local` — see
   `.env.local.example` for the full list and where each one comes from.
3. **Add Firebase Admin credentials.** The two upload API routes
   (`src/app/api/case-decks/upload`, `src/app/api/case-competition/submit`)
   need to verify a caller's Firebase ID token server-side — Firestore
   security rules can't gate an Appwrite write the way they gate a
   Firestore write, so this is the actual enforcement layer for file
   uploads now. From Firebase console → Project settings → Service
   accounts → Generate new private key, then fill in `FIREBASE_PROJECT_ID`,
   `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in `.env.local`.
4. **Deploy the Firestore security rules and indexes** — the enforcement
   layer for all Firestore data (see the comments at the top of
   `firestore.rules`):
   ```bash
   npm install -g firebase-tools   # if you don't have it
   firebase login
   firebase use <your-project-id>
   firebase deploy --only firestore:rules,firestore:indexes
   ```
5. **Bootstrap your first admin.** There's no admin role anywhere else in this
   app to piggyback on, so this is a one-time manual step:
   - Sign in to the site once with the Google account that should be an admin.
   - Run: `GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/make-admin.mjs you@example.com`
     (this can reuse the same service account key from step 3, or a fresh one)
   - That account can now see "Manage competitions" on `/case-competition` and
     reach `/admin/case-competition`. It can also grant admin to others later
     by adding a doc at `/admins/{uid}` — including via the same script.

Everything else — creating a competition, going live, participants submitting
PDFs, scoring, and the leaderboard — works entirely from the UI at
`/case-competition` (participants) and `/admin/case-competition` (admins), and
the "games live now" strip near the top of every page reads the same live
status an admin sets from that admin page.

## Case Decks setup

The `/case-decks` library uses the same Firestore + Appwrite setup as the case
competition feature above (so no separate setup if you've already done that).
It's database-backed rather than a static array: **public read for everyone,
write restricted to admins** (see the `caseDecks` rule block in
`firestore.rules`, plus the admin check inside `src/app/api/case-decks/*`),
so participants can browse and open a deck but only an admin can add, edit,
replace a file, or remove one, from `/admin/case-decks`.

Four real decks (from the actual case competition PDFs this project was built
around) already exist as static files under `public/case-decks/`. To get them
into Firestore without re-uploading multi-megabyte PDFs through the browser
form, run the seed script once (same credentials as `make-admin.mjs` above):

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/seed-case-decks.mjs
```

Safe to re-run — it skips any deck id that already exists. After seeding,
every one of those four decks is fully editable from `/admin/case-decks` like
any deck added directly through the UI, including replacing its file with a
real Appwrite upload later if you want to retire the static asset it
currently points at.

## Scripts

```bash
npm run dev          # start the dev server
npm run build         # production build
npm run start          # run the production build
npm run lint             # ESLint
npm run type-check        # TypeScript, no emit
```

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) with a custom design system
- [Firebase Authentication](https://firebase.google.com/docs/auth) (Google Sign-In)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [lucide-react](https://lucide.dev/) for icons
