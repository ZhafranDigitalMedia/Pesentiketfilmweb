"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

interface UserProfile {
  name: string;
  email: string;
  no_telp: string;
  role: string;
}

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [totalTicket, setTotalTicket] = useState(0);
  const [totalFavorite, setTotalFavorite] = useState(0);
  const [loading, setLoading] = useState(true);

  // ============================
  // AUTH + FETCH DATA
  // ============================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/login");
        return;
      }

      try {
        // 🔹 ambil data user
        const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userSnap.exists()) {
          setUser(userSnap.data() as UserProfile);
        }

        // 🔹 hitung tiket
        const ticketSnap = await getDocs(
          query(
            collection(db, "tickets"),
            where("userId", "==", firebaseUser.uid)
          )
        );
        setTotalTicket(ticketSnap.size);

        // 🔹 hitung favorite
        const favSnap = await getDocs(
          query(
            collection(db, "favorites"),
            where("userId", "==", firebaseUser.uid)
          )
        );
        setTotalFavorite(favSnap.size);
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading || !user) {
    return (
      <p style={{ color: "white", padding: "50px" }}>
        Loading profile...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[#6A77E0] px-4 py-6 sm:py-10">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-4xl mx-auto shadow-xl">
        {/* TITLE */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">👤</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Profile
          </h2>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500
                      rounded-3xl p-6 sm:p-8 text-white text-center
                      max-w-md mx-auto mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full
                        bg-white/30 flex items-center justify-center
                        text-3xl sm:text-4xl mx-auto mb-4">
            👤
          </div>

          <h3 className="text-lg sm:text-xl font-semibold">
            {user.name}
          </h3>
          <p className="text-sm sm:text-base mt-1">✉️ {user.email}</p>
          <p className="text-sm sm:text-base">📞 {user.no_telp}</p>
          <p className="text-sm sm:text-base mt-2">
            Role: <span className="font-semibold capitalize">{user.role}</span>
          </p>
        </div>

        {/* STATS */}
        {user.role !== "admin" && (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <StatCard icon="🎟️" value={totalTicket} label="Tiket Dibeli" />
            <StatCard icon="❤️" value={totalFavorite} label="Film Favorit" />
          </div>
        )}

        {/* LOGOUT */}
        <div className="max-w-md mx-auto">
          <button
            onClick={async () => {
              await signOut(auth);
              router.replace("/login");
            }}
            className="w-full py-3 rounded-xl bg-red-500
                     text-white font-semibold hover:bg-red-600
                     transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

}

// =========================
// STAT CARD
// =========================
function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 text-center shadow-sm">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
