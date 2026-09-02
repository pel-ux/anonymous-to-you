"use client";

import { motion } from "framer-motion";
import { ArrowDown, Feather } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-950/20 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-zinc-800/20 blur-[100px]" />
      </div>

      {/* Noise texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] noise" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex items-center justify-between px-6 py-7 md:px-12"
      >
        <div className="text-sm tracking-[0.3em] text-zinc-400">
          ATY<span className="text-red-400">.</span>
        </div>

        <div className="text-xs tracking-widest text-zinc-600">
          SOME THINGS REMAIN UNSAID
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        {/* Floating icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: 1.2 },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
        >
          <Feather
            size={26}
            strokeWidth={1}
            className="text-red-300"
          />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-6 text-[10px] uppercase tracking-[0.5em] text-zinc-500"
        >
          a message from someone unknown
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          className="max-w-4xl text-5xl font-light tracking-tight sm:text-7xl md:text-8xl"
        >
          anonymous,
          <br />
          <span className="italic text-zinc-400">to you.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="mt-8 max-w-md text-sm leading-relaxed text-zinc-500 md:text-base"
        >
          There are things we want to say.
          <br />
          Sometimes, we&apos;re not ready to be known.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-10"
        >
          <Link
            href="/create"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 px-7 py-3.5 text-sm transition-all duration-500 hover:border-red-400/50 hover:bg-red-400/10"
          >
            <span>Write a message</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </section>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-700">
          Say what you couldn&apos;t
        </span>
        <ArrowDown size={14} className="animate-bounce text-zinc-600" />
      </motion.div>
    </main>
  );
}