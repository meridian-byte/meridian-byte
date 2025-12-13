export type AppShellChild = {
  navbar: boolean;
  aside: boolean;
};

export type AppShell = {
  navbar: boolean;
  aside: boolean;
  child: AppShellChild;
};
