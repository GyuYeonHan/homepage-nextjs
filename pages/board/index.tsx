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
      <div className="container">
        <h2 className="text-4xl">게시판</h2>
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
              새 글 쓰기
            </button>
            <table className="table-auto border-2">
              <thead className="table-header-group border-2">
                <tr>
                  <th>게시글번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>최종 수정일</th>
                </tr>
              </thead>
              <tbody className="table-row-group">
                {data?.map((post) => (
                  <tr key={post.id} className="table-row hover:opacity-50">
                    <td className="table-cell">{post.id}</td>
                    <td className="table-cell">
                      <Link href={`/board/${post.id}`}>
                        <a>{post.title}</a>
                      </Link>
                    </td>
                    <td className="table-cell">{post.username}</td>
                    <td className="table-cell">{post.modifiedDate}</td>
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
