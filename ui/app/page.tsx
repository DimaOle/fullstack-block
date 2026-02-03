"use client";

import { useState, useEffect } from "react";
import SongCard from "./components/SongCard";

export default function HomePage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Запрос идет СРАЗУ, без условий
        const response = await fetch("http://localhost:3000/api/song/getAll", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSongs(data);
        }
      } catch (error) {
        console.error("Error loading songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-10 text-gray-900">Feed</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {songs.map((song: any) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}