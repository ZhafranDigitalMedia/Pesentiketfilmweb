"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type Props = {
  id: string | number;
  title: string;
  img: string;
  genre: string;
  year: number;
};

export default function MovieCard({ title, img, genre, year }: Props) {
  const [isFav, setIsFav] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [favDocId, setFavDocId] = useState<string | null>(null);

  // 🔥 Ambil user login dari Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        // 🔍 cek apakah film ini sudah favorite
        const q = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid),
          where("filmTitle", "==", title)
        );

        const snap = await getDocs(q);
        if (!snap.empty) {
          setIsFav(true);
          setFavDocId(snap.docs[0].id);
        }
      } else {
        setUserId(null);
      }
    });

    return () => unsub();
  }, [title]);

  const imageSrc =
    img && img !== "N/A" && img.startsWith("http")
      ? img
      : "/no-image.png";

  // ❤️ TOGGLE FAVORITE
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId) {
      alert("Harus login untuk menambahkan favorit!");
      return;
    }

    try {
      // ❌ HAPUS FAVORITE
      if (isFav && favDocId) {
        await deleteDoc(doc(db, "favorites", favDocId));
        setIsFav(false);
        setFavDocId(null);
        return;
      }

      // ✅ TAMBAH FAVORITE
      const docRef = await addDoc(collection(db, "favorites"), {
        userId,
        filmTitle: title,
        genre,
        year,
      });

      setIsFav(true);
      setFavDocId(docRef.id);
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "28px",
        overflow: "hidden",
        boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "420px" }}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
        />

        {/* ❤️ BUTTON FAVORITE */}
        <div
          onClick={handleFavorite}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "40px",
            height: "40px",
            background: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
            cursor: "pointer",
          }}
        >
          {isFav ? "❤️" : "🤍"}
        </div>
      </div>

      <div style={{ padding: "18px", flex: 1 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: 600, color: "#333" }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: "14px", color: "#777" }}>
          {genre} • {year}
        </p>
      </div>

      <div style={{ padding: "18px" }}>
        <button
          onClick={() =>
            (window.location.href = `/detail/page?title=${encodeURIComponent(
              title
            )}`)
          }
          style={{
            width: "100%",
            padding: "14px",
            background: "#6C7AE0",
            border: "none",
            borderRadius: "14px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Pesan Tiket
        </button>
      </div>
    </div>
  );
}
