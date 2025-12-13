"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

import { auth, db } from "../utils/firebase";

// ======================
// INTERFACE
// ======================
interface Ticket {
  id: string;
  filmTitle: string;
  cinemaName: string;
  schedule: string;
  seat: string;
  price: number;
  name?: string; // ⭐ OPTIONAL (biar tiket lama aman)
  orderDate?: Timestamp;
}

export default function Tiket() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH ALL TICKETS
  // ======================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "tickets"),
          orderBy("orderDate", "desc")
        );

        const snapshot = await getDocs(q);

        const data: Ticket[] = snapshot.docs.map((doc) => {
          const d = doc.data();

          return {
            id: doc.id,
            filmTitle: d.filmTitle ?? "-",
            cinemaName: d.cinemaName ?? "-",
            schedule: d.schedule ?? "-",
            seat: d.seat ?? "-",
            price: typeof d.price === "number" ? d.price : 0,
            name: d.name || "-", // ⭐ FIX UTAMA
            orderDate: d.orderDate,
          };
        });

        setTickets(data);
      } catch (err) {
        console.error("Gagal mengambil tiket:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div style={{ padding: 50, color: "white" }}>
        Loading tiket...
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <div style={{ minHeight: "100vh", padding: "30px" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "40px",
          maxWidth: "1100px",
          margin: "0 auto",
          boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* TITLE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <span style={{ fontSize: "28px" }}>📜</span>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: 0,
              color: "#333",
            }}
          >
            Tiket Sales
          </h2>
        </div>

        {/* EMPTY */}
        {tickets.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#777" }}>
            <p style={{ fontSize: "18px" }}>🎟️ Belum ada tiket</p>
          </div>
        )}

        {/* LIST */}
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              background: "#f7f8fc",
              padding: "35px",
              borderRadius: "20px",
              marginBottom: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              boxShadow: "0 5px 18px rgba(0,0,0,0.05)",
            }}
          >
            {/* LEFT */}
            <div style={{ flex: 1, minWidth: 0, color: "#333" }}>
              <h2 style={{ marginBottom: 10 }}>{ticket.filmTitle}</h2>

              <p><strong>Cinema:</strong> {ticket.cinemaName}</p>
              <p><strong>Waktu:</strong> {ticket.schedule}</p>
              <p>
                <strong>Nama Pembeli:</strong> {ticket.name}
              </p>
            </div>

            {/* RIGHT */}
            <div style={{ flex: 0.6, minWidth: 0, color: "#333" }}>
              <p><strong>Kursi:</strong> {ticket.seat}</p>
              <p>
                <strong>Harga:</strong>{" "}
                Rp {ticket.price.toLocaleString("id-ID")}
              </p>
              <p>
                <strong>Order:</strong>{" "}
                {ticket.orderDate
                  ? ticket.orderDate.toDate().toLocaleString("id-ID")
                  : "-"}
              </p>

              <p style={{ marginTop: 10, color: "green", fontWeight: 600 }}>
                ✔ Paid
              </p>
            </div>

            {/* QR */}
            <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "18px",
                  background: "linear-gradient(145deg, #6f7cf7, #8b5cf6)",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "42px", marginBottom: "6px" }}>▣</div>
                <span style={{ fontSize: "13px" }}>QR CODE</span>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
