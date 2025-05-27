import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export type UserState = {
  name: string;
  filter: string[];
};

export type UserActions = {
  setName: (name: string) => void;
  addToFilter: (id: string) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  name: "User",
  filter: [],
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()(
    persist(
      (set) => ({
        ...initState,
        setName: (name: string) => set(() => ({ name })),
        addToFilter: (id: string) =>
          set((state) => ({ filter: [...state.filter, id] })),
      }),
      { name: "archiveflix-user-storage" },
    ),
  );
};
