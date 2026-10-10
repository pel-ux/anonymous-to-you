"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";

export default function CreateInboxPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const cleanUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);

  const createInbox = async () => {
    if (creating) return;

    if (cleanUsername.length < 3) {
      setError("Choose a username with at least 3 characters.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setGeneratedUrl("");

      const ownerToken = crypto.randomUUID();

      const profileRef = await addDoc(collection(db, "profiles"), {
        username: cleanUsername,
        usernameLower: cleanUsername,
        ownerToken,
        createdAt: serverTimestamp(),
        active: true,
      });

      // Build the public link using the current website origin.
      const publicUrl = `${window.location.origin}/u/${encodeURIComponent(
        cleanUsername
      )}`;

      setGeneratedUrl(publicUrl);

      // Preserve your existing inbox route and query parameters.
      const inboxUrl = `/inbox/${ownerToken}?profile=${profileRef.id}&username=${encodeURIComponent(
        cleanUsername
      )}`;

      // Give the user the opportunity to see and copy the public link.
      // The inbox dashboard remains accessible through the button below.
      console.log("ATY profile created:", profileRef.id);
      console.log("Public anonymous link:", publicUrl);
      console.log("Inbox dashboard:", inboxUrl);
    } catch (err) {
      console.error("Failed to create inbox:", err);

      const firebaseError = err as {
        code?: string;
        message?: string;
      };

      setError(
        `Could not create your inbox. ${
          firebaseError.code
            ? `Error: ${firebaseError.code}. `
            : ""
        }${firebaseError.message || "Please try again."}`
      );
    } finally {
      setCreating(false);
    }
  };

  const copyLink = async () => {
    if (!generatedUrl) return;

    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy link:", err);
      setError(
        "Automatic copying failed. Select and copy the link manually."
      );
    }
  };

  const openInbox = async () => {
    if (!generatedUrl) return;

    // Find the newly created profile so we can recover its owner token.
    try {
      const { getDocs, query, where } = await import("firebase/firestore");

      const snapshot = await getDocs(
        query(
          collection(db, "profiles"),
          where("usernameLower", "==", cleanUsername)
        )
      );

      if (snapshot.empty) {
        setError(
          "Your public link was generated, but the profile could not be found in Firestore."
        );
        return;
      }

      const profile = snapshot.docs[0];
      const profileData = profile.data();

      router.push(
        `/inbox/${profileData.ownerToken}?profile=${profile.id}&username=${encodeURIComponent(
          cleanUsername
        )}`
      );
    } catch (err) {
      console.error("Failed to open inbox:", err);
      setError(
        "Could not open your inbox dashboard. Check the browser console for details."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-7">
        <Link
          href="/"
          className="flex items-center gap-3 text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Back
          </span>
        </Link>

        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
          anonymous, to you.
        </p>

        <div className="w-12" />
      </header>

      <section className="mx-auto flex w-full max-w-xl flex-col items-center px-6 pb-16 pt-14 text-center sm:pt-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10">
          <Sparkles size={21} strokeWidth={1.2} className="text-red-300" />
        </div>

        <p className="mt-7 text-[10px] uppercase tracking-[0.4em] text-red-300/80">
          Your anonymous inbox
        </p>

        <h1 className="mt-5 text-4xl font-light tracking-tight sm:text-6xl">
          Let people
          <br />
          <span className="text-zinc-500">say something.</span>
        </h1>

        <p className="mt-6 max-w-md text-sm leading-7 text-zinc-500">
          Create your personal ATY link. Share it anywhere and let people
          leave you anonymous messages.
        </p>

        <div className="mt-12 w-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left sm:p-6">
          <label
            htmlFor="username"
            className="text-[10px] uppercase tracking-[0.3em] text-zinc-500"
          >
            Choose your username
          </label>

          <div className="mt-4 flex items-center rounded-xl border border-white/10 bg-black px-4 py-4">
            <span className="text-sm text-zinc-600">/u/</span>

            <input
              id="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") void createInbox();
              }}
              placeholder="yourname"
              maxLength={20}
              disabled={creating || !!generatedUrl}
              className="min-w-0 flex-1 bg-transparent px-2 text-base outline-none placeholder:text-zinc-700 disabled:opacity-60"
            />

            {cleanUsername.length >= 3 && (
              <Check size={16} className="text-emerald-400" />
            )}
          </div>

          <p className="mt-3 text-xs leading-5 text-zinc-600">
            Use at least 3 characters. Letters, numbers and underscores only.
          </p>

          {error && (
            <div className="mt-4 break-words rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-left text-xs leading-5 text-red-300">
              {error}
            </div>
          )}

          {!generatedUrl && (
            <button
              type="button"
              onClick={() => void createInbox()}
              disabled={creating || cleanUsername.length < 3}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-red-300/20 bg-red-400/10 px-5 py-4 text-xs uppercase tracking-[0.2em] text-red-100 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {creating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating inbox...
                </>
              ) : (
                <>
                  Create my ATY link
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          )}
        </div>

        {generatedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 w-full rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5 text-left"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-300">
              Your link is ready
            </p>

            <div className="mt-4 break-all rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white">
              {generatedUrl}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void copyLink()}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs transition hover:bg-white/5"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied!" : "Copy link"}
              </button>

              <a
                href={generatedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs transition hover:bg-white/5"
              >
                <ExternalLink size={15} />
                Test link
              </a>
            </div>

            <button
              type="button"
              onClick={() => void openInbox()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-4 text-xs font-medium text-black transition hover:bg-zinc-200"
            >
              Open my inbox dashboard
              <ArrowRight size={15} />
            </button>
          </motion.div>
        )}

        <div className="mt-7 flex items-center justify-center gap-2 text-zinc-600">
          <Lock size={12} />
          <p className="text-[9px] uppercase tracking-[0.2em]">
            Keep your inbox dashboard link private
          </p>
        </div>
      </section>
    </main>
  );
}