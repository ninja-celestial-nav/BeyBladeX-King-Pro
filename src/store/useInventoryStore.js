import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useInventoryStore = create(
  persist(
    (set, get) => ({
      inventory: {},
      favorites: [],
      savedDecks: [],
      currentDeck: {
        slot1: { blade: null, ratchet: null, bit: null, role: '先鋒' },
        slot2: { blade: null, ratchet: null, bit: null, role: '中堅' },
        slot3: { blade: null, ratchet: null, bit: null, role: '大將' },
      },

      // === 武器庫操作 ===
      addPart: (partId, qty = 1) => set(state => ({
        inventory: { ...state.inventory, [partId]: (state.inventory[partId] || 0) + qty }
      })),
      removePart: (partId) => set(state => {
        const next = { ...state.inventory }; delete next[partId]; return { inventory: next };
      }),
      updateQuantity: (partId, qty) => set(state => {
        if (qty <= 0) { const next = { ...state.inventory }; delete next[partId]; return { inventory: next }; }
        return { inventory: { ...state.inventory, [partId]: qty } };
      }),
      clearInventory: () => set({ inventory: {} }),
      bulkAddParts: (partIds) => set(state => {
        const next = { ...state.inventory };
        partIds.forEach(id => { next[id] = (next[id] || 0) + 1; });
        return { inventory: next };
      }),
      getPartCount: (partId) => get().inventory[partId] || 0,

      // === 收藏系統 ===
      toggleFavorite: (partId) => set(state => {
        const favs = [...state.favorites];
        const idx = favs.indexOf(partId);
        if (idx >= 0) favs.splice(idx, 1); else favs.push(partId);
        return { favorites: favs };
      }),
      isFavorite: (partId) => get().favorites.includes(partId),

      // === 匯入/匯出 ===
      exportData: () => {
        const { inventory, favorites, savedDecks } = get();
        const data = { version: 1, exportDate: new Date().toISOString(), inventory, favorites, savedDecks };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `beybladex-king-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click(); URL.revokeObjectURL(url);
      },
      importData: (jsonStr) => {
        try {
          const data = JSON.parse(jsonStr);
          if (!data.inventory || typeof data.inventory !== 'object') throw new Error('無效的武器庫資料');
          set({
            inventory: data.inventory,
            favorites: Array.isArray(data.favorites) ? data.favorites : [],
            savedDecks: Array.isArray(data.savedDecks) ? data.savedDecks : [],
          });
          return { success: true, msg: `匯入成功！共 ${Object.keys(data.inventory).length} 種零件` };
        } catch (e) {
          return { success: false, msg: `匯入失敗：${e.message}` };
        }
      },

      // === 牌組操作 ===
      setSlotPart: (slotKey, partType, partId) => set(state => ({
        currentDeck: { ...state.currentDeck, [slotKey]: { ...state.currentDeck[slotKey], [partType]: partId } }
      })),
      setSlotRole: (slotKey, role) => set(state => ({
        currentDeck: { ...state.currentDeck, [slotKey]: { ...state.currentDeck[slotKey], role } }
      })),
      clearSlot: (slotKey) => set(state => ({
        currentDeck: { ...state.currentDeck, [slotKey]: { blade: null, ratchet: null, bit: null, role: state.currentDeck[slotKey].role } }
      })),
      clearDeck: () => set({
        currentDeck: {
          slot1: { blade: null, ratchet: null, bit: null, role: '先鋒' },
          slot2: { blade: null, ratchet: null, bit: null, role: '中堅' },
          slot3: { blade: null, ratchet: null, bit: null, role: '大將' },
        }
      }),
      saveDeck: (name) => set(state => ({
        savedDecks: [...state.savedDecks, { name, deck: { ...state.currentDeck }, date: new Date().toISOString() }]
      })),
      loadDeck: (index) => set(state => ({ currentDeck: { ...state.savedDecks[index].deck } })),
      deleteSavedDeck: (index) => set(state => ({ savedDecks: state.savedDecks.filter((_, i) => i !== index) })),
      applyRecommendation: (rec) => set({
        currentDeck: {
          slot1: { blade: rec[0].blade, ratchet: rec[0].ratchet, bit: rec[0].bit, role: rec[0].role },
          slot2: { blade: rec[1].blade, ratchet: rec[1].ratchet, bit: rec[1].bit, role: rec[1].role },
          slot3: { blade: rec[2].blade, ratchet: rec[2].ratchet, bit: rec[2].bit, role: rec[2].role },
        }
      }),

      // === 衝突檢測 ===
      getUsedParts: (excludeSlot) => {
        const deck = get().currentDeck;
        const used = new Set();
        Object.entries(deck).forEach(([key, slot]) => {
          if (key !== excludeSlot) {
            if (slot.blade) used.add(slot.blade);
            if (slot.ratchet) used.add(slot.ratchet);
            if (slot.bit) used.add(slot.bit);
          }
        });
        return used;
      },
      isDeckValid: () => {
        const deck = get().currentDeck;
        const allParts = [];
        Object.values(deck).forEach(slot => {
          if (slot.blade) allParts.push(slot.blade);
          if (slot.ratchet) allParts.push(slot.ratchet);
          if (slot.bit) allParts.push(slot.bit);
        });
        const isComplete = allParts.length === 9;
        const isUnique = new Set(allParts).size === allParts.length;
        return { isComplete, isUnique, isValid: isComplete && isUnique };
      },
    }),
    { name: 'beyblade-x-king-storage' }
  )
);

export default useInventoryStore;
