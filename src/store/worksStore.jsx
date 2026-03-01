import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadDataFinal } from "../utils/retrieve";

const WorksContext = createContext(null);

export function WorksProvider({ children }) {
  const [works, setWorks] = useState([]);// original

  // search
  const [query, setQuery] = useState("");// search query
  const [mediaType, setMediaType] = useState("all"); // all/movie/tv
  const [genre, setGenre] = useState("all");      // all/genre?

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const list = await loadDataFinal();
        if (!cancelled) setWorks(list ?? []);
      } catch (e) {
        console.error("load failed:", e);
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  // sort by date
  const sortedWorks = useMemo(() => {
    return [...works].sort((a, b) =>
      (b.release_date || b.first_air_date || "")
        .localeCompare(a.release_date || a.first_air_date || "")
    );
  }, [works]);

  // filtered works - (title keyword, genre)
  const filteredWorks = useMemo(() => {
    const q = query.trim().toLowerCase();

    return sortedWorks.filter((w) => {
      if (mediaType !== "all" && w.media_type !== mediaType) return false;

      if (genre !== "all") {
        const gs = w.genre || [];
        if (!gs.includes(genre)) return false;
      }

      if (q) {
        const title = (w.title || w.name || "").toLowerCase();
        const orig = (w.original_title || w.original_name || "").toLowerCase();
        if (!title.includes(q) && !orig.includes(q)) return false;
      }

      return true;
    });
  }, [sortedWorks, query, mediaType, genre]);

  const value = {
    works, setWorks,
    sortedWorks,
    filteredWorks,
    query, setQuery,
    mediaType, setMediaType,
    genre, setGenre,
  };

  return <WorksContext.Provider value={value}>{children}</WorksContext.Provider>;
}

export function useWorks() {
  const ctx = useContext(WorksContext);
  if (!ctx) throw new Error("useWorks must be used within WorksProvider");
  return ctx;
}