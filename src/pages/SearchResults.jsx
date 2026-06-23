import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import { useWorks } from "../store/worksStore";
import FilmCards from "../components/FilmCards.jsx";
import { usePageSize } from "../utils/usePageSize.js";


export default function SearchResults() {
  const { works, setScopeIds } = useWorks();
  const [params, setparams] = useSearchParams();
  const pageSize = usePageSize();

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

  const page = Number(params.get("p")) || 1;

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
          w.title || w.name,
          w.original_name || w.original_title,
          w.overview,
          w.character,
          ...(w.genre || []),
          ...(w.tags || []),
          ...((w.cast_full || []).map(p => p?.name).filter(Boolean)),
          ...((w.crew && Object.values(w.crew) || []).flat().filter(Boolean))
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

  // page jump
  const handlePageChange = (p) => {
    setparams((prev) => {
      prev.set("p", p);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // search results ids
  useEffect(() => {
    setScopeIds(filtered.map((work) => String(work.id)));

    if (params.get("p") && params.get("p") !== "1") {
      setparams((prev) => {
        prev.set("p", 1);
          return prev;
      }, { replace: true });
    }
  }, [q, startYear, endYear, tags.join(","), works, types.join(","), setScopeIds])

  const start = (page - 1) * pageSize;
  const pagemovies = filtered.slice(start, start + pageSize);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 py-10">
      <div className="mb-6 font-heading">
        <div className="mt-2 text-black/80">
          <span className="text-xl font-bold tracking-tight">搜索结果</span>
          <span className="text-black/55 ml-3 text-sm">共 <span className="font-cine">{filtered.length}</span> 条</span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3">
        {pagemovies.map((item) => (
          <FilmCards key={item.id} item={item} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filtered.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}