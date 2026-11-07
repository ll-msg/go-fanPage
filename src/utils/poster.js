export function getDisplayTitle(item) {
  return item?.title || item?.name || item?.original_title || item?.original_name || "暂无标题";
}

// Cover files in public/covers are mostly .jpg but a few are .webp/.png, while
// the data always says .jpg. Return every candidate URL so the card can fall
// back to the next one when a request 404s, ending with the placeholder.
export function getPosterCandidates(item, type="movie") {
  const base = import.meta.env.BASE_URL;
  const placeholder = `${base}posters/placeholder.jpg`;
  if (type == "cover") {
    const match = item.cover_url?.match(/\d+/);
    if (!match) return [placeholder];
    const stem = match[0];
    return [
      `${base}covers/${stem}.jpg`,
      `${base}covers/${stem}.webp`,
      `${base}covers/${stem}.png`,
      placeholder,
    ];
  }
  return [getPosterUrl(item, type), placeholder];
}

export function getPosterUrl(item, type="movie") {
  if (type == "cover") {
    return getPosterCandidates(item, type)[0];
  }
  if (type == "magazine") {
    const match = item.cover_url?.match(/\d+/);
    const fileName = match ? `${match[0]}.jpg` : "placeholder.jpg";
    return `${import.meta.env.BASE_URL}magazine_posters/${fileName}`;
  }
  return `${import.meta.env.BASE_URL}posters/${item.id}.jpg`;
}