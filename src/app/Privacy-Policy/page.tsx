"use client";

import Image from "next/image";
import logo from "../../assets/cinebook-logo.png";

import HeaderNav from "../../components/HeaderNav";
import AdminHeaderNav from "../../components/adminHeaderNav";
import Footer from "../../components/Footer";

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
        <div style={{ background: "#6A77E0", minHeight: "100vh" }}>
            {/* HEADER */}
            <header
                style={{
                    padding: "15px 25px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <Image src={logo} alt="CineBook logo" width={100} height={100} />
                <h1 style={{ fontSize: "40px", fontWeight: 700, color: "white", margin: 0 }}>
                    CineBook
                </h1>
            </header>

            {/* NAVBAR */}
            {role === "admin" ? <AdminHeaderNav /> : <HeaderNav />}

            {/* CONTENT */}
            <main
                style={{
                    maxWidth: "1000px",
                    margin: "40px auto",
                    background: "white",
                    color: "#222",
                    padding: "40px",
                    borderRadius: "12px",
                    lineHeight: 1.7,
                }}
            >
                <h1>Privacy Policy</h1>
                <p>Last updated: December 19, 2025</p>

                <p>
                    This Privacy Policy describes Our policies and procedures on the collection,
                    use and disclosure of Your information when You use the Service and tells You
                    about Your privacy rights and how the law protects You.
                </p>

                <p>
                    We use Your Personal data to provide and improve the Service. By using the
                    Service, You agree to the collection and use of information in accordance with
                    this Privacy Policy. This Privacy Policy has been created with the help of the{" "}
                    <a href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank">
                        Privacy Policy Generator
                    </a>.
                </p>

                <h2>Interpretation and Definitions</h2>
                <h3>Interpretation</h3>
                <p>
                    The words whose initial letters are capitalized have meanings defined under
                    the following conditions.
                </p>

                <h3>Definitions</h3>
                <ul>
                    <li><strong>Account</strong> means a unique account created for You.</li>
                    <li><strong>Affiliate</strong> means an entity under common control.</li>
                    <li><strong>Company</strong> refers to CineBook.</li>
                    <li><strong>Cookies</strong> are small files placed on Your device.</li>
                    <li><strong>Country</strong> refers to Indonesia.</li>
                    <li><strong>Device</strong> means any device that can access the Service.</li>
                    <li><strong>Personal Data</strong> is any identifiable information.</li>
                    <li><strong>Service</strong> refers to the Website.</li>
                    <li><strong>Usage Data</strong> refers to data collected automatically.</li>
                    <li>
                        <strong>Website</strong> refers to CineBook, accessible from{" "}
                        <a
                            href="https://pesentiketfilmweb-3lcl.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://pesentiketfilmweb-3lcl.vercel.app/
                        </a>
                    </li>
                </ul>

                <h2>Collecting and Using Your Personal Data</h2>
                <h3>Personal Data</h3>
                <ul>
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Usage Data</li>
                </ul>

                <h3>Tracking Technologies and Cookies</h3>
                <p>
                    We use Cookies and similar tracking technologies to track activity and
                    improve the Service.
                </p>

                <h3>Use of Your Personal Data</h3>
                <ul>
                    <li>To provide and maintain the Service</li>
                    <li>To manage Your Account</li>
                    <li>To contact You</li>
                    <li>For business transfers</li>
                </ul>

                <h3>Security of Your Personal Data</h3>
                <p>
                    While We strive to protect Your data, no method of transmission is 100% secure.
                </p>

                <h2>Children's Privacy</h2>
                <p>
                    Our Service does not address anyone under the age of 13.
                </p>

                <h2>Changes to this Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time.
                </p>

                <h2>Contact Us</h2>
                <p>Email: digitalmedia875@gmail.com</p>
            </main>

            <Footer />
        </div>
    );
}
