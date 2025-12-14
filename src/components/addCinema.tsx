"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function AddCinema() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addDoc(collection(db, "cinemas"), {
        name,
        location,
        price: Number(price),
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Gagal menambahkan cinema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-br p-4 sm:p-8">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 sm:p-10">

        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-6 text-center">
          🎬 Add Cinema
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nama Cinema */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Cinema
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Price (Rp)
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-4 py-2.5 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Saving..." : "Add Cinema"}
          </button>
        </form>
      </div>
    </div>
  );
}
