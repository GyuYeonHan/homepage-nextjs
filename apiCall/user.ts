import { BASE_PATH, USER_PATH } from "./base";

export function fetchAllUserList() {
  return fetch(`${BASE_PATH}/${USER_PATH}`).then((res) => res.json());
}

export function fetchUser(id: string) {
  return fetch(`${BASE_PATH}/${USER_PATH}/${id}`).then((res) => res.json());
}