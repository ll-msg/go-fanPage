export function FilmVideo({ movie }) {
  if (!movie) return null;

  const groups = [
    { key: "making", label: "制作花絮", items: movie.making ?? [] },
    { key: "stage", label: "舞台活动", items: movie.stage ?? [] },
    { key: "others", label: "其他", items: movie.others ?? [] },
  ];

  const hasAny = groups.some(g => g.items.length > 0);
  if (!hasAny) return null;

  return (
    <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
      <h2 className="text-base font-semibold text-black/80">相关视频</h2>

      <div className="mt-3 space-y-5">
        {groups.map(g =>
          g.items.length > 0 ? (
            <div key={g.key}>
              <div className="text-sm font-semibold text-black/70">
                {g.label}
              </div>

              <ul className="mt-2 space-y-2">
                {g.items.map((v, idx) => (
                  <li key={`${v.link}-${idx}`}>
                    <a href={v.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                      {v.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}