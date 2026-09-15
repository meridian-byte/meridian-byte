export type View = {
  view: string | null;
  subView: string | null;

  navbarView: string[] | null;
  asideView: string | null;

  tabsJotView: { tab: string; persistent: boolean }[];

  modalView: string | null;
};
