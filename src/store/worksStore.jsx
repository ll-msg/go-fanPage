import { create } from "zustand";

export const useWorks = create((set, get) => ({
  works: [],
  initialized: false,

  loadWorks: async () => {
    if (get().initialized) return;

    try {
      const res = await fetch(
        `${import.meta.env.BASE_URL}data_final.json`
      );
      const data = await res.json();

      const sorted = (data.cast || []).sort((a, b) => {
        const dateA = new Date(
          a.release_date || a.first_air_date || 0
        );
        const dateB = new Date(
          b.release_date || b.first_air_date || 0
        );

        return dateB - dateA;
      });

      set({
        works: sorted,
        initialized: true,
      });
    } catch (err) {
      console.error("加载作品数据失败", err);
    }
  },
}));