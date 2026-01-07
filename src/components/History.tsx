"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { QRCodeCanvas } from "qrcode.react";

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
      <div className="min-h-screen flex items-center justify-center">
        Loading history...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10 bg-gradient-to-b from-[#6a65df] to-[#7451e1]">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-5xl mx-auto">
        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          🎫 Riwayat Tiket
        </h2>

        {tickets.length === 0 && (
          <p className="text-center text-gray-500">
            🎟️ Belum ada riwayat pembelian
          </p>
        )}

        {tickets.map((t) => (
          <div
            key={t.id}
            className="bg-gray-50 rounded-2xl shadow-md p-4 sm:p-6 mb-6
                       flex flex-col lg:flex-row lg:items-center gap-6"
          >
            {/* LEFT */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {t.filmTitle}
              </h3>

              <div className="mt-3 text-sm sm:text-base text-gray-600 space-y-2">
                <p>
                  <span className="font-semibold">Cinema:</span><br />
                  {t.cinemaName}
                </p>
                <p>
                  <span className="font-semibold">Waktu:</span><br />
                  {t.schedule}
                </p>
              </div>
            </div>

            {/* MIDDLE */}
            <div className="text-sm sm:text-base text-gray-600">
              <p>
                <span className="font-semibold">Kursi:</span><br />
                {t.seat}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Harga:</span><br />
                Rp {t.price.toLocaleString("id-ID")}
              </p>
            </div>

            {/* RIGHT (QR) */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-green-600 font-semibold flex items-center gap-1">
                ✅ Paid
              </span>

              <div className="bg-white p-2 rounded-xl shadow">
                <QRCodeCanvas
                  value={`https://pesentiketfilmweb-3lcl.vercel.app/verify?ticketId=${t.id}`}
                  size={110}
                  level="H"
                />
              </div>

              <span className="text-xs text-gray-500">
                Scan saat masuk bioskop
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
