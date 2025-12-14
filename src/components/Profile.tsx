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
    <div style={{ background: "#6A77E0", minHeight: "100vh", padding: "30px" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <span style={{ fontSize: 28 }}>👤</span>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0,color: "#333" }}>Profile</h2>
        </div>

        {/* PROFILE CARD */}
        <div
          style={{
            background: "linear-gradient(135deg, #6C7AE0, #7E5EBE)",
            borderRadius: "24px",
            padding: "30px",
            color: "#fff",
            textAlign: "center",
            maxWidth: "420px",
            margin: "0 auto 30px",
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              margin: "0 auto 16px",
            }}
          >
            👤
          </div>

          <h3 style={{ marginBottom: 6 }}>{user.name}</h3>
          <p>✉️ {user.email}</p>
          <p>📞 {user.no_telp}</p>
          <p>Role : {user.role}</p>
        </div>

        {/* STATS */}
        {user.role !== "admin" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              maxWidth: 520,
              margin: "0 auto 30px",
            }}
          >
            <StatCard icon="🎟️" value={totalTicket} label="Tiket Dibeli" />
            <StatCard icon="❤️" value={totalFavorite} label="Film Favorit" />
          </div>
        )}

        {/* LOGOUT */}
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <button
            onClick={async () => {
              await signOut(auth);
              router.replace("/login");
            }}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "none",
              background: "#F56C6C",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
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
    <div
      style={{
        background: "#f9f9f9",
        borderRadius: 18,
        padding: 20,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 600,color: "#333" }}>{value}</div>
      <div style={{ fontSize: 14, color: "#777" }}>{label}</div>
    </div>
  );
}
