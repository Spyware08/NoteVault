"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserPlus } from "lucide-react";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const loadingToast = toast.loading("Please wait...");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    toast.dismiss(loadingToast);

    if (res.status === 201) {

      toast.success("Account created 🎉");

      setTimeout(() => {
        router.push("/auth/login");
      }, 800);

    } else {
      toast.error(data?.message || "Signup failed");
    }

  };

  return (

    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">

      {/* LEFT PANEL */}
      <AuthLeftPanel
        title="Join NoteVault"
        subtitle="Create your account and start saving your notes securely."
      />

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center px-6">

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl w-full max-w-md"
        >

          <h2 className="text-3xl font-bold text-center mb-6">
            Signup
          </h2>

          {/* Name */}
          <div className="relative mb-4">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-10 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              required
            />
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-10 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              required
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center gap-2 bg-green-600 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <UserPlus size={18} />
            Signup
          </button>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-green-400">
              Login
            </Link>
          </p>

        </motion.form>

      </div>

    </div>
  );
}