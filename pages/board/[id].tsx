import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { BASE_PATH, COMMENT_PATH, POST_PATH } from "../../apiCall/base";
import { fetchPost } from "../../apiCall/post";
import {
  Button,
  ButtonGroup,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from "@mui/icons-material/List";
import ClearIcon from "@mui/icons-material/Clear";
import { Box } from "@mui/system";

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
          <Box
            sx={{
              width: 600,
            }}
          >
            <Box>
              <Typography variant="h3" component="span">
                {data.post.title}
              </Typography>
              <Typography component="span" align="right">
                {data.post.username}
              </Typography>
              <ButtonGroup
                variant="contained"
                aria-label="contained primary button group"
                size="small"
                color="primary"
                sx={{
                  float: "right",
                }}
              >
                <Button startIcon={<ListIcon />} onClick={toBoardHome}>
                  목록
                </Button>
                <Button startIcon={<EditIcon />} onClick={() => setEdit(true)}>
                  수정
                </Button>
                <Button startIcon={<DeleteIcon />} onClick={callPostDeleteAPI}>
                  삭제
                </Button>
              </ButtonGroup>
            </Box>
            <Divider />
            <Box sx={{ width: 300, height: 100, my: 2 }}>
              {data.post.content}
            </Box>
            <Divider />
            <Box sx={{ width: 300, height: 200, my: 2 }}>
              <Typography>댓글 ({data.commentList.length})</Typography>
              {data.commentList.map((comment) => (
                <Box key={comment.id}>
                    <span className="font-bold inline">
                      {comment.username}{" "}
                    </span>
                    <span className="">{comment.modifiedDate} </span>
                    <IconButton
                      onClick={() => callCommentDeleteAPI(comment.id + "")}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Typography component="p">{comment.content} </Typography>
                </Box>
              ))}
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
            </Box>
          </Box>
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
