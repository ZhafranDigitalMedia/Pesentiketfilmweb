"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔑 AUTO REDIRECT JIKA SUDAH LOGIN
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/");
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("Data user tidak ditemukan");
      }

      const userData = userSnap.data();

      localStorage.setItem("role", userData.role ?? "user");
      localStorage.setItem("user", JSON.stringify(userData));
      // ❌ JANGAN router.replace di sini

    } catch (err: any) {
      setError("Email atau password salah");
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

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-lg text-black"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg text-black"
          />

          {error && <p className="text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 text-white py-2 rounded-lg font-semibold"
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
