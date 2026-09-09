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

import { AnimatePresence, motion } from "framer-motion";

import {
  Eye,
  Heart,
  Inbox,
  Loader2,
  Lock,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Reply {
  id: string;
  content: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

interface OriginalMessage {
  id: string;
  recipientType: string;
  content: string;
  mood: string;
  opened: boolean;
  replyCount: number;
}

export default function InboxPage() {
  const params = useParams();

  const token = params.token as string;

  const [message, setMessage] =
    useState<OriginalMessage | null>(null);

  const [replies, setReplies] =
    useState<Reply[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

  const [selectedReply, setSelectedReply] =
    useState<Reply | null>(null);

  useEffect(() => {
    if (!token) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeReplies: (() => void) | undefined;

    // Find the message using the sender's private token
    const messageQuery = query(
      collection(db, "messages"),
      where("senderToken", "==", token),
      limit(1)
    );

    // Listen to the message in real time
    unsubscribeMessage = onSnapshot(
      messageQuery,
      (messageSnapshot) => {
        if (messageSnapshot.empty) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const messageDoc = messageSnapshot.docs[0];
        const messageData = messageDoc.data();

        // Update message state in real time
        setMessage({
          id: messageDoc.id,
          recipientType:
            messageData.recipientType ?? "",
          content:
            messageData.content ?? "",
          mood:
            messageData.mood ?? "",
          opened:
            messageData.opened ?? false,
          replyCount:
            messageData.replyCount ?? 0,
        });

        // Stop old reply listener before creating a new one
        if (unsubscribeReplies) {
          unsubscribeReplies();
        }

        // Create real-time listener for replies
        const repliesQuery = query(
          collection(
            db,
            "messages",
            messageDoc.id,
            "replies"
          ),
          orderBy("createdAt", "desc")
        );

        unsubscribeReplies = onSnapshot(
          repliesQuery,
          (repliesSnapshot) => {
            const fetchedReplies =
              repliesSnapshot.docs.map(
                (replyDoc) => ({
                  id: replyDoc.id,
                  content:
                    replyDoc.data().content ?? "",
                  createdAt:
                    replyDoc.data().createdAt,
                })
              );

            setReplies(fetchedReplies);
            setLoading(false);
          },
          (error) => {
            console.error(
              "Failed to listen for replies:",
              error
            );

            setLoading(false);
          }
        );
      },
      (error) => {
        console.error(
          "Failed to find inbox:",
          error
        );

        setNotFound(true);
        setLoading(false);
      }
    );

    // Cleanup Firestore listeners
    return () => {
      if (unsubscribeMessage) {
        unsubscribeMessage();
      }

      if (unsubscribeReplies) {
        unsubscribeReplies();
      }
    };
  }, [token]);

  // Loading screen
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={25}
            className="animate-spin text-red-300"
          />

          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600">
            Unlocking your inbox
          </p>
        </div>
      </main>
    );
  }

  // Invalid token / inbox not found
  if (notFound || !message) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <div>
          <Lock
            size={30}
            strokeWidth={1}
            className="mx-auto text-zinc-600"
          />

          <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-red-300/60">
            Private space
          </p>

          <h1 className="mt-4 text-4xl font-light">
            This inbox doesn&apos;t exist.
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">
            This private link may be invalid or no longer available.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-6 py-10 text-white md:px-12">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-red-950/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <Lock
                size={13}
                className="text-red-300/70"
              />

              <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">
                Private inbox
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-light md:text-5xl">
              Your words came back.
            </h1>
          </div>

          <Inbox
            size={26}
            strokeWidth={1}
            className="text-zinc-700"
          />
        </motion.header>

        {/* Original message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 rounded-2xl border border-white/10 bg-white/[0.025] p-6"
        >
          <div className="flex items-center justify-between">

            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
              Your original message
            </p>

            {message.opened ? (
              <div className="flex items-center gap-2 text-xs text-green-400/70">
                <Eye size={14} />
                Opened
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <Lock size={13} />
                Unopened
              </div>
            )}

          </div>

          <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-zinc-400">
            {message.content}
          </p>
        </motion.div>

        {/* Replies section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="flex items-end justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-red-300/60">
                Anonymous responses
              </p>

              <h2 className="mt-3 text-2xl font-light">
                {replies.length === 0
                  ? "Nothing yet."
                  : `${replies.length} ${
                      replies.length === 1
                        ? "reply"
                        : "replies"
                    }`}
              </h2>
            </div>

            {replies.length > 0 && (
              <MessageCircle
                size={22}
                strokeWidth={1}
                className="text-red-300/50"
              />
            )}

          </div>

          {/* Empty replies */}
          {replies.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 rounded-2xl border border-dashed border-white/10 p-10 text-center"
            >
              <Sparkles
                size={22}
                strokeWidth={1}
                className="mx-auto text-zinc-700"
              />

              <p className="mt-5 text-sm text-zinc-500">
                The silence is still waiting.
              </p>

              <p className="mt-2 text-xs text-zinc-700">
                When they reply, it will appear here.
              </p>
            </motion.div>
          )}

          {/* Replies list */}
          <div className="mt-7 space-y-3">

            {replies.map((reply, index) => (
              <motion.button
                key={reply.id}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                onClick={() =>
                  setSelectedReply(reply)
                }
                className="group w-full rounded-xl border border-white/10 bg-white/[0.02] p-5 text-left transition hover:border-red-400/25 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">

                  <span className="text-xs text-zinc-500">
                    Anonymous reply
                  </span>

                  <Heart
                    size={14}
                    strokeWidth={1}
                    className="text-zinc-700 transition group-hover:text-red-300/60"
                  />

                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                  {reply.content}
                </p>

              </motion.button>
            ))}

          </div>
        </motion.div>

        {/* Footer */}
        <p className="mt-16 pb-6 text-center text-[10px] uppercase tracking-[0.35em] text-zinc-700">
          anonymous, to you.
        </p>

      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {selectedReply && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSelectedReply(null)
            }
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0a0a0a] p-7 md:p-10"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-red-300/60">
                Anonymous reply
              </p>

              <div className="my-7 h-px bg-white/10" />

              <p className="whitespace-pre-wrap text-base font-light leading-[1.9] text-zinc-300">
                {selectedReply.content}
              </p>

              <button
                onClick={() =>
                  setSelectedReply(null)
                }
                className="mt-10 text-xs text-zinc-600 transition hover:text-zinc-300"
              >
                Close
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}