"use client";

import Image from "next/image";
import logo from "../../assets/cinebook-logo.png";
import HeaderNav from "../../components/HeaderNav";
import History from "../../components/History";
import Footer from "../../components/Footer";

export default function HistoriPage() {
  return (
    <div style={{ background: "#6A77E0", minHeight: "100vh" }}>
        <header
        style={{
          padding: "15px 25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Image
          src={logo}
          alt="CineBook logo"
          width={100}
          height={100}
        />
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
      <HeaderNav />
      <History />
      <Footer />
    </div>
  );
}
