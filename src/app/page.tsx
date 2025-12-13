"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../assets/cinebook-logo.png";
import MovieGrid from "../components/MovieGrid";
import HeaderNav from "../components/HeaderNav";
import AdminHeaderNav from "../components/adminHeaderNav";
import AddCinema from "../components/addCinema";
import Footer from "../components/Footer";

export default function HomePage() {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);    // <-- TAMBAHAN

  useEffect(() => {
    const id = localStorage.getItem("id");
    const storedRole = localStorage.getItem("role");

    if (!id) {
      router.replace("/login");
      return;
    }

    setRole(storedRole);
    setLoading(false);   // <-- SELESAI BACA LOCALSTORAGE
  }, [router]);

  // Tampilkan loading sampai role terbaca
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#6A77E0", minHeight: "100vh" }}>
      {/* HEADER LOGO */}
      <header
        style={{
          padding: "15px 25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Image src={logo} alt="CineBook logo" width={100} height={100} />
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 700,
            color: "white",
            margin: 0,
          }}
        >
          CineBook
        </h1>
      </header>

      {/* NAVBAR ADMIN / USER */}
      <div>
        {role === "admin" ? <AdminHeaderNav /> : <HeaderNav />}
      </div>

      {/* MOVIE LIST */}
      <div style={{ padding: "30px" }}>
        {role === "user" ? <MovieGrid/>: <AddCinema />}
      </div>
      <Footer />
    </div>
  );
}
