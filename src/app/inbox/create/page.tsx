"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
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

  const cleanUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);

  const createInbox = async () => {
    if (cleanUsername.length < 3) {
      setError("Choose a username with at least 3 characters.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const ownerToken = crypto.randomUUID();

      const profileRef = await addDoc(collection(db, "profiles"), {
        username: cleanUsername,
        usernameLower: cleanUsername,
        ownerToken,
        createdAt: serverTimestamp(),
        active: true,
      });

      router.push(
        `/inbox/${ownerToken}?profile=${profileRef.id}&username=${cleanUsername}`
      );
    } catch (error) {
      console.error("Failed to create inbox:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-950/20 blur-[150px]"
        />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-7 md:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 text-zinc-600 transition hover:text-white"
        >
          <ArrowLeft size={15} />

          <span className="text-[10px] uppercase tracking-[0.4em]">
            Back
          </span>
        </Link>

        <p className="text-[9px] uppercase tracking-[0.55em] text-zinc-700">
          anonymous, to you.
        </p>

        <div className="w-12" />
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-xl flex-col items-center px-6 pb-20 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-red-400/15 bg-red-400/5"
        >
          <Sparkles
            size={22}
            strokeWidth={0.8}
            className="text-red-300"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-[10px] uppercase tracking-[0.5em] text-red-300/70"
        >
          Your anonymous inbox
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-5xl font-extralight leading-[1] tracking-tight md:text-7xl"
        >
          Let people
          <br />
          <span className="text-zinc-500">say something.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-7 max-w-md text-sm leading-7 text-zinc-600"
        >
          Create your personal ATY link. Share it anywhere and let people
          leave you messages without revealing their identity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 w-full"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 text-left backdrop-blur-xl">
            <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
              Choose your link
            </p>

            <div className="mt-5 flex items-center rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <span className="whitespace-nowrap text-sm text-zinc-700">
                /u/
              </span>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createInbox();
                }}
                placeholder="yourname"
                maxLength={20}
                className="min-w-0 flex-1 bg-transparent px-2 text-base text-white outline-none placeholder:text-zinc-700"
              />

              {cleanUsername.length >= 3 && (
                <Check size={16} className="text-emerald-400" />
              )}
            </div>

            <p className="mt-3 text-[10px] leading-5 text-zinc-700">
              Letters, numbers and underscores only.
            </p>

            {error && (
              <p className="mt-4 text-xs text-red-400">{error}</p>
            )}
          </div>

          <button
            onClick={createInbox}
            disabled={creating || cleanUsername.length < 3}
            className="group mt-5 flex w-full items-center justify-center gap-4 rounded-2xl border border-red-300/20 bg-red-400/[0.08] px-6 py-5 text-xs uppercase tracking-[0.3em] text-red-100 transition hover:bg-red-400/[0.13] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {creating ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Creating your inbox...
              </>
            ) : (
              <>
                Create my ATY link
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Lock size={11} className="text-zinc-700" />

            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-700">
              Your inbox is private
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}