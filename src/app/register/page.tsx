"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import logo from "../../assets/logo.png";
import { AuthController } from "../../controllers/AuthController";
import { AuthException } from "../../exceptions/AuthException";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [notelp, setNotelp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await AuthController.register(
        name,
        notelp,
        email,
        password,
        confirmPassword
      );

      router.push("/login");
    } catch (err) {
      if (err instanceof AuthException) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">

        <div className="flex flex-col items-center mb-6">
          <img src={logo.src} className="w-12 mb-2" alt="logo" />
          <h1 className="text-3xl font-bold text-indigo-600">CineBook</h1>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <input
            placeholder="Nama Lengkap"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-lg text-black"
          />

          <input
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-lg text-black"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg text-black"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Konfirmasi Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg text-black"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer text-sm text-gray-600"
          >
            {showPassword ? "🙈 Sembunyikan" : "👁️ Tampilkan"} password
          </span>

          <input
            placeholder="No Telepon"
            required
            value={notelp}
            onChange={(e) => setNotelp(e.target.value)}
            className="px-4 py-2 border rounded-lg text-black"
          />

          {error && (
            <p className="text-red-600 text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <a href="/login" className="font-semibold text-indigo-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
