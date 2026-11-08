import { useState } from "react";
import { Link } from "react-router-dom";
import { useWorks } from "../store/worksStore";
import { getPosterCandidates } from "../utils/poster";
import { workKey } from "../utils/magazine.js";

const PREVIEW = 12;

function Cover({ item }) {
  const candidates = getPosterCandidates(item, "cover");
  const [i, setI] = useState(0);
  return (
    <img
      src={candidates[Math.min(i, candidates.length - 1)]}
      onError={() => setI((n) => Math.min(n + 1, candidates.length - 1))}
      alt={`${item.name} ${item.issue || ""}`}
      loading="lazy"
      className="aspect-[3/4] w-full rounded object-cover bg-neutral-200"
    />
  );
}

// Magazines linked to this work (their "works" field in all_magazines.json), oldest first.
export function FilmMagazines({ movie }) {
  const { magazinesByWork } = useWorks();
  const [showAll, setShowAll] = useState(false);
  if (!movie) return null;

  const key = workKey(movie);
  const list = magazinesByWork?.get(key) || [];
  if (list.length === 0) return null;

  const visible = showAll ? list : list.slice(0, PREVIEW);

  return (
    <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-black/80">
          相关杂志 <span className="font-poppins text-black/45">{list.length}</span>
        </h2>
        <Link
          to={`/magazines?work=${encodeURIComponent(key)}&p=1`}
          className="text-sm text-black/55 hover:text-black hover:underline"
        >
          杂志页 →
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-2 gap-y-3">
        {visible.map((m) => (
          <figure key={m.id} className="m-0 min-w-0">
            <Cover item={m} />
            <figcaption className="mt-1 text-[11px] sm:text-xs leading-snug">
              <div className="truncate font-semibold text-black/80" title={m.name}>{m.name}</div>
              <div className="text-black/55">
                {m.issue ? `${m.issue}` : ""}
              </div>
              {m.note && (
                <div className="line-clamp-2 text-black/45" title={m.note}>{m.note}</div>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {list.length > PREVIEW && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="rounded px-3 py-1 text-sm text-black/60 hover:bg-black hover:text-white transition-colors"
          >
            {showAll ? "收起" : `显示全部 ${list.length} 本`}
          </button>
        </div>
      )}
    </section>
  );
}
