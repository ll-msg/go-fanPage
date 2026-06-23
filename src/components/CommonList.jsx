import { Pagination } from "antd";
import FilmCards from "./FilmCards";

export default function CommonList({ data, pagedData, page, pageSize, handlePageChange, clickable=true, type="movie" }) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-3 pt-2 pb-4 sm:px-6 sm:pt-4 sm:pb-10">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3">
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