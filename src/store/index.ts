import { create } from 'zustand'
import { User } from '../types/user';

type Store = {
  authUser: User | null;
  requestLoading: boolean;
  setAuthUser: (user: User | null) => void;
  setRequestLoading: (isLoading: boolean) => void;
};

const useStore = create<Store>((set) => ({
  authUser: null,
  requestLoading: false,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
  setRequestLoading: (isLoading) =>
    set((state) => ({ ...state, requestLoading: isLoading })),
}));

export default useStore;
