import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { BASE_PATH, USER_PATH } from "../../../apiCall/base";
import { fetchAllUserList } from "../../../apiCall/user";

export default function User() {
  const [write, setWrite] = useState(false);
  const { register, handleSubmit, getValues } = useForm();
  const { isLoading, isError, data, error } = useQuery(
    "AllUserList",
    fetchAllUserList
  );
  const queryClient = useQueryClient();

  axios.defaults.withCredentials = true;

  const callUserSaveAPI = () => {
    const formData = getValues();
    axios
      .post(`${BASE_PATH}/${USER_PATH}`, formData)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        setWrite(false);
        queryClient.invalidateQueries();
      })
      .catch((error) => console.log(error));
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div className="container w-screen h-full">
      <div className="">유저 관리 페이지 입니다.</div>
      <div className="container">
        <h2 className="text-4xl">유저 관리</h2>
        {write ? (
          <div>
            <form onSubmit={handleSubmit(callUserSaveAPI)}>
              <label htmlFor="username">이름</label>
              <input
                id="username"
                className="border-2 border-"
                type="text"
                {...register("username", { required: true })}
              />
              <br />
              <label htmlFor="loginId">아이디</label>
              <input
                id="loginId"
                className="border-2 border-"
                type="text"
                {...register("loginId", { required: true })}
              />
              <br />
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                className="border-2 border-"
                type="password"
                {...register("password", { required: true })}
              />
              <br />
              <label htmlFor="role">권한</label>
              <select
                id="role"
                className="border-2"
                {...register("role", { required: true })}
              >
                <option value="ROLE_USER">일반 사용자</option>
                <option value="ROLE_STUDENT">학생</option>
                <option value="ROLE_TEACHER">선생님</option>
                <option value="ROLE_ADMIN">관리자</option>
              </select>
              <hr />
              <div className="my-2">
                <button className="border-0 rounded w-20 h-10 bg-black hover:bg-red-400 text-white">
                  추가
                </button>
                <button
                  onClick={() => setWrite(false)}
                  className="border-2 rounded w-20 h-10 bg-white hover:bg-white/70 text-black"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <button
              className="border-0 rounded w-24 h-8 bg-lime-600/80 hover:bg-lime-600 text-white"
              onClick={() => setWrite(true)}
            >
              유저 추가
            </button>
            <table className="table-auto border-2">
              <thead className="table-header-group border-2">
                <tr>
                  <th>유저 번호</th>
                  <th>이름</th>
                  <th>권한</th>
                  <th>가입일</th>
                </tr>
              </thead>
              <tbody className="table-row-group">
                {data?.map((user) => (
                  <tr key={user.id} className="table-row hover:opacity-50">
                    <td className="table-cell">{user.id}</td>
                    <td className="table-cell">
                      <Link href={`/user/${user.id}`}>
                        <a>{user.username}</a>
                      </Link>
                    </td>
                    <td className="table-cell">{user.role}</td>
                    <td className="table-cell">{user.createdDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
