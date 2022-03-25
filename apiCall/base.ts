export const BASE_PATH =
  typeof window !== "undefined" && window.location.hostname == "localhost"
    ? "http://localhost:8080"
    : "https://projects.yongcademy.kro.kr:8443";

export const POST_PATH = "api/post";
export const COMMENT_PATH = "api/comment";
export const USER_PATH = "api/user";
export const AUTH_PATH = "api/auth";
