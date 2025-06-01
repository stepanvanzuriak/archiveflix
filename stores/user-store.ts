import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { without } from "lodash";

export type UserState = {
  name: string;
  filter: string[];
  likes: string[];
  introModalShown: boolean;
};

export type UserActions = {
  setName: (name: string) => void;
  addToFilter: (id: string) => void;
  addToLikes: (id: string) => void;
  closeIntroModal: () => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  name: "User",
  filter: [],
  likes: [],
  introModalShown: false,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()(
    persist(
      (set) => ({
        ...initState,
        setName: (name: string) => set(() => ({ name })),
        addToFilter: (id: string) =>
          set((state) => {
            if (state.filter.includes(id)) {
              return {
                filter: without(state.filter, id),
              };
            }

            return {
              filter: [...state.filter, id],
              likes: without(state.likes, id),
            };
          }),
        addToLikes: (id: string) =>
          set((state) => {
            if (state.likes.includes(id)) {
              return { likes: without(state.likes, id) };
            }

            return {
              likes: [...state.likes, id],
              filter: without(state.filter, id),
            };
          }),
        closeIntroModal: () => set(() => ({ introModalShown: true })),
      }),
      { name: "archiveflix-user-storage" },
    ),
  );
};
