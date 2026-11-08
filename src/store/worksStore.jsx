import { create } from "zustand";

export const useWorks = create((set, get) => ({
  works: [],
  magazines: [],
  allMagazines: [],
  magazinesByWork: new Map(),
  initialized: false,
  magazinesInitialized: false,
  allMagazinesInitialized: false,

  // for search reuslts
  scopeIds: [],
  setScopeIds: (ids) => set({ scopeIds: ids || [] }),
  clearScopeIds: () => set({ scopeIds: [] }),

  loadWorks: async () => {
    if (get().initialized) return;

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data_final.json`);
      const data = await res.json();

      const sorted = (data.cast || []).sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || 0);
        const dateB = new Date(b.release_date || b.first_air_date || 0);
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

  loadMagazines: async () => {
    if (get().magazinesInitialized) return;
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}magazines.json`);
      const data = await res.json();
      
      set({
        magazines: data,
        magazinesInitialized: true,
      });
    } catch (err) {
      console.error("加载杂志数据失败", err);
    }
  },

  loadAllMagazines: async () => {
    if (get().allMagazinesInitialized) return;
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}all_magazines.json`);
      const data = await res.json();

      // Entries carry no id; derive one from the cover file number, falling
      // back to the array index. Work links ("works": ["movie:123"], plus
      // kind / note / photographer / pages) are written on the entries by hand.
      const withIds = (data || []).map((item, i) => {
        const match = item.cover_url?.match(/\d+/);
        return {
          ...item,
          id: match ? Number(match[0]) : `idx-${i}`,
          works: item.works || [],
        };
      });
      withIds.sort((a, b) => (a.issue_date < b.issue_date ? 1 : a.issue_date > b.issue_date ? -1 : 0));

      // work key ("movie:262650") -> magazines, oldest first
      const magazinesByWork = new Map();
      for (const item of withIds) {
        for (const w of item.works) {
          if (!magazinesByWork.has(w)) magazinesByWork.set(w, []);
          magazinesByWork.get(w).push(item);
        }
      }
      for (const list of magazinesByWork.values()) list.reverse();

      set({
        allMagazines: withIds,
        magazinesByWork,
        allMagazinesInitialized: true,
      });
    } catch (err) {
      console.error("加载全部杂志数据失败", err);
    }
  }
}));