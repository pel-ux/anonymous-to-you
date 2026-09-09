"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Loader2,
  Lock,
  Mail,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { db } from "@/lib/firebase";

interface Message {
  id: string;
  recipientType: string;
  content: string;
  mood: string;
  opened: boolean;
}

const moodStyles = {
  Love: {
    glow: "bg-rose-600/20",
    accent: "text-rose-300",
    border: "border-rose-400/20",
    button: "bg-rose-400/10 hover:bg-rose-400/20",
  },
  Warm: {
    glow: "bg-orange-500/20",
    accent: "text-orange-300",
    border: "border-orange-400/20",
    button: "bg-orange-400/10 hover:bg-orange-400/20",
  },
  Melancholy: {
    glow: "bg-indigo-600/20",
    accent: "text-indigo-300",
    border: "border-indigo-400/20",
    button: "bg-indigo-400/10 hover:bg-indigo-400/20",
  },
  Mystery: {
    glow: "bg-purple-600/20",
    accent: "text-purple-300",
    border: "border-purple-400/20",
    button: "bg-purple-400/10 hover:bg-purple-400/20",
  },
};

export default function MessagePage() {
  const params = useParams();
  const id = params.id as string;

  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [stage, setStage] = useState<"sealed" | "opening" | "message">(
    "sealed"
  );

  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMessage = async () => {
      try {
        const messageRef = doc(db, "messages", id);
        const snapshot = await getDoc(messageRef);

        if (!snapshot.exists()) {
          setNotFound(true);
          return;
        }

        const data = snapshot.data();

        setMessage({
          id: snapshot.id,
          recipientType: data.recipientType ?? "",
          content: data.content ?? "",
          mood: data.mood ?? "Mystery",
          opened: data.opened ?? false,
        });

        setStage("sealed");
      } catch (error) {
        console.error("Failed to fetch message:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  const openMessage = async () => {
    if (!id) return;

    setStage("opening");

    try {
      await updateDoc(doc(db, "messages", id), {
        opened: true,
        openedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to update message:", error);
    }

    setTimeout(() => {
      setStage("message");
    }, 1300);
  };

  const sendReply = async () => {
    if (!reply.trim() || !id) return;

    try {
      setSendingReply(true);

      await addDoc(collection(db, "messages", id, "replies"), {
        content: reply.trim(),
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "messages", id), {
        replyCount: increment(1),
      });

      setReply("");
      setReplySent(true);
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] text-white">
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
            <Sparkles size={18} className="text-zinc-500" />
          </motion.div>

          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600">
            Finding something for you
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !message) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-center text-white">
        <div className="absolute h-[500px] w-[500px] rounded-full bg-red-950/10 blur-[150px]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10">
            <Lock size={22} className="text-zinc-600" />
          </div>

          <p className="mt-10 text-[10px] uppercase tracking-[0.5em] text-zinc-600">
            Nothing here
          </p>

          <h1 className="mt-5 text-4xl font-light">
            This message disappeared.
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-zinc-600">
            Maybe the link is broken.
            <br />
            Or maybe it was never meant to be found.
          </p>
        </motion.div>
      </main>
    );
  }

  const currentMood =
    moodStyles[message.mood as keyof typeof moodStyles] ||
    moodStyles.Mystery;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5 py-8 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] ${currentMood.glow}`}
        />

        {/* Floating particles */}
        {Array.from({ length: 16 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 4 + (index % 4),
              repeat: Infinity,
              delay: index * 0.3,
            }}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${(index * 17) % 100}%`,
              top: `${(index * 29) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute left-1/2 top-8 z-20 -translate-x-1/2"
      >
        <p className="whitespace-nowrap text-[9px] uppercase tracking-[0.55em] text-zinc-700">
          anonymous, to you.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ================= SEALED MESSAGE ================= */}

        {stage === "sealed" && (
          <motion.div
            key="sealed"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.08,
              filter: "blur(12px)",
            }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex max-w-xl flex-col items-center text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-[10px] uppercase tracking-[0.55em] ${currentMood.accent}`}
            >
              Something found you
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-7 text-5xl font-extralight leading-[1.05] tracking-tight md:text-7xl"
            >
              Someone has
              <br />
              something to say.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-7 max-w-sm text-sm leading-relaxed text-zinc-600"
            >
              No name.
              <br />
              No explanation.
              <br />
              Just words waiting for you.
            </motion.p>

            {/* Envelope */}
            <motion.button
              onClick={openMessage}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative mt-14 flex h-40 w-56 items-center justify-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [-1, 1, -1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`relative flex h-32 w-52 items-center justify-center rounded-lg border ${currentMood.border} bg-white/[0.03] shadow-2xl`}
              >
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="absolute left-0 top-0 h-px w-full bg-white/10" />
                </div>

                <Mail
                  size={42}
                  strokeWidth={0.8}
                  className={`transition duration-500 group-hover:scale-110 ${currentMood.accent}`}
                />

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#090909]"
                >
                  <Lock size={13} className={currentMood.accent} />
                </motion.div>
              </motion.div>

              <div
                className={`absolute inset-10 -z-10 rounded-full blur-3xl ${currentMood.glow}`}
              />
            </motion.button>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={openMessage}
              className={`mt-8 rounded-full border ${currentMood.border} ${currentMood.button} px-8 py-3 text-xs uppercase tracking-[0.25em] transition`}
            >
              Open message
            </motion.button>

            <p className="mt-6 text-[10px] tracking-wide text-zinc-700">
              Tap when you&apos;re ready.
            </p>
          </motion.div>
        )}

        {/* ================= OPENING ANIMATION ================= */}

        {stage === "opening" && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: [1, 1.15, 2.5],
                rotate: [0, 3, -3, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.45, 1],
              }}
              className={`flex h-40 w-60 items-center justify-center rounded-xl border ${currentMood.border} bg-white/[0.04]`}
            >
              <Mail
                size={55}
                strokeWidth={0.7}
                className={currentMood.accent}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 3],
              }}
              transition={{ duration: 1.3 }}
              className={`absolute h-64 w-64 rounded-full blur-[80px] ${currentMood.glow}`}
            />
          </motion.div>
        )}

        {/* ================= MESSAGE ================= */}

        {stage === "message" && (
          <motion.div
            key="message"
            initial={{
              opacity: 0,
              y: 40,
              filter: "blur(12px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="relative z-10 w-full max-w-2xl"
          >
            <div
              className={`relative overflow-hidden rounded-3xl border ${currentMood.border} bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl md:p-12`}
            >
              <div
                className={`absolute left-1/2 top-0 h-32 w-1/2 -translate-x-1/2 blur-[80px] ${currentMood.glow}`}
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.45em] text-zinc-600">
                      An anonymous message
                    </p>

                    <p
                      className={`mt-3 text-xs uppercase tracking-[0.25em] ${currentMood.accent}`}
                    >
                      For {message.recipientType}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border ${currentMood.border}`}
                  >
                    <Heart
                      size={17}
                      strokeWidth={0.8}
                      className={currentMood.accent}
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="my-10 h-px origin-left bg-white/10"
                />

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.6,
                    duration: 1,
                  }}
                  className="whitespace-pre-wrap text-lg font-light leading-[2] text-zinc-200 md:text-xl"
                >
                  {message.content}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-12"
                >
                  <div className="h-px bg-white/10" />

                  {!replying ? (
                    <button
                      onClick={() => setReplying(true)}
                      className="group mt-7 flex items-center gap-3 text-sm text-zinc-500 transition hover:text-white"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border ${currentMood.border}`}
                      >
                        <Send
                          size={14}
                          strokeWidth={1}
                          className={currentMood.accent}
                        />
                      </div>

                      <span>Leave something back</span>
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8"
                    >
                      {replySent ? (
                        <div className="py-8 text-center">
                          <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border ${currentMood.border}`}
                          >
                            <Sparkles
                              size={20}
                              className={currentMood.accent}
                            />
                          </motion.div>

                          <h3 className="mt-5 text-xl font-light">
                            Your words are on their way.
                          </h3>

                          <p className="mt-3 text-sm text-zinc-600">
                            Still anonymous. Still yours.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">
                              Write back anonymously
                            </p>

                            <button
                              onClick={() => setReplying(false)}
                              className="text-zinc-700 transition hover:text-zinc-300"
                            >
                              <X size={17} />
                            </button>
                          </div>

                          <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Maybe there is something you want to say too..."
                            rows={6}
                            className={`mt-5 w-full resize-none rounded-2xl border ${currentMood.border} bg-black/20 p-5 text-sm leading-relaxed text-zinc-300 outline-none placeholder:text-zinc-700`}
                          />

                          <button
                            disabled={sendingReply || !reply.trim()}
                            onClick={sendReply}
                            className={`mt-4 flex items-center gap-3 rounded-xl border ${currentMood.border} ${currentMood.button} px-6 py-3 text-xs transition disabled:cursor-not-allowed disabled:opacity-40`}
                          >
                            {sendingReply ? (
                              <>
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                                Sending...
                              </>
                            ) : (
                              <>
                                Send anonymously
                                <Send size={14} />
                              </>
                            )}
                          </button>
                        </> 
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-7 text-center text-[10px] uppercase tracking-[0.4em] text-zinc-700"
            >
              Some words don&apos;t need a name.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}