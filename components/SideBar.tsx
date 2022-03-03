import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BASE_PATH } from "../apiCall/base";

export default function SideBar() {
  const [username, setUsername] = useState("");
  axios.defaults.withCredentials = true;

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
    <nav className="w-1/4 h-screen bg-sky-500">
      <div className="logo text-center">
        <img src="https://okky.kr/assets/images/okjsp_logo.png" />
      </div>
      {username == "" ? (
        <Link href="/login">
          <a className="text-4xl">로그인</a>
        </Link>
      ) : (
        <div>
          <div>{username}</div>
          <button onClick={callLogoutAPI} className="border-2 bg-white">로그아웃</button>
        </div>
      )}
      <div className="">
        <Link href="/board">
          <a className="text-4xl">게시판</a>
        </Link>
      </div>
    </nav>
  );
}
