
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Feather,
  Heart,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const particles = [
    { x: "8%", y: "18%", size: 3, delay: 0 },
    { x: "18%", y: "65%", size: 2, delay: 1.2 },
    { x: "30%", y: "24%", size: 2, delay: 2 },
    { x: "76%", y: "20%", size: 3, delay: 0.5 },
    { x: "88%", y: "52%", size: 2, delay: 1.8 },
    { x: "72%", y: "78%", size: 3, delay: 2.5 },
    { x: "12%", y: "84%", size: 2, delay: 3 },
    { x: "52%", y: "12%", size: 2, delay: 1 },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* =========================================================
          CINEMATIC BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Large moving red light */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["-10%", "12%", "-10%"],
                  y: ["-5%", "12%", "-5%"],
                  scale: [1, 1.2, 1],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[20%] top-[15%] h-[380px] w-[380px] rounded-full bg-red-600/[0.10] blur-[100px]"
        />

        {/* Second moving light */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["10%", "-15%", "10%"],
                  y: ["10%", "-8%", "10%"],
                  scale: [1, 1.15, 1],
                }
          }
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[5%] top-[45%] h-[330px] w-[330px] rounded-full bg-red-900/[0.12] blur-[100px]"
        />

        {/* Bottom atmosphere */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["-5%", "15%", "-5%"],
                  opacity: [0.2, 0.4, 0.2],
                }
          }
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-180px] left-[30%] h-[350px] w-[350px] rounded-full bg-red-500/[0.07] blur-[90px]"
        />

        {/* =====================================================
            MOVING LIGHT BEAM
        ====================================================== */}

        <motion.div
          initial={{ x: "-120%", opacity: 0 }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["-120%", "120%"],
                  opacity: [0, 0.7, 0],
                }
          }
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
          className="absolute left-0 top-[42%] h-[1px] w-[45%] bg-gradient-to-r from-transparent via-red-300/60 to-transparent blur-[1px]"
        />

        <motion.div
          initial={{ x: "120%", opacity: 0 }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: ["120%", "-120%"],
                  opacity: [0, 0.45, 0],
                }
          }
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
          className="absolute right-0 top-[63%] h-[1px] w-[35%] bg-gradient-to-r from-transparent via-red-200/50 to-transparent"
        />

        {/* =====================================================
            FLOATING PARTICLES
        ====================================================== */}

        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-red-200/50 shadow-[0_0_12px_rgba(248,113,113,0.35)]"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -25, 0],
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

        {/* =====================================================
            FLOATING GLASS ORBS
        ====================================================== */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -35, 0],
                  x: [0, 20, 0],
                  rotate: [0, 10, 0],
                }
          }
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[7%] top-[30%] hidden h-20 w-20 rounded-full border border-white/[0.08] bg-white/[0.025] shadow-[inset_0_0_25px_rgba(255,255,255,0.03)] backdrop-blur-md sm:block"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, 30, 0],
                  x: [0, -25, 0],
                  rotate: [0, -12, 0],
                }
          }
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[8%] top-[22%] hidden h-28 w-28 rounded-full border border-red-200/[0.08] bg-red-500/[0.025] shadow-[inset_0_0_35px_rgba(248,113,113,0.04)] backdrop-blur-md sm:block"
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "radial-gradient(circle at center, black 10%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 10%, transparent 75%)",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* =========================================================
          OPENING ANIMATION
      ========================================================== */}

      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{
          duration: 1.2,
          delay: 0.1,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "right" }}
        className="pointer-events-none fixed inset-0 z-50 bg-[#050505]"
      />

      {/* =========================================================
          NAVIGATION
      ========================================================== */}

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.8,
        }}
        className="relative z-20 flex items-center justify-between px-5 py-6 sm:px-8 md:px-12"
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] shadow-lg shadow-black/20 backdrop-blur-xl"
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

        <div className="hidden items-center gap-2.5 sm:flex">
          <motion.span
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.3, 1, 0.3],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="h-1.5 w-1.5 rounded-full bg-red-400"
          />

          <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
            Some things remain unsaid
          </span>
        </div>
      </motion.nav>

      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative z-10 flex min-h-[calc(100vh-82px)] items-center justify-center px-5 pb-16 pt-6 text-center sm:px-6">
        <div className="flex w-full max-w-5xl flex-col items-center">
          {/* =====================================================
              EMBLEM
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotate: -25 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              delay: 0.65,
              duration: 0.9,
              type: "spring",
              stiffness: 130,
              damping: 14,
            }}
            className="relative mb-7"
          >
            {/* Pulsing halo */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.35, 1],
                      opacity: [0.15, 0.45, 0.15],
                    }
              }
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-5 rounded-[28px] bg-red-500/20 blur-2xl"
            />

            {/* Orbiting dot */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: 360,
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -inset-3"
            >
              <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-300 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
            </motion.div>

            <div className="relative flex h-[74px] w-[74px] items-center justify-center rounded-[25px] border border-white/[0.1] bg-white/[0.045] shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <div className="absolute inset-2 rounded-[19px] border border-red-300/[0.09]" />

              <Feather
                size={28}
                strokeWidth={1}
                className="text-red-200"
              />
            </div>
          </motion.div>

          {/* =====================================================
              EYEBROW
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 1,
              duration: 0.7,
            }}
            className="flex items-center gap-3"
          >
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 28 }}
              transition={{
                delay: 1.1,
                duration: 0.6,
              }}
              className="h-px bg-red-400/50"
            />

            <p className="text-[9px] uppercase tracking-[0.42em] text-zinc-500 sm:text-[10px]">
              A message from someone unknown
            </p>

            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 28 }}
              transition={{
                delay: 1.1,
                duration: 0.6,
              }}
              className="h-px bg-red-400/50"
            />
          </motion.div>

          {/* =====================================================
              TITLE
          ====================================================== */}

          <div className="mt-5 overflow-hidden">
            <motion.h1
              initial={{
                opacity: 0,
                y: 90,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.05,
                duration: 1.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[3.5rem] font-light leading-[0.88] tracking-[-0.06em] sm:text-7xl md:text-[7.5rem] lg:text-[9rem]"
            >
              anonymous,
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{
                opacity: 0,
                y: 80,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.25,
                duration: 1.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-700 bg-clip-text text-[3.5rem] font-light italic leading-[0.95] tracking-[-0.06em] text-transparent sm:text-7xl md:text-[7.5rem] lg:text-[9rem]"
            >
              to you.
            </motion.h1>
          </div>

          {/* =====================================================
              DESCRIPTION
          ====================================================== */}

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.7,
              duration: 0.8,
            }}
            className="mt-7 max-w-md text-sm leading-7 text-zinc-500 sm:text-[15px]"
          >
            There are things we want to say.
            <br />
            Sometimes, we&apos;re not ready to be known.
          </motion.p>

          {/* =====================================================
              CTA
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: 2,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8"
          >
            <Link
              href="/create"
              className="group relative inline-flex"
            >
              {/* Outer glow */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: [0.15, 0.35, 0.15],
                        scale: [1, 1.05, 1],
                      }
                }
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-2 rounded-full bg-red-500/20 blur-xl"
              />

              <div className="relative flex items-center gap-4 overflow-hidden rounded-full border border-white/[0.13] bg-white/[0.045] px-6 py-3.5 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-500 group-hover:border-red-300/35 group-hover:bg-red-400/[0.08]">
                {/* Moving shine */}
                <motion.div
                  initial={{ x: "-120%" }}
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
                  className="absolute inset-y-0 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
                />

                <span className="relative text-sm text-zinc-200">
                  Write a message
                </span>

                <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] transition-all duration-300 group-hover:border-red-300/30 group-hover:bg-red-400/10">
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* =====================================================
              SMALL GLASS CARDS
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 2.25,
              duration: 0.8,
            }}
            className="mt-10 grid w-full max-w-md grid-cols-2 gap-2.5"
          >
            <motion.div
              whileHover={{
                y: -3,
              }}
              className="group rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4 text-left backdrop-blur-xl transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035]">
                <Lock
                  size={14}
                  strokeWidth={1.2}
                  className="text-zinc-500 transition-colors group-hover:text-red-300"
                />
              </div>

              <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                Anonymous
              </p>

              <p className="mt-1.5 text-xs text-zinc-500">
                No names. No pressure.
              </p>
            </motion.div>

            <motion.div
              whileHover={{
                y: -3,
              }}
              className="group rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4 text-left backdrop-blur-xl transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035]">
                <Heart
                  size={14}
                  strokeWidth={1.2}
                  className="text-zinc-500 transition-colors group-hover:text-red-300"
                />
              </div>

              <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                Personal
              </p>

              <p className="mt-1.5 text-xs text-zinc-500">
                Say what matters.
              </p>
            </motion.div>
          </motion.div>

          {/* =====================================================
              BOTTOM LABEL
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 2.6,
              duration: 1,
            }}
            className="mt-12 flex items-center gap-2"
          >
            <Sparkles
              size={11}
              strokeWidth={1}
              className="text-zinc-700"
            />

            <span className="text-[8px] uppercase tracking-[0.4em] text-zinc-700">
              Say what you couldn&apos;t
            </span>
          </motion.div>
        </div>
      </section>
    </main>
  );
}