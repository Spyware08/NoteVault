import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 shadow-xl rounded-xl p-10 text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Welcome to My App
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/login">
            <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Login
            </button>
          </Link>

          <Link href="/auth/signup">
            <button className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}