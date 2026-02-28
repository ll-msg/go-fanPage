import { useEffect, useState, useMemo } from "react";
import { Pagination } from "antd";
import { getDisplayTitle, getPosterUrl } from "../utils/poster.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadDataFinal } from "../utils/retrieve";

const PAGE_SIZE = 8;

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
  const p = Number(searchParams.get("page") || 1);
  if (p !== page) setPage(p);
}, [searchParams, page]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const list = await loadDataFinal();
        if (!cancelled) {
          setMovies(list ?? []);
        }
      } catch (e) {
        console.error("load failed:", e);
        if (!cancelled) setMovies([]);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);
  
  const pagemovies = useMemo(() => {
    const sorted = [...movies].sort((a, b) =>
      (b.release_date || b.first_air_date || "")
        .localeCompare(a.release_date || a.first_air_date || "")
    );

    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [movies, page]);

  return (
    <div className="px-8 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {pagemovies.map((item) => {
          const title = getDisplayTitle(item)
          const poster = getPosterUrl(item)

          return (
            <div
              key={`${item.media_type}-${item.id}`}
              className="bg-white/5 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform max-w-[200px] mx-auto cursor-pointer"
              onClick={() => navigate(`/works/${item.id}`)}
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

              <div className="p-3 text-center text-black text-xl font-body">{title}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination current={page} pageSize={PAGE_SIZE} total={movies.length} showSizeChanger={false} showQuickJumper
          onChange={(p) => {
            setPage(p);
            setSearchParams({ page: String(p) });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}