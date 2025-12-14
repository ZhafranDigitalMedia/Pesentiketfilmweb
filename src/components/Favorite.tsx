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
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6 text-gray-800">
          ❤️ Film Favorit
        </h2>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">
            Belum ada film favorit
          </p>
        ) : (
          <>
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-4
                         flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                {/* INFO FILM */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {fav.filmTitle}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {fav.genre} • {fav.year}
                  </p>
                </div>

                {/* ACTION */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600
                             text-white px-4 py-2 rounded-lg
                             text-sm sm:text-base font-semibold"
                    onClick={() =>
                      router.push(
                        `/detail/${encodeURIComponent(fav.filmTitle)}`
                      )
                    }
                  >
                    Pesan Tiket
                  </button>

                  <button
                    onClick={() => handleDelete(fav.id)}
                    className="text-2xl"
                  >
                    {deleting === fav.id ? "🤍" : "❤️"}
                  </button>
                </div>
              </div>
            ))}

            <div
              onClick={() => router.push("/")}
              className="mt-6 text-center py-4 rounded-xl
                       bg-gray-100 hover:bg-gray-200
                       font-semibold text-indigo-500 cursor-pointer"
            >
              Lihat Semua Film
            </div>
          </>
        )}
      </div>
    </div>
  );

}
