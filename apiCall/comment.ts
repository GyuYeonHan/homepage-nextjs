import { BASE_PATH, COMMENT_PATH, POST_PATH } from "./base";

export function fetchCommentLisyByPost(postId: string) {
  return fetch(`${BASE_PATH}/${COMMENT_PATH}/${postId}`).then((res) => res.json());
}