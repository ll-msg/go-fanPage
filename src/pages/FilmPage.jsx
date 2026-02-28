import { Layout, Tag, Button, Divider } from "antd";
import "./index.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FilmVideo } from "../components/FilmVideo";
import { loadDataFinal, findMovieInData } from "../utils/retrieve";

const { Header, Content } = Layout;

export default function FilmPage() {
  const params= useParams();
  const url = `${import.meta.env.BASE_URL}posters/${params.id}.jpg`;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const list = await loadDataFinal();
        const found = findMovieInData(list, params.id);

        if (!cancelled) {
          setMovie(found);
        }
      } catch (e) {
        console.error("load failed:", e);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [params.id]);



  return (

      <Content className="mx-auto w-full max-w-5xl px-4 py-6 font-heading">
        {/* 豆瓣上半部分：海报 + 右侧信息 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 左：海报 */}
        <div className="col-span-12 sm:col-span-4 md:col-span-3">
          <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img
              src={url}
              alt="poster"
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
        </div>

        {/* 右：标题 / 基本信息 / 评分 */}
        <div className="col-span-12 sm:col-span-8 md:col-span-9">
          {/* 标题区 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                  {movie?.title || movie?.name} <span className="text-black/60">({movie?.release_date?.split("-")[0] || movie?.first_air_date?.split("-")[0]})</span>
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  {movie?.genre?.map((g, i) => (<Tag key={i}>{g}</Tag>))}
                </div>
              </div>
            </div>

            <Divider className="border-white/10 my-4" />

            {/* 基本信息（豆瓣右侧那串） */}
            <div className="text-black/80 leading-7">
              <div className="mb-4">
                <span className="text-black">{movie?.overview}</span> 
              </div>
              <div>
                <span className="text-black/50">绫野刚出演：</span> {movie?.character}
              </div>
              <div>
                <span className="text-black/50">导演：</span> {movie?.crew["Director"]}
              </div>
              <div>
                <span className="text-black/50">演员：</span> 
                {movie?.cast_full?.slice(0, 5)
                  .map((actor) => actor.name)
                  .join(" / ")}
              </div>
              <div>
                <span className="text-black/50">上映日期：</span> {movie?.release_date || movie?.first_air_date}
              </div>
            </div>

            <FilmVideo movie={movie} />

          </div>
        </div>
      </div>

      </Content>
  );
}