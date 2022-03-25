import { atom } from "recoil";

export const openSidebarState = atom<boolean>({
  key: "sidebar",
  default: false,
});
