// Shared helpers for the two magazine pages (表纸杂 / 杂志).
//
// Both datasets are normalised into the shape FilmCards / CommonList expect
// (id, title, release_date) plus a `ym` field ("YYYY-MM") used for the
// time filter.

// magazines.json: issue_date looks like "2026年1月号 (2025年12月03日発売)"
export function adaptCoverMagazine(item, index) {
  const issueDate = item.issue_date || "";
  const prefix = issueDate.split("(")[0].trim();
  const saleMatch = issueDate.match(/\((\d{4})年(\d{1,2})月/);
  const ym = saleMatch ? `${saleMatch[1]}-${saleMatch[2].padStart(2, "0")}` : "";

  return {
    ...item,
    id: item.id ?? `cover-${index}`,
    title: `${item.name} ${prefix}`.trim(),
    release_date: saleMatch ? saleMatch[1] : "",
    ym,
  };
}

// Key used in a magazine's "works" field: "<media_type>:<id>".
export function workKey(work) {
  return `${work.media_type}:${work.id}`;
}

// all_magazines.json: issue_date is "YYYY-MM-DD", issue is e.g. "2017年2月号".
// `worksByKey` resolves the linked work keys into {key, id, title} for display.
export function adaptAllMagazine(item, index, worksByKey) {
  const issueDate = item.issue_date || "";
  const workLinks = (item.works || [])
    .map((key) => worksByKey?.get(key))
    .filter(Boolean)
    .map((w) => ({ key: workKey(w), id: w.id, title: w.title || w.name }));
  return {
    ...item,
    id: item.id ?? `all-${index}`,
    title: `${item.name} ${item.issue || ""}`.trim(),
    release_date: issueDate,
    ym: issueDate.slice(0, 7),
    workLinks,
  };
}

// Read the magazine filter out of URLSearchParams.
export function readMagazineFilter(params) {
  return {
    name: (params.get("name") || "").trim(),
    from: (params.get("from") || "").trim(), // YYYY-MM
    to: (params.get("to") || "").trim(),     // YYYY-MM
    work: (params.get("work") || "").trim(), // work key, e.g. "movie:262650"
  };
}

export function hasMagazineFilter({ name, from, to, work }) {
  return Boolean(name || from || to || work);
}

// `name` matches magazine names case-insensitively as a substring, so typing
// "TV" finds "TV LIFE", "TVstation", "月刊TVガイド" at once. `from`/`to` are
// inclusive "YYYY-MM" bounds compared against the item's `ym`.
export function filterMagazines(items, { name, from, to, work }) {
  const needle = (name || "").toLowerCase();
  return (items || []).filter((item) => {
    if (needle && !(item.name || "").toLowerCase().includes(needle)) return false;
    if (work && !(item.works || []).includes(work)) return false;
    if (from || to) {
      if (!item.ym) return false;
      if (from && item.ym < from) return false;
      if (to && item.ym > to) return false;
    }
    return true;
  });
}

// Distinct magazine names in alphabetical order (case-insensitive, Latin
// before kana/kanji) for the picker options.
export function magazineNameOptions(items) {
  const counts = new Map();
  for (const item of items || []) {
    if (!item.name) continue;
    counts.set(item.name, (counts.get(item.name) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "ja", { sensitivity: "base" }))
    .map(([name, count]) => ({ value: name, label: `${name}（${count}）` }));
}

// Works that have at least one linked magazine, newest release first, for the
// "按作品" picker. Labels carry the year and magazine count.
export function magazineWorkOptions(works, magazinesByWork) {
  if (!magazinesByWork?.size) return [];
  return (works || [])
    .filter((w) => magazinesByWork.has(workKey(w)))
    .map((w) => {
      const year = (w.release_date || w.first_air_date || "").slice(0, 4);
      const title = w.title || w.name;
      return {
        value: workKey(w),
        label: `${title}${year ? ` (${year})` : ""}（${magazinesByWork.get(workKey(w)).length}）`,
        search: `${title} ${w.original_title || w.original_name || ""}`.toLowerCase(),
      };
    });
}
