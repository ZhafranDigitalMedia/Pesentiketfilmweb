"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

import { auth } from "../utils/firebase";
import logo from "../assets/cinebook-logo.png";
import MovieGrid from "../components/MovieGrid";
import HeaderNav from "../components/HeaderNav";
import AdminHeaderNav from "../components/adminHeaderNav";
import AddCinema from "../components/addCinema";
import Footer from "../components/Footer";

export default function HomePage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      // ambil role dari Firestore
      const snap = await fetch(`/api/user-role?uid=${user.uid}`);
      const data = await snap.json();

      setRole(data.role ?? "user");
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#6A77E0", minHeight: "100vh" }}>
      <header className="flex justify-center items-center gap-3 p-4">
        <Image src={logo} alt="CineBook logo" width={100} height={100} />
        <h1 className="text-4xl font-bold text-white">CineBook</h1>
      </header>

      {role === "admin" ? <AdminHeaderNav /> : <HeaderNav />}

      <div className="p-8">
        {role === "admin" ? <AddCinema /> : <MovieGrid />}
      </div>

      <Footer />
    </div>
  );
}
