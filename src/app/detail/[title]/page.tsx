"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../utils/firebase";

// ======================
// INTERFACE
// ======================
interface Cinema {
  id: string;
  name: string;
  price: number;
  location: string;
}

// ======================
// CONSTANT
// ======================
const times = ["12:00 WIB", "15:00 WIB", "18:00 WIB", "21:00 WIB"];
const rows = ["A", "B", "C", "D", "E", "F"];
const cols = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BookingPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [cinemaList, setCinemaList] = useState<Cinema[]>([]);
  const [loadingCinema, setLoadingCinema] = useState(true);

  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [movieTitle, setMovieTitle] = useState("");

  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  // ======================
  // AUTH
  // ======================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.uid);
    });

    return () => unsub();
  }, [router]);

  // ======================
  // MOVIE TITLE
  // ======================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMovieTitle(params.get("title") || "Unknown Movie");
  }, []);

  // ======================
  // FETCH CINEMA
  // ======================
  useEffect(() => {
    const fetchCinema = async () => {
      const snap = await getDocs(collection(db, "cinemas"));
      const data: Cinema[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Cinema, "id">),
      }));
      setCinemaList(data);
      setLoadingCinema(false);
    };

    fetchCinema();
  }, []);

  // ======================
  // RESET SEAT
  // ======================
  useEffect(() => {
    setSelectedSeat("");
  }, [selectedCinema, selectedTime]);

  // ======================
  // FETCH BOOKED SEAT
  // ======================
  useEffect(() => {
    if (!selectedCinema || !selectedTime) return;

    const fetchBookedSeats = async () => {
      const q = query(
        collection(db, "tickets"),
        where("cinemaId", "==", selectedCinema.id),
        where("schedule", "==", selectedTime),
        where("filmTitle", "==", movieTitle)
      );

      const snap = await getDocs(q);
      const seats = snap.docs.map((d) => d.data().seat);
      setBookedSeats(seats);
    };

    fetchBookedSeats();
  }, [selectedCinema, selectedTime, movieTitle]);

  // ======================
  // BOOKING
  // ======================
  const handleBooking = async () => {
    if (!userId || !selectedCinema || !selectedTime || !selectedSeat) {
      alert("Lengkapi semua pilihan!");
      return;
    }

    await addDoc(collection(db, "tickets"), {
      userId,
      cinemaId: selectedCinema.id,
      cinemaName: selectedCinema.name,
      filmTitle: movieTitle,
      schedule: selectedTime,
      seat: selectedSeat,
      price: selectedCinema.price,
      orderDate: Timestamp.now(),
    });

    router.push("/history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-600 p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-5 sm:p-8 rounded-2xl shadow-xl">

        {/* HEADER */}
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
          🎬 {movieTitle}
        </h1>
        <p className="text-gray-500 mb-6">Booking tiket film</p>

        {/* CINEMA */}
        <h2 className="font-semibold text-lg mb-2 text-black">
          Pilih Cinema
        </h2>

        {loadingCinema ? (
          <p>Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {cinemaList.map((cinema) => (
              <button
                key={cinema.id}
                onClick={() => setSelectedCinema(cinema)}
                className={`
                  p-4 rounded-xl border text-left transition
                  ${
                    selectedCinema?.id === cinema.id
                      ? "border-purple-500 bg-purple-100"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <p className="font-semibold text-black">{cinema.name}</p>
                <p className="text-sm text-gray-500">
                  📍 {cinema.location}
                </p>
                <p className="text-sm text-purple-600 font-semibold">
                  Rp {cinema.price.toLocaleString("id-ID")}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* JADWAL */}
        <h2 className="font-semibold text-lg mt-6 mb-2 text-black">
          Jadwal Tayang
        </h2>

        <div className="flex gap-2 flex-wrap">
          {times.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium border
                ${
                  selectedTime === t
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>

        {/* SEAT */}
        <h2 className="font-semibold text-lg mt-8 mb-3 text-black">
          Pilih Kursi
        </h2>

        {/* LEGEND */}
        <div className="flex gap-4 text-sm mb-4 text-black">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded" /> Tersedia
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded" /> Dipilih
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded" /> Terisi
          </span>
        </div>

        {/* LAYAR */}
        <div className="bg-gray-500 text-white text-center py-2 rounded-lg font-semibold mb-6">
          LAYAR
        </div>

        {/* SEAT MAP */}
        <div className="overflow-x-auto">
          <div className="min-width: 420px flex justify-center">
            <div className="grid grid-rows-6 gap-3">
              {rows.map((row) => (
                <div key={row} className="grid grid-cols-8 gap-3">
                  {cols.map((col) => {
                    const seat = `${row}${col}`;
                    const isBooked = bookedSeats.includes(seat);
                    const isSelected = selectedSeat === seat;

                    return (
                      <button
                        key={seat}
                        disabled={isBooked}
                        onClick={() => setSelectedSeat(seat)}
                        className={`
                          w-10 h-10 sm:w-12 sm:h-12
                          rounded-lg text-white text-sm font-semibold transition
                          ${
                            isBooked
                              ? "bg-red-500 cursor-not-allowed"
                              : isSelected
                              ? "bg-blue-500"
                              : "bg-green-500 hover:bg-green-600"
                          }
                        `}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          disabled={!selectedSeat}
          onClick={handleBooking}
          className={`
            mt-8 w-full p-3 rounded-xl font-bold text-white transition
            ${
              selectedSeat
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
        >
          🎟️ Pesan Tiket
        </button>
      </div>
    </div>
  );
}
