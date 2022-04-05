import { atom } from "recoil";

export enum SESSION_STATUS {
  INITIAL,
  NOSESSION,
  PRECONNECTED,
  CONNECTED,
}

interface ISession {
  status: SESSION_STATUS;
  username: null | string;
  userId: null | string;
}

export const sessionState = atom<ISession>({
  key: "session",
  default: { status: SESSION_STATUS.INITIAL, username: null, userId: null },
});
