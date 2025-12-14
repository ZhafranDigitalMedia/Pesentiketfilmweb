"use client";

import React, { useState } from "react";
import Image from "next/image";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 TAMBAHAN

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `http://localhost:8080/tess/login?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;

      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Login gagal, cek email atau password.");
      }

      const data = await response.json();
      console.log("Login success:", data);

      localStorage.setItem("userId", data.id);
      localStorage.setItem("user", JSON.stringify(data));

      alert("Login berhasil!");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-6">
          <Image
            src="/logo.svg"
            alt="CineBook"
            width={48}
            height={48}
            className="mx-auto mb-2"
            priority
          />
          <h1 className="text-3xl font-semibold text-blue-700">CineBook</h1>
        </div>

        {/* FORM LOGIN */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label className="block font-medium mb-1">Password</label>

            <input
              type={showPassword ? "text" : "password"} // 👈 TOGGLE
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2 pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            {/* ICON EYE */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer text-gray-600"
            >
              {showPassword ? "👁️" : "🙈"}
            </span>
          </div>

          {/* ERROR */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* BUTTON LOGIN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Belum punya akun? <a className="font-bold cursor-pointer">Register</a>
        </p>

        <p className="text-xs text-center text-gray-600 mt-6">
          💡 Tip: Gunakan email dengan kata admin untuk akses admin panel
        </p>

      </div>
    </div>
  );
};

export default Login;
