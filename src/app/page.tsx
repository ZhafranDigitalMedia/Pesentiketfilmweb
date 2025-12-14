"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

import { auth } from "../utils/firebase";
import logo from "../assets/cinebook-logo.png";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return <div className="text-white text-2xl">Loading...</div>;
  }

  return <div>HOME PAGE</div>;
}
