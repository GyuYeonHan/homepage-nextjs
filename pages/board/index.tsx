import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { BASE_PATH, POST_PATH } from "../../apiCall/base";
import { fetchAllPostList } from "../../apiCall/post";

export default function Board() {
  const [write, setWrite] = useState(false);
  const { register, handleSubmit, getValues } = useForm();
  const { isLoading, isError, data, error } = useQuery(
    "AllpostList",
    fetchAllPostList
  );
  const queryClient = useQueryClient();

  axios.defaults.withCredentials = true;

  const callPostSaveAPI = () => {
    const formData = getValues();
    axios
      .post(`${BASE_PATH}/${POST_PATH}`, formData)
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
    <>
      <div>
        <Link href="/">
          <a className="text-4xl">
            <br />
            <span>홈</span>
          </a>
        </Link>
        {write ? (
          <div>
            <form onSubmit={handleSubmit(callPostSaveAPI)}>
              <label htmlFor="title">제목</label>
              <input
                id="title"
                className="border-2 border-"
                {...register("title", { required: true })}
              />
              <br />
              <label htmlFor="content">내용</label>
              <input
                id="content"
                className="border-2"
                {...register("content", { required: true })}
              />
              <hr />
              <div className="my-2">
                <button className="border-0 rounded w-20 h-10 bg-black hover:bg-red-400 text-white">
                  작성
                </button>
                <button
                  onClick={() => setWrite(false)}
                  className="border-0 rounded w-20 h-10 bg-black hover:bg-red-400 text-white"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <button onClick={() => setWrite(true)}>글쓰기</button>
            <table className="table table-hover">
              <thead className="thead-strong">
                <tr>
                  <th>게시글번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>최종 수정일</th>
                </tr>
              </thead>
              <tbody id="tbody">
                {data?.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>
                      <Link href={`/board/${post.id}`}>
                        <a>{post.title}</a>
                      </Link>
                    </td>
                    <td>{post.username}</td>
                    <td>{post.modifiedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}
