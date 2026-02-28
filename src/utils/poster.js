export function getDisplayTitle(item) {
  return item?.title || item?.name || item?.original_title || item?.original_name || "暂无标题";
}

export function getPosterUrl(item) {
  if (!item?.id) return "";
  return `${import.meta.env.BASE_URL}posters/${item.id}.jpg`;
}