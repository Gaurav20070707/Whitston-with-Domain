"use client";

import { useCallback, useEffect, useState } from "react";
import { PlusCircle, ShieldOff, Pencil, Trash2, UploadCloud, FileText } from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  listCaseDecks, createCaseDeck, updateCaseDeck, deleteCaseDeck, attachFile,
} from "@/firebase/caseDecks";
import { caseDeckCategories, type CaseDeckCategory } from "@/constants/site";
import type { CaseDeck } from "@/types";

const EDITABLE_CATEGORIES = caseDeckCategories.filter((c): c is Exclude<CaseDeckCategory, "All"> => c !== "All");

export default function AdminCaseDecksPage() {
  const { user } = useAuth();
  const { isAdmin, isLoading } = useIsAdmin();
  const [decks, setDecks] = useState<CaseDeck[]>([]);

  const load = useCallback(async () => setDecks(await listCaseDecks()), []);
  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  if (isLoading) {
    return (
      <Section className="pt-16 md:pt-20"><Container>
        <div className="h-40 animate-pulse rounded-xl2 border-2 border-ink-900/10 bg-ink-900/5 dark:border-parchment-100/10 dark:bg-parchment-100/5" />
      </Container></Section>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Section className="pt-16 md:pt-20"><Container>
        <div className="flex flex-col items-center gap-3 rounded-xl2 border-2 border-dashed border-ink-900/25 py-20 text-center dark:border-parchment-100/25">
          <ShieldOff className="h-8 w-8 text-ink-500 dark:text-ink-300" aria-hidden="true" />
          <p className="font-display text-lg font-bold text-ink-800 dark:text-parchment-200">
            You don&apos;t have access to this page.
          </p>
          <p className="max-w-sm text-sm text-ink-600 dark:text-ink-300">
            Case deck management is limited to site admins. See firestore.rules for how to grant access.
          </p>
        </div>
      </Container></Section>
    );
  }

  return (
    <Section className="pt-16 md:pt-20">
      <Container>
        <h1 className="font-display text-3xl font-black uppercase text-ink-900 dark:text-parchment-100">
          Case Decks &mdash; Admin
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-600 dark:text-ink-300">
          Anyone can browse and open a deck on the public page — only admins can add, edit, replace a file, or remove one.
        </p>

        <CreateDeckForm onCreated={load} />

        <div className="mt-12 space-y-4">
          {decks.map((d) => (
            <DeckRow key={d.id} deck={d} onChanged={load} />
          ))}
          {decks.length === 0 && (
            <p className="text-sm text-ink-500 dark:text-ink-300">No decks yet &mdash; add one above.</p>
          )}
        </div>
      </Container>
    </Section>
  );
}

function CreateDeckForm({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState("");
  const [category, setCategory] = useState<Exclude<CaseDeckCategory, "All">>(EDITABLE_CATEGORIES[0]!);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setMessage(null);
    try {
      await createCaseDeck(
        { title, description, category, team: team || undefined, thumbnailUrl },
        user.uid,
        file,
      );
      setTitle(""); setDescription(""); setTeam(""); setThumbnailUrl(""); setFile(null);
      setMessage("Deck added.");
      onCreated();
    } catch (err) {
      setMessage((err as Error).message || "Couldn't add the deck.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 dark:border-parchment-100 dark:bg-ink-700">
      <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-brass-dark dark:text-brass-light">
        <PlusCircle className="h-4 w-4" aria-hidden="true" /> New deck
      </h2>
      <input
        value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title"
        className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
      />
      <textarea
        value={description} onChange={(e) => setDescription(e.target.value)} required rows={2}
        placeholder="Short description shown on the card"
        className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Team / author credit (optional)"
          className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
        />
        <select
          value={category} onChange={(e) => setCategory(e.target.value as Exclude<CaseDeckCategory, "All">)}
          className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
        >
          {EDITABLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <input
        value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} required
        placeholder="Thumbnail image URL"
        className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
      />
      <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-ink-900/25 px-3.5 py-2.5 text-sm text-ink-600 dark:border-parchment-100/25 dark:text-ink-300">
        <UploadCloud className="h-4 w-4 shrink-0" aria-hidden="true" />
        {file ? file.name : "Upload PDF (optional — can add later)"}
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      {message && <p className="text-sm text-ink-600 dark:text-ink-200">{message}</p>}
      <Button type="submit" size="sm" disabled={busy}>{busy ? "Adding\u2026" : "Add deck"}</Button>
    </form>
  );
}

function DeckRow({ deck, onChanged }: { deck: CaseDeck; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description);
  const [team, setTeam] = useState(deck.team ?? "");
  const [category, setCategory] = useState<Exclude<CaseDeckCategory, "All">>(deck.category);
  const [thumbnailUrl, setThumbnailUrl] = useState(deck.thumbnailUrl);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await updateCaseDeck(deck.id, { title, description, team: team || undefined, category, thumbnailUrl });
      setEditing(false);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function replaceFile(f: File) {
    setBusy(true);
    try {
      await attachFile(deck.id, f);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete "${deck.title}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await deleteCaseDeck(deck.id);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <div className="space-y-3 rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-5 dark:border-parchment-100 dark:bg-ink-700">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3 py-2 text-sm dark:border-parchment-100/20 dark:text-parchment-100" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3 py-2 text-sm dark:border-parchment-100/20 dark:text-parchment-100" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Team / author" className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3 py-2 text-sm dark:border-parchment-100/20 dark:text-parchment-100" />
          <select value={category} onChange={(e) => setCategory(e.target.value as Exclude<CaseDeckCategory, "All">)} className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3 py-2 text-sm dark:border-parchment-100/20 dark:text-parchment-100">
            {EDITABLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3 py-2 text-sm dark:border-parchment-100/20 dark:text-parchment-100" />
        <div className="flex gap-2">
          <Button size="sm" onClick={save} disabled={busy}>{busy ? "Saving\u2026" : "Save"}</Button>
          <Button size="sm" variant="secondary" onClick={() => setEditing(false)} disabled={busy}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl2 border-2 border-ink-900 bg-parchment-100 px-5 py-4 dark:border-parchment-100 dark:bg-ink-700">
      <div className="min-w-0">
        <p className="truncate font-display font-bold text-ink-900 dark:text-parchment-100">{deck.title}</p>
        <p className="text-xs text-ink-500 dark:text-ink-300">
          {deck.category}{deck.team ? ` \u00b7 ${deck.team}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {deck.fileUrl && (
          <a href={deck.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-brass-dark underline dark:text-brass-light">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Open
          </a>
        )}
        <label className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-ink-600 underline dark:text-ink-300">
          <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" /> {deck.fileUrl ? "Replace file" : "Upload file"}
          <input type="file" accept="application/pdf" className="hidden" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) replaceFile(f); }} />
        </label>
        <Button size="sm" variant="secondary" onClick={() => setEditing(true)} icon={<Pencil className="h-3.5 w-3.5" />}>Edit</Button>
        <Button size="sm" variant="outline" onClick={remove} disabled={busy} icon={<Trash2 className="h-3.5 w-3.5" />}>Delete</Button>
      </div>
    </div>
  );
}
