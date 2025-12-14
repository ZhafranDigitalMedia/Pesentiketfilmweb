"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";

interface Favorite {
  id: string;
  filmTitle: string;
  genre: string;
  year: number;
}

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // ========================
  // CEK LOGIN (FIREBASE AUTH)
  // ========================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserId(user.uid);
      }
    });

    return () => unsub();
  }, [router]);

  // ========================
  // AMBIL FAVORITES (REALTIME)
  // ========================
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Favorite, "id">),
      }));
      setFavorites(data);
    });

    return () => unsub();
  }, [userId]);

  // ========================
  // DELETE FAVORITE
  // ========================
  const handleDelete = async (favId: string) => {
    setDeleting(favId);
    try {
      await deleteDoc(doc(db, "favorites", favId));
    } catch (err) {
      console.error("Gagal hapus favorite:", err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: "#FFF",
          borderRadius: "26px",
          padding: "35px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "30px",
            color: "#323232",
          }}
        >
          ❤️ Film Favorit
        </h2>

        {favorites.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Belum ada film favorit
          </p>
        ) : (
          <>
            {favorites.map((fav) => (
              <div
                key={fav.id}
                style={{
                  background: "#FFF",
                  padding: "22px 28px",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#323232",
                    }}
                  >
                    {fav.filmTitle}
                  </h3>
                  <p
                    style={{
                      marginTop: "6px",
                      color: "#7A7A7A",
                      fontSize: "14px",
                    }}
                  >
                    {fav.genre} • {fav.year}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    style={{
                      background: "#6B74E6",
                      color: "#FFF",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                    onClick={() =>
                      router.push(
                        `/detail/${encodeURIComponent(fav.filmTitle)}`
                      )
                    }
                  >
                    Pesan Tiket
                  </button>

                  <span
                    onClick={() => handleDelete(fav.id)}
                    style={{
                      fontSize: "22px",
                      cursor: "pointer",
                    }}
                  >
                    {deleting === fav.id ? "🤍" : "❤️"}
                  </span>
                </div>
              </div>
            ))}

            <div
              style={{
                textAlign: "center",
                padding: "18px",
                borderRadius: "14px",
                background: "#F5F5F5",
                fontWeight: "600",
                color: "#6B74E6",
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            >
              Lihat Semua Film
            </div>
          </>
        )}
      </div>
    </div>
  );
}
