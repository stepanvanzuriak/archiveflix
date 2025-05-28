import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export type UserState = {
  name: string;
  filter: string[];
  introModalShown: boolean;
};

export type UserActions = {
  setName: (name: string) => void;
  addToFilter: (id: string) => void;
  removeFromFilter: (id: string) => void;
  closeIntroModal: () => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  name: "User",
  filter: [],
  introModalShown: false,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()(
    persist(
      (set) => ({
        ...initState,
        setName: (name: string) => set(() => ({ name })),
        addToFilter: (id: string) =>
          set((state) => ({ filter: [...state.filter, id] })),
        removeFromFilter: (id: string) =>
          set((state) => ({
            filter: state.filter.filter((movie) => movie !== id),
          })),
        closeIntroModal: () => set(() => ({ introModalShown: true })),
      }),
      { name: "archiveflix-user-storage" },
    ),
  );
};
