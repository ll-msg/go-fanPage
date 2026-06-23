import { useWorks } from "../store/worksStore";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CommonList from "../components/CommonList.jsx";
import { usePageSize } from "../utils/usePageSize.js";

export default function Magazine() {
    const { magazines } = useWorks();
    const [searchParams, setSearchParams] = useSearchParams();

    const pageSize = usePageSize();

    // adapt magazine name
    const adaptedMagazines = useMemo(() => {
        return (magazines || []).map(item => {
            const prefix = item.issue_date?.split('(')[0] || "";
            const yearMatch = item.issue_date?.match(/\((\d{4})年/);
            const year = yearMatch ? yearMatch[1] : "";
            
            return {
                ...item,
                title: `${item.name} ${prefix}`.trim(), 
                release_date: year
            };
        });
    }, [magazines]);

    const page = Number(searchParams.get("p")) || 1;
    const handlePageChange = (p) => {
        setSearchParams((prev) => {
          prev.set("p", p);
          return prev;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const pagemagazines = useMemo(() => {
        const start = (page - 1) * pageSize;
        return (adaptedMagazines || []).slice(start, start + pageSize);
    }, [adaptedMagazines, page, pageSize]);
    
    return (
        <div className="flex min-h-[calc(100vh-90px)] flex-col items-center justify-center">
            <CommonList data={adaptedMagazines} pagedData={pagemagazines} page={page} pageSize={pageSize} handlePageChange={handlePageChange} clickable={false} type="magazine" />
        </div>
    )
}