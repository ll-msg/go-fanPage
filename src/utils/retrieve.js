let cached = null;
let processing = null;

export async function loadDataFinal() {
  if (cached) return cached;
  if (processing) return processing;

  const url = `${import.meta.env.BASE_URL}data_final.json`;

  processing = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} when fetching ${url}`);
      return r.json();
    })
    .then((data) => {
      cached = data.cast;
      return cached;
    })
    .finally(() => {
      processing = null;
    });

  return processing;
}

export function findMovieInData(list, movieId) {
  return list.find((x) => String(x?.id) === String(movieId)) ?? null;
}