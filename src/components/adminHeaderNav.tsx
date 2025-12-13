"use client";

import { useRouter, usePathname } from "next/navigation";

export default function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "14px 18px",
        margin: "20px auto",
        width: "90%",
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        boxShadow: "0 14px 30px rgba(0,0,0,0.1)",
        flexWrap: "wrap",
      }}
    >
      <NavItem
        label="add cinema"
        icon="🎬"
        active={pathname === "/addCinema"}
        onClick={() => router.push("/addCinema")}
      />
      <NavItem
        label="tiket sales"
        icon="🎟️"
        active={pathname === "/tiketsales"}
        onClick={() => router.push("/tiketsales")}
      />
      <NavItem
        label="Profile"
        icon="👤"
        active={pathname === "/profile"}
        onClick={() => router.push("/profile")}
      />
    </div>
  );
}

function NavItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        borderRadius: "14px",
        cursor: "pointer",
        background: active ? "#6C7AE0" : "transparent",
        color: active ? "#fff" : "#6C7AE0",
        fontWeight: 600,
        fontSize: "15px",
        transition: "all 0.2s ease",
      }}
    >
      <span style={{ fontSize: "18px" }}>{icon}</span>
      {label}
    </div>
  );
}
