import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import { useWorks } from "../store/worksStore";
import FilmCards from "../components/FilmCards.jsx";

export default function SearchResults() {
  const { works, setScopeIds } = useWorks();
  const [params] = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    window.innerWidth < 640 ? 9 : 10
  );

  const q = (params.get("q") || "").trim();
  const keyword = q.toLowerCase();
  const startYear = params.get("startYear") || "";
  const endYear = params.get("endYear") || "";
  const tags = (params.get("tags") || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  const types = (params.get("types") || "movie,tv,stage")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
  const isLead = params.get("isLead") === "1";

  const filtered = (works || []).filter(w => {
      // year
      if (startYear && endYear) {
        const year = Number((w.release_date || w.first_air_date || "").slice(0, 4));
        if (!year) return false;
        const start = Number(startYear);
        const end = Number(endYear);
        if (year < start || year > end) return false;
      }

      // tag
      if (tags.length) {
        const wtags = w.tags || [];
        const hitAny = tags.some(t => wtags.includes(t));
        if (!hitAny) return false;
      }

      // keyword
      if (keyword) {
        const haystack = [
          w.title,
          w.original_name || w.original_title,
          w.overview,
          w.character,
          ...(w.genre || []),
          ...(w.tags || []),
          ...((w.cast_full || []).map(p => p?.name).filter(Boolean)),
        ]
        .filter(Boolean).join(" ").toLowerCase();

        if (!haystack.includes(keyword)) return false;
      }

      // tv/movie/stage
      if (types.length) {
        if (!types.includes(w.media_type)) return false;
      }

      // lead
      if (isLead && !w.is_lead) {
        return false;
      }

      return true;
  });

  // page size
  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 640 ? 9 : 10);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  // search results ids
  useEffect(() => {
    setScopeIds(filtered.map((work) => String(work.id)));
  }, [q, startYear, endYear, tags.join(","), works, types.join(","), setScopeIds])

  const start = (page - 1) * pageSize;
  const pagemovies = filtered.slice(start, start + pageSize);

  return (
    <div className="px-8 py-10">
      <div className="mb-4 text-black/80 font-heading">
        <span className="font-semibold">搜索结果：</span>
        <span className="text-black/60 ml-2">共 {filtered.length} 条</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
        {pagemovies.map((item) => (
          <FilmCards key={item.id} item={item} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filtered.length}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}