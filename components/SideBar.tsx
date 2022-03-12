import axios from "axios";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { BASE_PATH } from "../apiCall/base";
import { sessionState } from "../atom/session";

export default function SideBar() {
  const [session, setSession] = useRecoilState(sessionState);
  const router = useRouter();
  axios.defaults.withCredentials = true;

  const callLogoutAPI = () => {
    axios
      .post(`${BASE_PATH}/api/auth/logout`)
      .then((res) => {
        if (res) {
          console.log(res);
          setSession("");
          router.push("/");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <nav className="w-1/4 h-screen bg-sky-500">
      <div className="m-2">
        <div className="logo text-center">
          <img src="https://okky.kr/assets/images/okjsp_logo.png" />
        </div>
        {session == "" ? (
          <Link href="/login">
            <a className="text-4xl">로그인</a>
          </Link>
        ) : (
          <div>
            <div>{session}</div>
            <div className="">
              <Link href="/admin">
                <a className="text-2xl">관리자 페이지</a>
              </Link>
            </div>
            <button onClick={callLogoutAPI} className="border-2 bg-white">
              로그아웃
            </button>
          </div>
        )}
        <div className="">
          <Link href="/">
            <a className="text-4xl">홈</a>
          </Link>
        </div>
        <div className="">
          <Link href="/board">
            <a className="text-4xl">게시판</a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
