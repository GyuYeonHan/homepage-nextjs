const BASE_PATH = "http://127.0.0.1:8080";

export function fetchPostList() {
  return fetch(`${BASE_PATH}/api/post`).then((res) => res.json());
}
