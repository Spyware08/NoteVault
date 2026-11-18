
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LogIn,
  UserPlus,
  NotebookPen,
  Image as ImageIcon,
  Shield,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Smart Notes",
    description:
      "Write, manage, and organize your thoughts with a simple and powerful notes interface.",
    icon: NotebookPen,
    number: "01",
  },
  {
    title: "Image Support",
    description:
      "Attach images to your notes and keep all your important memories in one place.",
    icon: ImageIcon,
    number: "02",
  },
  {
    title: "Secure Storage",
    description:
      "Keep your personal notes organized with privacy-focused storage and easy access.",
    icon: Shield,
    number: "03",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#171819] text-white">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#E88A35]/[0.06] blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[#E88A35]/[0.04] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">

        {/* NAVBAR */}
        <nav className="flex items-center justify-between border-b border-[#383A3B] py-5">

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#A66A35]/40 bg-[#33291F]">
              <img
                src="/icon.png"
                alt="NoteVault"
                className="h-9 w-9 object-contain"
              />
            </div>

            <span className="text-xl font-extrabold tracking-tight">
              Note<span className="text-[#E88A35]">Vault</span>
            </span>

          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/auth/login"
              className="hidden rounded-lg border border-[#414141] px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-[#E88A35] hover:text-[#F59B45] sm:block"
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              className="flex items-center gap-2 rounded-lg bg-[#E88A35] px-4 py-2.5 text-sm font-bold text-[#171717] transition hover:bg-[#F59B45]"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>

          </div>

        </nav>

        {/* HERO SECTION */}
<section className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center sm:min-h-[450px]">
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-[#A66A35]/40 bg-[#29251F] shadow-xl shadow-black/30"
          >
            <img
              src="/icon.png"
              alt="NoteVault"
              className="h-16 w-16 object-contain"
            />
          </motion.div>

          {/* SMALL LABEL */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-5 flex items-center gap-2 rounded-full border border-[#A66A35]/40 bg-[#33291F]/60 px-4 py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[#E88A35]" />
            <span className="text-xs font-bold tracking-[2px] text-[#F59B45]">
              YOUR PERSONAL FILE STORAGE
            </span>
          </motion.div>

          {/* HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-6xl"
          >
            Welcome to NoteVault
            <span className="block text-[#E88A35]">
              One Secure Place.
            </span>
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg"
          >
            Welcome to NoteVault. Capture your ideas, organize your
            thoughts, attach images, and keep everything organized
            in one simple workspace.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex w-full max-w-sm flex-col gap-4 sm:w-auto sm:max-w-none sm:flex-row"
          >

            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-3 rounded-lg bg-[#E88A35] px-9 py-4 text-sm font-bold text-[#171717] shadow-lg shadow-orange-950/20 transition duration-300 hover:-translate-y-1 hover:bg-[#F59B45]"
            >
              <LogIn size={19} />
              Login to NoteVault
            </Link>

            <Link
              href="/auth/signup"
              className="flex items-center justify-center gap-3 rounded-lg border border-[#55504A] bg-[#252728] px-9 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-[#E88A35] hover:bg-[#30271F]"
            >
              <UserPlus size={19} />
              Create Account
            </Link>

          </motion.div>

          {/* BOTTOM HERO DETAIL */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500"
          >
            <span className="flex items-center gap-2">
              <Shield size={14} className="text-[#E88A35]" />
              Privacy Focused
            </span>

            <span className="hidden h-4 w-px bg-[#414141] sm:block" />

            <span className="flex items-center gap-2">
              <NotebookPen size={14} className="text-[#E88A35]" />
              Easy Note Management
            </span>

            <span className="hidden h-4 w-px bg-[#414141] sm:block" />

            <span className="flex items-center gap-2">
              <Zap size={14} className="text-[#E88A35]" />
              Simple Workspace
            </span>
          </motion.div>

        </section>

        {/* FEATURES SECTION */}
        <section className="pb-20">

          {/* SECTION HEADING */}
          <div className="mb-10 text-center">

            <p className="mb-3 text-xs font-bold tracking-[3px] text-[#E88A35]">
              WHAT WE OFFER
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Everything You Need
              <span className="text-[#E88A35]"> in One Place</span>
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              A clean and organized space for your everyday ideas.
            </p>

          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.15,
                  }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-xl border border-[#383A3B] bg-[#202223] p-7 transition-all duration-300 hover:border-[#A66A35] hover:bg-[#252728]"
                >

                  {/* TOP DETAIL */}
                  <div className="mb-7 flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#A66A35]/40 bg-[#33291F] transition group-hover:bg-[#423020]">
                      <Icon
                        size={23}
                        strokeWidth={1.8}
                        className="text-[#E88A35]"
                      />
                    </div>

                    <span className="text-sm font-bold tracking-widest text-[#555555]">
                      {feature.number}
                    </span>

                  </div>

                  {/* CONTENT */}
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-7 text-gray-400">
                    {feature.description}
                  </p>

                  {/* BOTTOM DETAIL */}
                  <div className="mt-7 border-t border-[#383A3B] pt-4">
                    <div className="flex items-center justify-between">

                      <span className="text-xs font-semibold tracking-wide text-gray-500">
                        NOTEVAULT FEATURE
                      </span>

                      <ArrowRight
                        size={17}
                        className="text-[#E88A35] transition-transform group-hover:translate-x-1"
                      />

                    </div>
                  </div>

                </motion.div>
              );
            })}

          </div>

        </section>

        {/* BOTTOM CTA */}
        <section className="mb-16 overflow-hidden rounded-xl border border-[#A66A35]/40 bg-[#25221E] px-6 py-10 text-center sm:px-12">

          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to organize your ideas?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
            Start using NoteVault and keep your important thoughts
            and memories organized in one place.
          </p>

          <Link
            href="/auth/signup"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#E88A35] px-7 py-3.5 text-sm font-bold text-[#171717] transition hover:bg-[#F59B45]"
          >
            Get Started
            <ArrowRight size={17} />
          </Link>

        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#383A3B] py-7">

          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

            <div className="flex items-center gap-2 text-sm font-bold">
              Note<span className="text-[#E88A35]">Vault</span>
            </div>

            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} NoteVault. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              Built with Next.js
              <span className="text-[#E88A35]">•</span>
              Secure
              <span className="text-[#E88A35]">•</span>
              Fast
              <Zap size={13} className="text-[#E88A35]" />
            </div>

          </div>

        </footer>

      </div>
    </main>
  );
}
