import { Layout, Tag, Divider } from "antd";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import { FilmVideo } from "../components/FilmVideo";
import { useWorks } from "../store/worksStore";

const { Content } = Layout;

export default function FilmPage() {
  const params = useParams();
  const navigate = useNavigate();
  const url = `${import.meta.env.BASE_URL}posters/${params.id}.jpg`;
  const placeholder = `${import.meta.env.BASE_URL}posters/placeholder.jpg`
  const { works, scopeIds } = useWorks();

  // find prev & next
  const ids = (scopeIds && scopeIds.length > 0) ? scopeIds : (works || []).map((w) => String(w.id));

  const curId = String(params.id);
  const idx = ids.indexOf(curId);

  const prevId = idx > 0 ? ids[idx - 1] : null;
  const nextId = idx >= 0 && idx < ids.length - 1 ? ids[idx + 1] : null;
  const movie = (works || []).find((w) => String(w.id) === curId) || null;

  // arrow style
  const arrowStyle = `
    w-12 h-12
    flex items-center justify-center
    text-4xl
    rounded-xl
    border border-white/20
    bg-black/30
    text-white/90
    backdrop-blur-sm
    transition-all duration-200
    hover:bg-black/60 hover:scale-105
    disabled:opacity-20 disabled:cursor-not-allowed
    z-50
  `

  const leftArrow = "fixed left-4 top-1/2 -translate-y-1/2 " + arrowStyle
  const rightArrow = "fixed right-4 top-1/2 -translate-y-1/2" + arrowStyle

  return (

    <Content className="mx-auto w-full max-w-5xl px-3 sm:px-4 py-6 sm:py-10 font-heading whitespace-pre-line">
      <button type="button" disabled={!prevId} onClick={() => prevId && navigate(`/works/${prevId}`)} className={leftArrow}>
        ‹
      </button>
      <button type="button" disabled={!nextId} onClick={() => nextId && navigate(`/works/${nextId}`)} className={rightArrow}>
        ›
      </button>
      

      {/* poster + info */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-4 md:col-span-3 flex justify-center sm:justify-start">
          <div className="w-[160px] sm:w-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img src={url} onError={(e) => {
              e.currentTarget.src = placeholder
            }} alt="poster" className="w-full h-auto block" loading="lazy"/>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-8 md:col-span-9">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                  {movie?.title || movie?.name} <span className="text-black/60">({movie?.release_date?.split("-")[0] || movie?.first_air_date?.split("-")[0]})</span>
                </h1>
                <div className="mt-5 flex flex-wrap gap-2">
                  {movie?.genre?.map((g, i) => (<Tag key={i}>{g}</Tag>))}
                </div>
              </div>
            </div>

            <Divider className="border-white/10 my-1" />
            
            <div className="text-black/80 leading-7">
              <div className="mb-4">
                <span className="text-black">{movie?.overview}</span> 
              </div>
              <div>
                <span className="text-black/50">原名：</span> {movie?.original_title || movie?.original_name}
              </div>
              <div>
                <span className="text-black/50">绫野刚出演：</span> {movie?.character}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-black/50">角色标签：</span>
                <div className="flex gap-2">
                  {movie?.tags?.map((g, i) => (<Tag key={i}>{g}</Tag>))}
                </div>
              </div>
              <div>
                <span className="text-black/50">导演：</span> {movie?.crew?.Director?.join(" / ") || "-"}
              </div>
              <div>
                <span className="text-black/50">演员：</span> 
                {movie?.cast_full?.slice(0, 5)
                  .map((actor) => actor.name)
                  .join(" / ") || "-"}
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