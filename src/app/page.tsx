"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "user">("user");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      const savedRole =
        (localStorage.getItem("role") as "admin" | "user") ?? "user";

      setRole(savedRole);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-xl sm:text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6A77E0] flex flex-col">
      <header className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 p-4">
        <Image
          src={logo}
          alt="CineBook logo"
          width={70}
          height={70}
          className="sm:w-[100px] sm:h-[100px]"
        />
        <h1 className="text-2xl sm:text-4xl font-bold text-white">
          CineBook
        </h1>
      </header>

      {role === "admin" ? <AdminHeaderNav /> : <HeaderNav />}

      <main className="flex-1 px-4 sm:px-8 py-6">
        {role === "admin" ? <AddCinema /> : <MovieGrid />}
      </main>

      <Footer />
    </div>
  );
}
