"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

import { Favorite } from "../models/Favorite";
import { FavoriteController } from "../controllers/FavoriteController";

export default function FavoritesPage() {
  const router = useRouter();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // ========================
  // AUTH CHECK
  // ========================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.uid);
    });

    return () => unsub();
  }, [router]);

  // ========================
  // REALTIME FAVORITES
  // ========================
  useEffect(() => {
    if (!userId) return;

    const unsub = FavoriteController.subscribe(userId, setFavorites);
    return () => unsub();
  }, [userId]);

  // ========================
  // DELETE
  // ========================
  const handleDelete = async (id: string) => {
    setDeleting(id);
    await FavoriteController.remove(id);
    setDeleting(null);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="bg-white rounded-3xl p-6 max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
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
                key={fav.getId()}
                className="bg-white rounded-2xl shadow-md p-5 mb-4
                           flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {fav.getFilmTitle()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {fav.getGenre()} • {fav.getYear()}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() =>
                      router.push(
                        `/detail/${encodeURIComponent(
                          fav.getFilmTitle()
                        )}`
                      )
                    }
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Pesan Tiket
                  </button>

                  <button
                    onClick={() => handleDelete(fav.getId())}
                    className="text-2xl"
                  >
                    {deleting === fav.getId() ? "🤍" : "❤️"}
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
