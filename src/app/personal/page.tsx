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
  Heart,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";

export default function PersonalPage() {
  const router = useRouter();

  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("Love");
  const [sending, setSending] = useState(false);

  const moods = [
    {
      name: "Love",
      description: "Something from the heart",
      color: "rose",
    },
    {
      name: "Warm",
      description: "Something they need to hear",
      color: "orange",
    },
    {
      name: "Mystery",
      description: "Let them wonder",
      color: "purple",
    },
    {
      name: "Midnight",
      description: "Something unsaid",
      color: "indigo",
    },
  ];

  const sendMessage = async () => {
    if (!recipientName.trim() || !message.trim()) return;

    try {
      setSending(true);

      const senderToken = crypto.randomUUID();

      const docRef = await addDoc(collection(db, "messages"), {
        recipientType: "Personal",
        recipientName: recipientName.trim(),
        content: message.trim(),
        mood,
        senderToken,
        createdAt: serverTimestamp(),
        opened: false,
        replyCount: 0,
        messageType: "personal",
      });

      router.push(`/share/${docRef.id}?token=${senderToken}`);
    } catch (error) {
      console.error("Failed to create personal message:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const canSend =
    recipientName.trim().length > 0 &&
    message.trim().length > 0 &&
    !sending;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.18, 0.35, 0.18],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-950/20 blur-[150px]"
        />

        <div className="absolute left-[12%] top-[20%] h-1 w-1 rounded-full bg-white/20" />
        <div className="absolute left-[82%] top-[25%] h-1 w-1 rounded-full bg-white/20" />
        <div className="absolute left-[20%] top-[75%] h-1 w-1 rounded-full bg-white/20" />
        <div className="absolute left-[78%] top-[80%] h-1 w-1 rounded-full bg-white/20" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-7 md:px-12">
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

      {/* Content */}
      <section className="relative z-10 mx-auto w-full max-w-2xl px-5 pb-20 pt-10 md:px-8 md:pt-16">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-purple-400/15 bg-purple-400/5">
            <Heart
              size={21}
              strokeWidth={0.9}
              className="text-purple-300"
            />
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[0.5em] text-purple-300/70">
            Personal message
          </p>

          <h1 className="mt-5 text-4xl font-extralight tracking-tight md:text-6xl">
            Something meant
            <br />
            <span className="text-zinc-500">just for them.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-zinc-600">
            Write something you want one person to discover. No public post.
            No awkward explanation. Just your words.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-14 space-y-5"
        >
          {/* Recipient */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10">
                <Sparkles size={14} className="text-zinc-500" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                  For someone special
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  Who is this for?
                </p>
              </div>
            </div>

            <input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Their name..."
              maxLength={80}
              className="mt-6 w-full border-b border-white/10 bg-transparent pb-4 text-lg font-light text-white outline-none placeholder:text-zinc-700 focus:border-purple-300/30"
            />
          </div>

          {/* Message */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                Your words
              </p>

              <span className="text-[9px] text-zinc-700">
                {message.length}/1000
              </span>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
              placeholder="Say what you want them to know..."
              rows={8}
              className="mt-5 w-full resize-none bg-transparent text-base font-light leading-8 text-zinc-200 outline-none placeholder:text-zinc-700"
            />
          </div>

          {/* Mood */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
              Set the feeling
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {moods.map((item) => {
                const selected = mood === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setMood(item.name)}
                    className={`relative rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-purple-300/30 bg-purple-400/[0.07]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    {selected && (
                      <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-300 text-black">
                        <Check size={11} />
                      </div>
                    )}

                    <p
                      className={`text-sm ${
                        selected ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {item.name}
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-zinc-700">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Send */}
          <motion.button
            type="button"
            disabled={!canSend}
            onClick={sendMessage}
            whileHover={canSend ? { y: -2 } : undefined}
            whileTap={canSend ? { scale: 0.98 } : undefined}
            className="group relative mt-3 flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl border border-purple-300/20 bg-purple-400/[0.08] px-6 py-5 text-xs uppercase tracking-[0.3em] text-purple-100 transition hover:bg-purple-400/[0.13] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {sending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Sealing message...
              </>
            ) : (
              <>
                <Lock size={14} />
                Seal & send
                <ArrowRight
                  size={15}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </>
            )}
          </motion.button>

          <div className="flex items-center justify-center gap-2 pt-2 text-center">
            <Lock size={11} className="text-zinc-700" />

            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-700">
              Private message · shared only by you
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}