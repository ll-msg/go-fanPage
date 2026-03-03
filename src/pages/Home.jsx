import { useState, useMemo } from "react";
import { Pagination } from "antd";
import { useWorks } from "../store/worksStore";
import FilmCards from "../components/FilmCards.jsx";

const PAGE_SIZE = 10;

export default function Home() {
  const { works } = useWorks();
  const [page, setPage] = useState(1);

  
  const pagemovies = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return (works || []).slice(start, start + PAGE_SIZE);
  }, [works, page]);

  return (
    <div className="px-3 py-6 sm:px-6 sm:py-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
        {pagemovies.map((item) => (
          <FilmCards key={item.id} item={item} />
        ))}
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