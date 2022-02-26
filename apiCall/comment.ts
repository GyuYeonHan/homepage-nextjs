import { BASE_PATH, COMMENT_PATH, POST_PATH } from "./base";

export function fetchAllPostList() {
  return fetch(`${BASE_PATH}/${POST_PATH}`).then((res) => res.json());
}

export function fetchCommentLisyByPost(postId: string) {
  return fetch(`${BASE_PATH}/${COMMENT_PATH}/${id}`).then((res) => res.json());
}