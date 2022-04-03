import { BASE_PATH, NOTICE_PATH } from "./base";

export function fetchAllNoticeOfUser(userId: string) {
  return fetch(`${BASE_PATH}/${NOTICE_PATH}/${userId}/all`).then((res) =>
    res.json()
  );
}

export function fetchUnreadNoticeOfUser(userId: string) {
  return fetch(`${BASE_PATH}/${NOTICE_PATH}/${userId}/unread`).then((res) =>
    res.json()
  );
}
