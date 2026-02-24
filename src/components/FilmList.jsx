import { useEffect, useState, useMemo } from "react";
import { Pagination } from "antd";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const PAGE_SIZE = 8;

export default function FilmList() {
  const [films, setFilms] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data_final.json`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setFilms(data.cast ?? []);
        setPage(1);
      })
      .catch((e) => {
        console.error("load json failed:", e);
        setFilms([]);
      });
  }, []);
  
  const pageFilms = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return films.slice(start, start + PAGE_SIZE);
  }, [films, page]);

  return (
    <div className="px-8 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {pageFilms.map((item) => {
          const title = item.name || item.title || "Untitled";
          const poster = item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null;

          return (
            <div
              key={`${item.media_type}-${item.id}`}
              className="bg-white/5 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform max-w-[200px] mx-auto"
            >
              <div className="aspect-[2/3] bg-white/10">
                {poster ? (
                  <img src={poster} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    No Poster
                  </div>
                )}
              </div>

              <div className="p-3 text-center text-black text-xl">{title}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination current={page} pageSize={PAGE_SIZE} total={films.length} showSizeChanger={false} showQuickJumper
          onChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}