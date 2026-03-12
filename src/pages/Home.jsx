import { useState, useMemo, useEffect } from "react";
import { Pagination } from "antd";
import { useWorks } from "../store/worksStore";
import FilmCards from "../components/FilmCards.jsx";

export default function Home() {
  const { works } = useWorks();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    window.innerWidth < 640 ? 9 : 10
  );
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 640 ? 9 : 10);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  const watchedIds = JSON.parse(localStorage.getItem("watched") || "[]");
  const watchedCount = watchedIds.length;
  const totalCount = works?.length || 0;
  const progress = totalCount ? (watchedCount / totalCount) * 100 : 0;

  const filteredMovies = useMemo(() => {
    if (filter === "watched") {
      return works.filter(w => watchedIds.includes(String(w.id)));
    }
    if (filter === "unwatched") {
      return works.filter(w => !watchedIds.includes(String(w.id)));
    }
    return works;
  }, [works, watchedIds, filter])

  // pagination
  const pagemovies = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (filteredMovies || []).slice(start, start + pageSize);
  }, [filteredMovies, page, pageSize]);

  const changeFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        
        <div className="mb-3 font-heading">
          <div className="text-sm text-black/70 mb-3">
            已看 {watchedCount} / {totalCount}，补完进度 {progress.toFixed(1)}%
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all"style={{ width: `${progress}%` }}/>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <button onClick={() => changeFilter("all")} className={`px-2 py-1 rounded ${filter === "all" ? "bg-black text-white" : "text-black/60"}`}>
            全部
          </button>
          <button onClick={() => changeFilter("watched")} className={`px-2 py-1 rounded ${filter === "watched" ? "bg-black text-white" : "text-black/60"}`}>
            已看
          </button>
          <button onClick={() => changeFilter("unwatched")} className={`px-2 py-1 rounded ${filter === "unwatched" ? "bg-black text-white" : "text-black/60"}`}>
            未看
          </button>
        </div>

      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
        {pagemovies.map((item) => (
          <FilmCards key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination current={page} pageSize={pageSize} total={filteredMovies.length} showSizeChanger={false} showQuickJumper
          onChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}