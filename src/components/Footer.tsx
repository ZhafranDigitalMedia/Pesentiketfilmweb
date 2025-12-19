"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
} from "lucide-react";

import logo from "../assets/cinebook-logo.png";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-[#0E1F3F] text-white border-t border-white/10">
      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <Image src={logo} alt="CineBook Logo" width={90} height={90} />
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            CineBook adalah platform pemesanan tiket bioskop online
            yang memudahkan kamu memilih film, jadwal, dan kursi
            dengan cepat & nyaman.
          </p>
        </div>

        {/* MENU */}
        <div className="space-y-3 text-sm">
          <h4 className="font-semibold text-base mb-2">Menu</h4>

          <p
            className="cursor-pointer text-white/80 hover:text-[#7EC8E3]"
            onClick={() => router.push("/")}
          >
            Now Showing
          </p>
          <p
            className="cursor-pointer text-white/80 hover:text-[#7EC8E3]"
            onClick={() => router.push("/favorite")}
          >
            Favorite
          </p>
          <p
            className="cursor-pointer text-white/80 hover:text-[#7EC8E3]"
            onClick={() => router.push("/history")}
          >
            Riwayat
          </p>
          <p
            className="cursor-pointer text-white/80 hover:text-[#7EC8E3]"
            onClick={() => router.push("/profile")}
          >
            Profile
          </p>
        </div>

        {/* LEGAL */}
        <div className="space-y-3 text-sm">
          <h4 className="font-semibold text-base mb-2">Legal</h4>

          <p className="cursor-pointer text-white/80 hover:text-[#7EC8E3]"
            onClick={() => router.push("/Privacy-Policy")}
          >
            Privacy Policy
          </p>
          <p className="cursor-pointer text-white/80 hover:text-[#7EC8E3]">
            Terms & Conditions
          </p>
          <p className="cursor-pointer text-white/80 hover:text-[#7EC8E3]">
            Help Center
          </p>
        </div>

        {/* CONTACT */}
        <div className="space-y-4 text-sm">
          <h4 className="font-semibold text-base">Contact</h4>

          <div className="flex items-center gap-2 text-white/80">
            <Mail size={16} />
            <span>help@cinebook.id</span>
          </div>

          {/* SOCIAL */}
          <div className="mt-4">
            <p className="font-semibold mb-3">Follow Us</p>
            <div className="flex gap-4">
              <Facebook className="cursor-pointer hover:text-[#7EC8E3]" />
              <Instagram className="cursor-pointer hover:text-[#7EC8E3]" />
              <Twitter className="cursor-pointer hover:text-[#7EC8E3]" />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="bg-[#C3E7F3] py-3 text-center">
        <p className="text-[#0E1F3F] text-sm font-semibold">
          © 2025 CineBook – PT CineZha Digital. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
