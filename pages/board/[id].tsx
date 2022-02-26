import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { BASE_PATH, POST_PATH } from "../../apiCall/base";
import { fetchPost } from "../../apiCall/post";

export default function Post({
  postId
}: {
  postId:string
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  const { register, handleSubmit, getValues } = useForm();
  const { isLoading, isError, data:post, error } = useQuery(
    "post",
    () => fetchPost(postId)
  );

  const toBoardHome = () => {
    router.push(`/board`);
  };

  const callPostEditAPI = () => {
    const data = getValues();
    axios
      .put(`${BASE_PATH}/${POST_PATH}/${postId}`, data)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        queryClient.invalidateQueries();
        setEdit(false);
        data.title = data.title;
      })
      .catch((error) => console.log(error));
  };

  const callPostDeleteAPI = () => {
    axios
      .delete(`${BASE_PATH}/${POST_PATH}/${postId}`)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        router.push("/board");
      })
      .catch((error) => console.log(error));
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <div>
        {edit ? (
          <div>
            <form onSubmit={handleSubmit(callPostEditAPI)}>
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
                  수정
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="border-0 rounded w-20 h-10 bg-black hover:bg-red-400 text-white"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="header">
              <h2 className="text-4xl">{post.title}</h2>
              <span>{post.username}</span>
              <div className="float-end">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={toBoardHome}
                >
                  목록
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setEdit(true)}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  id="postDeleteBtn"
                  onClick={callPostDeleteAPI}
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="w-100 mt-2">
              <div>{post.content}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const postId = params.id;

  return {
    props: {
      postId,
    },
  };
};
