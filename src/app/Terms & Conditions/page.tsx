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

export default function TermsConditionsPage() {
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
                        Terms and Conditions
                    </h1>
                    <p style={{ color: "#6b7280" }}>
                        Last updated: December 21, 2025
                    </p>
                </div>

                <p>Please read these terms and conditions carefully before using Our Service.</p>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Interpretation and Definitions</h2>

                    <h3 style={subTitle}>Interpretation</h3>
                    <p>
                        The words whose initial letters are capitalized have meanings defined
                        under the following conditions.
                    </p>

                    <h3 style={subTitle}>Definitions</h3>
                    <ul style={listStyle}>
                        <li><strong>Affiliate</strong> – Entity under common control.</li>
                        <li><strong>Country</strong> – Indonesia.</li>
                        <li><strong>Company</strong> – CineBook.</li>
                        <li><strong>Device</strong> – Any device accessing the Service.</li>
                        <li><strong>Service</strong> – The Website.</li>
                        <li><strong>Website</strong> – CineBook.</li>
                        <li><strong>You</strong> – The user of the Service.</li>
                    </ul>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Acknowledgment</h2>
                    <p>
                        These Terms and Conditions govern the use of this Service and set out
                        the rights and obligations of all users.
                    </p>
                    <p>
                        By accessing or using the Service, You agree to be bound by these
                        Terms and Conditions.
                    </p>
                    <p>You must be at least 18 years old to use the Service.</p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Links to Other Websites</h2>
                    <p>
                        Our Service may contain links to third-party websites not owned or
                        controlled by the Company.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Termination</h2>
                    <p>
                        We may terminate or suspend access immediately without prior notice
                        if You breach these Terms.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, the Company shall not be
                        liable for any indirect or consequential damages.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Governing Law</h2>
                    <p>
                        These Terms shall be governed by the laws of Indonesia.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Changes to These Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time.
                    </p>
                </section>

                <hr style={{ margin: "40px 0" }} />

                <section>
                    <h2 style={sectionTitle}>Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, contact us at:
                        <br />
                        <strong>digitalmedia875@gmail.com</strong>
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
