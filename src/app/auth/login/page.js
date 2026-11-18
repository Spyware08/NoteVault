
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

import {
  Mail,
  Lock,
  LogIn,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "bruce@gmail.com",
    password: "1234",
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

  // NORMAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const loadingToast = toast.loading("Please wait...");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setUser(data.user));

        toast.success("Login successful!");

        router.replace("/");
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleSuccess = async (credentialResponse) => {
    const loadingToast = toast.loading(
      "Verifying Google account..."
    );

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Google login failed");
        return;
      }

      dispatch(setUser(data.user));

      toast.success("Google login successful!");

      router.replace("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Something went wrong with Google login");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // GOOGLE ERROR
  const handleGoogleError = () => {
    toast.error(
      "Google login failed. Please check your browser popup and tracking protection settings.",
      {
        duration: 7000,
      }
    );
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
            <AuthLeftPanel />
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="relative flex items-center justify-center overflow-hidden px-5 py-12 sm:px-8 lg:px-10">

          {/* BACKGROUND GLOW */}
          <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#E88A35]/[0.05] blur-[130px]" />

          <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#E88A35]/[0.04] blur-[120px]" />

          {/* LOGIN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >

            <div className="overflow-hidden rounded-2xl border border-[#383A3B] bg-[#202223] shadow-2xl shadow-black/30">

              {/* CARD HEADER */}
              <div className="border-b border-[#383A3B] bg-[#252728] px-5 py-7 text-center">

                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-xl border border-[#A66A35]/40 bg-[#33291F]">

                  <img
                    src="/icon.png"
                    alt="NoteVault"
                    className="h-10 w-10 object-contain"
                  />

                </div>

                <h1 className="text-3xl font-extrabold">
                  Welcome{" "}
                  <span className="text-[#E88A35]">
                    Back!
                  </span>
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Login to access your personal workspace.
                </p>

              </div>

              {/* FORM */}
              <div className="p-6 sm:p-8">

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

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
                        placeholder="Enter your password"
                        required
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

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#E88A35] py-3.5 text-sm font-bold text-[#171717] transition hover:bg-[#F59B45] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#171717]/30 border-t-[#171717]" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn size={19} />
                        Login to NoteVault
                      </>
                    )}

                  </button>

                </form>

                {/* DIVIDER */}
                <div className="my-6 flex items-center gap-4">

                  <div className="h-px flex-1 bg-[#414141]" />

                  <span className="text-xs tracking-widest text-gray-500">
                    OR CONTINUE WITH
                  </span>

                  <div className="h-px flex-1 bg-[#414141]" />

                </div>

                {/* GOOGLE LOGIN */}
                <div className="flex justify-center overflow-hidden">

                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    ux_mode="popup"
                    useOneTap={false}
                    theme="filled_black"
                    shape="rectangular"
                    text="continue_with"
                    width="350"
                  />

                </div>

                {/* SIGNUP */}
                <p className="mt-7 text-center text-sm text-gray-500">

                  Don't have an account?{" "}

                  <Link
                    href="/auth/signup"
                    className="font-bold text-[#E88A35] transition hover:text-[#F59B45]"
                  >
                    Create Account
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
