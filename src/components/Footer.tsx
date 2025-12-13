"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../assets/cinebook-logo.png";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-[#11254C] text-white pt-10 border-t-4 border-[#1A3A6C]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 pb-10">

        {/* LEFT SECTION */}
        <div>
          <Image src={logo} alt="CineBook Logo" width={80} height={80} />
          <p className="mt-4 text-sm leading-relaxed">
            Best app for movie lovers in Indonesia! <br />
            CineBook memudahkan kamu melihat film terbaru, memilih kursi,
            dan memesan tiket bioskop secara online hanya dengan satu aplikasi.
          </p>
        </div>

        {/* MIDDLE MENU SECTION */}
        <div className="text-sm space-y-2">
          <p
            className="font-semibold cursor-pointer hover:text-[#7EC8E3]"
            onClick={() => router.push("/")}
          >
            NOW SHOWING
          </p>

          <p
            className="font-semibold cursor-pointer hover:text-[#7EC8E3]"
            onClick={() => router.push("/favorite")}
          >
            FAVORITE
          </p>

          <p
            className="font-semibold cursor-pointer hover:text-[#7EC8E3]"
            onClick={() => router.push("/history")}
          >
            RIWAYAT
          </p>
        </div>

        {/* CONTACT SECTION */}
        <div className="text-sm space-y-2">
          <p className="font-semibold">Contact Us</p>
          <p className="font-semibold">Privacy Policy</p>
          <p className="font-semibold">Terms & Conditions</p>
        </div>

        {/* SUPPORT SECTION */}
        <div className="text-sm space-y-3">
          <p className="font-semibold">CINBOOK Support</p>
          <p>E-MAIL: HELP @CINBOOK</p>

          <p className="font-semibold mt-6">Follow Us</p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="bg-[#C3E7F3] py-3 text-center">
        <p className="text-red-600 text-sm font-semibold">
          2025 CINBOOK – PT CineZha Digital. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
