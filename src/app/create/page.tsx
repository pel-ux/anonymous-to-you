"use client";

import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Feather,
  Heart,
  Lock,
  Loader2,
  Moon,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const recipients = [
  {
    label: "Someone I love",
    description: "For the person who has your heart.",
    icon: Heart,
  },
  {
    label: "A friend",
    description: "Something you've always wanted to say.",
    icon: UserRound,
  },
  {
    label: "Family",
    description: "Words that belong closer to home.",
    icon: Users,
  },
  {
    label: "Someone I miss",
    description: "For someone who isn't close anymore.",
    icon: Moon,
  },
  {
    label: "Someone I'll never tell",
    description: "The words that stay between you and you.",
    icon: Lock,
  },
];

const moods = [
  {
    name: "Midnight",
    description: "Quiet. Deep. Unspoken.",
    className: "from-slate-950 via-zinc-950 to-black",
    glow: "bg-indigo-500/10",
  },
  {
    name: "Warm",
    description: "Soft words from the heart.",
    className: "from-orange-950/60 via-zinc-950 to-black",
    glow: "bg-orange-400/10",
  },
  {
    name: "Love",
    description: "For feelings that stayed too long.",
    className: "from-rose-950/70 via-zinc-950 to-black",
    glow: "bg-rose-500/15",
  },
  {
    name: "Melancholy",
    description: "Some memories never leave.",
    className: "from-indigo-950/70 via-zinc-950 to-black",
    glow: "bg-indigo-500/15",
  },
];

const stepLabels = ["Who", "Words", "Feeling", "Seal"];

