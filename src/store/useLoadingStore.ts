import { create } from "zustand";

interface LoadingState {
  isFetched: boolean; // ✅ 데이터가 한 번이라도 성공적으로 fetch되었는지
  isLoading: boolean; // 전역 로딩 상태 (현재 활성 로딩 중인지)
  showLoading: () => void;
  hideLoading: () => void;
  setIsFetched: (value: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isFetched: false,
  isLoading: false,
  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false }),
  setIsFetched: (value) => set({ isFetched: value }),
}));
