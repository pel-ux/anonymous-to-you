"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Lock,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-[35%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-950/20 blur-[160px]"
        />

        <div className="absolute left-[10%] top-[20%] h-1 w-1 rounded-full bg-white/30" />
        <div className="absolute left-[80%] top-[30%] h-1 w-1 rounded-full bg-white/20" />
        <div className="absolute left-[25%] top-[70%] h-1 w-1 rounded-full bg-white/20" />
        <div className="absolute left-[75%] top-[75%] h-1 w-1 rounded-full bg-white/20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-7 md:px-12">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 transition hover:text-white"
        >
          anonymous, to you.
        </Link>

        <Link
          href="/create"
          className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Create
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[calc(100vh-90px)] flex-col items-center px-6 pb-16 pt-16 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.45em] text-red-300/70"
        >
          <Sparkles size={13} />
          <span>Some words need no name</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9 }}
          className="mt-8 max-w-5xl text-5xl font-extralight leading-[0.95] tracking-tight sm:text-6xl md:text-8xl"
        >
          Say what you
          <br />
          <span className="text-zinc-500">never could.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 max-w-md text-sm leading-7 text-zinc-600 md:text-base"
        >
          Anonymous, to you is a private space for the words you
          couldn&apos;t say out loud.
        </motion.p>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="mt-10"
        >
          <Link
            href="/create"
            className="group flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-xs uppercase tracking-[0.25em] transition duration-500 hover:border-red-300/20 hover:bg-white/[0.07]"
          >
            Write a message

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:translate-x-1">
              <ArrowRight size={14} />
            </span>
          </Link>
        </motion.div>

        {/* Flow cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-20 grid w-full max-w-3xl gap-4 md:grid-cols-2"
        >
          {/* ANONYMOUS */}
          <Link href="/inbox/create" className="group block">
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 text-left transition duration-500 group-hover:border-red-300/20 group-hover:bg-white/[0.045]"
            >
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-900/10 blur-[70px] transition duration-700 group-hover:bg-red-800/20" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-400/15 bg-red-400/5">
                    <Lock
                      size={17}
                      strokeWidth={1}
                      className="text-red-300"
                    />
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-zinc-700 transition duration-500 group-hover:translate-x-1 group-hover:text-red-300"
                  />
                </div>

                <p className="mt-8 text-[10px] uppercase tracking-[0.35em] text-red-300/70">
                  Anonymous
                </p>

                <h2 className="mt-3 text-2xl font-light">
                  Send without a name.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600">
                  Leave someone a message they can open without ever knowing
                  who sent it.
                </p>
              </div>
            </motion.div>
          </Link>

          {/* PERSONAL */}
          <Link href="/personal" className="group block">
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 text-left transition duration-500 group-hover:border-purple-300/20 group-hover:bg-white/[0.045]"
            >
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-900/10 blur-[70px] transition duration-700 group-hover:bg-purple-800/20" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-purple-400/15 bg-purple-400/5">
                    <Heart
                      size={17}
                      strokeWidth={1}
                      className="text-purple-300"
                    />
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-zinc-700 transition duration-500 group-hover:translate-x-1 group-hover:text-purple-300"
                  />
                </div>

                <p className="mt-8 text-[10px] uppercase tracking-[0.35em] text-purple-300/70">
                  Personal
                </p>

                <h2 className="mt-3 text-2xl font-light">
                  Send something secret.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600">
                  Write directly to someone special and let them discover
                  something meant only for them.
                </p>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-14 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-zinc-700"
        >
          <MessageCircle size={12} />
          <span>Private · Anonymous · Yours</span>
        </motion.div>
      </section>
    </main>
  );
}