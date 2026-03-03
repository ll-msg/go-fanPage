import { useNavigate } from "react-router-dom";
import { getDisplayTitle, getPosterUrl } from "../utils/poster";

export default function FilmCards({ item }) {
    const navigate = useNavigate();
    const title = getDisplayTitle(item);
    const poster = getPosterUrl(item);
    const placeholder = `${import.meta.env.BASE_URL}posters/placeholder.jpg`

    return(
        <div
            key={`${item.media_type}-${item.id}`}
            className="bg-white/5 rounded-xl overflow-hidden transition-transform w-full cursor-pointer"
            onClick={() => navigate(`/works/${item.id}`)}
        >
            <div className="aspect-[2/3] bg-white/10">
            {poster ? (
                <img src={poster} onError={(e) => {
                e.currentTarget.src = placeholder
                }} alt={title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50">
                No Poster
                </div>
            )}
            </div>

            <div className="p-2 sm:p-3 font-heading">
            <div className="text-black/90 text-sm font-semibold line-clamp-2">
                {title}
            </div>
            <div className="text-black/50 text-xs mt-1">
                {(item.release_date || item.first_air_date || "").slice(0, 4)}
            </div>
            </div>
        </div>
    )
}