import { useNavigate } from "react-router-dom";
import { getDisplayTitle, getPosterUrl } from "../utils/poster";
import { useState } from "react";

export default function FilmCards({ item, clickable=true, type="movie" }) {
    const navigate = useNavigate();
    const title = getDisplayTitle(item);
    const poster = getPosterUrl(item, type);
    const placeholder = `${import.meta.env.BASE_URL}posters/placeholder.jpg`
    const year = (item.release_date || item.first_air_date || "").slice(0, 4);
    const [showFull, setShowFull] = useState(false);

    const handleClick = () => {
        if (clickable) {
            navigate(`/works/${item.id}`)
        }
    }

    const handleTitleClick = (e) => {
        e.stopPropagation();
        setShowFull((v) => !v);
        navigator.clipboard?.writeText?.(title).catch(() => {});
    }

    return(
        <div
            key={`${item.media_type}-${item.id}`}
            className={`group relative aspect-[2/3] overflow-hidden rounded-md bg-neutral-900 cine-frame hover:-translate-y-1 ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={handleClick}
        >
            {poster ? (
                <img src={poster} onError={(e) => {
                e.currentTarget.src = placeholder
                }} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
                <div className="w-full h-full flex items-center justify-center p-2 text-center text-white/55 text-xs font-heading leading-snug">
                    {title || "No Poster"}
                </div>
            )}

            {/* letterbox bar that drops in on hover (desktop) */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-black/0 [@media(hover:hover)]:group-hover:bg-black/85 transition-colors duration-300" />

            {/* title / year overlay — always visible on touch, hover-reveal on desktop */}
            <div className={`pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t ${showFull ? "from-black/90 via-black/70" : "from-black/80 via-black/35"} to-transparent p-2 sm:p-2.5
                            opacity-100 transition-opacity duration-300
                            [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100`}>
                <div
                    className={`pointer-events-auto cursor-pointer font-readable text-white text-xs sm:text-sm font-semibold leading-snug drop-shadow-sm ${showFull ? "" : "line-clamp-2"}`}
                    onClick={handleTitleClick}
                    title="点击复制标题"
                >
                    {title}
                </div>
                {year && (
                    <div className="font-cine tracking-[0.2em] text-white/70 text-[10px] sm:text-xs mt-0.5">
                        {year}
                    </div>
                )}
            </div>
        </div>
    )
}
