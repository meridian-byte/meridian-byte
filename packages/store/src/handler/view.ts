import { APP_NAMES_ATLAS, ASIDE_VIEW_NAMES, MODAL_VIEW_NAMES } from '@repo/constants';
import { useStoreView } from '../state/view';

export const useView = () => {
  const viewValue = useStoreView((s) => s.view?.view);
  const view = useStoreView((s) => s.view);
  const setView = useStoreView((s) => s.setView);

  const showViewPave = () => {
    if (!view) return;

    if (viewValue != APP_NAMES_ATLAS.PAVE || view.subView != null) {
      setView({ ...view, subView: null, view: APP_NAMES_ATLAS.PAVE });
    }
  };

  const showViewJot = () => {
    if (!view) return;

    if (viewValue != APP_NAMES_ATLAS.JOT || view.subView != null) {
      setView({ ...view, subView: null, view: APP_NAMES_ATLAS.JOT });
    }
  };

  const showViewStride = () => {
    if (!view) return;

    if (viewValue != APP_NAMES_ATLAS.STRIDE || view.subView != null) {
      setView({ ...view, subView: null, view: APP_NAMES_ATLAS.STRIDE });
    }
  };

  const showViewPrime = () => {
    if (!view) return;

    if (viewValue != APP_NAMES_ATLAS.PRIME || view.subView != null) {
      setView({ ...view, subView: null, view: APP_NAMES_ATLAS.PRIME });
    }
  };

  const showViewTally = () => {
    if (!view) return;

    if (viewValue != APP_NAMES_ATLAS.TALLY || view.subView != null) {
      setView({ ...view, subView: null, view: APP_NAMES_ATLAS.TALLY });
    }
  };

  return {
    viewValue,
    showViewPave,
    showViewJot,
    showViewStride,
    showViewPrime,
    showViewTally,
  };
};

export const useSubView = () => {
  const viewValue = useStoreView((s) => s.view?.view);
  const subViewValue = useStoreView((s) => s.view?.subView);
  const view = useStoreView((s) => s.view);
  const setView = useStoreView((s) => s.setView);

  const showSubViewPave = (v: string) => {
    if (!view) return;

    if (subViewValue != v) {
      setView({
        ...view,
        view: viewValue == APP_NAMES_ATLAS.PAVE ? view.view : APP_NAMES_ATLAS.PAVE,
        subView: v,
      });
    }
  };

  const showSubViewJot = (v: string) => {
    if (!view) return;

    if (subViewValue != v) {
      setView({
        ...view,
        view: viewValue == APP_NAMES_ATLAS.JOT ? view.view : APP_NAMES_ATLAS.JOT,
        subView: v,
      });
    }
  };

  const showSubViewStride = (v: string) => {
    if (!view) return;

    if (subViewValue != v) {
      setView({
        ...view,
        view: viewValue == APP_NAMES_ATLAS.STRIDE ? view.view : APP_NAMES_ATLAS.STRIDE,
        subView: v,
      });
    }
  };

  const showSubViewPrime = () => {};

  const showSubViewTally = () => {};

  return {
    viewValue,
    subViewValue,
    showSubViewPave,
    showSubViewJot,
    showSubViewStride,
    showSubViewPrime,
    showSubViewTally,
  };
};

export const useViewNavbar = () => {
  const navbarViewValue = useStoreView((s) => s.view?.navbarView);
  const setNavbarViewValue = useStoreView((s) => s.setNavbarViewValue);

  let workingValue = navbarViewValue || [];

  const showNavbarViewPave = (v: string) => {
    if (!workingValue.includes(v)) {
      setNavbarViewValue([...workingValue, v || APP_NAMES_ATLAS.PAVE]);
    }
  };

  const showNavbarViewJot = (v: string) => {
    if (!workingValue.includes(v)) {
      setNavbarViewValue([...workingValue, v || APP_NAMES_ATLAS.JOT]);
    }
  };

  const showNavbarViewStride = (v: string) => {
    if (!workingValue.includes(v)) {
      setNavbarViewValue([...workingValue, v || APP_NAMES_ATLAS.STRIDE]);
    }
  };

  return {
    navbarViewValue,
    setNavbarViewValue,
    showNavbarViewPave,
    showNavbarViewJot,
    showNavbarViewStride,
  };
};

export const useViewAside = () => {
  const asideViewValue = useStoreView((s) => s.view?.asideView);
  const setAsideViewValue = useStoreView((s) => s.setAsideViewValue);

  const showAsideViewPave = (v: string) => {
    if (asideViewValue != v) {
      setAsideViewValue(v || ASIDE_VIEW_NAMES.NEW.PAVE.EVENT);
    }
  };

  const showAsideViewJot = (v: string) => {
    if (asideViewValue != v) {
      setAsideViewValue(v || ASIDE_VIEW_NAMES.NEW.JOT.NOTE);
    }
  };

  const showAsideViewStride = (v: string) => {
    if (asideViewValue != v) {
      setAsideViewValue(v || ASIDE_VIEW_NAMES.NEW.STRIDE.TASK);
    }
  };

  return {
    asideViewValue,
    setAsideViewValue,
    showAsideViewPave,
    showAsideViewJot,
    showAsideViewStride,
  };
};

export const useViewModal = () => {
  const modalViewValue = useStoreView((s) => s.view?.modalView);
  const setModalViewValue = useStoreView((s) => s.setModalViewValue);

  // handle modal search open
  const showModalViewSearch = () => {
    if (modalViewValue != MODAL_VIEW_NAMES.SEARCH) {
      setModalViewValue(MODAL_VIEW_NAMES.SEARCH);
    }
  };

  // handle modal calendar crud open
  const showModalViewCalendarCrud = (calendarId: string, action: string) => {
    if (!modalViewValue?.includes(action)) {
      setModalViewValue(`${action}-${calendarId}`);
    }
  };

  // handle modal task list crud open
  const showModalViewTaskListCrud = (taskListId: string, action: string) => {
    if (!modalViewValue?.includes(action)) {
      setModalViewValue(`${action}-${taskListId}`);
    }
  };

  // handle modal task crud open
  const showModalViewTaskCrud = (taskId: string, action: string) => {
    if (!modalViewValue?.includes(action)) {
      setModalViewValue(`${action}-${taskId}`);
    }
  };

  // handle modal close
  const closeModalView = () => {
    if (modalViewValue) {
      setModalViewValue(null);
    }
  };

  return {
    modalViewValue,
    setModalViewValue,
    showModalViewSearch,
    showModalViewCalendarCrud,
    showModalViewTaskListCrud,
    showModalViewTaskCrud,
    closeModalView,
  };
};
