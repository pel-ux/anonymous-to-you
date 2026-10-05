"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Heart,
  Loader2,
  Lock,
  Send,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/firebase";

export default function PublicInboxPage() {
  const params = useParams();
  const username = params.username as string;

  const [profileId, setProfileId] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("Mystery");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const findProfile = async () => {
      try {
        const profilesRef = collection(db, "profiles");

        const profileQuery = query(
          profilesRef,
          where("usernameLower", "==", username.toLowerCase())
        );

        const snapshot = await getDocs(profileQuery);

        if (snapshot.empty) {
          setNotFound(true);
          return;
        }

        setProfileId(snapshot.docs[0].id);
      } catch (error) {
        console.error("Failed to find profile:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      findProfile();
    }
  }, [username]);

  const sendMessage = async () => {
    if (!message.trim() || !profileId) return;

    try {
      setSending(true);

      const profile = await getDocs(
        query(
          collection(db, "profiles"),
          where("usernameLower", "==", username.toLowerCase())
        )
      );

      if (profile.empty) {
        setNotFound(true);
        return;
      }

      const profileData = profile.docs[0].data();

      await addDoc(collection(db, "messages"), {
        profileId,
        inboxToken: profileData.ownerToken,

        recipientType: "Anonymous Inbox",
        recipientName: username,

        content: message.trim(),
        mood,

        senderToken: crypto.randomUUID(),

        messageType: "inbox",

        createdAt: serverTimestamp(),
        opened: false,
        replyCount: 0,
      });

      setMessage("");
      setSent(true);
    } catch (error) {
      console.error("Failed to send anonymous message:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10"
          >
            <Sparkles size={17} className="text-zinc-500" />
          </motion.div>

          <p className="text-[9px] uppercase tracking-[0.5em] text-zinc-700">
            Finding their inbox
          </p>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <div>
          <Lock size={28} className="mx-auto text-zinc-700" />

          <p className="mt-7 text-[10px] uppercase tracking-[0.5em] text-zinc-700">
            Nothing here
          </p>

          <h1 className="mt-5 text-4xl font-light">
            This ATY link doesn&apos;t exist.
          </h1>

          <p className="mt-5 text-sm text-zinc-600">
            Check the username and try again.
          </p>
        </div>
      </main>
    );
  }

  if (sent) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-white">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
            }}
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-950/20 blur-[140px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative z-10 max-w-md text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-400/5">
            <Check size={24} className="text-red-300" />
          </div>

          <p className="mt-9 text-[10px] uppercase tracking-[0.5em] text-red-300/70">
            Delivered
          </p>

          <h1 className="mt-5 text-4xl font-extralight md:text-5xl">
            Your words
            <br />
            <span className="text-zinc-500">are with them.</span>
          </h1>

          <p className="mt-6 text-sm leading-7 text-zinc-600">
            Your message was sent anonymously to @{username}.
            <br />
            They won&apos;t know it was you.
          </p>

          <button
            onClick={() => setSent(false)}
            className="mt-10 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            Send another
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-950/20 blur-[150px]"
        />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center px-5 pb-16 pt-16 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-red-400/15 bg-red-400/5"
        >
          <Heart
            size={22}
            strokeWidth={0.8}
            className="text-red-300"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-[10px] uppercase tracking-[0.5em] text-red-300/70"
        >
          Anonymous inbox
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-5xl font-extralight tracking-tight md:text-7xl"
        >
          Say something to
          <br />
          <span className="text-zinc-500">@{username}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-6 max-w-md text-sm leading-7 text-zinc-600"
        >
          They won&apos;t see your name.
          <br />
          Just your words.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-12 w-full"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 text-left backdrop-blur-xl md:p-8">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                Your anonymous message
              </p>

              <span className="text-[9px] text-zinc-700">
                {message.length}/1000
              </span>
            </div>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.slice(0, 1000))
              }
              rows={8}
              placeholder="Write what you really want to say..."
              className="mt-6 w-full resize-none bg-transparent text-base font-light leading-8 text-zinc-200 outline-none placeholder:text-zinc-700"
            />

            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                Choose a feeling
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Mystery", "Love", "Warm", "Melancholy"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => setMood(item)}
                      className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition ${
                        mood === item
                          ? "border-red-300/25 bg-red-400/10 text-red-200"
                          : "border-white/10 text-zinc-600 hover:border-white/20 hover:text-zinc-400"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <button
            onClick={sendMessage}
            disabled={sending || !message.trim()}
            className="group mt-5 flex w-full items-center justify-center gap-4 rounded-2xl border border-red-300/20 bg-red-400/[0.08] px-6 py-5 text-xs uppercase tracking-[0.3em] text-red-100 transition hover:bg-red-400/[0.13] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {sending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send anonymously
                <Send
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Lock size={11} className="text-zinc-700" />

            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-700">
              Your identity stays hidden
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}