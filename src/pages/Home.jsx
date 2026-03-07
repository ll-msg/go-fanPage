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

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 640 ? 9 : 10);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  
  const pagemovies = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (works || []).slice(start, start + pageSize);
  }, [works, page, pageSize]);

  return (
    <div className="px-3 py-6 sm:px-6 sm:py-10">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
        {pagemovies.map((item) => (
          <FilmCards key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination current={page} pageSize={pageSize} total={works.length} showSizeChanger={false} showQuickJumper
          onChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}