"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LogIn,
  UserPlus,
  NotebookPen,
  Image,
  Shield,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-6">

      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full"></div>

      <div className="relative max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center pt-28 pb-20">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-4 rounded-full shadow-lg">
                <NotebookPen size={30} />
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-4">
              Welcome to <span className="text-blue-500">NoteVault</span>
            </h1>

            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Capture your ideas, organize your thoughts, and store images
              in a beautiful and secure notes app.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">

              <Link href="/auth/login">
                <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg">
                  <LogIn size={18} />
                  Login
                </button>
              </Link>

              <Link href="/auth/signup">
                <button className="flex items-center gap-2 px-8 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition shadow-lg">
                  <UserPlus size={18} />
                  Create Account
                </button>
              </Link>

            </div>

          </motion.div>

        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-8 pb-28">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/60 backdrop-blur border border-white/10 p-8 rounded-xl text-center"
          >

            <div className="flex justify-center mb-4">
              <NotebookPen className="text-blue-400" size={28} />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Smart Notes
            </h3>

            <p className="text-gray-400 text-sm">
              Write and organize your notes easily with a clean interface.
            </p>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/60 backdrop-blur border border-white/10 p-8 rounded-xl text-center"
          >

            <div className="flex justify-center mb-4">
              <Image className="text-purple-400" size={28} />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Image Support
            </h3>

            <p className="text-gray-400 text-sm">
              Attach images to your notes to make them more visual.
            </p>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/60 backdrop-blur border border-white/10 p-8 rounded-xl text-center"
          >

            <div className="flex justify-center mb-4">
              <Shield className="text-green-400" size={28} />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Secure Storage
            </h3>

            <p className="text-gray-400 text-sm">
              Your notes are securely stored and accessible anytime.
            </p>

          </motion.div>

        </div>

        {/* FOOTER */}
        <div className="text-center pb-10 text-gray-500 text-sm">
          Built with Next.js • Secure • Fast ⚡
        </div>

      </div>
    </div>
  );
}