import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Tag } from "antd";
import CommonList from "./CommonList.jsx";
import { usePageSize } from "../utils/usePageSize.js";
import { filterMagazines, hasMagazineFilter, readMagazineFilter } from "../utils/magazine.js";

// Paged magazine grid with the name / time filter read from the URL
// (?name=…&from=YYYY-MM&to=YYYY-MM). Used by both 表纸杂 and 杂志.
export default function MagazineBrowser({ items, type }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = usePageSize();

  const { name, from, to } = readMagazineFilter(searchParams);
  const active = hasMagazineFilter({ name, from, to });

  const filtered = useMemo(
    () => filterMagazines(items, { name, from, to }),
    [items, name, from, to]
  );

  const page = Number(searchParams.get("p")) || 1;
  const handlePageChange = (p) => {
    setSearchParams((prev) => {
      prev.set("p", p);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const removeKeys = (keys) => {
    setSearchParams((prev) => {
      keys.forEach((k) => prev.delete(k));
      prev.set("p", "1");
      return prev;
    });
  };

  const rangeLabel = from && to
    ? `${from} ~ ${to}`
    : from ? `${from} 起` : to ? `至 ${to}` : "";

  const tagClass = "!m-0 !rounded-full !px-3 !py-0.5 !bg-black !text-white !border-black [&_.ant-tag-close-icon]:!text-white/70";

  return (
    <div className="flex min-h-[calc(100vh-90px)] w-full flex-col items-center">
      {active && (
        <div className="mx-auto w-full max-w-[1440px] px-3 pt-4 sm:px-6 sm:pt-6 font-heading">
          <div className="flex flex-wrap items-center gap-2 text-sm text-black/70">
            {name && (
              <Tag closable onClose={(e) => { e.preventDefault(); removeKeys(["name"]); }} className={tagClass}>
                杂志名：{name}
              </Tag>
            )}
            {rangeLabel && (
              <Tag closable onClose={(e) => { e.preventDefault(); removeKeys(["from", "to"]); }} className={tagClass}>
                时间：{rangeLabel}
              </Tag>
            )}
            <span className="text-black/55">共 <span className="font-cine">{filtered.length}</span> 条</span>
            <button
              onClick={() => removeKeys(["name", "from", "to"])}
              className="ml-auto px-2 py-1 rounded text-black/60 hover:bg-black hover:text-white transition-colors"
            >
              清除筛选
            </button>
          </div>
        </div>
      )}

      {active && filtered.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-black/50 font-heading">没有符合条件的杂志</div>
      ) : (
        <div className={`flex w-full flex-1 flex-col ${active ? "justify-start" : "justify-center"}`}>
          <CommonList
            data={filtered}
            pagedData={paged}
            page={page}
            pageSize={pageSize}
            handlePageChange={handlePageChange}
            clickable={false}
            type={type}
          />
        </div>
      )}
    </div>
  );
}
