"use client";

import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Lock,
  MessageCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[18%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-red-950/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.45em] text-zinc-500 transition-colors hover:text-white"
        >
          anonymous, to you.
        </Link>

        <Link
          href="/create"
          className="rounded-full border border-white/10 px-4 py-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
        >
          Create
        </Link>
      </nav>

      {/* Main */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-5xl flex-col px-5 pb-10 pt-12 md:px-8 md:pt-20">
        
        {/* Small label */}
        <div className="mx-auto flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-red-300/60">
          <span className="h-1 w-1 rounded-full bg-red-300/70" />
          No names. Just words.
        </div>

        {/* Hero */}
        <div className="mx-auto mt-8 max-w-3xl text-center md:mt-10">
          <h1 className="text-5xl font-extralight leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-8xl">
            Say what you
            <br />
            <span className="text-zinc-600">never could.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-zinc-600 md:text-base">
            A private place for messages that are easier to send
            without your name attached.
          </p>
        </div>

        {/* Choices */}
        <div className="mx-auto mt-12 grid w-full max-w-2xl gap-3 sm:grid-cols-2 md:mt-16 md:gap-4">
          
          {/* Anonymous */}
          <Link href="/inbox/create" className="group">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-300/20 hover:bg-white/[0.04] md:rounded-3xl md:p-7">
              
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-red-950/20 blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-300/10 bg-red-400/[0.04]">
                    <Lock
                      size={16}
                      strokeWidth={1}
                      className="text-red-300/80"
                    />
                  </div>

                  <ArrowRight
                    size={15}
                    strokeWidth={1}
                    className="text-zinc-700 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-300"
                  />
                </div>

                <p className="mt-7 text-[9px] uppercase tracking-[0.35em] text-red-300/60">
                  Anonymous inbox
                </p>

                <h2 className="mt-3 text-xl font-light md:text-2xl">
                  Receive anonymously.
                </h2>

                <p className="mt-2 text-xs leading-6 text-zinc-600">
                  Create your link and let people send you messages
                  without revealing who they are.
                </p>
              </div>
            </div>
          </Link>

          {/* Personal */}
          <Link href="/personal" className="group">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/20 hover:bg-white/[0.04] md:rounded-3xl md:p-7">
              
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-950/20 blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-300/10 bg-purple-400/[0.04]">
                    <Heart
                      size={16}
                      strokeWidth={1}
                      className="text-purple-300/80"
                    />
                  </div>

                  <ArrowRight
                    size={15}
                    strokeWidth={1}
                    className="text-zinc-700 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-purple-300"
                  />
                </div>

                <p className="mt-7 text-[9px] uppercase tracking-[0.35em] text-purple-300/60">
                  Personal
                </p>

                <h2 className="mt-3 text-xl font-light md:text-2xl">
                  Send something secret.
                </h2>

                <p className="mt-2 text-xs leading-6 text-zinc-600">
                  Send a private message to someone and let them
                  discover something meant just for them.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom line */}
        <div className="mx-auto mt-auto flex items-center gap-2 pt-12 text-[8px] uppercase tracking-[0.35em] text-zinc-700">
          <MessageCircle size={11} strokeWidth={1} />
          <span>Private · Anonymous · Yours</span>
        </div>
      </section>
    </main>
  );
}