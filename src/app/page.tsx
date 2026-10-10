import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Link2,
  LockKeyhole,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Mail,
    label: "ANONYMOUS",
    title: "Receive messages",
    description:
      "Create your personal link and let people send you anonymous messages.",
  },
  {
    icon: Link2,
    label: "YOUR LINK",
    title: "Share your link",
    description:
      "Get a unique link and share it with friends, followers, or anyone you choose.",
  },
  {
    icon: ShieldCheck,
    label: "PRIVACY",
    title: "Your privacy matters",
    description:
      "A space for honest conversations, with privacy built into the experience.",
  },
  {
    icon: Heart,
    label: "REAL PEOPLE",
    title: "Real thoughts",
    description:
      "From kind words to deep confessions, give thoughts a place to be heard.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050a14] text-white">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-amber-400/[0.06] blur-[150px]"
      />

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" aria-label="ATY home" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/[0.06] text-amber-300">
              <Mail size={23} strokeWidth={1.6} />
            </span>

            <span>
              <span className="block text-xl font-light tracking-[0.32em]">
                ATY
              </span>
              <span className="mt-0.5 block text-[8px] tracking-[0.22em] text-slate-400">
                ANONYMOUS, TO YOU
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <Link href="/" className="text-amber-300">
              Home
            </Link>
            <Link
              href="/inbox/create"
              className="transition-colors hover:text-white"
            >
              Create Link
            </Link>
            <Link
              href="/personal"
              className="transition-colors hover:text-white"
            >
              Send a Message
            </Link>
          </div>

          <Link
            href="/inbox/create"
            className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 px-4 py-2.5 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-300 hover:text-slate-950 sm:px-5 sm:text-sm"
          >
            Get Started
            <ArrowRight size={15} />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-20 sm:px-8 sm:pt-24 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-28 lg:pt-28">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/[0.05] px-3.5 py-2 text-[10px] tracking-[0.2em] text-amber-200 sm:text-xs">
            <Sparkles size={13} />
            REAL PEOPLE. REAL THOUGHTS.
          </div>

          <h1 className="max-w-2xl text-5xl font-medium leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            No names.
            <br />
            <span className="font-serif italic text-amber-300">
              Just real
            </span>
            <br />
            thoughts.
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            A space for honest, anonymous messages. Create your personal link,
            share it with others, and discover the thoughts people want to
            share with you.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/inbox/create"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-200"
            >
              <Link2 size={17} />
              Create Your Link
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/personal"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white transition-colors hover:border-amber-300/50 hover:bg-white/[0.03]"
            >
              <Send size={16} />
              Send a Message
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <LockKeyhole size={14} className="text-amber-300/80" />
              No names required
            </span>
            <span className="text-slate-700">•</span>
            <span>Share your link anywhere</span>
          </div>
        </div>

        {/* ATY visual identity */}
        <div className="relative mx-auto flex min-h-[340px] w-full max-w-xl items-center justify-center sm:min-h-[420px]">
          <div
            aria-hidden="true"
            className="absolute h-64 w-64 rounded-full bg-amber-400/[0.09] blur-[90px] sm:h-80 sm:w-80"
          />

          <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#101a2a] via-[#090f1b] to-[#080b12] p-7 shadow-2xl sm:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-300/[0.05] blur-3xl" />

            <div className="relative flex items-center justify-between">
              <span className="text-xs tracking-[0.18em] text-slate-400">
                A SPACE JUST FOR YOU
              </span>
              <Sparkles size={17} className="text-amber-300" />
            </div>

            <div className="relative flex min-h-[230px] flex-col items-center justify-center py-10 sm:min-h-[260px]">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-[30px] border border-amber-300/25 bg-amber-300/[0.06] text-amber-300 shadow-[0_0_65px_rgba(252,211,77,0.09)] sm:h-32 sm:w-32">
                <Mail size={65} strokeWidth={1.15} />

                <Sparkles
                  size={19}
                  className="absolute -right-1 -top-2"
                />
              </div>

              <p className="mt-8 text-center font-serif text-2xl italic text-white sm:text-3xl">
                Some thoughts deserve
                <br />
                a place to land.
              </p>

              <p className="mt-3 text-center text-xs text-slate-500">
                Anonymous, to you.
              </p>
            </div>

            <div className="relative flex items-center justify-between border-t border-white/[0.08] pt-5">
              <div>
                <p className="text-sm font-medium text-white">
                  Your personal space
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Make room for honest words.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/20 text-amber-300">
                <Heart size={17} />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-1 hidden rounded-2xl border border-white/10 bg-[#0b1220]/95 p-4 shadow-xl sm:block lg:-left-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300/10 text-amber-300">
                <Mail size={17} />
              </div>

              <div>
                <p className="text-xs font-medium">A message for you</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  No name attached
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mb-10 max-w-xl">
            <p className="text-[10px] tracking-[0.25em] text-amber-300 sm:text-xs">
              A DIFFERENT KIND OF CONNECTION
            </p>

            <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Say more. Reveal less.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Whether you want to receive anonymous messages or send someone a
              thought, ATY gives those words somewhere to go.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-white/[0.08] bg-[#080e19]/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/25 hover:bg-[#0c1422]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/[0.06] text-amber-300 transition-colors group-hover:bg-amber-300/10">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>

                  <p className="mt-7 text-[9px] tracking-[0.22em] text-slate-500">
                    {feature.label}
                  </p>

                  <h3 className="mt-3 text-lg font-medium">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 h-48 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/[0.06] blur-[90px]"
        />

        <p className="text-[10px] tracking-[0.3em] text-amber-300 sm:text-xs">
          ANONYMOUS, TO YOU
        </p>

        <h2 className="mt-5 font-serif text-4xl italic tracking-tight sm:text-5xl">
          Every thought finds a way.
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-400">
          Create your personal link and give people a space to say what they
          really think.
        </p>

        <Link
          href="/inbox/create"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-300 px-7 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-200"
        >
          Create Your Link
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-center sm:flex-row sm:px-8 sm:text-left lg:px-12">
          <Link
            href="/"
            className="text-sm font-light tracking-[0.3em] text-amber-200"
          >
            ATY
            <span className="ml-3 text-[9px] tracking-[0.18em] text-slate-500">
              ANONYMOUS, TO YOU
            </span>
          </Link>

          <p className="text-xs text-slate-500">
            Real people. Real thoughts. No names. Just you.
          </p>
        </div>
      </footer>
    </main>
  );
}