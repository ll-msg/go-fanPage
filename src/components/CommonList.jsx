import { Pagination } from "antd";
import FilmCards from "./FilmCards";

export default function CommonList({ data, pagedData, page, pageSize, handlePageChange, clickable=true, type="movie" }) {
  return (
    <div className="px-3 py-4 sm:px-6 sm:py-10">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
        {pagedData.map((item) => (
          <FilmCards 
            key={item.id} 
            item={item} 
            clickable={clickable} 
            type={type}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination 
          current={page} 
          pageSize={pageSize} 
          total={data.length} 
          showSizeChanger={false} 
          showQuickJumper
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}