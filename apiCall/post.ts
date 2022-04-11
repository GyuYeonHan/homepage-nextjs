import { BASE_PATH, POST_PATH } from "./base";

export function fetchAllAnnouncementPostList() {
  return fetch(`${BASE_PATH}/${POST_PATH}/announcement`).then((res) =>
    res.json()
  );
}

export function fetchAllQuestionPostList() {
  return fetch(`${BASE_PATH}/${POST_PATH}/question`).then((res) => res.json());
}

export function fetchPost(id: string) {
  return fetch(`${BASE_PATH}/${POST_PATH}/${id}`).then((res) => res.json());
}
