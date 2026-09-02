"use client";

import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  UserRound,
  Users,
  Moon,
  Sparkles,
  Lock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
const recipients = [
  { label: "Someone I love", icon: Heart },
  { label: "A friend", icon: UserRound },
  { label: "Family", icon: Users },
  { label: "Someone I miss", icon: Moon },
  { label: "Someone I'll never tell", icon: Lock },
];

const moods = [
  {
    name: "Midnight",
    description: "Quiet. Deep. Unspoken.",
    className: "from-zinc-950 to-slate-900",
  },
  {
    name: "Warm",
    description: "Soft words from the heart.",
    className: "from-orange-950/40 to-zinc-950",
  },
  {
    name: "Love",
    description: "For feelings that stayed too long.",
    className: "from-rose-950/50 to-zinc-950",
  },
  {
    name: "Melancholy",
    description: "Some memories never leave.",
    className: "from-indigo-950/50 to-zinc-950",
  },
];
export default function CreateMessage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("");
  const [isSealing, setIsSealing] = useState(false);

  const sealMessage = async () => {
  if (!recipient || !message.trim() || !mood) return;

  try {
    setIsSealing(true);

    const docRef = await addDoc(collection(db, "messages"), {
      recipientType: recipient,
      content: message.trim(),
      mood,
      createdAt: serverTimestamp(),
    });

   router.push(`/share/${docRef.id}`);
  } catch (error) {
    console.error("Failed to seal message:", error);
    alert("Something went wrong while sealing your message. Please try again.");
  } finally {
    setIsSealing(false);
  }
};

  const nextStep = () => {
    if (step === 1 && !recipient) return;
    if (step === 2 && !message.trim()) return;
    if (step === 3 && !mood) return;

    setStep((current) => current + 1);
  };

  const previousStep = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-950/10 blur-[140px]" />
      </div>

      {/* Top navigation */}
      <div className="relative z-10 flex items-center justify-between px-6 py-7 md:px-12">
        <Link
          href="/"
          className="text-sm tracking-[0.25em] text-zinc-400 transition hover:text-white"
        >
          ATY<span className="text-red-400">.</span>
        </Link>

        <div className="text-xs text-zinc-600">
          {step} / 4
        </div>
      </div>

      {/* Progress */}
      <div className="relative z-10 mx-auto flex max-w-md gap-2 px-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={`h-[2px] flex-1 transition-all duration-500 ${
              item <= step ? "bg-red-400" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <section className="relative z-10 mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <p className="mb-4 text-center text-[10px] uppercase tracking-[0.5em] text-red-300/70">
                Chapter one
              </p>

              <h1 className="text-center text-4xl font-light md:text-6xl">
                Who is this for?
              </h1>

              <p className="mx-auto mt-5 max-w-md text-center text-sm text-zinc-500">
                You don't have to tell us their name.
              </p>

              <div className="mx-auto mt-12 grid max-w-2xl gap-3 sm:grid-cols-2">
                {recipients.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.label}
                      onClick={() => setRecipient(item.label)}
                      className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                        recipient === item.label
                          ? "border-red-400/60 bg-red-400/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.3}
                        className={
                          recipient === item.label
                            ? "text-red-300"
                            : "text-zinc-500"
                        }
                      />

                      <span className="text-sm text-zinc-300">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <p className="mb-4 text-center text-[10px] uppercase tracking-[0.5em] text-red-300/70">
                Chapter two
              </p>

              <h1 className="text-center text-4xl font-light md:text-6xl">
                Say what you couldn't.
              </h1>

              <p className="mx-auto mt-5 max-w-md text-center text-sm text-zinc-500">
                No one is watching. Take your time.
              </p>

              <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Start writing..."
                  className="min-h-[260px] w-full resize-none bg-transparent text-lg leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-700"
                  maxLength={2000}
                />

                <div className="mt-4 flex justify-between border-t border-white/5 pt-4">
                  <span className="text-xs text-zinc-600">
                    Let the words breathe.
                  </span>

                  <span className="text-xs text-zinc-600">
                    {message.length}/2000
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <p className="mb-4 text-center text-[10px] uppercase tracking-[0.5em] text-red-300/70">
                Chapter three
              </p>

              <h1 className="text-center text-4xl font-light md:text-6xl">
                How should it feel?
              </h1>

              <p className="mx-auto mt-5 max-w-md text-center text-sm text-zinc-500">
                Every message carries a different weight.
              </p>

              <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
                {moods.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setMood(item.name)}
                    className={`relative overflow-hidden rounded-2xl border p-7 text-left transition-all duration-300 ${
                      mood === item.name
                        ? "border-red-400/70 scale-[1.02]"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.className}`}
                    />

                    <div className="relative">
                      <Sparkles
                        size={18}
                        className="mb-8 text-white/40"
                        strokeWidth={1}
                      />

                      <h3 className="text-xl font-light">{item.name}</h3>

                      <p className="mt-2 text-sm text-zinc-500">
                        {item.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-400/20 bg-red-400/5"
              >
                <Lock size={28} strokeWidth={1} className="text-red-300" />
              </motion.div>

              <p className="mt-10 text-[10px] uppercase tracking-[0.5em] text-red-300/70">
                Final chapter
              </p>

              <h1 className="mt-4 text-4xl font-light md:text-6xl">
                Ready to seal it?
              </h1>

              <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-500">
                Once sealed, this message will become a private experience
                waiting for someone to discover it.
              </p>

              <div className="mx-auto mt-10 max-w-sm rounded-xl border border-white/10 bg-white/[0.02] p-5 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600">For</span>
                  <span className="text-zinc-300">{recipient}</span>
                </div>

                <div className="mt-4 flex justify-between text-xs">
                  <span className="text-zinc-600">Mood</span>
                  <span className="text-zinc-300">{mood}</span>
                </div>

                <div className="mt-4 border-t border-white/5 pt-4">
                  <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500">
                    {message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Controls */}
      <div className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 pb-10">
        <button
          onClick={previousStep}
          className={`flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white ${
            step === 1 ? "invisible" : ""
          }`}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {step < 4 ? (
          <button
            onClick={nextStep}
            disabled={
              (step === 1 && !recipient) ||
              (step === 2 && !message.trim()) ||
              (step === 3 && !mood)
            }
            className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm transition hover:border-red-400/50 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        ) : (
        <button
  onClick={sealMessage}
  disabled={isSealing}
  className="flex items-center gap-2 rounded-full border border-red-400/40 bg-red-400/10 px-7 py-3 text-sm text-red-100 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
>
  {isSealing ? (
    <>
      Sealing...
      <Loader2 size={15} className="animate-spin" />
    </>
  ) : (
    <>
      Seal message
      <Lock size={15} />
    </>
  )}
</button>
        )}
      </div>
    </main>
  );
}