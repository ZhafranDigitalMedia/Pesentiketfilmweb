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
    <div className="min-h-screen p-4 sm:p-8 bg-[#6A77E0]">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 max-w-6xl mx-auto shadow-xl">

        {/* TITLE */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">📜</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Tiket Sales
          </h2>
        </div>

        {/* EMPTY */}
        {tickets.length === 0 && (
          <p className="text-center text-gray-500 py-16">
            🎟️ Belum ada tiket
          </p>
        )}

        {/* LIST */}
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="
              bg-gray-50 rounded-2xl p-5 sm:p-8
              shadow-md
              flex flex-col lg:flex-row
              gap-6
            "
            >
              {/* LEFT */}
              <div className="flex-1 text-gray-800">
                <h3 className="text-xl font-semibold mb-2">
                  {ticket.filmTitle}
                </h3>

                <p><strong>Cinema:</strong> {ticket.cinemaName}</p>
                <p><strong>Waktu:</strong> {ticket.schedule}</p>
                <p><strong>Nama Pembeli:</strong> {ticket.name}</p>
              </div>

              {/* MIDDLE */}
              <div className="flex-1 text-gray-800">
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

                <p className="mt-2 text-green-600 font-semibold">
                  ✔ Paid
                </p>
              </div>

              {/* QR */}
              <div className="flex justify-center lg:justify-end">
                <div
                  className="
                  w-28 h-28 sm:w-32 sm:h-32
                  rounded-xl
                  bg-gradient-to-br from-indigo-500 to-purple-500
                  text-white
                  flex flex-col items-center justify-center
                  cursor-pointer
                "
                >
                  <div className="text-3xl mb-1">▣</div>
                  <span className="text-xs">QR CODE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}
