"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="w-1/2 bg-white flex items-center justify-center px-16">
        <div className="w-full max-w-md">
          {/* Titles */}
          <h1 className="text-[32px] font-bold text-gray-900 leading-tight">
            Bentornato.
          </h1>
          <h2 className="text-[32px] font-bold text-gray-900 leading-tight mb-2">
            Accedi per continuare.
          </h2>
          <p className="text-gray-400 text-sm mb-10">
            Pannello di controllo aziendale
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email field */}
            <div className="relative">
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <div className="flex items-center border-b border-gray-300 pb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 font-semibold text-gray-900 text-sm bg-transparent outline-none placeholder-gray-300"
                  placeholder="nome@azienda.com"
                />
                <svg
                  className="w-4 h-4 text-gray-400 ml-2 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
              </div>
            </div>

            {/* Password field */}
            <div className="relative">
              <label className="block text-xs text-gray-400 mb-1">
                Password
              </label>
              <div className="flex items-center border-b border-gray-300 pb-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 font-semibold text-gray-900 text-sm bg-transparent outline-none placeholder-gray-300"
                  placeholder="••••••••"
                />
                <svg
                  className="w-4 h-4 text-gray-400 ml-2 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 bg-[#3B5BF6] text-white font-semibold rounded-lg hover:bg-[#2f4de0] transition-colors"
            >
              Accedi
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Non hai accesso?{" "}
            <span className="text-[#3B5BF6] cursor-default">
              Contatta l&apos;amministratore
            </span>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-1/2 bg-[#3B5BF6] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full opacity-90"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circles */}
          <circle cx="300" cy="300" r="280" fill="#3353e0" />
          <circle cx="300" cy="300" r="200" fill="none" stroke="#4d6aff" strokeWidth="1" />
          <circle cx="300" cy="300" r="140" fill="none" stroke="#4d6aff" strokeWidth="1" />
          <circle cx="300" cy="300" r="80" fill="none" stroke="#4d6aff" strokeWidth="1" />

          {/* Large accent circles */}
          <circle cx="480" cy="130" r="110" fill="#4d6aff" opacity="0.5" />
          <circle cx="130" cy="470" r="90" fill="#2a45cc" opacity="0.6" />
          <circle cx="500" cy="460" r="60" fill="#6b84ff" opacity="0.4" />
          <circle cx="100" cy="150" r="50" fill="#6b84ff" opacity="0.3" />

          {/* Small dots */}
          <circle cx="200" cy="180" r="8" fill="#a0b0ff" opacity="0.7" />
          <circle cx="400" cy="220" r="6" fill="#a0b0ff" opacity="0.7" />
          <circle cx="360" cy="420" r="10" fill="#a0b0ff" opacity="0.5" />
          <circle cx="180" cy="370" r="7" fill="#a0b0ff" opacity="0.6" />
          <circle cx="460" cy="340" r="5" fill="#ffffff" opacity="0.4" />
          <circle cx="240" cy="290" r="4" fill="#ffffff" opacity="0.5" />

          {/* Geometric lines */}
          <line x1="100" y1="300" x2="500" y2="300" stroke="#4d6aff" strokeWidth="1" opacity="0.4" />
          <line x1="300" y1="100" x2="300" y2="500" stroke="#4d6aff" strokeWidth="1" opacity="0.4" />
          <line x1="150" y1="150" x2="450" y2="450" stroke="#4d6aff" strokeWidth="1" opacity="0.3" />
          <line x1="450" y1="150" x2="150" y2="450" stroke="#4d6aff" strokeWidth="1" opacity="0.3" />

          {/* Triangles */}
          <polygon points="300,180 360,280 240,280" fill="#5c75ff" opacity="0.5" />
          <polygon points="300,420 370,310 230,310" fill="#2a45cc" opacity="0.4" />

          {/* Central glow */}
          <circle cx="300" cy="300" r="30" fill="#ffffff" opacity="0.12" />
          <circle cx="300" cy="300" r="15" fill="#ffffff" opacity="0.18" />
        </svg>
      </div>
    </div>
  );
}
