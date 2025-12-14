"use client";
import React from "react";

export default function SearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      <input
        type="text"
        placeholder="Cari judul film..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "70%",
          padding: "15px",
          borderRadius: "12px",
          border: "none",
          background: "#fff",
          fontSize: "18px",
          color: "#333",
        }}
      />
    </div>
  );
}
