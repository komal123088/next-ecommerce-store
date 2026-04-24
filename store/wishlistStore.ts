import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) =>
        set((state) => ({ items: [...new Set([...state.items, productId])] })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),
      toggle: (productId) => {
        if (get().isWishlisted(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },
      isWishlisted: (productId) => get().items.includes(productId),
    }),
    { name: "wishlist-storage" },
  ),
);
