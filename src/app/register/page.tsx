"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import logo from "../../assets/logo.png";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";

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
    setError("");

    // 🔒 validasi password
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ BUAT AKUN DI FIREBASE AUTH
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ SIMPAN DATA TAMBAHAN DI FIRESTORE
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        no_telp: notelp,
        role: "user",
        createdAt: new Date(),
      });

      // 3️⃣ REDIRECT
      router.push("/login");

    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar");
      } else if (err.code === "auth/weak-password") {
        setError("Password minimal 6 karakter");
      } else {
        setError("Registrasi gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo.src} className="w-12 mb-2" alt="logo" />
          <h1 className="text-3xl font-bold text-indigo-600">CineBook</h1>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <div>
            <label className="text-black">Nama lengkap</label>
            <input
              type="Nama"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="text-black">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-black"
            />
          </div>

          <div className="relative">
            <label className="text-black">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-black"
            />
          </div>

          <div className="relative">
            <label className="text-black">Konfirmasi Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-black"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[35px] cursor-pointer text-gray-600 text-lg"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div>
            <label className="text-black">No Telepon</label>
            <input
              type="text"
              required
              value={notelp}
              onChange={(e) => setNotelp(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-black"
            />
          </div>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <a href="/login" className="font-semibold text-indigo-600">Login</a>
        </p>

      </div>
    </div>
  );
}
