"use client";

import Image from "next/image";
import logo from "../../assets/cinebook-logo.png";
import AdminHeaderNav from "../../components/adminHeaderNav";
import AddCinema from "../../components/addCinema";

export default function addcinemaPage() {
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
      <AdminHeaderNav />
      <AddCinema />
    </div>
  );
}
