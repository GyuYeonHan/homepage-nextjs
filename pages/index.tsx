import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BASE_PATH } from "../apiCall/base";

export default function Home() {
  const [username, setUsername] = useState("");

  const getSession = () => {
    axios
      .get(`${BASE_PATH}/api/auth/session`)
      .then((res) => {
        if (res) {
          if (res.data.loggedIn) {
            setUsername(res.data.username);
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const callLogoutAPI = () => {
    axios
      .post(`${BASE_PATH}/api/auth/logout`)
      .then((res) => {
        if (res) {
          console.log(res);
          setUsername("");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(getSession, [username]);

  return (
    <>
      <div>
        <div>
          {username != "" ? (
            <div>
              <span>안녕하세요 {username} 님!</span>
              <br />
              <button onClick={callLogoutAPI}>로그아웃</button>
            </div>
          ) : (
            <div>
              <span>홈페이지 입니다.</span>
            </div>
          )}
        </div>
        <Link href="/board">
          <a className="text-4xl">게시판</a>
        </Link>
        {username == "" ? (
          <Link href="/login">
            <a className="text-4xl">로그인</a>
          </Link>
        ) : null}
      </div>
    </>
  );
}
