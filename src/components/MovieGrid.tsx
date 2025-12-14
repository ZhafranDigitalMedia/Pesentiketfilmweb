"use client";

import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Genre: string;
}

const RANDOM_KEYWORDS = [
  "Marvel",
  "Batman",
  "Avengers",
  "Star Wars",
  "Harry Potter",
  "Spider Man",
  "Lord",
  "Matrix",
  "Fast",
  "Mission",
];

export default function MovieGrid() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const [defaultKeyword] = useState(() => {
    const index = Math.floor(Math.random() * RANDOM_KEYWORDS.length);
    return RANDOM_KEYWORDS[index];
  });

  useEffect(() => {
    const search = query || defaultKeyword;

    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=55777ee3&s=${search}`
        );
        const data = await res.json();
        setMovies(data.Search || []);
      } catch (err) {
        console.error(err);
        setMovies([]);
      }
    };

    fetchMovies();
  }, [query, defaultKeyword]);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "28px",
        padding: "28px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
      }}
    >
      <input
        type="text"
        placeholder="Cari judul film..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          border: "1px solid #e5e5e5",
          fontSize: "16px",
          marginBottom: "28px",
          color: "#333",
          outline: "none",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "24px",
        }}
      >
        {movies.map((m) => (
          <MovieCard
            key={m.imdbID}
            id={m.imdbID}            // ✅ DITAMBAHKAN
            title={m.Title}
            img={m.Poster}
            genre="Movie"
            year={Number(m.Year)}
          />
        ))}
      </div>

      {query && movies.length === 0 && (
        <p style={{ textAlign: "center", color: "#777", marginTop: "20px" }}>
          Film tidak ditemukan
        </p>
      )}
    </div>
  );
}
