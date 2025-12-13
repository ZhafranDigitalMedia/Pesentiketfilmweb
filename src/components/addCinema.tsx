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

      router.push("/"); // atau /admin/cinema
    } catch (err) {
      console.error(err);
      setError("Gagal menambahkan cinema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6 flex justify-center">
      <div className="bg-white w-full max-w-4xl p-12 rounded-3xl shadow-xl">

        <h1 className="text-3xl font-bold text-indigo-600 mb-10 text-center">
          Add Cinema
        </h1>

        <div className="bg-gray-50 p-10 rounded-2xl shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Nama Cinema */}
            <div>
              <label className="text-black font-semibold">Nama Cinema</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-lg text-black"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-black font-semibold">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-lg text-black"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-black font-semibold">Price</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full mt-1 px-4 py-3 border rounded-lg text-black"
              />
            </div>

            {error && (
              <p className="text-red-600 text-center text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Loading..." : "Add Cinema"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
