"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

interface Ticket {
  id: string;
  filmTitle: string;
  cinemaName: string;
  schedule: string;
  seat: string;
  price: number;
}

export default function HistoryPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "tickets"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const data: Ticket[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            filmTitle: d.filmTitle,
            cinemaName: d.cinemaName,
            schedule: d.schedule,
            seat: d.seat,
            price: d.price,
          };
        });

        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading history...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "40px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* TITLE */}
        <h2
          style={{
            fontSize: "30px",
            fontWeight: 700,
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#222",
          }}
        >
          🎫 Riwayat Tiket
        </h2>

        {tickets.length === 0 && (
          <p style={{ textAlign: "center", color: "#777" }}>
            🎟️ Belum ada riwayat pembelian
          </p>
        )}

        {tickets.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#f9fafb",
              borderRadius: "22px",
              padding: "30px",
              marginBottom: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
          >
            {/* LEFT */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#222" }}>
                {t.filmTitle}
              </h3>

              <div style={{ marginTop: "18px", color: "#444" }}>
                <p><strong>Cinema:</strong><br />{t.cinemaName}</p>
                <p><strong>Waktu:</strong><br />{t.schedule}</p>
              </div>
            </div>

            {/* MIDDLE */}
            <div style={{ flex: 0.6, color: "#444" }}>
              <p><strong>Kursi:</strong><br />{t.seat}</p>
              <p>
                <strong>Harga:</strong><br />
                Rp {t.price.toLocaleString("id-ID")}
              </p>
            </div>

            {/* RIGHT */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "green",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  justifyContent: "flex-end",
                  marginBottom: "14px",
                }}
              >
                ✅ Paid
              </div>

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
          </div>
        ))}
      </div>
    </div>
  );
}
