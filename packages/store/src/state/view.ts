import { create } from 'zustand';
import { View } from '@repo/types';

export type ViewValue = View | null | undefined;

interface ViewState {
  view: ViewValue;
  setView: (data: ViewValue) => void;
  clearView: () => void;

  setViewValue: (value: string | null) => void;
  setSubViewValue: (value: string | null) => void;
  setNavbarViewValue: (value: string[] | null) => void;
  setAsideViewValue: (value: string | null) => void;
  setModalViewValue: (value: string | null) => void;
}

export const useStoreView = create<ViewState>((set) => ({
  view: undefined,

  setView: (data) => {
    set({ view: data });
  },

  clearView: () => {
    set({ view: null });
  },

  setViewValue: (value) => {
    set((state) => ({
      view: {
        subView: state.view?.subView ?? null,
        navbarView: state.view?.navbarView ?? null,
        asideView: state.view?.asideView ?? null,
        modalView: state.view?.modalView ?? null,
        view: value,
      },
    }));
  },

  setSubViewValue: (value) => {
    set((state) => ({
      view: {
        view: state.view?.view ?? null,
        navbarView: state.view?.navbarView ?? null,
        asideView: state.view?.asideView ?? null,
        modalView: state.view?.modalView ?? null,
        subView: value,
      },
    }));
  },

  setNavbarViewValue: (value) => {
    set((state) => ({
      view: {
        view: state.view?.view ?? null,
        asideView: state.view?.asideView ?? null,
        subView: state.view?.subView ?? null,
        modalView: state.view?.modalView ?? null,
        navbarView: value,
      },
    }));
  },

  setAsideViewValue: (value) => {
    set((state) => ({
      view: {
        view: state.view?.view ?? null,
        navbarView: state.view?.navbarView ?? null,
        subView: state.view?.subView ?? null,
        modalView: state.view?.modalView ?? null,
        asideView: value,
      },
    }));
  },

  setModalViewValue: (value) => {
    set((state) => ({
      view: {
        view: state.view?.view ?? null,
        navbarView: state.view?.navbarView ?? null,
        subView: state.view?.subView ?? null,
        asideView: state.view?.asideView ?? null,
        modalView: value,
      },
    }));
  },
}));