export default function CreateMessage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("");
  const [isSealing, setIsSealing] = useState(false);

  const sealMessage = async () => {
    if (!recipient || !message.trim() || !mood) return;

    try {
      setIsSealing(true);

      const senderToken = crypto.randomUUID();

      const docRef = await addDoc(collection(db, "messages"), {
        recipientType: recipient,
        content: message.trim(),
        mood,
        senderToken,
        createdAt: serverTimestamp(),
        opened: false,
        replyCount: 0,
      });

      router.push(`/share/${docRef.id}?token=${senderToken}`);
    } catch (error) {
      console.error("Failed to seal message:", error);
      alert(
        "Something went wrong while sealing your message. Please try again."
      );
    } finally {
      setIsSealing(false);
    }
  };

  const canContinue =
    (step === 1 && !!recipient) ||
    (step === 2 && !!message.trim()) ||
    (step === 3 && !!mood);

  const nextStep = () => {
    if (!canContinue) return;
    setStep((current) => Math.min(4, current + 1));
  };

  const previousStep = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  const particles = [
    { left: "8%", top: "18%", delay: 0 },
    { left: "18%", top: "72%", delay: 1.5 },
    { left: "31%", top: "25%", delay: 2.4 },
    { left: "78%", top: "20%", delay: 0.7 },
    { left: "91%", top: "55%", delay: 2 },
    { left: "70%", top: "78%", delay: 3 },
    { left: "12%", top: "86%", delay: 1 },
    { left: "53%", top: "12%", delay: 2.8 },
    { left: "86%", top: "84%", delay: 1.8 },
    { left: "42%", top: "88%", delay: 3.5 },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070707] text-white">
      {/* =========================================================
          CINEMATIC BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Main atmospheric glow */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["-8%", "10%", "-8%"],
                  y: ["0%", "8%", "0%"],
                  scale: [1, 1.12, 1],
                }
          }
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[18%] top-[15%] h-[420px] w-[420px] rounded-full bg-red-600/[0.09] blur-[110px]"
        />

        {/* Secondary glow */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["8%", "-10%", "8%"],
                  y: ["-5%", "12%", "-5%"],
                  scale: [1, 1.16, 1],
                }
          }
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[4%] top-[45%] h-[350px] w-[350px] rounded-full bg-red-900/[0.11] blur-[110px]"
        />

        {/* Bottom glow */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["-10%", "12%", "-10%"],
                  opacity: [0.25, 0.5, 0.25],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-220px] left-[25%] h-[400px] w-[400px] rounded-full bg-red-500/[0.07] blur-[100px]"
        />

        {/* Horizontal cinematic light */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["-120%", "120%"],
                  opacity: [0, 0.6, 0],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
          className="absolute left-0 top-[36%] h-px w-[42%] bg-gradient-to-r from-transparent via-red-300/50 to-transparent"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["120%", "-120%"],
                  opacity: [0, 0.4, 0],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatDelay: 6,
            ease: "easeInOut",
          }}
          className="absolute right-0 top-[70%] h-px w-[35%] bg-gradient-to-r from-transparent via-red-300/40 to-transparent"
        />

        {/* Floating particles */}
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute h-1 w-1 rounded-full bg-red-200/50 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -24, 0],
                    x: [0, index % 2 === 0 ? 8 : -8, 0],
                    opacity: [0.15, 0.8, 0.15],
                    scale: [0.7, 1.5, 0.7],
                  }
            }
            transition={{
              duration: 4 + (index % 4),
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Glass orb */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -25, 0],
                  x: [0, 18, 0],
                  rotate: [0, 8, 0],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[5%] top-[30%] hidden h-24 w-24 rounded-full border border-white/[0.07] bg-white/[0.02] backdrop-blur-md sm:block"
        />

        {/* Second glass orb */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, 28, 0],
                  x: [0, -20, 0],
                  rotate: [0, -10, 0],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[5%] top-[20%] hidden h-28 w-28 rounded-full border border-red-200/[0.07] bg-red-500/[0.02] backdrop-blur-md sm:block"
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "radial-gradient(circle at center, black 10%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 10%, transparent 78%)",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.68)_100%)]" />
      </div>

      {/* =========================================================
          OPENING TRANSITION
      ========================================================== */}

      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{
          duration: 1.1,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "right" }}
        className="pointer-events-none fixed inset-0 z-50 bg-[#070707]"
      />

      {/* =========================================================
          NAVIGATION
      ========================================================== */}

      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.55,
          duration: 0.8,
        }}
        className="relative z-20 px-5 py-5 sm:px-8 md:px-12 md:py-7"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: -8,
                      scale: 1.05,
                    }
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] backdrop-blur-xl"
            >
              <Feather
                size={15}
                strokeWidth={1.2}
                className="text-red-300"
              />
            </motion.div>

            <span className="text-xs tracking-[0.3em] text-zinc-400">
              ATY<span className="text-red-400">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-[9px] uppercase tracking-[0.35em] text-zinc-600 sm:block">
              Create something unspoken
            </span>

            <div className="flex h-9 items-center rounded-full border border-white/[0.08] bg-white/[0.025] px-3 backdrop-blur-xl">
              <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-500">
                {String(step).padStart(2, "0")}
                <span className="mx-1.5 text-zinc-700">/</span>
                04
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* =========================================================
          PROGRESS
      ========================================================== */}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.7,
          duration: 0.7,
        }}
        className="relative z-20 mx-auto max-w-6xl px-5 sm:px-8 md:px-12"
      >
        <div className="flex items-center gap-2">
          {stepLabels.map((label, index) => {
            const item = index + 1;
            const active = item <= step;

            return (
              <div
                key={label}
                className="flex flex-1 items-center gap-2"
              >
                <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    initial={false}
                    animate={{
                      width: active ? "100%" : "0%",
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                    className="absolute inset-y-0 left-0 rounded-full bg-red-400"
                  />
                </div>

                <span
                  className={`hidden text-[8px] uppercase tracking-[0.25em] transition-colors duration-500 sm:block ${
                    active ? "text-red-300/80" : "text-zinc-700"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-150px)] max-w-5xl items-center px-5 py-12 sm:px-8 md:px-12">
        <AnimatePresence mode="wait">
          {/* =====================================================
              STEP 1
          ====================================================== */}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -25,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full"
            >
              <div className="mx-auto max-w-4xl">
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-5 flex items-center justify-center gap-3"
                  >
                    <span className="h-px w-7 bg-red-400/50" />

                    <span className="text-[9px] uppercase tracking-[0.45em] text-red-300/70">
                      Chapter one
                    </span>

                    <span className="h-px w-7 bg-red-400/50" />
                  </motion.div>

                  <h1 className="text-4xl font-light tracking-[-0.04em] text-zinc-100 sm:text-5xl md:text-7xl">
                    Who is this for?
                  </h1>

                  <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
                    You don't have to tell us their name.
                    <br />
                    Just tell us who they are to you.
                  </p>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recipients.map((item, index) => {
                    const Icon = item.icon;
                    const selected = recipient === item.label;

                    return (
                      <motion.button
                        key={item.label}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: 0.2 + index * 0.07,
                          duration: 0.5,
                        }}
                        whileHover={
                          shouldReduceMotion
                            ? undefined
                            : {
                                y: -5,
                              }
                        }
                        whileTap={
                          shouldReduceMotion
                            ? undefined
                            : {
                                scale: 0.98,
                              }
                        }
                        onClick={() => setRecipient(item.label)}
                        className={`group relative overflow-hidden rounded-2xl border p-5 text-left backdrop-blur-xl transition-all duration-500 ${
                          selected
                            ? "border-red-400/45 bg-red-400/[0.08] shadow-[0_15px_60px_rgba(127,29,29,0.12)]"
                            : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.045]"
                        }`}
                      >
                        {selected && (
                          <motion.div
                            layoutId="recipientGlow"
                            className="absolute inset-0 bg-gradient-to-br from-red-500/[0.08] via-transparent to-transparent"
                          />
                        )}

                        <div className="relative">
                          <div className="mb-7 flex items-center justify-between">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-500 ${
                                selected
                                  ? "border-red-300/20 bg-red-400/10"
                                  : "border-white/[0.07] bg-white/[0.03]"
                              }`}
                            >
                              <Icon
                                size={17}
                                strokeWidth={1.2}
                                className={`transition-colors duration-500 ${
                                  selected
                                    ? "text-red-300"
                                    : "text-zinc-500 group-hover:text-zinc-300"
                                }`}
                              />
                            </div>

                            <motion.div
                              initial={false}
                              animate={{
                                scale: selected ? 1 : 0,
                                opacity: selected ? 1 : 0,
                              }}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-red-400/15 text-red-300"
                            >
                              <Check size={12} />
                            </motion.div>
                          </div>

                          <p
                            className={`text-sm transition-colors duration-300 ${
                              selected
                                ? "text-white"
                                : "text-zinc-300"
                            }`}
                          >
                            {item.label}
                          </p>

                          <p className="mt-1.5 text-xs leading-5 text-zinc-600">
                            {item.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              STEP 2
          ====================================================== */}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{
                opacity: 0,
                x: 45,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -45,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full"
            >
              <div className="mx-auto max-w-3xl">
                <div className="text-center">
                  <div className="mb-5 flex items-center justify-center gap-3">
                    <span className="h-px w-7 bg-red-400/50" />

                    <span className="text-[9px] uppercase tracking-[0.45em] text-red-300/70">
                      Chapter two
                    </span>

                    <span className="h-px w-7 bg-red-400/50" />
                  </div>

                  <h1 className="text-4xl font-light tracking-[-0.04em] sm:text-5xl md:text-7xl">
                    Say what you couldn't.
                  </h1>

                  <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
                    No one is watching.
                    <br />
                    Take your time.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.7,
                  }}
                  className="relative mt-9 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] shadow-[0_25px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
                >
                  {/* Writing glow */}
                  <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-red-500/[0.06] blur-3xl" />

                  <div className="relative p-5 sm:p-7 md:p-9">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />

                        <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                          Your message
                        </span>
                      </div>

                      <span className="text-[10px] tracking-[0.1em] text-zinc-700">
                        {message.length}/2000
                      </span>
                    </div>

                    <textarea
                      autoFocus
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Start writing..."
                      className="min-h-[280px] w-full resize-none bg-transparent text-base leading-8 text-zinc-200 outline-none placeholder:text-zinc-700 sm:min-h-[320px] sm:text-lg"
                      maxLength={2000}
                    />

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-700">
                        Let the words breathe.
                      </span>

                      <Feather
                        size={14}
                        strokeWidth={1}
                        className="text-zinc-700"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              STEP 3
          ====================================================== */}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{
                opacity: 0,
                x: 45,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -45,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full"
            >
              <div className="mx-auto max-w-4xl">
                <div className="text-center">
                  <div className="mb-5 flex items-center justify-center gap-3">
                    <span className="h-px w-7 bg-red-400/50" />

                    <span className="text-[9px] uppercase tracking-[0.45em] text-red-300/70">
                      Chapter three
                    </span>

                    <span className="h-px w-7 bg-red-400/50" />
                  </div>

                  <h1 className="text-4xl font-light tracking-[-0.04em] sm:text-5xl md:text-7xl">
                    How should it feel?
                  </h1>

                  <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
                    Every message carries a different weight.
                  </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {moods.map((item, index) => {
                    const selected = mood === item.name;

                    return (
                      <motion.button
                        key={item.name}
                        initial={{
                          opacity: 0,
                          y: 25,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: 0.15 + index * 0.08,
                          duration: 0.55,
                        }}
                        whileHover={
                          shouldReduceMotion
                            ? undefined
                            : {
                                y: -5,
                                scale: 1.01,
                              }
                        }
                        whileTap={
                          shouldReduceMotion
                            ? undefined
                            : {
                                scale: 0.985,
                              }
                        }
                        onClick={() => setMood(item.name)}
                        className={`group relative min-h-[190px] overflow-hidden rounded-3xl border text-left transition-all duration-500 ${
                          selected
                            ? "border-red-300/40 shadow-[0_20px_80px_rgba(127,29,29,0.15)]"
                            : "border-white/[0.07] hover:border-white/[0.14]"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${item.className}`}
                        />

                        <motion.div
                          animate={
                            shouldReduceMotion
                              ? undefined
                              : {
                                  x: ["-20%", "20%", "-20%"],
                                  y: ["-10%", "10%", "-10%"],
                                }
                          }
                          transition={{
                            duration: 8 + index,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`absolute -left-20 -top-20 h-56 w-56 rounded-full ${item.glow} blur-3xl`}
                        />

                        {selected && (
                          <motion.div
                            layoutId="moodBorder"
                            className="absolute inset-0 rounded-3xl border border-red-300/20"
                          />
                        )}

                        <div className="relative flex h-full min-h-[190px] flex-col justify-between p-6 sm:p-7">
                          <div className="flex items-center justify-between">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-500 ${
                                selected
                                  ? "border-red-300/20 bg-red-400/10"
                                  : "border-white/[0.07] bg-black/10"
                              }`}
                            >
                              <Sparkles
                                size={16}
                                strokeWidth={1.1}
                                className={
                                  selected
                                    ? "text-red-300"
                                    : "text-white/40"
                                }
                              />
                            </div>

                            <motion.div
                              initial={false}
                              animate={{
                                scale: selected ? 1 : 0.7,
                                opacity: selected ? 1 : 0,
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-red-400/15 text-red-300"
                            >
                              <Check size={13} />
                            </motion.div>
                          </div>

                          <div>
                            <h3 className="text-xl font-light text-zinc-100">
                              {item.name}
                            </h3>

                            <p className="mt-2 max-w-xs text-sm text-zinc-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              STEP 4
          ====================================================== */}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full"
            >
              <div className="mx-auto max-w-3xl text-center">
                {/* Lock emblem */}
                <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: [1, 1.25, 1],
                            opacity: [0.15, 0.4, 0.15],
                          }
                    }
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl"
                  />

                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            rotate: 360,
                          }
                    }
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border border-dashed border-red-300/10"
                  />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-red-300/20 bg-red-400/[0.06] backdrop-blur-xl">
                    <Lock
                      size={27}
                      strokeWidth={1}
                      className="text-red-300"
                    />
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-center gap-3">
                  <span className="h-px w-7 bg-red-400/50" />

                  <span className="text-[9px] uppercase tracking-[0.45em] text-red-300/70">
                    Final chapter
                  </span>

                  <span className="h-px w-7 bg-red-400/50" />
                </div>

                <h1 className="text-4xl font-light tracking-[-0.04em] sm:text-5xl md:text-7xl">
                  Ready to seal it?
                </h1>

                <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-zinc-500">
                  Once sealed, this message becomes a private experience
                  waiting for someone to discover.
                </p>

                {/* Preview */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.25,
                    duration: 0.7,
                  }}
                  className="mx-auto mt-9 max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] text-left shadow-[0_25px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
                >
                  <div className="border-b border-white/[0.06] px-5 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                        Private preview
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.7)]" />
                        <span className="text-[9px] text-zinc-600">
                          Encrypted
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-600">For</span>
                      <span className="text-zinc-300">
                        {recipient}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-600">Mood</span>
                      <span className="text-zinc-300">{mood}</span>
                    </div>

                    <div className="border-t border-white/[0.06] pt-4">
                      <p className="line-clamp-4 text-sm leading-7 text-zinc-500">
                        {message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* =========================================================
          CONTROLS
      ========================================================== */}

      <motion.footer
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.9,
          duration: 0.7,
        }}
        className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 pb-6 sm:px-8 md:px-12 md:pb-8"
      >
        {/* Back */}
        <button
          onClick={previousStep}
          disabled={step === 1}
          className={`group flex items-center gap-2 rounded-full px-3 py-2 text-xs transition-all duration-300 ${
            step === 1
              ? "pointer-events-none opacity-0"
              : "text-zinc-600 hover:bg-white/[0.035] hover:text-zinc-300"
          }`}
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back
        </button>

        {/* Step indicator mobile */}
        <div className="text-[8px] uppercase tracking-[0.3em] text-zinc-700 sm:hidden">
          {stepLabels[step - 1]}
        </div>

        {/* Continue / Seal */}
        {step < 4 ? (
          <motion.button
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 1.03,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.97,
                  }
            }
            onClick={nextStep}
            disabled={!canContinue}
            className="group relative overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.045] px-5 py-3 text-xs text-zinc-200 shadow-xl shadow-black/20 backdrop-blur-xl transition-all duration-500 hover:border-red-300/30 hover:bg-red-400/[0.08] disabled:cursor-not-allowed disabled:opacity-25"
          >
            <span className="relative flex items-center gap-2">
              Continue

              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 1.03,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.97,
                  }
            }
            onClick={sealMessage}
            disabled={isSealing}
            className="group relative overflow-hidden rounded-full border border-red-300/30 bg-red-400/[0.10] px-6 py-3 text-xs text-red-100 shadow-[0_10px_40px_rgba(127,29,29,0.15)] backdrop-blur-xl transition-all duration-500 hover:border-red-300/50 hover:bg-red-400/[0.16] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: ["-120%", "220%"],
                    }
              }
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              className="absolute inset-y-0 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.13] to-transparent"
            />

            <span className="relative flex items-center gap-2">
              {isSealing ? (
                <>
                  Sealing
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                </>
              ) : (
                <>
                  Seal message
                  <Lock size={14} strokeWidth={1.4} />
                </>
              )}
            </span>
          </motion.button>
        )}
      </motion.footer>
    </main>
  );
}