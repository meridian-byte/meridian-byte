import { create } from 'zustand';

type UserStates = {
  editing: boolean;
};

export type UserStatesValue = UserStates | null | undefined;

interface UserStatesState {
  userStates: UserStatesValue;
  toggleUserStateEditing: () => void;
  setUserStates: (data: UserStatesValue) => void;
  clearUserStates: () => void;
}

export const useStoreUserStates = create<UserStatesState>((set) => ({
  userStates: undefined,

  toggleUserStateEditing: () => {
    set((state) => ({
      userStates: !state.userStates
        ? undefined
        : {
            ...state.userStates,
            editing: !state.userStates.editing,
          },
    }));
  },

  setUserStates: (data) => {
    set({ userStates: data });
  },

  clearUserStates: () => {
    set({ userStates: undefined });
  },
}));
