import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { BASE_PATH, COMMENT_PATH, POST_PATH } from "../../apiCall/base";
import { fetchPost } from "../../apiCall/post";

export default function Post({ postId }: { postId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  const {
    register: pRegister,
    handleSubmit: pHandleSubmit,
    getValues: pGetValues,
  } = useForm();
  const {
    register: cRegister,
    handleSubmit: cHandleSubmit,
    getValues: cGetValues,
    setValue: cSetValue,
  } = useForm();
  const { isLoading, isError, isSuccess, data, error } = useQuery("post", () =>
    fetchPost(postId)
  );

  const toBoardHome = () => {
    router.push(`/board`);
  };

  axios.defaults.withCredentials = true;

  const callPostEditAPI = () => {
    const formData = pGetValues();
    axios
      .put(`${BASE_PATH}/${POST_PATH}/${postId}`, formData)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        queryClient.invalidateQueries();
        setEdit(false);
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

  const callCommentSaveAPI = (postId) => {
    const formData = cGetValues();
    console.log(formData);
    axios
      .post(`${BASE_PATH}/${COMMENT_PATH}/post/${postId}`, formData)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        cSetValue("content", "");
        queryClient.invalidateQueries();
      })
      .catch((error) => console.log(error));
  };

  const callCommentDeleteAPI = (commentId: String) => {
    axios
      .delete(`${BASE_PATH}/${COMMENT_PATH}/${commentId}`)
      .then((res) => {
        if (res) {
          console.log(res);
        }
        queryClient.invalidateQueries();
      })
      .catch((error) => console.log(error));
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div>
      <div>
        {edit ? (
          <div>
            <form onSubmit={pHandleSubmit(callPostEditAPI)}>
              <label htmlFor="post-title">제목</label>
              <br />
              <input
                id="post-title"
                className="border-2"
                value={data.post.title}
                {...pRegister("title", { required: true })}
              />
              <br />
              <label htmlFor="post-content">내용</label>
              <br />
              <textarea
                id="post-content"
                className="border-2"
                value={data.post.content}
                {...pRegister("content", { required: true })}
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
              <h2 className="text-4xl inline-block">{data.post.title}</h2>
              <span className="ml-1">{data.post.username}</span>
              <span className="ml-80">
                  <button
                    type="button"
                    className="border-2 w-12 h-7"
                    onClick={toBoardHome}
                  >
                    목록
                  </button>
                  <button
                    type="button"
                    className="border-2 w-12 h-7"
                    onClick={() => setEdit(true)}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="border-2 w-12 h-7"
                    id="postDeleteBtn"
                    onClick={callPostDeleteAPI}
                  >
                    삭제
                  </button>
              </span>
            </div>
            <div className="w-100 my-2">
              <div>{data.post.content}</div>
            </div>
            <hr />
            <div className="mt-2">
              <div>댓글 ({data.commentList.length})</div>
              {data.commentList.map((comment) => (
                <div key={comment.id}>
                  <div>
                    <span>{comment.content} </span>
                    <span>{comment.username} </span>
                    <button
                      onClick={() => callCommentDeleteAPI(comment.id + "")}
                      className="border rounded w-12 h-7"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              <hr />
              <div className="mt-2">
                <form
                  onSubmit={cHandleSubmit(() => callCommentSaveAPI(postId))}
                >
                  <label htmlFor="comment-content"></label>
                  <input
                    id="comment-content"
                    className="border-2"
                    {...cRegister("content", { required: true })}
                  />
                  <button className="border-0 rounded w-11 h-7 bg-black hover:bg-red-400 text-white">
                    작성
                  </button>
                </form>
              </div>
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
