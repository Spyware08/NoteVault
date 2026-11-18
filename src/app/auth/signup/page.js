
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Lock,
  UserPlus,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // FORM CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SIGNUP API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const loadingToast = toast.loading("Creating your account...");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success("Account created successfully!");

        setTimeout(() => {
          router.push("/auth/login");
        }, 800);
      } else {
        toast.error(data?.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#171819] text-white">

      {/* ================= HEADER ================= */}

      <header className="relative z-20 flex h-[76px] items-center justify-between border-b border-[#383A3B] bg-[#1C1E1F] px-5 sm:px-10 lg:px-14">

        {/* LOGO LEFT */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >

          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#A66A35]/40 bg-[#33291F]">
            <img
              src="/icon.png"
              alt="NoteVault"
              className="h-9 w-9 object-contain"
            />
          </div>

          <span className="text-2xl font-extrabold tracking-tight">
            Note<span className="text-[#E88A35]">Vault</span>
          </span>

        </Link>

        {/* BACK BUTTON RIGHT */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-[#414141] bg-[#252728] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-[#E88A35] hover:text-[#F59B45]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

      </header>

      {/* ================= MAIN CONTENT ================= */}

      <section className="grid min-h-[calc(100vh-76px)] grid-cols-1 lg:grid-cols-2">

        {/* LEFT PANEL */}
        <div className="hidden items-center justify-center border-r border-[#383A3B] px-8 py-10 lg:flex xl:px-16">

          <div className="w-full max-w-xl">
            <AuthLeftPanel
              title="Join NoteVault"
              subtitle="Create your account and start saving your notes securely."
            />
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="relative flex items-center justify-center overflow-hidden px-5 py-12 sm:px-8 lg:px-10">

          {/* BACKGROUND GLOW */}
          <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#E88A35]/[0.05] blur-[130px]" />

          <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#E88A35]/[0.04] blur-[120px]" />

          {/* SIGNUP CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >

            <div className="overflow-hidden rounded-2xl border border-[#383A3B] bg-[#202223] shadow-2xl shadow-black/30">

              {/* CARD HEADER */}
              <div className="border-b border-[#383A3B] bg-[#252728] px-7 py-7 text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-[#A66A35]/40 bg-[#33291F]">

                  <img
                    src="/icon.png"
                    alt="NoteVault"
                    className="h-12 w-12 object-contain"
                  />

                </div>

                <h1 className="text-3xl font-extrabold">
                  Create Your{" "}
                  <span className="text-[#E88A35]">
                    Account
                  </span>
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Join NoteVault and organize your thoughts.
                </p>

              </div>

              {/* FORM */}
              <div className="p-6 sm:p-8">

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* NAME */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-300">
                      Full Name
                    </label>

                    <div className="relative">

                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E88A35]"
                        size={18}
                      />

                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        autoComplete="name"
                        className="w-full rounded-lg border border-[#414141] bg-[#252728] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#E88A35] focus:ring-2 focus:ring-[#E88A35]/10"
                      />

                    </div>

                  </div>

                  {/* EMAIL */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-300">
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E88A35]"
                        size={18}
                      />

                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        className="w-full rounded-lg border border-[#414141] bg-[#252728] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#E88A35] focus:ring-2 focus:ring-[#E88A35]/10"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-300">
                      Password
                    </label>

                    <div className="relative">

                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E88A35]"
                        size={18}
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-[#414141] bg-[#252728] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#E88A35] focus:ring-2 focus:ring-[#E88A35]/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#F59B45]"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}

                      </button>

                    </div>

                  </div>

                  {/* SIGNUP BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#E88A35] py-3.5 text-sm font-bold text-[#171717] transition hover:bg-[#F59B45] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#171717]/30 border-t-[#171717]" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus size={19} />
                        Create NoteVault Account
                      </>
                    )}

                  </button>

                </form>

                {/* LOGIN LINK */}
                <p className="mt-7 text-center text-sm text-gray-500">

                  Already have an account?{" "}

                  <Link
                    href="/auth/login"
                    className="font-bold text-[#E88A35] transition hover:text-[#F59B45]"
                  >
                    Login
                  </Link>

                </p>

              </div>

              {/* CARD FOOTER */}
              <div className="flex items-center justify-center gap-2 border-t border-[#383A3B] bg-[#252728] px-5 py-4">

                <ShieldCheck
                  size={15}
                  className="text-[#E88A35]"
                />

                <span className="text-xs text-gray-500">
                  Your personal workspace, protected.
                </span>

              </div>

            </div>

            {/* COPYRIGHT */}
            <p className="mt-5 text-center text-xs text-gray-600">
              © {new Date().getFullYear()} NoteVault. All rights reserved.
            </p>

          </motion.div>

        </div>

      </section>

    </main>
  );
}
