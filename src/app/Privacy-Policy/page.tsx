"use client";

import Image from "next/image";
import logo from "../../assets/cinebook-logo.png";

import HeaderNav from "../../components/HeaderNav";
import AdminHeaderNav from "../../components/adminHeaderNav";
import Footer from "../../components/Footer";
import PrivacyPolicy from "../../components/Privacy";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";

export default function PrivacyPolicypage() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const snap = await getDoc(doc(db, "users", user.uid));
                if (snap.exists()) {
                    setRole(snap.data().role);
                }
            } catch (err) {
                console.error("Gagal ambil role:", err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    if (loading) return null;

    return (
        <div style={{ background: "#6A77E0", minHeight: "100vh", color: "white" }}>
            {/* HEADER */}
            <header style={{
                padding: "15px 25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
            }}>
                <Image src={logo} alt="CineBook logo" width={100} height={100} />
                <h1 style={{ fontSize: "40px", fontWeight: 700, margin: 0 }}>
                    CineBook
                </h1>
            </header>

            {/* NAVBAR */}
            {role === "admin" ? <AdminHeaderNav /> : <HeaderNav />}

            <PrivacyPolicy />
            <Footer />
        </div>
    );
}
