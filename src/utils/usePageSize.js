import { useState, useEffect } from "react";

// Column count must stay in sync with the grid classes used in
// CommonList / SearchResults:
//   grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7
function colsForWidth(w) {
  if (w >= 1536) return 7;
  if (w >= 1280) return 6;
  if (w >= 768) return 5;
  if (w >= 640) return 4;
  return 3;
}

// Estimate how many full rows of 2:3 posters fit the viewport, then
// return cols * rows so each page fills the grid without partial rows.
function computePageSize() {
  if (typeof window === "undefined") return 10;

  const w = window.innerWidth;
  const h = window.innerHeight;
  const cols = colsForWidth(w);

  const isMobile = w < 640;
  const gap = isMobile ? 8 : 12;
  const sidePadding = isMobile ? 24 : 48; // px-3 / sm:px-6 on both sides
  const gridWidth = Math.min(w, 1440) - sidePadding; // max-w-[1440px] cap

  const cardWidth = (gridWidth - gap * (cols - 1)) / cols;
  const rowHeight = cardWidth * 1.5 + gap; // poster aspect 2:3 + row gap

  // Reserve space for: sticky header + film strip, the page header
  // (progress bar / filters / title), and the pagination bar below.
  const reserved = 190;
  const available = h - reserved;
  const rows = Math.max(2, Math.floor(available / rowHeight));

  return cols * rows;
}

export function usePageSize() {
  const [pageSize, setPageSize] = useState(computePageSize);

  useEffect(() => {
    const onResize = () => setPageSize(computePageSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return pageSize;
}
