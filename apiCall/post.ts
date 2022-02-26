import { BASE_PATH, POST_PATH } from "./base";

export function fetchAllPostList() {
  return fetch(`${BASE_PATH}/${POST_PATH}`).then((res) => res.json());
}

export function fetchPost(id: string) {
  return fetch(`${BASE_PATH}/${POST_PATH}/${id}`).then((res) => res.json());
}