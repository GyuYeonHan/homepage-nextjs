import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { BASE_PATH } from "../../apiCall/base";
import { sessionState } from "../../atom/session";

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, getValues } = useForm();
  const setSession = useSetRecoilState(sessionState);

  axios.defaults.withCredentials = true;

  const onValid = () => {
    const data = getValues();
    axios
      .post(`${BASE_PATH}/api/auth/login`, data)
      .then((res) => {
        if (res) {
          const username = res.data.user.username;
          setSession(username);
        }
      })
      .catch();

    router.push(`/`);
  };

  const toHome = () => {
    router.push(`/`);
  };

  return (
    <div className="">
      <div className="text-2xl mb-3">로그인 페이지</div>
      <form onSubmit={handleSubmit(onValid)}>
        <label htmlFor="login-id">로그인 아이디</label>
        <input
          id="login-id"
          className="border-2 border-"
          {...register("loginId", { required: true })}
        />
        <br />
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          className="border-2"
          {...register("password", { required: true })}
        />
        <hr />
        <div className="my-2">
          <button className="border-0 rounded w-20 h-10 bg-black hover:bg-red-400 text-white">
            로그인
          </button>
          <button
            className="border-0 rounded w-20 h-10 bg-black hover:bg-red-400 text-white"
            onClick={toHome}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
