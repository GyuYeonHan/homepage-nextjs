import { atom } from "recoil";

interface ISession {
  connected: boolean;
  username: null | string;
}

export const sessionState = atom<ISession>({
  key: "session",
  default: { connected: false, username: null },
});
