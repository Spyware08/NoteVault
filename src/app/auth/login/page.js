
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { Mail, Lock, LogIn } from "lucide-react";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Normal Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Please wait...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setUser(data.user));
        toast.success("Login successful");
        router.replace("/");
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    const loadingToast = toast.loading("Verifying Google account...");

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

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">

      <AuthLeftPanel />

      <div className="flex items-center justify-center px-6">

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl w-full max-w-md"
        >

          <h2 className="text-3xl font-bold text-center mb-6">
            Login
          </h2>

          <div className="relative mb-4">
            <Mail
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full pl-10 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          <div className="relative mb-6">
            <Lock
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center gap-2 bg-blue-600 py-2 rounded-lg hover:bg-blue-700"
          >
            <LogIn size={18} />
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-gray-700" />
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-700" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
              theme="filled_black"
              shape="rectangular"
              text="continue_with"
              width="350"
            />
          </div>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-400">
              Signup
            </Link>
          </p>

        </motion.form>

      </div>
    </div>
  );
}
