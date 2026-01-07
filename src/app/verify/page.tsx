"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default function VerifyTicketPage() {
    const params = useSearchParams();
    const ticketId = params.get("ticketId");

    const [status, setStatus] = useState<"loading" | "valid" | "used" | "invalid">("loading");

    useEffect(() => {
        if (!ticketId) {
            setStatus("invalid");
            return;
        }

        const verifyTicket = async () => {
            try {
                const ref = doc(db, "tickets", ticketId);
                const snap = await getDoc(ref);

                if (!snap.exists()) {
                    setStatus("invalid");
                    return;
                }

                const data = snap.data();

                if (data.used) {
                    setStatus("used");
                    return;
                }

                // tandai tiket sudah dipakai
                await updateDoc(ref, { used: true });
                setStatus("valid");
            } catch (err) {
                console.error(err);
                setStatus("invalid");
            }
        };

        verifyTicket();
    }, [ticketId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 px-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                {status === "loading" && <p>🔄 Memverifikasi tiket...</p>}

                {status === "valid" && (
                    <>
                        <h1 className="text-2xl font-bold text-green-600 mb-2">✅ Tiket Valid</h1>
                        <p>Silakan masuk ke studio</p>
                    </>
                )}

                {status === "used" && (
                    <>
                        <h1 className="text-2xl font-bold text-yellow-500 mb-2">⚠️ Tiket Sudah Digunakan</h1>
                        <p>Tiket ini tidak bisa dipakai ulang</p>
                    </>
                )}

                {status === "invalid" && (
                    <>
                        <h1 className="text-2xl font-bold text-red-600 mb-2">❌ Tiket Tidak Valid</h1>
                        <p>QR Code tidak dikenali</p>
                    </>
                )}
            </div>
        </div>
    );
}
