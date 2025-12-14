"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import logo from "../../assets/logo.png";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ LOGIN FIREBASE AUTH
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ AMBIL DATA USER DARI FIRESTORE
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("Data user tidak ditemukan di database");
      }

      const userData = userSnap.data();

      // 3️⃣ SIMPAN KE LOCALSTORAGE (OPTIONAL)
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role ?? "user");

      // 4️⃣ REDIRECT
      router.push("/");

    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Email belum terdaftar");
      } else if (err.code === "auth/wrong-password") {
        setError("Password salah");
      } else if (err.code === "auth/invalid-credential") {
        setError("Email atau password salah");
      } else {
        setError("Login gagal");
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

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <div>
            <label className="text-black">Email</label>
            <input
              type="email"
              required
              placeholder="email@gmail.com"
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
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-black"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Belum punya akun?{" "}
          <a href="/register" className="font-semibold text-indigo-600">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
