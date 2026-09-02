"use client";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Message {
  recipientType: string;
  content: string;
  mood: string;
}

export default function MessagePage() {
  const params = useParams();
  const id = params.id as string;

  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMessage(docSnap.data() as Message);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch message:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMessage();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-red-300" size={24} />
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
            Finding your message
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !message) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-red-300/70">
            Lost message
          </p>

          <h1 className="mt-5 text-4xl font-light">
            There's nothing here.
          </h1>

          <p className="mt-4 text-sm text-zinc-500">
            Perhaps this message was never meant to be found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-white">
      {/* Background atmosphere */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] ${
            message.mood === "Love"
              ? "bg-rose-950/30"
              : message.mood === "Warm"
                ? "bg-orange-950/25"
                : message.mood === "Melancholy"
                  ? "bg-indigo-950/30"
                  : "bg-slate-900/30"
          }`}
        />
      </div>

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="sealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex max-w-lg flex-col items-center text-center"
          >
            {/* Floating envelope */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [-1, 1, -1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative mb-10 flex h-28 w-40 items-center justify-center"
            >
              <div className="absolute inset-0 rounded-md border border-white/15 bg-white/[0.04]" />

              <Mail
                size={48}
                strokeWidth={0.8}
                className="relative text-red-200"
              />

              <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-red-300/20 bg-red-400/10">
                <Lock size={11} className="text-red-200" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[10px] uppercase tracking-[0.5em] text-red-300/70"
            >
              An anonymous message
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-4xl font-light md:text-6xl"
            >
              Someone left
              <br />
              something for you.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-500"
            >
              They chose not to leave their name.
              <br />
              Only their words.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              onClick={() => setOpened(true)}
              className="group mt-10 flex items-center gap-3 rounded-full border border-white/15 px-7 py-3.5 text-sm transition hover:border-red-300/50 hover:bg-red-400/10"
            >
              <span>Open carefully</span>
              <Sparkles
                size={15}
                className="text-red-200 transition-transform duration-300 group-hover:rotate-12"
              />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
            className="relative z-10 w-full max-w-2xl"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm md:p-12">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.4em] text-red-300/60">
                  For {message.recipientType}
                </span>

                <Heart
                  size={16}
                  strokeWidth={1}
                  className="text-zinc-600"
                />
              </div>

              <div className="my-8 h-px bg-white/10" />

              <motion.p
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.03,
                    },
                  },
                }}
                className="whitespace-pre-wrap text-lg font-light leading-[1.9] text-zinc-200 md:text-xl"
              >
                {message.content}
              </motion.p>

              <div className="my-10 h-px bg-white/10" />

              <p className="text-center text-xs italic text-zinc-600">
                — from someone who chose to remain unknown.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-700">
                Some things are easier to say unseen
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}