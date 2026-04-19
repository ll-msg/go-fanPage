export function getDisplayTitle(item) {
  return item?.title || item?.name || item?.original_title || item?.original_name || "暂无标题";
}

export function getPosterUrl(item, type="movie") {
  if (!item?.name) return "";
  if (type == "magazine") {
    const match = item.cover_url?.match(/\d+/);
    const fileName = match ? `${match[0]}.jpg` : "placeholder.jpg";
    return `${import.meta.env.BASE_URL}magazine_posters/${fileName}`;
  }
  return `${import.meta.env.BASE_URL}posters/${item.id}.jpg`;
}