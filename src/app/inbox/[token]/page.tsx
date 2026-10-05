"use client";

import { db } from "@/lib/firebase";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  ArrowDown,
  ArrowLeft,
  Eye,
  Heart,
  Lock,
  MessageCircle,
  Moon,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Reply {
  id: string;
  content: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

interface InboxMessage {
  id: string;
  recipientType: string;
  recipientName?: string;
  content: string;
  mood: string;
  opened: boolean;
  replyCount: number;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  messageType?: string;
}

const moodConfig: Record<
  string,
  {
    label: string;
    description: string;
    icon: typeof Heart;
    accent: string;
  }
> = {
  Midnight: {
    label: "Midnight",
    description: "Quiet. Deep. Unspoken.",
    icon: Moon,
    accent: "text-indigo-300",
  },

  Warm: {
    label: "Warm",
    description: "Soft words from the heart.",
    icon: Heart,
    accent: "text-orange-300",
  },

  Love: {
    label: "Love",
    description: "For feelings that stayed too long.",
    icon: Heart,
    accent: "text-red-300",
  },

  Melancholy: {
    label: "Melancholy",
    description: "Some memories never leave.",
    icon: Moon,
    accent: "text-purple-300",
  },

  Mystery: {
    label: "Mystery",
    description: "Something was left unsaid.",
    icon: Sparkles,
    accent: "text-red-300",
  },
};

function getMoodConfig(mood: string) {
  return (
    moodConfig[mood] ?? {
      label: mood || "Unspoken",
      description: "Something was left unsaid.",
      icon: Sparkles,
      accent: "text-red-300",
    }
  );
}

function formatDate(timestamp?: {
  seconds: number;
  nanoseconds: number;
}) {
  if (!timestamp?.seconds) return "Recently";

  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();

  const diff = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";

  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}m ago`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}h ago`;
  }

  if (diff < 7 * day) {
    const days = Math.floor(diff / day);
    return `${days}d ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

export default function InboxPage() {
  const params = useParams();
  const router = useRouter();

  const shouldReduceMotion = useReducedMotion();

  const token = params.senderToken as string;

  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedMessage, setSelectedMessage] =
    useState<InboxMessage | null>(null);

  const [selectedReply, setSelectedReply] =
    useState<Reply | null>(null);

  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    if (!token) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let unsubscribeSender: (() => void) | undefined;
    let unsubscribeInbox: (() => void) | undefined;

    /*
     * ------------------------------------------------------------
     * OLD MESSAGE SYSTEM
     *
     * Messages created through /create use:
     *
     * senderToken: token
     *
     * This keeps the original ATY flow working.
     * ------------------------------------------------------------
     */

    const senderQuery = query(
      collection(db, "messages"),
      where("senderToken", "==", token),
      limit(20)
    );

    /*
     * ------------------------------------------------------------
     * NEW ANONYMOUS INBOX SYSTEM
     *
     * Messages sent through /u/[username] use:
     *
     * inboxToken: token
     *
     * This allows one permanent inbox link to receive
     * multiple anonymous messages.
     * ------------------------------------------------------------
     */

    const inboxQuery = query(
      collection(db, "messages"),
      where("inboxToken", "==", token),
      limit(100)
    );

    const mergeMessages = (
      senderDocs: InboxMessage[],
      inboxDocs: InboxMessage[]
    ) => {
      const combined = [
        ...senderDocs,
        ...inboxDocs,
      ];

      const unique = Array.from(
        new Map(
          combined.map((message) => [
            message.id,
            message,
          ])
        ).values()
      );

      unique.sort((a, b) => {
        const aTime = a.createdAt?.seconds ?? 0;
        const bTime = b.createdAt?.seconds ?? 0;

        return bTime - aTime;
      });

      setMessages(unique);
      setLoading(false);
      setNotFound(unique.length === 0);
    };

    let senderMessages: InboxMessage[] = [];
    let inboxMessages: InboxMessage[] = [];

    const convertDocs = (docs: any[]) => {
      return docs.map((messageDoc) => {
        const data = messageDoc.data();

        return {
          id: messageDoc.id,

          recipientType:
            data.recipientType ?? "",

          recipientName:
            data.recipientName ?? "",

          content:
            data.content ?? "",

          mood:
            data.mood ?? "",

          opened:
            data.opened ?? false,

          replyCount:
            data.replyCount ?? 0,

          createdAt:
            data.createdAt,

          messageType:
            data.messageType ?? "direct",
        };
      });
    };

    unsubscribeSender = onSnapshot(
      senderQuery,
      (snapshot) => {
        senderMessages = convertDocs(
          snapshot.docs
        );

        mergeMessages(
          senderMessages,
          inboxMessages
        );
      },
      (error) => {
        console.error(
          "Failed to listen for sender messages:",
          error
        );

        mergeMessages(
          [],
          inboxMessages
        );
      }
    );

    unsubscribeInbox = onSnapshot(
      inboxQuery,
      (snapshot) => {
        inboxMessages = convertDocs(
          snapshot.docs
        );

        mergeMessages(
          senderMessages,
          inboxMessages
        );
      },
      (error) => {
        console.error(
          "Failed to listen for inbox messages:",
          error
        );

        mergeMessages(
          senderMessages,
          []
        );
      }
    );

    return () => {
      if (unsubscribeSender) {
        unsubscribeSender();
      }

      if (unsubscribeInbox) {
        unsubscribeInbox();
      }
    };
  }, [token]);

  /*
   * ------------------------------------------------------------
   * LISTEN FOR REPLIES FOR ALL MESSAGES
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (messages.length === 0) return;

    const unsubscribers: (() => void)[] = [];

    messages.forEach((message) => {
      const repliesQuery = query(
        collection(
          db,
          "messages",
          message.id,
          "replies"
        ),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        repliesQuery,
        (snapshot) => {
          const fetchedReplies =
            snapshot.docs.map((replyDoc) => ({
              id: replyDoc.id,

              content:
                replyDoc.data().content ?? "",

              createdAt:
                replyDoc.data().createdAt,
            }));

          setReplies((current) => ({
            ...current,
            [message.id]: fetchedReplies,
          }));
        },
        (error) => {
          console.error(
            `Failed to listen for replies for ${message.id}:`,
            error
          );
        }
      );

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsubscribe) =>
        unsubscribe()
      );
    };
  }, [messages]);

  /*
   * ------------------------------------------------------------
   * DERIVED DATA
   * ------------------------------------------------------------
   */

  const totalReplies = Object.values(
    replies
  ).reduce(
    (total, messageReplies) =>
      total + messageReplies.length,
    0
  );

  const unreadCount = messages.filter(
    (message) => !message.opened
  ).length;

  const totalCount =
    messages.length + totalReplies;

  const selectedMood = useMemo(
    () =>
      getMoodConfig(
        selectedMessage?.mood ?? ""
      ),
    [selectedMessage?.mood]
  );

  const SelectedMoodIcon = selectedMood.icon;

  /*
   * ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------
   */

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] text-white">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.35, 0.2],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-900/20 blur-[120px]"
          />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      rotate: 360,
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-[-5px] rounded-full border border-transparent border-t-red-400/70"
            />

            <Lock
              size={18}
              strokeWidth={1}
              className="text-red-300/80"
            />
          </div>

          <p className="mt-7 text-[10px] uppercase tracking-[0.45em] text-zinc-600">
            Unlocking your private space
          </p>
        </motion.div>
      </main>
    );
  }

  /*
   * ------------------------------------------------------------
   * EMPTY / INVALID INBOX
   * ------------------------------------------------------------
   */

  if (notFound && messages.length === 0) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-center text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-950/15 blur-[130px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <Lock
              size={27}
              strokeWidth={1}
              className="text-zinc-600"
            />
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[0.45em] text-red-300/60">
            Private space
          </p>

          <h1 className="mt-4 text-4xl font-light tracking-tight md:text-5xl">
            This inbox doesn't exist.
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">
            This private link may be invalid,
            expired, or no longer available.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <ArrowLeft size={14} />
            Back home
          </button>
        </motion.div>
      </main>
    );
  }

  /*
   * ------------------------------------------------------------
   * MAIN INBOX
   * ------------------------------------------------------------
   */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}

      <div className="pointer-events-none fixed inset-0">
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: ["-10%", "8%", "-10%"],
                  y: ["-5%", "5%", "-5%"],
                  scale: [1, 1.12, 1],
                }
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-[-180px] h-[650px] w-[750px] -translate-x-1/2 rounded-full bg-red-950/20 blur-[150px]"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: ["20%", "-10%", "20%"],
                  opacity: [0.1, 0.22, 0.1],
                }
          }
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-220px] right-[-150px] h-[550px] w-[550px] rounded-full bg-red-900/10 blur-[150px]"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: ["-20%", "120%"],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-[-40%] top-[28%] h-px w-[45%] bg-gradient-to-r from-transparent via-red-400/30 to-transparent"
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-7 sm:px-8 md:px-12 md:py-10">
        {/* NAV */}

        <motion.header
          initial={
            shouldReduceMotion
              ? {}
              : {
                  opacity: 0,
                  y: -15,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex items-center justify-between"
        >
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] transition group-hover:border-red-300/30">
              <Heart
                size={15}
                strokeWidth={1.2}
                className="text-red-300/70 transition group-hover:text-red-300"
              />

              <span className="absolute inset-[-4px] rounded-full border border-red-400/0 transition group-hover:border-red-400/20" />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">
                anonymous
              </p>

              <p className="mt-0.5 text-xs text-zinc-300">
                to you.
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full ${
                  unreadCount
                    ? "animate-ping bg-red-400/70"
                    : "bg-zinc-600"
                }`}
              />

              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  unreadCount
                    ? "bg-red-300"
                    : "bg-zinc-600"
                }`}
              />
            </span>

            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">
              {unreadCount
                ? `${unreadCount} new`
                : "Private inbox"}
            </span>
          </div>
        </motion.header>

        {/* HERO */}

        <motion.section
          initial={
            shouldReduceMotion
              ? {}
              : {
                  opacity: 0,
                  y: 25,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.7,
          }}
          className="relative mt-16 md:mt-24"
        >
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-red-400/50" />

              <p className="text-[9px] uppercase tracking-[0.45em] text-red-300/60">
                Your anonymous inbox
              </p>
            </div>

            <h1 className="mt-6 text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
              Someone had
              <br />

              <span className="text-zinc-500">
                something to say.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-zinc-500 md:text-base">
              Anonymous words sent directly to you.
              No names. No profiles. Just whatever
              someone couldn't say out loud.
            </p>
          </div>

          {/* Stats */}

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl sm:p-5">
              <p className="text-2xl font-light text-white">
                {totalCount}
              </p>

              <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-zinc-600 sm:text-[9px]">
                Messages
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl sm:p-5">
              <p className="text-2xl font-light text-red-300">
                {unreadCount}
              </p>

              <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-zinc-600 sm:text-[9px]">
                New
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl sm:p-5">
              <p className="text-2xl font-light text-white">
                {totalReplies}
              </p>

              <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-zinc-600 sm:text-[9px]">
                Replies
              </p>
            </div>
          </div>
        </motion.section>

        {/* MESSAGES */}

        <motion.section
          initial={
            shouldReduceMotion
              ? {}
              : {
                  opacity: 0,
                  y: 30,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.7,
          }}
          className="mt-12 md:mt-16"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-red-400/40" />

                <p className="text-[9px] uppercase tracking-[0.4em] text-red-300/60">
                  Your messages
                </p>
              </div>

              <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
                Anonymous words
              </h2>

              <p className="mt-3 text-sm text-zinc-600">
                Everything sent to your private link
                appears here.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">
              <Inbox
                size={17}
                strokeWidth={1.1}
                className={
                  messages.length
                    ? "text-red-300/70"
                    : "text-zinc-700"
                }
              />
            </div>
          </div>

          {/* Empty state */}

          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative mt-8 overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-10 text-center sm:p-16"
            >
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [0, -8, 0],
                        rotate: [0, 3, 0],
                      }
                }
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
              >
                <Sparkles
                  size={21}
                  strokeWidth={1}
                  className="text-zinc-600"
                />
              </motion.div>

              <h3 className="mt-7 text-lg font-light text-zinc-300">
                Your inbox is quiet.
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-600">
                Share your anonymous inbox link
                and let people leave you something
                they wouldn't normally say.
              </p>

              <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2">
                <Users
                  size={12}
                  className="text-zinc-600"
                />

                <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                  Waiting in the shadows
                </span>
              </div>
            </motion.div>
          )}

          {/* Message cards */}

          {messages.length > 0 && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {messages.map((item, index) => {
                const itemMood =
                  getMoodConfig(item.mood);

                const ItemMoodIcon =
                  itemMood.icon;

                const itemReplies =
                  replies[item.id] ?? [];

                return (
                  <motion.button
                    key={item.id}
                    initial={
                      shouldReduceMotion
                        ? {}
                        : {
                            opacity: 0,
                            y: 20,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: shouldReduceMotion
                        ? 0
                        : 0.07 * index,
                    }}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: -4,
                          }
                    }
                    whileTap={
                      shouldReduceMotion
                        ? {}
                        : {
                            scale: 0.99,
                          }
                    }
                    onClick={() => {
                      setSelectedMessage(item);
                      setShowOriginal(false);
                    }}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 text-left transition hover:border-red-400/20 hover:bg-white/[0.04] sm:p-7"
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/0 blur-[70px] transition group-hover:bg-red-500/10" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-300/10 bg-red-400/[0.04]">
                          <Lock
                            size={14}
                            strokeWidth={1.2}
                            className="text-red-300/70"
                          />
                        </div>

                        <div>
                          <p className="text-[10px] text-zinc-400">
                            Anonymous message
                          </p>

                          <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-zinc-700">
                            {formatDate(
                              item.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 ${
                          item.opened
                            ? "border-green-400/10 bg-green-400/[0.03] text-green-300/70"
                            : "border-red-400/20 bg-red-400/[0.04] text-red-300"
                        }`}
                      >
                        {item.opened ? (
                          <Eye size={11} />
                        ) : (
                          <Sparkles size={11} />
                        )}

                        <span className="text-[8px] uppercase tracking-[0.2em]">
                          {item.opened
                            ? "Opened"
                            : "New"}
                        </span>
                      </div>
                    </div>

                    <div className="relative mt-6 flex items-center gap-2">
                      <div
                        className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 ${itemMood.accent}`}
                      >
                        <ItemMoodIcon
                          size={11}
                          strokeWidth={1.2}
                        />

                        <span className="text-[8px] uppercase tracking-[0.25em]">
                          {itemMood.label}
                        </span>
                      </div>

                      {itemReplies.length > 0 && (
                        <div className="flex items-center gap-1.5 text-zinc-600">
                          <MessageCircle
                            size={11}
                          />

                          <span className="text-[8px] uppercase tracking-[0.2em]">
                            {itemReplies.length}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="relative mt-6 line-clamp-4 text-sm leading-7 text-zinc-400 transition group-hover:text-zinc-300">
                      {item.content}
                    </p>

                    <div className="relative mt-6 flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-zinc-700 transition group-hover:text-red-300/60">
                      Open message

                      <ArrowDown
                        size={10}
                        className="-rotate-90"
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* SHARE CARD */}

        <motion.section
          initial={
            shouldReduceMotion
              ? {}
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="mt-14 md:mt-20"
        >
          <div className="relative overflow-hidden rounded-3xl border border-red-400/10 bg-gradient-to-br from-red-500/[0.06] via-white/[0.02] to-transparent p-7 sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-500/10 blur-[100px]" />

            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={13}
                    className="text-red-300/70"
                  />

                  <span className="text-[9px] uppercase tracking-[0.35em] text-red-300/60">
                    Keep the story going
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-light">
                  Want more anonymous words?
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
                  Create your own anonymous message
                  or share your inbox with people you
                  trust.
                </p>
              </div>

              <button
                onClick={() =>
                  router.push("/create")
                }
                className="group flex w-full items-center justify-center gap-3 rounded-full border border-red-300/20 bg-red-400/[0.08] px-6 py-3.5 text-xs text-red-100 transition hover:border-red-300/40 hover:bg-red-400/[0.14] md:w-auto"
              >
                Create an ATY

                <ArrowDown
                  size={13}
                  className="-rotate-90 transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* FOOTER */}

        <footer className="pb-8 pt-16 text-center">
          <div className="mx-auto mb-5 h-px w-12 bg-white/10" />

          <p className="text-[9px] uppercase tracking-[0.45em] text-zinc-700">
            anonymous, to you.
          </p>

          <p className="mt-2 text-[9px] text-zinc-800">
            Some things are easier left anonymous.
          </p>
        </footer>
      </div>

      {/* =========================================================
          MESSAGE MODAL
      ========================================================= */}

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSelectedMessage(null)
            }
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-5 py-8 backdrop-blur-xl"
          >
            <motion.div
              initial={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 0,
                      scale: 0.94,
                      y: 25,
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 0,
                      scale: 0.94,
                      y: 25,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#090909] shadow-2xl shadow-black/50"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-500/10 blur-[100px]" />

              <div className="relative p-7 sm:p-9 md:p-11">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-red-300/10 bg-red-400/[0.04]">
                        <Lock
                          size={13}
                          className="text-red-300/70"
                        />
                      </div>

                      <p className="text-[9px] uppercase tracking-[0.4em] text-red-300/60">
                        Anonymous message
                      </p>
                    </div>

                    <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-zinc-700">
                      {formatDate(
                        selectedMessage.createdAt
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedMessage(null)
                    }
                    aria-label="Close message"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-600 transition hover:border-white/20 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="mt-7 flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 ${selectedMood.accent}`}
                  >
                    <SelectedMoodIcon
                      size={12}
                      strokeWidth={1.2}
                    />

                    <span className="text-[9px] uppercase tracking-[0.25em]">
                      {selectedMood.label}
                    </span>
                  </div>

                  <span className="text-[10px] text-zinc-700">
                    •
                  </span>

                  <span className="text-[9px] text-zinc-600">
                    {selectedMood.description}
                  </span>
                </div>

                <div className="my-8 h-px bg-white/10" />

                <AnimatePresence mode="wait">
                  {showOriginal ? (
                    <motion.p
                      key="full"
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      className="whitespace-pre-wrap text-base font-light leading-[2] text-zinc-300 sm:text-lg"
                    >
                      {selectedMessage.content}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="preview"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="line-clamp-6 text-base font-light leading-[2] text-zinc-400 sm:text-lg"
                    >
                      {selectedMessage.content}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  onClick={() =>
                    setShowOriginal(
                      (current) => !current
                    )
                  }
                  className="mt-7 flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-zinc-600 transition hover:text-red-300"
                >
                  {showOriginal
                    ? "Hide message"
                    : "Read full message"}

                  <ArrowDown
                    size={12}
                    className={
                      showOriginal
                        ? "rotate-180 transition"
                        : "transition"
                    }
                  />
                </button>

                {/* Replies */}

                {(
                  replies[selectedMessage.id] ?? []
                ).length > 0 && (
                  <div className="mt-10 border-t border-white/10 pt-8">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-6 bg-red-400/40" />

                      <p className="text-[9px] uppercase tracking-[0.4em] text-red-300/60">
                        The other side
                      </p>
                    </div>

                    <h3 className="mt-4 text-xl font-light">
                      Anonymous responses
                    </h3>

                    <div className="mt-5 space-y-3">
                      {(
                        replies[
                          selectedMessage.id
                        ] ?? []
                      ).map((reply) => (
                        <button
                          key={reply.id}
                          onClick={() => {
                            setSelectedReply(
                              reply
                            );
                            setSelectedMessage(
                              null
                            );
                          }}
                          className="group w-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left transition hover:border-red-400/20 hover:bg-white/[0.04]"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageCircle
                                size={12}
                                className="text-zinc-600 transition group-hover:text-red-300/70"
                              />

                              <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                Anonymous reply
                              </span>
                            </div>

                            <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-700">
                              {formatDate(
                                reply.createdAt
                              )}
                            </span>
                          </div>

                          <p className="mt-4 line-clamp-3 text-sm leading-7 text-zinc-400 group-hover:text-zinc-300">
                            {reply.content}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-9 flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex items-center gap-2">
                    <Lock
                      size={11}
                      className="text-zinc-700"
                    />

                    <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-700">
                      Identity protected
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedMessage(null)
                    }
                    className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 transition hover:text-red-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          REPLY MODAL
      ========================================================= */}

      <AnimatePresence>
        {selectedReply && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSelectedReply(null)
            }
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 px-5 py-8 backdrop-blur-xl"
          >
            <motion.div
              initial={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 0,
                      scale: 0.94,
                      y: 25,
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 0,
                      scale: 0.94,
                      y: 25,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#090909] shadow-2xl shadow-black/50"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-500/10 blur-[100px]" />

              <div className="relative p-7 sm:p-9 md:p-11">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-red-300/10 bg-red-400/[0.04]">
                        <MessageCircle
                          size={13}
                          className="text-red-300/70"
                        />
                      </div>

                      <p className="text-[9px] uppercase tracking-[0.4em] text-red-300/60">
                        Anonymous reply
                      </p>
                    </div>

                    <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-zinc-700">
                      {formatDate(
                        selectedReply.createdAt
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedReply(null)
                    }
                    aria-label="Close reply"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-600 transition hover:border-white/20 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="my-8 h-px bg-white/10" />

                <p className="whitespace-pre-wrap text-base font-light leading-[2] text-zinc-300 sm:text-lg">
                  {selectedReply.content}
                </p>

                <div className="mt-9 flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex items-center gap-2">
                    <Lock
                      size={11}
                      className="text-zinc-700"
                    />

                    <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-700">
                      Identity protected
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedReply(null)
                    }
                    className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 transition hover:text-red-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}