import { create } from 'zustand';

type UserStates = {
  editing: boolean;
};

export type UserStatesValue = UserStates | null | undefined;

interface UserStatesState {
  userStates: UserStatesValue;
  setUserStates: (data: UserStatesValue) => void;
  clearUserStates: () => void;
}

export const useStoreUserStates = create<UserStatesState>((set) => ({
  userStates: undefined,

  setUserStates: (data) => {
    set({ userStates: data });
  },

  clearUserStates: () => {
    set({ userStates: undefined });
  },
}));
