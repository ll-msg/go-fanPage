import { useState, useMemo, useEffect } from "react";
import { useWorks } from "../store/worksStore";
import { useSearchParams } from "react-router-dom";
import CommonList from "../components/CommonList.jsx";

export default function Home() {
  const { works } = useWorks();
  const [pageSize, setPageSize] = useState(
    window.innerWidth < 640 ? 9 : 10
  );
  const [filter, setFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("p")) || 1;

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


  // page change
  const handlePageChange = (p) => {
    setSearchParams((prev) => {
      prev.set("p", p);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeFilter = (f) => {
    setFilter(f);
    setSearchParams((prev) => {
      prev.set("p", 1);
      return prev;
    });
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

      <CommonList data={filteredMovies} pagedData={pagemovies} page={page} pageSize={pageSize} handlePageChange={handlePageChange} />
    </div>
  );
}