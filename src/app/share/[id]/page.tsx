"use client";

import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Lock,
  MessageCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SharePage() {
const params = useParams();
const searchParams = useSearchParams();

const id = params.id as string;
const senderToken = searchParams.get("token");

  const [copied, setCopied] = useState(false);

  const messageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/m/${id}`
      : "";

      const inboxUrl =
  typeof window !== "undefined" && senderToken
    ? `${window.location.origin}/inbox/${senderToken}`
    : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(messageUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareWhatsApp = () => {
    const text = `✉️ Someone has something they want to tell you.

They chose to remain anonymous.

Open when you're ready:
${messageUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-950/20 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        {/* Seal animation */}
        <motion.div
          initial={{ scale: 0.5, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10"
        >
          <Lock size={28} strokeWidth={1} className="text-red-200" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-[10px] uppercase tracking-[0.5em] text-red-300/70"
        >
          Message sealed
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-4xl font-light md:text-5xl"
        >
          It's ready to find them.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-zinc-500"
        >
          Your words have been sealed. Now all that's left is to let them
          discover what you couldn't say.
        </motion.p>

        {/* Link box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
          <p className="truncate text-sm text-zinc-500">
            {messageUrl || "Generating your link..."}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-5 grid gap-3 sm:grid-cols-2"
        >
          <button
            onClick={copyLink}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm transition hover:border-white/25 hover:bg-white/[0.06]"
          >
            {copied ? (
              <>
                <Check size={17} className="text-green-400" />
                Copied
              </>
            ) : (
              <>
                <Copy size={17} />
                Copy link
              </>
            )}
          </button>
<div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-5 text-left">
  <div className="flex items-start gap-3">
    <Lock
      size={18}
      strokeWidth={1.3}
      className="mt-0.5 text-amber-300"
    />

    <div>
      <h3 className="text-sm text-amber-100">
        Your private inbox
      </h3>

      <p className="mt-2 text-xs leading-relaxed text-zinc-500">
        Save this link. It's the only place where you'll be able to
        see anonymous replies to your message.
      </p>

      <button
        onClick={async () => {
          if (!inboxUrl) return;
          await navigator.clipboard.writeText(inboxUrl);
        }}
        className="mt-4 text-xs text-amber-300 transition hover:text-amber-200"
      >
        Copy private inbox link →
      </button>
    </div>
  </div>
</div>

          <button
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm transition hover:bg-red-400/20"
          >
            <MessageCircle size={18} />
            Send anonymously
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-10 rounded-xl border border-white/5 bg-white/[0.015] p-4"
        >
          <div className="flex gap-3 text-left">
            <Share2
              size={17}
              strokeWidth={1}
              className="mt-0.5 shrink-0 text-zinc-600"
            />

            <p className="text-xs leading-relaxed text-zinc-600">
              When they open this link, they&apos;ll see your message—but
              never your name. What happens after that is up to them.
            </p>
          </div>
        </motion.div>

        <Link
          href="/"
          className="mt-8 inline-block text-xs text-zinc-700 transition hover:text-zinc-400"
        >
          anonymous, to you.
        </Link>
      </motion.div>
    </main>
  );
}