import { create } from "zustand";

interface CryptoStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const useCryptoStore = create<CryptoStore>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));

export default useCryptoStore;
