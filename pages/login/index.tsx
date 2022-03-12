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
    <div className="border-2 p-2 h-60 flex justify-center">
      <div className="w-full flex flex-col justify-center items-center">
        <div className="text-2xl mb-3">로그인 페이지</div>
        <form className="w-full" onSubmit={handleSubmit(onValid)}>
          <input
            id="login-id"
            className="border-2 rounded w-3/4 h-10 mx-auto"
            placeholder="아이디"
            type="text"
            {...register("loginId", { required: true })}
          />
          <br />
          <input
            id="password"
            className="border-2 rounded w-3/4 h-10 mx-auto"
            placeholder="비밀번호"
            type="password"
            {...register("password", { required: true })}
          />
          <div className="my-3 w-full h-10">
            <button className="border-0 rounded w-full h-full bg-sky-600/80 hover:bg-sky-600 text-white">
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
