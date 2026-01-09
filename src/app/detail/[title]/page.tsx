"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../utils/firebase";

import { Ticket } from "../../../models/Ticket";
import { Cinema } from "../../../models/Cinema";

import { TicketController } from "../../../controllers/TicketController";
import { CinemaController } from "../../../controllers/CinemaController";

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
  // AUTH CHECK
  // ======================
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

  // ======================
  // MOVIE TITLE (QUERY)
  // ======================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMovieTitle(params.get("title") || "Unknown Movie");
  }, []);

  // ======================
  // FETCH CINEMA (REALTIME VIA FIRESTORE SERVICE)
  // ======================
  useEffect(() => {
    const fetchCinema = async () => {
      try {
        const cinemas = await CinemaController.getCinemas();
        setCinemaList(cinemas);
      } catch (err) {
        console.error("Gagal mengambil cinema", err);
      } finally {
        setLoadingCinema(false);
      }
    };

    fetchCinema();
  }, []);

  // ======================
  // FETCH BOOKED SEATS
  // ======================
  useEffect(() => {
    const fetchSeats = async () => {
      if (!selectedCinema || !selectedTime || !movieTitle) {
        setBookedSeats([]);
        return;
      }

      const seats = await TicketController.getBookedSeats(
        selectedCinema.getId(),
        selectedTime,
        movieTitle
      );

      setBookedSeats(seats);
    };

    fetchSeats();
  }, [selectedCinema, selectedTime, movieTitle]);

  // ======================
  // BOOKING
  // ======================
  const handleBooking = async () => {
    if (!userId || !selectedCinema || !selectedTime || !selectedSeat) {
      alert("Lengkapi semua pilihan!");
      return;
    }

    if (bookedSeats.includes(selectedSeat)) {
      alert("Kursi sudah terisi!");
      return;
    }

    const ticket = new Ticket(
      userId,
      selectedCinema.getId(),
      selectedCinema.getName(),
      movieTitle,
      selectedTime,
      selectedSeat,
      selectedCinema.getPrice()
    );

    await TicketController.bookTicket(ticket);
    router.push("/history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6a65df] to-[#7451e1] p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-purple-600">
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
          <div className="flex flex-col gap-3">
            {cinemaList.map((cinema) => (
              <button
                key={cinema.getId()}
                onClick={() => {
                  setSelectedCinema(cinema);
                  setSelectedSeat("");
                }}
                className={`p-4 border rounded-xl text-left
                  ${selectedCinema?.getId() === cinema.getId()
                    ? "border-purple-500 bg-purple-100"
                    : "border-gray-300"
                  }`}
              >
                <p className="font-semibold text-black">
                  {cinema.getName()}
                </p>
                <p className="text-sm text-gray-500">
                  Rp {cinema.getPrice().toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {cinema.getLocation()}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* JADWAL */}
        <h2 className="font-semibold text-lg mt-6 mb-2 text-black">
          Jadwal Tayang
        </h2>

        <div className="flex gap-3 flex-wrap text-black">
          {times.map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTime(t);
                setSelectedSeat("");
              }}
              className={`px-6 py-2 rounded-xl border
                ${selectedTime === t
                  ? "bg-blue-700 border-blue-700 text-white"
                  : "border-gray-700"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* SEAT */}
        <h2 className="font-semibold text-lg mt-8 mb-3 text-black">
          Pilih Kursi
        </h2>

        <div className="bg-gray-500 text-center py-2 rounded-lg font-semibold mb-6 text-white">
          LAYAR
        </div>

        <div className="flex justify-center">
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
                      className={`w-12 h-12 rounded-lg text-white font-semibold
                        ${isBooked
                          ? "bg-red-500 cursor-not-allowed"
                          : isSelected
                            ? "bg-blue-500"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleBooking}
          className="mt-8 w-full bg-purple-600 text-white p-3 rounded-xl font-bold"
        >
          Pesan Tiket
        </button>

      </div>
    </div>
  );
}
