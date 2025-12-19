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
    const sectionTitle = {
        fontSize: "24px",
        fontWeight: 700,
        marginBottom: "16px",
    };

    const subTitle = {
        fontSize: "18px",
        fontWeight: 600,
        marginTop: "20px",
    };

    const listStyle = {
        paddingLeft: "20px",
        marginTop: "10px",
    };


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
                    maxWidth: "960px",
                    margin: "50px auto",
                    background: "white",
                    color: "#1f2937",
                    padding: "50px",
                    borderRadius: "16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    lineHeight: 1.8,
                    fontSize: "15px",
                }}
            >
                {/* TITLE */}
                <div style={{ marginBottom: "30px" }}>
                    <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "10px" }}>
                        Privacy Policy
                    </h1>
                    <p style={{ color: "#6b7280" }}>
                        Last updated: December 19, 2025
                    </p>
                </div>

                <section>
                    <p>
                        This Privacy Policy describes Our policies and procedures on the
                        collection, use, and disclosure of Your information when You use the
                        Service and tells You about Your privacy rights and how the law
                        protects You.
                    </p>

                    <p>
                        By using the Service, You agree to the collection and use of
                        information in accordance with this Privacy Policy. This document was
                        generated with the help of the{" "}
                        <a
                            href="https://www.termsfeed.com/privacy-policy-generator/"
                            target="_blank"
                            style={{ color: "#4f46e5", fontWeight: 600 }}
                        >
                            Privacy Policy Generator
                        </a>.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Interpretation & Definitions</h2>

                    <h3 style={subTitle}>Interpretation</h3>
                    <p>
                        Words with capitalized initial letters have meanings defined under
                        the following conditions.
                    </p>

                    <h3 style={subTitle}>Definitions</h3>
                    <ul style={listStyle}>
                        <li><strong>Account</strong> – A unique account created for You.</li>
                        <li><strong>Affiliate</strong> – An entity under common control.</li>
                        <li><strong>Company</strong> – CineBook.</li>
                        <li><strong>Cookies</strong> – Small files stored on Your device.</li>
                        <li><strong>Country</strong> – Indonesia.</li>
                        <li><strong>Device</strong> – Any device accessing the Service.</li>
                        <li><strong>Personal Data</strong> – Identifiable information.</li>
                        <li><strong>Usage Data</strong> – Data collected automatically.</li>
                    </ul>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Collecting and Using Your Personal Data</h2>

                    <h3 style={subTitle}>Personal Data</h3>
                    <ul style={listStyle}>
                        <li>Email address</li>
                        <li>First name and last name</li>
                        <li>Phone number</li>
                        <li>Usage Data</li>
                    </ul>

                    <h3 style={subTitle}>Tracking Technologies & Cookies</h3>
                    <p>
                        We use Cookies and similar technologies to track activity and improve
                        user experience.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Use of Your Personal Data</h2>
                    <ul style={listStyle}>
                        <li>To provide and maintain the Service</li>
                        <li>To manage Your account</li>
                        <li>To contact You</li>
                        <li>For business transfers</li>
                    </ul>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Security</h2>
                    <p>
                        We take reasonable measures to protect Your data, but no system is
                        100% secure.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Children’s Privacy</h2>
                    <p>
                        Our Service does not address anyone under the age of 13.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Updates will be
                        posted on this page.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Contact Us</h2>
                    <p>
                        If you have any questions, contact us at:
                        <br />
                        <strong>digitalmedia875@gmail.com</strong>
                    </p>
                </section>
            </main>


            <Footer />
        </div>
    );
}
