import { useState, useMemo } from "react";
import { Pagination } from "antd";
import { getDisplayTitle, getPosterUrl } from "../utils/poster.js";
import { useNavigate } from "react-router-dom";
import { useWorks } from "../store/worksStore";

const PAGE_SIZE = 8;

export default function Home() {
  const { works } = useWorks();
  const [page, setPage] = useState(1);
  
  const navigate = useNavigate();
  
  const pagemovies = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return (works || []).slice(start, start + PAGE_SIZE);
  }, [works, page]);

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

              <div className="p-3 font-heading">
                <div className="text-black/90 text-sm font-semibold line-clamp-2">
                  {title}
                </div>
                <div className="text-black/50 text-xs mt-1">
                  {(item.release_date || item.first_air_date || "").slice(0, 4)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination current={page} pageSize={PAGE_SIZE} total={works.length} showSizeChanger={false} showQuickJumper
          onChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}